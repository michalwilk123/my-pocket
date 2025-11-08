import './style.css';
import { stateManager } from './state';
import * as chrome from './chrome-service';
import * as api from './api';
import * as ui from './ui';

const $ = (id: string) => document.getElementById(id);
const $$ = (selector: string) => document.querySelector(selector);

const handlers = {
  'sign-in-btn': async () => {
    try {
      stateManager.setUser(await chrome.signIn());
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  },

  'sign-out-btn': async () => {
    try {
      await chrome.signOut();
      stateManager.setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  },

  'add-tag-btn': () => {
    const input = $('tag-input') as HTMLInputElement;
    if (input && stateManager.addTag(input.value)) {
      input.value = '';
      input.focus();
    }
  },

  'save-btn': async () => {
    const { pageInfo } = stateManager.getState();
    if (!pageInfo) return;

    try {
      ui.setSaveButton('saving');
      await api.saveLink({
        ...pageInfo,
        note: '',
        tags: stateManager.getTagLabels(),
      });
      ui.setSaveButton('saved');
      setTimeout(() => window.close(), 1000);
    } catch (error) {
      console.error('Failed to save link:', error);
      ui.setSaveButton('error');
    }
  },
};

function render(): void {
  const app = $('app');
  if (!app) return;

  const state = stateManager.getState();
  app.innerHTML = ui.render(state);

  if (state.user) {
    ui.updateTags(state.tags);
    ($('tag-input') as HTMLInputElement)?.focus();
  }
}

$('app')?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const handler = handlers[target.id as keyof typeof handlers];
  
  if (handler) {
    handler();
  } else if (target.classList.contains('tag-remove') && target.dataset.tagId) {
    stateManager.removeTag(target.dataset.tagId);
  }
});

$('app')?.addEventListener('keypress', (e) => {
  if ((e.target as HTMLElement).id === 'tag-input' && (e as KeyboardEvent).key === 'Enter') {
    e.preventDefault();
    handlers['add-tag-btn']();
  }
});

stateManager.subscribe(render);

Promise.all([chrome.getUserInfo(), chrome.getCurrentPageInfo()]).then(([user, pageInfo]) => {
  stateManager.setUser(user);
  stateManager.setPageInfo(pageInfo);
  render();
});
