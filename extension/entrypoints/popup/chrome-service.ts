// Chrome extension API service layer

import { browser } from 'wxt/browser';
import { UserInfo, PageInfo } from './state';

export async function getCurrentPageInfo(): Promise<PageInfo> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return {
    title: tab.title || 'Untitled',
    url: tab.url || '',
  };
}

export async function getUserInfo(): Promise<UserInfo | null> {
  return new Promise((resolve) => {
    browser.runtime.sendMessage({ action: 'getUserInfo' }, (response) => {
      resolve(response);
    });
  });
}

export async function signIn(): Promise<UserInfo> {
  return new Promise((resolve, reject) => {
    browser.runtime.sendMessage({ action: 'signIn' }, (response) => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });
  });
}

export async function signOut(): Promise<void> {
  return new Promise((resolve, reject) => {
    browser.runtime.sendMessage({ action: 'signOut' }, (response) => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve();
      }
    });
  });
}

