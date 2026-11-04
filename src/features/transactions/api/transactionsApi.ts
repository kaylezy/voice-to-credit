import { apiFetch, type ApiResult } from "@/lib/api";
import { isDebt, type PayStatus, type TxDraft, type TxType } from "../hooks/useTransactionDraft";
import { File } from "expo-file-system";

type Failure = Extract<ApiResult<unknown>, { ok: false }>;

const FIELD_LABELS: Record<string, string> = {
  amount: "Amount",
  quantity: "Quantity",
  transaction_date: "Date",
  due_date: "Due date",
  product_name: "Product",
  type: "Type",
  text: "Text",
};

function describe(res: Failure): string {
  if (res.error === "network_error") return "Can't reach the server. Check your connection and try again.";
  if (res.status === 429) return "Too many requests. Please wait a moment and try again.";
  if (typeof res.body?.message === "string") return res.body.message;
  if (res.error === "validation_failed" && res.fields) {
    const first = Object.entries(res.fields)[0];
    if (first) return `${FIELD_LABELS[first[0]] ?? first[0]}: ${first[1][0]}`;
  }
  if (res.error === "business_not_found") return "Set up your business first.";
  return "Something went wrong. Please try again.";
}

// ---------- helpers ----------

export const typeLabel = (t: TxType) => t.charAt(0).toUpperCase() + t.slice(1);
export const statusLabel = (s: PayStatus) =>
  s === "paid" ? "Paid" : s === "unpaid" ? "Unpaid" : "Partially paid";
export const formatNaira = (n: number) => `₦${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

// Today's date in Lagos (UTC+1, no daylight saving), offset by whole days
function lagosDate(offsetDays = 0) {
  return new Date(Date.now() + 3600_000 + offsetDays * 86400_000).toISOString().slice(0, 10);
}

function realDate(y: string, mo: string, d: string): string | undefined {
  const iso = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  const dt = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(dt.getTime()) || dt.getUTCDate() !== Number(d)) return undefined;
  return iso;
}

// "Today", "Yesterday", 12/03/2026 or 2026-03-12 -> "2026-03-12". Invalid -> undefined.
export function parseDateInput(input: string): string | undefined {
  const v = input.trim().toLowerCase();
  if (!v || v === "today") return lagosDate();
  if (v === "yesterday") return lagosDate(-1);
  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return realDate(iso[1], iso[2], iso[3]);
  const dmy = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (dmy) return realDate(dmy[3], dmy[2], dmy[1]);
  return undefined;
}

export function parseAmount(input: string): number | null {
  const n = parseFloat(input.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseQuantity(input: string): number | null {
  const n = parseFloat(input);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function validateDraft(draft: TxDraft): string | null {
  if (!draft.product.trim()) return "Enter what was sold, bought or paid for.";
  if (parseAmount(draft.amount) === null) return "Enter an amount greater than 0.";
  if (draft.quantity.trim() && parseQuantity(draft.quantity) === null) {
    return "Quantity must be a number greater than 0.";
  }
  if (parseDateInput(draft.date) === undefined) {
    return "Date must look like 12/03/2026, or type Today.";
  }
  if (isDebt(draft.type)) {
    if (!draft.party.trim()) {
      return draft.type === "receivable" ? "Add the customer who owes you." : "Add the supplier you owe.";
    }
    if (draft.dueDate.trim() && parseDateInput(draft.dueDate) === undefined) {
      return "Due date must look like 30/11/2026.";
    }
  }
  return null;
}

// ---------- voice ----------

export async function transcribeAudio(
  uri: string
): Promise<{ ok: true; transcript: string } | { ok: false; message: string }> {
  const fileUri = uri.startsWith("file://") ? uri : `file://${uri}`;
  console.log("[transcribe] uploading", fileUri);

  const form = new FormData();
  form.append("audio", new File(fileUri), "recording.m4a");

  const res = await apiFetch<{ transcript: string }>("/api/voice/transcribe", { method: "POST", form });
  if (!res.ok) return { ok: false, message: describe(res) };
  return { ok: true, transcript: res.data.transcript };
}

type Parsed = {
  type: TxType;
  product_name?: string | null;
  quantity?: number | null;
  unit?: string | null;
  amount: number;
  customer_name?: string | null;
  supplier_name?: string | null;
  payment_status?: PayStatus;
  notes?: string | null;
  confidence?: number | null;
};

