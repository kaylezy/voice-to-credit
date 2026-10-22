import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Record with your voice',
    description: 'Just speak naturally. Our AI understands your business transactions and turns them into your business records',
    image: '../../../assets/images/Tiny people near phone with voice assistant on screen 1.png',
  },
  {
    id: 2,
    title: 'Track your business records',
    description: 'Keep a clear record of your sales, purchases, expenses, receivables and payables – all in one place.',
    image: '../../../assets/images/6493510-removebg-preview 1.png', 
  },
  {
    id: 3,
    title: 'Never miss a payment',
    description: 'Get timely reminders and build a financial history that supports your business growth.',
    image: '../../../assets/images/65Z_2201.w012.n001.25B.p12.25 1.png', 
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('../auth/login');
    }
  };

  const handleSkip = () => {
    router.replace('../auth/login');
  };

  const item = onboardingData[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Illustration Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentIndex === index ? styles.activeDot : styles.inactiveDot
              ]} 
            />
          ))}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        {currentIndex < onboardingData.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  illustration: {
    width: width * 0.85,
    height: 280,
  },
  contentContainer: {
    flex: 0.4,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0b4f8c',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
    marginBottom: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#0b4f8c',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#cbd5e1',
  },
  primaryButton: {
    backgroundColor: '#0b4f8c',
    height: 54,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0b4f8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 14,
  },
  skipButtonText: {
    color: '#0b4f8c',
    fontSize: 15,
    fontWeight: '600',
  },
});