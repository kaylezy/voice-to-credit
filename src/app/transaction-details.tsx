import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setShowDeletedSuccess(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>

        {/* Top Summary Header */}
        <View style={styles.summaryCard}>
          <View style={styles.successIconBadge}>
            <Ionicons name="checkmark" size={22} color="#ffffff" />
          </View>
          <Text style={styles.typeLabel}>Sale</Text>
          <Text style={styles.amountLabel}>₦80,000</Text>
          <Text style={styles.productLabel}>Ankara fabric</Text>
          <View style={styles.paidBadge}>
            <Text style={styles.paidBadgeText}>Paid</Text>
          </View>
        </View>

        {/* Transaction Information List */}
        <Text style={styles.sectionHeader}>Transaction Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="key-outline" size={16} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Transaction ID</Text>
            </View>
            <Text style={styles.value}>TXN-01234</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="list-outline" size={16} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Quantity</Text>
            </View>
            <Text style={styles.value}>20 Yards</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="pricetag-outline" size={16} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Unit Price</Text>
            </View>
            <Text style={styles.value}>₦4,000/yard</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="calendar-outline" size={16} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Date</Text>
            </View>
            <Text style={styles.value}>Today</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="time-outline" size={16} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Time</Text>
            </View>
            <Text style={styles.value}>05:32 PM</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="person-outline" size={16} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Customer/Supplier</Text>
            </View>
            <Text style={styles.value}>Nil</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="document-text-outline" size={16} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Notes</Text>
            </View>
            <Text style={styles.value}>“Cash payment made in full”</Text>
          </View>
        </View>

        {/* Record Method */}
        <Text style={styles.sectionHeader}>Record Method</Text>
        <View style={styles.methodCard}>
          <View style={styles.methodLeft}>
            <Ionicons name="mic-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.methodTitle}>Voice Recording</Text>
              <Text style={styles.methodSub}>Processed and transcribed by AI</Text>
            </View>
          </View>
          <View style={styles.voiceBadge}>
            <Text style={styles.voiceBadgeText}>Voice</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('/record-edit')}
        >
          <Text style={styles.editButtonText}>Edit Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => setShowDeleteModal(true)}
        >
          <Text style={styles.deleteButtonText}>Delete Transaction</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowDeleteModal(false)}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>

            <View style={styles.trashCircle}>
              <Ionicons name="trash-outline" size={32} color="#ef4444" />
            </View>

            <Text style={styles.modalTitle}>Delete Transaction?</Text>
            <Text style={styles.modalSubtitle}>
              This action will permanently remove this transaction from your ledger. You can’t undo this action.
            </Text>

            <TouchableOpacity style={styles.confirmDeleteButton} onPress={handleDeleteConfirm}>
              <Text style={styles.confirmDeleteText}>Delete Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelDeleteButton} onPress={() => setShowDeleteModal(false)}>
              <Text style={styles.cancelDeleteText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Transaction Deleted Success Modal */}
      <Modal visible={showDeletedSuccess} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.push('/dashboard')}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>

            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={36} color="#ffffff" />
            </View>

            <Text style={styles.modalTitle}>Transaction Deleted!</Text>
            <Text style={styles.modalSubtitle}>
              Your transaction have been permanently deleted successfully
            </Text>

            <TouchableOpacity 
              style={styles.viewLedgerButton}
              onPress={() => router.push('../ledger')}
            >
              <Text style={styles.viewLedgerText}>View Ledger</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.returnDashboardButton}
              onPress={() => router.push('/dashboard')}
            >
              <Text style={styles.returnDashboardText}>Return to dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 90 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 14 },
  summaryCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  successIconBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0d9488', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  typeLabel: { fontSize: 13, color: '#6b7280', fontWeight: '600', marginBottom: 2 },
  amountLabel: { fontSize: 26, fontWeight: '900', color: '#0d9488', marginBottom: 2 },
  productLabel: { fontSize: 15, fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  paidBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  paidBadgeText: { color: '#065f46', fontSize: 12, fontWeight: '700' },
  sectionHeader: { fontSize: 15, fontWeight: '700', color: '#0b4f8c', marginBottom: 8, marginTop: 4 },
  infoCard: { backgroundColor: '#ffffff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  labelGroup: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 13, color: '#4b5563', fontWeight: '500' },
  value: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  divider: { height: 1, backgroundColor: '#f3f4f6' },
  methodCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 24 },
  methodLeft: { flexDirection: 'row', alignItems: 'center' },
  methodTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  methodSub: { fontSize: 12, color: '#6b7280' },
  voiceBadge: { backgroundColor: '#e0f2fe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  voiceBadgeText: { color: '#0b4f8c', fontSize: 12, fontWeight: '700' },
  editButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  editButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  deleteButton: { backgroundColor: '#ef4444', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  deleteButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 28, padding: 24, alignItems: 'center', elevation: 10 },
  closeButton: { alignSelf: 'flex-start', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  trashCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  successCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0d9488', justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', textAlign: 'center', marginBottom: 8 },
  modalSubtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 18, marginBottom: 24, paddingHorizontal: 10 },
  confirmDeleteButton: { backgroundColor: '#ef4444', width: '100%', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  confirmDeleteText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  cancelDeleteButton: { alignItems: 'center', paddingVertical: 4 },
  cancelDeleteText: { color: '#0b4f8c', fontSize: 15, fontWeight: '700' },
  viewLedgerButton: { backgroundColor: '#0b4f8c', width: '100%', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  viewLedgerText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  returnDashboardButton: { alignItems: 'center', paddingVertical: 4 },
  returnDashboardText: { color: '#0b4f8c', fontSize: 14, fontWeight: '700' },
});