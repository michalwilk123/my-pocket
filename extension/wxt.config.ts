import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'My Pocket',
    description: 'A focused space to store, revisit, and organize your favorite links',
    permissions: ['identity', 'storage', 'tabs'],
    host_permissions: ['https://mypocket.micwilk.com/*'],
    browser_specific_settings: {
      gecko: {
        data_collection_permissions: {
          required: [
            'authenticationInfo',
            'websiteContent',
            'bookmarksInfo',
          ],
          optional: [
            'technicalAndInteraction',
          ],
        },
      },
    },
  },
  vite: () => ({
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    },
  }),
});
