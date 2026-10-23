import { type Vec, cross, dot, polar, sub, toDegrees } from './vec';

/** Normalise any angle in degrees to the range [0, 360). */
export const normalizeDegrees = (degrees: number): number => {
  const d = degrees % 360;
  const wrapped = d < 0 ? d + 360 : d;
  // Tiny negative inputs wrap to exactly 360; -0 should read as 0.
  return wrapped >= 360 || wrapped === 0 ? 0 : wrapped;
};

/** Direction of the ray from `from` to `to`, in degrees [0, 360). 0° points right. */
export const direction = (from: Vec, to: Vec): number => {
  const d = sub(to, from);
  return normalizeDegrees(toDegrees(Math.atan2(d.y, d.x)));
};

/**
 * The angle at `vertex`, turning counter-clockwise from arm `a` to arm `b`.
 * Result is in [0, 360).
 */
export const angleAt = (vertex: Vec, a: Vec, b: Vec): number => {
  const u = sub(a, vertex);
  const v = sub(b, vertex);
  return normalizeDegrees(toDegrees(Math.atan2(cross(u, v), dot(u, v))));
};

/** The smaller angle between the two arms at `vertex`, in [0, 180]. */
export const smallAngleAt = (vertex: Vec, a: Vec, b: Vec): number => {
  const ccw = angleAt(vertex, a, b);
  return ccw > 180 ? 360 - ccw : ccw;
};

/** Keep an angle inside [min, max]. */
export const clampDegrees = (degrees: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, degrees));

/**
 * Where a drag lands when the angle may only open from 0° to 180° counter-clockwise.
 * A raw direction below the starting arm snaps to whichever end (0° or 180°) is nearer.
 */
export const halfTurnFromDirection = (rawDirection: number): number => {
  const d = normalizeDegrees(rawDirection);
  if (d <= 180) return d;
  return d < 270 ? 180 : 0;
};

/** Round to the nearest multiple of `step` (e.g. 1° or 5°). */
export const snapDegrees = (degrees: number, step = 1): number =>
  Math.round(degrees / step) * step;

/** True if `degrees` is within `tolerance` of `target`. */
export const isNear = (degrees: number, target: number, tolerance: number): boolean =>
  Math.abs(degrees - target) <= tolerance;

export type AngleKind = 'zero' | 'acute' | 'right' | 'obtuse' | 'straight' | 'reflex' | 'full';

/**
 * Name an angle the way school geometry does.
 * `tolerance` lets an almost-right angle still count as right (useful when kids drag).
 */
export const classifyAngle = (degrees: number, tolerance = 0): AngleKind => {
  if (degrees <= tolerance) return 'zero';
  if (isNear(degrees, 90, tolerance)) return 'right';
  if (isNear(degrees, 180, tolerance)) return 'straight';
  if (degrees >= 360 - tolerance) return 'full';
  if (degrees < 90) return 'acute';
  if (degrees < 180) return 'obtuse';
  return 'reflex';
};

/**
 * SVG path for a filled wedge (pie slice) from `startDeg` turning counter-clockwise by `sweepDeg`.
 * Points are converted to screen space with `toScreenFn`.
 */
export const wedgePath = (
  center: Vec,
  radius: number,
  startDeg: number,
  sweepDeg: number,
  toScreenFn: (p: Vec) => Vec,
): string => {
  if (sweepDeg <= 0) return '';
  const c = toScreenFn(center);
  if (sweepDeg >= 360) {
    // A full circle needs two arcs; one arc with identical start and end draws nothing.
    const top = toScreenFn(polar(center, radius, 90));
    const bottom = toScreenFn(polar(center, radius, 270));
    return `M ${top.x} ${top.y} A ${radius} ${radius} 0 1 0 ${bottom.x} ${bottom.y} A ${radius} ${radius} 0 1 0 ${top.x} ${top.y} Z`;
  }
  const s = toScreenFn(polar(center, radius, startDeg));
  const e = toScreenFn(polar(center, radius, startDeg + sweepDeg));
  const largeArc = sweepDeg > 180 ? 1 : 0;
  // Counter-clockwise in maths space is sweep-flag 0 once y is flipped for the screen.
  return `M ${c.x} ${c.y} L ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 0 ${e.x} ${e.y} Z`;
};
