import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function RecordReviewScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Transaction</Text>

        <Text style={styles.sectionTitle}>Review Transaction</Text>
        <Text style={styles.sectionSubtitle}>Confirm the details before saving</Text>

        {/* Review Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="pricetag-outline" size={18} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Transaction Type</Text>
            </View>
            <Text style={styles.valueBlue}>Sale</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="cube-outline" size={18} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Product</Text>
            </View>
            <Text style={styles.valueBlue}>Ankara</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="list-outline" size={18} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Quantity</Text>
            </View>
            <Text style={styles.valueBlue}>20 yards</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="wallet-outline" size={18} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Amount</Text>
            </View>
            <Text style={styles.valueBlue}>₦80,000</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="calendar-outline" size={18} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Date</Text>
            </View>
            <Text style={styles.valueBlue}>Today</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="person-outline" size={18} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Customer/Supplier</Text>
            </View>
            <Text style={styles.valueBlue}>Nil</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="card-outline" size={18} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Payment Status</Text>
            </View>
            <Text style={styles.valueBlue}>Paid</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Ionicons name="document-text-outline" size={18} color="#0b4f8c" style={{ marginRight: 10 }} />
              <Text style={styles.label}>Notes</Text>
            </View>
            <Text style={styles.valueBlue}>Nil</Text>
          </View>
        </View>

        <View style={styles.noticeRow}>
          <Ionicons name="information-circle-outline" size={14} color="#6b7280" />
          <Text style={styles.noticeText}>Nothing is saved until you confirm</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => router.push('/record-saved')}
        >
          <Text style={styles.confirmButtonText}>Confirm & save</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('/record-edit')}
        >
          <Text style={styles.editButtonText}>Edit details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/dashboard')}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0b4f8c', marginBottom: 2 },
  sectionSubtitle: { fontSize: 13, color: '#6b7280', marginBottom: 14 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  labelGroup: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 14, color: '#4b5563', fontWeight: '500' },
  valueBlue: { fontSize: 15, fontWeight: '700', color: '#0b4f8c' },
  divider: { height: 1, backgroundColor: '#f3f4f6' },
  noticeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 },
  noticeText: { fontSize: 12, color: '#6b7280' },
  confirmButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  confirmButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  editButton: { backgroundColor: '#0d9488', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  editButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  cancelButton: { alignItems: 'center', paddingVertical: 6 },
  cancelButtonText: { color: '#0b4f8c', fontSize: 15, fontWeight: '700' },
});