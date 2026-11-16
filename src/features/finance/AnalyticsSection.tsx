import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SalesTrendChart } from '@/features/dashboard/TrendCharts';
import { fetchAnalytics, type Analytics, type Range, type Card } from './analyticsApi';
import { GroupedBars, TypeBars, shortNaira } from './AnalyticsCharts';

const naira = (n: number) => `₦${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

const RANGES: { key: Range; label: string }[] = [
  { key: '3m', label: '3 months' },
  { key: '6m', label: '6 months' },
  { key: '12m', label: '12 months' },
];

type CardDef = {
  key: keyof Analytics['cards'];
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  bg: string;
};

const CARDS: CardDef[] = [
  { key: 'total_sales', label: 'Total Sales', icon: 'cash-outline', bg: '#16a34a' },
  { key: 'total_purchases', label: 'Total Purchases', icon: 'cart-outline', bg: '#1d7bf0' },
  { key: 'total_expenses', label: 'Total Expenses', icon: 'wallet-outline', bg: '#f97316' },
  { key: 'outstanding_receivables', label: 'Outstanding Receivables', icon: 'time-outline', bg: '#7c6fd6' },
  { key: 'outstanding_payables', label: 'Outstanding Payables', icon: 'bus-outline', bg: '#0e8f9c' },
  { key: 'avg_sales_value', label: 'Average Sales Value', icon: 'stats-chart-outline', bg: '#c13b7a' },
];

const TYPE_LABEL = { sale: 'Sale', purchase: 'Purchase', expense: 'Expense' } as const;
const TYPE_COLOR = { sale: '#16a34a', purchase: '#1d7bf0', expense: '#f97316' } as const;

function changeText(c: Card, hasPrevious: boolean): string {
  if (!hasPrevious || c.change === null) return 'No earlier data';
  const arrow = c.change >= 0 ? '↑' : '↓';
  return `${arrow} ${Math.abs(c.change)}% vs previous period`;
}

export default function AnalyticsSection() {
  const { width: screenWidth } = useWindowDimensions();
  const [range, setRange] = useState<Range>('3m');
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      fetchAnalytics(range).then((res) => {
        if (!active) return;
        setData(res);
        setFailed(res === null);
        setLoading(false);
      });
      return () => {
        active = false;
      };
    }, [range]),
  );

  const cardW = (screenWidth - 40 - 10) / 2;
  const wideW = screenWidth - 40 - 24; // page padding + card padding

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Business Analytics</Text>
      <Text style={styles.sub}>Real-time insights into your business finances and activity</Text>

      <View style={styles.chipRow}>
        {RANGES.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[styles.chip, range === r.key && styles.chipActive]}
            onPress={() => setRange(r.key)}
          >
            <Text style={[styles.chipText, range === r.key && styles.chipTextActive]}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <ActivityIndicator color="#0b4f8c" style={{ marginVertical: 24 }} />}
      {!loading && failed && <Text style={styles.error}>Could not load analytics. Pull down and try again.</Text>}

      {!loading && data && (
        <>
          {/* 1. Financial overview */}
          <Text style={styles.section}>Financial Overview</Text>
          <View style={styles.grid}>
            {CARDS.map((c) => {
              const card = data.cards[c.key];
              return (
                <View key={c.key} style={[styles.statCard, { width: cardW, backgroundColor: c.bg }]}>
                  <Ionicons name={c.icon} size={20} color="#ffffff" />
                  <Text style={styles.statLabel}>{c.label}</Text>
                  <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                    {naira(card.value)}
                  </Text>
                  <Text style={styles.statChange}>{changeText(card, data.has_previous)}</Text>
                </View>
              );
            })}
          </View>

          {data.total_count === 0 ? (
            <Text style={styles.empty}>No records in this period yet.</Text>
          ) : (
            <>
              {/* 2. Trends */}
              <Text style={styles.section}>Financial Trends</Text>
              <View style={styles.panel}>
                <Text style={styles.panelTitle}>Monthly Sales Trend</Text>
                <SalesTrendChart
                  values={data.months.map((m) => m.sales)}
                  labels={data.months.map((m) => m.label)}
                  width={wideW}
                  height={130}
                />
              </View>

              <View style={styles.panel}>
                <Text style={styles.panelTitle}>Monthly Purchases vs Expenses</Text>
                <View style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: '#1d7bf0' }]} />
                  <Text style={styles.legendText}>Purchases</Text>
                  <View style={[styles.dot, { backgroundColor: '#f97316', marginLeft: 12 }]} />
                  <Text style={styles.legendText}>Expenses</Text>
                </View>
                <GroupedBars
                  labels={data.months.map((m) => m.label)}
                  a={data.months.map((m) => m.purchases)}
                  b={data.months.map((m) => m.expenses)}
                  width={wideW}
                />
              </View>

              <View style={styles.grid}>
                <View style={[styles.kpi, { width: cardW, backgroundColor: '#e8f7ee' }]}>
                  <Text style={styles.kpiLabel}>Average Monthly Sales</Text>
                  <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
                    {naira(data.avg_monthly_sales)}
                  </Text>
                </View>
                <View style={[styles.kpi, { width: cardW, backgroundColor: '#e6f0fb' }]}>
                  <Text style={styles.kpiLabel}>Sales Growth Rate</Text>
                  <Text style={styles.kpiValue}>
                    {data.sales_growth_pct === null
                      ? '—'
                      : `${data.sales_growth_pct >= 0 ? '+' : ''}${data.sales_growth_pct}%`}
                  </Text>
                  <Text style={styles.kpiNote}>vs previous period</Text>
                </View>
              </View>

              {/* 3. Transaction analysis */}
              <Text style={styles.section}>Transaction Analysis</Text>
              <View style={styles.panel}>
                <Text style={styles.panelTitle}>Transaction Count by Type</Text>
                <TypeBars
                  labels={data.by_type.map((t) => TYPE_LABEL[t.type])}
                  values={data.by_type.map((t) => t.count)}
                  colors={data.by_type.map((t) => TYPE_COLOR[t.type])}
                  width={wideW}
                  format={(n) => String(n)}
                />
              </View>

              <View style={styles.panel}>
                <Text style={styles.panelTitle}>Total Amount by Type</Text>
                <TypeBars
                  labels={data.by_type.map((t) => TYPE_LABEL[t.type])}
                  values={data.by_type.map((t) => t.amount)}
                  colors={data.by_type.map((t) => TYPE_COLOR[t.type])}
                  width={wideW}
                  format={shortNaira}
                />
              </View>

              <View style={styles.panel}>
                <View style={[styles.tr, styles.th]}>
                  <Text style={[styles.td, { flex: 1.2, fontWeight: '800' }]}>Type</Text>
                  <Text style={[styles.td, styles.num, { fontWeight: '800' }]}>Count</Text>
                  <Text style={[styles.td, styles.num, { flex: 1.5, fontWeight: '800' }]}>Amount</Text>
                  <Text style={[styles.td, styles.num, { fontWeight: '800' }]}>% amt</Text>
                </View>
                {data.by_type.map((t) => (
                  <View key={t.type} style={styles.tr}>
                    <Text style={[styles.td, { flex: 1.2 }]}>{TYPE_LABEL[t.type]}</Text>
                    <Text style={[styles.td, styles.num]}>{t.count}</Text>
                    <Text style={[styles.td, styles.num, { flex: 1.5 }]}>{naira(t.amount)}</Text>
                    <Text style={[styles.td, styles.num]}>{t.pct_amount}%</Text>
                  </View>
                ))}
                <View style={[styles.tr, { borderBottomWidth: 0 }]}>
                  <Text style={[styles.td, { flex: 1.2, fontWeight: '800' }]}>Total</Text>
                  <Text style={[styles.td, styles.num, { fontWeight: '800' }]}>{data.total_count}</Text>
                  <Text style={[styles.td, styles.num, { flex: 1.5, fontWeight: '800' }]}>{naira(data.total_amount)}</Text>
                  <Text style={[styles.td, styles.num, { fontWeight: '800' }]}>100%</Text>
                </View>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8, marginBottom: 20 },
  heading: { fontSize: 18, fontWeight: '800', color: '#0b4f8c' },
  sub: { fontSize: 12, color: '#6b7280', marginTop: 2, marginBottom: 12 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { paddingHorizontal: 14, height: 34, borderRadius: 17, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', justifyContent: 'center' },
  chipActive: { backgroundColor: '#0b4f8c', borderColor: '#0b4f8c' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#4b5563' },
  chipTextActive: { color: '#ffffff' },
  section: { fontSize: 15, fontWeight: '800', color: '#0b4f8c', marginTop: 8, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  statCard: { borderRadius: 16, padding: 14, minHeight: 124 },
  statLabel: { color: '#ffffff', fontSize: 11, fontWeight: '700', marginTop: 8 },
  statValue: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginTop: 4 },
  statChange: { color: '#ffffff', fontSize: 9, fontWeight: '600', marginTop: 6, opacity: 0.95 },
  panel: { backgroundColor: '#ffffff', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  panelTitle: { fontSize: 13, fontWeight: '800', color: '#1f2937', marginBottom: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  legendText: { fontSize: 11, color: '#4b5563' },
  kpi: { borderRadius: 16, padding: 14 },
  kpiLabel: { fontSize: 11, fontWeight: '700', color: '#4b5563' },
  kpiValue: { fontSize: 20, fontWeight: '800', color: '#1f2937', marginTop: 6 },
  kpiNote: { fontSize: 10, color: '#6b7280', marginTop: 2 },
  tr: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  th: { backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 4 },
  td: { flex: 1, fontSize: 12, color: '#1f2937' },
  num: { textAlign: 'right' },
  empty: { textAlign: 'center', color: '#6b7280', fontSize: 13, marginVertical: 20 },
  error: { textAlign: 'center', color: '#dc2626', fontSize: 13, marginVertical: 20 },
});