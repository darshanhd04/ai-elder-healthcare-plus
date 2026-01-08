import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants'; // ✅ ADDED

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

    // ✅ FIXED LINE (projectId added)
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;

    console.log('📱 Push Token:', token);
    return token;

  } catch (e) {
    console.log('⚠️ Push error:', e.message);
    return null;
  }
}
