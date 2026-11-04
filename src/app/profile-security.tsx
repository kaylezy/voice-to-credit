import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from '@/lib/supabase';

export default function ProfileSecurityScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleChange = async () => {
    setError(null);
    setDone(false);
    if (!currentPassword) return setError('Enter your current password.');
    if (newPassword.length < 8) return setError('New password must be at least 8 characters.');
    if (newPassword !== confirmPassword) return setError('New passwords do not match.');
    if (newPassword === currentPassword) return setError('Choose a password you have not used before.');

    setLoading(true);
    const { data } = await supabase.auth.getUser();
    const email = data.user?.email;
    if (!email) {
      setLoading(false);
      return setError('Please log in again.');
    }

    // Confirm the current password first
    const check = await supabase.auth.signInWithPassword({ email, password: currentPassword });
    if (check.error) {
      setLoading(false);
      return setError('Current password is incorrect.');
    }

    const update = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (update.error) return setError(update.error.message);

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setDone(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security & Access</Text>

        <View style={styles.bannerBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#0d9488" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Change your password</Text>
            <Text style={styles.bannerSub}>Keep your account and financial records secure. Use a password you haven’t used before.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput style={styles.input} secureTextEntry autoCapitalize="none" value={currentPassword} onChangeText={setCurrentPassword} placeholder="********" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput style={styles.input} secureTextEntry autoCapitalize="none" value={newPassword} onChangeText={setNewPassword} placeholder="********" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput style={styles.input} secureTextEntry autoCapitalize="none" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="********" />
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {done && <Text style={styles.okText}>Password changed successfully.</Text>}

        <TouchableOpacity style={[styles.actionBtn, loading && { opacity: 0.6 }]} onPress={handleChange} disabled={loading}>
          <Text style={styles.actionBtnText}>{loading ? 'Changing...' : 'Change Password'}</Text>
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 14 },
  tabRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 16, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  tabActive: { backgroundColor: '#ffffff', elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#0b4f8c', fontWeight: '800' },
  bannerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ccfbf1', borderRadius: 16, padding: 16, marginBottom: 16 },
  bannerTitle: { fontSize: 13, fontWeight: '800', color: '#0f766e', marginBottom: 2 },
  bannerSub: { fontSize: 11, color: '#115e59', lineHeight: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16, fontSize: 14, color: '#1f2937' },
  actionBtn: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  actionBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  chevronRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  actionSub: { fontSize: 12, color: '#6b7280' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 10 },
  errorText: { color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  okText: { color: '#0d9488', fontSize: 13, textAlign: 'center', marginBottom: 12 },
});