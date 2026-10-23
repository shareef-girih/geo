/** True when this browser can speak text out loud. */
export const canSpeak = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

/** Read text aloud with the browser's built-in voice. Stops anything already speaking. */
export const speak = (text: string): void => {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.92; // a little slower, for young listeners
  u.pitch = 1.05;
  window.speechSynthesis.speak(u);
};

export function ReadAloudButton({ text }: { text: string }) {
  if (!canSpeak()) return null;
  return (
    <button type="button" className="read-aloud" onClick={() => speak(text)} aria-label="Read this to me">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>Read to me</span>
    </button>
  );
}
