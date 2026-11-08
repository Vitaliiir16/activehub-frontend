import { useCallback, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, type AccountSummary, type LoyaltyLevel } from "../api/client";
import type { paths } from "../api/schema";
import { Feedback, Field, useFormState } from "../components/forms";
import { dateTime, label, Pagination, useRemote } from "../marketplace/shared";
import { AdminNav, DataTable, ReasonAction, StatusBadge, field, filterParams, queryOf, shortId } from "./shared";

type Dictionary = { id: string; name: string; isActive: boolean };
const useCities = () => useRemote(useCallback(() => api.adminDictionary("cities", { pageSize: 100 }), []));
const statuses = ["ACTIVE", "BLOCKED", "DELETED"];

function Filters({
  search,
  onApply,
  children,
}: {
  search: string;
  onApply: (next: URLSearchParams) => void;
  children: ReactNode;
}) {
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
const CitySelect = ({ cities, value }: { cities: Dictionary[]; value: string | null }) => (
  <label>
    City
    <select name="cityId" defaultValue={value ?? ""}>
      <option value="">All cities</option>
      {cities.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
          {c.isActive ? "" : " (inactive)"}
        </option>
      ))}
    </select>
  </label>
);
const StatusSelect = ({ value }: { value: string | null }) => (
  <label>
    Status
    <select name="status" defaultValue={value ?? ""}>
      <option value="">All statuses</option>
      {statuses.map((s) => (
        <option key={s} value={s}>
          {label(s)}
        </option>
      ))}
    </select>
  </label>
);
const SortSelect = ({ value }: { value: string | null }) => (
  <label>
    Sort
    <select name="sort" defaultValue={value ?? "newest"}>
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
    </select>
  </label>
);

