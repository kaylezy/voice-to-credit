import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('../onboarding'); 
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Container */}
      <View style={styles.logoBox}>
        <Image 
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* App Title & Subtitle */}
      <View style={styles.textContainer}>
        <View style={styles.brandRow}>
          <Text style={styles.tradeText}>TRADE</Text>
          <Text style={styles.padiText}>PADI</Text>
        </View>
        <Text style={styles.subtitle}>Your Business, Your Records, Your Growth</Text>
      </View>

      {/* Loading Indicator */}
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0b4f8c" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoBox: {
    width: 110,
    height: 110,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 30,
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  textContainer: {
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tradeText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0b4f8c',
    letterSpacing: 1,
  },
  padiText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#e88d2d',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0b4f8c',
    textAlign: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
  },
});