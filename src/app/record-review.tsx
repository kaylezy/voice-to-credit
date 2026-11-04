import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  formatNaira, isDebt, parseAmount, saveTransaction, statusLabel, typeLabel, useTransactionDraft,
} from '@/features/transactions';

export default function RecordReviewScreen() {
  const router = useRouter();
  const { draft, idempotencyKey, setSavedId, reset } = useTransactionDraft();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState(false);

  const save = async (allowDuplicate = false) => {
    setError(null);
    setDuplicate(false);
    setSaving(true);
    const result = await saveTransaction(draft, idempotencyKey, allowDuplicate);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      setDuplicate(result.code === 'duplicate_transaction');
      return;
    }
    setSavedId(result.id);
    router.replace('/record-saved');
  };

  const amount = parseAmount(draft.amount);
  const quantity = `${draft.quantity} ${draft.unit}`.trim();
  const lowConfidence = draft.inputMethod === 'voice' && draft.confidence !== null && draft.confidence < 0.7;

  const Row = ({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }) => (
    <>
      <View style={styles.row}>
        <View style={styles.labelGroup}>
          <Ionicons name={icon} size={18} color="#0b4f8c" style={{ marginRight: 10 }} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={[styles.valueBlue, { flexShrink: 1, textAlign: 'right', marginLeft: 12 }]}>{value}</Text>
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
        <Text style={styles.headerTitle}>Record Transaction</Text>

        <Text style={styles.sectionTitle}>Review Transaction</Text>
        <Text style={styles.sectionSubtitle}>Confirm the details before saving</Text>

        {lowConfidence && (
          <View style={styles.warnBox}>
            <Ionicons name="alert-circle-outline" size={18} color="#92400e" />
            <Text style={styles.warnText}>We weren't fully sure about this one. Please check every detail carefully.</Text>
          </View>
        )}

        <View style={styles.card}>
          <Row icon="pricetag-outline" label="Transaction Type" value={typeLabel(draft.type)} />
          <Row icon="cube-outline" label="Product" value={draft.product || 'Nil'} />
          <Row icon="list-outline" label="Quantity" value={quantity || 'Nil'} />
          <Row icon="wallet-outline" label="Amount" value={amount !== null ? formatNaira(amount) : 'Nil'} />
          <Row icon="calendar-outline" label="Date" value={draft.date || 'Today'} />
          {draft.type !== 'expense' && (
            <Row icon="person-outline" label="Customer/Supplier" value={draft.party || 'Nil'} />
          )}
          <Row icon="card-outline" label="Payment Status" value={statusLabel(draft.status)} />
          {isDebt(draft.type) && <Row icon="alarm-outline" label="Due Date" value={draft.dueDate || 'Not set'} />}
          <Row icon="document-text-outline" label="Notes" value={draft.notes || 'Nil'} />
        </View>

        <View style={styles.noticeRow}>
          <Ionicons name="information-circle-outline" size={14} color="#6b7280" />
          <Text style={styles.noticeText}>Nothing is saved until you confirm</Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {duplicate ? (
          <TouchableOpacity style={styles.confirmButton} onPress={() => save(true)} disabled={saving}>
            <Text style={styles.confirmButtonText}>Save anyway</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.confirmButton, saving && { opacity: 0.6 }]}
            onPress={() => save(false)}
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.confirmButtonText}>Confirm & save</Text>}
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/record-edit')} disabled={saving}>
          <Text style={styles.editButtonText}>Edit details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            reset();
            router.replace('/dashboard');
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0b4f8c', marginBottom: 2 },
  sectionSubtitle: { fontSize: 13, color: '#6b7280', marginBottom: 14 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  labelGroup: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 14, color: '#4b5563', fontWeight: '500' },
  valueBlue: { fontSize: 15, fontWeight: '700', color: '#0b4f8c' },
  divider: { height: 1, backgroundColor: '#f3f4f6' },
  noticeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 },
  noticeText: { fontSize: 12, color: '#6b7280' },
  confirmButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  confirmButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  editButton: { backgroundColor: '#0d9488', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  editButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  cancelButton: { alignItems: 'center', paddingVertical: 6 },
  cancelButtonText: { color: '#0b4f8c', fontSize: 15, fontWeight: '700' },
    errorText: { color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 10 },
  warnBox: { flexDirection: 'row', gap: 8, backgroundColor: '#fef3c7', borderRadius: 12, padding: 12, marginBottom: 12 },
  warnText: { flex: 1, fontSize: 12, color: '#92400e' },
});