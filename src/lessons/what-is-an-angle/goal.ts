import { isNear } from '../../geometry';
import type { Goal } from './steps';

/** What the child has done so far in a step. */
export interface Attempt {
  /** The angle where the arm was let go. */
  angle: number;
  /** Smallest and largest angle reached while exploring. */
  seenMin: number;
  seenMax: number;
}

/** Has this attempt met the step's goal? Pure, so it is easy to test. */
export const goalMet = (goal: Goal, attempt: Attempt): boolean => {
  switch (goal.kind) {
    case 'explore':
      return attempt.seenMax - attempt.seenMin >= goal.minSweep;
    case 'exact':
      return isNear(attempt.angle, goal.target, goal.tolerance);
    case 'range':
      return attempt.angle > goal.min && attempt.angle < goal.max;
  }
};

/** A gentle hint when the child lets go without meeting the goal, or null for no hint. */
export const hintFor = (goal: Goal, angle: number): string | null => {
  const a = Math.round(angle);
  switch (goal.kind) {
    case 'explore':
      return null;
    case 'exact':
      if (Math.abs(a - goal.target) <= 10) return 'So close! Nudge it a tiny bit.';
      return a < goal.target ? 'Open it a bit more.' : 'Close it a bit.';
    case 'range':
      if (a <= goal.min) return 'Open it a bit more.';
      if (a >= goal.max) return 'Close it a bit.';
      return null;
  }
};
