import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { verifySignupCode, resendSignupCode } from "@/features/auth";

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);
    const result = await verifySignupCode(email ?? "", code);
    setLoading(false);
    if (!result.ok) return setError(result.message);
    // Verifying also logs the user in. Change "/" to the next screen (for example create business).
    router.replace("/");
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    const result = await resendSignupCode(email ?? "");
    if (!result.ok) return setError(result.message);
    setInfo("A new code has been sent.");
    setCooldown(60);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>Enter the code we sent to {email}</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter code"
          placeholderTextColor="#9ca3af"
          keyboardType="number-pad"
          maxLength={8}
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, ""))}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}
        {info && <Text style={styles.infoText}>{info}</Text>}

        <TouchableOpacity
          style={[styles.button, (loading || code.length < 6) && { opacity: 0.6 }]}
          onPress={handleVerify}
          disabled={loading || code.length < 6}
        >
          <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} disabled={cooldown > 0} style={styles.resend}>
          <Text style={[styles.linkText, cooldown > 0 && { opacity: 0.5 }]}>
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: { paddingHorizontal: 24, paddingTop: 50 },
  title: { fontSize: 26, fontWeight: "800", color: "#0b4f8c", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#4b5563", marginBottom: 24 },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 22,
    letterSpacing: 6,
    textAlign: "center",
    color: "#1f2937",
  },
  errorText: { color: "#dc2626", fontSize: 13, marginTop: 10, textAlign: "center" },
  infoText: { color: "#16a34a", fontSize: 13, marginTop: 10, textAlign: "center" },
  button: {
    backgroundColor: "#0b4f8c",
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  resend: { alignSelf: "center", marginTop: 20 },
  linkText: { color: "#0b4f8c", fontSize: 14, fontWeight: "700" },
});