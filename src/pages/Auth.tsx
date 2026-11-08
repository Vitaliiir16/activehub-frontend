import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api, type Dictionary } from "../api/client";
import { homeFor, useSession } from "../session";
import {
  Feedback,
  Field,
  Input,
  text,
  useFormState,
} from "../components/forms";

export function Login() {
  const state = useFormState(),
    session = useSession(),
    navigate = useNavigate();
  if (session.profile)
    return <Navigate to={homeFor(session.profile.role)} replace />;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void state.run(async () => {
      await api.login({
        email: text(data, "email"),
        password: text(data, "password"),
      });
      const profile = await session.refresh();
      if (profile) navigate(homeFor(profile.role), { replace: true });
    });
  }
  return (
    <section className="auth-card">
      <p className="eyebrow">WELCOME BACK</p>
      <h1>Make room for movement.</h1>
      <p className="muted">Sign in to your ActiveHub account.</p>
      <form onSubmit={submit}>
        <Feedback state={state} />
        <Input
          name="email"
          label="Email"
          type="email"
          state={state}
          autoComplete="username"
        />
        <Input
          name="password"
          label="Password"
          type="password"
          state={state}
          autoComplete="current-password"
        />
        <button disabled={state.busy}>
          {state.busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p>
        New to ActiveHub? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
}
export function Register() {
  const [role, setRole] = useState<"USER" | "ORGANIZER" | null>(null),
    [cities, setCities] = useState<Dictionary[]>([]),
    [directions, setDirections] = useState<Dictionary[]>([]),
    [loadError, setLoadError] = useState("");
  const state = useFormState(),
    session = useSession(),
    navigate = useNavigate();
  useEffect(() => {
    let active = true;
    Promise.all([api.dictionaries("cities"), api.dictionaries("directions")])
      .then(([c, d]) => {
        if (active) {
          setCities(c);
          setDirections(d);
        }
      })
      .catch(() => {
        if (active)
          setLoadError(
            "We could not load registration options. Reload to try again.",
          );
      });
    return () => {
      active = false;
    };
  }, []);
  if (session.profile)
    return <Navigate to={homeFor(session.profile.role)} replace />;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void state.run(async () => {
      const common = {
        email: text(form, "email"),
        password: text(form, "password"),
        passwordConfirmation: text(form, "passwordConfirmation"),
        phone: text(form, "phone"),
        cityId: text(form, "cityId"),
      };
      if (role === "USER")
        await api.registerUser({
          ...common,
          firstName: text(form, "firstName"),
          lastName: text(form, "lastName"),
          gender: text(form, "gender") as "MALE" | "FEMALE" | "UNDISCLOSED",
        });
      else
        await api.registerOrganizer({
          ...common,
          name: text(form, "name"),
          type: text(form, "type") as
            "TRAINER" | "CLUB" | "VENUE" | "ORGANIZER",
          directionIds: form.getAll("directionIds").map(String),
          description: text(form, "description"),
        });
      const file = form.get("logo");
      let uploadError = false;
      if (file instanceof File && file.size) {
        try {
          await api.uploadPhoto(file);
        } catch {
          uploadError = true;
        }
      }
      const profile = await session.refresh();
      if (profile)
        navigate(uploadError ? "/profile" : homeFor(profile.role), {
          replace: true,
          state: uploadError
            ? {
                uploadError:
                  "Your account was created. The logo could not be uploaded; try again below.",
              }
            : undefined,
        });
    });
  }
  return (
    <section className="auth-card wide">
      <p className="eyebrow">JOIN ACTIVEHUB · STEP {role ? "2" : "1"} OF 2</p>
      <h1>{role ? "A little about you." : "How will you use ActiveHub?"}</h1>
      {!role ? (
        <>
          <div className="role-options">
            <button className="role-card" onClick={() => setRole("USER")}>
              <strong>Find an activity</strong>
              <span>Discover sports and connect with local sessions.</span>
            </button>
            <button className="role-card" onClick={() => setRole("ORGANIZER")}>
              <strong>Offer activities</strong>
              <span>Build your presence as a trainer, club or venue.</span>
            </button>
          </div>
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </>
      ) : (
        <>
          <button
            type="button"
            className="text-button"
            onClick={() => setRole(null)}
          >
            ← Change account type
          </button>
          {loadError ? (
            <p role="alert">{loadError}</p>
          ) : !cities.length ? (
            <p role="status">Loading registration options...</p>
          ) : (
            <form onSubmit={submit}>
              <Feedback state={state} />
              <div className="form-grid">
                {role === "USER" ? (
                  <>
                    <Input
                      name="firstName"
                      label="First name"
                      state={state}
                      minLength={2}
                      maxLength={50}
                      autoComplete="given-name"
                    />
                    <Input
                      name="lastName"
                      label="Last name"
                      state={state}
                      minLength={2}
                      maxLength={50}
                      autoComplete="family-name"
                    />
                  </>
                ) : (
                  <>
                    <Input
                      name="name"
                      label="Organization or trainer name"
                      state={state}
                      minLength={2}
                      maxLength={100}
                    />
                    <Field name="type" label="Provider type" state={state}>
                      <select id="type" name="type">
                        <option value="TRAINER">Trainer</option>
                        <option value="CLUB">Club</option>
                        <option value="VENUE">Venue</option>
                        <option value="ORGANIZER">Organizer</option>
                      </select>
                    </Field>
                  </>
                )}
                <Input
                  name="email"
                  label="Email"
                  type="email"
                  state={state}
                  autoComplete="username"
                />
                <Input
                  name="phone"
                  label="Phone (international format)"
                  type="tel"
                  state={state}
                  autoComplete="tel"
                />
                <Field name="cityId" label="City" state={state}>
                  <select id="cityId" name="cityId" required defaultValue="">
                    <option value="" disabled>
                      Choose a city
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </Field>
                {role === "USER" && (
                  <Field name="gender" label="Gender" state={state}>
                    <select
                      id="gender"
                      name="gender"
                      defaultValue="UNDISCLOSED"
                    >
                      <option value="UNDISCLOSED">Prefer not to say</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </Field>
                )}
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  state={state}
                  minLength={8}
                  maxLength={256}
                  autoComplete="new-password"
                />
                <Input
                  name="passwordConfirmation"
                  label="Confirm password"
                  type="password"
                  state={state}
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <p className="hint">
                Use at least 8 characters, including a letter and a digit.
              </p>
              {role === "ORGANIZER" && (
                <>
                  <fieldset>
                    <legend>Activity directions · choose at least one</legend>
                    <div className="checkbox-grid">
                      {directions.map((direction) => (
                        <label key={direction.id}>
                          <input
                            type="checkbox"
                            name="directionIds"
                            value={direction.id}
                          />
                          {direction.name}
                        </label>
                      ))}
                    </div>
                    {state.fields.directionIds?.map((message) => (
                      <p className="field-error" key={message}>
                        {message}
                      </p>
                    ))}
                  </fieldset>
                  <Field
                    name="description"
                    label="Description (optional)"
                    state={state}
                  >
                    <textarea
                      id="description"
                      name="description"
                      maxLength={5000}
                    />
                  </Field>
                  <Field name="logo" label="Logo (optional)" state={state}>
                    <input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                    />
                  </Field>
                  <p className="hint">
                    JPEG, PNG or WebP, up to 5 MiB. Uploaded after your account
                    is created.
                  </p>
                </>
              )}
              <button disabled={state.busy}>
                {state.busy ? "Creating your account..." : "Create account"}
              </button>
            </form>
          )}
        </>
      )}
    </section>
  );
}
