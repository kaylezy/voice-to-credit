import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function RecordEditScreen() {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState('Sale');
  const [product, setProduct] = useState('Ankara');
  const [quantity, setQuantity] = useState('20');
  const [unit, setUnit] = useState('Yards');
  const [amount, setAmount] = useState('₦80,000');
  const [date, setDate] = useState('Today');
  const [customer, setCustomer] = useState('Aisha');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [notes, setNotes] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Transaction</Text>

        <Text style={styles.sectionTitle}>Edit Transaction</Text>
        <Text style={styles.sectionSubtitle}>Update the details if needed</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.dropdownContainer}>
              <TextInput style={styles.inputFlex} value={transactionType} onChangeText={setTransactionType} />
              <Ionicons name="chevron-down" size={18} color="#6b7280" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product / description</Text>
            <TextInput style={styles.input} value={product} onChangeText={setProduct} />
          </View>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput style={styles.input} value={amount} onChangeText={setAmount} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.dropdownContainer}>
              <TextInput style={styles.inputFlex} value={date} onChangeText={setDate} />
              <Ionicons name="calendar-outline" size={18} color="#6b7280" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer / supplier (optional)</Text>
            <TextInput style={styles.input} value={customer} onChangeText={setCustomer} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Status</Text>
            <View style={styles.dropdownContainer}>
              <TextInput style={styles.inputFlex} value={paymentStatus} onChangeText={setPaymentStatus} />
              <Ionicons name="chevron-down" size={18} color="#6b7280" />
            </View>
          </View>

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

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/record-review')}
        >
          <Text style={styles.primaryButtonText}>Update details</Text>
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
  sectionSubtitle: { fontSize: 13, color: '#6b7280', marginBottom: 16 },
  form: { marginBottom: 10 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16, fontSize: 14, color: '#1f2937' },
  inputFlex: { flex: 1, fontSize: 14, color: '#1f2937' },
  rowInputs: { flexDirection: 'row' },
  dropdownContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 46, paddingHorizontal: 16 },
  textArea: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 100, paddingHorizontal: 16, paddingTop: 12, fontSize: 14, color: '#1f2937', textAlignVertical: 'top' },
  primaryButton: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 6, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  primaryButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});