# Girih Labs

Learn geometry by doing. Interactive lessons for kids around 10 years old,
starting from "what is an angle?" and growing all the way to trigonometry.
The journey ends with kids drawing real girih patterns, the star-and-polygon
tilings of Islamic architecture.

Live at [girihlabs.com](https://girihlabs.com) (coming soon).

## Run it

```bash
npm install
npm run dev        # local site at http://localhost:5173
npm test           # geometry engine tests
npm run build      # type-check and build to dist/
```

## How it's built

- **React + TypeScript + Vite**, deployed as a static site.
- **A small geometry engine** in `src/geometry/`: plain TypeScript with tests,
  kept separate from the UI so the maths stays correct.
- **SVG** for every shape, with Pointer Events so mouse, finger and stylus all work.
- **No accounts, no tracking.** Progress is saved on the child's own device.

See [CLAUDE.md](CLAUDE.md) for the conventions AI coding agents follow here.

## Lessons

| # | Lesson | Status |
|---|--------|--------|
| 1 | What is an angle? | Ready |
