import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import { transcribeAudio, useTransactionDraft } from '@/features/transactions';

const MAX_SECONDS = 120;

export default function RecordActiveScreen() {
  const router = useRouter();
  const { update } = useTransactionDraft();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState(false);
  const [phase, setPhase] = useState<'recording' | 'transcribing' | 'ready' | 'error'>('recording');
  const [transcript, setTranscript] = useState('');
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const startRecording = async () => {
    setError(null);
    setSeconds(0);
    setEditing(false);
    setPhase('recording');
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        setError('Microphone access is needed to record. Go back and enter the transaction manually.');
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecording(true);
    } catch {
      setError("Couldn't start the recording. Please go back and try again.");
    }
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    startRecording();
  }, []);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const handleStop = async () => {
    if (!recording) return;
    setRecording(false);
    setPhase('transcribing');
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw new Error('no recording');
      const result = await transcribeAudio(uri);
      if (!result.ok) {
        setError(result.message);
        setPhase('error');
        return;
      }
      setTranscript(result.transcript);
      setPhase('ready');
    } catch {
      setError("Couldn't process the recording. Please try again.");
      setPhase('error');
    }
  };

  // Stop automatically at the time limit
  useEffect(() => {
    if (recording && seconds >= MAX_SECONDS) handleStop();
  }, [seconds, recording]);

  const handleContinue = () => {
    update({ transcript: transcript.trim(), inputMethod: 'voice' });
    router.push('/record-processing');
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Record Transaction</Text>

      <View style={styles.content}>
        <View style={styles.outerCircleActive}>
          <View style={styles.innerCircleActive}>
            <Ionicons name="mic" size={60} color="#ffffff" />
          </View>
        </View>

        <Text style={styles.listeningTitle}>{recording ? 'Listening...' : 'Recording stopped'}</Text>
        <Text style={styles.listeningSubtitle}>
          {recording ? 'Tap stop when you are done' : 'One moment'}
        </Text>

        {error && phase === 'recording' && (
          <Text style={{ color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{error}</Text>
        )}

        <View style={styles.waveRow}>
          {[16, 28, 40, 22, 36, 48, 20, 32, 44, 24, 38, 18, 30].map((h, i) => (
            <View key={i} style={[styles.waveBar, { height: h }]} />
          ))}
        </View>

        <Text style={styles.timerText}>{formatTime(seconds)}</Text>

        <TouchableOpacity
          style={[styles.stopButton, !recording && { opacity: 0.5 }]}
          onPress={handleStop}
          disabled={!recording}
        >
          <Text style={styles.stopButtonText}>Stop recording</Text>
        </TouchableOpacity>
      </View>

      {/* Speech-to-text popup */}
      <Modal visible={phase !== 'recording'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.transcriptTitle}>Speech-to-text</Text>

            {phase === 'transcribing' && (
              <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                <ActivityIndicator size="large" color="#0b4f8c" />
                <Text style={{ marginTop: 12, color: '#4b5563' }}>Transcribing...</Text>
              </View>
            )}

            {phase === 'ready' && (
              <>
                <View style={styles.transcriptCard}>
                  <Text style={styles.quoteMark}>“</Text>
                  {editing ? (
                    <TextInput
                      style={styles.transcriptText}
                      value={transcript}
                      onChangeText={setTranscript}
                      multiline
                      maxLength={500}
                      autoFocus
                    />
                  ) : (
                    <Text style={styles.transcriptText}>{transcript}</Text>
                  )}
                  <View style={styles.readyBadge}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.readyText}>Transcript ready</Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => setEditing(!editing)}>
                  <Text style={styles.editText}>{editing ? 'Done editing' : 'Edit Transcript'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.confirmButton} onPress={handleContinue}>
                  <Text style={styles.confirmButtonText}>Looks right – Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.recordAgainButton} onPress={startRecording}>
                  <Text style={styles.recordAgainText}>Record Again</Text>
                </TouchableOpacity>
              </>
            )}

            {phase === 'error' && (
              <>
                <Text style={{ color: '#dc2626', fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
                  {error}
                </Text>
                <TouchableOpacity style={styles.confirmButton} onPress={startRecording}>
                  <Text style={styles.confirmButtonText}>Try again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recordAgainButton} onPress={() => router.replace('/record-manually')}>
                  <Text style={styles.recordAgainText}>Enter manually</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    paddingHorizontal: 24, 
    paddingTop: 10, 
    paddingBottom: 60 
  },
  backButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#ffffff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e5e7eb', 
    marginBottom: 12 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#0b4f8c', 
    marginBottom: 10 
  },
  content: { 
    alignItems: 'center', 
    flex: 1, 
    justifyContent: 'center' 
  },
  outerCircleActive: { 
    width: 180, 
    height: 180, 
    borderRadius: 90, 
    backgroundColor: '#fee2e2', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  innerCircleActive: { 
    width: 135, 
    height: 135, 
    borderRadius: 67.5, 
    backgroundColor: '#dc2626', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  listeningTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#0b4f8c', 
    marginBottom: 4 
  },
  listeningSubtitle: { 
    fontSize: 14, 
    color: '#4b5563', 
    marginBottom: 16 
  },
  waveRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    height: 40, 
    marginBottom: 10 
  },
  waveBar: { 
    width: 4, 
    backgroundColor: '#dc2626', 
    borderRadius: 2 
  },
  timerText: { fontSize: 18, fontWeight: '700', color: '#dc2626', marginBottom: 20 },
  stopButton: { backgroundColor: '#dc2626', width: '100%', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
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