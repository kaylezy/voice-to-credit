import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function ProfileSecurityScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'password' | '2fa'>('password');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security & Access</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tabBtn, tab === 'password' && styles.tabActive]} onPress={() => setTab('password')}>
            <Text style={[styles.tabText, tab === 'password' && styles.tabTextActive]}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, tab === '2fa' && styles.tabActive]} onPress={() => setTab('2fa')}>
            <Text style={[styles.tabText, tab === '2fa' && styles.tabTextActive]}>Two-Factor Auth</Text>
          </TouchableOpacity>
        </View>

        {tab === 'password' ? (
          <View>
            <View style={styles.bannerBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#0d9488" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>Change your password</Text>
                <Text style={styles.bannerSub}>Keep your account and financial records secure. Use a password you haven’t used before[cite: 56].</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput style={styles.input} secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} placeholder="********" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder="********" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} placeholder="********" />
              </View>
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Password changed successfully!')}>
              <Text style={styles.actionBtnText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.bannerBox}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0d9488" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>Enable Two-factor Authentication</Text>
                <Text style={styles.bannerSub}>Add an extra layer of security to your account and help protect your financial records[cite: 53].</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionTitle}>Enable Two-Factor Authentication</Text>
                  <Text style={styles.actionSub}>Verify your identity when logging[cite: 53]</Text>
                </View>
                <Switch 
                  value={is2FAEnabled} 
                  onValueChange={(val) => {
                    setIs2FAEnabled(val);
                    if (val) router.push('../settings-2fa');
                  }}
                  trackColor={{ false: '#d1d5db', true: '#0b4f8c' }}
                />
              </View>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.chevronRow} onPress={() => router.push('../settings-2fa')}>
                <View>
                  <Text style={styles.actionTitle}>Verification Method</Text>
                  <Text style={styles.actionSub}>Email 2FA verification[cite: 53]</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
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
});