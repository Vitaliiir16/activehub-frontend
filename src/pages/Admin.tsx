import { useState, type FormEvent } from "react";
import { api } from "../api/client";
import {
  Feedback,
  Field,
  Input,
  text,
  useFormState,
} from "../components/forms";

export function AdminAccounts() {
  const create = useFormState(),
    status = useFormState(),
    [created, setCreated] = useState<{ id: string; email: string } | null>(
      null,
    );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget,
      form = new FormData(element);
    void create.run(async () => {
      const account = await api.createAdmin({
        email: text(form, "email"),
        password: text(form, "password"),
        displayName: text(form, "displayName"),
      });
      setCreated(account);
      element.reset();
    }, "Administrator created. Share their credentials through a private channel.");
  }
  function change(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void status.run(async () => {
      await api.setAdminStatus(text(form, "administratorId"), {
        status: text(form, "status") as "ACTIVE" | "BLOCKED",
        reason: text(form, "reason"),
      });
    }, "Administrator access updated");
  }
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1>Administrator access</h1>
        <p className="muted">
          Create an administrator or manage access using their account ID.
        </p>
      </div>
      <div className="profile-layout">
        <section className="panel">
          <h2>Create administrator</h2>
          <form onSubmit={submit}>
            <Feedback state={create} />
            <Input
              name="displayName"
              label="Display name"
              state={create}
              minLength={2}
              maxLength={100}
            />
            <Input
              name="email"
              label="Email"
              type="email"
              state={create}
              autoComplete="off"
            />
            <Input
              name="password"
              label="Temporary password"
              type="password"
              state={create}
              minLength={8}
              maxLength={256}
              autoComplete="new-password"
            />
            <p className="hint">
              At least 8 characters, including a letter and a digit.
            </p>
            <button disabled={create.busy}>
              {create.busy ? "Creating..." : "Create administrator"}
            </button>
          </form>
          {created && (
            <div className="created-account">
              <p>{created.email}</p>
              <p>
                Account ID: <code>{created.id}</code>
              </p>
            </div>
          )}
        </section>
        <section className="panel">
          <h2>Update access</h2>
          <p className="hint">
            You cannot block yourself or the last active administrator.
          </p>
          <form onSubmit={change} key={created?.id ?? "empty"}>
            <Feedback state={status} />
            <Input
              name="administratorId"
              label="Administrator account ID"
              state={status}
              defaultValue={created?.id}
            />
            <Field name="status" label="Access status" state={status}>
              <select id="status" name="status">
                <option value="BLOCKED">Blocked</option>
                <option value="ACTIVE">Active</option>
              </select>
            </Field>
            <Input
              name="reason"
              label="Reason"
              state={status}
              maxLength={500}
            />
            <button disabled={status.busy}>
              {status.busy ? "Updating..." : "Update access"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