export async function parseTranscript(
  text: string
): Promise<{ ok: true; draft: Partial<TxDraft> } | { ok: false; message: string }> {
  const res = await apiFetch<Parsed>("/api/transactions/parse", {
    method: "POST",
    body: { text: text.trim().slice(0, 500) },
  });
  if (!res.ok) return { ok: false, message: describe(res) };

  const p = res.data;
  return {
    ok: true,
    draft: {
      type: p.type,
      product: p.product_name ?? "",
      quantity: p.quantity != null ? String(p.quantity) : "",
      unit: p.unit ?? "",
      amount: String(p.amount),
      party: p.customer_name ?? p.supplier_name ?? "",
      status: p.payment_status ?? "paid",
      notes: p.notes ?? "",
      confidence: p.confidence ?? null,
      inputMethod: "voice",
    },
  };
}

// ---------- save ----------

// Finds the customer/supplier by name, or creates it if it is new
async function resolveParty(
  kind: "customers" | "suppliers",
  name: string
): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const list = await apiFetch<{ id: string; name: string }[]>(`/api/${kind}`);
  if (!list.ok) return { ok: false, message: describe(list) };

  const match = list.data.find((p) => p.name.trim().toLowerCase() === name.toLowerCase());
  if (match) return { ok: true, id: match.id };

  const created = await apiFetch<{ id: string }>(`/api/${kind}`, { method: "POST", body: { name } });
  if (!created.ok) return { ok: false, message: describe(created) };
  return { ok: true, id: created.data.id };
}

// Turns the draft into the body the API expects (shared by create and update)
async function buildPayload(
  draft: TxDraft
): Promise<{ ok: true; body: Record<string, unknown> } | { ok: false; message: string }> {
  const problem = validateDraft(draft);
  if (problem) return { ok: false, message: problem };

  const amount = parseAmount(draft.amount)!;
  const quantity = draft.quantity.trim() ? parseQuantity(draft.quantity) : null;
  const date = parseDateInput(draft.date)!;
  const dueDate = isDebt(draft.type) && draft.dueDate.trim() ? parseDateInput(draft.dueDate) : undefined;

  const links: { customer_id?: string; supplier_id?: string } = {};
  const name = draft.party.trim();
  if (name && draft.type !== "expense") {
    const isCustomer = draft.type === "sale" || draft.type === "receivable";
    const party = await resolveParty(isCustomer ? "customers" : "suppliers", name);
    if (!party.ok) return { ok: false, message: party.message };
    links[isCustomer ? "customer_id" : "supplier_id"] = party.id;
  }

  return {
    ok: true,
    body: {
      type: draft.type,
      amount,
      product_name: draft.product.trim(),
      ...(quantity ? { quantity } : {}),
      ...(draft.unit.trim() ? { unit: draft.unit.trim() } : {}),
      transaction_date: date,
      payment_status: draft.status,
      ...(draft.notes.trim() ? { notes: draft.notes.trim() } : {}),
      ...(dueDate ? { due_date: dueDate } : {}),
      ...links,
    },
  };
}

export type SaveResult = { ok: true; id: string } | { ok: false; code?: string; message: string };

export async function saveTransaction(
  draft: TxDraft,
  idempotencyKey: string,
  allowDuplicate = false
): Promise<SaveResult> {
  const built = await buildPayload(draft);
  if (!built.ok) return { ok: false, message: built.message };

  const res = await apiFetch<{ id: string }>("/api/transactions", {
    method: "POST",
    idempotencyKey,
    body: {
      ...built.body,
      input_method: draft.inputMethod,
      ...(allowDuplicate ? { allow_duplicate: true } : {}),
    },
  });

  if (!res.ok) {
    if (res.error === "duplicate_transaction") {
      return {
        ok: false,
        code: res.error,
        message: "You saved the same transaction a moment ago. Save again only if it is a separate one.",
      };
    }
    return { ok: false, code: res.error, message: describe(res) };
  }
  return { ok: true, id: res.data.id };
}

export async function updateTransaction(
  id: string,
  draft: TxDraft
): Promise<{ ok: true } | { ok: false; message: string }> {
  const built = await buildPayload(draft);
  if (!built.ok) return { ok: false, message: built.message };

  const res = await apiFetch(`/api/transactions/${id}`, { method: "PATCH", body: built.body });
  if (!res.ok) return { ok: false, message: describe(res) };
  return { ok: true };
}

