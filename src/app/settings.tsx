import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();

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
        </View>

        {/* Security Section */}
        <Text style={styles.sectionHeader}>Security</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.rowItem} onPress={() => router.push('/profile-security')}>
            <View style={styles.rowLeft}>
              <Ionicons name="lock-closed-outline" size={20} color="#0b4f8c" style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.rowTitle}>Change Password</Text>
                <Text style={styles.rowSub}>Update your account password</Text>
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
  sectionHeader: { fontSize: 14, fontWeight: '800', color: '#0b4f8c', marginBottom: 8, marginTop: 4 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  rowSub: { fontSize: 11, color: '#6b7280' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 4 },
});