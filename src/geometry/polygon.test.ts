import { describe, expect, it } from 'vitest';
import { starPolygon, toPointsAttr } from './polygon';
import { distance, vec } from './vec';

describe('starPolygon', () => {
  it('alternates outer and inner corners', () => {
    const pts = starPolygon(10, 40, 20);
    expect(pts).toHaveLength(20);
    pts.forEach((p, i) => expect(distance(p, vec(0, 0))).toBeCloseTo(i % 2 === 0 ? 40 : 20));
  });

  it('points the first tip straight up', () => {
    const [first] = starPolygon(5, 10, 4, vec(3, 3));
    expect(first!.x).toBeCloseTo(3);
    expect(first!.y).toBeCloseTo(13);
  });
});

describe('toPointsAttr', () => {
  it('formats points for SVG', () => {
    expect(toPointsAttr([vec(1, 2), vec(3.14159, 0)])).toBe('1.00,2.00 3.14,0.00');
  });
});
