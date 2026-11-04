import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionForm, updateTransaction, useTransactionDraft, validateDraft } from '@/features/transactions';

export default function RecordEditScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { draft, reset } = useTransactionDraft();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setError(null);
    const problem = validateDraft(draft);
    if (problem) return setError(problem);

    // Editing a saved transaction: send the changes to the server
    if (editId) {
      setSaving(true);
      const result = await updateTransaction(editId, draft);
      setSaving(false);
      if (!result.ok) return setError(result.message);
      reset();
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>

        <Text style={styles.sectionTitle}>Edit Transaction</Text>
        <Text style={styles.sectionSubtitle}>Update the details if needed</Text>

        <TransactionForm />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={[styles.primaryButton, saving && { opacity: 0.6 }]} onPress={handleUpdate} disabled={saving}>
          <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Update details'}</Text>
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
  sectionSubtitle: { fontSize: 13, color: '#6b7280', marginBottom: 16 },
  errorText: { color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 10 },
  primaryButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 6, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  primaryButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});