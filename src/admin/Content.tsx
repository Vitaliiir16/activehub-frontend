import { useCallback, useState, type FormEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, type Event } from "../api/client";
import type { paths } from "../api/schema";
import { Feedback, useFormState } from "../components/forms";
import { dateTime, label, money, Pagination, useRemote } from "../marketplace/shared";
import { AdminNav, DataTable, ReasonAction, StatusBadge, field, filterParams, queryOf, shortId } from "./shared";

function Filters({ search, onApply, children }: { search: string; onApply: (next: URLSearchParams) => void; children: ReactNode }) {
  return (
    <form
      className="panel filters"
      key={search}
      onSubmit={(e) => {
        e.preventDefault();
        onApply(filterParams(e.currentTarget));
      }}
    >
      <div className="filter-grid">{children}</div>
      <div className="button-row">
        <button>Apply filters</button>
        <button type="button" className="secondary" onClick={() => onApply(new URLSearchParams())}>
          Reset
        </button>
      </div>
    </form>
  );
}
const Input = ({ name, text, params, type = "text", placeholder }: { name: string; text: string; params: URLSearchParams; type?: string; placeholder?: string }) => (
  <label>
    {text}
    <input name={name} type={type} defaultValue={params.get(name) ?? ""} placeholder={placeholder} />
  </label>
);
const Select = ({ name, text, params, options, all }: { name: string; text: string; params: URLSearchParams; options: [string, string][]; all: string }) => (
  <label>
    {text}
    <select name={name} defaultValue={params.get(name) ?? ""}>
      <option value="">{all}</option>
      {options.map(([value, name]) => (
        <option key={value} value={value}>
          {name}
        </option>
      ))}
    </select>
  </label>
);
const pager = (params: URLSearchParams, setParams: (p: URLSearchParams) => void) => (page: number) => {
  const next = new URLSearchParams(params);
  next.set("page", String(page));
  setParams(next);
};
const kinds = ["TRAINING", "SECTION", "HALL_RENTAL", "TEAM_SEARCH", "EVENT"];
const eventStatuses = ["ACTIVE", "PAUSED", "CANCELLED", "BLOCKED", "DELETED"];
const bookingStatuses = ["PENDING", "AWAITING_PAYMENT", "CONFIRMED", "REJECTED", "CANCELLED", "EXPIRED", "COMPLETED"];

