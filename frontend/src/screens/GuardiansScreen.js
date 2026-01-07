import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { supabase } from '../api/supabase';

export default function GuardiansScreen() {
  const [guardians, setGuardians] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuardians();
  }, []);

  async function fetchGuardians() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('guardians')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGuardians(data);
    }

    setLoading(false);
  }

  async function addGuardian() {
    if (!name || !phone) {
      Alert.alert('Missing details', 'Please enter name and phone number');
      return;
    }

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) return;

    const { error } = await supabase.from('guardians').insert([
      {
        user_id: user.id,
        name,
        phone,
      },
    ]);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setName('');
    setPhone('');
    fetchGuardians();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading guardians...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>👨‍👩‍👧 Guardians</Text>
      <Text style={styles.subtitle}>
        People who will be notified if medicines are missed
      </Text>

      {/* Add Guardian Form */}
      <View style={styles.card}>
        <Text style={styles.label}>Guardian Name</Text>
        <TextInput
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addGuardian}
        >
          <Text style={styles.addButtonText}>➕ Add Guardian</Text>
        </TouchableOpacity>
      </View>

      {/* Guardians List */}
      <FlatList
        data={guardians}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No guardians added yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.guardianItem}>
            <Text style={styles.guardianName}>{item.name}</Text>
            <Text style={styles.guardianPhone}>{item.phone}</Text>
          </View>
        )}
      />
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
    fontSize: 16,
    color: '#334155',
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    elevation: 3,
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  guardianItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  guardianName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  guardianPhone: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#64748B',
  },
});
