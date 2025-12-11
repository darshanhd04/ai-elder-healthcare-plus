import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { supabase } from '../api/supabase';
import MedicineCard from '../components/MedicineCard';

export default function DashboardScreen({ navigation }) {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetchMeds();
  }, []);

  async function fetchMeds() {
    const user = supabase.auth.user();
    if (!user) return;
    const { data } = await supabase.from('medicines').select('*').eq('user_id', user.id);
    setMeds(data || []);
  }

  return (
    <View style={{padding:16}}>
      <Text style={{fontSize:20}}>Today's Medicines</Text>
      <FlatList data={meds} keyExtractor={i=>i.id} renderItem={({item})=>(
        <MedicineCard medicine={item} onPress={() => navigation.navigate('MedicineDetail', { id: item.id })} />
      )} />
      <Button title="Add Medicine" onPress={() => navigation.navigate('AddMedicine')} />
      <View style={{height:8}} />
      <Button title="Guardians" onPress={() => navigation.navigate('Guardians')} />
      <View style={{height:8}} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
}
