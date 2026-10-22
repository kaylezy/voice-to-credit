import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RecordTransactionScreen() {
  const router = useRouter();
  const [showMicPermissionModal, setShowMicPermissionModal] = useState<boolean>(false);
  const [selectedLanguage] = useState<string>('English');

  const handleStartRecording = () => {
    setShowMicPermissionModal(true);
  };

  const handleAllowPermission = () => {
    setShowMicPermissionModal(false);
    router.push('/record-active');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Record Transaction</Text>

      <View style={styles.content}>
        {/* Recorder */}
        <TouchableOpacity style={styles.outerCircle} activeOpacity={0.8} onPress={handleStartRecording}>
          <View style={styles.innerCircle}>
            <Ionicons name="mic" size={60} color="#ffffff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.tapText}>Tap to record</Text>

        {/* Example Audio Transcript Preview Box */}
        <View style={styles.exampleBox}>
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#0b4f8c" style={{ marginRight: 8 }} />
          <Text style={styles.exampleText}>
            “I sold 20 yards of Ankara for eighty thousand naira.”
          </Text>
        </View>

        {/* Language Selection */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownText}>{selectedLanguage}</Text>
          <Ionicons name="chevron-down" size={18} color="#6b7280" />
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleStartRecording}>
          <Text style={styles.primaryButtonText}>Start Recording</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        {/* Manual Entry Button */}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => alert('Navigate to manual entry')}>
          <Text style={styles.secondaryButtonText}>Enter manually</Text>
        </TouchableOpacity>

        <View style={styles.noticeRow}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#0b4f8c" />
          <Text style={styles.noticeText}>You’ll review the details before anything is saved.</Text>
        </View>
      </View>

      {/*MICROPHONE ACCESS POPUP*/}
      <Modal visible={showMicPermissionModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowMicPermissionModal(false)}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>

            <View style={styles.micCircleBox}>
              <Ionicons name="mic" size={32} color="#0b4f8c" />
            </View>

            <Text style={styles.modalTitle}>Allow Microphone Access?</Text>
            <Text style={styles.modalSubtitle}>
              Voice-to-Credit Ledger uses your microphone to record a transaction when you choose to speak.
            </Text>

            <TouchableOpacity style={styles.modalAllowButton} onPress={handleAllowPermission}>
              <Text style={styles.modalAllowButtonText}>Allow</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalDenyButton} onPress={() => setShowMicPermissionModal(false)}>
              <Text style={styles.modalDenyButtonText}>Don't Allow</Text>
            </TouchableOpacity>

            <View style={styles.modalNoticeRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#6b7280" />
              <Text style={styles.modalNoticeText}>
                You’ll review the details before anything is saved.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 24, paddingTop: 10 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 20 },
  content: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  outerCircle: { width: 220, height: 220, borderRadius: 110, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  innerCircle: { width: 170, height: 170, borderRadius: 85, backgroundColor: '#0b4f8c', justifyContent: 'center', alignItems: 'center' },
  tapText: { fontSize: 22, fontWeight: '800', color: '#0b4f8c', marginBottom: 20 },
  exampleBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e6f4ea', padding: 14, borderRadius: 12, marginBottom: 16, width: '100%' },
  exampleText: { flex: 1, fontSize: 13, color: '#1e293b', fontWeight: '500' },
  dropdownContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#ffffff', borderRadius: 12, height: 48, paddingHorizontal: 16, width: '100%', marginBottom: 16 },
  dropdownText: { fontSize: 15, color: '#1f2937' },
  primaryButton: { backgroundColor: '#0b4f8c', width: '100%', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  orText: { fontSize: 13, color: '#6b7280', marginVertical: 6 },
  secondaryButton: { backgroundColor: '#0b4f8c', width: '100%', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  secondaryButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  noticeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  noticeText: { fontSize: 12, color: '#4b5563' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 28, padding: 24, alignItems: 'center', elevation: 10 },
  closeButton: { alignSelf: 'flex-start', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  micCircleBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', textAlign: 'center', marginBottom: 8 },
  modalSubtitle: { fontSize: 13, color: '#4b5563', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  modalAllowButton: { backgroundColor: '#0b4f8c', width: '100%', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  modalAllowButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  modalDenyButton: { alignItems: 'center', marginBottom: 20 },
  modalDenyButtonText: { color: '#0b4f8c', fontSize: 15, fontWeight: '700' },
  modalNoticeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modalNoticeText: { fontSize: 11, color: '#6b7280' },
});