import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function SettingsBusinessScreen() {
  const router = useRouter();
  const [bizName, setBizName] = useState("Amaka's Provision");
  const [bizCat, setBizCat] = useState("Retail & Provisions");
  const [bizLoc, setBizLoc] = useState("Yaba, Lagos, Nigeria");
  const [bizPhone, setBizPhone] = useState("+234 801 234 5678");
  const [bizDate, setBizDate] = useState("March 2021");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Information</Text>

        <View style={styles.bannerBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#0d9488" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Keep your business profile current</Text>
            <Text style={styles.bannerSub}>These details appear on your financial profile and shared reports[cite: 71].</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business name</Text>
            <TextInput style={styles.input} value={bizName} onChangeText={setBizName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Category</Text>
            <View style={styles.dropdown}>
              <Text style={{ fontSize: 14, color: '#1f2937' }}>{bizCat}</Text>
              <Ionicons name="chevron-down" size={18} color="#6b7280" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business location</Text>
            <TextInput style={styles.input} value={bizLoc} onChangeText={setBizLoc} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business phone number</Text>
            <TextInput style={styles.input} value={bizPhone} onChangeText={setBizPhone} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business start date</Text>
            <View style={styles.dropdown}>
              <TextInput style={{ flex: 1, fontSize: 14, color: '#1f2937' }} value={bizDate} onChangeText={setBizDate} />
              <Ionicons name="calendar-outline" size={18} color="#6b7280" />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={() => router.push('../profile-saved')}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
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
  bannerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ccfbf1', borderRadius: 16, padding: 16, marginBottom: 16 },
  bannerTitle: { fontSize: 13, fontWeight: '800', color: '#0f766e', marginBottom: 2 },
  bannerSub: { fontSize: 11, color: '#115e59', lineHeight: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16, fontSize: 14, color: '#1f2937' },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16 },
  saveBtn: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  saveBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});