import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { supabase } from '../api/supabase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({ email });
      if (error) throw error;
      alert('Check email to confirm. Then login.');
      navigation.navigate('Login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={{padding:16}}>
      <Text style={{fontSize:18}}>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{borderWidth:1,padding:8,marginVertical:8}} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
