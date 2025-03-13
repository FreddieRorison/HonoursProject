import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Push notifications only work on physical devices.');
    return null;
  }

  // Request permission
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications was denied!');
    return null;
  }

  try {
    // Get Expo Push Token
    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId: "03b0d7ed-39d6-4acb-a9e2-8859cdaf0822"
    });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}

 export default function useNotifications() {
  useEffect(() => {
    const jwt = AsyncStorage.getItem('jwt')
    if (!jwt) return;
    const storeToken = async () => {
      try {
        if (!jwt) {
          console.warn("JWT token not found in storage.");
          return;
        }

        const token = await registerForPushNotificationsAsync();
        if (!token) {
          console.warn("Push notification token retrieval failed.");
          return;
        }

        const response = await fetch("http://192.168.0.182:8080/api/registerNotification", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jwt, notificationToken: token }),
        });

        if (!response.ok) {
          console.error("Failed to register notification token:", await response.text());
        } else {
          console.log("Notification token registered successfully.");
        }
      } catch (err) {
        console.error("Error storing notification token:", err);
      }
    };

    storeToken();

    // Handle foreground notifications
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    // Handle user interaction with notifications
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User interacted with notification:', response);
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, [jwt]);
}
