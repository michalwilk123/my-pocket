// API service for backend communication

interface SaveLinkParams {
  title: string;
  url: string;
  note: string;
  tags: string[];
}

export async function saveLink(params: SaveLinkParams): Promise<void> {
  const result = await chrome.storage.local.get(['session']);

  if (!result.session) {
    throw new Error('Not authenticated');
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const response = await fetch(`${apiUrl}/api/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${result.session.access_token}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to save link' }));
    throw new Error(errorData.error || 'Failed to save link');
  }
}

