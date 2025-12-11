import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { supabase } from '../api/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Magic link sent to email. Use it to login.');
      navigation.navigate('Dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={{padding:16}}>
      <Text style={{fontSize:20, marginBottom:12}}>AI Elder Healthcare Plus</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{borderWidth:1,padding:8,marginBottom:12}} />
      <Button title="Send Magic Link" onPress={handleLogin} />
      <View style={{height:12}} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
