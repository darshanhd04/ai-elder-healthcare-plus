import React from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from '../api/supabase';

export default function ProfileScreen({ navigation }) {
  async function logout() {
    await supabase.auth.signOut();
    navigation.navigate('Login');
  }

  return (
    <View style={{padding:16}}>
      <Text style={{fontSize:18}}>Profile</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
