/**
 * Lesson 1: What is an angle?
 *
 * The child first plays with the opening, then meets degrees, then
 * completes challenges that each reveal a new angle name.
 */

export type Goal =
  /** Free play: done once the child has swept the arm across `minSweep` degrees. */
  | { kind: 'explore'; minSweep: number }
  /** Hit a specific angle, within `tolerance` degrees. */
  | { kind: 'exact'; target: number; tolerance: number }
  /** Land anywhere strictly between `min` and `max`. */
  | { kind: 'range'; min: number; max: number };

export interface Step {
  id: string;
  /** What we ask the child to do. One short sentence, read aloud on request. */
  ask: string;
  goal: Goal;
  /** Shown (and read) after success. Introduces the name for what they just made. */
  praise: string;
  /** Short name of the angle kind, shown as a badge on success. */
  name?: string;
  showDegrees: boolean;
  showTicks: boolean;
  /** Where the moving arm starts for this step. */
  startAngle: number;
}

export const LESSON_ID = 'what-is-an-angle';
export const LESSON_TITLE = 'What is an angle?';

export const steps: Step[] = [
  {
    id: 'explore',
    ask: 'Drag the yellow dot. Make the gap open wide, then close it up.',
    goal: { kind: 'explore', minSweep: 120 },
    praise: 'The turn between two lines that meet is called an angle.',
    showDegrees: false,
    showTicks: false,
    startAngle: 40,
  },
  {
    id: 'degrees',
    ask: 'We measure angles in degrees. Open the angle to more than 100 degrees.',
    goal: { kind: 'range', min: 100, max: 181 },
    praise: 'Bigger turn, more degrees. The arm length does not matter, only the turn.',
    showDegrees: true,
    showTicks: false,
    startAngle: 30,
  },
  {
    id: 'right',
    ask: 'Make a square corner, like the corner of a book. That is 90 degrees.',
    goal: { kind: 'exact', target: 90, tolerance: 2 },
    praise: 'A square corner is a right angle. You can find them everywhere.',
    name: 'Right angle',
    showDegrees: true,
    showTicks: true,
    startAngle: 30,
  },
  {
    id: 'straight',
    ask: 'Open it all the way, until the two arms make one straight line.',
    goal: { kind: 'exact', target: 180, tolerance: 2 },
    praise: 'A straight angle is 180 degrees. That is two right angles together.',
    name: 'Straight angle',
    showDegrees: true,
    showTicks: true,
    startAngle: 120,
  },
  {
    id: 'acute',
    ask: 'Make a sharp, pointy angle, smaller than a square corner.',
    goal: { kind: 'range', min: 5, max: 88 },
    praise: 'An angle smaller than 90 degrees is an acute angle. Sharp like a beak.',
    name: 'Acute angle',
    showDegrees: true,
    showTicks: true,
    startAngle: 150,
  },
  {
    id: 'obtuse',
    ask: 'Now make a wide angle, bigger than a square corner but not a straight line.',
    goal: { kind: 'range', min: 92, max: 178 },
    praise: 'An angle between 90 and 180 degrees is an obtuse angle. Wide like an open fan.',
    name: 'Obtuse angle',
    showDegrees: true,
    showTicks: true,
    startAngle: 40,
  },
  {
    id: 'forty-five',
    ask: 'Last one. Make exactly half of a square corner.',
    goal: { kind: 'exact', target: 45, tolerance: 2 },
    praise: 'Half of 90 is 45 degrees. You are an angle expert now!',
    showDegrees: true,
    showTicks: true,
    startAngle: 120,
  },
];
