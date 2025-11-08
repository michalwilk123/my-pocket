import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'My Pocket',
    description: 'A focused space to store, revisit, and organize your favorite links',
    permissions: ['identity', 'identity.email', 'storage', 'tabs'],
    oauth2: {
      client_id: '794061701139-8bv5end0m57e3dkocv04omhapen4gnqb.apps.googleusercontent.com',
      scopes: ['openid', 'email', 'profile'],
    },
  },
  vite: () => ({
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    },
  }),
});
