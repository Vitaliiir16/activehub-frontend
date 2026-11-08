import { useCallback, useState, type FormEvent } from "react";
import { api } from "../api/client";
import { Feedback, useFormState } from "../components/forms";
import { Pagination, useRemote } from "../marketplace/shared";
import { AdminNav, DataTable, StatusBadge, field } from "./shared";

type Kind = "cities" | "directions";
type Item = { id: string; name: string; isActive: boolean };

function Row({ kind, item, onChanged }: { kind: Kind; item: Item; onChanged: () => void }) {
  const state = useFormState();
  function rename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = field(new FormData(event.currentTarget), "name");
    void state.run(async () => {
      await api.adminEditDictionary(kind, item.id, { name, isActive: item.isActive });
      onChanged();
    }, "Renamed");
  }
  return (
    <tr>
      <td>
        <form onSubmit={rename} className="inline-form" aria-label={`Rename ${item.name}`}>
          <input name="name" defaultValue={item.name} required minLength={2} maxLength={100} aria-label={`Name of ${item.name}`} />
          <button className="secondary" disabled={state.busy}>
            Save name
          </button>
        </form>
        <Feedback state={state} />
      </td>
      <td>
        <StatusBadge value={item.isActive ? "ACTIVE" : "INACTIVE"} />
      </td>
      <td>
        <button
          className={item.isActive ? "danger" : "secondary"}
          disabled={state.busy}
          onClick={() =>
            void state.run(async () => {
              await api.adminEditDictionary(kind, item.id, { name: item.name, isActive: !item.isActive });
              onChanged();
            })
          }
        >
          {item.isActive ? `Deactivate ${item.name}` : `Activate ${item.name}`}
        </button>
      </td>
    </tr>
  );
}

function Section({ kind, title, singular }: { kind: Kind; title: string; singular: string }) {
  const [page, setPage] = useState(1),
    [filter, setFilter] = useState<"" | "true" | "false">(""),
    add = useFormState();
  const remote = useRemote(
    useCallback(
      () => api.adminDictionary(kind, { page, pageSize: 20, ...(filter ? { isActive: filter === "true" } : {}) }),
      [kind, page, filter],
    ),
  );
  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget,
      form = new FormData(element);
    void add.run(async () => {
      await api.adminCreateDictionary(kind, { name: field(form, "name"), isActive: form.get("isActive") === "on" });
      element.reset();
      remote.reload();
    }, `${singular} added`);
  }
  return (
    <section className="panel section-space" aria-labelledby={`${kind}-title`}>
      <h2 id={`${kind}-title`}>{title}</h2>
      <p className="hint">
        Inactive values stay on existing profiles and events but cannot be chosen again. One value always stays active.
      </p>
      <form onSubmit={create} className="inline-form" aria-label={`Add ${singular.toLowerCase()}`}>
        <label>
          New {singular.toLowerCase()} name
          <input name="name" required minLength={2} maxLength={100} />
        </label>
        <label className="check-label">
          <input type="checkbox" name="isActive" defaultChecked /> Active
        </label>
        <button disabled={add.busy}>Add {singular.toLowerCase()}</button>
      </form>
      <Feedback state={add} />
      <label className="section-space">
        Show
        <select
          value={filter}
          aria-label={`Show ${title.toLowerCase()}`}
          onChange={(e) => {
            setFilter(e.target.value as "" | "true" | "false");
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="true">Active only</option>
          <option value="false">Inactive only</option>
        </select>
      </label>
      <Feedback state={remote.state} />
      {!remote.data ? (
        !remote.state.message && <p role="status">Loading {title.toLowerCase()}...</p>
      ) : (
        <>
          <DataTable caption={title} head={["Name", "Status", "Actions"]} empty="Nothing to show." rows={remote.data.items.length}>
            {remote.data.items.map((item) => (
              <Row key={`${item.id}-${item.name}-${item.isActive}`} kind={kind} item={item} onChanged={remote.reload} />
            ))}
          </DataTable>
          <Pagination meta={remote.data.meta} onPage={setPage} />
        </>
      )}
    </section>
  );
}

export function AdminDictionaries() {
  return (
    <>
      <AdminNav />
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>Dictionaries</h1>
        <p className="muted">Cities and directions used by profiles, activities and promotions.</p>
      </div>
      <Section kind="cities" title="Cities" singular="City" />
      <Section kind="directions" title="Directions" singular="Direction" />
    </>
  );
}
