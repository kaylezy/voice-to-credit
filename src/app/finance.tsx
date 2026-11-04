import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import { apiFetch } from '@/lib/api';
import { formatNaira } from '@/features/transactions';

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

type Business = { name: string; category: string | null; location: string | null };

export default function FinanceScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [p, b] = await Promise.all([
      apiFetch<Profile>('/api/financial-profile'),
      apiFetch<Business[]>('/api/businesses'),
    ]);
    if (p.ok) {
      setProfile(p.data);
      setError(null);
    } else {
      setError(p.error === 'network_error' ? "Can't reach the server. Pull down to try again." : 'Could not load your financial profile.');
    }
    if (b.ok && b.data[0]) setBusiness(b.data[0]);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const initials = (business?.name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'TP';
  const sub = [business?.category, business?.location].filter(Boolean).join(' – ');

  const net = profile ? profile.outstanding_receivables - profile.outstanding_payables : 0;
  const netText =
    net > 0 ? `You are owed ${formatNaira(net)} more than you owe`
    : net < 0 ? `You owe ${formatNaira(-net)} more than you are owed`
    : 'What you owe and what you are owed are equal';

  const Metric = ({ label, value, color, bg, icon }: { label: string; value: number; color: string; bg: string; icon: React.ComponentProps<typeof Ionicons>['name'] }) => (
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Financial Profile</Text>
        </View>

        {loading && <ActivityIndicator size="large" color="#0b4f8c" style={{ marginTop: 40 }} />}
        {!loading && error && !profile && <Text style={styles.errorText}>{error}</Text>}

        {profile && (
          <>
            <View style={styles.profileCard}>
              <View style={styles.profileTopRow}>
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.businessName}>{business?.name ?? 'Your business'}</Text>
                  {!!sub && <Text style={styles.businessSub}>{sub}</Text>}
                </View>
              </View>
              <View style={styles.profileInfoRow}>
                <Ionicons name="calendar-outline" size={14} color="#6b7280" style={{ marginRight: 6 }} />
                <Text style={styles.profileInfoText}>{profile.active_recording_days} active recording days</Text>
              </View>
              <View style={styles.profileInfoRow}>
                <Ionicons name="document-text-outline" size={14} color="#6b7280" style={{ marginRight: 6 }} />
                <Text style={styles.profileInfoText}>{profile.transaction_count} transactions in total</Text>
              </View>
              <View style={styles.profileInfoRow}>
                <Ionicons name="time-outline" size={14} color="#6b7280" style={{ marginRight: 6 }} />
                <Text style={styles.profileInfoText}>Covers your entire recorded period</Text>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Financial Metrics</Text>
            <Text style={styles.sectionSub}>Business Performance</Text>

            <View style={styles.metricsBox}>
              <View style={styles.metricsGridRow}>
                <Metric label="Sales" value={profile.total_recorded_sales} color="#0b4f8c" bg="#e0f2fe" icon="bar-chart-outline" />
                <Metric label="Purchases" value={profile.total_recorded_purchases} color="#ef4444" bg="#fee2e2" icon="bag-handle-outline" />
              </View>
              <View style={styles.metricsGridRow}>
                <Metric label="Expenses" value={profile.total_recorded_expenses} color="#f59e0b" bg="#fef3c7" icon="wallet-outline" />
                <Metric label="Est. gross profit" value={profile.estimated_gross_profit} color="#10b981" bg="#d1fae5" icon="trending-up-outline" />
              </View>
            </View>

            <Text style={styles.sectionHeader}>Open Balances</Text>
            <Text style={styles.sectionSub}>Receivables and Payables (still unpaid)</Text>

            <View style={styles.balancesCard}>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Receivables</Text>
                <Text style={styles.balanceValue}>{formatNaira(profile.outstanding_receivables)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Payables</Text>
                <Text style={styles.balanceValue}>{formatNaira(profile.outstanding_payables)}</Text>
              </View>
              <View style={styles.netInfoBox}>
                <Ionicons name="information-circle-outline" size={16} color="#0f766e" style={{ marginRight: 6 }} />
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
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 90 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0b4f8c' },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconActionBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  profileCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  profileTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#fed7aa', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#c2410c' },
  businessName: { fontSize: 18, fontWeight: '800', color: '#1f2937', marginBottom: 2 },
  businessSub: { fontSize: 13, color: '#6b7280' },
  profileInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  profileInfoText: { fontSize: 13, color: '#4b5563', fontWeight: '500' },
  periodDropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, height: 44, marginTop: 12 },
  periodDropdownText: { fontSize: 14, fontWeight: '700', color: '#0b4f8c' },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#0b4f8c', marginBottom: 2 },
  sectionSub: { fontSize: 12, color: '#6b7280', marginBottom: 10 },
  metricsBox: { backgroundColor: '#0b4f8c', borderRadius: 22, padding: 12, marginBottom: 20 },
  metricsGridRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  metricCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 12, borderTopWidth: 3 },
  metricCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  metricIconBox: { width: 26, height: 26, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  metricLabel: { fontSize: 11, fontWeight: '600', color: '#6b7280' },
  metricValue: { fontSize: 15, fontWeight: '800', color: '#1f2937', marginBottom: 2 },
  metricChangePos: { fontSize: 10, fontWeight: '700', color: '#10b981' },
  metricChangeNeg: { fontSize: 10, fontWeight: '700', color: '#ef4444' },
  metricChangeOrange: { fontSize: 10, fontWeight: '700', color: '#f59e0b' },
  chartCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  legendRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  chartPlaceholder: { width: '100%', height: 160 },
  balancesCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  balanceLabel: { fontSize: 14, color: '#4b5563', fontWeight: '600' },
  balanceValue: { fontSize: 16, fontWeight: '800', color: '#0b4f8c' },
  divider: { height: 1, backgroundColor: '#f3f4f6' },
  netInfoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ccfbf1', borderRadius: 12, padding: 12, marginTop: 12 },
  netInfoText: { fontSize: 12, fontWeight: '700', color: '#0f766e' },
  errorText: { color: '#dc2626', fontSize: 13, textAlign: 'center', marginVertical: 20 },
});