function AccountList({ role }: { role: "USER" | "ORGANIZER" }) {
  const [params, setParams] = useSearchParams(),
    search = params.toString(),
    cities = useCities();
  const remote = useRemote(
    useCallback(
      () =>
        role === "USER"
          ? api.adminUsers(queryOf(search) as paths["/api/admin/users"]["get"]["parameters"]["query"])
          : api.adminOrganizers(queryOf(search) as paths["/api/admin/organizers"]["get"]["parameters"]["query"]),
      [role, search],
    ),
  );
  const directions = useRemote(useCallback(() => api.adminDictionary("directions", { pageSize: 100 }), []));
  const plural = role === "USER" ? "users" : "organizers";
  const apply = (next: URLSearchParams) => setParams(next);
  return (
    <>
      <AdminNav />
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>{role === "USER" ? "Users" : "Organizers"}</h1>
        <p className="muted">
          Filters are kept in the address, so a search can be shared or reloaded. Deleted accounts stay searchable.
        </p>
      </div>
      <Filters search={search} onApply={apply}>
        <label>
          {role === "USER" ? "User ID" : "Organizer ID"}
          <input name="id" defaultValue={params.get("id") ?? ""} placeholder="Exact account ID" />
        </label>
        {role === "USER" ? (
          <label>
            Name, email or phone
            <input name="search" defaultValue={params.get("search") ?? ""} />
          </label>
        ) : (
          <label>
            Name
            <input name="name" defaultValue={params.get("name") ?? ""} />
          </label>
        )}
        <CitySelect cities={cities.data?.items ?? []} value={params.get("cityId")} />
        {role === "ORGANIZER" && (
          <>
            <label>
              Type
              <select name="type" defaultValue={params.get("type") ?? ""}>
                <option value="">All types</option>
                {["TRAINER", "CLUB", "VENUE", "ORGANIZER"].map((t) => (
                  <option key={t} value={t}>
                    {label(t)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Direction
              <select name="directionId" defaultValue={params.get("directionId") ?? ""}>
                <option value="">All directions</option>
                {(directions.data?.items ?? []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        <StatusSelect value={params.get("status")} />
        {role === "USER" && (
          <>
            <label>
              Registered from
              <input type="date" name="registeredFrom" defaultValue={params.get("registeredFrom") ?? ""} />
            </label>
            <label>
              Registered to
              <input type="date" name="registeredTo" defaultValue={params.get("registeredTo") ?? ""} />
            </label>
          </>
        )}
        <SortSelect value={params.get("sort")} />
      </Filters>
      <Feedback state={remote.state} />
      <section className="panel section-space">
        {!remote.data ? (
          !remote.state.message && <p role="status">Loading {plural}...</p>
        ) : (
          <>
            <p className="muted">{remote.data.meta.totalItems} found</p>
            <DataTable
              caption={`${plural} search results`}
              head={["Name", "Email", "Status", "Registered", "Last sign-in"]}
              empty={`No ${plural} match these filters.`}
              rows={remote.data.items.length}
            >
              {remote.data.items.map((a: AccountSummary) => (
                <tr key={a.id}>
                  <td>
                    <Link to={`/admin/${plural}/${a.id}`}>{a.displayName}</Link>
                    <br />
                    <span className="hint">{shortId(a.id)}</span>
                  </td>
                  <td>{a.email}</td>
                  <td>
                    <StatusBadge value={a.status} />
                  </td>
                  <td>{dateTime(a.createdAt)}</td>
                  <td>{a.lastLoginAt ? dateTime(a.lastLoginAt) : "Never"}</td>
                </tr>
              ))}
            </DataTable>
            <Pagination
              meta={remote.data.meta}
              onPage={(page) => {
                const next = new URLSearchParams(params);
                next.set("page", String(page));
                setParams(next);
              }}
            />
          </>
        )}
      </section>
    </>
  );
}
export const AdminUsers = () => <AccountList role="USER" />;
export const AdminOrganizers = () => <AccountList role="ORGANIZER" />;

function StatusPanel({
  name,
  status,
  onStatus,
  onDelete,
  deleteText,
}: {
  name: string;
  status: string;
  onStatus: (status: "ACTIVE" | "BLOCKED", reason: string) => Promise<void>;
  onDelete: (reason: string) => Promise<void>;
  deleteText: string;
}) {
  return (
    <section className="panel">
      <h2>Access</h2>
      <p>
        Status: <StatusBadge value={status} />
      </p>
      {status === "ACTIVE" && (
        <ReasonAction
          name={`Block ${name}`}
          description="Blocking ends every session and prevents sign-in. Existing bookings are kept."
          onConfirm={(reason) => onStatus("BLOCKED", reason)}
        />
      )}
      {status === "BLOCKED" && (
        <ReasonAction name={`Unblock ${name}`} onConfirm={(reason) => onStatus("ACTIVE", reason)} />
      )}
      {status !== "DELETED" ? (
        <ReasonAction name={`Delete ${name}`} danger description={deleteText} onConfirm={onDelete} />
      ) : (
        <p className="hint">This account was deleted. Its history is kept and it can no longer be changed.</p>
      )}
    </section>
  );
}

export function AdminUserPage() {
  const { id = "" } = useParams(),
    navigate = useNavigate(),
    cities = useCities(),
    remote = useRemote(useCallback(() => api.adminUser(id), [id])),
    edit = useFormState(),
    card = useFormState(),
    points = useFormState();
  const data = remote.data,
    profile = data?.profile;
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    const form = new FormData(event.currentTarget);
    const next = {
      email: field(form, "email"),
      firstName: field(form, "firstName"),
      lastName: field(form, "lastName"),
      phone: field(form, "phone"),
      cityId: field(form, "cityId"),
      gender: field(form, "gender") as "MALE" | "FEMALE" | "UNDISCLOSED",
    };
    const changes = Object.fromEntries(
      Object.entries(next).filter(([key, value]) => {
        const current = key === "cityId" ? profile.city.id : (profile as unknown as Record<string, string>)[key];
        return value !== current;
      }),
    );
    void edit.run(async () => {
      if (!Object.keys(changes).length) throw new Error("Change at least one field");
      await api.adminEditUser(id, changes);
      remote.reload();
    }, "Contacts saved");
  }
  return (
    <>
      <AdminNav />
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>{data?.account.displayName ?? "User"}</h1>
        <Link to="/admin/users">All users</Link>
      </div>
      <Feedback state={remote.state} />
      {!data || !profile ? (
        !remote.state.message && <p role="status">Loading user...</p>
      ) : (
        <>
          <div className="profile-layout">
            <section className="panel">
              <h2>Profile</h2>
              <p>
                <StatusBadge value={data.account.status} /> · ID <code>{data.account.id}</code>
              </p>
              <p>
                {profile.email} · {profile.phone}
              </p>
              <p>City: {profile.city.name}</p>
              <p>Registered: {dateTime(data.account.createdAt)}</p>
              <p>Last sign-in: {data.account.lastLoginAt ? dateTime(data.account.lastLoginAt) : "Never"}</p>
              <h3>Loyalty</h3>
              <p>
                Card: {label(profile.loyaltyLevel)}
                {profile.cardLockedByAdmin ? " (locked)" : ""} · {profile.pointsBalance} points ({profile.lifetimePoints}{" "}
                lifetime)
              </p>
              <p>
                <Link to={`/admin/bookings?userId=${id}`}>Bookings</Link> ·{" "}
                <Link to={`/admin/subscriptions?view=purchases&userId=${id}`}>Subscriptions</Link>
              </p>
            </section>
            <StatusPanel
              name="user"
              status={data.account.status}
              deleteText="Deleting cancels every active booking with a refund, returns visits and reverses points, and notifies organizers. History is kept. This cannot be undone."
              onStatus={async (status, reason) => {
                await api.adminUserStatus(id, { status, reason });
                remote.reload();
              }}
              onDelete={async (reason) => {
                await api.adminDeleteUser(id, reason, crypto.randomUUID());
                navigate("/admin/users");
              }}
            />
          </div>
          {data.account.status !== "DELETED" && (
            <div className="profile-layout section-space">
              <form className="panel" onSubmit={save} key={profile.updatedAt} aria-label="Edit contacts">
                <h2>Edit contacts</h2>
                <Feedback state={edit} />
                <Field name="email" label="Email" state={edit}>
                  <input id="email" name="email" type="email" defaultValue={profile.email} required />
                </Field>
                <Field name="firstName" label="First name" state={edit}>
                  <input id="firstName" name="firstName" defaultValue={profile.firstName} required minLength={2} maxLength={50} />
                </Field>
                <Field name="lastName" label="Last name" state={edit}>
                  <input id="lastName" name="lastName" defaultValue={profile.lastName} required minLength={2} maxLength={50} />
                </Field>
                <Field name="phone" label="Phone" state={edit}>
                  <input id="phone" name="phone" defaultValue={profile.phone} required />
                </Field>
                <Field name="cityId" label="City" state={edit}>
                  <select id="cityId" name="cityId" defaultValue={profile.city.id}>
                    {(cities.data?.items ?? [])
                      .filter((c) => c.isActive || c.id === profile.city.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field name="gender" label="Gender" state={edit}>
                  <select id="gender" name="gender" defaultValue={profile.gender}>
                    {["MALE", "FEMALE", "UNDISCLOSED"].map((g) => (
                      <option key={g} value={g}>
                        {label(g)}
                      </option>
                    ))}
                  </select>
                </Field>
                <p className="hint">Passwords, photos and preferences belong to the member and cannot be changed here.</p>
                <button disabled={edit.busy}>{edit.busy ? "Saving..." : "Save contacts"}</button>
              </form>
              <div className="panel-stack">
                <form
                  className="panel"
                  aria-label="Loyalty card"
                  onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const form = new FormData(e.currentTarget);
                    void card.run(async () => {
                      await api.assignCard(id, {
                        level: field(form, "level") as LoyaltyLevel["level"],
                        locked: form.get("locked") === "on",
                        reason: field(form, "reason"),
                      });
                      remote.reload();
                    }, "Card updated");
                  }}
                >
                  <h2>Loyalty card</h2>
                  <Feedback state={card} />
                  <Field name="level" label="Card level" state={card}>
                    <select id="level" name="level" defaultValue={profile.loyaltyLevel}>
                      {["STANDARD", "PREMIUM", "CORPORATE"].map((l) => (
                        <option key={l} value={l}>
                          {label(l)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <label className="check-label">
                    <input type="checkbox" name="locked" defaultChecked={profile.cardLockedByAdmin} /> Lock against automatic changes
                  </label>
                  <Field name="reason" label="Reason" state={card}>
                    <input id="reason" name="reason" required maxLength={500} />
                  </Field>
                  <button disabled={card.busy}>Save card</button>
                </form>
                <form
                  className="panel"
                  aria-label="Adjust points"
                  onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const element = e.currentTarget,
                      form = new FormData(element);
                    void points.run(async () => {
                      await api.adjustPoints(
                        id,
                        { delta: Number(field(form, "delta")), reason: field(form, "pointsReason") },
                        crypto.randomUUID(),
                      );
                      element.reset();
                      remote.reload();
                    }, "Points adjusted");
                  }}
                >
                  <h2>Adjust points</h2>
                  <Feedback state={points} />
                  <Field name="delta" label="Points to add (negative to deduct)" state={points}>
                    <input id="delta" name="delta" type="number" required />
                  </Field>
                  <Field name="reason" label="Adjustment reason" state={points}>
                    <input id="pointsReason" name="pointsReason" required maxLength={500} />
                  </Field>
                  <button disabled={points.busy}>Record adjustment</button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export function AdminOrganizerPage() {
  const { id = "" } = useParams(),
    navigate = useNavigate(),
    cities = useCities(),
    directions = useRemote(useCallback(() => api.adminDictionary("directions", { pageSize: 100 }), [])),
    remote = useRemote(useCallback(() => api.adminOrganizer(id), [id])),
    edit = useFormState();
  const data = remote.data,
    profile = data?.profile;
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    const form = new FormData(event.currentTarget);
    const chosen = form.getAll("directionIds").map(String);
    const next: Record<string, unknown> = {
      email: field(form, "email"),
      name: field(form, "name"),
      type: field(form, "type"),
      phone: field(form, "phone") || null,
      cityId: field(form, "cityId"),
      description: field(form, "description"),
    };
    const current: Record<string, unknown> = {
      email: profile.email,
      name: profile.name,
      type: profile.type,
      phone: profile.phone,
      cityId: profile.city.id,
      description: profile.description,
    };
    const changes: Record<string, unknown> = Object.fromEntries(Object.entries(next).filter(([k, v]) => v !== current[k]));
    const old = profile.directions.map((d) => d.id).sort();
    if (JSON.stringify([...chosen].sort()) !== JSON.stringify(old)) changes.directionIds = chosen;
    void edit.run(async () => {
      if (!Object.keys(changes).length) throw new Error("Change at least one field");
      await api.adminEditOrganizer(id, changes);
      remote.reload();
    }, "Organizer saved. The organizer was notified.");
  }
  const selected = new Set(profile?.directions.map((d) => d.id));
  return (
    <>
      <AdminNav />
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>{data?.account.displayName ?? "Organizer"}</h1>
        <Link to="/admin/organizers">All organizers</Link>
      </div>
      <Feedback state={remote.state} />
      {!data || !profile ? (
        !remote.state.message && <p role="status">Loading organizer...</p>
      ) : (
        <>
          <div className="profile-layout">
            <section className="panel">
              <h2>Profile</h2>
              <p>
                <StatusBadge value={data.account.status} /> · ID <code>{data.account.id}</code>
              </p>
              <p>
                {label(profile.type)} · {profile.city.name}
              </p>
              <p>
                {profile.email}
                {profile.phone ? ` · ${profile.phone}` : ""}
              </p>
              <p>Directions: {profile.directions.map((d) => d.name).join(", ")}</p>
              <p className="preserve-lines">{profile.description}</p>
              <p>Registered: {dateTime(data.account.createdAt)}</p>
              <p>
                <Link to={`/admin/events?organizerId=${id}`}>Events</Link> ·{" "}
                <Link to={`/admin/bookings?organizerId=${id}`}>Bookings</Link> ·{" "}
                <Link to={`/admin/subscriptions?view=plans&organizerId=${id}`}>Plans</Link>
              </p>
            </section>
            <StatusPanel
              name="organizer"
              status={data.account.status}
              deleteText="Deleting cancels and refunds every event with a future session or active booking, archives plans and notifies members. Finished history is kept. This cannot be undone."
              onStatus={async (status, reason) => {
                await api.adminOrganizerStatus(id, { status, reason });
                remote.reload();
              }}
              onDelete={async (reason) => {
                await api.adminDeleteOrganizer(id, reason, crypto.randomUUID());
                navigate("/admin/organizers");
              }}
            />
          </div>
          {data.account.status !== "DELETED" && (
            <form className="panel section-space" onSubmit={save} key={profile.updatedAt} aria-label="Edit organizer">
              <h2>Edit organizer</h2>
              <Feedback state={edit} />
              <div className="form-grid">
                <Field name="email" label="Email" state={edit}>
                  <input id="email" name="email" type="email" defaultValue={profile.email} required />
                </Field>
                <Field name="name" label="Name" state={edit}>
                  <input id="name" name="name" defaultValue={profile.name} required minLength={2} maxLength={100} />
                </Field>
                <Field name="type" label="Type" state={edit}>
                  <select id="type" name="type" defaultValue={profile.type}>
                    {["TRAINER", "CLUB", "VENUE", "ORGANIZER"].map((t) => (
                      <option key={t} value={t}>
                        {label(t)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field name="phone" label="Phone" state={edit}>
                  <input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
                </Field>
                <Field name="cityId" label="City" state={edit}>
                  <select id="cityId" name="cityId" defaultValue={profile.city.id}>
                    {(cities.data?.items ?? [])
                      .filter((c) => c.isActive || c.id === profile.city.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </Field>
              </div>
              <Field name="description" label="Description" state={edit}>
                <textarea id="description" name="description" defaultValue={profile.description} rows={4} maxLength={5000} />
              </Field>
              <Field name="directionIds" label="Directions" state={edit}>
                <div className="check-list">
                  {(directions.data?.items ?? [])
                    .filter((d) => d.isActive || selected.has(d.id))
                    .map((d) => (
                      <label key={d.id}>
                        <input type="checkbox" name="directionIds" value={d.id} defaultChecked={selected.has(d.id)} />
                        {d.name}
                      </label>
                    ))}
                </div>
              </Field>
              <p className="hint">The organizer is notified of changes by notification and email.</p>
              <button disabled={edit.busy}>{edit.busy ? "Saving..." : "Save organizer"}</button>
            </form>
          )}
        </>
      )}
    </>
  );
}