function EventModeration({ event, onChanged }: { event: Event; onChanged: () => void }) {
  const edit = useFormState(),
    photos = useFormState();
  const closed = ["CANCELLED", "DELETED"].includes(event.status);
  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const changes: Record<string, string> = {};
    if (field(form, "title") !== event.title) changes.title = field(form, "title");
    if (field(form, "description") !== event.description) changes.description = field(form, "description");
    void edit.run(async () => {
      if (!Object.keys(changes).length) throw new Error("Change the title or description");
      await api.adminEditEvent(event.id, changes);
      onChanged();
    }, "Event updated. The organizer was notified.");
  }
  return (
    <div className="moderation">
      <form onSubmit={save} aria-label={`Edit text of ${event.title}`}>
        <Feedback state={edit} />
        <label>
          Title
          <input name="title" defaultValue={event.title} required minLength={3} maxLength={120} disabled={closed} />
        </label>
        <label>
          Description
          <textarea name="description" defaultValue={event.description} rows={3} maxLength={5000} disabled={closed} />
        </label>
        <button disabled={edit.busy || closed}>Save text</button>
      </form>
      {event.photos.length > 0 && (
        <div>
          <h4>Photos</h4>
          <Feedback state={photos} />
          <ul className="photo-moderation">
            {event.photos.map((p, i) => (
              <li key={p.id}>
                <img src={p.url} alt={`Photo ${i + 1} of ${event.title}`} loading="lazy" />
                <button
                  className="danger"
                  disabled={photos.busy}
                  onClick={() =>
                    void photos.run(async () => {
                      await api.adminDeletePhoto(p.id);
                      onChanged();
                    }, "Photo removed")
                  }
                >
                  Remove photo {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="button-row">
        {event.status === "ACTIVE" && (
          <ReasonAction
            name="Block event"
            description="A blocked event is hidden from members; existing bookings are kept. The organizer is notified."
            onConfirm={async (reason) => {
              await api.adminEventStatus(event.id, "BLOCKED", reason);
              onChanged();
            }}
          />
        )}
        {event.status === "BLOCKED" && (
          <ReasonAction
            name="Unblock event"
            onConfirm={async (reason) => {
              await api.adminEventStatus(event.id, "ACTIVE", reason);
              onChanged();
            }}
          />
        )}
        {!closed && (
          <ReasonAction
            name="Cancel event"
            danger
            description="Cancels every session and active booking, refunds paid bookings and notifies members and the organizer."
            onConfirm={async (reason) => {
              await api.adminCancelEvent(event.id, reason, crypto.randomUUID());
              onChanged();
            }}
          />
        )}
        {event.status !== "DELETED" && (
          <ReasonAction
            name="Delete event"
            danger
            description="Removes the event with the same cancellations and refunds. History is kept."
            onConfirm={async (reason) => {
              await api.adminDeleteEvent(event.id, reason, crypto.randomUUID());
              onChanged();
            }}
          />
        )}
      </div>
    </div>
  );
}

export function AdminEvents() {
  const [params, setParams] = useSearchParams(),
    search = params.toString(),
    [open, setOpen] = useState<string | null>(null);
  const cities = useRemote(useCallback(() => api.adminDictionary("cities", { pageSize: 100 }), []));
  const directions = useRemote(useCallback(() => api.adminDictionary("directions", { pageSize: 100 }), []));
  const remote = useRemote(
    useCallback(() => api.adminEvents(queryOf(search, { sort: params.get("sort") ?? "newest" }) as paths["/api/admin/events"]["get"]["parameters"]["query"]), [search, params]),
  );
  return (
    <>
      <AdminNav />
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>Events</h1>
        <p className="muted">Every organizer's events in every status, including events without upcoming sessions.</p>
      </div>
      <Filters search={search} onApply={setParams}>
        <Input name="id" text="Event ID" params={params} placeholder="Exact event ID" />
        <Input name="title" text="Title" params={params} />
        <Input name="organizerId" text="Organizer ID" params={params} placeholder="Exact organizer ID" />
        <Select name="cityId" text="City" params={params} all="All cities" options={(cities.data?.items ?? []).map((c) => [c.id, c.name])} />
        <Select name="directionId" text="Direction" params={params} all="All directions" options={(directions.data?.items ?? []).map((d) => [d.id, d.name])} />
        <Select name="kind" text="Kind" params={params} all="All kinds" options={kinds.map((k) => [k, label(k)])} />
        <Select name="status" text="Status" params={params} all="All statuses" options={eventStatuses.map((k) => [k, label(k)])} />
        <Input name="dateFrom" text="Session from" type="date" params={params} />
        <Input name="dateTo" text="Session to" type="date" params={params} />
        <Select
          name="sort"
          text="Sort"
          params={params}
          all="Newest first"
          options={[["nearest", "Nearest session"], ["priceAsc", "Price, low to high"], ["priceDesc", "Price, high to low"]]}
        />
      </Filters>
      <Feedback state={remote.state} />
      <section className="panel section-space">
        {!remote.data ? (
          !remote.state.message && <p role="status">Loading events...</p>
        ) : (
          <>
            <p className="muted">{remote.data.meta.totalItems} found</p>
            <DataTable
              caption="Event search results"
              head={["Event", "Organizer", "Place", "Next session", "Status", "Actions"]}
              empty="No events match these filters."
              rows={remote.data.items.length}
            >
              {remote.data.items.flatMap((e) => [
                <tr key={e.id}>
                  <td>
                    <Link to={`/events/${e.id}`}>{e.title}</Link>
                    <br />
                    <span className="hint">
                      {label(e.kind)} · {shortId(e.id)}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/organizers/${e.organizer.id}`}>{e.organizer.name}</Link>
                  </td>
                  <td>
                    {e.city.name} · {e.direction.name}
                  </td>
                  <td>{e.nextSession ? dateTime(e.nextSession.startsAt) : "None upcoming"}</td>
                  <td>
                    <StatusBadge value={e.status} />
                  </td>
                  <td>
                    <button
                      className="secondary"
                      aria-expanded={open === e.id}
                      onClick={() => setOpen(open === e.id ? null : e.id)}
                    >
                      {open === e.id ? "Close" : "Moderate"}
                    </button>
                  </td>
                </tr>,
                open === e.id ? (
                  <tr key={`${e.id}-panel`}>
                    <td colSpan={6}>
                      <EventModeration event={e} onChanged={remote.reload} />
                    </td>
                  </tr>
                ) : null,
              ])}
            </DataTable>
            <Pagination meta={remote.data.meta} onPage={pager(params, setParams)} />
          </>
        )}
      </section>
    </>
  );
}

export function AdminBookings() {
  const [params, setParams] = useSearchParams(),
    search = params.toString();
  const remote = useRemote(
    useCallback(
      () => api.adminBookings(queryOf(search, { sort: params.get("sort") ?? "newest" }) as paths["/api/admin/bookings"]["get"]["parameters"]["query"]),
      [search, params],
    ),
  );
  return (
    <>
      <AdminNav />
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>Bookings</h1>
        <p className="muted">Cancelling refunds paid bookings once, returns visits and points and notifies both sides.</p>
      </div>
      <Filters search={search} onApply={setParams}>
        <Input name="id" text="Booking ID" params={params} placeholder="Exact booking ID" />
        <Select name="status" text="Status" params={params} all="All statuses" options={bookingStatuses.map((k) => [k, label(k)])} />
        <Input name="userId" text="User ID" params={params} placeholder="Exact user ID" />
        <Input name="organizerId" text="Organizer ID" params={params} placeholder="Exact organizer ID" />
        <Input name="eventId" text="Event ID" params={params} placeholder="Exact event ID" />
        <Input name="eventName" text="Event title" params={params} />
        <Input name="dateFrom" text="Session from" type="date" params={params} />
        <Input name="dateTo" text="Session to" type="date" params={params} />
        <Select
          name="sort"
          text="Sort"
          params={params}
          all="Newest first"
          options={[["startsAtAsc", "Session, earliest first"], ["startsAtDesc", "Session, latest first"]]}
        />
      </Filters>
      <Feedback state={remote.state} />
      <section className="panel section-space">
        {!remote.data ? (
          !remote.state.message && <p role="status">Loading bookings...</p>
        ) : (
          <>
            <p className="muted">{remote.data.meta.totalItems} found</p>
            <DataTable
              caption="Booking search results"
              head={["Event", "Member", "Session", "Places", "Amount", "Status", "Actions"]}
              empty="No bookings match these filters."
              rows={remote.data.items.length}
            >
              {remote.data.items.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link to={`/events/${b.eventId}`}>{b.eventTitle}</Link>
                    <br />
                    <span className="hint">
                      <Link to={`/admin/organizers/${b.organizerId}`}>Organizer</Link> · {shortId(b.id)}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/users/${b.userId}`}>{shortId(b.userId)}</Link>
                  </td>
                  <td>{dateTime(b.startsAt)}</td>
                  <td>{b.seats}</td>
                  <td>
                    {money(b.amountDueMinor)}
                    <br />
                    <span className="hint">{label(b.paymentMethod)}</span>
                  </td>
                  <td>
                    <StatusBadge value={b.status} />
                  </td>
                  <td>
                    {["PENDING", "AWAITING_PAYMENT", "CONFIRMED"].includes(b.status) ? (
                      <ReasonAction
                        name="Cancel booking"
                        danger
                        description="Releases the places, refunds any payment, returns visits and points and notifies the member and organizer."
                        onConfirm={async (reason) => {
                          await api.adminCancelBooking(b.id, reason, crypto.randomUUID());
                          remote.reload();
                        }}
                      />
                    ) : (
                      <span className="hint">{b.cancelReason ?? "Final"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </DataTable>
            <Pagination meta={remote.data.meta} onPage={pager(params, setParams)} />
          </>
        )}
      </section>
    </>
  );
}

export function AdminSubscriptions() {
  const [params, setParams] = useSearchParams(),
    search = params.toString(),
    view = params.get("view") === "plans" ? "plans" : "purchases",
    archive = useFormState();
  const plans = useRemote(
    useCallback(
      () =>
        view === "plans"
          ? api.adminPlans(queryOf(search, {}) as paths["/api/admin/subscription-plans"]["get"]["parameters"]["query"])
          : Promise.resolve(null),
      [view, search],
    ),
  );
  const purchases = useRemote(
    useCallback(
      () =>
        view === "purchases"
          ? api.adminSubscriptions(queryOf(search, {}) as paths["/api/admin/subscriptions"]["get"]["parameters"]["query"])
          : Promise.resolve(null),
      [view, search],
    ),
  );
  const switchView = (next: "plans" | "purchases") => {
    const p = new URLSearchParams();
    p.set("view", next);
    setParams(p);
  };
  return (
    <>
      <AdminNav />
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>Subscriptions</h1>
        <p className="muted">Archiving a plan stops new purchases; existing purchases keep working.</p>
      </div>
      <div className="button-row" role="group" aria-label="Subscription views">
        <button className={view === "purchases" ? undefined : "secondary"} aria-pressed={view === "purchases"} onClick={() => switchView("purchases")}>
          Purchased subscriptions
        </button>
        <button className={view === "plans" ? undefined : "secondary"} aria-pressed={view === "plans"} onClick={() => switchView("plans")}>
          Plans
        </button>
      </div>
      <Filters search={search} onApply={(next) => setParams(new URLSearchParams([["view", view], ...next]))}>
        {view === "purchases" && <Input name="userId" text="User ID" params={params} placeholder="Exact user ID" />}
        <Input name="organizerId" text="Organizer ID" params={params} placeholder="Exact organizer ID" />
        <Select
          name="status"
          text="Status"
          params={params}
          all="All statuses"
          options={(view === "plans" ? ["ACTIVE", "ARCHIVED"] : ["ACTIVE", "EXHAUSTED", "EXPIRED"]).map((s) => [s, label(s)])}
        />
      </Filters>
      <Feedback state={view === "plans" ? plans.state : purchases.state} />
      <Feedback state={archive} />
      <section className="panel section-space">
        {view === "plans" ? (
          !plans.data ? (
            !plans.state.message && <p role="status">Loading plans...</p>
          ) : (
            <>
              <p className="muted">{plans.data.meta.totalItems} found</p>
              <DataTable
                caption="Plan search results"
                head={["Plan", "Organizer", "Type", "Price", "Visits", "Status", "Actions"]}
                empty="No plans match these filters."
                rows={plans.data.items.length}
              >
                {plans.data.items.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>
                      <Link to={`/admin/organizers/${p.organizerId}`}>{shortId(p.organizerId)}</Link>
                    </td>
                    <td>{label(p.type)}</td>
                    <td>{money(p.priceMinor)}</td>
                    <td>{p.visitsLimit ?? "Unlimited"}</td>
                    <td>
                      <StatusBadge value={p.status} />
                    </td>
                    <td>
                      {p.status === "ACTIVE" ? (
                        <ReasonAction
                          name={`Archive plan ${p.name}`}
                          needsReason={false}
                          description="New purchases stop; existing purchases keep working."
                          onConfirm={async () => {
                            await api.adminArchivePlan(p.id);
                            plans.reload();
                          }}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </DataTable>
              <Pagination meta={plans.data.meta} onPage={pager(params, setParams)} />
            </>
          )
        ) : !purchases.data ? (
          !purchases.state.message && <p role="status">Loading subscriptions...</p>
        ) : (
          <>
            <p className="muted">{purchases.data.meta.totalItems} found</p>
            <DataTable
              caption="Purchased subscription search results"
              head={["Plan", "Member", "Type", "Visits left", "Valid until", "Status"]}
              empty="No subscriptions match these filters."
              rows={purchases.data.items.length}
            >
              {purchases.data.items.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.plan.name}
                    {s.companyName ? <span className="hint"> · {s.companyName}</span> : null}
                  </td>
                  <td>
                    <Link to={`/admin/users/${s.userId}`}>{shortId(s.userId)}</Link>
                  </td>
                  <td>{label(s.plan.type)}</td>
                  <td>{s.visitsLeft ?? "Unlimited"}</td>
                  <td>{dateTime(s.expiresAt)}</td>
                  <td>
                    <StatusBadge value={s.status} />
                  </td>
                </tr>
              ))}
            </DataTable>
            <Pagination meta={purchases.data.meta} onPage={pager(params, setParams)} />
          </>
        )}
      </section>
    </>
  );
}
