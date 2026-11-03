import { useState } from "react";
import { signIn } from "../api/authApi";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Returns "ok", "needs_verification" (send the user to the OTP screen) or "failed"
  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.ok) return "ok" as const;
    if (result.code === "email_not_confirmed") return "needs_verification" as const;
    setError(result.message);
    return "failed" as const;
  }

  return { login, loading, error };
}