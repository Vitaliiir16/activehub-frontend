import { useEffect, useState, type ReactNode } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { api } from "./api/client";
import { SessionProvider, homeFor, useSession } from "./session";
import { Login, Register } from "./pages/Auth";
import { ProfilePage } from "./pages/Profile";
import { AdminAccounts } from "./pages/Admin";
import { Notifications } from "./pages/Notifications";
import { Feedback, useFormState } from "./components/forms";

import { EventCatalog, EventDetails, OrganizerCatalog, OrganizerDetails } from "./marketplace/Catalog";
import { EventForm, EventManager } from "./marketplace/Manage";
function Frame() {
  const session = useSession(),
    state = useFormState(),
    navigate = useNavigate();
  return (
    <div className="shell">
      <header className="site-header">
        <Link
          className="brand"
          to={session.profile ? homeFor(session.profile.role) : "/login"}
        >
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          ActiveHub
        </Link>
        {session.profile && (
          <nav aria-label="Main navigation">
            <NavLink to={homeFor(session.profile.role)} end>
              Home
            </NavLink>
            <NavLink to="/organizers">Organizers</NavLink>
<NavLink to="/events">Activities</NavLink>
{session.profile.role === "ORGANIZER" && <NavLink to="/organizer/events">Manage events</NavLink>}
<NavLink to="/profile">Profile</NavLink>
            <NavLink to="/notifications">Notifications</NavLink>
            {session.profile.role === "ADMIN" && (
              <NavLink to="/admin/accounts">Administrator access</NavLink>
            )}
            <button
              className="text-button"
              disabled={state.busy}
              onClick={() =>
                void state.run(async () => {
                  await api.logout();
                  session.clear();
                  navigate("/login", { replace: true });
                })
              }
            >
              Sign out
            </button>
          </nav>
        )}
      </header>
      <Feedback state={state} />
      <main id="main-content">
        <Outlet />
      </main>
      <footer>Move more. Connect more.</footer>
    </div>
  );
}
function Guard({
  role,
  children,
}: {
  role?: "USER" | "ORGANIZER" | "ADMIN";
  children: ReactNode;
}) {
  const session = useSession();
  if (!session.profile) return <Navigate to="/login" replace />;
  if (role && session.profile.role !== role)
    return <Navigate to={homeFor(session.profile.role)} replace />;
  return children;
}
function Landing() {
  const session = useSession();
  return (
    <Navigate
      to={session.profile ? homeFor(session.profile.role) : "/login"}
      replace
    />
  );
}
function Home() {
  const profile = useSession().profile;
  if (!profile) return null;
  const name =
    profile.role === "USER"
      ? profile.firstName
      : profile.role === "ORGANIZER"
        ? profile.name
        : profile.displayName;
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">
          {profile.role === "USER"
            ? "YOUR NEXT ACTIVITY STARTS HERE"
            : profile.role === "ORGANIZER"
              ? "YOUR ORGANIZER SPACE"
              : "YOUR ADMINISTRATION SPACE"}
        </p>
        <h1>Welcome, {name}.</h1>
        <p className="muted">Your account is ready. Let's make it yours.</p>
      </div>
      <section className="home-feature">
        <span className="feature-symbol" aria-hidden="true">
          ↗
        </span>
        <div>
          <h2>
            {profile.role === "USER"
              ? "Your activity board is taking shape."
              : profile.role === "ORGANIZER"
                ? "Your organizer dashboard is taking shape."
                : "Your platform dashboard is taking shape."}
          </h2>
          <p>
            {profile.role === "USER"
              ? "Activity discovery and booking are coming in a later release."
              : profile.role === "ORGANIZER"
                ? "Create activities and manage sessions from Manage events. Performance reports arrive later."
                : "Platform reports and general management tools are coming in a later release."}
          </p>
          <Link className="button" to="/profile">
            Complete your profile
          </Link>
          {profile.role === "ADMIN" && (
            <Link className="button secondary" to="/admin/accounts">
              Manage administrator access
            </Link>
          )}
        </div>
      </section>
      <HealthStatus />
    </>
  );
}
function HealthStatus() {
  const [status, setStatus] = useState("Checking connection...");
  useEffect(() => {
    const controller = new AbortController();
    api
      .health(controller.signal)
      .then(() => setStatus("Connected to ActiveHub"))
      .catch(() => {
        if (!controller.signal.aborted)
          setStatus("Connection unavailable. Reload to try again.");
      });
    return () => controller.abort();
  }, []);
  return (
    <p className="connection" role="status">
      {status}
    </p>
  );
}
function Application() {
  const session = useSession();
  if (session.loading)
    return (
      <main className="loading-screen" role="status">
        Loading your account...
      </main>
    );
  if (session.error)
    return (
      <main className="loading-screen">
        <p role="alert">{session.error}</p>
        <button onClick={() => void session.refresh().catch(() => undefined)}>
          Try again
        </button>
      </main>
    );
  return (
    <Routes>
      <Route element={<Frame />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="events"
          element={
            <Guard>
              <EventCatalog /><HealthStatus />
            </Guard>
          }
        />
        <Route path="events/:id" element={<Guard><EventDetails /></Guard>} />
<Route path="organizers" element={<Guard><OrganizerCatalog /></Guard>} />
<Route path="organizers/:id" element={<Guard><OrganizerDetails /></Guard>} />
<Route path="organizer/events" element={<Guard role="ORGANIZER"><EventCatalog owned /></Guard>} />
<Route path="organizer/events/new" element={<Guard role="ORGANIZER"><EventForm /></Guard>} />
<Route path="organizer/events/:id" element={<Guard role="ORGANIZER"><EventManager /></Guard>} />
<Route
          path="organizer"
          element={
            <Guard role="ORGANIZER">
              <Home />
            </Guard>
          }
        />
        <Route
          path="admin"
          element={
            <Guard role="ADMIN">
              <Home />
            </Guard>
          }
        />
        <Route
          path="admin/accounts"
          element={
            <Guard role="ADMIN">
              <AdminAccounts />
            </Guard>
          }
        />
        <Route
          path="profile"
          element={
            <Guard>
              <ProfilePage />
            </Guard>
          }
        />
        <Route
          path="notifications"
          element={
            <Guard>
              <Notifications />
            </Guard>
          }
        />
        <Route
          path="*"
          element={
            <section className="panel">
              <h1>Page not found</h1>
              <Link to="/">Return home</Link>
            </section>
          }
        />
      </Route>
    </Routes>
  );
}
export function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Application />
      </SessionProvider>
    </BrowserRouter>
  );
}
