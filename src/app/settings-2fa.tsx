import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function Settings2FAScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<'Email' | 'SMS'>('Email');
  const [step, setStep] = useState<'select' | 'input' | 'otp'>('select');
  const [inputValue, setInputValue] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Two-Factor Authentication</Text>

        <View style={styles.bannerBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#0d9488" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Choose a preferred verification method</Text>
            <Text style={styles.bannerSub}>Add an extra layer of security to your account[cite: 67].</Text>
          </View>
        </View>

        {[
          { title: 'Email Verification', sub: 'Receive OTP via your email', rec: true },
          { title: 'SMS Verification', sub: 'Receive OTP via text message' },
        ].map((item) => {
          const isSelected = method === (item.title.includes('Email') ? 'Email' : 'SMS');
          return (
            <TouchableOpacity 
              key={item.title}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => setMethod(item.title.includes('Email') ? 'Email' : 'SMS')}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={{ flex: 1 }}>
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

        <TouchableOpacity style={styles.saveBtn} onPress={() => setStep('input')}>
          <Text style={styles.saveBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Step 2: Input Email / Phone Modal */}
      <Modal visible={step === 'input'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setStep('select')}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>

            <View style={styles.modalBanner}>
              <Ionicons name="lock-closed-outline" size={18} color="#0d9488" style={{ marginRight: 8 }} />
              <View>
                <Text style={styles.modalBannerTitle}>Enable {method} Verification</Text>
                <Text style={styles.modalBannerSub}>Input your {method === 'Email' ? 'email address' : 'phone number'} to receive an OTP[cite: 64, 66]</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{method === 'Email' ? 'Email Address' : 'Phone Number'}</Text>
              <TextInput 
                style={styles.input} 
                placeholder={method === 'Email' ? 'Enter your email address[cite: 64]' : 'Enter your phone number[cite: 66]'} 
                placeholderTextColor="#9ca3af"
                value={inputValue}
                onChangeText={setInputValue}
              />
            </View>

            <TouchableOpacity style={styles.saveBtnModal} onPress={() => setStep('otp')}>
              <Text style={styles.saveBtnText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setStep('select')}>
              <Text style={{ color: '#0b4f8c', fontWeight: '700' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Step 3: OTP Verification Modal */}
      <Modal visible={step === 'otp'} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setStep('select')}>
              <Ionicons name="close" size={22} color="#0b4f8c" />
            </TouchableOpacity>

            <Text style={styles.modalMainTitle}>Enter Verification Code</Text>

            <View style={styles.modalBanner}>
              <Ionicons name="lock-closed-outline" size={18} color="#0d9488" style={{ marginRight: 8 }} />
              <View>
                <Text style={styles.modalBannerTitle}>Verify Your Identity</Text>
                <Text style={styles.modalBannerSub}>Enter the OTP to continue setting up 2FA[cite: 63]</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>One-time Password (OTP)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter OTP[cite: 63]" 
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 }}>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Didn’t receive a code?[cite: 63]</Text>
              <TouchableOpacity onPress={() => alert('OTP Resent!')}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#0b4f8c' }}>Resend OTP[cite: 63]</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveBtnModal} onPress={() => { setStep('select'); router.push('../2fa-success'); }}>
              <Text style={styles.saveBtnText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setStep('select')}>
              <Text style={{ color: '#0b4f8c', fontWeight: '700' }}>Cancel</Text>
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
  bannerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ccfbf1', borderRadius: 16, padding: 16, marginBottom: 16 },
  bannerTitle: { fontSize: 13, fontWeight: '800', color: '#0f766e', marginBottom: 2 },
  bannerSub: { fontSize: 11, color: '#115e59', lineHeight: 16 },
  optionCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  optionCardSelected: { borderColor: '#0b4f8c', backgroundColor: '#f0fdf4' },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  radioOuterSelected: { borderColor: '#0b4f8c' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0b4f8c' },
  optionTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  optionSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  recBadge: { backgroundColor: '#ccfbf1', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  recText: { fontSize: 10, fontWeight: '700', color: '#0f766e' },
  saveBtn: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  saveBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 28, padding: 24, alignItems: 'center', elevation: 10 },
  closeButton: { alignSelf: 'flex-start', width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  modalMainTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 12 },
  modalBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ccfbf1', borderRadius: 14, padding: 12, width: '100%', marginBottom: 16 },
  modalBannerTitle: { fontSize: 13, fontWeight: '800', color: '#0f766e', marginBottom: 2 },
  modalBannerSub: { fontSize: 11, color: '#115e59' },
  inputGroup: { width: '100%', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16, fontSize: 14, color: '#1f2937', width: '100%' },
  saveBtnModal: { backgroundColor: '#0b4f8c', width: '100%', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
});