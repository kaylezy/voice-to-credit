import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { apiFetch } from "@/lib/api";

export type DashboardData = {
  total_sales: number;
  total_purchases: number;
  total_expenses: number;
  estimated_gross_profit: number;
  total_receivables: number;
  total_payables: number;
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [dash, profile] = await Promise.all([
      apiFetch<DashboardData>("/api/dashboard"),
      apiFetch<{ full_name: string }>("/api/profiles"),
    ]);

    if (dash.ok) {
      setData(dash.data);
      setError(null);
    } else {
      setError(
        dash.error === "network_error"
          ? "Can't reach the server. Pull down to try again."
          : "Couldn't load your dashboard. Pull down to try again."
      );
    }
    if (profile.ok) setName(profile.data.full_name);
    setLoading(false);
  }, []);

  // Reload every time the screen comes into view (for example after saving a transaction)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return { data, name, loading, refreshing, error, refresh };
}