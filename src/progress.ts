import { Store, useStore } from '@tanstack/react-store';

/**
 * Lesson progress, kept only in this browser. Nothing is sent anywhere.
 * Storage can be missing or blocked (private mode), so every access is guarded.
 */
const KEY = 'girihlabs.progress.v1';

export interface Progress {
  completed: string[];
}

const load = (): Progress => {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Progress>) : {};
    return { completed: Array.isArray(parsed.completed) ? parsed.completed : [] };
  } catch {
    return { completed: [] };
  }
};

export const progressStore = new Store<Progress>(load());

progressStore.subscribe(() => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progressStore.state));
  } catch {
    // Progress just won't be remembered; the lessons still work.
  }
});

export const markComplete = (lessonId: string): void => {
  progressStore.setState((p) =>
    p.completed.includes(lessonId) ? p : { completed: [...p.completed, lessonId] },
  );
};

/** React hook: has this lesson been completed? Re-renders when progress changes. */
export const useIsComplete = (lessonId: string): boolean =>
  useStore(progressStore, (p) => p.completed.includes(lessonId));
