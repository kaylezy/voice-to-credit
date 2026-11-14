import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from "react-native";
import Svg, { Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "./BottomNav";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiFetch } from "@/lib/api";
import { formatNaira } from "@/features/transactions";
import { getProfileImageUri, setProfileImageUri } from "@/lib/profile-image";
import { supabase } from "@/lib/supabase";

type Profile = {
  total_recorded_sales: number;
  total_recorded_purchases: number;
  total_recorded_expenses: number;
  estimated_gross_profit: number;
  average_sale_value: number;
  outstanding_receivables: number;
  outstanding_payables: number;
  transaction_count: number;
  active_recording_days: number;
};

type Business = {
  name: string;
  category: string | null;
  location: string | null;
};

const salesSeries = [120, 210, 170, 280, 260, 410];
const expenseSeries = [70, 150, 130, 190, 240, 310];
const chartMaxValue = 700;
const chartMinValue = 0;

const buildLinePath = (values: number[], width: number, height: number) => {
  const max = chartMaxValue;
  const min = chartMinValue;
  const stepX = width / (values.length - 1);

  return values
    .map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / (max - min || 1)) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const buildAreaPath = (values: number[], width: number, height: number) => {
  const linePath = buildLinePath(values, width, height);
  const lastX = width;
  const firstX = 0;
  return `${linePath} L ${lastX} ${height} L ${firstX} ${height} Z`;
};

