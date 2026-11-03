import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function TwoFactorSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalCard}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.push('../settings')}>
          <Ionicons name="close" size={22} color="#0b4f8c" />
        </TouchableOpacity>

        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={36} color="#ffffff" />
        </View>

        <Text style={styles.title}>Two-Factor Authentication Enabled</Text>
        <Text style={styles.subtitle}>
          Your account has an extra layer of security. You’ll need to complete an additional verification step when signing in[cite: 73].
        </Text>

        <TouchableOpacity 
          style={styles.primaryBtn} 
          onPress={() => router.push('../settings')}
        >
          <Text style={styles.primaryBtnText}>Done</Text>
        </TouchableOpacity>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 28, padding: 24, alignItems: 'center', elevation: 10 },
  closeButton: { alignSelf: 'flex-start', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  successCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0d9488', justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', textAlign: 'center', marginBottom: 10, lineHeight: 26 },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 18, marginBottom: 24, paddingHorizontal: 10 },
  primaryBtn: { backgroundColor: '#0b4f8c', width: '100%', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});