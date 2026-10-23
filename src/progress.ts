/**
 * Lesson progress, kept only in this browser. Nothing is sent anywhere.
 * Storage can be missing or blocked (private mode), so every call is guarded.
 */
const KEY = 'girihlabs.progress.v1';

interface Progress {
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

export const isComplete = (lessonId: string): boolean => load().completed.includes(lessonId);

export const markComplete = (lessonId: string): void => {
  try {
    const p = load();
    if (!p.completed.includes(lessonId)) p.completed.push(lessonId);
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Progress just won't be remembered; the lesson still works.
  }
};