// ---------- reading transactions ----------

export type Transaction = {
  id: string;
  type: TxType;
  product_name: string | null;
  description: string | null;
  quantity: number | null;
  unit: string | null;
  amount: number;
  currency: string | null;
  customer_id: string | null;
  supplier_id: string | null;
  transaction_date: string;
  payment_status: PayStatus;
  input_method: string;
  notes: string | null;
  created_at: string;
  due_date: string | null;
};

export type PaymentRow = { id: string; amount: number; paid_at: string; note: string | null };
export type DebtSummary = { amount_paid: number; outstanding: number; payments: PaymentRow[] };

export { lagosDate };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-06-09" -> "Jun 9, 2026" (or "Today")
export function formatDay(isoDate: string) {
  const d = isoDate.slice(0, 10);
  if (d === lagosDate()) return "Today";
  const [y, m, day] = d.split("-").map(Number);
  return `${MONTHS[m - 1]} ${day}, ${y}`;
}

// A timestamp -> "05:32 PM" in the phone's local time
export function formatClock(ts: string) {
  const dt = new Date(ts);
  let h = dt.getHours();
  const min = String(dt.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${min} ${ampm}`;
}

// Fills the edit form from a saved transaction
export function draftFromTransaction(tx: Transaction, partyName: string | null): Partial<TxDraft> {
  return {
    type: tx.type,
    product: tx.product_name ?? tx.description ?? "",
    quantity: tx.quantity != null ? String(tx.quantity) : "",
    unit: tx.unit ?? "",
    amount: String(tx.amount),
    date: tx.transaction_date,
    party: partyName ?? "",
    status: tx.payment_status,
    dueDate: tx.due_date ?? "",
    notes: tx.notes ?? "",
    inputMethod: tx.input_method === "voice" ? "voice" : "manual",
    confidence: null,
    transcript: "",
  };
}

// There is no "get one transaction" endpoint, so find it in the list
export async function getTransactionDetails(
  id: string
): Promise<
  | { ok: true; tx: Transaction; partyName: string | null; debt: DebtSummary | null }
  | { ok: false; message: string }
> {
  const list = await apiFetch<Transaction[]>("/api/transactions");
  if (!list.ok) return { ok: false, message: describe(list) };

  const tx = list.data.find((t) => t.id === id);
  if (!tx) return { ok: false, message: "Transaction not found." };

  let partyName: string | null = null;
  const partyId = tx.customer_id ?? tx.supplier_id;
  if (partyId) {
    const kind = tx.customer_id ? "customers" : "suppliers";
    const parties = await apiFetch<{ id: string; name: string }[]>(`/api/${kind}`);
    if (parties.ok) partyName = parties.data.find((p) => p.id === partyId)?.name ?? null;
  }

  let debt: DebtSummary | null = null;
  if (isDebt(tx.type)) {
    const pay = await apiFetch<DebtSummary>(`/api/transactions/${id}/payments`);
    if (pay.ok) debt = pay.data;
  }

  return { ok: true, tx, partyName, debt };
}

export async function deleteTransaction(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await apiFetch(`/api/transactions/${id}`, { method: "DELETE" });
  if (!res.ok) {
    if (res.error === "transaction_has_payments") {
      return { ok: false, message: "This debt has payments recorded, so it can't be deleted." };
    }
    return { ok: false, message: describe(res) };
  }
  return { ok: true };
}

export async function addPayment(
  id: string,
  amountInput: string,
  note: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  const amount = parseAmount(amountInput);
  if (amount === null) return { ok: false, message: "Enter an amount greater than 0." };

  const res = await apiFetch(`/api/transactions/${id}/payments`, {
    method: "POST",
    body: { amount, ...(note.trim() ? { note: note.trim() } : {}) },
  });

  if (!res.ok) {
    if (res.error === "overpayment") {
      const left = Number(res.body?.outstanding ?? 0);
      return { ok: false, message: `That is more than what is still owed (${formatNaira(left)}).` };
    }
    if (res.error === "already_settled") return { ok: false, message: "This debt is already fully paid." };
    return { ok: false, message: describe(res) };
  }
  return { ok: true };
}