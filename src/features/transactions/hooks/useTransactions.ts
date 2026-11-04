import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { apiFetch } from "@/lib/api";
import type { Transaction } from "../api/transactionsApi";

export function useTransactions() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await apiFetch<Transaction[]>("/api/transactions");
    if (res.ok) {
      setItems(res.data);
      setError(null);
    } else {
      setError(
        res.error === "network_error"
          ? "Can't reach the server. Pull down to try again."
          : "Couldn't load your transactions. Pull down to try again."
      );
    }
    setLoading(false);
  }, []);

  // Reload whenever the screen comes into view
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

  return { items, loading, refreshing, error, refresh };
}