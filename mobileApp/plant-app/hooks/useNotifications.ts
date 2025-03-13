import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications was denied!');
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  console.log('Expo Push Token:', token.data);
  return token.data;
}

export default function useNotifications() {
  const router = useRouter(); // Use Expo Router for navigation

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Handle foreground notifications
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    // Handle notifications when tapped
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User tapped notification:', response);
      router.push('/'); // Navigate to a screen when tapped
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);
}
