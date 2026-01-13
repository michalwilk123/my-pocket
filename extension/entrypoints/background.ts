import { createClient } from '@supabase/supabase-js';
import { browser } from 'wxt/browser';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Custom storage adapter using browser.storage.local for persistent extension storage
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: async (key) => {
        const result = await browser.storage.local.get(key);
        return result[key] ?? null;
      },
      setItem: async (key, value) => {
        await browser.storage.local.set({ [key]: value });
      },
      removeItem: async (key) => {
        await browser.storage.local.remove(key);
      },
    },
    autoRefreshToken: true,
    persistSession: true,
  },
});

export default defineBackground(() => {
  console.log('Background script started');
});

interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

async function signIn(): Promise<UserInfo> {
  const redirectURL = browser.identity.getRedirectURL();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectURL,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error('No auth URL');
  }

  const responseUrl = await browser.identity.launchWebAuthFlow({
    url: data.url,
    interactive: true,
  });

  if (!responseUrl) {
    throw new Error('No response URL');
  }

  const urlParts = responseUrl.split('#');
  const params = new URLSearchParams(urlParts[1]);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken) {
    throw new Error('No access token');
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken || '',
  });

  if (sessionError) {
    throw sessionError;
  }

  const user = sessionData.user;
  if (!user) {
    throw new Error('No user data');
  }

  const userInfo: UserInfo = {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata.full_name || user.user_metadata.name || user.email || '',
    picture: user.user_metadata.avatar_url || user.user_metadata.picture || '',
  };

  await browser.storage.local.set({
    userInfo,
    session: sessionData.session,
  });

  return userInfo;
}

async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  await browser.storage.local.remove(['userInfo', 'session']);
}

async function restoreSession(): Promise<UserInfo | null> {
  const result = await browser.storage.local.get(['session', 'userInfo']);

  if (!result.session) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession(result.session);

  if (error || !data.session) {
    await browser.storage.local.remove(['userInfo', 'session']);
    return null;
  }

  // Persist the potentially refreshed session tokens
  if (data.session.access_token !== result.session.access_token) {
    await browser.storage.local.set({ session: data.session });
  }

  return result.userInfo || null;
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'signIn') {
    signIn()
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }

  if (request.action === 'signOut') {
    signOut()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }

  if (request.action === 'getUserInfo') {
    restoreSession()
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
});
