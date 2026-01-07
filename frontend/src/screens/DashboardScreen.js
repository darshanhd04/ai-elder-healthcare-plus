import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { supabase } from '../api/supabase';

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', init);
    return unsubscribe;
  }, [navigation]);

  async function init() {
    setLoading(true);

    // 🔐 Auth check
    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData?.user) {
      setLoading(false);
      return;
    }

    setUserEmail(authData.user.email);

    // 🔔 Reminder check (Edge Function)
    await supabase.functions.invoke('detect-missed');

    // 📦 Fetch medicines
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMedicines(data);
    }

    setLoading(false);
  }

  /* ⏳ Loading */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  /* 🚨 Not logged in */
  if (!userEmail) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Session expired</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ✅ Dashboard */
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Good Day 👋</Text>
        <Text style={styles.email}>{userEmail}</Text>
      </View>

      {/* Medicine count */}
      <Text style={styles.sectionTitle}>
        Your Medicines ({medicines.length})
      </Text>

      {/* Medicine list */}
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No medicines added yet.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('MedicineDetail', { medicine: item })
            }
          >
            <Text style={styles.medicineName}>{item.name}</Text>
            <View style={styles.row}>
              <Text style={styles.medicineInfo}>🕒 {item.time}</Text>
              <Text style={styles.medicineInfo}>💊 {item.dosage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Actions */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('AddMedicine')}
      >
        <Text style={styles.buttonText}>➕ Add Medicine</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Alerts')}
      >
        <Text style={styles.secondaryButtonText}>🔔 View Alerts</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#334155',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#DC2626',
  },
  header: {
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  email: {
    fontSize: 14,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1E293B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medicineInfo: {
    fontSize: 14,
    color: '#475569',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    color: '#64748B',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: '#E0E7FF',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: '600',
  },
});
