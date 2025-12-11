import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from '../api/supabase';

export default function MedicineDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [med, setMed] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('medicines').select('*').eq('id', id).single();
      setMed(data);
    })();
  }, []);

  const mark = async (status, scheduled_key) => {
    const user = supabase.auth.user();
    await supabase.from('medicine_logs').insert([{
      user_id: user.id,
      medicine_id: id,
      status,
      scheduled_key,
      timestamp: new Date().toISOString()
    }]);
    alert('Marked ' + status);
    navigation.goBack();
  };

  if (!med) return <View style={{padding:16}}><Text>Loading...</Text></View>;

  return (
    <View style={{padding:16}}>
      <Text style={{fontSize:18}}>{med.name}</Text>
      <Text>Dosage: {med.dosage}</Text>
      <Text>Times:</Text>
      {(med.times || []).map((t,idx) => (
        <View key={idx} style={{marginVertical:8}}>
          <Text>{t}</Text>
          <Button title="Mark Taken" onPress={() => mark('taken', `${med.user_id}|${id}|${t}`)} />
          <View style={{height:6}} />
          <Button title="Mark Missed" onPress={() => mark('missed', `${med.user_id}|${id}|${t}`)} />
        </View>
      ))}
    </View>
  );
}
