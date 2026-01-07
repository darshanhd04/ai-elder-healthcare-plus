import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>AI Elder Healthcare Plus</Text>
      <Text style={styles.subtitle}>
        Smart medicine reminders for better health
      </Text>

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.9}
      >
        <Text style={styles.primaryButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Register')}
        activeOpacity={0.9}
      >
        <Text style={styles.secondaryButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E0E7FF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    width: '80%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1D4ED8',
    fontSize: 17,
    fontWeight: '600',
  },
});
