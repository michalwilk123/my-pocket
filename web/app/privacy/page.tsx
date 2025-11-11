export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4 text-sm text-gray-600">Last updated: 11.11.2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Data Collection</h2>
        <p className="mb-2">My Pocket collects and stores:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Links you save (URLs, titles, tags)</li>
          <li>Tags you create and assign to links</li>
          <li>Authentication information (email address)</li>
          <li>Session data for maintaining login state</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">How We Use Your Data</h2>
        <p className="mb-2">Your data is used to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide the core functionality of saving and organizing links</li>
          <li>Maintain your user account and preferences</li>
          <li>Enable searching and filtering of your saved content</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Data Sharing</h2>
        <p className="mb-4">
          We do not sell, trade, or share your personal data with third parties.
          Your data is stored securely and is only accessible by you through your authenticated account.
        </p>
        <p className="mb-2">Third-party services used:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Supabase - Database and authentication provider</li>
          <li>Vercel - Hosting provider</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your data from unauthorized access,
          alteration, or deletion. All data transmission is encrypted using HTTPS.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
        <p className="mb-2">You have the right to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access your stored data</li>
          <li>Delete your data and account at any time. The deletion is permanent and cannot be undone.</li>
          <li>Export your data</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Contact</h2>
        <p className="mb-4">
          For privacy-related questions or requests, contact me at: michalwilk139@gmail.com
        </p>
      </section>
    </div>
  );
}
