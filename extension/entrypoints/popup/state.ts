// State management for the popup

export interface Tag {
  id: string;
  label: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface PageInfo {
  title: string;
  url: string;
}

export interface AppState {
  user: UserInfo | null;
  tags: Tag[];
  pageInfo: PageInfo | null;
}

type StateListener = (state: AppState) => void;

class StateManager {
  private state: AppState = {
    user: null,
    tags: [],
    pageInfo: null,
  };

  private listeners: Set<StateListener> = new Set();
  private tagIdCounter = 0;

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): AppState {
    return this.state;
  }

  setUser(user: UserInfo | null): void {
    this.state = { ...this.state, user };
    this.notify();
  }

  setPageInfo(pageInfo: PageInfo): void {
    this.state = { ...this.state, pageInfo };
    this.notify();
  }

  addTag(label: string): boolean {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return false;

    const exists = this.state.tags.some(
      t => t.label.toLowerCase() === trimmedLabel.toLowerCase()
    );
    if (exists) return false;

    const newTag: Tag = {
      id: `tag-${this.tagIdCounter++}`,
      label: trimmedLabel,
    };

    this.state = {
      ...this.state,
      tags: [...this.state.tags, newTag],
    };
    this.notify();
    return true;
  }

  removeTag(tagId: string): void {
    this.state = {
      ...this.state,
      tags: this.state.tags.filter(t => t.id !== tagId),
    };
    this.notify();
  }

  clearTags(): void {
    this.state = {
      ...this.state,
      tags: [],
    };
    this.notify();
  }

  getTagLabels(): string[] {
    return this.state.tags.map(t => t.label);
  }
}

export const stateManager = new StateManager();

