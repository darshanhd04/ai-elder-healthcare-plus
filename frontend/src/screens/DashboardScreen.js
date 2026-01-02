import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { supabase } from '../api/supabase';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    console.log('Dashboard mounted');
    loadMedicines();
  }, []);

  async function loadMedicines() {
    try {
      console.log('Fetching medicines...');
      
      const { data, error } = await supabase
        .from('medicines')
        .select('*');

      console.log('Supabase response:', data, error);

      if (error) {
        setErrorText(error.message);
      } else {
        setMedicines(data || []);
      }
    } catch (err) {
      console.log('Caught error:', err);
      setErrorText('Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading medicines...</Text>
      </View>
    );
  }

  if (errorText) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {errorText}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Medicines Loaded: {medicines.length}</Text>
    </View>
  );
}
