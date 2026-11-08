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

import {
  EventCatalog,
  Recommendations,
  EventDetails,
  OrganizerCatalog,
  OrganizerDetails,
} from "./marketplace/Catalog";
import { EventForm, EventManager } from "./marketplace/Manage";
import {
  BookingForm,
  BookingList,
  BookingDetails,
  BookingCalendar,
} from "./marketplace/Bookings";
import {
  Plans,
  PlanEditor,
  PurchaseSubscription,
  MySubscriptions,
} from "./marketplace/Subscriptions";
import { AdminLoyalty, MyLoyalty } from "./marketplace/Loyalty";
import { ChatList, ChatThread } from "./pages/Chat";
import { adminSections } from "./admin/shared";
import { AdminOrganizerPage, AdminOrganizers, AdminUserPage, AdminUsers } from "./admin/Accounts";
import { AdminBookings, AdminEvents, AdminSubscriptions } from "./admin/Content";
import { AdminDictionaries } from "./admin/Dictionaries";
import { UnreadProvider, useUnread } from "./unread";
function Count({ value, label }: { value: number; label: string }) {
  return value > 0 ? (
    <>
      <span className="count-badge" aria-hidden="true">
        {value > 99 ? "99+" : value}
      </span>
      <span className="sr-only" role="status">
        {value} unread {label}
      </span>
    </>
  ) : null;
}
function Frame() {
  const session = useSession(),
    unread = useUnread(),
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
            {session.profile.role === "ORGANIZER" && (
              <NavLink to="/organizer/events">Manage events</NavLink>
            )}
            {session.profile.role === "USER" && (
              <NavLink to="/bookings">My bookings</NavLink>
            )}
            {session.profile.role === "ORGANIZER" && (
              <NavLink to="/organizer/bookings">Bookings</NavLink>
            )}
            {session.profile.role === "USER" && (
              <NavLink to="/subscriptions">My subscriptions</NavLink>
            )}
            {session.profile.role === "ORGANIZER" && (
              <NavLink to="/organizer/plans">Plans</NavLink>
            )}
            {session.profile.role === "USER" && (
              <NavLink to="/loyalty">Loyalty</NavLink>
            )}
            <NavLink to="/profile">Profile</NavLink>
            {session.profile.role !== "ADMIN" && (
              <NavLink to="/chat">Messages</NavLink>
            )}
            {session.profile.role !== "ADMIN" && (
              <Count value={unread.messages} label="messages" />
            )}
            <NavLink to="/notifications">Notifications</NavLink>
            <Count value={unread.notifications} label="notifications" />
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
function MemberOnly({ children }: { children: ReactNode }) {
  const session = useSession();
  return session.profile?.role === "ADMIN" ? (
    <Navigate to={homeFor("ADMIN")} replace />
  ) : (
    children
  );
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
                : "Manage members, organizers, activities, bookings, subscriptions and settings below. Platform reports arrive in a later release."}
          </p>
          <Link className="button" to="/profile">
            Complete your profile
          </Link>
          {profile.role === "ADMIN" && (
            <ul className="admin-sections">
              {adminSections.map(([to, text, about]) => (
                <li key={to}>
                  <Link to={to}>{text}</Link>
                  <p>{about}</p>
                </li>
              ))}
            </ul>
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
        <Route
          path="subscriptions"
          element={
            <Guard role="USER">
              <MySubscriptions />
            </Guard>
          }
        />
        <Route
          path="loyalty"
          element={
            <Guard role="USER">
              <MyLoyalty />
            </Guard>
          }
        />
        <Route
          path="admin/loyalty"
          element={
            <Guard role="ADMIN">
              <AdminLoyalty />
            </Guard>
          }
        />
        <Route
          path="subscription-plans/:id/purchase"
          element={
            <Guard role="USER">
              <PurchaseSubscription />
            </Guard>
          }
        />
        <Route
          path="organizer/plans"
          element={
            <Guard role="ORGANIZER">
              <Plans />
            </Guard>
          }
        />
        <Route
          path="organizer/plans/new"
          element={
            <Guard role="ORGANIZER">
              <PlanEditor />
            </Guard>
          }
        />
        <Route
          path="organizer/plans/:id/edit"
          element={
            <Guard role="ORGANIZER">
              <PlanEditor />
            </Guard>
          }
        />
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="events"
          element={
            <Guard>
              {session.profile?.role === "USER" && <Recommendations />}
              <EventCatalog />
              <HealthStatus />
            </Guard>
          }
        />
        <Route
          path="bookings"
          element={
            <Guard role="USER">
              <BookingList />
            </Guard>
          }
        />
        <Route
          path="bookings/new"
          element={
            <Guard role="USER">
              <BookingForm />
            </Guard>
          }
        />
        <Route
          path="bookings/calendar"
          element={
            <Guard role="USER">
              <BookingCalendar />
            </Guard>
          }
        />
        <Route
          path="bookings/:id"
          element={
            <Guard role="USER">
              <BookingDetails />
            </Guard>
          }
        />
        <Route
          path="organizer/bookings"
          element={
            <Guard role="ORGANIZER">
              <BookingList owned />
            </Guard>
          }
        />
        <Route
          path="organizer/bookings/:id"
          element={
            <Guard role="ORGANIZER">
              <BookingDetails owned />
            </Guard>
          }
        />
        <Route
          path="events/:id"
          element={
            <Guard>
              <EventDetails />
            </Guard>
          }
        />
        <Route
          path="organizers"
          element={
            <Guard>
              <OrganizerCatalog />
            </Guard>
          }
        />
        <Route
          path="organizers/:id"
          element={
            <Guard>
              <OrganizerDetails />
            </Guard>
          }
        />
        <Route
          path="organizer/events"
          element={
            <Guard role="ORGANIZER">
              <EventCatalog owned />
            </Guard>
          }
        />
        <Route
          path="organizer/events/new"
          element={
            <Guard role="ORGANIZER">
              <EventForm />
            </Guard>
          }
        />
        <Route
          path="organizer/events/:id"
          element={
            <Guard role="ORGANIZER">
              <EventManager />
            </Guard>
          }
        />
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
          path="admin/users"
          element={
            <Guard role="ADMIN">
              <AdminUsers />
            </Guard>
          }
        />
        <Route
          path="admin/users/:id"
          element={
            <Guard role="ADMIN">
              <AdminUserPage />
            </Guard>
          }
        />
        <Route
          path="admin/organizers"
          element={
            <Guard role="ADMIN">
              <AdminOrganizers />
            </Guard>
          }
        />
        <Route
          path="admin/organizers/:id"
          element={
            <Guard role="ADMIN">
              <AdminOrganizerPage />
            </Guard>
          }
        />
        <Route
          path="admin/events"
          element={
            <Guard role="ADMIN">
              <AdminEvents />
            </Guard>
          }
        />
        <Route
          path="admin/bookings"
          element={
            <Guard role="ADMIN">
              <AdminBookings />
            </Guard>
          }
        />
        <Route
          path="admin/subscriptions"
          element={
            <Guard role="ADMIN">
              <AdminSubscriptions />
            </Guard>
          }
        />
        <Route
          path="admin/dictionaries"
          element={
            <Guard role="ADMIN">
              <AdminDictionaries />
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
          path="chat"
          element={
            <Guard>
              <MemberOnly>
                <ChatList />
              </MemberOnly>
            </Guard>
          }
        />
        <Route
          path="chat/:id"
          element={
            <Guard>
              <MemberOnly>
                <ChatThread />
              </MemberOnly>
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
        <UnreadProvider>
          <Application />
        </UnreadProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
