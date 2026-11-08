import { useCallback, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, type OrganizerDashboard, type Statistics } from "../api/client";
import { Feedback, useFormState } from "../components/forms";
import { HealthStatus } from "../components/HealthStatus";
import { dateTime, money, useRemote } from "../marketplace/shared";
import { EventCard } from "../marketplace/Catalog";
import { AdminNav } from "./shared";
import { BarList, ColumnChart } from "./charts";

const periods: [string, string][] = [
  ["7d", "Last 7 days"],
  ["30d", "Last 30 days"],
  ["90d", "Last 90 days"],
  ["custom", "Custom"],
];
const percent = (ratio: string) => `${(Number(ratio) * 100).toFixed(1)}%`;

function Tile({
  name,
  value,
  note,
}: {
  name: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="stat-tile">
      <span className="stat-name">{name}</span>
      <strong className="stat-value">{value}</strong>
      {note && <span className="hint">{note}</span>}
    </div>
  );
}

function Totals({ data }: { data: Statistics }) {
  return (
    <section className="stat-grid" aria-label="Totals for the period">
      <Tile
        name="New members"
        value={data.users.toLocaleString("en-GB")}
        note="Registered in the period"
      />
      <Tile
        name="New organizers"
        value={data.organizers.toLocaleString("en-GB")}
        note="Registered in the period"
      />
      <Tile
        name="Activities published"
        value={data.activeEvents.toLocaleString("en-GB")}
        note="Created and active"
      />
      <Tile
        name="Bookings"
        value={data.bookings.toLocaleString("en-GB")}
        note="Created in the period"
      />
      <Tile
        name="Net payments"
        value={money(data.netRevenueMinor)}
        note="Successful payments minus refunds"
      />
      <Tile
        name="Booking conversion"
        value={percent(data.bookingConversion)}
        note="Created bookings that were confirmed"
      />
    </section>
  );
}

export function AdminStatistics() {
  const [params, setParams] = useSearchParams(),
    period = params.get("period") ?? "30d",
    search = params.toString();
  const remote = useRemote(
    useCallback(
      () =>
        api.statistics(
          (period === "custom"
            ? {
                period,
                dateFrom: params.get("dateFrom") ?? undefined,
                dateTo: params.get("dateTo") ?? undefined,
              }
            : { period }) as Parameters<typeof api.statistics>[0],
        ),
      [period, params],
    ),
  );
  function choose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget),
      next = new URLSearchParams({
        period: String(form.get("period") ?? "30d"),
      });
    if (next.get("period") === "custom") {
      next.set("dateFrom", String(form.get("dateFrom") ?? ""));
      next.set("dateTo", String(form.get("dateTo") ?? ""));
    }
    setParams(next);
  }
  const data = remote.data;
  return (
    <>
      <AdminNav />
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>Statistics</h1>
        <p className="muted">
          Records created in the period, in Europe/Kyiv days. Empty days are
          shown as zero.
        </p>
      </div>
      <form
        className="panel filters"
        key={search}
        onSubmit={choose}
        aria-label="Period"
      >
        <div
          className="button-row"
          role="radiogroup"
          aria-label="Period preset"
        >
          {periods.map(([value, text]) => (
            <label key={value} className="check-label">
              <input
                type="radio"
                name="period"
                value={value}
                defaultChecked={period === value}
              />{" "}
              {text}
            </label>
          ))}
        </div>
        <div className="filter-grid">
          <label>
            From
            <input
              type="date"
              name="dateFrom"
              defaultValue={params.get("dateFrom") ?? ""}
            />
          </label>
          <label>
            To
            <input
              type="date"
              name="dateTo"
              defaultValue={params.get("dateTo") ?? ""}
            />
          </label>
        </div>
        <div className="button-row">
          <button>Show statistics</button>
        </div>
      </form>
      <Feedback state={remote.state} />
      {!data ? (
        !remote.state.message && <p role="status">Loading statistics...</p>
      ) : (
        <>
          <p className="muted">
            Period: {data.dateFrom} to {data.dateTo}
          </p>
          <Totals data={data} />
          <div className="chart-grid section-space">
            <ColumnChart title="Bookings per day" data={data.bookingsByDay} />
            <ColumnChart
              title="Activities created per day"
              data={data.eventsByDay}
            />
            <ColumnChart
              title="Registrations per day"
              data={data.registrationsByDay}
            />
            <BarList title="Bookings by status" data={data.bookingsByStatus} />
            <BarList
              title="Top ten activities by bookings"
              data={data.topEvents}
              wide
            />
            <BarList
              title="Bookings by direction"
              data={data.bookingsByDirection}
            />
            <BarList title="Bookings by city" data={data.bookingsByCity} />
            <BarList title="Activities by kind" data={data.eventsByKind} />
            <BarList
              title="Activities by direction"
              data={data.eventsByDirection}
            />
            <BarList title="Activities by city" data={data.eventsByCity} />
            <BarList
              title="Registrations by role"
              data={data.registrationsByRole}
            />
            <BarList title="Members by city" data={data.usersByCity} />
            <BarList title="Members by gender" data={data.usersByGender} />
            <BarList title="Members by card tier" data={data.usersByCard} />
          </div>
          <p className="hint section-space">
            Money is shown in UAH. Counts and money cover the whole period and
            are not split by organizer; use an organizer's dashboard for their
            own figures.
          </p>
        </>
      )}
    </>
  );
}

