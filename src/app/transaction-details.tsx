import React, { useCallback, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  addPayment, deleteTransaction, draftFromTransaction, formatClock, formatDay, formatNaira,
  getTransactionDetails, isDebt, statusLabel, typeLabel, useTransactionDraft,
  type DebtSummary, type Transaction,
} from '@/features/transactions';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { reset, update } = useTransactionDraft();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tx, setTx] = useState<Transaction | null>(null);
  const [partyName, setPartyName] = useState<string | null>(null);
  const [debt, setDebt] = useState<DebtSummary | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setError('Transaction not found.');
      setLoading(false);
      return;
    }
    const result = await getTransactionDetails(id);
    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }
    setTx(result.tx);
    setPartyName(result.partyName);
    setDebt(result.debt);
    setError(null);
    setLoading(false);
  }, [id]);

  // Reload whenever the screen comes into view (for example after editing)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleEdit = () => {
    if (!tx) return;
    reset();
    update(draftFromTransaction(tx, partyName));
    router.push({ pathname: '/record-edit', params: { editId: tx.id } });
  };

  const handleDeleteConfirm = async () => {
    if (!tx) return;
    setDeleteError(null);
    setDeleting(true);
    const result = await deleteTransaction(tx.id);
    setDeleting(false);
    if (!result.ok) {
      setDeleteError(result.message);
      return;
    }
    setShowDeleteModal(false);
    setShowDeletedSuccess(true);
  };

  const handlePay = async () => {
    if (!tx) return;
    setPayError(null);
    setPaying(true);
    const result = await addPayment(tx.id, payAmount, payNote);
    setPaying(false);
    if (!result.ok) {
      setPayError(result.message);
      return;
    }
    setShowPayModal(false);
    setPayAmount('');
    setPayNote('');
    load();
  };

  if (loading || !tx) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Details</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0b4f8c" style={{ marginTop: 40 }} />
          ) : (
            <Text style={{ color: '#dc2626', textAlign: 'center', marginTop: 40 }}>
              {error ?? 'Transaction not found.'}
            </Text>
          )}
        </ScrollView>
        <BottomNav />
      </SafeAreaView>
    );
  }

  const quantity = `${tx.quantity ?? ''} ${tx.unit ?? ''}`.trim();
  const unitPrice = tx.quantity ? `${formatNaira(Number(tx.amount) / tx.quantity)}${tx.unit ? `/${tx.unit}` : ''}` : 'Nil';
  const paid = tx.payment_status === 'paid';
  const isVoice = tx.input_method === 'voice';

  const Row = ({ icon, label, value }: { icon: IconName; label: string; value: string }) => (
    <>
      <View style={styles.row}>
        <View style={styles.labelGroup}>
          <Ionicons name={icon} size={16} color="#0b4f8c" style={{ marginRight: 10 }} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={[styles.value, { flexShrink: 1, textAlign: 'right', marginLeft: 12 }]}>{value}</Text>
      </View>
      <View style={styles.divider} />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.successIconBadge}>
            <Ionicons name="checkmark" size={22} color="#ffffff" />
          </View>
          <Text style={styles.typeLabel}>{typeLabel(tx.type)}</Text>
          <Text style={styles.amountLabel}>{formatNaira(Number(tx.amount))}</Text>
          <Text style={styles.productLabel}>{tx.product_name || tx.description || typeLabel(tx.type)}</Text>
          <View style={[styles.paidBadge, !paid && { backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.paidBadgeText, !paid && { color: '#b45309' }]}>{statusLabel(tx.payment_status)}</Text>
          </View>
        </View>

        {/* Debt summary and payments */}
        {isDebt(tx.type) && debt && (
          <>
            <Text style={styles.sectionHeader}>{tx.type === 'receivable' ? 'Money owed to you' : 'Money you owe'}</Text>
            <View style={styles.infoCard}>
              <Row icon="cash-outline" label="Total amount" value={formatNaira(Number(tx.amount))} />
              <Row icon="checkmark-done-outline" label="Paid so far" value={formatNaira(debt.amount_paid)} />
              <Row icon="hourglass-outline" label="Still outstanding" value={formatNaira(debt.outstanding)} />
              {tx.due_date && <Row icon="alarm-outline" label="Due date" value={formatDay(tx.due_date)} />}
              {debt.payments.map((p) => (
                <Row
                  key={p.id}
                  icon="receipt-outline"
                  label={`Payment · ${formatDay(p.paid_at)}`}
                  value={`${formatNaira(Number(p.amount))}${p.note ? ` (${p.note})` : ''}`}
                />
              ))}
            </View>
            {debt.outstanding > 0 && (
              <TouchableOpacity style={styles.editButton} onPress={() => setShowPayModal(true)}>
                <Text style={styles.editButtonText}>Record payment</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Information */}
        <Text style={styles.sectionHeader}>Transaction Information</Text>
        <View style={styles.infoCard}>
          <Row icon="key-outline" label="Transaction ID" value={`TXN-${tx.id.slice(0, 8).toUpperCase()}`} />
          <Row icon="list-outline" label="Quantity" value={quantity || 'Nil'} />
          <Row icon="pricetag-outline" label="Unit Price" value={unitPrice} />
          <Row icon="calendar-outline" label="Date" value={formatDay(tx.transaction_date)} />
          <Row icon="time-outline" label="Time" value={formatClock(tx.created_at)} />
          {tx.type !== 'expense' && <Row icon="person-outline" label="Customer/Supplier" value={partyName ?? 'Nil'} />}
          <Row icon="document-text-outline" label="Notes" value={tx.notes ? `“${tx.notes}”` : 'Nil'} />
        </View>

        {/* Record Method */}
        <Text style={styles.sectionHeader}>Record Method</Text>
        <View style={styles.methodCard}>
          <View style={styles.methodLeft}>
            <Ionicons name={isVoice ? 'mic-outline' : 'create-outline'} size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.methodTitle}>{isVoice ? 'Voice Recording' : 'Manual Entry'}</Text>
              <Text style={styles.methodSub}>{isVoice ? 'Processed and transcribed by AI' : 'Entered by hand'}</Text>
            </View>
          </View>
          <View style={styles.voiceBadge}>
            <Text style={styles.voiceBadgeText}>{isVoice ? 'Voice' : 'Manual'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Edit Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setDeleteError(null);
            setShowDeleteModal(true);
          }}
        >
          <Text style={styles.deleteButtonText}>Delete Transaction</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Record payment modal */}
      <Modal visible={showPayModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowPayModal(false)}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Record payment</Text>
            <Text style={styles.modalSubtitle}>
              Still outstanding: {formatNaira(debt?.outstanding ?? 0)}
            </Text>

            <TextInput
              style={{ width: '100%', height: 46, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, marginBottom: 10, fontSize: 14 }}
              placeholder="Amount (₦)"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={payAmount}
              onChangeText={setPayAmount}
            />
            <TextInput
              style={{ width: '100%', height: 46, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, marginBottom: 10, fontSize: 14 }}
              placeholder="Note (optional)"
              placeholderTextColor="#9ca3af"
              maxLength={200}
              value={payNote}
              onChangeText={setPayNote}
            />

            {payError && <Text style={{ color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 10 }}>{payError}</Text>}

            <TouchableOpacity style={[styles.viewLedgerButton, paying && { opacity: 0.6 }]} onPress={handlePay} disabled={paying}>
              <Text style={styles.viewLedgerText}>{paying ? 'Saving...' : 'Save payment'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete confirmation modal */}
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

            {deleteError && (
              <Text style={{ color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{deleteError}</Text>
            )}

            <TouchableOpacity
              style={[styles.confirmDeleteButton, deleting && { opacity: 0.6 }]}
              onPress={handleDeleteConfirm}
              disabled={deleting}
            >
              <Text style={styles.confirmDeleteText}>{deleting ? 'Deleting...' : 'Delete Transaction'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelDeleteButton} onPress={() => setShowDeleteModal(false)}>
              <Text style={styles.cancelDeleteText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Deleted success modal */}
      <Modal visible={showDeletedSuccess} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.replace('/dashboard')}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>

            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={36} color="#ffffff" />
            </View>

            <Text style={styles.modalTitle}>Transaction Deleted!</Text>
            <Text style={styles.modalSubtitle}>Your transaction has been permanently deleted successfully</Text>

            <TouchableOpacity style={styles.viewLedgerButton} onPress={() => router.replace('/ledger')}>
              <Text style={styles.viewLedgerText}>View Ledger</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.returnDashboardButton} onPress={() => router.replace('/dashboard')}>
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