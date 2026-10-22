import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ReviewScreen() {
  const router = useRouter();
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [privacyAgreed, setPrivacyAgreed] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>

        {/* Stepper Indicator */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.completedStep]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
            <Text style={styles.stepLabelInactive}>Business</Text>
          </View>
          <View style={[styles.stepLine, styles.completedLine]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.completedStep]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
            <Text style={styles.stepLabelInactive}>Owner</Text>
          </View>
          <View style={[styles.stepLine, styles.completedLine]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.completedStep]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
            <Text style={styles.stepLabelInactive}>Category</Text>
          </View>
          <View style={[styles.stepLine, styles.completedLine]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.completedStep]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
            <Text style={styles.stepLabelInactive}>Prefs</Text>
          </View>
          <View style={[styles.stepLine, styles.completedLine]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.activeStep]}><Text style={styles.activeStepText}>5</Text></View>
            <Text style={styles.stepLabel}>Review</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Review Information</Text>
          <Text style={styles.subtitle}>Take a moment to check your information before completing your setup. You can go back to make changes if anything is incorrect.</Text>
        </View>

        {/* Business Information Card */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <TouchableOpacity onPress={() => router.push('../onboarding/business-info')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Business Name</Text>
            <Text style={styles.infoValue}>Amina Fabrics</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoValue}>Fashion design, fabrics & fashion accessories sale</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Business Category</Text>
            <Text style={styles.infoValue}>Fashion and Clothing</Text>
          </View>
        </View>

        {/* Owner Information Card */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Owner Information</Text>
          <TouchableOpacity onPress={() => router.push('../onboarding/owner-info')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>Amina Yusuf</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue}>amina-yusuf123@gmail.com</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>+234 801 234 5678</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>Female</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>12/03/1986</Text>
          </View>
        </View>

        {/* Preferences Card */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity onPress={() => router.push('../onboarding/preferences')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>Yaba, Lagos</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Language</Text>
            <Text style={styles.infoValue}>English</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Currency</Text>
            <Text style={styles.infoValue}>Nigerian Naira (₦)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Business Start Date</Text>
            <Text style={styles.infoValue}>12/03/2022</Text>
          </View>
        </View>

        {/* Terms & Privacy */}
        <Text style={styles.termsHeader}>Terms & Privacy</Text>
        <Text style={styles.termsSubtext}>By creating an account, you agree to our Terms of Services and Privacy Policy.</Text>

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setTermsAgreed(!termsAgreed)}>
          <View style={[styles.checkbox, termsAgreed && styles.checkboxChecked]}>
            {termsAgreed && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>I agree to the Terms of Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setPrivacyAgreed(!privacyAgreed)}>
          <View style={[styles.checkbox, privacyAgreed && styles.checkboxChecked]}>
            {privacyAgreed && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>I agree to the Privacy Policy</Text>
        </TouchableOpacity>

        {/* Complete Setup Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('../onboarding/setup-complete')}>
          <Text style={styles.primaryButtonText}>Complete Setup</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingHorizontal: 4 },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  activeStep: { backgroundColor: '#0b4f8c' },
  completedStep: { backgroundColor: '#0d9488' },
  inactiveStep: { backgroundColor: '#e5e7eb' },
  activeStepText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  inactiveStepText: { color: '#6b7280', fontSize: 11, fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#e5e7eb', marginHorizontal: 2, marginBottom: 16 },
  completedLine: { backgroundColor: '#0d9488' },
  stepLabel: { fontSize: 9, fontWeight: '700', color: '#0b4f8c' },
  stepLabelInactive: { fontSize: 9, color: '#9ca3af' },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#0b4f8c', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0b4f8c' },
  editText: { fontSize: 14, fontWeight: '700', color: '#0b4f8c' },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  infoLabel: { fontSize: 13, color: '#6b7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1f2937', textAlign: 'right', flex: 1, marginLeft: 16 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 6 },
  termsHeader: { fontSize: 15, fontWeight: '700', color: '#1f2937', marginTop: 10, marginBottom: 4 },
  termsSubtext: { fontSize: 13, color: '#6b7280', lineHeight: 18, marginBottom: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#0b4f8c', justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: '#fff' },
  checkboxChecked: { backgroundColor: '#0b4f8c' },
  checkboxLabel: { fontSize: 14, color: '#374151', fontWeight: '500' },
  primaryButton: { backgroundColor: '#0b4f8c', height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginTop: 16, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});