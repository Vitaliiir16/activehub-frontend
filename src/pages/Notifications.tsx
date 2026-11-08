import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Notice } from "../api/client";
import { Feedback, useFormState } from "../components/forms";

export function Notifications() {
  const [items, setItems] = useState<Notice[]>([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(0),
    [loaded, setLoaded] = useState(false);
  const state = useFormState();
  const load = useCallback(async () => {
    const value = await api.notifications(page);
    setItems(value.items);
    setTotalPages(value.meta.totalPages);
    setLoaded(true);
  }, [page]);
  const { run } = state;
  useEffect(() => {
    void run(load);
  }, [load, run]);
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">STAY IN THE LOOP</p>
        <h1>Notifications</h1>
        <p className="muted">Your account updates, all in one place.</p>
      </div>
      <section className="panel">
        <Feedback state={state} />
        {!loaded ? (
          <p role="status">Loading notifications...</p>
        ) : !items.length ? (
          <p>No notifications yet.</p>
        ) : (
          <>
            <button
              className="secondary"
              disabled={state.busy}
              onClick={() =>
                void state.run(async () => {
                  await api.readAllNotifications();
                  await load();
                })
              }
            >
              Mark all as read
            </button>
            <ul className="notification-list">
              {items.map((item) => (
                <li key={item.id} className={item.readAt ? "" : "unread"}>
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.body}</p>
                    <time dateTime={item.createdAt}>
                      {new Intl.DateTimeFormat("en-GB", {
                        timeZone: "Europe/Kyiv",
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(item.createdAt))}
                    </time>
                    <Link to={item.link}>View details</Link>
                  </div>
                  {!item.readAt && (
                    <button
                      className="secondary"
                      disabled={state.busy}
                      onClick={() =>
                        void state.run(async () => {
                          await api.readNotification(item.id);
                          await load();
                        })
                      }
                    >
                      Mark as read
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="pagination">
              <button
                disabled={page <= 1 || state.busy}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages || state.busy}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
