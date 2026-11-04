import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/features/auth";
import { BusinessProvider, useBusinessStatus } from "@/features/business";
import { TransactionDraftProvider } from "@/features/transactions";

function AuthGate() {
  const { session, loading } = useAuth();
  const { status } = useBusinessStatus();
  const segments = useSegments();
  const router = useRouter();
  const checking = loading || (!!session && status === "unknown");

  useEffect(() => {
    if (checking) return;

    const parts = segments as string[];
    const first = parts[0];
    const second = parts[1];
    const inWelcome = parts.length === 0 || first === "index";
    const inAuth = first === "(auth)";
    const inOnboarding = first === "onboarding";
    const inSetupComplete = inOnboarding && second === "setup-complete";
    const isIntro = inOnboarding && (parts.length === 1 || second === "index");
    const resettingPassword =
      inAuth && (second === "change-password" || second === "password-success");

    // Logged out: only the welcome, auth and onboarding screens are open
    if (!session) {
      if (!(inWelcome || inAuth || inOnboarding)) router.replace("/(auth)/login");
      return;
    }

    if (resettingPassword) return;

    // Logged in but no business yet: onboarding
        if (status === "none") {
      if (!inOnboarding || isIntro) router.replace("/onboarding/business-info");
      return;
    }

    // Logged in with a business: keep them out of welcome, login and onboarding
    if (inWelcome || inAuth || (inOnboarding && !inSetupComplete)) {
      router.replace("/dashboard");
    }
  }, [session, status, checking, segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {checking && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0b4f8c" />
        </View>
      )}
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <TransactionDraftProvider>
          <AuthGate />
        </TransactionDraftProvider>
      </BusinessProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
});