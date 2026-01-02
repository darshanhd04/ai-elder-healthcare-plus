import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../api/supabase';

export default function AddMedicineScreen({ navigation }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timesText, setTimesText] = useState('');

  const handleAdd = async () => {
    try {
      // ✅ Supabase v2 user fetch
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('User not logged in');
      }

      if (!name || !dosage || !timesText) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }

      // Convert "08:00, 14:00" → ISO timestamps
      const parts = timesText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const now = new Date();

      const times = parts.map(p => {
        if (/^\d{2}:\d{2}$/.test(p)) {
          const [hh, mm] = p.split(':');
          const d = new Date(now);
          d.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
          return d.toISOString();
        } else {
          return new Date(p).toISOString();
        }
      });

      const { error } = await supabase
        .from('medicines')
        .insert([
          {
            user_id: user.id,
            name,
            dosage,
            times
          }
        ]);

      if (error) throw error;

      Alert.alert('Success', 'Medicine added successfully');
      navigation.goBack();

    } catch (err) {
      Alert.alert('Error', err.message);
      console.error(err);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>
        Add Medicine
      </Text>

      <TextInput
        placeholder="Medicine Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Dosage (e.g. 1 tablet)"
        value={dosage}
        onChangeText={setDosage}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Times (HH:MM, comma separated)"
        value={timesText}
        onChangeText={setTimesText}
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />

      <Button title="Add Medicine" onPress={handleAdd} />
    </View>
  );
}
