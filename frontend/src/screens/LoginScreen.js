import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { supabase } from '../api/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else {
      alert('Check your email');
      navigation.navigate('Dashboard');
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
