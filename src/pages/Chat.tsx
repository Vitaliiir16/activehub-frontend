import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  api,
  ApiError,
  type ChatMessage,
  type Conversation,
} from "../api/client";
import { Feedback, useFormState } from "../components/forms";
import { dateTime, Pagination, useRemote } from "../marketplace/shared";
import { useSession } from "../session";
import { announceUnreadChange, useUnread } from "../unread";

const pollInterval = 3000;
const maxLength = 2000;

export function StartChat({
  input,
  children,
}: {
  input: { organizerId?: string; eventId?: string; bookingId?: string };
  children: string;
}) {
  const state = useFormState(),
    navigate = useNavigate();
  return (
    <>
      <button
        className="secondary"
        disabled={state.busy}
        onClick={() =>
          void state.run(async () => {
            const conversation = await api.startConversation(input);
            navigate(
              `/chat/${conversation.id}${input.eventId ? `?event=${input.eventId}` : ""}`,
            );
          })
        }
      >
        {children}
      </button>
      <Feedback state={state} />
    </>
  );
}

export function ChatList() {
  const [page, setPage] = useState(1),
    version = useUnread().version;
  const remote = useRemote(
    // The header poll changes `version` when unread counts change, which reloads the list.
    useCallback(() => {
      void version;
      return api.conversations(page);
    }, [page, version]),
  );
  const data = remote.data;
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">MESSAGES</p>
        <h1>Messages</h1>
        <p className="muted">
          Chat with organizers and members. New messages appear here without reloading.
        </p>
      </div>
      <Feedback state={remote.state} />
      <section className="panel">
        {!data ? (
          !remote.state.message && <p role="status">Loading conversations...</p>
        ) : data.items.length === 0 ? (
          <p>
            No conversations yet. Open an activity or organizer and choose “Message organizer”, or message a
            member from one of your bookings.
          </p>
        ) : (
          <>
            <ul className="conversation-list" aria-label="Conversations">
              {data.items.map((c) => (
                <li key={c.id} className={c.unreadCount ? "unread" : ""}>
                  <Link to={`/chat/${c.id}`}>
                    <strong>{c.counterpartName}</strong>
                    <span className="preview">{c.lastMessageText ?? "No messages yet"}</span>
                    {c.lastMessageAt && <time dateTime={c.lastMessageAt}>{dateTime(c.lastMessageAt)}</time>}
                    {c.unreadCount > 0 && (
                      <span className="count-badge" aria-label={`${c.unreadCount} unread`}>
                        {c.unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <Pagination meta={data.meta} onPage={setPage} />
          </>
        )}
      </section>
    </>
  );
}

async function findConversation(id: string) {
  for (let page = 1; page <= 10; page++) {
    const result = await api.conversations(page);
    const found = result.items.find((c) => c.id === id);
    if (found) return found;
    if (page >= result.meta.totalPages) break;
  }
  return undefined;
}
const merge = (current: ChatMessage[], incoming: ChatMessage[]) => {
  const byId = new Map(current.map((m) => [m.id, m]));
  for (const m of incoming) byId.set(m.id, m);
  return [...byId.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
};

export function ChatThread() {
  const { id = "" } = useParams();
  // Keyed by conversation, so opening another conversation starts from clean state.
  return <Thread key={id} id={id} />;
}
function Thread({ id }: { id: string }) {
  const [params] = useSearchParams(),
    me = useSession().profile?.id,
    state = useFormState(),
    [conversation, setConversation] = useState<Conversation | null>(null),
    [messages, setMessages] = useState<ChatMessage[]>([]),
    [loaded, setLoaded] = useState(false),
    [olderPage, setOlderPage] = useState(1),
    [hasOlder, setHasOlder] = useState(false),
    [text, setText] = useState(""),
    [attach, setAttach] = useState(true),
    [eventCard, setEventCard] = useState<{ id: string; title: string } | null>(null),
    [missing, setMissing] = useState(false),
    log = useRef<HTMLOListElement>(null),
    stick = useRef(true),
    poll = useRef(0),
    sendKey = useRef<{ text: string; key: string } | null>(null),
    marking = useRef(false),
    unread = useUnread();
  const eventId = params.get("event");
  const fetchNewest = useCallback(async () => {
    const mine = ++poll.current;
    const page = await api.messages(id, { sort: "newest", pageSize: 50 });
    // Ignore a slower, older response that finished after a newer one.
    if (mine !== poll.current) return;
    setMessages((current) => merge(current, page.items));
    setHasOlder((has) => has || page.meta.totalPages > 1);
  }, [id]);
  const { run } = state;
  useEffect(() => {
    let active = true;
    void run(async () => {
      try {
        const [found] = await Promise.all([findConversation(id), fetchNewest()]);
        if (!active) return;
        if (!found) setMissing(true);
        setConversation(found ?? null);
        setLoaded(true);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) setMissing(true);
        else throw error;
      }
    });
    return () => {
      active = false;
    };
  }, [id, run, fetchNewest]);
  useEffect(() => {
    if (!eventId) return;
    let active = true;
    api.event(eventId).then(
      (event) => active && setEventCard({ id: event.id, title: event.title }),
      () => undefined,
    );
    return () => {
      active = false;
    };
  }, [eventId]);
  useEffect(() => {
    if (!loaded || missing) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void fetchNewest().catch(() => undefined);
    }, pollInterval);
    return () => window.clearInterval(timer);
  }, [loaded, missing, fetchNewest, unread.version]);
  // Mark the other participant's messages read while this conversation is open and visible.
  const lastOther = [...messages].reverse().find((m) => m.senderId !== me);
  const unreadFromOther = messages.some((m) => m.senderId !== me && !m.readAt);
  useEffect(() => {
    if (!unreadFromOther || !lastOther || marking.current || document.visibilityState !== "visible") return;
    marking.current = true;
    api
      .readConversation(id, lastOther.id)
      .then(() => {
        setMessages((current) =>
          current.map((m) => (m.senderId !== me && !m.readAt ? { ...m, readAt: new Date().toISOString() } : m)),
        );
        announceUnreadChange();
      })
      .catch(() => undefined)
      .finally(() => {
        marking.current = false;
      });
  }, [unreadFromOther, lastOther, id, me]);
  useLayoutEffect(() => {
    const element = log.current;
    if (element && stick.current) element.scrollTop = element.scrollHeight;
  }, [messages]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = text.trim();
    if (!body) return;
    // Reuse the key when the same text is retried after a failed request, so a delivered message is not sent twice.
    if (sendKey.current?.text !== body) sendKey.current = { text: body, key: crypto.randomUUID() };
    const key = sendKey.current.key;
    void state.run(async () => {
      const sent = await api.sendMessage(
        id,
        { text: body, ...(eventCard && attach && messages.length === 0 ? { eventId: eventCard.id } : {}) },
        key,
      );
      sendKey.current = null;
      stick.current = true;
      setMessages((current) => merge(current, [sent]));
      setText("");
      setAttach(false);
    });
  }
  async function older() {
    const next = olderPage + 1;
    await state.run(async () => {
      const result = await api.messages(id, { sort: "newest", pageSize: 50, page: next });
      setMessages((current) => merge(current, result.items));
      setOlderPage(next);
      setHasOlder(next < result.meta.totalPages);
    });
  }
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">MESSAGES</p>
        <h1>{conversation?.counterpartName ?? "Conversation"}</h1>
        <Link to="/chat">All conversations</Link>
      </div>
      <Feedback state={state} />
      {missing ? (
        <section className="panel">
          <p role="alert">This conversation was not found.</p>
        </section>
      ) : !loaded ? (
        <p role="status">Loading messages...</p>
      ) : (
        <section className="panel chat">
          {hasOlder && (
            <button className="secondary" disabled={state.busy} onClick={() => void older()}>
              Show earlier messages
            </button>
          )}
          {messages.length === 0 ? (
            <p className="muted">No messages yet. Say hello below.</p>
          ) : (
            <ol
              className="message-log"
              aria-label="Messages"
              aria-live="polite"
              ref={log}
              onScroll={(e) => {
                const el = e.currentTarget;
                stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
              }}
            >
              {messages.map((m) => (
                <li key={m.id} className={m.senderId === me ? "mine" : "theirs"}>
                  {m.eventId && (
                    <Link className="event-card" to={`/events/${m.eventId}`}>
                      Activity: {m.eventTitle ?? "View activity"}
                    </Link>
                  )}
                  <p>{m.text}</p>
                  <time dateTime={m.createdAt}>
                    {dateTime(m.createdAt)}
                    {m.senderId === me && (m.readAt ? " · Read" : " · Sent")}
                  </time>
                </li>
              ))}
            </ol>
          )}
          <form onSubmit={submit} className="message-form">
            {eventCard && messages.length === 0 && (
              <label className="check-label">
                <input type="checkbox" checked={attach} onChange={(e) => setAttach(e.target.checked)} />
                Include activity: {eventCard.title}
              </label>
            )}
            <label htmlFor="message-text">Message</label>
            <textarea
              id="message-text"
              value={text}
              maxLength={maxLength}
              rows={3}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) e.currentTarget.form?.requestSubmit();
              }}
            />
            <p className="hint">
              {text.length}/{maxLength} · Ctrl+Enter sends. Administrators cannot read conversations.
            </p>
            <button disabled={state.busy || !text.trim()}>{state.busy ? "Sending..." : "Send message"}</button>
          </form>
        </section>
      )}
    </>
  );
}
