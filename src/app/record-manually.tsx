import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionForm, useTransactionDraft, validateDraft } from '@/features/transactions';

export default function RecordManuallyScreen() {
  const router = useRouter();
  const { draft, update } = useTransactionDraft();
  const [error, setError] = useState<string | null>(null);

  const handleReview = () => {
    const problem = validateDraft(draft);
    if (problem) return setError(problem);
    setError(null);
    update({ inputMethod: 'manual' });
    router.push('/record-review');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Manually</Text>

        <Text style={styles.sectionTitle}>Enter Transaction Details</Text>
        <Text style={styles.sectionSubtitle}>Record details accurately for your ledger</Text>

        <TransactionForm />

        <View style={styles.noticeRow}>
          <Ionicons name="information-circle-outline" size={14} color="#6b7280" />
          <Text style={styles.noticeText}>Nothing is saved until you confirm</Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.primaryButton} onPress={handleReview}>
          <Text style={styles.primaryButtonText}>Review</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0b4f8c', marginBottom: 2 },
  sectionSubtitle: { fontSize: 13, color: '#6b7280', marginBottom: 14 },
  noticeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 },
  noticeText: { fontSize: 12, color: '#6b7280' },
  errorText: { color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 10 },
  primaryButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  primaryButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  cancelButton: { alignItems: 'center', paddingVertical: 4 },
  cancelButtonText: { color: '#0b4f8c', fontSize: 15, fontWeight: '700' },
});