import React from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from '../api/supabase';

export default function MedicineDetailScreen({ route, navigation }) {
  const { medicine } = route.params;

  async function logStatus(status) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('medicine_logs').insert({
      medicine_id: medicine.id,
      user_id: user.id,
      status
    });

    if (status === 'missed') {
      await supabase.from('alerts').insert({
        user_id: user.id,
        medicine_id: medicine.id,
        medicine_name: medicine.name,
        scheduled_time: new Date().toISOString()
      });
    }

    alert(`Marked as ${status}`);
    navigation.goBack();
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20 }}>{medicine.name}</Text>
      <Text>Dosage: {medicine.dosage}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="✅ Taken" onPress={() => logStatus('taken')} />
        <View style={{ height: 10 }} />
        <Button title="❌ Missed" onPress={() => logStatus('missed')} />
      </View>
    </View>
  );
}
