import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { supabase } from '../api/supabase';

export default function ProfileScreen({ navigation }) {
  async function logout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            navigation.replace('Login');
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>
        Manage your account settings
      </Text>

      {/* Profile Card */}
      <View style={styles.card}>
        <Text style={styles.profileLabel}>Account</Text>
        <Text style={styles.profileValue}>
          Elder Healthcare User
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
        activeOpacity={0.9}
      >
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    elevation: 3,
    marginBottom: 30,
  },
  profileLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
  },
  profileValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
