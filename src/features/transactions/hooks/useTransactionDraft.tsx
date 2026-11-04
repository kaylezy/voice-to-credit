import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type TxType = "sale" | "purchase" | "expense" | "receivable" | "payable";
export type PayStatus = "paid" | "unpaid" | "partially_paid";

export type TxDraft = {
  type: TxType;
  product: string;
  quantity: string;
  unit: string;
  amount: string;
  date: string; // "Today", 12/03/2026 or 2026-03-12
  party: string; // customer or supplier name
  status: PayStatus;
  dueDate: string;
  notes: string;
  inputMethod: "voice" | "manual";
  confidence: number | null;
  transcript: string;
};

export const isDebt = (t: TxType) => t === "receivable" || t === "payable";

// Random ID used to stop a double-tap from saving twice
const newKey = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

const emptyDraft = (): TxDraft => ({
  type: "sale",
  product: "",
  quantity: "",
  unit: "",
  amount: "",
  date: "Today",
  party: "",
  status: "paid",
  dueDate: "",
  notes: "",
  inputMethod: "manual",
  confidence: null,
  transcript: "",
});

type TxCtx = {
  draft: TxDraft;
  update: (patch: Partial<TxDraft>) => void;
  reset: () => void;
  idempotencyKey: string;
  savedId: string | null;
  setSavedId: (id: string | null) => void;
};

const Ctx = createContext<TxCtx | null>(null);

export function TransactionDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<TxDraft>(emptyDraft);
  const [idempotencyKey, setKey] = useState(newKey);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Any edit gets a new key, so a changed transaction is never mistaken for a repeat
  const update = useCallback((patch: Partial<TxDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setKey(newKey());
  }, []);

  const reset = useCallback(() => {
    setDraft(emptyDraft());
    setKey(newKey());
    setSavedId(null);
  }, []);

  return (
    <Ctx.Provider value={{ draft, update, reset, idempotencyKey, savedId, setSavedId }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTransactionDraft() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTransactionDraft must be used inside TransactionDraftProvider");
  return c;
}