import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import { exportTransactionsCsv } from '@/features/export/exportApi';

export default function ExportShareScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await exportTransactionsCsv();
      if (!result.ok) Alert.alert('Could not share', result.error);
    } catch {
      Alert.alert('Could not share', 'Something went wrong. Please try again.');
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
        <Text style={styles.headerTitle}>Share Records</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Send your records to someone</Text>
          <Text style={styles.body}>
            Your transactions are prepared as a spreadsheet. Then choose how to send them: email,
            WhatsApp, Google Drive or any app on your phone.
          </Text>

          <View style={styles.securityBox}>
            <Ionicons name="lock-closed-outline" size={18} color="#0d9488" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.securityTitle}>You stay in control</Text>
              <Text style={styles.securitySub}>
                The file goes only to the app and person you pick. It is not stored on our servers.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, loading && { opacity: 0.7 }]}
            onPress={handleShare}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.actionButtonText}>Share Records</Text>
            )}
          </TouchableOpacity>
        </View>
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
  formContainer: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '800', color: '#1f2937', marginBottom: 6 },
  body: { fontSize: 13, color: '#6b7280', lineHeight: 19, marginBottom: 16 },
  securityBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ccfbf1', borderRadius: 14, padding: 14, marginBottom: 20 },
  securityTitle: { fontSize: 13, fontWeight: '800', color: '#0f766e', marginBottom: 2 },
  securitySub: { fontSize: 11, color: '#115e59', lineHeight: 15 },
  actionButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  actionButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});