/** Organizer dashboard: counters for the signed-in organizer or an administrator's view of one organizer. */
export function DashboardView({
  data,
  title,
}: {
  data: OrganizerDashboard;
  title: string;
}) {
  return (
    <>
      <section className="stat-grid" aria-label={title}>
        <Tile
          name="Activities"
          value={String(data.totalEvents)}
          note={`${data.activeEvents} active · ${data.pausedEvents} paused`}
        />
        <Tile
          name="Upcoming sessions"
          value={String(data.futureSessions)}
          note="Scheduled and in the future"
        />
        <Tile
          name="Active bookings"
          value={String(data.activeFutureBookings)}
          note="Pending, awaiting payment or confirmed"
        />
        <Tile
          name="New requests"
          value={String(data.pendingRequests)}
          note="Waiting for your decision"
        />
        <Tile
          name="Revenue this month"
          value={money(data.currentMonthNetRevenueMinor)}
          note="Payments minus refunds"
        />
        <Tile
          name="Unread messages"
          value={String(data.unreadMessages)}
          note="From members"
        />
        <Tile
          name="Completed activities"
          value={String(data.completedEvents)}
          note="No upcoming sessions"
        />
      </section>
      <div className="chart-grid section-space">
        <ColumnChart
          title="Bookings in the last 30 days"
          data={data.bookingsLast30Days}
        />
      </div>
    </>
  );
}

export function OrganizerDashboardPage() {
  const remote = useRemote(useCallback(() => api.organizerDashboard(), []));
  const state = useFormState();
  const lists = useRemote(
    useCallback(
      async () => ({
        requests: await api.organizerBookings({
          status: "PENDING",
          tab: "upcoming",
          pageSize: 5,
        }),
        events: await api.events({ pageSize: 6, sort: "nearest" }, true),
      }),
      [],
    ),
  );
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">YOUR ORGANIZER SPACE</p>
        <h1>Dashboard</h1>
        <p className="muted">
          Your activities and bookings only. Revenue is payments minus refunds
          in Kyiv time.
        </p>
      </div>
      <p className="button-row">
        <Link className="button" to="/organizer/events">
          Manage activities
        </Link>
        <Link className="button secondary" to="/organizer/bookings">
          Review bookings
        </Link>
        <Link className="button secondary" to="/chat">
          Messages
        </Link>
      </p>
      <Feedback state={remote.state} />
      <HealthStatus />
      {!remote.data ? (
        !remote.state.message && <p role="status">Loading dashboard...</p>
      ) : (
        <DashboardView data={remote.data} title="Your figures" />
      )}
      <Feedback state={lists.state} />
      <Feedback state={state} />
      {lists.data && (
        <>
          <section className="panel section-space">
            <h2>New booking requests</h2>
            {lists.data.requests.items.length ? (
              lists.data.requests.items.map(({ booking, user }) => (
                <article className="session-management" key={booking.id}>
                  <h3>
                    <Link to={`/organizer/bookings/${booking.id}`}>
                      {booking.eventTitle}
                    </Link>
                  </h3>
                  <p>
                    {user.displayName} - {dateTime(booking.startsAt)} -{" "}
                    {booking.seats} place(s)
                  </p>
                  <div className="button-row">
                    <button
                      disabled={state.busy}
                      onClick={() =>
                        void state.run(async () => {
                          await api.decideBooking(booking.id, "APPROVE");
                          lists.reload();
                          remote.reload();
                        }, "Request approved")
                      }
                    >
                      Approve request
                    </button>
                    <button
                      className="secondary"
                      disabled={state.busy}
                      onClick={() => {
                        const reason = window.prompt(
                          "Rejection reason (optional)",
                        );
                        if (reason !== null)
                          void state.run(async () => {
                            await api.decideBooking(
                              booking.id,
                              "REJECT",
                              reason,
                            );
                            lists.reload();
                            remote.reload();
                          }, "Request rejected");
                      }}
                    >
                      Reject request
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p>No pending requests.</p>
            )}
            <Link to="/organizer/bookings?status=PENDING">
              View all requests
            </Link>
          </section>
          <section className="panel section-space">
            <h2>Upcoming sessions</h2>
            <p className="hint">
              Next session for each activity shown below. Open an activity to
              manage its full schedule.
            </p>
            {lists.data.events.items
              .filter((e) => e.nextSession)
              .map((e) => (
                <article className="session-management" key={e.id}>
                  <Link to={`/organizer/events/${e.id}`}>{e.title}</Link>
                  <p>
                    {dateTime(e.nextSession!.startsAt)} -{" "}
                    {e.nextSession!.seatsAvailable} available /{" "}
                    {e.nextSession!.seatsTotal} total
                  </p>
                </article>
              ))}
            {!lists.data.events.items.some((e) => e.nextSession) && (
              <p>No upcoming sessions in this activity page.</p>
            )}
          </section>
          <section className="section-space">
            <h2>Your activities</h2>
            <div className="event-grid">
              {lists.data.events.items.map((event) => (
                <EventCard key={event.id} event={event} owned />
              ))}
            </div>
            <Link to="/organizer/events">
              View all activities and availability
            </Link>
          </section>
        </>
      )}
    </>
  );
}
