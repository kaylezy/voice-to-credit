import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';

export default function RecordSavedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalCard}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.push('/dashboard')}>
          <Ionicons name="close" size={22} color="#0b4f8c" />
        </TouchableOpacity>

        {/* Success Icon / Image Reference */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: '#' }} // Image reference (src="#")
            style={styles.successImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Details */}
        <Text style={styles.title}>Transaction saved!</Text>
        <Text style={styles.subtitle}>
          Your transaction have been saved and added to your financial records
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => alert('View Transaction details')}
        >
          <Text style={styles.primaryButtonText}>View Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => alert('View Ledger screen')}
        >
          <Text style={styles.secondaryButtonText}>View Ledger</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.returnButton} 
          onPress={() => router.push('/dashboard')}
        >
          <Text style={styles.returnButtonText}>Return to dashboard</Text>
        </TouchableOpacity>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0b4f8c',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: '#0b4f8c',
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#0b4f8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#0d9488',
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#0d9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  returnButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  returnButtonText: {
    color: '#0b4f8c',
    fontSize: 14,
    fontWeight: '700',
  },
});