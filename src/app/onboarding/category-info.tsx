import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: '1', name: 'Fashion & Clothing', icon: 'shirt-outline' },
  { id: '2', name: 'Food & Beverages', icon: 'restaurant-outline' },
  { id: '3', name: 'Retail & Provision', icon: 'storefront-outline' },
  { id: '4', name: 'Electronics & Accessories', icon: 'hardware-chip-outline' },
  { id: '5', name: 'Beauty & Personal care', icon: 'heart-outline' },
  { id: '6', name: 'Fabrics and Textiles', icon: 'layers-outline' },
  { id: '7', name: 'Home & Living', icon: 'home-outline' },
  { id: '8', name: 'Others', icon: 'ellipsis-horizontal-outline' },
];

export default function CategoryScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Retail & Provision');

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
            <Text style={styles.stepLabelInactive}>Business Info</Text>
          </View>
          <View style={[styles.stepLine, styles.completedLine]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.completedStep]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
            <Text style={styles.stepLabelInactive}>Owner info</Text>
          </View>
          <View style={[styles.stepLine, styles.completedLine]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.activeStep]}><Text style={styles.activeStepText}>3</Text></View>
            <Text style={styles.stepLabel}>Category</Text>
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
          <Text style={styles.title}>Business Category</Text>
          <Text style={styles.subtitle}>What best describes your business?</Text>
        </View>

        {/* Category List Card */}
        <View style={styles.card}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.categoryItem} 
                onPress={() => setSelectedCategory(cat.name)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryLeft}>
                  <View style={styles.iconBox}>
                    <Ionicons name={cat.icon as any} size={20} color="#0b4f8c" />
                  </View>
                  <Text style={styles.categoryText}>{cat.name}</Text>
                </View>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('../onboarding/preferences')}>
          <Text style={styles.primaryButtonText}>Continue</Text>
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
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#0b4f8c', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#4b5563' },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  categoryItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  categoryLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  categoryText: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
  radioOuterSelected: { borderColor: '#0b4f8c' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0b4f8c' },
  primaryButton: { backgroundColor: '#0b4f8c', height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});