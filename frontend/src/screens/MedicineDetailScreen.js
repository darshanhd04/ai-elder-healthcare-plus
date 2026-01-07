import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { supabase } from '../api/supabase';

export default function MedicineDetailScreen({ route, navigation }) {
  const { medicine } = route.params;
  const [loading, setLoading] = useState(false);

  async function markStatus(status) {
    try {
      setLoading(true);

      // 🔐 Auth check
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      const user = authData?.user;

      if (authError || !user) {
        Alert.alert('Session expired', 'Please login again');
        setLoading(false);
        return;
      }

      // 1️⃣ Insert into medicine_logs
      const { error: logError } = await supabase
        .from('medicine_logs')
        .insert([
          {
            medicine_id: medicine.id,
            user_id: user.id,
            status,
            taken_at: new Date().toISOString(),
          },
        ]);

      if (logError) {
        Alert.alert('Error', logError.message);
        setLoading(false);
        return;
      }

      // 2️⃣ Update last_action in medicines table
      const { error: updateError } = await supabase
        .from('medicines')
        .update({
          last_action: {
            status,
            at: new Date().toISOString(),
          },
        })
        .eq('id', medicine.id);

      if (updateError) {
        Alert.alert('Error', updateError.message);
        setLoading(false);
        return;
      }

      Alert.alert(
        'Success',
        status === 'taken'
          ? 'Medicine marked as Taken'
          : 'Medicine marked as Missed'
      );

      navigation.goBack();
    } catch (err) {
      console.log('MedicineDetail error:', err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  // ⏳ Loading screen (prevents double click)
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Updating medicine status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Medicine Details</Text>

      {/* Medicine Card */}
      <View style={styles.card}>
        <Text style={styles.medicineName}>{medicine.name}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>🕒 {medicine.time}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dosage</Text>
          <Text style={styles.value}>💊 {medicine.dosage}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.takenButton}
        onPress={() => markStatus('taken')}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>✅ Mark as Taken</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.missedButton}
        onPress={() => markStatus('missed')}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>❌ Mark as Missed</Text>
      </TouchableOpacity>

      {/* Back */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>← Back</Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: '#334155',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0F172A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
  },
  medicineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 15,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#334155',
  },
  takenButton: {
    backgroundColor: '#16A34A',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 15,
  },
  missedButton: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    color: '#475569',
  },
});
