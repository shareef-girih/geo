import { type Vec, polar, vec } from './vec';

/**
 * Corners of an n-pointed star centred on `center`, alternating between the
 * outer and inner radius. The first point aims straight up (90°).
 */
export const starPolygon = (n: number, outer: number, inner: number, center: Vec = vec(0, 0)): Vec[] =>
  Array.from({ length: n * 2 }, (_, i) => polar(center, i % 2 === 0 ? outer : inner, 90 + (180 * i) / n));

/** Format points for an SVG `points` attribute. */
export const toPointsAttr = (points: Vec[], digits = 2): string =>
  points.map((p) => `${p.x.toFixed(digits)},${p.y.toFixed(digits)}`).join(' ');
