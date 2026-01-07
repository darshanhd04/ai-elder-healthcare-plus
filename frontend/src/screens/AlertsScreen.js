import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import { supabase } from '../api/supabase';

export default function AlertsScreen() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    setLoading(true);

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAlerts(data);
    }

    setLoading(false);
  }

  // ⏳ Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Checking missed medicines...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>🚨 Missed Medicine Alerts</Text>
      <Text style={styles.subtitle}>
        Medicines that were not taken on time
      </Text>

      {/* Alerts List */}
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            🎉 No missed medicines. Keep it up!
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.medicineName}>
                {item.medicine_name}
              </Text>
              <Text style={styles.badge}>MISSED</Text>
            </View>

            <Text style={styles.timeText}>
              ⏰ Missed at:{' '}
              {new Date(item.scheduled_time).toLocaleString()}
            </Text>
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
    fontSize: 15,
    color: '#475569',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#DC2626',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  medicineName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  badge: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 15,
    color: '#475569',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#64748B',
  },
});
