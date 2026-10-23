import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { AngleStage } from '../../components/AngleStage';
import { ReadAloudButton } from '../../components/ReadAloud';
import { snapDegrees, starPolygon, toPointsAttr } from '../../geometry';
import { markComplete } from '../../progress';
import { goalMet, hintFor } from './goal';
import { LESSON_ID, LESSON_TITLE, steps } from './steps';

type Phase = 'trying' | 'solved' | 'finished';

export function AngleLesson() {
  const [index, setIndex] = useState(0);
  const step = steps[index]!;
  const [angle, setAngle] = useState(step.startAngle);
  const [phase, setPhase] = useState<Phase>('trying');
  const [hint, setHint] = useState<string | null>(null);
  const seen = useRef({ min: step.startAngle, max: step.startAngle });
  const nextRef = useRef<HTMLButtonElement>(null);

  const change = (a: number) => {
    setAngle(a);
    setHint(null);
    seen.current.min = Math.min(seen.current.min, a);
    seen.current.max = Math.max(seen.current.max, a);
    // Exploring is done the moment the sweep is wide enough, no need to let go.
    if (step.goal.kind === 'explore' && goalMet(step.goal, attemptAt(a))) setPhase('solved');
  };

  const attemptAt = (a: number) => ({ angle: a, seenMin: seen.current.min, seenMax: seen.current.max });

  const release = (a: number) => {
    if (phase !== 'trying') return;
    if (goalMet(step.goal, attemptAt(a))) {
      // Settle exactly on the target so the number the child sees is the one we name.
      if (step.goal.kind === 'exact') setAngle(step.goal.target);
      else setAngle(snapDegrees(a));
      setPhase('solved');
    } else {
      setHint(hintFor(step.goal, a));
    }
  };

  useEffect(() => {
    if (phase === 'solved') nextRef.current?.focus();
  }, [phase]);

  const next = () => {
    if (index === steps.length - 1) {
      markComplete(LESSON_ID);
      setPhase('finished');
      return;
    }
    const s = steps[index + 1]!;
    setIndex(index + 1);
    setAngle(s.startAngle);
    seen.current = { min: s.startAngle, max: s.startAngle };
    setHint(null);
    setPhase('trying');
  };

  const restart = () => {
    const s = steps[0]!;
    setIndex(0);
    setAngle(s.startAngle);
    seen.current = { min: s.startAngle, max: s.startAngle };
    setHint(null);
    setPhase('trying');
  };

  if (phase === 'finished') {
    return (
      <section className="lesson finished" aria-live="polite">
        <div className="badge" aria-hidden="true">
          <svg viewBox="-50 -50 100 100">
            <polygon className="badge-star" points={starPoints(10, 46, 30)} />
            <polygon className="badge-inner" points={starPoints(10, 26, 17)} />
          </svg>
        </div>
        <h1>You found every kind of angle!</h1>
        <p className="lead">Right, straight, acute and obtuse. Next time, we will use angles to build shapes.</p>
        <div className="finish-actions">
          <Link className="btn btn-primary" to="/">Back to lessons</Link>
          <button type="button" className="btn btn-secondary" onClick={restart}>Play again</button>
        </div>
      </section>
    );
  }

  const message = phase === 'solved' ? step.praise : step.ask;

  return (
    <section className="lesson">
      <header className="lesson-head">
        <h1>{LESSON_TITLE}</h1>
        <ol className="steps" aria-label={`Step ${index + 1} of ${steps.length}`}>
          {steps.map((s, i) => (
            <li
              key={s.id}
              className={i < index || (i === index && phase === 'solved') ? 'done' : i === index ? 'current' : ''}
            />
          ))}
        </ol>
      </header>

      <div className={`bubble${phase === 'solved' ? ' bubble-solved' : ''}`} aria-live="polite">
        {phase === 'solved' && step.name && (
          <>
            <span className="name-badge">{step.name}</span>
            <span className="row-break" aria-hidden="true" />
          </>
        )}
        <p>{message}</p>
        <ReadAloudButton text={message} />
      </div>

      <div className="stage-wrap">
        {step.showDegrees && (
          <div className={`readout${phase === 'solved' ? ' readout-solved' : ''}`} aria-hidden="true">
            {snapDegrees(angle)}
            <span className="deg">°</span>
          </div>
        )}
        <AngleStage
          angle={angle}
          onAngleChange={change}
          onRelease={release}
          showDegrees={step.showDegrees}
          showTicks={step.showTicks}
          locked={phase === 'solved'}
          celebrating={phase === 'solved'}
        />
      </div>

      <div className="actions">
        <p className="hint" aria-live="polite">{hint ?? ' '}</p>
        {phase === 'solved' && (
          <button ref={nextRef} type="button" className="btn btn-primary" onClick={next}>
            {index === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        )}
      </div>
    </section>
  );
}

/** Badge star in SVG space (y down); the star is symmetric, so no flip is needed. */
const starPoints = (n: number, outer: number, inner: number): string =>
  toPointsAttr(starPolygon(n, outer, inner));
