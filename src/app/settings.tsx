import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function SettingsScreen() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>

        {/* Business Preferences Section */}
        <Text style={styles.sectionHeader}>Business Preferences</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('../settings-business')}>
            <View style={styles.rowLeft}>
              <Ionicons name="business-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.rowTitle}>Business Information</Text>
                <Text style={styles.rowSub}>Name, category, location and details[cite: 72]</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('../settings-language')}>
            <View style={styles.rowLeft}>
              <Ionicons name="globe-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.rowTitle}>Language</Text>
                <Text style={styles.rowSub}>English selected[cite: 72]</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('../settings-currency')}>
            <View style={styles.rowLeft}>
              <Ionicons name="wallet-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.rowTitle}>Currency</Text>
                <Text style={styles.rowSub}>Nigerian Naira selected[cite: 72]</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <Text style={styles.sectionHeader}>Security</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('../profile-security')}>
            <View style={styles.rowLeft}>
              <Ionicons name="lock-closed-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.rowTitle}>Change Password</Text>
                <Text style={styles.rowSub}>Last changed four months ago[cite: 72]</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('../settings-2fa')}>
            <View style={styles.rowLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.rowTitle}>Two-Factor Authentication</Text>
                <Text style={styles.rowSub}>Add an extra layer of security[cite: 72]</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.rowItem} onPress={() => alert('Privacy & Data Policy')}>
            <View style={styles.rowLeft}>
              <Ionicons name="document-text-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.rowTitle}>Privacy and Data Policy</Text>
                <Text style={styles.rowSub}>See how your records and data are protected[cite: 72]</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.rowItem} onPress={() => alert('Terms and Condition')}>
            <View style={styles.rowLeft}>
              <Ionicons name="newspaper-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.rowTitle}>Terms and Condition</Text>
                <Text style={styles.rowSub}>See terms and condition of service[cite: 72]</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Delete Account Card */}
        <View style={styles.dangerCard}>
          <Text style={styles.dangerCardTitle}>Delete Account</Text>
          <Text style={styles.dangerCardSub}>Permanently delete your account and business records[cite: 72]</Text>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => setShowDeleteModal(true)}>
            <Text style={styles.deleteBtnText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
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
            <Text style={styles.modalSubtitle}>Are you sure you want to delete your account? This action may permanently remove your account and associated data, and you may lose access to your financial records. This action cannot be undone[cite: 60].</Text>
            <TouchableOpacity style={styles.dangerBtn} onPress={() => { setShowDeleteModal(false); router.push('/dashboard'); }}>
              <Text style={styles.dangerBtnText}>Delete Account</Text>
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
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 14 },
  sectionHeader: { fontSize: 14, fontWeight: '800', color: '#0b4f8c', marginBottom: 8, marginTop: 4 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  rowSub: { fontSize: 11, color: '#6b7280' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 4 },
  dangerCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#fee2e2', marginBottom: 16 },
  dangerCardTitle: { fontSize: 14, fontWeight: '800', color: '#ef4444', marginBottom: 2 },
  dangerCardSub: { fontSize: 11, color: '#6b7280', marginBottom: 12 },
  deleteBtn: { backgroundColor: '#ef4444', height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  deleteBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 28, padding: 24, alignItems: 'center', elevation: 10 },
  closeButton: { alignSelf: 'flex-start', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  alertIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0b4f8c', textAlign: 'center', marginBottom: 8 },
  modalSubtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 18, marginBottom: 20, paddingHorizontal: 10 },
  dangerBtn: { backgroundColor: '#ef4444', width: '100%', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  dangerBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});