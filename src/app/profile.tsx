import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function ProfileScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile & Account</Text>
          <TouchableOpacity style={styles.gearBtn} onPress={() => router.push('../profile-security')}>
            <Ionicons name="settings-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Account Information Card */}
        <Text style={styles.sectionHeader}>Account Information</Text>
        <View style={styles.card}>
          <View style={styles.userTopRow}>
            <Image 
              source={{ uri: '#' }} // Profile avatar placeholder image
              style={styles.avatar} 
            />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.userName}>Aminu Yusuf</Text>
              <Text style={styles.userRole}>Business owner</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified email</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileBtn} onPress={() => router.push('../profile-edit')}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color="#0b4f8c" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.infoLabel}>Email address</Text>
              <Text style={styles.infoValue}>amina-yusuf123@gmail.com</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#0b4f8c" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.infoLabel}>Phone number</Text>
              <Text style={styles.infoValue}>+234 801 234 5678</Text>
            </View>
          </View>
        </View>

        {/* Personal Information Card */}
        <Text style={styles.sectionHeader}>Personal Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color="#0b4f8c" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>Female</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#0b4f8c" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.infoLabel}>Date of birth</Text>
              <Text style={styles.infoValue}>12 March, 1986</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#0b4f8c" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.infoLabel}>Member since</Text>
              <Text style={styles.infoValue}>23 December, 2025</Text>
            </View>
          </View>
        </View>

        {/* Action Links Card */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={() => alert('Help and Support screen')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="help-circle-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.actionTitle}>Help and Support</Text>
                <Text style={styles.actionSub}>FAQs, Contact support</Text>
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

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} onPress={() => setShowDeleteModal(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" style={{ marginRight: 12 }} />
              <View>
                <Text style={[styles.actionTitle, { color: '#ef4444' }]}>Delete Account</Text>
                <Text style={styles.actionSub}>Permanently remove account</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Modal */}
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
            <TouchableOpacity style={styles.dangerBtn} onPress={() => router.push('/dashboard')}>
              <Text style={styles.dangerBtnText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowDeleteModal(false)}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>
            <View style={styles.alertIconCircle}>
              <Ionicons name="trash" size={32} color="#ef4444" />
            </View>
            <Text style={styles.modalTitle}>Delete Your Account?</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to delete your account? This action may permanently remove your account and associated data, and you may lose access to your financial records. This cannot be undone.</Text>
            <TouchableOpacity style={styles.dangerBtn} onPress={() => { setShowDeleteModal(false); setShowDeletedSuccess(true); }}>
              <Text style={styles.dangerBtnText}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setShowDeleteModal(false)}>
              <Text style={{ color: '#0b4f8c', fontWeight: '700' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Account Deleted Success Modal */}
      <Modal visible={showDeletedSuccess} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={36} color="#ffffff" />
            </View>
            <Text style={[styles.modalTitle, { color: '#ef4444' }]}>Account has been deleted successfully</Text>
            <Text style={styles.modalSubtitle}>Account has been deleted successfully and cannot be undone</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/dashboard')}>
              <Text style={styles.primaryBtnText}>Return to Dashboard</Text>
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