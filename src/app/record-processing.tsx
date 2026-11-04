import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import { parseTranscript, useTransactionDraft } from '@/features/transactions';

export default function RecordProcessingScreen() {
  const router = useRouter();
  const { draft, update } = useTransactionDraft();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  const run = async () => {
    setError(null);
    const result = await parseTranscript(draft.transcript);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    update(result.draft);
    router.replace('/record-review');
  };

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    run();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Transaction</Text>

        <Text style={styles.sectionTitle}>Processing Transaction</Text>
        <Text style={styles.sectionSubtitle}>This might take a few seconds</Text>

        <View style={styles.card}>
          <View style={styles.stepRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Transcribing Voice</Text>
              <Text style={styles.stepStatusCompleted}>Completed</Text>
            </View>
          </View>

          <View style={styles.verticalLineCompleted} />

          <View style={styles.stepRow}>
            <View style={styles.iconContainer}>
              <View style={styles.activeRadioOuter}>
                <View style={styles.activeRadioInner} />
              </View>
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Identifying Transaction</Text>
              <Text style={styles.stepStatusInProgress}>{error ? 'Could not finish' : 'In progress...'}</Text>
            </View>
          </View>

          <View style={styles.verticalLinePending} />

          <View style={styles.stepRow}>
            <View style={styles.iconContainer}>
              <View style={styles.pendingCircle} />
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Checking Information</Text>
              <Text style={styles.stepStatusPending}>Pending...</Text>
            </View>
          </View>
        </View>

        {error && (
          <>
            <Text style={{ color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 14 }}>{error}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={run}>
              <Text style={styles.primaryButtonText}>Try again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#0d9488', marginTop: 10 }]}
              onPress={() => router.replace('/record-manually')}
            >
              <Text style={styles.primaryButtonText}>Enter manually</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 90 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 14 },
  illustrationBox: { width: '100%', height: 160, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  illustration: { width: '100%', height: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0b4f8c', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#6b7280', marginBottom: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 32, alignItems: 'center', marginRight: 12 },
  stepTextContainer: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  stepStatusCompleted: { fontSize: 13, fontWeight: '600', color: '#10b981' },
  stepStatusInProgress: { fontSize: 13, fontWeight: '600', color: '#0b4f8c' },
  stepStatusPending: { fontSize: 13, fontWeight: '600', color: '#9ca3af' },
  verticalLineCompleted: { width: 2, height: 24, backgroundColor: '#10b981', marginLeft: 15, marginVertical: 4 },
  verticalLinePending: { width: 2, height: 24, backgroundColor: '#e5e7eb', marginLeft: 15, marginVertical: 4 },
  activeRadioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#0b4f8c', justifyContent: 'center', alignItems: 'center' },
  activeRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0b4f8c' },
  pendingCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#d1d5db' },
  primaryButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  primaryButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});