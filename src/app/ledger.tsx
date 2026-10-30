import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

const transactions = [
  { id: '1', title: 'Ankara fabric', type: 'Sale', detail: '20 yards', time: 'Today · 05:32 PM', amount: '₦80,000', status: 'Paid', color: '#10b981', icon: 'checkmark-circle-outline' },
  { id: '2', title: 'Shirts', type: 'Purchase', detail: '20 pieces', time: 'Jun 9, 2026 · 03:12 PM', amount: '₦120,000', status: 'Partially paid', color: '#f59e0b', icon: 'arrow-up-circle-outline' },
  { id: '3', title: 'Transport to the market', type: 'Expense', detail: 'Transport', time: 'Jun 8, 2026 · 09:12 PM', amount: '₦5,000', status: 'Paid', color: '#0b4f8c', icon: 'wallet-outline' },
  { id: '4', title: 'Customer credit', type: 'Receivable', detail: 'Credit', time: 'Jun 7, 2026 · 01:12 PM', amount: '₦50,000', status: 'Partially paid', color: '#06b6d4', icon: 'time-outline' },
  { id: '5', title: 'Stocks (bags)', type: 'Purchase', detail: '10 bags', time: 'Jun 6, 2026 · 03:12 PM', amount: '₦74,450', status: 'Unpaid', color: '#ef4444', icon: 'bag-handle-outline' },
];

export default function LedgerScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Today');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>Ledger</Text>

        {/* Search & Filter Bar */}
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

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {transactions.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.transactionCard}
            onPress={() => router.push('../transaction-details')}
          >
            <View style={styles.transactionLeft}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View>
                <Text style={styles.txTitle}>{item.title}</Text>
                <Text style={styles.txSub}>{item.type} · {item.detail}</Text>
                <Text style={styles.txTime}>{item.time}</Text>
              </View>
            </View>

            <View style={styles.transactionRight}>
              <Text style={styles.txAmount}>{item.amount}</Text>
              <View style={[styles.statusBadge, item.status === 'Paid' ? styles.badgePaid : styles.badgeUnpaid]}>
                <Text style={[styles.statusText, item.status === 'Paid' ? styles.textPaid : styles.textUnpaid]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
              {['All', 'Sales', 'Purchases', 'Expenses', 'Payables', 'Receivables'].map((chip) => (
                <TouchableOpacity 
                  key={chip} 
                  style={[styles.chip, selectedTypeFilter === chip && styles.chipActive]}
                  onPress={() => setSelectedTypeFilter(chip)}
                >
                  <Text style={[styles.chipText, selectedTypeFilter === chip && styles.chipTextActive]}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterSectionLabel}>Date Range</Text>
            <View style={styles.filterChipRow}>
              {['Today', 'This week', 'This month', 'Custom range'].map((chip) => (
                <TouchableOpacity 
                  key={chip} 
                  style={[styles.chip, selectedDateFilter === chip && styles.chipActive]}
                  onPress={() => setSelectedDateFilter(chip)}
                >
                  <Text style={[styles.chipText, selectedDateFilter === chip && styles.chipTextActive]}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterActionRow}>
              <TouchableOpacity style={styles.resetButton} onPress={() => setShowFilterModal(false)}>
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
});