import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const send = async (goNext: boolean) => {
    setError(null);
    setInfo(null);
    const clean = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(clean)) return setError("Enter a valid email address.");

    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(clean);
    setLoading(false);

    // Same message whether or not the account exists, so the screen can't be used to find accounts
    if (err && err.status === 429) return setError("Too many requests. Please wait a minute and try again.");
    setInfo("If an account exists for that email, a code has been sent.");
    if (goNext) router.push({ pathname: "/change-password", params: { email: clean } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Input your email address to receive a one-time password</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Email Address"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {info && <Text style={styles.infoText}>{info}</Text>}

        <TouchableOpacity style={[styles.primaryButton, loading && { opacity: 0.6 }]} onPress={() => send(false)} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? "Sending..." : "Send Code"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push({ pathname: "/change-password", params: { email: email.trim().toLowerCase() } })}
        >
          <Text style={styles.secondaryButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Didn’t receive a code? </Text>
        <TouchableOpacity onPress={() => send(false)} disabled={loading}>
          <Text style={styles.linkText}>Resend Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 24,
    paddingTop: 10,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0b4f8c",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 44,
    marginTop: 44,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1f2937",
  },
  primaryButton: {
    backgroundColor: "#0b4f8c",
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#0b4f8c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#0d9488", // Teal accent matching screenshot
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#4b5563",
    fontSize: 14,
  },
  linkText: {
    color: "#0b4f8c",
    fontSize: 14,
    fontWeight: "700",
  },
  errorText: { color: "#dc2626", fontSize: 13, textAlign: "center", marginBottom: 12 }, 
  infoText: { color: "#0d9488", fontSize: 13, textAlign: "center", marginBottom: 12 },
});