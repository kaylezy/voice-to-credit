import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from '@/lib/supabase';
import { apiFetch } from '@/lib/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [email, setEmail] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { data } = await supabase.auth.getUser();
        setEmail(data.user?.email ?? '');
        if (data.user?.created_at) {
          setMemberSince(new Date(data.user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
        }
        const res = await apiFetch<any>('/api/profile');
        if (res.ok && res.data) {
          setName(res.data.full_name ?? res.data.name ?? '');
          setPhone(res.data.phone ?? res.data.phone_number ?? '');
        }
      })();
    }, [])
  );

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setShowLogoutModal(false);
    setLoggingOut(false);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile & Account</Text>
          <TouchableOpacity style={styles.gearBtn} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Account Information</Text>
        <View style={styles.card}>
          <View style={styles.userTopRow}>
            <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="person" size={26} color="#9ca3af" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.userName}>{name || 'Your account'}</Text>
              <Text style={styles.userRole}>Business owner</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified email</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color="#0b4f8c" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.infoLabel}>Email address</Text>
              <Text style={styles.infoValue}>{email || '—'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#0b4f8c" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.infoLabel}>Phone number</Text>
              <Text style={styles.infoValue}>{phone || '—'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#0b4f8c" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.infoLabel}>Member since</Text>
              <Text style={styles.infoValue}>{memberSince || '—'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/profile-security')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="lock-closed-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.actionTitle}>Change Password</Text>
                <Text style={styles.actionSub}>Update your account password</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} onPress={() => setShowLogoutModal(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 12 }} />
              <View>
                <Text style={[styles.actionTitle, { color: '#ef4444' }]}>Log Out</Text>
                <Text style={styles.actionSub}>Sign out on this device</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowLogoutModal(false)}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>
            <View style={styles.alertIconCircle}>
              <Ionicons name="log-out" size={32} color="#ef4444" />
            </View>
            <Text style={styles.modalTitle}>Log out of TradePadi?</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to log out of your account? You’ll need to sign in again to access your financial records.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowLogoutModal(false)}>
              <Text style={styles.primaryBtnText}>Stay Logged In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dangerBtn, loggingOut && { opacity: 0.6 }]} onPress={handleLogout} disabled={loggingOut}>
              <Text style={styles.dangerBtnText}>{loggingOut ? 'Logging out...' : 'Log Out'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 90 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0b4f8c' },
  gearBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#0b4f8c', justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { fontSize: 15, fontWeight: '800', color: '#0b4f8c', marginBottom: 8, marginTop: 4 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  userTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#e5e7eb' },
  userName: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: 2 },
  userRole: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  verifiedBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start' },
  verifiedText: { fontSize: 10, fontWeight: '700', color: '#065f46' },
  editProfileBtn: { backgroundColor: '#0d9488', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  editProfileText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  infoLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  actionSub: { fontSize: 11, color: '#6b7280' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 28, padding: 24, alignItems: 'center', elevation: 10 },
  closeButton: { alignSelf: 'flex-start', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  alertIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  successCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0d9488', justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0b4f8c', textAlign: 'center', marginBottom: 8 },
  modalSubtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 18, marginBottom: 20, paddingHorizontal: 10 },
  primaryBtn: { backgroundColor: '#0b4f8c', width: '100%', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  dangerBtn: { backgroundColor: '#ef4444', width: '100%', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  dangerBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});