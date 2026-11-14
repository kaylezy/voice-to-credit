import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { supabase } from "@/lib/supabase";

// Use the SAME base URL variable your src/lib/api.ts uses
const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export async function exportTransactionsCsv(range?: { from?: string; to?: string }) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return { ok: false as const, error: "Please log in again." };

  const qs = new URLSearchParams();
  if (range?.from) qs.set("from", range.from);
  if (range?.to) qs.set("to", range.to);
  const query = qs.toString() ? `?${qs.toString()}` : "";

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/exports/transactions${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return { ok: false as const, error: "No connection. Try again." };
  }

  if (res.status === 429) return { ok: false as const, error: "Too many exports. Wait a minute." };
  if (!res.ok) return { ok: false as const, error: "Could not export. Try again." };

  const csv = await res.text();
  const name = `trade-padi-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(csv);

  if (!(await Sharing.isAvailableAsync())) {
    return { ok: false as const, error: "Sharing is not available on this phone." };
  }
  await Sharing.shareAsync(file.uri, {
    mimeType: "text/csv",
    dialogTitle: "Export transactions",
    UTI: "public.comma-separated-values-text",
  });
  return { ok: true as const };
}