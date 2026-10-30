import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function RecordManuallyScreen() {
  const router = useRouter();
  const [product, setProduct] = useState('Ankara');
  const [quantity, setQuantity] = useState('20');
  const [unit, setUnit] = useState('Yards');
  const [amount, setAmount] = useState('₦80,000');
  const [date, setDate] = useState('Today');
  const [customer, setCustomer] = useState('Aisha');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Partially' | 'Unpaid'>('Unpaid');
  const [notes, setNotes] = useState('Cash payment made in full');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Back Button & Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Manually</Text>

        <Text style={styles.sectionTitle}>Enter Transaction Details</Text>
        <Text style={styles.sectionSubtitle}>Record details accurately for your ledger</Text>

        {/* Form Container */}
        <View style={styles.formCard}>
          {/* Product / Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product / Description <Text style={styles.requiredStar}>*</Text></Text>
            <TextInput style={styles.input} value={product} onChangeText={setProduct} />
          </View>

          {/* Quantity & Unit Row */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Unit</Text>
              <TextInput style={styles.input} value={unit} onChangeText={setUnit} />
            </View>
          </View>

          {/* Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput style={styles.input} value={amount} onChangeText={setAmount} />
          </View>

          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.dropdownContainer}>
              <TextInput style={styles.inputFlex} value={date} onChangeText={setDate} />
              <Ionicons name="calendar-outline" size={18} color="#6b7280" />
            </View>
          </View>

          {/* Customer / Supplier */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer / supplier (optional)</Text>
            <TextInput style={styles.input} value={customer} onChangeText={setCustomer} />
          </View>

          {/* Payment Status Selector Pills */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Status <Text style={styles.requiredStar}>*</Text></Text>
            <View style={styles.pillsRow}>
              {(['Paid', 'Partially', 'Unpaid'] as const).map((status) => {
                const isSelected = paymentStatus === status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => setPaymentStatus(status)}
                  >
                    <Ionicons 
                      name={status === 'Paid' ? 'checkmark-circle-outline' : status === 'Partially' ? 'radio-button-on-outline' : 'ellipse-outline'} 
                      size={16} 
                      color={isSelected ? '#ffffff' : '#6b7280'} 
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{status}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput 
              style={styles.textArea} 
              placeholder="Add a note..." 
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              value={notes} 
              onChangeText={setNotes} 
            />
          </View>
        </View>

        <View style={styles.noticeRow}>
          <Ionicons name="information-circle-outline" size={14} color="#6b7280" />
          <Text style={styles.noticeText}>Nothing is saved until you confirm</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('../manual-review')}
        >
          <Text style={styles.primaryButtonText}>Review</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
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
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b4f8c', marginBottom: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0b4f8c', marginBottom: 2 },
  sectionSubtitle: { fontSize: 13, color: '#6b7280', marginBottom: 14 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 6 },
  requiredStar: { color: '#ef4444' },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16, fontSize: 14, color: '#1f2937' },
  inputFlex: { flex: 1, fontSize: 14, color: '#1f2937' },
  rowInputs: { flexDirection: 'row' },
  dropdownContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16 },
  pillsRow: { flexDirection: 'row', gap: 8 },
  pill: { flex: 1, flexDirection: 'row', height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  pillSelected: { backgroundColor: '#0b4f8c', borderColor: '#0b4f8c' },
  pillText: { fontSize: 13, fontWeight: '600', color: '#4b5563' },
  pillTextSelected: { color: '#ffffff' },
  textArea: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 90, paddingHorizontal: 16, paddingTop: 12, fontSize: 14, color: '#1f2937', textAlignVertical: 'top' },
  noticeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16 },
  noticeText: { fontSize: 12, color: '#6b7280' },
  primaryButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  primaryButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  cancelButton: { alignItems: 'center', paddingVertical: 4 },
  cancelButtonText: { color: '#0b4f8c', fontSize: 15, fontWeight: '700' },
});