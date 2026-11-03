import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function ExportFinancialScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('Last 6 months');
  const [selectedFormat, setSelectedFormat] = useState('PDF report');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Download Financial Profile</Text>

        {/* Profile Card Preview */}
        <View style={styles.previewCard}>
          <View style={styles.previewTop}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>AP</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.previewName}>Amina Fabrics</Text>
              <Text style={styles.previewSub}>A clear summary of your business performance, open balances and activity</Text>
            </View>
          </View>
          <View style={styles.previewMetaRow}>
            <Ionicons name="document-text-outline" size={14} color="#6b7280" style={{ marginRight: 6 }} />
            <Text style={styles.previewMetaText}>6-page report</Text>
          </View>
          <View style={styles.previewMetaRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#6b7280" style={{ marginRight: 6 }} />
            <Text style={styles.previewMetaText}>Verification note included</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Download Options</Text>

        {/* Reporting Period */}
        <Text style={styles.groupLabel}>REPORTING PERIOD</Text>
        {[
          { title: 'Last 3 months', sub: 'April – June 2026' },
          { title: 'Last 6 months', sub: 'January – June 2026', rec: true },
          { title: 'Last 12 months', sub: 'July 2025 – June 2026' },
        ].map((item) => {
          const isSelected = selectedPeriod === item.title;
          return (
            <TouchableOpacity 
              key={item.title}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => setSelectedPeriod(item.title)}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.optionTitle}>{item.title}</Text>
                    {item.rec && (
                      <View style={styles.recBadge}>
                        <Text style={styles.recText}>Recommended</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.optionSub}>{item.sub}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* File Format */}
        <Text style={styles.groupLabel}>FILE FORMAT</Text>
        {[
          { title: 'PDF report', sub: 'Easy to read and share' },
          { title: 'CSV spreadsheet', sub: 'Best for detailed analysis' },
        ].map((item) => {
          const isSelected = selectedFormat === item.title;
          return (
            <TouchableOpacity 
              key={item.title}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => setSelectedFormat(item.title)}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View>
                  <Text style={styles.optionTitle}>{item.title}</Text>
                  <Text style={styles.optionSub}>{item.sub}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={() => setShowSuccessModal(true)}
        >
          <Text style={styles.downloadButtonText}>Download Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Download Success Modal */}
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

            <Text style={styles.modalTitle}>Your profile is ready</Text>
            <Text style={styles.modalSubtitle}>
              Amaka’s Provisions financial profile has been downloaded to your device[cite: 46]
            </Text>

            <View style={styles.fileBox}>
              <Ionicons name="document-text" size={24} color="#10b981" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>Amakas-Provisions-Profile.pdf[cite: 46]</Text>
                <Text style={styles.fileSize}>PDF – 1.8 MB[cite: 46]</Text>
              </View>
              <View style={styles.fileCheckBadge}>
                <Ionicons name="checkmark" size={14} color="#10b981" />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.primaryModalBtn}
              onPress={() => { setShowSuccessModal(false); router.push('../finance'); }}
            >
              <Text style={styles.primaryModalBtnText}>Share Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryModalBtn}
              onPress={() => { setShowSuccessModal(false); router.push('../finance'); }}
            >
              <Text style={styles.secondaryModalBtnText}>View File</Text>
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
  previewCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  previewTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#fed7aa', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#c2410c' },
  previewName: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: 2 },
  previewSub: { fontSize: 12, color: '#6b7280', lineHeight: 16 },
  previewMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  previewMetaText: { fontSize: 12, color: '#4b5563', fontWeight: '500' },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#0b4f8c', marginBottom: 12 },
  groupLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', marginBottom: 8, marginTop: 4 },
  optionCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 10 },
  optionCardSelected: { borderColor: '#0b4f8c', backgroundColor: '#f0fdf4' },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  radioOuterSelected: { borderColor: '#0b4f8c' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0b4f8c' },
  optionTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  optionSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  recBadge: { backgroundColor: '#ccfbf1', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  recText: { fontSize: 10, fontWeight: '700', color: '#0f766e' },
  downloadButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 16, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  downloadButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 28, padding: 24, alignItems: 'center', elevation: 10 },
  closeButton: { alignSelf: 'flex-start', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  successCheckCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0d9488', justifyContent: 'center', alignItems: 'center', marginVertical: 8 },
  exportCompleteBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  exportCompleteText: { fontSize: 12, fontWeight: '700', color: '#065f46' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', textAlign: 'center', marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 18, marginBottom: 16, paddingHorizontal: 10 },
  fileBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 12, width: '100%', marginBottom: 20 },
  fileName: { fontSize: 13, fontWeight: '700', color: '#1f2937' },
  fileSize: { fontSize: 11, color: '#6b7280' },
  fileCheckBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center' },
  primaryModalBtn: { backgroundColor: '#0b4f8c', width: '100%', height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  primaryModalBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  secondaryModalBtn: { backgroundColor: '#0d9488', width: '100%', height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  secondaryModalBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});