import React, { useMemo, useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  formatClock, formatDay, formatNaira, lagosDate, statusLabel, typeLabel, useTransactions, type TxType,
} from '@/features/transactions';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TYPE_STYLE: Record<TxType, { color: string; icon: IconName }> = {
  sale: { color: '#10b981', icon: 'checkmark-circle-outline' },
  purchase: { color: '#f59e0b', icon: 'arrow-up-circle-outline' },
  expense: { color: '#0b4f8c', icon: 'wallet-outline' },
  receivable: { color: '#06b6d4', icon: 'time-outline' },
  payable: { color: '#ef4444', icon: 'bag-handle-outline' },
};

const TYPE_FILTERS: { label: string; value: TxType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Sales', value: 'sale' },
  { label: 'Purchases', value: 'purchase' },
  { label: 'Expenses', value: 'expense' },
  { label: 'Payables', value: 'payable' },
  { label: 'Receivables', value: 'receivable' },
];

const DATE_FILTERS = ['All time', 'Today', 'This week', 'This month'] as const;
type DateFilter = (typeof DATE_FILTERS)[number];

export default function LedgerScreen() {
  const router = useRouter();
  const { items, loading, refreshing, error, refresh } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TxType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('All time');

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const today = lagosDate();
    const weekStart = lagosDate(-6);
    const monthPrefix = today.slice(0, 7);

    return items.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;

      const d = t.transaction_date.slice(0, 10);
      if (dateFilter === 'Today' && d !== today) return false;
      if (dateFilter === 'This week' && d < weekStart) return false;
      if (dateFilter === 'This month' && !d.startsWith(monthPrefix)) return false;

      if (q) {
        const hay = [t.product_name, t.description, t.notes, t.type].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, searchQuery, typeFilter, dateFilter]);

  const resetFilters = () => {
    setTypeFilter('all');
    setDateFilter('All time');
    setShowFilterModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>Ledger</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#9ca3af" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions"
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterIconButton} onPress={() => setShowFilterModal(true)}>
            <Ionicons name="filter" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {loading && <ActivityIndicator size="large" color="#0b4f8c" style={{ marginTop: 30 }} />}

        {!loading && error && items.length === 0 && <Text style={styles.errorText}>{error}</Text>}

        {!loading && !error && visible.length === 0 && (
          <Text style={styles.emptyText}>
            {items.length === 0 ? 'No transactions yet. Record your first one!' : 'No transactions match your search or filters.'}
          </Text>
        )}

        {visible.map((item) => {
          const style = TYPE_STYLE[item.type];
          const detail = `${item.quantity ?? ''} ${item.unit ?? ''}`.trim() || '—';
          const paid = item.payment_status === 'paid';
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.transactionCard}
              onPress={() => router.push({ pathname: '/transaction-details', params: { id: item.id } })}
            >
              <View style={styles.transactionLeft}>
                <View style={[styles.iconBox, { backgroundColor: style.color + '20' }]}>
                  <Ionicons name={style.icon} size={20} color={style.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txTitle} numberOfLines={1}>
                    {item.product_name || item.description || typeLabel(item.type)}
                  </Text>
                  <Text style={styles.txSub}>{typeLabel(item.type)} · {detail}</Text>
                  <Text style={styles.txTime}>
                    {formatDay(item.transaction_date)} · {formatClock(item.created_at)}
                  </Text>
                </View>
              </View>

              <View style={styles.transactionRight}>
                <Text style={styles.txAmount}>{formatNaira(Number(item.amount))}</Text>
                <View style={[styles.statusBadge, paid ? styles.badgePaid : styles.badgeUnpaid]}>
                  <Text style={[styles.statusText, paid ? styles.textPaid : styles.textUnpaid]}>
                    {statusLabel(item.payment_status)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.filterModalCard}>
            <View style={styles.modalHeaderRow}>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={22} color="#0b4f8c" />
              </TouchableOpacity>
              <Text style={styles.filterModalTitle}>Apply Filter</Text>
              <View style={{ width: 22 }} />
            </View>

            <Text style={styles.filterSectionLabel}>Transaction Type</Text>
            <View style={styles.filterChipRow}>
              {TYPE_FILTERS.map((chip) => (
                <TouchableOpacity
                  key={chip.label}
                  style={[styles.chip, typeFilter === chip.value && styles.chipActive]}
                  onPress={() => setTypeFilter(chip.value)}
                >
                  <Text style={[styles.chipText, typeFilter === chip.value && styles.chipTextActive]}>{chip.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionLabel}>Date Range</Text>
            <View style={styles.filterChipRow}>
              {DATE_FILTERS.map((chip) => (
                <TouchableOpacity
                  key={chip}
                  style={[styles.chip, dateFilter === chip && styles.chipActive]}
                  onPress={() => setDateFilter(chip)}
                >
                  <Text style={[styles.chipText, dateFilter === chip && styles.chipTextActive]}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterActionRow}>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilterModal(false)}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerArea: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0b4f8c', marginBottom: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, height: 46, paddingHorizontal: 14 },
  searchInput: { flex: 1, fontSize: 14, color: '#1f2937' },
  filterIconButton: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#0b4f8c', justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 90 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0b4f8c', marginBottom: 12 },
  transactionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  transactionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  txSub: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  txTime: { fontSize: 11, color: '#9ca3af' },
  transactionRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 15, fontWeight: '800', color: '#0b4f8c', marginBottom: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgePaid: { backgroundColor: '#d1fae5' },
  badgeUnpaid: { backgroundColor: '#fef3c7' },
  statusText: { fontSize: 10, fontWeight: '700' },
  textPaid: { color: '#065f46' },
  textUnpaid: { color: '#b45309' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  filterModalCard: { backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  filterModalTitle: { fontSize: 18, fontWeight: '800', color: '#0b4f8c' },
  filterSectionLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10, marginTop: 10 },
  filterChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#ffffff' },
  chipActive: { backgroundColor: '#0b4f8c', borderColor: '#0b4f8c' },
  chipText: { fontSize: 13, color: '#4b5563', fontWeight: '500' },
  chipTextActive: { color: '#ffffff', fontWeight: '700' },
  filterActionRow: { flexDirection: 'row', gap: 12, marginTop: 30 },
  resetButton: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#0d9488', justifyContent: 'center', alignItems: 'center' },
  resetButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  applyButton: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#0b4f8c', justifyContent: 'center', alignItems: 'center' },
  applyButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
    errorText: { color: '#dc2626', fontSize: 13, textAlign: 'center', marginTop: 30 },
  emptyText: { color: '#6b7280', fontSize: 13, textAlign: 'center', marginTop: 30 },
});