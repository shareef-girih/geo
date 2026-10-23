import { describe, expect, it } from 'vitest';
import {
  add, cross, distance, dot, fromScreen, length, normalize, polar, sub, toDegrees, toRadians,
  toScreen, vec,
} from './vec';

describe('vector basics', () => {
  it('adds and subtracts', () => {
    expect(add(vec(1, 2), vec(3, 4))).toEqual(vec(4, 6));
    expect(sub(vec(1, 2), vec(3, 4))).toEqual(vec(-2, -2));
  });

  it('computes dot and cross products', () => {
    expect(dot(vec(1, 0), vec(0, 1))).toBe(0);
    expect(cross(vec(1, 0), vec(0, 1))).toBe(1); // counter-clockwise is positive
    expect(cross(vec(0, 1), vec(1, 0))).toBe(-1);
  });

  it('measures length and distance (3-4-5 triangle)', () => {
    expect(length(vec(3, 4))).toBe(5);
    expect(distance(vec(1, 1), vec(4, 5))).toBe(5);
  });

  it('normalises, and leaves the zero vector alone', () => {
    const n = normalize(vec(3, 4));
    expect(n.x).toBeCloseTo(0.6);
    expect(n.y).toBeCloseTo(0.8);
    expect(normalize(vec(0, 0))).toEqual(vec(0, 0));
  });
});

describe('angles and polar points', () => {
  it('converts degrees and radians', () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI);
    expect(toDegrees(Math.PI / 2)).toBeCloseTo(90);
  });

  it('places points counter-clockwise from the right', () => {
    const c = vec(10, 10);
    const right = polar(c, 5, 0);
    const up = polar(c, 5, 90);
    const left = polar(c, 5, 180);
    expect(right.x).toBeCloseTo(15);
    expect(right.y).toBeCloseTo(10);
    expect(up.x).toBeCloseTo(10);
    expect(up.y).toBeCloseTo(15); // maths y points up
    expect(left.x).toBeCloseTo(5);
  });
});

describe('screen conversion', () => {
  it('flips y and round-trips', () => {
    expect(toScreen(vec(5, 0), 100)).toEqual(vec(5, 100));
    expect(toScreen(vec(5, 100), 100)).toEqual(vec(5, 0));
    const p = vec(12, 34);
    expect(fromScreen(toScreen(p, 200), 200)).toEqual(p);
  });
});
