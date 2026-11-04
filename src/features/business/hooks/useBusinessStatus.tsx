import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/features/auth";
import { apiFetch } from "@/lib/api";

export type BusinessStatus = "unknown" | "none" | "exists";

const Ctx = createContext<{ status: BusinessStatus; refresh: () => Promise<void> }>({
  status: "unknown",
  refresh: async () => {},
});

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [status, setStatus] = useState<BusinessStatus>("unknown");

  const refresh = useCallback(async () => {
    if (!userId) {
      setStatus("unknown");
      return;
    }
    const res = await apiFetch<unknown[]>("/api/businesses");
    if (res.ok) setStatus(res.data.length > 0 ? "exists" : "none");
    // If the check fails (offline, or the server is waking up), don't trap the user in onboarding
    else setStatus("exists");
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <Ctx.Provider value={{ status, refresh }}>{children}</Ctx.Provider>;
}

export const useBusinessStatus = () => useContext(Ctx);