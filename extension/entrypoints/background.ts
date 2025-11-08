import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const redirectURL = chrome.identity.getRedirectURL();

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

  const responseUrl = await chrome.identity.launchWebAuthFlow({
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

  await chrome.storage.local.set({
    userInfo,
    session: sessionData.session,
  });

  return userInfo;
}

async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  await chrome.storage.local.remove(['userInfo', 'session']);
}

async function restoreSession(): Promise<UserInfo | null> {
  const result = await chrome.storage.local.get(['session', 'userInfo']);

  if (!result.session) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession(result.session);

  if (error || !data.session) {
    await chrome.storage.local.remove(['userInfo', 'session']);
    return null;
  }

  return result.userInfo || null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
