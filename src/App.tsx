import { AngleLesson } from './lessons/what-is-an-angle/Lesson';

export function App() {
  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Girih Labs home">
          <svg viewBox="-12 -12 24 24" width="30" height="30" aria-hidden="true">
            <polygon points="0,-11 3,-4 10,-4 4.5,1.5 6.5,9 0,4.5 -6.5,9 -4.5,1.5 -10,-4 -3,-4" />
          </svg>
          <span>Girih Labs</span>
        </a>
      </header>
      <main>
        <AngleLesson />
      </main>
    </div>
  );
}
