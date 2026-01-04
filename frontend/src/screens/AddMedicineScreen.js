import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../api/supabase';

export default function AddMedicineScreen({ navigation }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [dosage, setDosage] = useState('');

  async function saveMedicine() {
    if (!name || !time || !dosage) {
      Alert.alert('Please fill all fields');
      return;
    }

    const { error } = await supabase.from('medicines').insert([
      {
        name,
        time,
        dosage,
      },
    ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Medicine added');
      navigation.goBack();
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Medicine Name</Text>
      <TextInput value={name} onChangeText={setName} />

      <Text>Time</Text>
      <TextInput value={time} onChangeText={setTime} />

      <Text>Dosage</Text>
      <TextInput value={dosage} onChangeText={setDosage} />

      <Button title="Save Medicine" onPress={saveMedicine} />
    </View>
  );
}
