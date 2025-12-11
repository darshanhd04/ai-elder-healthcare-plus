import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { supabase } from '../api/supabase';

export default function AddMedicineScreen({ navigation }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timesText, setTimesText] = useState('');

  const handleAdd = async () => {
    try {
      const user = supabase.auth.user();
      if (!user) throw new Error('Not logged in');

      const parts = timesText.split(',').map(s => s.trim()).filter(Boolean);
      const now = new Date();
      const times = parts.map(p => {
        if (/^\d{2}:\d{2}$/.test(p)) {
          const [hh, mm] = p.split(':');
          const d = new Date(now);
          d.setHours(parseInt(hh,10), parseInt(mm,10), 0, 0);
          return d.toISOString();
        } else {
          return new Date(p).toISOString();
        }
      });

      await supabase.from('medicines').insert([{
        user_id: user.id,
        name,
        dosage,
        times
      }]);
      alert('Medicine added');
      navigation.goBack();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={{padding:16}}>
      <Text style={{fontSize:18}}>Add Medicine</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{borderWidth:1,padding:8,marginVertical:8}} />
      <TextInput placeholder="Dosage" value={dosage} onChangeText={setDosage} style={{borderWidth:1,padding:8,marginVertical:8}} />
      <TextInput placeholder="Times (HH:MM, comma separated)" value={timesText} onChangeText={setTimesText} style={{borderWidth:1,padding:8,marginVertical:8}} />
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
}
