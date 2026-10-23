# Girih Labs — guide for AI coding agents

Interactive geometry lessons for children around 10 years old, from angles up to
trigonometry. Kids learn by dragging and building, not by reading.

## Stack

- React 19 + TypeScript + Vite (static site, no server), pnpm for packages
- TanStack Router (code-based routes in `src/router.tsx`) and TanStack Store
  (`src/progress.ts`). Prefer TanStack libraries when a new need fits one.
- Plain SVG for all drawing; no canvas or charting libraries
- Vitest for tests
- Progress is stored only in the browser (`localStorage`). No accounts, no
  analytics, no collection of children's data. Do not add any of these.

## Layout

- `src/geometry/` — the geometry engine. **Pure TypeScript, no React, no DOM.**
  Every function here must have tests in a `*.test.ts` file next to it.
- `src/components/` — reusable UI pieces (stages, buttons, celebrations).
- `src/lessons/<lesson-id>/` — one folder per lesson. A lesson is a set of
  steps and challenges built from components plus engine functions.
- `src/progress.ts` — saving and loading which lessons are complete.

## Rules

1. Maths lives in `src/geometry/`, never inside components. If a component
   needs a calculation, add a tested function to the engine first.
2. Run `pnpm test` and `pnpm typecheck` before every commit. Both must pass.
3. Coordinates: the engine uses maths coordinates (y points up, angles
   counter-clockwise, degrees). Convert to SVG screen coordinates (y down)
   only at the edge, using `toScreen` / `fromScreen`.
4. Writing for kids: one short sentence per instruction, everyday words,
   name a concept only after the child has seen it. Every instruction can be
   read aloud with the speaker button.
5. Touch first: draggable handles are at least 44px, use Pointer Events, and
   set `touch-action: none` on drag surfaces.
6. Respect `prefers-reduced-motion`. Keep keyboard access working (handles
   accept arrow keys).

## Design tokens

Colours come from girih tilework. Use the CSS variables in `src/styles.css`
(`--lapis`, `--turquoise`, `--saffron`, `--pomegranate`, `--ink`, `--plaster`)
rather than new hex values. Font: Baloo 2.
