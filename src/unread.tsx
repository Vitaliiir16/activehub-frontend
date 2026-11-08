import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api } from "./api/client";
import { useSession } from "./session";

type Unread = {
  notifications: number;
  messages: number;
  /** Changes whenever either count changes, so open lists can reload. */
  version: number;
  refresh: () => void;
};
const Context = createContext<Unread>({
  notifications: 0,
  messages: 0,
  version: 0,
  refresh: () => undefined,
});
const interval = 8000;

/** Polls the unread notification and chat counts for the header while the tab is visible. */
export function UnreadProvider({ children }: { children: ReactNode }) {
  const { profile } = useSession(),
    role = profile?.role,
    owner = profile?.id,
    [stored, setCounts] = useState({ owner: "", notifications: 0, messages: 0, version: 0 }),
    sequence = useRef(0);
  // Counts belong to the account that fetched them, so a new sign-in never shows the previous account's numbers.
  const counts = stored.owner === owner ? stored : { owner: "", notifications: 0, messages: 0, version: stored.version };
  const refresh = useCallback(async () => {
    if (!role) return;
    const mine = ++sequence.current;
    try {
      const [notifications, messages] = await Promise.all([
        api.unreadNotifications(),
        role === "ADMIN" ? Promise.resolve(0) : api.conversations().then((c) => c.unreadTotal),
      ]);
      // A slower, older response must not overwrite a newer one.
      if (mine !== sequence.current) return;
      setCounts((current) =>
        current.owner === owner && current.notifications === notifications && current.messages === messages
          ? current
          : { owner: owner ?? "", notifications, messages, version: current.version + 1 },
      );
    } catch {
      // The next poll retries; a failed poll must not interrupt the page.
    }
  }, [role, owner]);
  useEffect(() => {
    if (!role) {
      sequence.current++;
      return;
    }
    const first = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, interval);
    const wake = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("activehub:unread-changed", wake);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("activehub:unread-changed", wake);
    };
  }, [role, refresh]);
  return (
    <Context.Provider
      value={{
        notifications: counts.notifications,
        messages: counts.messages,
        version: counts.version,
        refresh: () => void refresh(),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useUnread = () => useContext(Context);
export const announceUnreadChange = () => window.dispatchEvent(new Event("activehub:unread-changed"));
