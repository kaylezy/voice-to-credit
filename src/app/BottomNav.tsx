import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === '/dashboard';
  const isLedger = pathname === '/ledger';
  const isFinance = pathname === '/finance';
  const isProfile = pathname === '/profile';

  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.push('/dashboard')}
      >
        <Ionicons 
          name={isHome ? "home" : "home-outline"} 
          size={22} 
          color={isHome ? "#0b4f8c" : "#6b7280"} 
        />
        <Text style={[styles.navText, isHome && styles.activeText]}>Home</Text>
      </TouchableOpacity>

      {/* Ledger Tab */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.push('../ledger')}
      >
        <Ionicons 
          name={isLedger ? "receipt" : "receipt-outline"} 
          size={22} 
          color={isLedger ? "#0b4f8c" : "#6b7280"} 
        />
        <Text style={[styles.navText, isLedger && styles.activeText]}>Ledger</Text>
      </TouchableOpacity>

      {/* Mic Button */}
      <TouchableOpacity 
        style={styles.floatingMicButton} 
        activeOpacity={0.85}
        onPress={() => router.push('/record-transaction')}
      >
        <Ionicons name="mic" size={26} color="#ffffff" />
      </TouchableOpacity>

      {/* Finance Tab */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.push('../finance')}
      >
        <Ionicons 
          name={isFinance ? "stats-chart" : "stats-chart-outline"} 
          size={22} 
          color={isFinance ? "#0b4f8c" : "#6b7280"} 
        />
        <Text style={[styles.navText, isFinance && styles.activeText]}>Finance</Text>
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.push('../profile')}
      >
        <Ionicons 
          name={isProfile ? "person" : "person-outline"} 
          size={22} 
          color={isProfile ? "#0b4f8c" : "#6b7280"} 
        />
        <Text style={[styles.navText, isProfile && styles.activeText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    height: 65,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
    fontWeight: '600',
  },
  activeText: {
    color: '#0b4f8c',
    fontWeight: '800',
  },
  floatingMicButton: {
    top: -18,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0b4f8c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0b4f8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});