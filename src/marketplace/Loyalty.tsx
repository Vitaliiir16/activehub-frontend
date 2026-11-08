import { useCallback, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, type LoyaltyLevel, type LoyaltyRules } from "../api/client";
import { Feedback, Field, Input, text, useFormState } from "../components/forms";
import { AdminNav } from "../admin/shared";
import { dateTime, label, Pagination, useRemote } from "./shared";

const reasons: Record<string, string> = {
  ACCRUAL: "Earned",
  REVERSAL: "Reversed",
  ADMIN_ADJUST: "Adjustment",
  REDEEM: "Redeemed",
  REFUND_RESTORE: "Restored",
};
function Benefits({ level, names }: { level: LoyaltyLevel; names?: Record<string, string> }) {
  return (
    <ul>
      <li>Points multiplier: x{level.multiplier}</li>
      <li>Card discount: {level.discountPercent}%</li>
      <li>
        {level.freeVisitsPerMonth && level.freeDirectionIds.length
          ? `${level.freeVisitsPerMonth} free visit(s) per month${names ? ` for ${level.freeDirectionIds.map((id) => names[id] ?? "a retired direction").join(", ")}` : ""}`
          : "No free visits"}
      </li>
    </ul>
  );
}

export function MyLoyalty() {
  const [params, setParams] = useSearchParams(),
    page = Number(params.get("page") ?? 1);
  const remote = useRemote(
    useCallback(async () => {
      const [summary, ledger, directions] = await Promise.all([
        api.loyalty(),
        api.pointsTransactions({ page, pageSize: 20, sort: "newest" }),
        api.dictionaries("directions"),
      ]);
      return { summary, ledger, names: Object.fromEntries(directions.map((d) => [d.id, d.name])) };
    }, [page]),
  );
  const data = remote.data;
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">LOYALTY</p>
        <h1>My loyalty card</h1>
        <p className="muted">Benefits apply automatically when you book. The server calculates every price and award.</p>
      </div>
      <Feedback state={remote.state} />
      {!data ? (
        !remote.state.message && <p role="status">Loading your card...</p>
      ) : (
        <>
          <div className="profile-layout">
            <section className="panel" aria-label="Card">
              <span className="badge">{data.summary.card.displayName}</span>
              <h2>{data.summary.pointsBalance} points</h2>
              <p>Lifetime points: {data.summary.lifetimePoints}</p>
              <p>
                {data.summary.pointsToNextLevel === null
                  ? "You have reached the highest points level."
                  : `${data.summary.pointsToNextLevel} more lifetime points to Premium.`}
              </p>
              {data.summary.cardLockedByAdmin && <p className="hint">An administrator set this card; it does not change automatically.</p>}
              <Benefits level={data.summary.card} names={data.names} />
            </section>
            <section className="panel" aria-label="This month">
              <h2>This month ({data.summary.quotaMonth})</h2>
              <p>Free visits used: {data.summary.freeVisitsUsed}</p>
              <p>Free visits remaining: {data.summary.freeVisitsRemaining}</p>
              <p>Bookings made: {data.summary.bookingCount}</p>
              <p>Activities attended: {data.summary.attendanceCount}</p>
              <p className="hint">Free visits count toward the month of the session in Kyiv time and return if a booking is cancelled, rejected or expires.</p>
            </section>
          </div>
          <section className="panel section-space">
            <h2>Points history</h2>
            {data.ledger.items.length === 0 ? (
              <p>No points yet. Confirmed bookings earn points, including free and subscription bookings.</p>
            ) : (
              <ol className="check-list" aria-label="Points history">
                {data.ledger.items.map((t) => (
                  <li key={t.id}>
                    <strong>
                      {t.delta > 0 ? "+" : ""}
                      {t.delta}
                    </strong>{" "}
                    {reasons[t.reason] ?? label(t.reason)} · {dateTime(t.createdAt)}
                    {t.note && <span className="hint"> · {t.note}</span>}
                    {t.bookingId && (
                      <>
                        {" "}
                        · <Link to={`/bookings/${t.bookingId}`}>Booking</Link>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            )}
            <Pagination
              meta={data.ledger.meta}
              onPage={(next) => {
                const p = new URLSearchParams(params);
                p.set("page", String(next));
                setParams(p);
              }}
            />
          </section>
        </>
      )}
    </>
  );
}

function LevelForm({ level, directions, onSaved }: { level: LoyaltyLevel; directions: { id: string; name: string }[]; onSaved: () => void }) {
  const state = useFormState();
  const id = (name: string) => `${level.level}-${name}`;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void state.run(async () => {
      await api.setLoyaltyLevel({
        level: level.level,
        displayName: text(form, id("displayName")),
        pointsThreshold: level.level === "PREMIUM" ? Number(text(form, id("pointsThreshold"))) : null,
        multiplier: text(form, id("multiplier")),
        discountPercent: text(form, id("discountPercent")),
        freeVisitsPerMonth: Number(text(form, id("freeVisitsPerMonth"))),
        freeDirectionIds: form.getAll(id("freeDirectionIds")).map(String),
      });
      onSaved();
    }, `${level.displayName} saved. Existing bookings keep their prices and awards.`);
  }
  const fields = {
    ...state,
    fields: Object.fromEntries(Object.entries(state.fields).map(([k, v]) => [id(k), v])),
  };
  const known = new Set(directions.map((d) => d.id));
  return (
    <form className="panel" onSubmit={submit} aria-label={`${level.level} level`}>
      <h2>{label(level.level)}</h2>
      <Feedback state={state} />
      <Input name={id("displayName")} label="Display name" state={fields} defaultValue={level.displayName} maxLength={100} />
      {level.level === "PREMIUM" && (
        <Input name={id("pointsThreshold")} label="Lifetime points threshold" type="number" state={fields} defaultValue={String(level.pointsThreshold ?? 500)} />
      )}
      <Input name={id("multiplier")} label="Points multiplier" state={fields} defaultValue={level.multiplier} />
      <Input name={id("discountPercent")} label="Card discount (%)" state={fields} defaultValue={level.discountPercent} />
      <Input name={id("freeVisitsPerMonth")} label="Free visits per month" type="number" state={fields} defaultValue={String(level.freeVisitsPerMonth)} />
      <Field name={id("freeDirectionIds")} label="Free-access directions" state={fields}>
        <div className="check-list" id={id("freeDirectionIds")}>
          {[...directions, ...level.freeDirectionIds.filter((d) => !known.has(d)).map((d) => ({ id: d, name: "Retired direction" }))].map((d) => (
            <label key={d.id}>
              <input type="checkbox" name={id("freeDirectionIds")} value={d.id} defaultChecked={level.freeDirectionIds.includes(d.id)} />
              {d.name}
            </label>
          ))}
        </div>
      </Field>
      <button disabled={state.busy}>{state.busy ? "Saving..." : `Save ${label(level.level)}`}</button>
    </form>
  );
}

function RulesForm({ rules }: { rules: LoyaltyRules }) {
  const state = useFormState();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void state.run(async () => {
      await api.setLoyaltyRules({
        basePointsPerBooking: Number(text(form, "basePointsPerBooking")),
        pointsPerUah: text(form, "pointsPerUah"),
        redeemRateMinor: Number(text(form, "redeemRateMinor")),
        maxRedeemPercent: text(form, "maxRedeemPercent"),
      });
    }, "Loyalty rules saved. Existing awards are unchanged.");
  }
  return (
    <form className="panel" onSubmit={submit} aria-label="Loyalty rules">
      <h2>Points rules</h2>
      <Feedback state={state} />
      <Input name="basePointsPerBooking" label="Base points per confirmed booking" type="number" state={state} defaultValue={String(rules.basePointsPerBooking)} />
      <Input name="pointsPerUah" label="Points per UAH paid" state={state} defaultValue={rules.pointsPerUah} />
      <Input name="redeemRateMinor" label="Redemption value per point (kopiykas)" type="number" state={state} defaultValue={String(rules.redeemRateMinor)} />
      <Input name="maxRedeemPercent" label="Maximum redemption share (%)" state={state} defaultValue={rules.maxRedeemPercent} />
      <p className="hint">Redemption settings are stored for a later optional feature; bookings do not redeem points yet.</p>
      <button disabled={state.busy}>{state.busy ? "Saving..." : "Save rules"}</button>
    </form>
  );
}

function MemberForms() {
  const card = useFormState(),
    points = useFormState(),
    [result, setResult] = useState("");
  function assign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void card.run(async () => {
      const profile = await api.assignCard(text(form, "cardUserId"), {
        level: text(form, "level") as LoyaltyLevel["level"],
        locked: form.get("locked") === "on",
        reason: text(form, "cardReason"),
      });
      if (profile.role === "USER")
        setResult(`Card: ${label(profile.loyaltyLevel)}${profile.cardLockedByAdmin ? " (locked)" : ""}; balance ${profile.pointsBalance} points.`);
    }, "Card updated");
  }
  function adjust(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget,
      form = new FormData(element);
    void points.run(async () => {
      const tx = await api.adjustPoints(
        text(form, "pointsUserId"),
        { delta: Number(text(form, "delta")), reason: text(form, "pointsReason") },
        crypto.randomUUID(),
      );
      setResult(`Adjustment recorded: ${tx.delta > 0 ? "+" : ""}${tx.delta} points.`);
      element.reset();
    }, "Points adjusted");
  }
  const cardFields = { ...card, fields: { ...card.fields, cardReason: card.fields.reason ?? [], locked: card.fields.locked ?? [] } };
  const pointFields = { ...points, fields: { ...points.fields, pointsReason: points.fields.reason ?? [] } };
  return (
    <div className="profile-layout section-space">
      <form className="panel" onSubmit={assign} aria-label="Assign card">
        <h2>Assign card</h2>
        <Feedback state={card} />
        <Input name="cardUserId" label="User account ID" state={cardFields} />
        <Field name="level" label="Card level" state={cardFields}>
          <select id="level" name="level">
            <option value="STANDARD">Standard</option>
            <option value="PREMIUM">Premium</option>
            <option value="CORPORATE">Corporate</option>
          </select>
        </Field>
        <label className="check-label">
          <input type="checkbox" name="locked" defaultChecked /> Lock this card against automatic changes
        </label>
        {cardFields.fields.locked.map((t) => (
          <span className="field-error" key={t}>
            {t}
          </span>
        ))}
        <Input name="cardReason" label="Reason" state={cardFields} maxLength={500} />
        <button disabled={card.busy}>{card.busy ? "Saving..." : "Assign card"}</button>
      </form>
      <form className="panel" onSubmit={adjust} aria-label="Adjust points">
        <h2>Adjust points</h2>
        <Feedback state={points} />
        <Input name="pointsUserId" label="User account ID" state={pointFields} />
        <Input name="delta" label="Points to add (negative to deduct)" type="number" state={pointFields} />
        <Input name="pointsReason" label="Reason" state={pointFields} maxLength={500} />
        <p className="hint">The balance cannot become negative. Adjustments do not change lifetime points.</p>
        <button disabled={points.busy}>{points.busy ? "Saving..." : "Record adjustment"}</button>
      </form>
      {result && (
        <p className="alert success section-space" role="status">
          {result}
        </p>
      )}
    </div>
  );
}

export function AdminLoyalty() {
  const remote = useRemote(
    useCallback(async () => {
      const [levels, rules, directions] = await Promise.all([api.loyaltyLevels(), api.loyaltyRules(), api.dictionaries("directions")]);
      return { levels, rules, directions };
    }, []),
  );
  return (
    <>
      <AdminNav />
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>Loyalty settings</h1>
        <p className="muted">Changes apply to later bookings. Recorded prices, awards and reversals keep their original values.</p>
      </div>
      <Feedback state={remote.state} />
      {!remote.data ? (
        !remote.state.message && <p role="status">Loading loyalty settings...</p>
      ) : (
        <>
          <div className="event-grid">
            {remote.data.levels.map((level) => (
              <LevelForm key={`${level.level}-${level.displayName}-${level.multiplier}`} level={level} directions={remote.data!.directions} onSaved={remote.reload} />
            ))}
          </div>
          <div className="section-space">
            <RulesForm rules={remote.data.rules} />
          </div>
          <MemberForms />
        </>
      )}
    </>
  );
}
