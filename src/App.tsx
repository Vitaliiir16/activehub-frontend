import { useEffect, useState } from "react";
import { api } from "./api/client";

export function App() {
  const [connection, setConnection] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    let active = true;
    api.health(controller.signal).then(() => { if (active) setConnection("ready"); }).catch(() => { if (active) setConnection("error"); }).finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);
  return (
    <main className="shell">
      <header className="brand"><span className="brand-mark" aria-hidden="true">A</span> ActiveHub</header>
      <section className="intro">
        <p className="eyebrow">MAKE ROOM FOR MOVEMENT</p>
        <h1>Your next activity<br />starts here.</h1>
        <p className="description">A new place to discover sports, join local sessions and find your people.</p>
        <p className="notice" role="status">{connection === "loading" ? "Connecting..." : connection === "ready" ? "Connected. We are getting things ready for you." : "We could not connect. Please try again."}</p>
        {connection === "error" && <button className="retry" onClick={() => { setConnection("loading"); setAttempt((value) => value + 1); }}>Try again</button>}
      </section>
      <footer>Move more. Connect more.</footer>
    </main>
  );
}
