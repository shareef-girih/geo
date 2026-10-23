import { describe, expect, it } from 'vitest';
import {
  angleAt, clampDegrees, classifyAngle, direction, halfTurnFromDirection, isNear,
  normalizeDegrees, smallAngleAt, snapDegrees, wedgePath,
} from './angle';
import { polar, toScreen, vec } from './vec';

const O = vec(0, 0);

describe('normalizeDegrees', () => {
  it('wraps into [0, 360)', () => {
    expect(normalizeDegrees(0)).toBe(0);
    expect(normalizeDegrees(360)).toBe(0);
    expect(normalizeDegrees(370)).toBe(10);
    expect(normalizeDegrees(-90)).toBe(270);
    expect(normalizeDegrees(-720)).toBe(0);
  });

  it('never returns 360 for tiny negative numbers', () => {
    expect(normalizeDegrees(-1e-14)).toBe(0);
    expect(Object.is(normalizeDegrees(-0), 0)).toBe(true);
  });
});

describe('direction', () => {
  it('measures the compass of a ray, 0° to the right, counter-clockwise', () => {
    expect(direction(O, vec(1, 0))).toBeCloseTo(0);
    expect(direction(O, vec(0, 1))).toBeCloseTo(90);
    expect(direction(O, vec(-1, 0))).toBeCloseTo(180);
    expect(direction(O, vec(0, -1))).toBeCloseTo(270);
    expect(direction(O, vec(1, 1))).toBeCloseTo(45);
  });
});

describe('angleAt', () => {
  it('measures counter-clockwise from arm a to arm b', () => {
    expect(angleAt(O, vec(1, 0), vec(0, 1))).toBeCloseTo(90);
    expect(angleAt(O, vec(0, 1), vec(1, 0))).toBeCloseTo(270);
    expect(angleAt(O, vec(1, 0), vec(-1, 0))).toBeCloseTo(180);
    expect(angleAt(O, vec(1, 0), vec(2, 0))).toBeCloseTo(0);
  });

  it('works away from the origin and with any arm lengths', () => {
    const v = vec(5, 5);
    expect(angleAt(v, vec(105, 5), polar(v, 3, 60))).toBeCloseTo(60);
    expect(angleAt(v, polar(v, 7, 30), polar(v, 2, 150))).toBeCloseTo(120);
  });

  it('gives the matching small angle', () => {
    expect(smallAngleAt(O, vec(0, 1), vec(1, 0))).toBeCloseTo(90);
    expect(smallAngleAt(O, vec(1, 0), polar(O, 1, 300))).toBeCloseTo(60);
  });

  it('agrees with a sweep of every whole degree', () => {
    for (let d = 0; d < 360; d++) {
      expect(angleAt(O, vec(1, 0), polar(O, 4, d))).toBeCloseTo(d, 6);
    }
  });
});

describe('halfTurnFromDirection', () => {
  it('passes through angles between 0° and 180°', () => {
    expect(halfTurnFromDirection(0)).toBe(0);
    expect(halfTurnFromDirection(45)).toBe(45);
    expect(halfTurnFromDirection(180)).toBe(180);
  });

  it('pins drags below the starting arm to the nearer end', () => {
    expect(halfTurnFromDirection(200)).toBe(180);
    expect(halfTurnFromDirection(269)).toBe(180);
    expect(halfTurnFromDirection(271)).toBe(0);
    expect(halfTurnFromDirection(350)).toBe(0);
    expect(halfTurnFromDirection(-10)).toBe(0);
  });
});

describe('snapping and closeness', () => {
  it('snaps to steps', () => {
    expect(snapDegrees(44.4)).toBe(44);
    expect(snapDegrees(44.6)).toBe(45);
    expect(snapDegrees(43, 5)).toBe(45);
    expect(snapDegrees(42, 5)).toBe(40);
  });

  it('clamps and checks tolerance', () => {
    expect(clampDegrees(200, 0, 180)).toBe(180);
    expect(clampDegrees(-5, 0, 180)).toBe(0);
    expect(isNear(88, 90, 2)).toBe(true);
    expect(isNear(87.9, 90, 2)).toBe(false);
  });
});

describe('classifyAngle', () => {
  it('names each kind of angle exactly', () => {
    expect(classifyAngle(0)).toBe('zero');
    expect(classifyAngle(30)).toBe('acute');
    expect(classifyAngle(89.9)).toBe('acute');
    expect(classifyAngle(90)).toBe('right');
    expect(classifyAngle(120)).toBe('obtuse');
    expect(classifyAngle(180)).toBe('straight');
    expect(classifyAngle(250)).toBe('reflex');
    expect(classifyAngle(360)).toBe('full');
  });

  it('forgives small dragging errors when given a tolerance', () => {
    expect(classifyAngle(88, 2)).toBe('right');
    expect(classifyAngle(87, 2)).toBe('acute');
    expect(classifyAngle(179, 2)).toBe('straight');
    expect(classifyAngle(1, 2)).toBe('zero');
  });
});

describe('wedgePath', () => {
  const H = 100;
  const screen = (p: { x: number; y: number }) => toScreen(p, H);
  const c = vec(50, 50);

  it('draws nothing for an empty angle', () => {
    expect(wedgePath(c, 10, 0, 0, screen)).toBe('');
  });

  it('starts at the centre and ends on the far arm', () => {
    const d = wedgePath(c, 10, 0, 90, screen);
    expect(d.startsWith('M 50 50 L 60 50 A 10 10 0 0 0')).toBe(true);
    const nums = d.split(/[\sZ]+/).filter(Boolean);
    const [ex, ey] = nums.slice(-2).map(Number);
    expect(ex).toBeCloseTo(50);
    expect(ey).toBeCloseTo(40); // 90° points up, which is smaller y on screen
  });

  it('uses the large-arc flag past 180°', () => {
    expect(wedgePath(c, 10, 0, 270, screen)).toContain('A 10 10 0 1 0');
    expect(wedgePath(c, 10, 0, 170, screen)).toContain('A 10 10 0 0 0');
  });

  it('draws a full circle with two arcs', () => {
    const d = wedgePath(c, 10, 0, 360, screen);
    expect(d.match(/A /g)).toHaveLength(2);
  });
});