export default function FinanceScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredSince, setRegisteredSince] = useState<string | null>(null);
  const [profileImageUri, setProfileImageUriState] = useState<string | null>(
    null,
  );

  const load = useCallback(async () => {
    const [p, b] = await Promise.all([
      apiFetch<Profile>("/api/financial-profile"),
      apiFetch<Business[]>("/api/businesses"),
    ]);
    if (p.ok) {
      setProfile(p.data);
      setError(null);
    } else {
      setError(
        p.error === "network_error"
          ? "Can't reach the server. Pull down to try again."
          : "Could not load your financial profile.",
      );
    }
    if (b.ok && b.data[0]) setBusiness(b.data[0]);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const saved = await getProfileImageUri();
      if (active) setProfileImageUriState(saved);
    })();
    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user?.created_at) {
          setRegisteredSince(data.user.created_at);
        }
      })();
      load();
    }, [load]),
  );

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleUpload = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photos to continue.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    const uri = result.assets[0].uri;
    await setProfileImageUri(uri);
    setProfileImageUriState(uri);
  }, []);

  const handleDownload = useCallback(async () => {
    const summary = `Financial profile for ${business?.name ?? "Your business"}\n\nSales: ${profile ? formatNaira(profile.total_recorded_sales) : "—"}\nExpenses: ${profile ? formatNaira(profile.total_recorded_expenses) : "—"}\nReceivables: ${profile ? formatNaira(profile.outstanding_receivables) : "—"}\nPayables: ${profile ? formatNaira(profile.outstanding_payables) : "—"}`;

    await Share.share({
      message: summary,
      title: "Financial profile report",
    });
  }, [business?.name, profile]);

  const initials =
    (business?.name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "AP";

  const sub = [business?.category, business?.location]
    .filter(Boolean)
    .join(" • ");

  const net = profile
    ? profile.outstanding_receivables - profile.outstanding_payables
    : 0;
  const netText =
    net > 0
      ? `You are owed ${formatNaira(net)} more than you owe`
      : net < 0
        ? `You owe ${formatNaira(-net)} more than you are owed`
        : "What you owe and what you are owed are equal";

  const tradingSinceText = registeredSince
    ? `Trading since ${new Date(registeredSince).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
    : "Trading since...";

  const handleViewSixMonthTransactions = () => {
    router.push({ pathname: "/ledger", params: { filter: "last-6-months" } });
  };

  const Metric = ({
    label,
    value,
    color,
    bg,
    icon,
  }: {
    label: string;
    value: number;
    color: string;
    bg: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
  }) => (
    <View style={[styles.metricCard, { borderTopColor: color }]}>
      <View style={styles.metricCardHeader}>
        <View style={[styles.metricIconBox, { backgroundColor: bg }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{formatNaira(value)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Financial Profile</Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconActionBtn}
              activeOpacity={0.8}
              onPress={handleDownload}
            >
              <Image
                source={require("../../assets/images/download-icon.png")}
                style={styles.iconActionBtn}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
  style={{
    backgroundColor: '#0b4f8c',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  }}
  onPress={() => router.push('/export-financial')}
>
  <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>Export Records</Text>
</TouchableOpacity>

<View style={{ flexDirection: 'row', gap: 12, marginVertical: 12 }}>
  <TouchableOpacity
    style={{ flex: 1, backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}
    onPress={() => router.push('/export-financial')}
  >
    <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>Download</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{ flex: 1, backgroundColor: '#0d9488', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}
    onPress={() => router.push('/export-share')}
  >
    <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>Share</Text>
  </TouchableOpacity>
</View>
            <TouchableOpacity
              style={styles.iconActionBtn}
              activeOpacity={0.8}
              onPress={handleUpload}
            >
              <Image
                source={require("../../assets/images/upload-icon.png")}
                style={styles.iconActionBtn}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#0b4f8c"
            style={{ marginTop: 40 }}
          />
        )}
        {!loading && error && !profile && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {profile && (
          <>
            <View style={styles.profileCard}>
              <View style={styles.profileTopRow}>
                <View style={styles.avatarBox}>
                  {profileImageUri ? (
                    <>
                      <Image
                        source={{ uri: profileImageUri }}
                        style={styles.avatarImage}
                      />
                      <View style={styles.avatarInitialsOverlay}>
                        <Text style={styles.avatarText}>{initials}</Text>
                      </View>
                    </>
                  ) : (
                    <Text style={styles.avatarText}>{initials}</Text>
                  )}
                </View>

                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.businessName}>
                    {business?.name ?? "Amina Fabrics"}
                  </Text>
                  {!!sub && <Text style={styles.businessSub}>{sub}</Text>}
                </View>
              </View>

              <View style={styles.profileInfoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color="#6b7280"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.profileInfoText}>{tradingSinceText}</Text>
              </View>

              <View style={styles.profileInfoRow}>
                <Ionicons
                  name="document-text-outline"
                  size={14}
                  color="#6b7280"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.profileInfoText}>
                  {profile.transaction_count} transactions in total
                </Text>
              </View>

              <TouchableOpacity
                style={styles.profileInfoRow}
                activeOpacity={0.8}
                onPress={handleViewSixMonthTransactions}
              >
                <Ionicons
                  name="time-outline"
                  size={14}
                  color="#6b7280"
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.profileInfoText, styles.clickableText]}>
                  Last 6 months
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>Financial Metrics</Text>
            <Text style={styles.chartSubtitle}>Business Perfomance</Text>

            <View style={styles.metricsBox}>
              <View style={styles.metricsGridRow}>
                <Metric
                  label="Sales"
                  value={profile.total_recorded_sales}
                  color="#0b4f8c"
                  bg="#e0f2fe"
                  icon="bar-chart-outline"
                />
                <Metric
                  label="Purchases"
                  value={profile.total_recorded_purchases}
                  color="#ef4444"
                  bg="#fee2e2"
                  icon="bag-handle-outline"
                />
              </View>
              <View style={styles.metricsGridRow}>
                <Metric
                  label="Expenses"
                  value={profile.total_recorded_expenses}
                  color="#f59e0b"
                  bg="#fef3c7"
                  icon="wallet-outline"
                />
                <Metric
                  label="Est. gross profit"
                  value={profile.estimated_gross_profit}
                  color="#10b981"
                  bg="#d1fae5"
                  icon="trending-up-outline"
                />
              </View>
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chartInnerCard}>
                <Text style={styles.chartTitle}>Business Activity</Text>
                <Text style={styles.chartSubtitle}>Sales and Expenses</Text>

                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#1bb7b8" }]}
                    />
                    <Text style={styles.legendText}>Sales</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, { backgroundColor: "#f59e0b" }]}
                    />
                    <Text style={styles.legendText}>Expenses</Text>
                  </View>
                </View>

                <View style={styles.chartWrap}>
                  <View style={styles.yAxis}>
                    {["N700k", "N500k", "N300k", "N100k", "N0"].map((label) => (
                      <Text key={label} style={styles.axisLabel}>
                        {label}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.chartArea}>
                    <Svg
                      width="100%"
                      height={180}
                      viewBox="0 0 300 180"
                      preserveAspectRatio="none"
                    >
                      <Defs>
                        <LinearGradient
                          id="salesFill"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <Stop
                            offset="0%"
                            stopColor="#1bb7b8"
                            stopOpacity={0.26}
                          />
                          <Stop
                            offset="100%"
                            stopColor="#1bb7b8"
                            stopOpacity={0.05}
                          />
                        </LinearGradient>
                      </Defs>

                      {[0, 1, 2, 3, 4].map((line) => (
                        <Line
                          key={line}
                          x1="0"
                          y1={30 + line * 32}
                          x2="300"
                          y2={30 + line * 32}
                          stroke="#dfe2ea"
                          strokeDasharray="4 4"
                          strokeWidth={1}
                        />
                      ))}

                      <Path
                        d={buildAreaPath(salesSeries, 300, 150)}
                        fill="url(#salesFill)"
                      />
                      <Path
                        d={buildLinePath(salesSeries, 300, 150)}
                        fill="none"
                        stroke="#1bb7b8"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Path
                        d={buildLinePath(expenseSeries, 300, 150)}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </View>

                <View style={styles.axisRow}>
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((label) => (
                    <Text key={label} style={styles.xAxisLabel}>
                      {label}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Open Balances</Text>
            <Text style={styles.sectionSub}>Receivables and Payables</Text>

            <View style={styles.balancesCard}>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Receivables</Text>
                <Text style={styles.balanceValue}>
                  {formatNaira(profile.outstanding_receivables)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Payables</Text>
                <Text style={styles.balanceValue}>
                  {formatNaira(profile.outstanding_payables)}
                </Text>
              </View>
              <View style={styles.netInfoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#0f766e"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.netInfoText}>{netText}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContainer: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 90 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#0b4f8c" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbe2ea",
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#fed7aa",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  avatarImage: { width: 52, height: 52, borderRadius: 16 },
  avatarInitialsOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "800", color: "#c2410c" },
  businessName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 2,
  },
  businessSub: { fontSize: 13, color: "#6b7280" },
  profileInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  profileInfoText: { fontSize: 13, color: "#4b5563", fontWeight: "500" },
  clickableText: { color: "#0b4f8c", fontWeight: "700" },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0b4f8c",
    marginBottom: 8,
  },
  sectionSub: { fontSize: 12, color: "#6b7280", marginBottom: 10 },
  metricsBox: {
    backgroundColor: "#0b4f8c",
    borderRadius: 22,
    padding: 12,
    marginBottom: 18,
  },
  metricsGridRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  metricCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    borderTopWidth: 3,
  },
  metricCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metricIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  metricLabel: { fontSize: 11, fontWeight: "600", color: "#6b7280" },
  metricValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 2,
  },
  chartCard: {
    backgroundColor: "#f6f7fb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 20,
    padding: 12,
    marginBottom: 18,
  },
  chartInnerCard: { backgroundColor: "#f6f7fb", borderRadius: 16 },
  chartTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#23395d",
    marginBottom: 2,
  },
  chartSubtitle: { fontSize: 12, color: "#6b7280", marginBottom: 12 },
  legendRow: { flexDirection: "row", gap: 18, marginBottom: 8 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 12, color: "#4b5563", fontWeight: "600" },
  chartWrap: { flexDirection: "row", alignItems: "stretch" },
  yAxis: {
    width: 52,
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 16,
  },
  chartArea: { flex: 1, height: 180, justifyContent: "center" },
  axisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 52,
    paddingHorizontal: 2,
  },
  axisLabel: { fontSize: 10, color: "#6b7280", lineHeight: 16 },
  xAxisLabel: { fontSize: 11, color: "#6b7280", fontWeight: "600" },
  balancesCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  balanceLabel: { fontSize: 14, color: "#4b5563", fontWeight: "600" },
  balanceValue: { fontSize: 16, fontWeight: "800", color: "#0b4f8c" },
  divider: { height: 1, backgroundColor: "#f3f4f6" },
  netInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ccfbf1",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  netInfoText: { fontSize: 12, fontWeight: "700", color: "#0f766e" },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    textAlign: "center",
    marginVertical: 20,
  },
});
