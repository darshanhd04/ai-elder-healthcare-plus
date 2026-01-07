import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../api/supabase';

export default function AddMedicineScreen({ navigation }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');      // e.g. "02:10 PM"
  const [dosage, setDosage] = useState('');

  async function saveMedicine() {
    if (!name || !time || !dosage) {
      Alert.alert('Missing details', 'Please fill all fields');
      return;
    }

    try {
      // 🔁 Convert time string → ISO datetime
      const [hourMin, ampm] = time.trim().split(' ');
      let [hours, minutes] = hourMin.split(':').map(Number);

      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const scheduled = new Date();
      scheduled.setHours(hours, minutes, 0, 0);

      const scheduledISO = scheduled.toISOString();

      const { error } = await supabase.from('medicines').insert([
        {
          name,
          dosage,
          time,                  // UI display only
          times: [scheduledISO], // 🔔 Reminder engine
        },
      ]);

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      Alert.alert('Success', 'Medicine added successfully');
      navigation.goBack();

    } catch (err) {
      Alert.alert(
        'Invalid Time',
        'Please use format HH:MM AM or PM (e.g. 02:10 PM)'
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>➕ Add Medicine</Text>
        <Text style={styles.subtitle}>
          Enter medicine details for reminders
        </Text>

        {/* Medicine Name */}
        <Text style={styles.label}>Medicine Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Paracetamol"
          autoCapitalize="words"
          style={styles.input}
        />

        {/* Time */}
        <Text style={styles.label}>Time</Text>
        <TextInput
          value={time}
          onChangeText={setTime}
          placeholder="02:10 PM"
          keyboardType="default"
          style={styles.input}
        />
        <Text style={styles.helper}>
          Use format: HH:MM AM/PM
        </Text>

        {/* Dosage */}
        <Text style={styles.label}>Dosage</Text>
        <TextInput
          value={dosage}
          onChangeText={setDosage}
          placeholder="1 Tablet"
          autoCapitalize="sentences"
          style={styles.input}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveMedicine}
          activeOpacity={0.9}
        >
          <Text style={styles.saveButtonText}>💾 Save Medicine</Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: '#64748B',
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    color: '#334155',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    elevation: 2,
  },
  helper: {
    fontSize: 12,
    color: '#64748B',
    marginTop: -8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#16A34A',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    fontSize: 15,
    color: '#475569',
  },
});
