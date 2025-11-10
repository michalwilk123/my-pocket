# My Pocket

A simple URL bookmark project with a web application and browser extension. Save, organize, and access your links across all devices with tagging, search.


Should be available i think in:
- https://my-pocket.micwilk.com/
- https://my-pocket-eight.vercel.app/
- LINK TO FIREFOX EXTENSION
- LINK TO CHROME EXTENSION


## Technologies

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Browser Extension**: WXT Framework
- **Internationalization**: next-intl
- **State Management**: Zustand
- **UI Components**: Storybook
- **Package Managers**: pnpm (web), bun (extension)


### What to setup in supabase:

1) Create new database through vercel

2) Add a google OAuth provider

Go to `Authentication` -> `Sign in / Providers` -> `Auth Providers`

[Screenshot of the google OAuth provider setup](./screenshots/auth-provider.png)

3) Create the database schema

Go to `Sql Editor`. In the text area, paste the content of `supabase-schema.sql` and click `Run`.

4) Setup auth redirects for the web app and extensions (firefox + chrome)

[Screenshot of the auth redirects setup](./screenshots/redirects-urls.png)

to get the link, use:

### For firefox:
```javascript
browser.identity.getRedirectURL()
```

### For chrome:
```javascript
chrome.identity.getRedirectURL()
```
