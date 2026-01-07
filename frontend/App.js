import 'whatwg-fetch';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';


import { enableScreens } from 'react-native-screens';
enableScreens();

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AddMedicineScreen from './src/screens/AddMedicineScreen';
import MedicineDetailScreen from './src/screens/MedicineDetailScreen';
import GuardiansScreen from './src/screens/GuardiansScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AlertsScreen from './src/screens/AlertsScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AddMedicine" component={AddMedicineScreen} />
        <Stack.Screen name="MedicineDetail" component={MedicineDetailScreen} />
        <Stack.Screen name="Guardians" component={GuardiansScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Alerts" component={AlertsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
