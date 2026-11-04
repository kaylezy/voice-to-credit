import { Stack } from "expo-router";
import { OnboardingProvider } from "@/features/business";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </OnboardingProvider>
  );
}