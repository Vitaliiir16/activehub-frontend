import { useCallback, useState, type ReactNode } from "react";
import { ApiError } from "../api/client";

export function useFormState() {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [success, setSuccess] = useState(""),
    [fields, setFields] = useState<Record<string, string[]>>({});
  const run = useCallback(async (action: () => Promise<void>, done = "") => {
    setBusy(true);
    setMessage("");
    setSuccess("");
    setFields({});
    try {
      await action();
      setSuccess(done);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The request failed. Please try again.",
      );
      if (error instanceof ApiError) setFields(error.fields ?? {});
    } finally {
      setBusy(false);
    }
  }, []);
  return { busy, message, success, fields, run };
}
export type FormState = ReturnType<typeof useFormState>;
export function Feedback({ state }: { state: FormState }) {
  return (
    <>
      {state.message && (
        <div className="alert error" role="alert">
          {state.message}
          {state.fields.form?.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      )}
      {state.success && (
        <div className="alert success" role="status">
          {state.success}
        </div>
      )}
    </>
  );
}
export function Field({
  name,
  label,
  state,
  children,
}: {
  name: string;
  label: string;
  state?: FormState;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children}
      {state?.fields[name]?.map((text) => (
        <span className="field-error" key={text}>
          {text}
        </span>
      ))}
    </div>
  );
}
export function Input({
  name,
  label,
  state,
  type = "text",
  defaultValue,
  required = true,
  minLength,
  maxLength,
  autoComplete,
}: {
  name: string;
  label: string;
  state: FormState;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <Field name={name} label={label} state={state}>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={!!state.fields[name]}
      />
    </Field>
  );
}
export const text = (form: FormData, name: string) =>
  String(form.get(name) ?? "");
