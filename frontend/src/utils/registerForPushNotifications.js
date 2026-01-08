import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../api/supabase';

export async function registerForPushNotifications() {
  try {
    // 🔐 Check permission
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } =
        await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Notification permission not granted');
      return;
    }

    // 📱 Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const expoPushToken = tokenData.data;

    console.log('🔔 PUSH TOKEN:', expoPushToken);

    // 🔐 Get logged-in user
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) return;

    // 💾 Save token to Supabase
    await supabase.from('push_tokens').upsert({
      user_id: user.id,
      token: expoPushToken,
      platform: Platform.OS,
    });

  } catch (err) {
    console.log('Push register error:', err);
  }
}
