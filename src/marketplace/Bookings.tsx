import { useCallback, useState, type FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { api, type Booking, type OrganizerBooking } from "../api/client";
import type { paths } from "../api/schema";
import { Feedback, text, useFormState } from "../components/forms";
import {
  dateTime,
  kyivInput,
  label,
  money,
  Pagination,
  useRemote,
} from "./shared";

import { subscriptionCovers } from "./Subscriptions";
import { PaymentForm, Receipts } from "./Payments";
import { StartChat } from "../pages/Chat";
export function BookingForm() {
  const [params] = useSearchParams(),
    id = params.get("eventId") ?? "",
    sessionId = params.get("sessionId") ?? "",
    state = useFormState(),
    navigate = useNavigate();
  const remote = useRemote(
    useCallback(async () => {
      const event = await api.event(id);
      let page = 1;
      while (true) {
        const response = await api.eventSessions(id, { page, pageSize: 100 });
        const session = response.items.find((s) => s.id === sessionId);
        if (session) return { event, session };
        if (page >= response.meta.totalPages)
          throw Error("This session is unavailable");
        page++;
      }
    }, [id, sessionId]),
  );
  const data = remote.data;
  const [seats, setSeats] = useState(1),
    [subscriptionId, setSubscription] = useState("");
  const quote = useRemote(
    useCallback(
      () =>
        api.quoteBooking({
          sessionId,
          seats,
          paymentMethod: subscriptionId ? "SUBSCRIPTION" : "CARD",
          ...(subscriptionId ? { subscriptionId } : {}),
        }),
      [sessionId, seats, subscriptionId],
    ),
  );
  const currentQuote =
    quote.data?.seats === seats &&
    (quote.data.subscriptionId ?? "") === subscriptionId
      ? quote.data
      : null;
  const subscriptions = useRemote(
    useCallback(() => api.activeSubscriptions(), []),
  );
  const eligible = data
    ? (subscriptions.data?.filter((s) =>
        subscriptionCovers(s, data.event, data.session.startsAt, seats),
      ) ?? [])
    : [];
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    void state.run(async () => {
      const b = await api.createBooking({
        sessionId,
        seats,
        comment: text(form, "comment"),
        paymentMethod: subscriptionId ? "SUBSCRIPTION" : "CARD",
        ...(subscriptionId ? { subscriptionId } : {}),
      });
      navigate(`/bookings/${b.id}`);
    });
  }
  return (
    <>
      <Feedback state={remote.state} />
      {data ? (
        <form className="panel" onSubmit={submit}>
          <h1>Book {data.event.title}</h1>
          <p>
            {dateTime(data.session.startsAt)} · {data.event.address}
          </p>
          <p>
            {data.event.kind === "HALL_RENTAL"
              ? `Exclusive hall for up to ${data.session.seatsTotal} people`
              : data.event.kind === "TEAM_SEARCH"
                ? "One participant per booking"
                : `${data.session.seatsAvailable} places available`}
          </p>
          <label>
            Places
            <input
              type="number"
              required
              min={1}
              max={
                ["HALL_RENTAL", "TEAM_SEARCH"].includes(data.event.kind)
                  ? 1
                  : Math.min(10, data.session.seatsAvailable)
              }
              value={seats}
              onChange={(e) => {
                setSeats(Number(e.target.value));
                setSubscription("");
              }}
            />
          </label>
          <label>
            Comment (optional)
            <textarea name="comment" maxLength={300} />
          </label>
          <Feedback state={quote.state} />
          {currentQuote && (
            <section aria-label="Current price breakdown">
              <p>Base price: {money(currentQuote.basePriceMinor)}</p>
              {currentQuote.discountBreakdown.map((d, i) => (
                <p key={i}>
                  {d.description}: -{money(d.amountMinor)}
                </p>
              ))}
              <p className="price">
                Current total: {money(currentQuote.amountDueMinor)}
              </p>
            </section>
          )}
          <p>
            The server fixes the final price when reserving your places
            {subscriptionId
              ? ""
              : ", applying free visits and your card discount"}
            .{" "}
            {subscriptionId
              ? "Covered by your subscription; organizer approval may still be required."
              : data.event.confirmationMode === "MANUAL"
                ? "The organizer must approve before payment."
                : data.event.effectivePriceMinor === 0
                  ? "No payment is required."
                  : "Pay after your places are reserved."}
          </p>
          <label>
            Payment method
            <select
              aria-label="Payment method"
              value={subscriptionId}
              onChange={(e) => setSubscription(e.target.value)}
            >
              <option value="">Card / free booking</option>
              {eligible.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.plan.name} -{" "}
                  {s.visitsLeft === null
                    ? "unlimited"
                    : s.visitsLeft + " visits left"}
                </option>
              ))}
            </select>
          </label>
          <Feedback state={subscriptions.state} />
          <p className="hint">
            Only subscriptions covering this session and number of places are
            offered. The price includes current loyalty benefits. Previewing
            does not reserve places or quota; the final price is fixed when you
            reserve.
          </p>
          <Feedback state={state} />
          <button
            disabled={state.busy || !seats || quote.state.busy || !currentQuote}
          >
            Reserve places
          </button>
        </form>
      ) : (
        <p>Loading booking details...</p>
      )}
    </>
  );
}
function BookingCard({
  booking,
  owned = false,
  user,
}: {
  booking: Booking;
  owned?: boolean;
  user?: OrganizerBooking["user"];
}) {
  return (
    <article className="panel">
      <span className="badge">{label(booking.status)}</span>
      <h2>
        <Link to={`${owned ? "/organizer" : ""}/bookings/${booking.id}`}>
          {booking.eventTitle}
        </Link>
      </h2>
      <p>{dateTime(booking.startsAt)}</p>
      <p>
        {booking.seats} place(s) · {money(booking.amountDueMinor)}
      </p>
      {user && <p>{user.displayName}</p>}
      {booking.deadlineAt && <p>Deadline: {dateTime(booking.deadlineAt)}</p>}
    </article>
  );
}
export function BookingList({
  owned = false,
  eventId,
}: {
  owned?: boolean;
  eventId?: string;
}) {
  const [params, setParams] = useSearchParams(),
    search = params.toString();
  const remote = useRemote(
    useCallback(async () => {
      const q = {
        ...Object.fromEntries(new URLSearchParams(search)),
        ...(eventId ? { eventId } : {}),
        page: Number(new URLSearchParams(search).get("page") ?? 1),
        pageSize: 20,
      };
      if (owned) {
        const r = await api.organizerBookings(
          q as paths["/api/organizer/bookings"]["get"]["parameters"]["query"],
        );
        return {
          ...r,
          items: r.items.map((v) => ({ booking: v.booking, user: v.user })),
        };
      }
      const r = await api.bookings(
        q as paths["/api/bookings"]["get"]["parameters"]["query"],
      );
      return {
        ...r,
        items: r.items.map((booking) => ({ booking, user: undefined })),
      };
    }, [search, owned, eventId]),
  );
  return (
    <>
      <div className="page-heading">
        <h1>{owned ? "Manage bookings" : "My bookings"}</h1>
        {!owned && <Link to="/bookings/calendar">Open calendar</Link>}
      </div>
      <form
        className="panel filters"
        key={search}
        onSubmit={(e) => {
          e.preventDefault();
          const next = new URLSearchParams();
          for (const [k, v] of new FormData(e.currentTarget))
            if (v) next.set(k, String(v));
          setParams(next);
        }}
      >
        <div className="filter-grid">
          <label>
            Show
            <select name="tab" defaultValue={params.get("tab") ?? ""}>
              <option value="">All bookings</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled, rejected and expired</option>
            </select>
          </label>
          <label>
            Status
            <select name="status" defaultValue={params.get("status") ?? ""}>
              <option value="">All statuses</option>
              {[
                "PENDING",
                "AWAITING_PAYMENT",
                "CONFIRMED",
                "COMPLETED",
                "CANCELLED",
                "REJECTED",
                "EXPIRED",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Event title
            <input name="title" defaultValue={params.get("title") ?? ""} />
          </label>
          {owned && (
            <label>
              User name
              <input
                name="userName"
                defaultValue={params.get("userName") ?? ""}
              />
            </label>
          )}
          <label>
            From date
            <input
              type="date"
              name="dateFrom"
              defaultValue={params.get("dateFrom") ?? ""}
            />
          </label>
          <label>
            To date
            <input
              type="date"
              name="dateTo"
              defaultValue={params.get("dateTo") ?? ""}
            />
          </label>
          <label>
            Sort
            <select
              name="sort"
              defaultValue={params.get("sort") ?? "startsAtAsc"}
            >
              <option value="startsAtAsc">Session, earliest first</option>
              <option value="startsAtDesc">Session, latest first</option>
              <option value="newest">Newest booking</option>
              <option value="oldest">Oldest booking</option>
            </select>
          </label>
        </div>
        <button>Apply filters</button>
        <button
          type="button"
          className="secondary"
          onClick={() => setParams({})}
        >
          Reset filters
        </button>
      </form>
      <Feedback state={remote.state} />
      {remote.data ? (
        <>
          <div className="event-grid">
            {remote.data.items.map(({ booking, user }) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                user={user}
                owned={owned}
              />
            ))}
          </div>
          {!remote.data.items.length && <p>No bookings match these filters.</p>}
          <Pagination
            meta={remote.data.meta}
            onPage={(page) => {
              const next = new URLSearchParams(params);
              next.set("page", String(page));
              setParams(next);
            }}
          />
        </>
      ) : (
        <p>Loading bookings...</p>
      )}
    </>
  );
}
export function BookingDetails({ owned = false }: { owned?: boolean }) {
  const { id = "" } = useParams(),
    state = useFormState(),
    [reason, setReason] = useState("");
  const remote = useRemote(
    useCallback(
      async () =>
        owned
          ? await api.organizerBooking(id)
          : { booking: await api.booking(id), user: undefined },
      [id, owned],
    ),
  );
  const b = remote.data?.booking;
  return (
    <>
      <Feedback state={remote.state} />
      {b ? (
        <>
          <div className="page-heading">
            <p className="eyebrow">{label(b.status)}</p>
            <h1>{b.eventTitle}</h1>
            <Link to={`/events/${b.eventId}`}>View activity</Link>
          </div>
          <div className="profile-layout">
            <section className="panel">
              <h2>Booking details</h2>
              <p>Reference: {b.id}</p>
              <p>
                {dateTime(b.startsAt)} – {dateTime(b.endsAt)}
              </p>
              <p>{b.address}</p>
              <p>{b.seats} place(s)</p>
              <p className="preserve-lines">{b.comment}</p>
              {remote.data?.user && (
                <>
                  <h3>{remote.data.user.displayName}</h3>
                  {remote.data.user.email && (
                    <p>
                      {remote.data.user.email} · {remote.data.user.phone}
                    </p>
                  )}
                  <StartChat input={{ bookingId: b.id }}>
                    Message this member
                  </StartChat>
                </>
              )}
              {b.deadlineAt && <p>Deadline: {dateTime(b.deadlineAt)}</p>}
              {b.changeRefundEligible && (
                <p className="alert">
                  The time or address changed. You may cancel for a full refund
                  until the session starts.
                </p>
              )}
              <Feedback state={state} />
              {(owned
                ? ["PENDING", "AWAITING_PAYMENT", "CONFIRMED"].includes(
                    b.status,
                  )
                : b.canCancel) && (
                <>
                  <label>
                    Reason {owned ? "(required)" : "(optional)"}
                    <textarea
                      maxLength={500}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </label>
                  <button
                    className="secondary"
                    disabled={state.busy || (owned && !reason.trim())}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Cancel this booking? Eligible payments are refunded in full.",
                        )
                      )
                        void state.run(async () => {
                          await api.cancelBooking(id, reason, owned);
                          remote.reload();
                        }, "Booking cancelled");
                    }}
                  >
                    Cancel booking
                  </button>
                </>
              )}
              {owned && b.status === "PENDING" && (
                <div className="button-row">
                  <button
                    disabled={state.busy}
                    onClick={() =>
                      void state.run(async () => {
                        await api.decideBooking(id, "APPROVE");
                        remote.reload();
                      }, "Request approved")
                    }
                  >
                    Approve request
                  </button>
                  <button
                    className="secondary"
                    disabled={state.busy}
                    onClick={() =>
                      void state.run(async () => {
                        await api.decideBooking(id, "REJECT", reason);
                        remote.reload();
                      }, "Request rejected")
                    }
                  >
                    Reject request
                  </button>
                </div>
              )}
            </section>
            <section className="panel">
              <h2>Price breakdown</h2>
              <p>Base price: {money(b.basePriceMinor)}</p>
              {b.discountBreakdown.map((d, i) => (
                <p key={i}>
                  {d.description}: −{money(d.amountMinor)}
                </p>
              ))}
              <p className="price">Total: {money(b.amountDueMinor)}</p>
              {b.paymentMethod === "SUBSCRIPTION" && (
                <p>
                  Covered by subscription. Reserved visits: {b.seats}. Visits
                  return once if rejected, cancelled or expired.
                </p>
              )}
              {b.paymentMethod === "FREE" && <p>No payment required.</p>}
              <p>
                {b.pointsAwarded === null
                  ? "Loyalty points are awarded when the booking is confirmed."
                  : `Loyalty points awarded: ${b.pointsAwarded}. They are reversed if this booking is cancelled.`}
              </p>
              {b.cancelReason && <p>Reason: {b.cancelReason}</p>}
            </section>
          </div>
          {!owned && b.canPay && (
            <PaymentForm booking={b} onPaid={remote.reload} />
          )}
          <Receipts booking={b} />
          <section className="panel section-space">
            <h2>Booking history</h2>
            <ol>
              {b.timeline.map((item, i) => (
                <li key={i}>
                  {dateTime(item.at)} · {label(item.to)} · {label(item.actor)}
                  {item.reason ? ` · ${item.reason}` : ""}
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : (
        <p>Loading booking...</p>
      )}
    </>
  );
}
const isoDay = (d: Date) => d.toISOString().slice(0, 10);
function calendarRange(selected: string, mode: string) {
  const date = new Date(`${selected}T12:00:00Z`),
    start = new Date(date),
    end = new Date(date);
  if (mode === "month") {
    start.setUTCDate(1);
    end.setUTCMonth(end.getUTCMonth() + 1, 0);
  } else {
    start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
    end.setTime(start.getTime() + 6 * 86400000);
  }
  return { from: isoDay(start), to: isoDay(end) };
}
export function BookingCalendar() {
  const [params, setParams] = useSearchParams(),
    mode = params.get("view") === "week" ? "week" : "month",
    selected =
      params.get("date") ?? kyivInput(new Date().toISOString()).slice(0, 10);
  const { from, to } = calendarRange(selected, mode);
  const remote = useRemote(
    useCallback(async () => {
      const items: Booking[] = [];
      let page = 1;
      while (true) {
        const r = await api.bookings({
          dateFrom: from,
          dateTo: to,
          page,
          pageSize: 100,
        });
        items.push(...r.items);
        if (page >= r.meta.totalPages) break;
        page++;
      }
      return items;
    }, [from, to]),
  );
  const bookings = remote.data;
  const days = [];
  for (
    let d = new Date(`${from}T12:00:00Z`);
    isoDay(d) <= to;
    d = new Date(d.getTime() + 86400000)
  )
    days.push(isoDay(d));
  function move(delta: number) {
    const next = new Date(`${selected}T12:00:00Z`);
    if (mode === "month") next.setUTCMonth(next.getUTCMonth() + delta);
    else next.setUTCDate(next.getUTCDate() + delta * 7);
    setParams({ view: mode, date: isoDay(next) });
  }
  return (
    <>
      <div className="page-heading">
        <h1>Booking calendar</h1>
        <Link to="/bookings">List view</Link>
      </div>
      <div className="button-row">
        <button onClick={() => move(-1)}>Previous</button>
        <label>
          Visible date
          <input
            type="date"
            value={selected}
            onChange={(e) => {
              if (e.target.value)
                setParams({ view: mode, date: e.target.value });
            }}
          />
        </label>
        <select
          aria-label="Calendar view"
          value={mode}
          onChange={(e) => setParams({ view: e.target.value, date: selected })}
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
        <button onClick={() => move(1)}>Next</button>
      </div>
      <p>
        Europe/Kyiv · {from} to {to}
      </p>
      <Feedback state={remote.state} />
      {bookings ? (
        <div className="calendar-grid">
          {days.map((day) => (
            <section className="calendar-day" key={day}>
              <h2>{day}</h2>
              {bookings
                .filter((b) => kyivInput(b.startsAt).startsWith(day))
                .map((b) => (
                  <Link
                    className={`calendar-booking status-${b.status.toLowerCase()}`}
                    key={b.id}
                    to={`/bookings/${b.id}`}
                  >
                    {kyivInput(b.startsAt).slice(11)} {b.eventTitle} ·{" "}
                    {label(b.status)}
                  </Link>
                ))}
            </section>
          ))}
        </div>
      ) : (
        <p>Loading calendar...</p>
      )}
    </>
  );
}
