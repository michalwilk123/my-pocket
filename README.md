# My Pocket

A simple URL bookmark project with a web application and browser extension. Save, organize, and access your links across all devices with tagging, search. The application interface is available in 2 languages: English and Polish.

You can import / export bookmarks from old pocket app and instapaper app.

If you decide to go delete your account, you can export your bookmarks as a CSV file (pocket format)

Should be available i think in:
- https://mypocket.micwilk.com/
- https://my-pocket-eight.vercel.app/
- https://addons.mozilla.org/en-US/firefox/addon/mypocket
- https://chromewebstore.google.com/detail/kflelijdooijaedkdcfacheeenkmbagj


## Technologies

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, DaisyUI, Zustand
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Browser Extension**: WXT Framework
- **Package Managers**: bun

## Demo

### Main page

![Main page with saved links](./screenshots/main-page.jpg)

### Non authorized view

![Non authorized view](./extension/screenshots/non-authorized-view.png)

### Import / Export

![Profile modal with import/export options](./screenshots/profile-modal.jpg)

### Extension

#### Saving a link

![Extension - saving a link](./extension/screenshots/extension-save-link.png)

#### Sign in with Google

![Extension - sign in](./extension/screenshots/extension-sign-in.png)

### Edit link

![Edit link modal](./screenshots/edit-link.jpg)

## What to setup in supabase:

1) Create new database through vercel

2) Add a google OAuth provider

Go to `Authentication` -> `Sign in / Providers` -> `Auth Providers`

![Screenshot of the google OAuth provider setup](./screenshots/auth-provider.png)

3) Create the database schema

Go to `Sql Editor`. In the text area, paste the content of `supabase-schema.sql` and click `Run`.

4) Setup auth redirects for the web app and extensions (firefox + chrome)

![Screenshot of the auth redirects setup](./screenshots/redirect-urls.png)

to get the link, use:

### For firefox:
```javascript
browser.identity.getRedirectURL()
```

### For chrome:
```javascript
chrome.identity.getRedirectURL()
```
