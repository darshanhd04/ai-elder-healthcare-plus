import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase } from './api/supabase';

/**
 * Register device for push notifications and save token to Supabase push_tokens table.
 * Requires user to be logged in (supabase.auth.user()).
 */
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;
  console.log('Expo Push Token:', token);

  try {
    const user = supabase.auth.user();
    if (user) {
      await supabase.from('push_tokens').upsert([{ user_id: user.id, token }], { onConflict: ['token'] });
    } else {
      console.log('No user logged in to save token');
    }
  } catch (err) {
    console.error('Failed to save push token', err.message);
  }

  return token;
}
