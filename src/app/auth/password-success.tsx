import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.replace('../(auth)/login')}>
          <Ionicons name="close" size={22} color="#0b4f8c" />
        </TouchableOpacity>

      
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: '../../../assets/images/Celebration Badge Container (1).png' }} 
            style={styles.successImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Details */}
        <Text style={styles.title}>Password changed successfully</Text>
        <Text style={styles.subtitle}>Your password have been changed successfully</Text>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => router.replace('../auth/login')}
        >
          <Text style={styles.primaryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
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
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successImage: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0b4f8c',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: '#0b4f8c',
    width: '100%',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0b4f8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});