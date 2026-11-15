import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -26, duration: 480, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 480, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bounce]);

  const shadowScale = bounce.interpolate({ inputRange: [-26, 0], outputRange: [0.6, 1] });
  const shadowOpacity = bounce.interpolate({ inputRange: [-26, 0], outputRange: [0.1, 0.28] });

  return (
    <View style={styles.container}>
                  {/* Logo Container */}
      <Animated.View style={[styles.logoBox, { transform: [{ translateY: bounce }] }]}>
        <Image 
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={[styles.logoShadow, { opacity: shadowOpacity, transform: [{ scaleX: shadowScale }] }]} />

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
    marginBottom: 0,
  },
    logoShadow: {
    width: 70,
    height: 10,
    borderRadius: 35,
    backgroundColor: '#9ca3af',
    marginTop: 14,
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