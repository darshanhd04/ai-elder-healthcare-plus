import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.log('ℹ️ Emulator detected – skipping push notifications');
      return null;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('❌ Notification permission denied');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('📱 Push Token:', token);

    return token;
  } catch (e) {
    console.log('⚠️ Push error:', e.message);
    return null;
  }
}
