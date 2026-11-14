import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { exportTransactionsCsv } from '@/features/export/exportApi';

type Period = { key: string; title: string; months: number | null; rec?: boolean };

const PERIODS: Period[] = [
  { key: '3', title: 'Last 3 months', months: 3 },
  { key: '6', title: 'Last 6 months', months: 6, rec: true },
  { key: '12', title: 'Last 12 months', months: 12 },
  { key: 'all', title: 'All time', months: null },
];

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString('en-NG', { month: 'short', year: 'numeric' });
}

function periodSub(p: Period): string {
  if (p.months === null) return 'Every record you have saved';
  return `${monthLabel(monthsAgo(p.months))} – ${monthLabel(new Date())}`;
}

export default function ExportFinancialScreen() {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState('6');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    const period = PERIODS.find((p) => p.key === selectedKey) ?? PERIODS[1];
    setLoading(true);
    try {
      const range =
        period.months === null
          ? undefined
          : { from: ymd(monthsAgo(period.months)), to: ymd(new Date()) };
      const result = await exportTransactionsCsv(range);
      if (!result.ok) Alert.alert('Export failed', result.error);
    } catch {
      Alert.alert('Export failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Records</Text>

        <View style={styles.previewCard}>
          <View style={styles.previewTop}>
            <View style={styles.avatarBox}>
              <Ionicons name="document-text-outline" size={22} color="#c2410c" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.previewName}>Transactions spreadsheet</Text>
              <Text style={styles.previewSub}>
                All your sales, purchases, expenses and debts in one CSV file
              </Text>
            </View>
          </View>
          <View style={styles.previewMetaRow}>
            <Ionicons name="grid-outline" size={14} color="#6b7280" style={{ marginRight: 6 }} />
            <Text style={styles.previewMetaText}>Opens in Excel and Google Sheets</Text>
          </View>
          <View style={styles.previewMetaRow}>
            <Ionicons name="share-outline" size={14} color="#6b7280" style={{ marginRight: 6 }} />
            <Text style={styles.previewMetaText}>Save it or send it with WhatsApp, email or Drive</Text>
          </View>
        </View>

        <Text style={styles.groupLabel}>REPORTING PERIOD</Text>
        {PERIODS.map((item) => {
          const isSelected = selectedKey === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => setSelectedKey(item.key)}
              disabled={loading}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.optionTitle}>{item.title}</Text>
                    {item.rec && (
                      <View style={styles.recBadge}>
                        <Text style={styles.recText}>Recommended</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.optionSub}>{periodSub(item)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.downloadButton, loading && { opacity: 0.7 }]}
          onPress={handleDownload}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.downloadButtonText}>Export CSV</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 90 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 16 },
  previewCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  previewTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#fed7aa', justifyContent: 'center', alignItems: 'center' },
  previewName: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: 2 },
  previewSub: { fontSize: 12, color: '#6b7280', lineHeight: 16 },
  previewMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  previewMetaText: { fontSize: 12, color: '#4b5563', fontWeight: '500' },
  groupLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', marginBottom: 8, marginTop: 4 },
  optionCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 10 },
  optionCardSelected: { borderColor: '#0b4f8c', backgroundColor: '#f0fdf4' },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  radioOuterSelected: { borderColor: '#0b4f8c' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0b4f8c' },
  optionTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  optionSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  recBadge: { backgroundColor: '#ccfbf1', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  recText: { fontSize: 10, fontWeight: '700', color: '#0f766e' },
  downloadButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 16, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  downloadButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});