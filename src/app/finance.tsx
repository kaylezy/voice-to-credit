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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "./BottomNav";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiFetch } from "@/lib/api";
import { formatNaira } from "@/features/transactions";
import { getProfileImageUri, setProfileImageUri } from "@/lib/profile-image";
import { supabase } from "@/lib/supabase";
import AnalyticsSection from '@/features/finance/AnalyticsSection';
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Financial Profile</Text>

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              activeOpacity={0.8}
              onPress={() => router.push("/export-financial")}
            >
              <Ionicons name="download-outline" size={18} color="#ffffff" />
              <Text style={styles.headerButtonText}>Download</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.headerButton, styles.shareButton]}
              activeOpacity={0.8}
              onPress={() => router.push("/export-share")}
            >
              <Ionicons name="share-social-outline" size={18} color="#ffffff" />
              <Text style={styles.headerButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadActionRow}>
            <TouchableOpacity
              style={styles.iconActionBtn}
              activeOpacity={0.8}
              onPress={handleUpload}
              accessibilityLabel="Upload profile photo"
            >
              <Image
                source={require("../../assets/images/upload-icon.png")}
                style={styles.iconActionImage}
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
                    {business?.name ?? "My Business"}
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
                  {profile.transaction_count}{" "}
                  {profile.transaction_count === 1 ? "transaction" : "transactions"} in total
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
        <AnalyticsSection />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContainer: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 90 },
  headerContainer: { marginBottom: 14 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0b4f8c",
    marginBottom: 12,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  headerButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#0b4f8c",
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  shareButton: { backgroundColor: "#0d9488" },
  headerButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  uploadActionRow: { alignItems: "flex-end" },
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
  iconActionImage: { width: 22, height: 22 },
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
