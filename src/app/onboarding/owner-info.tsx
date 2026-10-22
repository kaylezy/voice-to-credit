import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OwnerInfoScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
          </TouchableOpacity>

          {/* Stepper Indicator */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.completedStep]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
              <Text style={styles.stepLabelInactive}>Business Info</Text>
            </View>
            <View style={[styles.stepLine, styles.completedLine]} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.activeStep]}><Text style={styles.activeStepText}>2</Text></View>
              <Text style={styles.stepLabel}>Owner info</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.inactiveStep]}><Text style={styles.inactiveStepText}>3</Text></View>
              <Text style={styles.stepLabelInactive}>Category</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.inactiveStep]}><Text style={styles.inactiveStepText}>4</Text></View>
              <Text style={styles.stepLabelInactive}>Preferences</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.inactiveStep]}><Text style={styles.inactiveStepText}>5</Text></View>
              <Text style={styles.stepLabelInactive}>Review</Text>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Owner Information</Text>
            <Text style={styles.subtitle}>Tell us about yourself</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} placeholder="Enter your Full Name" placeholderTextColor="#9ca3af" value={fullName} onChangeText={setFullName} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.input} placeholder="Enter your Email Address" placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput style={styles.input} placeholder="Enter your Phone Number" placeholderTextColor="#9ca3af" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.dropdownContainer}>
                <TextInput style={styles.dropdownInput} placeholder="Select Gender" placeholderTextColor="#9ca3af" value={gender} onChangeText={setGender} />
                <Ionicons name="chevron-down" size={18} color="#9ca3af" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth (Optional)</Text>
              <View style={styles.dropdownContainer}>
                <TextInput style={styles.dropdownInput} placeholder="Select date" placeholderTextColor="#9ca3af" value={dob} onChangeText={setDob} />
                <Ionicons name="calendar-outline" size={18} color="#9ca3af" />
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('../onboarding/category-info')}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingHorizontal: 4 },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  activeStep: { backgroundColor: '#0b4f8c' },
  completedStep: { backgroundColor: '#0d9488' },
  inactiveStep: { backgroundColor: '#e5e7eb' },
  activeStepText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  inactiveStepText: { color: '#6b7280', fontSize: 12, fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#e5e7eb', marginHorizontal: 2, marginBottom: 18 },
  completedLine: { backgroundColor: '#0d9488' },
  stepLabel: { fontSize: 10, fontWeight: '700', color: '#0b4f8c' },
  stepLabelInactive: { fontSize: 10, color: '#9ca3af' },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '800', color: '#0b4f8c', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#4b5563' },
  form: { marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#1f2937', marginBottom: 6 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 50, paddingHorizontal: 16, fontSize: 15, color: '#1f2937' },
  dropdownContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 50, paddingHorizontal: 16 },
  dropdownInput: { flex: 1, fontSize: 15, color: '#1f2937' },
  primaryButton: { backgroundColor: '#0b4f8c', height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});