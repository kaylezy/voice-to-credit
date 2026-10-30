import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function FinanceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Financial Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconActionBtn} onPress={() => router.push('../export-financial')}>
              <Ionicons name="download-outline" size={20} color="#0b4f8c" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconActionBtn} onPress={() => router.push('../export-share')}>
              <Ionicons name="open-outline" size={20} color="#0b4f8c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Business Overview Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>AP</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.businessName}>Amina Fabrics</Text>
              <Text style={styles.businessSub}>Retail & provisions – Yaba, Lagos</Text>
            </View>
          </View>
          <View style={styles.profileInfoRow}>
            <Ionicons name="calendar-outline" size={14} color="#6b7280" style={{ marginRight: 6 }} />
            <Text style={styles.profileInfoText}>Trading since March 2021</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Ionicons name="document-text-outline" size={14} color="#6b7280" style={{ marginRight: 6 }} />
            <Text style={styles.profileInfoText}>486 transactions in total</Text>
          </View>

          <TouchableOpacity style={styles.periodDropdown}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="calendar" size={16} color="#0b4f8c" style={{ marginRight: 8 }} />
              <Text style={styles.periodDropdownText}>Last 6 months</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#0b4f8c" />
          </TouchableOpacity>
        </View>

        {/* Financial Metrics Section */}
        <Text style={styles.sectionHeader}>Financial Metrics</Text>
        <Text style={styles.sectionSub}>Business Performance</Text>

        <View style={styles.metricsBox}>
          <View style={styles.metricsGridRow}>
            <View style={[styles.metricCard, { borderTopColor: '#0b4f8c' }]}>
              <View style={styles.metricCardHeader}>
                <View style={[styles.metricIconBox, { backgroundColor: '#e0f2fe' }]}>
                  <Ionicons name="bar-chart-outline" size={16} color="#0b4f8c" />
                </View>
                <Text style={styles.metricLabel}>Sales</Text>
              </View>
              <Text style={styles.metricValue}>₦2, 840, 000</Text>
              <Text style={styles.metricChangePos}>+12.4% in 7 Days</Text>
            </View>

            <View style={[styles.metricCard, { borderTopColor: '#ef4444' }]}>
              <View style={styles.metricCardHeader}>
                <View style={[styles.metricIconBox, { backgroundColor: '#fee2e2' }]}>
                  <Ionicons name="bag-handle-outline" size={16} color="#ef4444" />
                </View>
                <Text style={styles.metricLabel}>Purchases</Text>
              </View>
              <Text style={styles.metricValue}>₦1, 520, 000</Text>
              <Text style={styles.metricChangeNeg}>-1.5% in 7 Days</Text>
            </View>
          </View>

          <View style={styles.metricsGridRow}>
            <View style={[styles.metricCard, { borderTopColor: '#f59e0b' }]}>
              <View style={styles.metricCardHeader}>
                <View style={[styles.metricIconBox, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="wallet-outline" size={16} color="#f59e0b" />
                </View>
                <Text style={styles.metricLabel}>Expenses</Text>
              </View>
              <Text style={styles.metricValue}>₦386, 500</Text>
              <Text style={styles.metricChangeOrange}>+2.4% in 7 Days</Text>
            </View>

            <View style={[styles.metricCard, { borderTopColor: '#10b981' }]}>
              <View style={styles.metricCardHeader}>
                <View style={[styles.metricIconBox, { backgroundColor: '#d1fae5' }]}>
                  <Ionicons name="trending-up-outline" size={16} color="#10b981" />
                </View>
                <Text style={styles.metricLabel}>Est. gross profit</Text>
              </View>
              <Text style={styles.metricValue}>₦933, 500</Text>
              <Text style={styles.metricChangePos}>+5.9% in 7 Days</Text>
            </View>
          </View>
        </View>

        {/* Business Activity Trend */}
        <Text style={styles.sectionHeader}>Business Activity</Text>
        <Text style={styles.sectionSub}>Sales and Expenses</Text>
        
        <View style={styles.chartCard}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#06b6d4' }]} />
              <Text style={styles.legendText}>Sales</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>Expenses</Text>
            </View>
          </View>
          <Image 
            source={{ uri: '#' }} // Sales vs Expenses chart image reference
            style={styles.chartPlaceholder}
            resizeMode="contain"
          />
        </View>

        {/* Open Balances */}
        <Text style={styles.sectionHeader}>Open Balances</Text>
        <Text style={styles.sectionSub}>Receivables and Payables</Text>

        <View style={styles.balancesCard}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Receivables</Text>
            <Text style={styles.balanceValue}>₦245, 000</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Payables</Text>
            <Text style={styles.balanceValue}>₦108, 500</Text>
          </View>
          <View style={styles.netInfoBox}>
            <Ionicons name="information-circle-outline" size={16} color="#0f766e" style={{ marginRight: 6 }} />
            <Text style={styles.netInfoText}>You are owed ₦136,500 more than you owe</Text>
          </View>
        </View>
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
});