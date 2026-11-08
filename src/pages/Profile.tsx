import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import {
  api,
  type Dictionary,
  type Profile,
  type ProfilePatch,
  type Settings,
} from "../api/client";
import { useSession } from "../session";
import {
  Feedback,
  Field,
  Input,
  text,
  useFormState,
} from "../components/forms";

function ProfileForm({
  profile,
  cities,
  directions,
  onSaved,
}: {
  profile: Profile;
  cities: Dictionary[];
  directions: Dictionary[];
  onSaved: () => Promise<unknown>;
}) {
  const state = useFormState();
  const cityOptions =
    profile.role !== "ADMIN" &&
    !cities.some((city) => city.id === profile.city.id)
      ? [...cities, profile.city]
      : cities;
  const directionOptions =
    profile.role === "ORGANIZER"
      ? [
          ...directions,
          ...profile.directions.filter(
            (direction) => !directions.some((d) => d.id === direction.id),
          ),
        ]
      : directions;
  const selected =
    profile.role === "USER"
      ? profile.preferredDirectionIds
      : profile.role === "ORGANIZER"
        ? profile.directions.map((direction) => direction.id)
        : [];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void state.run(async () => {
      let body: ProfilePatch;
      if (profile.role === "ADMIN")
        body = {
          email: text(form, "email"),
          displayName: text(form, "displayName"),
        };
      else if (profile.role === "USER")
        body = {
          email: text(form, "email"),
          firstName: text(form, "firstName"),
          lastName: text(form, "lastName"),
          phone: text(form, "phone"),
          cityId: text(form, "cityId"),
          gender: text(form, "gender") as "MALE" | "FEMALE" | "UNDISCLOSED",
          preferredDirectionIds: form.getAll("directionIds").map(String),
        };
      else
        body = {
          email: text(form, "email"),
          name: text(form, "name"),
          type: text(form, "type") as
            "TRAINER" | "CLUB" | "VENUE" | "ORGANIZER",
          phone: text(form, "phone") || null,
          cityId: text(form, "cityId"),
          description: text(form, "description"),
          directionIds: form.getAll("directionIds").map(String),
        };
      await api.updateProfile(body);
      await onSaved();
    }, "Profile saved");
  }
  return (
    <form onSubmit={submit}>
      <Feedback state={state} />
      <div className="form-grid">
        <Input
          name="email"
          label="Email"
          type="email"
          defaultValue={profile.email}
          state={state}
          autoComplete="email"
        />
        {profile.role === "ADMIN" ? (
          <Input
            name="displayName"
            label="Display name"
            defaultValue={profile.displayName}
            minLength={2}
            maxLength={100}
            state={state}
          />
        ) : (
          <>
            {profile.role === "USER" ? (
              <>
                <Input
                  name="firstName"
                  label="First name"
                  defaultValue={profile.firstName}
                  minLength={2}
                  maxLength={50}
                  state={state}
                />
                <Input
                  name="lastName"
                  label="Last name"
                  defaultValue={profile.lastName}
                  minLength={2}
                  maxLength={50}
                  state={state}
                />
                <Field name="gender" label="Gender" state={state}>
                  <select
                    id="gender"
                    name="gender"
                    defaultValue={profile.gender}
                  >
                    <option value="UNDISCLOSED">Prefer not to say</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </Field>
              </>
            ) : (
              <>
                <Input
                  name="name"
                  label="Organization or trainer name"
                  defaultValue={profile.name}
                  minLength={2}
                  maxLength={100}
                  state={state}
                />
                <Field name="type" label="Provider type" state={state}>
                  <select id="type" name="type" defaultValue={profile.type}>
                    <option value="TRAINER">Trainer</option>
                    <option value="CLUB">Club</option>
                    <option value="VENUE">Venue</option>
                    <option value="ORGANIZER">Organizer</option>
                  </select>
                </Field>
              </>
            )}
            <Input
              name="phone"
              label="Phone (international format)"
              type="tel"
              defaultValue={profile.phone ?? ""}
              state={state}
              required={profile.role === "USER"}
            />
            <Field name="cityId" label="City" state={state}>
              <select
                id="cityId"
                name="cityId"
                defaultValue={profile.city.id}
                required
              >
                {cityOptions.map((city) => (
                  <option
                    value={city.id}
                    key={city.id}
                    disabled={!city.isActive && city.id !== profile.city.id}
                  >
                    {city.name}
                    {!city.isActive ? " (inactive, current selection)" : ""}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}
      </div>
      {profile.role !== "ADMIN" && (
        <>
          <fieldset>
            <legend>
              {profile.role === "USER"
                ? "Preferred activity directions"
                : "Activity directions"}
            </legend>
            <div className="checkbox-grid">
              {directionOptions.map((direction) => (
                <label key={direction.id}>
                  <input
                    type="checkbox"
                    name="directionIds"
                    value={direction.id}
                    defaultChecked={selected.includes(direction.id)}
                  />
                  {direction.name}
                  {!direction.isActive ? " (inactive)" : ""}
                </label>
              ))}
            </div>
            {state.fields.directionIds?.map((message) => (
              <p className="field-error" key={message}>
                {message}
              </p>
            ))}
          </fieldset>
          {profile.role === "ORGANIZER" && (
            <Field name="description" label="Description" state={state}>
              <textarea
                id="description"
                name="description"
                defaultValue={profile.description}
                maxLength={5000}
              />
            </Field>
          )}
        </>
      )}
      <button disabled={state.busy}>
        {state.busy ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
function PasswordForm() {
  const state = useFormState();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget,
      form = new FormData(element);
    void state.run(async () => {
      await api.changePassword({
        currentPassword: text(form, "currentPassword"),
        newPassword: text(form, "newPassword"),
      });
      element.reset();
    }, "Password updated. Other sessions have been signed out.");
  }
  return (
    <form onSubmit={submit}>
      <Feedback state={state} />
      <Input
        name="currentPassword"
        label="Current password"
        type="password"
        state={state}
        autoComplete="current-password"
      />
      <Input
        name="newPassword"
        label="New password"
        type="password"
        minLength={8}
        maxLength={256}
        state={state}
        autoComplete="new-password"
      />
      <p className="hint">
        At least 8 characters, including a letter and a digit.
      </p>
      <button disabled={state.busy}>
        {state.busy ? "Updating..." : "Change password"}
      </button>
    </form>
  );
}
function ImageForm({
  profile,
  onSaved,
}: {
  profile: Profile;
  onSaved: () => Promise<unknown>;
}) {
  const state = useFormState();
  const url =
    profile.role === "USER"
      ? profile.photoUrl
      : profile.role === "ORGANIZER"
        ? profile.logoUrl
        : null;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget,
      file = new FormData(element).get("image");
    void state.run(async () => {
      if (!(file instanceof File) || !file.size) throw Error("Choose an image");
      await api.uploadPhoto(file);
      await onSaved();
      element.reset();
    }, "Image updated");
  }
  return (
    <>
      <div className="avatar-row">
        {url ? (
          <img
            className="avatar"
            src={url}
            alt={
              profile.role === "USER"
                ? "Your profile photo"
                : "Your organization logo"
            }
          />
        ) : (
          <span className="avatar empty-avatar" aria-hidden="true">
            A
          </span>
        )}
        <p className="hint">JPEG, PNG or WebP, up to 5 MiB.</p>
      </div>
      <form onSubmit={submit}>
        <Feedback state={state} />
        <Field name="file" label="Choose image" state={state}>
          <input
            id="file"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
          />
        </Field>
        <div className="button-row">
          <button disabled={state.busy}>
            {state.busy ? "Uploading..." : "Upload image"}
          </button>
          {url && (
            <button
              type="button"
              className="secondary"
              disabled={state.busy}
              onClick={() =>
                void state.run(async () => {
                  await api.updateProfile(
                    profile.role === "USER"
                      ? { photoId: null }
                      : { logoId: null },
                  );
                  await onSaved();
                }, "Image removed")
              }
            >
              Remove image
            </button>
          )}
        </div>
      </form>
    </>
  );
}
function Preferences() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const state = useFormState();
  const { run } = state;
  useEffect(() => {
    void run(async () => setSettings(await api.settings()));
  }, [run]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void state.run(async () => {
      const value = {
        remindersEmail: form.has("remindersEmail"),
        promotionsEmail: form.has("promotionsEmail"),
        loyaltyEmail: form.has("loyaltyEmail"),
        messagesEmail: form.has("messagesEmail"),
      };
      setSettings(await api.updateSettings(value));
    }, "Email preferences saved");
  }
  return (
    <>
      <Feedback state={state} />
      {settings ? (
        <form onSubmit={submit}>
          <div className="check-list">
            {(
              [
                ["remindersEmail", "Reminders"],
                ["promotionsEmail", "Offers and activities"],
                ["loyaltyEmail", "Points and card updates"],
                ["messagesEmail", "Messages"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name={key}
                  defaultChecked={settings[key]}
                />
                {label}
              </label>
            ))}
          </div>
          <p className="hint">
            In-app notifications and booking emails are always enabled. Choose
            which other emails you also receive. Points emails and message
            emails are off by default; card upgrade emails are sent until you
            change the points and card setting.
          </p>
          <button disabled={state.busy}>Save email preferences</button>
        </form>
      ) : (
        <p role="status">Loading preferences...</p>
      )}
    </>
  );
}
export function ProfilePage() {
  const session = useSession(),
    location = useLocation();
  const [options, setOptions] = useState<{
      cities: Dictionary[];
      directions: Dictionary[];
    } | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([
      api.dictionaries("cities", true),
      api.dictionaries("directions", true),
    ])
      .then(([cities, directions]) => {
        if (active) setOptions({ cities, directions });
      })
      .catch(() => {
        if (active)
          setError("We could not load profile options. Reload to try again.");
      });
    return () => {
      active = false;
    };
  }, []);
  const profile = session.profile;
  if (!profile) return null;
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">YOUR ACCOUNT</p>
        <h1>Profile & preferences</h1>
        <p className="muted">Keep your details up to date.</p>
      </div>
      {location.state?.uploadError && (
        <div role="alert" className="alert error">
          {location.state.uploadError}
        </div>
      )}
      {error && <p role="alert">{error}</p>}
      <div className="profile-layout">
        <section className="panel">
          <h2>Personal details</h2>
          {options ? (
            <ProfileForm
              profile={profile}
              cities={options.cities}
              directions={options.directions}
              onSaved={session.refresh}
            />
          ) : (
            <p role="status">Loading profile options...</p>
          )}
        </section>
        <div className="panel-stack">
          {profile.role !== "ADMIN" && (
            <section className="panel">
              <h2>
                {profile.role === "USER"
                  ? "Profile photo"
                  : "Organization logo"}
              </h2>
              <ImageForm profile={profile} onSaved={session.refresh} />
            </section>
          )}
          <section className="panel">
            <h2>Change password</h2>
            <PasswordForm />
          </section>
          <section className="panel">
            <h2>Email preferences</h2>
            <Preferences />
          </section>
        </div>
      </div>
    </>
  );
}
