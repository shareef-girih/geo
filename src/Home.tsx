import { Link } from '@tanstack/react-router';
import { type LessonInfo, lessons } from './lessons/catalog';
import { useIsComplete } from './progress';

export function Home() {
  return (
    <section className="home">
      <h1>Learn geometry by doing.</h1>
      <p className="lead">Drag, turn and build. Every lesson is a puzzle you solve with your hands.</p>
      <ol className="lesson-list">
        {lessons.map((l, i) => <LessonCard key={l.id} lesson={l} number={i + 1} />)}
      </ol>
    </section>
  );
}

function LessonCard({ lesson, number }: { lesson: LessonInfo; number: number }) {
  const done = useIsComplete(lesson.id);
  const body = (
    <>
      <span className="lesson-number" aria-hidden="true">{number}</span>
      <span className="lesson-text">
        <span className="lesson-title">{lesson.title}</span>
        <span className="lesson-blurb">{lesson.blurb}</span>
      </span>
      <span className={`lesson-status${done ? ' is-done' : ''}`}>
        {!lesson.path ? 'Coming soon' : done ? 'Done' : 'Start'}
      </span>
    </>
  );

  return (
    <li>
      {lesson.path ? (
        <Link className="lesson-card" to={lesson.path}>{body}</Link>
      ) : (
        <div className="lesson-card is-locked" aria-disabled="true">{body}</div>
      )}
    </li>
  );
}
