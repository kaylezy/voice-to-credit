import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function ProfileEditScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Amina Yusuf');
  const [email, setEmail] = useState('amina-yusuf123@gmail.com');
  const [phone, setPhone] = useState('+234 801 234 5678');
  const [gender, setGender] = useState('Female');
  const [dob, setDob] = useState('12/03/1986');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>

        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: '#' }} style={styles.avatarLarge} />
          <TouchableOpacity style={styles.cameraBadge}>
            <Ionicons name="camera-outline" size={14} color="#0b4f8c" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.dropdown}>
              <Text style={{ fontSize: 14, color: '#1f2937' }}>{gender}</Text>
              <Ionicons name="chevron-down" size={18} color="#6b7280" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth (Optional)</Text>
            <View style={styles.dropdown}>
              <TextInput style={{ flex: 1, fontSize: 14, color: '#1f2937' }} value={dob} onChangeText={setDob} />
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 16 },
  avatarContainer: { alignItems: 'center', marginBottom: 20, position: 'relative' },
  avatarLarge: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#e5e7eb' },
  cameraBadge: { position: 'absolute', bottom: 0, right: '38%', width: 28, height: 28, borderRadius: 14, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', elevation: 2 },
  form: { marginBottom: 10 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16, fontSize: 14, color: '#1f2937' },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16 },
  saveBtn: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  saveBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});