/** Every lesson on the home page, in the order kids should take them. */
export interface LessonInfo {
  id: string;
  title: string;
  /** One short line a 10-year-old can read. */
  blurb: string;
  /** Route to the lesson, or null if it isn't built yet ("coming soon"). */
  path: '/lessons/what-is-an-angle' | null;
}

export const lessons: LessonInfo[] = [
  {
    id: 'what-is-an-angle',
    title: 'What is an angle?',
    blurb: 'Turn a line and find right, straight, sharp and wide angles.',
    path: '/lessons/what-is-an-angle',
  },
  {
    id: 'triangles',
    title: 'Triangles',
    blurb: 'Build triangles and discover a secret about their corners.',
    path: null,
  },
];
