import { describe, expect, it } from 'vitest';
import { goalMet, hintFor } from './goal';
import { steps } from './steps';

const at = (angle: number, seenMin = angle, seenMax = angle) => ({ angle, seenMin, seenMax });

describe('goalMet', () => {
  it('explore needs a wide enough sweep', () => {
    const g = { kind: 'explore', minSweep: 120 } as const;
    expect(goalMet(g, at(40, 30, 100))).toBe(false);
    expect(goalMet(g, at(40, 10, 130))).toBe(true);
  });

  it('exact allows a small tolerance', () => {
    const g = { kind: 'exact', target: 90, tolerance: 2 } as const;
    expect(goalMet(g, at(88))).toBe(true);
    expect(goalMet(g, at(92))).toBe(true);
    expect(goalMet(g, at(93))).toBe(false);
  });

  it('range is strict at both ends', () => {
    const g = { kind: 'range', min: 92, max: 178 } as const;
    expect(goalMet(g, at(92))).toBe(false);
    expect(goalMet(g, at(120))).toBe(true);
    expect(goalMet(g, at(178))).toBe(false);
  });
});

describe('hintFor', () => {
  it('points the child the right way', () => {
    const g = { kind: 'exact', target: 90, tolerance: 2 } as const;
    expect(hintFor(g, 40)).toBe('Open it a bit more.');
    expect(hintFor(g, 150)).toBe('Close it a bit.');
    expect(hintFor(g, 85)).toBe('So close! Nudge it a tiny bit.');
  });
});

describe('lesson steps', () => {
  it('never start already solved', () => {
    for (const s of steps) {
      expect(goalMet(s.goal, at(s.startAngle))).toBe(false);
    }
  });

  it('keep every target reachable between 0° and 180°', () => {
    for (const s of steps) {
      if (s.goal.kind === 'exact') {
        expect(s.goal.target >= 0 && s.goal.target <= 180).toBe(true);
      }
      if (s.goal.kind === 'range') {
        expect(s.goal.min < s.goal.max && s.goal.min < 180).toBe(true);
      }
    }
  });

  it('have unique ids', () => {
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
  });
});
