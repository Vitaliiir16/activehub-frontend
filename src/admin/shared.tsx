import { useState, type FormEvent, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Feedback, useFormState } from "../components/forms";
import { label } from "../marketplace/shared";

export const adminSections = [
  ["/admin/users", "Users", "Search, edit, block and remove member accounts"],
  ["/admin/organizers", "Organizers", "Review, edit, block and remove organizers"],
  ["/admin/events", "Events", "Moderate every organizer's activities"],
  ["/admin/bookings", "Bookings", "Find bookings and cancel with a refund"],
  ["/admin/subscriptions", "Subscriptions", "Review plans and purchases, archive plans"],
  ["/admin/dictionaries", "Dictionaries", "Manage cities and directions"],
  ["/admin/loyalty", "Loyalty settings", "Levels, points rules, cards and adjustments"],
  ["/admin/accounts", "Administrator access", "Create and block administrators"],
] as const;

export function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Administration">
      {adminSections.map(([to, text]) => (
        <NavLink key={to} to={to}>
          {text}
        </NavLink>
      ))}
    </nav>
  );
}

export function StatusBadge({ value }: { value: string }) {
  return <span className={`badge status-${value.toLowerCase()}`}>{label(value)}</span>;
}

export function DataTable({
  caption,
  head,
  empty,
  rows,
  children,
}: {
  caption: string;
  head: string[];
  empty: string;
  rows: number;
  children: ReactNode;
}) {
  return rows === 0 ? (
    <p>{empty}</p>
  ) : (
    <div className="table-scroll">
      <table className="data-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** A destructive or sensitive action that asks for a reason first; the server records it in the audit log. */
export function ReasonAction({
  name,
  description,
  danger = false,
  needsReason = true,
  onConfirm,
}: {
  name: string;
  description?: string;
  danger?: boolean;
  needsReason?: boolean;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const state = useFormState(),
    [open, setOpen] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reason = String(new FormData(event.currentTarget).get("reason") ?? "").trim();
    void state.run(async () => {
      await onConfirm(reason);
      setOpen(false);
    });
  }
  return (
    <div className="reason-action">
      {!open ? (
        <button className={danger ? "danger" : "secondary"} onClick={() => setOpen(true)}>
          {name}
        </button>
      ) : (
        <form onSubmit={submit} aria-label={name}>
          {description && <p className="hint">{description}</p>}
          {needsReason && (
            <label>
              Reason
              <textarea name="reason" required maxLength={500} rows={2} />
            </label>
          )}
          <div className="button-row">
            <button className={danger ? "danger" : undefined} disabled={state.busy}>
              {state.busy ? "Working..." : `Confirm: ${name}`}
            </button>
            <button type="button" className="secondary" disabled={state.busy} onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <Feedback state={state} />
    </div>
  );
}

export const shortId = (id: string) => `${id.slice(0, 8)}…`;
export const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
/** Copies the non-empty fields of a filter form into the URL, so every filter can be shared and reloaded. */
export function filterParams(form: HTMLFormElement) {
  const next = new URLSearchParams();
  for (const [key, value] of new FormData(form)) if (value && String(value).trim()) next.set(key, String(value).trim());
  return next;
}
export const queryOf = (search: string, extra: Record<string, unknown> = {}) => {
  const params = new URLSearchParams(search);
  return {
    ...Object.fromEntries(params),
    page: Number(params.get("page") ?? 1),
    pageSize: 20,
    ...extra,
  };
};
