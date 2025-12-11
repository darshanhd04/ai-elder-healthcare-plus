import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { supabase } from '../api/supabase';

export default function GuardiansScreen() {
  const [list, setList] = useState([]);
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');

  useEffect(()=>{ fetchGuardians(); }, []);

  async function fetchGuardians(){
    const user = supabase.auth.user();
    if(!user) return;
    const { data } = await supabase.from('guardians').select('*').eq('user_id', user.id);
    setList(data || []);
  }

  async function addGuardian(){
    const user = supabase.auth.user();
    if(!user) return;
    await supabase.from('guardians').insert([{ user_id: user.id, name, phone }]);
    setName(''); setPhone('');
    fetchGuardians();
  }

  return (
    <View style={{padding:16}}>
      <Text style={{fontSize:18}}>Guardians</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{borderWidth:1,padding:8,marginVertical:8}} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={{borderWidth:1,padding:8,marginVertical:8}} />
      <Button title="Add Guardian" onPress={addGuardian} />
      <FlatList data={list} keyExtractor={i=>i.id} renderItem={({item})=>(
        <View style={{padding:8,borderBottomWidth:1}}>
          <Text>{item.name} — {item.phone}</Text>
        </View>
      )} />
    </View>
  );
}
