import { supabase } from "@/lib/supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export type Range = "3m" | "6m" | "12m";
export type Change = number | null;
export type Card = { value: number; change: Change };

export type Analytics = {
  range: Range;
  has_previous: boolean;
  cards: {
    total_sales: Card;
    total_purchases: Card;
    total_expenses: Card;
    outstanding_receivables: Card;
    outstanding_payables: Card;
    avg_sales_value: Card;
  };
  avg_monthly_sales: number;
  sales_growth_pct: Change;
  months: { month: string; label: string; sales: number; purchases: number; expenses: number }[];
  by_type: {
    type: "sale" | "purchase" | "expense";
    count: number;
    amount: number;
    pct_count: number;
    pct_amount: number;
  }[];
  total_count: number;
  total_amount: number;
};

export async function fetchAnalytics(range: Range): Promise<Analytics | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/api/dashboard/analytics?range=${range}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as Analytics;
  } catch {
    return null;
  }
}