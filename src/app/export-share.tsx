import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function ExportShareScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'email' | 'link'>('email');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleExport = () => {
    if (activeTab === 'email') {
      setShowSuccessModal(true);
    } else {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Financial Profile</Text>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'email' && styles.tabBtnActive]}
            onPress={() => setActiveTab('email')}
          >
            <Ionicons name="mail-outline" size={16} color={activeTab === 'email' ? '#0b4f8c' : '#6b7280'} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, activeTab === 'email' && styles.tabTextActive]}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'link' && styles.tabBtnActive]}
            onPress={() => setActiveTab('link')}
          >
            <Ionicons name="share-social-outline" size={16} color={activeTab === 'link' ? '#0b4f8c' : '#6b7280'} style={{ marginRight: 6 }} />
            <Text style={[styles.tabText, activeTab === 'link' && styles.tabTextActive]}>Copy link</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'email' ? (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter email address" 
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput 
                style={styles.textArea} 
                placeholder="Type your message" 
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.securityBox}>
              <Ionicons name="lock-closed-outline" size={18} color="#0d9488" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.securityTitle}>View only</Text>
                <Text style={styles.securitySub}>The recipient cannot edit or edit your transaction records[cite: 50]</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
              <Text style={styles.actionButtonText}>Export Financial Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Secure profile link</Text>
              <View style={styles.linkBox}>
                <Text style={styles.linkText}>tradepadi.ng/p/amaka-7FX2K[cite: 50]</Text>
                <TouchableOpacity style={styles.copyBtn} onPress={() => { setShowCopyToast(true); setTimeout(() => setShowCopyToast(false), 2000); }}>
                  <Text style={styles.copyBtnText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.securityBox}>
              <Ionicons name="lock-closed-outline" size={18} color="#0d9488" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.securityTitle}>View only</Text>
                <Text style={styles.securitySub}>The recipient cannot edit or edit your transaction records[cite: 50]</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
              <Text style={styles.actionButtonText}>Share Secured Link</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Copy Link Toast notification */}
      {showCopyToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Link copied![cite: 48]</Text>
        </View>
      )}

      {/* Email Export Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSuccessModal(false)}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>

            <View style={styles.successCheckCircle}>
              <Ionicons name="checkmark" size={36} color="#ffffff" />
            </View>

            <View style={styles.exportCompleteBadge}>
              <Text style={styles.exportCompleteText}>Export Complete</Text>
            </View>

            <Text style={styles.modalTitle}>Your profile have been exported successfully[cite: 49]</Text>
            <Text style={styles.modalSubtitle}>
              Amaka’s Provisions financial profile has been sent to your email[cite: 49]
            </Text>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => { setShowSuccessModal(false); router.push('../finance'); }}
            >
              <Text style={styles.actionButtonText}>Done</Text>
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 16 },
  tabRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 16, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, flexDirection: 'row', height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#0b4f8c', fontWeight: '800' },
  formContainer: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16, fontSize: 14, color: '#1f2937' },
  textArea: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 100, paddingHorizontal: 16, paddingTop: 12, fontSize: 14, color: '#1f2937', textAlignVertical: 'top' },
  linkBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingLeft: 14, paddingRight: 6 },
  linkText: { flex: 1, fontSize: 13, color: '#1f2937', fontWeight: '500' },
  copyBtn: { backgroundColor: '#0d9488', paddingHorizontal: 14, height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  copyBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  securityBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ccfbf1', borderRadius: 14, padding: 14, marginBottom: 20 },
  securityTitle: { fontSize: 13, fontWeight: '800', color: '#0f766e', marginBottom: 2 },
  securitySub: { fontSize: 11, color: '#115e59', lineHeight: 15 },
  actionButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  actionButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  toast: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: '#1f2937', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, elevation: 6 },
  toastText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 28, padding: 24, alignItems: 'center', elevation: 10 },
  closeButton: { alignSelf: 'flex-start', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  successCheckCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0d9488', justifyContent: 'center', alignItems: 'center', marginVertical: 8 },
  exportCompleteBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  exportCompleteText: { fontSize: 12, fontWeight: '700', color: '#065f46' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0b4f8c', textAlign: 'center', marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 18, marginBottom: 24, paddingHorizontal: 10 },
});