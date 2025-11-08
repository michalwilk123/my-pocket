// UI rendering layer

import { AppState } from './state';

const html = (text: string) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export function render(state: AppState): string {
  const { user, pageInfo, tags } = state;

  if (!user) {
    return `
      <div class="auth-prompt">
        <div class="auth-title">Welcome to My Pocket</div>
        <div class="auth-description">Sign in with Google to sync your links</div>
        <button id="sign-in-btn" class="sign-in-btn">Sign in with Google</button>
      </div>
    `;
  }

  const displayName = html(user.name || user.email);
  const avatar = user.picture ? `<img src="${html(user.picture)}" alt="${displayName}" class="user-avatar" />` : '';

  return `
    <div class="auth-header">
      <div class="auth-user">
        ${avatar}
        <span class="user-name">${displayName}</span>
        <button id="sign-out-btn" class="sign-out-btn">Sign out</button>
      </div>
    </div>
    <div class="page-info">
      <div class="page-title">${html(pageInfo?.title || '')}</div>
      <div class="page-url">${html(pageInfo?.url || '')}</div>
    </div>
    <div class="divider"></div>
    <div class="tags-section">
      <label class="tags-label">Tags</label>
      <div id="tags-container" class="tags-container">
        ${tags.map(tag => `
          <div class="tag-chip">
            <span>#${html(tag.label)}</span>
            <button class="tag-remove" data-tag-id="${html(tag.id)}" aria-label="Remove tag ${html(tag.label)}">×</button>
          </div>
        `).join('')}
      </div>
      <div class="tag-input-container">
        <input type="text" id="tag-input" class="tag-input" placeholder="Add a tag..." aria-label="Tag input" />
        <button id="add-tag-btn" class="add-tag-btn">Add</button>
      </div>
    </div>
    <div class="divider"></div>
    <button id="save-btn" class="save-btn">Save to My Pocket</button>
  `;
}

export function updateTags(tags: AppState['tags']): void {
  const container = document.getElementById('tags-container');
  if (container) {
    container.innerHTML = tags.map(tag => `
      <div class="tag-chip">
        <span>#${html(tag.label)}</span>
        <button class="tag-remove" data-tag-id="${html(tag.id)}" aria-label="Remove tag ${html(tag.label)}">×</button>
      </div>
    `).join('');
  }
}

export function setSaveButton(state: 'idle' | 'saving' | 'saved' | 'error'): void {
  const btn = document.getElementById('save-btn') as HTMLButtonElement | null;
  if (!btn) return;

  const states = {
    saving: { text: 'Saving...', disabled: true },
    saved: { text: 'Saved!', disabled: true },
    error: { text: 'Failed - Retry', disabled: false },
    idle: { text: 'Save to My Pocket', disabled: false },
  };

  const { text, disabled } = states[state];
  btn.textContent = text;
  btn.disabled = disabled;
}

