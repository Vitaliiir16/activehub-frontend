import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Notice } from "../api/client";
import { Feedback, useFormState } from "../components/forms";
import { announceUnreadChange, useUnread } from "../unread";

const emailNote: Record<string, string> = {
  SENT: "Also sent by email",
  QUEUED: "Email on its way",
  FAILED: "Email could not be delivered yet",
};

export function Notifications() {
  const [items, setItems] = useState<Notice[]>([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(0),
    [loaded, setLoaded] = useState(false),
    [unreadOnly, setUnreadOnly] = useState(false),
    unread = useUnread();
  const state = useFormState();
  // The header poll changes `version` when a notification arrives or is read, which refreshes this list.
  const load = useCallback(async () => {
    const value = await api.notifications(page, unreadOnly);
    setItems(value.items);
    setTotalPages(value.meta.totalPages);
    setLoaded(true);
  }, [page, unreadOnly]);
  const { run } = state;
  useEffect(() => {
    void run(load);
  }, [load, run, unread.version]);
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">STAY IN THE LOOP</p>
        <h1>Notifications</h1>
        <p className="muted">
          Your account updates, all in one place. Important ones are also sent to your email.
        </p>
      </div>
      <section className="panel">
        <Feedback state={state} />
        {!loaded ? (
          <p role="status">Loading notifications...</p>
        ) : (
          <>
            <div className="button-row">
              <button
                className="secondary"
                disabled={state.busy}
                onClick={() =>
                  void state.run(async () => {
                    await api.readAllNotifications();
                    await load();
                    announceUnreadChange();
                  })
                }
              >
                Mark all as read
              </button>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => {
                    setUnreadOnly(e.target.checked);
                    setPage(1);
                  }}
                />
                Unread only
              </label>
            </div>
            {!items.length ? (
              <p>{unreadOnly ? "You are all caught up." : "No notifications yet."}</p>
            ) : (
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
                      {emailNote[item.emailStatus] && (
                        <span className="hint">{emailNote[item.emailStatus]} </span>
                      )}
                      <Link
                        to={item.link}
                        onClick={() => {
                          if (!item.readAt)
                            void api
                              .readNotification(item.id)
                              .then(announceUnreadChange, () => undefined);
                        }}
                      >
                        View details
                      </Link>
                    </div>
                    {!item.readAt && (
                      <button
                        className="secondary"
                        disabled={state.busy}
                        onClick={() =>
                          void state.run(async () => {
                            await api.readNotification(item.id);
                            await load();
                            announceUnreadChange();
                          })
                        }
                      >
                        Mark as read
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div className="pagination">
              <button
                disabled={page <= 1 || state.busy}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.max(totalPages, 1)}
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
