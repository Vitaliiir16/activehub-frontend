import { useCallback, useEffect, useState } from "react";
import { useFormState } from "../components/forms";
export const kinds = [
  "TRAINING",
  "SECTION",
  "HALL_RENTAL",
  "TEAM_SEARCH",
  "EVENT",
] as const;
export const skills = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ANY"] as const;
export const ages = ["CHILDREN", "TEENS", "ADULTS", "SENIORS", "ANY"] as const;
export const label = (value: string) =>
  value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (c) => c.toUpperCase());
export const money = (minor: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "UAH" }).format(
    minor / 100,
  );
export const dateTime = (instant: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(instant));
export function minor(value: string) {
  if (!/^\d+(\.\d{1,2})?$/.test(value))
    throw Error("Use a nonnegative amount with at most two decimal places");
  const [whole, decimal = ""] = value.split(".");
  return Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
}
export function kyivInput(instant: string) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Kyiv",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(instant))
      .map((part) => [part.type, part.value]),
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
export function fromKyiv(value: string) {
  const [y, m, d, h, minute] = value.split(/[-T:]/).map(Number);
  const target = Date.UTC(y, m - 1, d, h, minute);
  let utc = target;
  for (let i = 0; i < 3; i++) {
    const parts = kyivInput(new Date(utc).toISOString())
      .split(/[-T:]/)
      .map(Number);
    utc +=
      target - Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
  }
  const iso = new Date(utc).toISOString();
  if (kyivInput(iso) !== value)
    throw Error(
      "This local time does not exist in Europe/Kyiv. Choose another time.",
    );
  return iso;
}
export function useRemote<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null),
    [version, setVersion] = useState(0);
  const state = useFormState(),
    { run } = state;
  useEffect(() => {
    let active = true;
    void run(async () => {
      const value = await load();
      if (active) setData(value);
    });
    return () => {
      active = false;
    };
  }, [load, version, run]);
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { data, state, reload };
}
export function Pagination({
  meta,
  onPage,
}: {
  meta: { page: number; totalPages: number };
  onPage: (page: number) => void;
}) {
  return (
    <div className="pagination">
      <button
        className="secondary"
        disabled={meta.page <= 1}
        onClick={() => onPage(meta.page - 1)}
      >
        Previous
      </button>
      <span>
        {meta.totalPages
          ? `Page ${meta.page} of ${meta.totalPages}`
          : "No results"}
      </span>
      <button
        className="secondary"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPage(meta.page + 1)}
      >
        Next
      </button>
    </div>
  );
}
