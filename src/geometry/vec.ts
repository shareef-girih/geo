/**
 * 2D points and vectors in maths coordinates (x right, y up).
 */
export interface Vec {
  readonly x: number;
  readonly y: number;
}

export const vec = (x: number, y: number): Vec => ({ x, y });

export const add = (a: Vec, b: Vec): Vec => vec(a.x + b.x, a.y + b.y);
export const sub = (a: Vec, b: Vec): Vec => vec(a.x - b.x, a.y - b.y);
export const scale = (a: Vec, k: number): Vec => vec(a.x * k, a.y * k);
export const dot = (a: Vec, b: Vec): number => a.x * b.x + a.y * b.y;
/** The z-component of the 3D cross product: positive when b is counter-clockwise from a. */
export const cross = (a: Vec, b: Vec): number => a.x * b.y - a.y * b.x;
export const length = (a: Vec): number => Math.hypot(a.x, a.y);
export const distance = (a: Vec, b: Vec): number => length(sub(a, b));

/** Unit vector in the direction of a. Returns (0, 0) for the zero vector. */
export const normalize = (a: Vec): Vec => {
  const len = length(a);
  return len === 0 ? vec(0, 0) : scale(a, 1 / len);
};

/** The point at `radius` from `center` in the direction `degrees` (0° = right, counter-clockwise). */
export const polar = (center: Vec, radius: number, degrees: number): Vec => {
  const r = toRadians(degrees);
  return vec(center.x + radius * Math.cos(r), center.y + radius * Math.sin(r));
};

export const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
export const toDegrees = (radians: number): number => (radians * 180) / Math.PI;

/**
 * Convert between maths coordinates and SVG screen coordinates.
 * SVG y grows downward, so only y flips. `height` is the viewBox height.
 */
export const toScreen = (p: Vec, height: number): Vec => vec(p.x, height - p.y);
export const fromScreen = (p: Vec, height: number): Vec => vec(p.x, height - p.y);
