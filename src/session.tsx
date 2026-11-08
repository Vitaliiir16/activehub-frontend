import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError, type Profile } from "./api/client";

type SessionContext = {
  profile: Profile | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<Profile | null>;
  clear: () => void;
};
const Context = createContext<SessionContext | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  async function refresh() {
    setError("");
    try {
      const value = await api.profile();
      setProfile(value);
      return value;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setProfile(null);
        return null;
      }
      setError("We could not restore your session. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const ended = () => setProfile(null);
    window.addEventListener("activehub:session-ended", ended);
    let active = true;
    api
      .session()
      .then(() => api.profile())
      .then((value) => {
        if (active) setProfile(value);
      })
      .catch((error) => {
        if (active && !(error instanceof ApiError && error.status === 401))
          setError("We could not restore your session. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      window.removeEventListener("activehub:session-ended", ended);
      active = false;
    };
  }, []);
  return (
    <Context.Provider
      value={{
        profile,
        loading,
        error,
        refresh,
        clear: () => setProfile(null),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useSession() {
  const value = useContext(Context);
  if (!value) throw Error("Session provider is missing");
  return value;
}
export const homeFor = (role: Profile["role"]) =>
  role === "USER" ? "/events" : role === "ORGANIZER" ? "/organizer" : "/admin";
