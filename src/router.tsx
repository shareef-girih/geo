import { Link, Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Home } from './Home';
import { AngleLesson } from './lessons/what-is-an-angle/Lesson';

function Layout() {
  return (
    <div className="app">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Girih Labs home">
          <svg viewBox="-12 -12 24 24" width="30" height="30" aria-hidden="true">
            <polygon points="0,-11 3,-4 10,-4 4.5,1.5 6.5,9 0,4.5 -6.5,9 -4.5,1.5 -10,-4 -3,-4" />
          </svg>
          <span>Girih Labs</span>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <section className="finished">
      <h1>This page got lost.</h1>
      <Link className="btn btn-primary" to="/">Go to lessons</Link>
    </section>
  );
}

const rootRoute = createRootRoute({ component: Layout, notFoundComponent: NotFound });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const angleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lessons/what-is-an-angle',
  component: AngleLesson,
});

const routeTree = rootRoute.addChildren([homeRoute, angleRoute]);

export const router = createRouter({ routeTree, scrollRestoration: true });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
