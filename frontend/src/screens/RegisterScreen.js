import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { supabase } from '../api/supabase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');

  async function handleRegister() {
    const { error } = await supabase.auth.signUp({ email });
    if (error) alert(error.message);
    else {
      alert('Check email for confirmation');
      navigation.navigate('Login');
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text>Register</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
