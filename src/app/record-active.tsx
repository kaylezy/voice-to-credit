import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecordActiveScreen() {
  const router = useRouter();
  const [seconds, setSeconds] = useState<number>(8);
  const [showTranscriptModal, setShowTranscriptModal] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStopRecording = () => {
    setShowTranscriptModal(true);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Record Transaction</Text>

      <View style={styles.content}>
        {/* Active Red Mic Outer Circle */}
        <View style={styles.outerCircleActive}>
          <View style={styles.innerCircleActive}>
            <Ionicons name="mic" size={60} color="#ffffff" />
          </View>
        </View>

        <Text style={styles.listeningTitle}>Listening...</Text>
        <Text style={styles.listeningSubtitle}>Tap stop when you are done</Text>

        {/* Audio Wave Visualizer Placeholder */}
        <View style={styles.waveRow}>
          {[16, 28, 40, 22, 36, 48, 20, 32, 44, 24, 38, 18, 30].map((h, i) => (
            <View key={i} style={[styles.waveBar, { height: h }]} />
          ))}
        </View>

        {/* Recording Timer */}
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>

        {/* Stop Recording Button */}
        <TouchableOpacity style={styles.stopButton} onPress={handleStopRecording}>
          <Text style={styles.stopButtonText}>Stop recording</Text>
        </TouchableOpacity>
      </View>

      {/*SPEECH-TO-TEXT POPUP*/}
      <Modal visible={showTranscriptModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowTranscriptModal(false)}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>

            <Text style={styles.transcriptTitle}>Speech-to-text</Text>

            {/* Transcript Card Box */}
            <View style={styles.transcriptCard}>
              <Text style={styles.quoteMark}>“</Text>
              <Text style={styles.transcriptText}>
                I sold 20 yards of Ankara for ₦80,000.
              </Text>
              <View style={styles.readyBadge}>
                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                <Text style={styles.readyText}>Transcript ready</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => alert('Edit Transcript option')}>
              <Text style={styles.editText}>Edit Transcript</Text>
            </TouchableOpacity>

            {/* Action Buttons */}
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => alert('Confirm & navigate to structured extraction screen!')}
            >
              <Text style={styles.confirmButtonText}>Looks right – Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.recordAgainButton}
              onPress={() => setShowTranscriptModal(false)}
            >
              <Text style={styles.recordAgainText}>Record Again</Text>
            </TouchableOpacity>
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
  outerCircleActive: { width: 220, height: 220, borderRadius: 110, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  innerCircleActive: { width: 170, height: 170, borderRadius: 85, backgroundColor: '#dc2626', justifyContent: 'center', alignItems: 'center' },
  listeningTitle: { fontSize: 22, fontWeight: '800', color: '#0b4f8c', marginBottom: 6 },
  listeningSubtitle: { fontSize: 14, color: '#4b5563', marginBottom: 20 },
  waveRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 50, marginBottom: 12 },
  waveBar: { width: 4, backgroundColor: '#dc2626', borderRadius: 2 },
  timerText: { fontSize: 18, fontWeight: '700', color: '#dc2626', marginBottom: 30 },
  stopButton: { backgroundColor: '#dc2626', width: '100%', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  stopButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 28, padding: 24, alignItems: 'center', elevation: 10 },
  closeButton: { alignSelf: 'flex-start', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  transcriptTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', textAlign: 'center', marginBottom: 16 },
  transcriptCard: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#dcfce7', borderRadius: 16, padding: 16, width: '100%', marginBottom: 12 },
  quoteMark: { fontSize: 32, color: '#10b981', fontWeight: '800', lineHeight: 32, marginBottom: -8 },
  transcriptText: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 12, lineHeight: 22 },
  readyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  readyText: { fontSize: 13, fontWeight: '600', color: '#10b981' },
  editText: { color: '#0b4f8c', fontSize: 14, fontWeight: '700', alignSelf: 'flex-end', marginBottom: 20 },
  confirmButton: { backgroundColor: '#0b4f8c', width: '100%', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  confirmButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  recordAgainButton: { backgroundColor: '#0d9488', width: '100%', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  recordAgainText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});