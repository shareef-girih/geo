import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import {
  type Vec, clampDegrees, direction, fromScreen, halfTurnFromDirection, isNear, polar,
  snapDegrees, toScreen, vec, wedgePath,
} from '../geometry';

/** Size of the drawing in SVG units. The SVG scales to fit its container. */
const W = 440;
const H = 260;
const VERTEX: Vec = vec(220, 40);
const ARM = 160;
const WEDGE_R = 56;

const screen = (p: Vec) => toScreen(p, H);

interface Props {
  angle: number;
  onAngleChange: (degrees: number) => void;
  /** Called when the child lets go of the arm (or presses a key). */
  onRelease: (degrees: number) => void;
  showDegrees: boolean;
  showTicks: boolean;
  /** Freeze the arm, e.g. while a success message is showing. */
  locked?: boolean;
  celebrating?: boolean;
}

/**
 * An angle with one fixed arm pointing right and one arm the child turns
 * by dragging its yellow handle, or with the arrow keys.
 */
export function AngleStage({
  angle, onAngleChange, onRelease, showDegrees, showTicks, locked = false, celebrating = false,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const angleFromPointer = useCallback((e: PointerEvent<SVGSVGElement>): number | null => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const p = fromScreen(vec(pt.x, pt.y), H);
    return halfTurnFromDirection(direction(VERTEX, p));
  }, []);

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (locked) return;
    const a = angleFromPointer(e);
    if (a === null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    onAngleChange(a);
  };

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!dragging || locked) return;
    const a = angleFromPointer(e);
    if (a !== null) onAngleChange(a);
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    onRelease(angle);
  };

  const onKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    if (locked) return;
    const step = e.shiftKey ? 10 : 1;
    const delta =
      e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? step
      : e.key === 'ArrowDown' || e.key === 'ArrowRight' ? -step
      : null;
    if (delta === null) return;
    e.preventDefault();
    const next = clampDegrees(snapDegrees(angle) + delta, 0, 180);
    onAngleChange(next);
    onRelease(next);
  };

  const shown = snapDegrees(angle);
  const isRight = isNear(angle, 90, 0.5);
  const tip = screen(polar(VERTEX, ARM, angle));
  const fixedTip = screen(polar(VERTEX, ARM, 0));
  const v = screen(VERTEX);

  // A small square marks a right angle instead of a curved arc.
  const sq = 22;
  const square = [polar(VERTEX, sq, 0), polar(VERTEX, sq * Math.SQRT2, 45), polar(VERTEX, sq, 90)]
    .map(screen)
    .map((p) => `${p.x},${p.y}`)
    .join(' ');

  return (
    <svg
      ref={svgRef}
      className={`stage${dragging ? ' is-dragging' : ''}${celebrating ? ' is-celebrating' : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="img"
      aria-label={showDegrees ? `An angle of ${shown} degrees` : 'Two lines meeting at a point'}
    >
      {showTicks && <Protractor />}

      {angle > 0.5 && !isRight && (
        <path className="wedge" d={wedgePath(VERTEX, WEDGE_R, 0, angle, screen)} />
      )}
      {isRight && <polyline className="right-mark" points={`${v.x},${v.y} ${square}`} />}

      <line className="arm arm-fixed" x1={v.x} y1={v.y} x2={fixedTip.x} y2={fixedTip.y} />
      <line className="arm arm-moving" x1={v.x} y1={v.y} x2={tip.x} y2={tip.y} />
      <circle className="vertex" cx={v.x} cy={v.y} r={7} />

      {celebrating && <Burst at={v} />}

      <g
        className="handle"
        tabIndex={locked ? -1 : 0}
        role="slider"
        aria-label="Turn the angle"
        aria-valuemin={0}
        aria-valuemax={180}
        aria-valuenow={shown}
        aria-valuetext={showDegrees ? `${shown} degrees` : undefined}
        onKeyDown={onKeyDown}
      >
        {/* Large invisible circle so small fingers can grab the handle easily. */}
        <circle cx={tip.x} cy={tip.y} r={30} className="handle-hit" />
        <circle cx={tip.x} cy={tip.y} r={16} className="handle-dot" />
      </g>
    </svg>
  );
}

/** Half-circle of tick marks every 10°, with 0, 90 and 180 labelled. */
function Protractor() {
  const ticks = [];
  for (let d = 0; d <= 180; d += 10) {
    const major = d % 90 === 0;
    const a = screen(polar(VERTEX, ARM + 4, d));
    const b = screen(polar(VERTEX, ARM + (major ? 20 : 12), d));
    ticks.push(<line key={d} className={major ? 'tick tick-major' : 'tick'} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />);
  }
  const labels = [0, 90, 180].map((d) => {
    const p = screen(polar(VERTEX, ARM + 34, d));
    return (
      <text key={d} className="tick-label" x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle">
        {d}
      </text>
    );
  });
  return (
    <g className="protractor" aria-hidden="true">
      <path className="protractor-arc" d={wedgePath(VERTEX, ARM + 4, 0, 180, screen)} />
      {ticks}
      {labels}
    </g>
  );
}

/** Little girih stars that fly out from the corner when a challenge is solved. */
function Burst({ at }: { at: Vec }) {
  const star = '0,-9 2.6,-3.6 8.6,-2.8 4.2,1.4 5.3,7.3 0,4.5 -5.3,7.3 -4.2,1.4 -8.6,-2.8 -2.6,-3.6';
  return (
    <g className="burst" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => {
        const d = 9 + i * 18;
        const end = polar(vec(0, 0), 90 + (i % 3) * 18, d);
        return (
          <g key={i} transform={`translate(${at.x} ${at.y})`}>
            <polygon
              points={star}
              className={`burst-star burst-star-${i % 3}`}
              style={{ '--dx': `${end.x}px`, '--dy': `${-end.y}px`, animationDelay: `${(i % 4) * 40}ms` } as CSSProperties}
            />
          </g>
        );
      })}
    </g>
  );
}
