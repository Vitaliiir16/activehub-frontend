import { useCallback, useRef, useState, type FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { api, type Event } from "../api/client";
import type { components, paths } from "../api/schema";
import { Feedback, text, useFormState } from "../components/forms";
import { dateTime, label, minor, money, Pagination, useRemote } from "./shared";
import { useSession } from "../session";
type Plan = components["schemas"]["SubscriptionPlan"];
export type Subscription = components["schemas"]["UserSubscription"];
export const subscriptionCovers = (
  s: Subscription,
  e: Event,
  startsAt: string,
  seats: number,
) =>
  s.status === "ACTIVE" &&
  s.plan.organizerId === e.organizer.id &&
  Date.parse(s.expiresAt) > Date.now() &&
  Date.parse(startsAt) >= Date.parse(s.startsAt) &&
  Date.parse(startsAt) < Date.parse(s.expiresAt) &&
  (s.visitsLeft === null || s.visitsLeft >= seats) &&
  (s.plan.scope === "ALL_EVENTS" ||
    s.plan.directionIds.includes(e.direction.id));
function Terms({ plan }: { plan: Plan }) {
  return (
    <>
      <p>
        {label(plan.type)} - {plan.validityDays} days -{" "}
        {plan.visitsLimit === null
          ? "Unlimited visits"
          : `${plan.visitsLimit} visit(s)`}
      </p>
      <p>
        {plan.scope === "ALL_EVENTS"
          ? "All organizer activities"
          : `Directions: ${plan.directionNames?.join(", ") || "Selected directions"}`}
      </p>
      <p>{plan.description}</p>
      <p className="price">{money(plan.priceMinor)}</p>
    </>
  );
}
export function Plans({ organizerId }: { organizerId?: string }) {
  const [page, setPage] = useState(1),
    state = useFormState(),
    role = useSession().profile?.role;
  const remote = useRemote(
    useCallback(() => api.plans(organizerId, page), [organizerId, page]),
  );
  return (
    <section className="section-space">
      <div className="page-heading">
        <h1>
          {organizerId ? "Subscription plans" : "Manage subscription plans"}
        </h1>
        {!organizerId && (
          <Link className="button" to="/organizer/plans/new">
            Create plan
          </Link>
        )}
      </div>
      <Feedback state={remote.state} />
      <Feedback state={state} />
      {remote.data ? (
        <>
          <div className="event-grid">
            {remote.data.items.map((p) => (
              <article className="panel" key={p.id}>
                <h2>{p.name}</h2>
                <Terms plan={p} />
                {organizerId ? (
                  role === "USER" && (
                    <Link
                      className="button"
                      to={`/subscription-plans/${p.id}/purchase`}
                    >
                      Buy subscription
                    </Link>
                  )
                ) : (
                  <>
                    <p>{label(p.status)}</p>
                    {p.status === "ACTIVE" && (
                      <div className="button-row">
                        <Link
                          className="button secondary"
                          to={`/organizer/plans/${p.id}/edit`}
                        >
                          Edit plan
                        </Link>
                        <button
                          disabled={state.busy}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Archive this plan? Purchased subscriptions keep their original terms.",
                              )
                            )
                              void state.run(async () => {
                                await api.archivePlan(p.id);
                                remote.reload();
                              }, "Plan archived");
                          }}
                        >
                          Archive plan
                        </button>
                      </div>
                    )}
                  </>
                )}
              </article>
            ))}
          </div>
          {!remote.data.items.length && <p>No plans available.</p>}
          <Pagination meta={remote.data.meta} onPage={setPage} />
        </>
      ) : (
        <p>Loading plans...</p>
      )}
    </section>
  );
}
export function PlanEditor() {
  const { id } = useParams(),
    state = useFormState(),
    navigate = useNavigate();
  const remote = useRemote(
    useCallback(
      async () => ({
        plan: id ? await api.plan(id) : undefined,
        directions: await api.dictionaries("directions", true),
      }),
      [id],
    ),
  );
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    void state.run(async () => {
      const scope = text(form, "scope") as Plan["scope"];
      await api.savePlan(
        {
          name: text(form, "name"),
          type: text(form, "type") as Plan["type"],
          description: text(form, "description"),
          priceMinor: minor(text(form, "price")),
          validityDays: Number(text(form, "validityDays")),
          visitsLimit: form.has("unlimited")
            ? null
            : Number(text(form, "visitsLimit")),
          scope,
          directionIds:
            scope === "ALL_EVENTS"
              ? []
              : form.getAll("directionIds").map(String),
        },
        id,
      );
      navigate("/organizer/plans");
    });
  }
  const p = remote.data?.plan;
  return (
    <>
      <Feedback state={remote.state} />
      {remote.data ? (
        <form className="panel" key={id ?? "new"} onSubmit={submit}>
          <h1>{id ? "Edit plan" : "Create subscription plan"}</h1>
          <p>
            Edits apply only to future purchases. Purchased terms remain
            unchanged.
          </p>
          <div className="filter-grid">
            <label>
              Name
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                defaultValue={p?.name}
              />
            </label>
            <label>
              Plan type
              <select
                aria-label="Plan type"
                name="type"
                defaultValue={p?.type ?? "ONE_TIME"}
              >
                <option>ONE_TIME</option>
                <option>MONTHLY</option>
                <option>CORPORATE</option>
              </select>
            </label>
            <label>
              Price (UAH)
              <input
                name="price"
                required
                type="number"
                min={0}
                max={100000}
                step="0.01"
                defaultValue={(p?.priceMinor ?? 0) / 100}
              />
            </label>
            <label>
              Validity (days)
              <input
                name="validityDays"
                required
                type="number"
                min={1}
                max={36500}
                defaultValue={p?.validityDays ?? 30}
              />
            </label>
            <label>
              Visit limit
              <input
                name="visitsLimit"
                type="number"
                min={1}
                max={2147483647}
                defaultValue={p?.visitsLimit ?? 1}
              />
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                name="unlimited"
                defaultChecked={p?.visitsLimit === null}
              />
              Unlimited visits (monthly only)
            </label>
            <label>
              Scope
              <select
                aria-label="Scope"
                name="scope"
                defaultValue={p?.scope ?? "ALL_EVENTS"}
              >
                <option value="ALL_EVENTS">All organizer events</option>
                <option value="DIRECTIONS">Selected directions</option>
              </select>
            </label>
          </div>
          <fieldset>
            <legend>
              Directions (used only for selected-directions scope)
            </legend>
            {remote.data.directions.map((d) => (
              <label className="check-label" key={d.id}>
                <input
                  type="checkbox"
                  name="directionIds"
                  value={d.id}
                  defaultChecked={p?.directionIds.includes(d.id)}
                  disabled={!d.isActive && !p?.directionIds.includes(d.id)}
                />
                {d.name}
              </label>
            ))}
          </fieldset>
          <label>
            Description
            <textarea
              name="description"
              maxLength={5000}
              defaultValue={p?.description}
            />
          </label>
          <p className="hint">
            One-time: exactly one visit. Corporate: company name at purchase and
            at least two visits. Monthly: limited or unlimited visits.
          </p>
          <Feedback state={state} />
          <button disabled={state.busy}>Save plan</button>
        </form>
      ) : (
        <p>Loading plan...</p>
      )}
    </>
  );
}
export function PurchaseSubscription() {
  const { id = "" } = useParams(),
    state = useFormState(),
    attempt = useRef<{ body: string; key: string } | null>(null),
    navigate = useNavigate();
  const remote = useRemote(useCallback(() => api.plan(id), [id]));
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const element = e.currentTarget,
      form = new FormData(element);
    void state.run(async () => {
      const body = {
        planId: id,
        ...(remote.data?.type === "CORPORATE"
          ? { companyName: text(form, "companyName") }
          : {}),
        card: {
          number: text(form, "number").replaceAll(/\s/g, ""),
          holder: text(form, "holder"),
          expiryMonth: Number(text(form, "expiryMonth")),
          expiryYear: Number(text(form, "expiryYear")),
          cvv: text(form, "cvv"),
        },
      };
      const fingerprint = JSON.stringify(body);
      if (attempt.current?.body !== fingerprint)
        attempt.current = { body: fingerprint, key: crypto.randomUUID() };
      const result = await api.purchaseSubscription(body, attempt.current!.key);
      attempt.current = null;
      if (result.payment.status === "FAILED") {
        element.reset();
        throw Error(
          "The simulated card was declined. No subscription was created. Try again.",
        );
      }
      navigate("/subscriptions");
    });
  }
  return (
    <>
      <Feedback state={remote.state} />
      {remote.data ? (
        <form className="panel" onSubmit={submit}>
          <h1>Buy {remote.data.name}</h1>
          <Terms plan={remote.data} />
          <p>
            Subscription purchases are non-refundable. No real money is charged.
          </p>
          {remote.data.type === "CORPORATE" && (
            <label>
              Company name
              <input
                name="companyName"
                required
                minLength={2}
                maxLength={100}
              />
            </label>
          )}
          <div className="filter-grid">
            <label>
              Card number
              <input
                name="number"
                inputMode="numeric"
                required
                pattern="[0-9 ]{13,23}"
                maxLength={23}
                autoComplete="off"
              />
            </label>
            <label>
              Cardholder
              <input
                name="holder"
                required
                minLength={2}
                maxLength={100}
                autoComplete="off"
              />
            </label>
            <label>
              Expiry month
              <input
                name="expiryMonth"
                required
                type="number"
                min={1}
                max={12}
                autoComplete="off"
              />
            </label>
            <label>
              Expiry year
              <input
                name="expiryYear"
                required
                type="number"
                min={new Date().getUTCFullYear()}
                max={9999}
                autoComplete="off"
              />
            </label>
            <label>
              CVV
              <input
                name="cvv"
                type="password"
                required
                inputMode="numeric"
                pattern="[0-9]{3,4}"
                maxLength={4}
                autoComplete="off"
              />
            </label>
          </div>
          <Feedback state={state} />
          <button disabled={state.busy || remote.data.status !== "ACTIVE"}>
            {state.busy ? "Processing..." : "Buy subscription"}
          </button>
        </form>
      ) : (
        <p>Loading plan...</p>
      )}
    </>
  );
}
export function MySubscriptions() {
  const [params, setParams] = useSearchParams(),
    search = params.toString();
  const remote = useRemote(
    useCallback(async () => {
      const q = {
        ...Object.fromEntries(new URLSearchParams(search)),
        page: Number(new URLSearchParams(search).get("page") ?? 1),
        pageSize: 20,
      } as paths["/api/subscriptions"]["get"]["parameters"]["query"];
      const result = await api.subscriptions(q),
        organizers = await Promise.all(
          [...new Set(result.items.map((s) => s.plan.organizerId))].map(
            async (id) => {
              try {
                return [id, (await api.organizer(id)).name] as const;
              } catch {
                return [id, "Organizer unavailable"] as const;
              }
            },
          ),
        );
      return { ...result, names: Object.fromEntries(organizers) };
    }, [search]),
  );
  return (
    <>
      <div className="page-heading">
        <h1>My subscriptions</h1>
        <Link to="/organizers">Find subscription plans</Link>
      </div>
      <div className="filter-grid">
        <label>
          Status
          <select
            aria-label="Status"
            value={params.get("status") ?? ""}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              if (e.target.value) next.set("status", e.target.value);
              else next.delete("status");
              next.delete("page");
              setParams(next);
            }}
          >
            <option value="">All statuses</option>
            <option>ACTIVE</option>
            <option>EXHAUSTED</option>
            <option>EXPIRED</option>
          </select>
        </label>
      </div>
      <Feedback state={remote.state} />
      {remote.data ? (
        <>
          <div className="event-grid">
            {remote.data.items.map((s) => (
              <article className="panel" key={s.id}>
                <h2>{s.plan.name}</h2>
                <Link to={`/organizers/${s.plan.organizerId}`}>
                  {remote.data!.names[s.plan.organizerId]}
                </Link>
                <Terms plan={s.plan} />
                <p className="badge">{label(s.status)}</p>
                <p>
                  {s.visitsLeft === null
                    ? "Unlimited visits"
                    : `${s.visitsLeft} visit(s) remaining`}
                </p>
                <p>
                  {dateTime(s.startsAt)} - {dateTime(s.expiresAt)}
                </p>
                {s.companyName && <p>Company: {s.companyName}</p>}
                {s.status === "ACTIVE" && (
                  <Link
                    to={`/events?organizerId=${s.plan.organizerId}&cityId=all`}
                  >
                    Find an eligible activity
                  </Link>
                )}
              </article>
            ))}
          </div>
          {!remote.data.items.length && <p>No subscriptions yet.</p>}
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
        <p>Loading subscriptions...</p>
      )}
    </>
  );
}
