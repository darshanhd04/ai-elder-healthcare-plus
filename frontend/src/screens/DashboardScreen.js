import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { supabase } from '../api/supabase';

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    console.log('AUTH USER:', authData?.user);

    if (!authData?.user) {
      setLoading(false);
      return;
    }

    setUserEmail(authData.user.email);

    const { data, error } = await supabase
      .from('medicines')
      .select('*');

    if (!error && data) {
      setCount(data.length);
    }

    setLoading(false);
  }

  // ⏳ Loading screen
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading Dashboard...</Text>
      </View>
    );
  }

  // 🚨 Not logged in (temporary safety)
  if (!userEmail) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>User not logged in</Text>
        <Button title="Go to Login" onPress={() => navigation.replace('Login')} />
      </View>
    );
  }

  // ✅ Normal dashboard
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Welcome: {userEmail}
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Medicines Loaded: {count}
      </Text>

      <Button
        title="Add Medicine"
        onPress={() => navigation.navigate('AddMedicine')}
      />
    </View>
  );
}
