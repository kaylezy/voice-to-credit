import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "./BottomNav";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDashboard, type DashboardData } from "@/features/dashboard";
import { getProfileImageUri } from "@/lib/profile-image";

const naira = (n: number) =>
  `₦${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

type CardDef = {
  key: keyof DashboardData;
  label: string;
  note: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  bg: string;
};

const CARD_ROWS: CardDef[][] = [
  [
    {
      key: "total_sales",
      label: "Total Sales",
      note: "All time",
      icon: "bar-chart-outline",
      color: "#0b4f8c",
      bg: "#e0f2fe",
    },
    {
      key: "total_purchases",
      label: "Purchases",
      note: "All time",
      icon: "bag-handle-outline",
      color: "#ef4444",
      bg: "#fee2e2",
    },
  ],
  [
    {
      key: "total_expenses",
      label: "Expenses",
      note: "All time",
      icon: "wallet-outline",
      color: "#f59e0b",
      bg: "#fef3c7",
    },
    {
      key: "estimated_gross_profit",
      label: "Est. gross profit",
      note: "Sales minus purchases",
      icon: "trending-up-outline",
      color: "#10b981",
      bg: "#d1fae5",
    },
  ],
  [
    {
      key: "total_receivables",
      label: "Receivables",
      note: "Still owed to you",
      icon: "time-outline",
      color: "#06b6d4",
      bg: "#cffafe",
    },
    {
      key: "total_payables",
      label: "Payables",
      note: "Still owed by you",
      icon: "bus-outline",
      color: "#4f46e5",
      bg: "#e0e7ff",
    },
  ],
];

export default function DashboardScreen() {
  const router = useRouter();
  const { data, name, loading, refreshing, error, refresh } = useDashboard();
  const [profileImageUri, setProfileImageUriState] = useState<string | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const saved = await getProfileImageUri();
        if (active) setProfileImageUriState(saved);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const firstName = name?.trim().split(" ")[0] ?? "";
  const hasRecords = !!data && Object.values(data).some((v) => v !== 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.dashboardTitle}>Dashboard</Text>
            <Text style={styles.greetingText}>{greeting()}</Text>
            <Text style={styles.userNameText}>
              {firstName ? `${firstName}!` : " "}
            </Text>
          </View>
          <View style={styles.avatar}>
            {profileImageUri ? (
              <Image
                source={{ uri: profileImageUri }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarInitial}>
                {firstName ? firstName[0].toUpperCase() : ""}
              </Text>
            )}
          </View>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#0b4f8c"
            style={{ marginTop: 40 }}
          />
        )}

        {!loading && error && !data && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {!loading && data && (
          <View
            style={
              hasRecords ? styles.existingUserSection : styles.newUserSection
            }
          >
            {!hasRecords && (
              <>
                <View style={styles.illustrationBox}>
                  <Image
                    source={require("../../assets/images/dashboard-img.png")}
                    style={styles.illustration}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.welcomeHeading}>
                  Let’s start tracking{"\n"}your business
                </Text>
                <Text style={styles.welcomeSubtext}>
                  Turn your everyday transactions into structured records. Just
                  speak, we'll handle the rest.
                </Text>
              </>
            )}

            {CARD_ROWS.map((row, i) => (
              <View
                key={i}
                style={[
                  styles.gridRow,
                  !hasRecords && { alignSelf: "stretch" },
                ]}
              >
                {row.map((c) => (
                  <View
                    key={c.key}
                    style={[styles.card, { borderTopColor: c.color }]}
                  >
                    <View style={styles.cardHeader}>
                      <View
                        style={[styles.cardIconBox, { backgroundColor: c.bg }]}
                      >
                        <Ionicons name={c.icon} size={16} color={c.color} />
                      </View>
                      <Text style={styles.cardLabel}>{c.label}</Text>
                    </View>
                    <Text style={styles.cardValue}>{naira(data[c.key])}</Text>
                    <Text style={styles.cardNote}>{c.note}</Text>
                  </View>
                ))}
              </View>
            ))}

            <TouchableOpacity
              style={[
                styles.recordButton,
                !hasRecords && { alignSelf: "stretch" },
              ]}
              onPress={() => router.push("/record-transaction")}
            >
              <Text style={styles.recordButtonText}>Record a Transaction</Text>
            </TouchableOpacity>

            {!hasRecords && (
              <Text style={styles.emptyStateNotice}>
                Your confirmed records will appear here.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b4f8c",
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 13,
    color: "#6b7280",
  },
  userNameText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0b4f8c",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  newUserSection: {
    alignItems: "center",
  },
  illustrationBox: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  illustration: {
    width: "100%",
    height: 300,
  },
  welcomeHeading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0b4f8c",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 13,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  existingUserSection: {},
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cardLabel: { fontSize: 11, fontWeight: "600", color: "#6b7280" },
  cardValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 4,
  },
  cardChangePositive: { fontSize: 10, fontWeight: "700", color: "#10b981" },
  cardChangeNegative: { fontSize: 10, fontWeight: "700", color: "#ef4444" },
  cardChangeOrange: { fontSize: 10, fontWeight: "700", color: "#f59e0b" },
  cardChangeZero: { fontSize: 10, fontWeight: "700", color: "#0b4f8c" },
  cardChangeZeroRed: { fontSize: 10, fontWeight: "700", color: "#ef4444" },
  cardChangeZeroOrange: { fontSize: 10, fontWeight: "700", color: "#f59e0b" },
  cardChangeZeroGreen: { fontSize: 10, fontWeight: "700", color: "#10b981" },
  trendsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  trendsTitle: { fontSize: 16, fontWeight: "800", color: "#0b4f8c" },
  trendsDate: { fontSize: 12, color: "#9ca3af" },
  trendsSubtitle: { fontSize: 12, color: "#6b7280", marginBottom: 12 },
  chartsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  chartCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    height: 160,
  },
  chartTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  chartTitleText: { fontSize: 12, fontWeight: "700", color: "#1f2937" },
  chartPlaceholder: { width: "100%", height: 110 },
  recordButton: {
    backgroundColor: "#0b4f8c",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 14,
    shadowColor: "#0b4f8c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  recordButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  emptyStateNotice: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  insightBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ccfbf1",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  insightText: { flex: 1, fontSize: 13, fontWeight: "600", color: "#0f766e" },
  cardNote: { fontSize: 10, fontWeight: "600", color: "#9ca3af" },
  avatarInitial: { fontSize: 18, fontWeight: "800", color: "#0b4f8c" },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    textAlign: "center",
    marginTop: 40,
  },
});
