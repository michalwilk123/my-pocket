// UI rendering layer

import { AppState } from './state';

const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export function render(state: AppState): HTMLElement {
  const { user, pageInfo, tags } = state;

  const root = document.createElement('div');

  if (!user) {
    const authPrompt = document.createElement('div');
    authPrompt.className = 'auth-prompt';

    const title = document.createElement('div');
    title.className = 'auth-title';
    title.textContent = 'Welcome to My Pocket';

    const description = document.createElement('div');
    description.className = 'auth-description';
    description.textContent = 'Sign in with Google to sync your links';

    const signInBtn = document.createElement('button');
    signInBtn.id = 'sign-in-btn';
    signInBtn.className = 'sign-in-btn';
    signInBtn.textContent = 'Sign in with Google';

    authPrompt.appendChild(title);
    authPrompt.appendChild(description);
    authPrompt.appendChild(signInBtn);
    root.appendChild(authPrompt);

    return root;
  }

  const authHeader = document.createElement('div');
  authHeader.className = 'auth-header';

  const authUser = document.createElement('div');
  authUser.className = 'auth-user';

  if (user.picture) {
    const avatar = document.createElement('img');
    avatar.src = user.picture;
    avatar.alt = user.name || user.email;
    avatar.className = 'user-avatar';
    authUser.appendChild(avatar);
  }

  const userName = document.createElement('span');
  userName.className = 'user-name';
  userName.textContent = user.name || user.email;
  authUser.appendChild(userName);

  const signOutBtn = document.createElement('button');
  signOutBtn.id = 'sign-out-btn';
  signOutBtn.className = 'sign-out-btn';
  signOutBtn.textContent = 'Sign out';
  authUser.appendChild(signOutBtn);

  authHeader.appendChild(authUser);
  root.appendChild(authHeader);

  const pageInfoDiv = document.createElement('div');
  pageInfoDiv.className = 'page-info';

  const pageTitle = document.createElement('div');
  pageTitle.className = 'page-title';
  pageTitle.textContent = pageInfo?.title || '';

  const pageUrl = document.createElement('div');
  pageUrl.className = 'page-url';
  pageUrl.textContent = pageInfo?.url || '';

  pageInfoDiv.appendChild(pageTitle);
  pageInfoDiv.appendChild(pageUrl);
  root.appendChild(pageInfoDiv);

  const divider1 = document.createElement('div');
  divider1.className = 'divider';
  root.appendChild(divider1);

  const tagsSection = document.createElement('div');
  tagsSection.className = 'tags-section';

  const tagsLabel = document.createElement('label');
  tagsLabel.className = 'tags-label';
  tagsLabel.textContent = 'Tags';

  const tagsContainer = document.createElement('div');
  tagsContainer.id = 'tags-container';
  tagsContainer.className = 'tags-container';

  tags.forEach(tag => {
    const tagChip = createTagChip(tag);
    tagsContainer.appendChild(tagChip);
  });

  const tagInputContainer = document.createElement('div');
  tagInputContainer.className = 'tag-input-container';

  const tagInput = document.createElement('input');
  tagInput.type = 'text';
  tagInput.id = 'tag-input';
  tagInput.className = 'tag-input';
  tagInput.placeholder = 'Add a tag...';
  tagInput.setAttribute('aria-label', 'Tag input');

  const addTagBtn = document.createElement('button');
  addTagBtn.id = 'add-tag-btn';
  addTagBtn.className = 'add-tag-btn';
  addTagBtn.textContent = 'Add';

  tagInputContainer.appendChild(tagInput);
  tagInputContainer.appendChild(addTagBtn);

  tagsSection.appendChild(tagsLabel);
  tagsSection.appendChild(tagsContainer);
  tagsSection.appendChild(tagInputContainer);
  root.appendChild(tagsSection);

  const divider2 = document.createElement('div');
  divider2.className = 'divider';
  root.appendChild(divider2);

  const saveBtn = document.createElement('button');
  saveBtn.id = 'save-btn';
  saveBtn.className = 'save-btn';
  saveBtn.textContent = 'Save to My Pocket';
  root.appendChild(saveBtn);

  return root;
}

function createTagChip(tag: { id: string; label: string }): HTMLElement {
  const tagChip = document.createElement('div');
  tagChip.className = 'tag-chip';

  const span = document.createElement('span');
  span.textContent = `#${tag.label}`;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'tag-remove';
  removeBtn.dataset.tagId = tag.id;
  removeBtn.setAttribute('aria-label', `Remove tag ${tag.label}`);
  removeBtn.textContent = '×';

  tagChip.appendChild(span);
  tagChip.appendChild(removeBtn);

  return tagChip;
}

export function updateTags(tags: AppState['tags']): void {
  const container = document.getElementById('tags-container');
  if (!container) return;

  container.textContent = '';

  tags.forEach(tag => {
    const tagChip = createTagChip(tag);
    container.appendChild(tagChip);
  });
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
