import { useEffect, useState } from "react";
import { api } from "../api/client";

/** Shows whether the backend readiness check answers; the status is announced politely. */
export function HealthStatus() {
  const [status, setStatus] = useState("Checking connection...");
  useEffect(() => {
    const controller = new AbortController();
    api
      .health(controller.signal)
      .then(() => setStatus("Connected to ActiveHub"))
      .catch(() => {
        if (!controller.signal.aborted)
          setStatus("Connection unavailable. Reload to try again.");
      });
    return () => controller.abort();
  }, []);
  return (
    <p className="connection" role="status">
      {status}
    </p>
  );
}
