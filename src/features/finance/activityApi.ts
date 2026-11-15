import { supabase } from "@/lib/supabase";
import type { ActivityPoint } from "./ActivityChart";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export async function fetchActivity(months = 6): Promise<ActivityPoint[] | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/api/finance/activity?months=${months}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { months: ActivityPoint[] };
    return json.months;
  } catch {
    return null;
  }
}