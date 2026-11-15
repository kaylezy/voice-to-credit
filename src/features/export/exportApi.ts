import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { supabase } from "@/lib/supabase";
import * as Print from "expo-print";

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

type Summary = {
  business: { name: string };
  period: { from: string | null; to: string | null };
  generated_at: string;
  transaction_count: number;
  totals: {
    sales: number;
    purchases: number;
    expenses: number;
    receivables: number;
    payables: number;
    net: number;
  };
  outstanding: {
    receivables_count: number;
    receivables_value: number;
    payables_count: number;
    payables_value: number;
  };
  months: { month: string; sales: number; costs: number; net: number }[];
  recent: {
    date: string | null;
    type: string | null;
    item: string;
    party: string;
    amount: number;
    status: string | null;
  }[];
};

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function naira(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}₦${abs}`;
}

function monthName(ym: string): string {
  const [y, m] = ym.split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const idx = Number(m) - 1;
  return idx >= 0 && idx < 12 ? `${names[idx]} ${y}` : ym;
}

function buildHtml(s: Summary, periodLabel: string): string {
  const generated = new Date(s.generated_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const monthRows = s.months
    .map(
      (m) => `<tr><td>${esc(monthName(m.month))}</td>
        <td class="r">${naira(m.sales)}</td>
        <td class="r">${naira(m.costs)}</td>
        <td class="r">${naira(m.net)}</td></tr>`
    )
    .join("");

  const recentRows = s.recent
    .map(
      (t) => `<tr><td>${esc(t.date)}</td><td>${esc(t.type)}</td>
        <td>${esc(t.item)}</td><td>${esc(t.party)}</td>
        <td class="r">${naira(t.amount)}</td><td>${esc(t.status)}</td></tr>`
    )
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8" />
<style>
  body { font-family: Helvetica, Arial, sans-serif; color: #1f2937; padding: 28px; }
  h1 { color: #0b4f8c; margin: 0 0 4px; font-size: 24px; }
  .sub { color: #6b7280; font-size: 12px; margin-bottom: 20px; }
  h2 { color: #0b4f8c; font-size: 15px; margin: 22px 0 8px; }
  .cards { display: flex; flex-wrap: wrap; gap: 10px; }
  .card { flex: 1 1 30%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; }
  .card .l { font-size: 11px; color: #6b7280; }
  .card .v { font-size: 16px; font-weight: 700; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { text-align: left; background: #f1f5f9; padding: 6px; }
  td { padding: 6px; border-bottom: 1px solid #e5e7eb; }
  .r { text-align: right; }
  .note { margin-top: 24px; font-size: 10px; color: #6b7280; line-height: 1.5; }
</style></head><body>
  <h1>${esc(s.business.name)}</h1>
  <div class="sub">Financial summary · ${esc(periodLabel)} · Generated ${esc(generated)}</div>

  <div class="cards">
    <div class="card"><div class="l">Total sales</div><div class="v">${naira(s.totals.sales)}</div></div>
    <div class="card"><div class="l">Purchases</div><div class="v">${naira(s.totals.purchases)}</div></div>
    <div class="card"><div class="l">Expenses</div><div class="v">${naira(s.totals.expenses)}</div></div>
    <div class="card"><div class="l">Net (sales − purchases − expenses)</div><div class="v">${naira(s.totals.net)}</div></div>
    <div class="card"><div class="l">Transactions</div><div class="v">${s.transaction_count}</div></div>
  </div>

  <h2>Open debts (original value)</h2>
  <div class="cards">
    <div class="card"><div class="l">Customers still owe you</div>
      <div class="v">${naira(s.outstanding.receivables_value)}</div>
      <div class="l">${s.outstanding.receivables_count} open</div></div>
    <div class="card"><div class="l">You still owe suppliers</div>
      <div class="v">${naira(s.outstanding.payables_value)}</div>
      <div class="l">${s.outstanding.payables_count} open</div></div>
  </div>

  <h2>By month</h2>
  <table><tr><th>Month</th><th class="r">Sales</th><th class="r">Costs</th><th class="r">Net</th></tr>
  ${monthRows || '<tr><td colspan="4">No records in this period.</td></tr>'}</table>

  <h2>Recent transactions</h2>
  <table><tr><th>Date</th><th>Type</th><th>Item</th><th>Party</th><th class="r">Amount</th><th>Status</th></tr>
  ${recentRows || '<tr><td colspan="6">No records in this period.</td></tr>'}</table>

  <div class="note">
    Prepared by Trade-Padi from records entered by the business owner. These figures have not been
    independently audited or verified.
  </div>
</body></html>`;
}


export async function exportFinancialPdf(
  periodLabel: string,
  range?: { from?: string; to?: string }
) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    return { ok: false as const, error: "Please log in again." };
  }

  const qs = new URLSearchParams();
  if (range?.from) qs.set("from", range.from);
  if (range?.to) qs.set("to", range.to);

  const query = qs.toString() ? `?${qs.toString()}` : "";

  let res: Response;

  try {
    res = await fetch(`${API_URL}/api/exports/summary${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return { ok: false as const, error: "No connection. Try again." };
  }

  if (res.status === 429) {
    return {
      ok: false as const,
      error: "Too many exports. Wait a minute.",
    };
  }

  if (!res.ok) {
    return {
      ok: false as const,
      error: "Could not build the report. Try again.",
    };
  }

  try {
    const summary = (await res.json()) as Summary;

    const printed = await Print.printToFileAsync({
  html: buildHtml(summary, periodLabel),
  base64: true,
});

if (!printed.base64) {
  return { ok: false as const, error: "Could not create the PDF. Try again." };
}

// Write the PDF ourselves into the app cache so sharing is allowed
const binary = atob(printed.base64);
const bytes = new Uint8Array(binary.length);
for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

const pdfName = `trade-padi-financial-summary-${new Date().toISOString().slice(0, 10)}.pdf`;
const dest = new File(Paths.cache, pdfName);
if (dest.exists) dest.delete();
dest.create();
dest.write(bytes);

if (!(await Sharing.isAvailableAsync())) {
  return { ok: false as const, error: "Sharing is not available on this phone." };
}
await Sharing.shareAsync(dest.uri, {
  mimeType: "application/pdf",
  dialogTitle: "Financial summary",
  UTI: "com.adobe.pdf",
});
return { ok: true as const };
  } catch (error) {
    console.error("PDF export error:", error);

    return {
      ok: false as const,
      error: "Could not generate or share the PDF. Please try again.",
    };
  }
}
