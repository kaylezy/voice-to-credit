import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function SettingsCurrencyScreen() {
  const router = useRouter();
  const [selectedCurr, setSelectedCurr] = useState('Nigerian Naira');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#0b4f8c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Currency</Text>

        <View style={styles.bannerBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#0d9488" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Choose your preferred business currency</Text>
            <Text style={styles.bannerSub}>The chosen currency will reflect on new transactions, reports and exports[cite: 69].</Text>
          </View>
        </View>

        {[
          { title: 'Nigerian Naira', code: 'NGN (₦)', rec: true },
          { title: 'United States Dollar', code: 'USD ($)' },
          { title: 'British Pound', code: 'GBP (£)' },
        ].map((item) => {
          const isSelected = selectedCurr === item.title;
          return (
            <TouchableOpacity 
              key={item.title}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => setSelectedCurr(item.title)}
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
                  <Text style={styles.optionSub}>{item.code}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.noticeRow}>
          <Ionicons name="information-circle-outline" size={16} color="#d97706" style={{ marginRight: 6 }} />
          <Text style={styles.noticeText}>Existing transaction amounts won’t be converted. Only records created after this change will use the new currency[cite: 69].</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={() => router.push('../profile-saved')}>
          <Text style={styles.saveBtnText}>Save Currency</Text>
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
  noticeRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fef3c7', borderRadius: 12, padding: 12, marginVertical: 10 },
  noticeText: { fontSize: 11, color: '#92400e', flex: 1, lineHeight: 16 },
  saveBtn: { backgroundColor: '#0b4f8c', height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  saveBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});