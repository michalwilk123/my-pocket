import { browser } from 'wxt/browser';

interface SaveLinkParams {
  title: string;
  url: string;
  note: string;
  tags: string[];
}

export async function saveLink(params: SaveLinkParams): Promise<void> {
  const result = await browser.storage.local.get(['session']);

  if (!result.session) {
    throw new Error('Not authenticated');
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${result.session.access_token}`,
  };
  const body = JSON.stringify(params);

  try {
    const response = await fetch(`${apiUrl}/api/links`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Failed to save link' };
      }

      throw new Error(errorData.error || 'Failed to save link');
    }
  } catch (error) {
    throw error;
  }
}

