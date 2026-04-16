import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@config/firebase';
import Constants from 'expo-constants';

export const setupNotifications = async () => {
  if (!Device.isDevice) {
    console.log('Must use physical device for push notifications');
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.warn('expo-notifications: No EAS projectId configured. Push tokens unavailable in Expo Go.');
      return;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;

    return token;
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};

export const savePushToken = async (userId: string, token: string) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      pushToken: token,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error saving push token:', error);
  }
};

export const scheduleJobReminder = async (jobId: string, scheduledDate: Date) => {
  try {
    // Schedule notification 1 hour before job
    const oneHourBefore = new Date(scheduledDate.getTime() - 60 * 60 * 1000);
    
    if (oneHourBefore <= new Date()) {
      return; // Don't schedule if time has already passed
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Upcoming Job Reminder',
        body: 'You have a job starting in 1 hour',
        data: { jobId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: oneHourBefore,
      },
    });

    // Schedule notification morning of job
    const morningOf = new Date(scheduledDate);
    morningOf.setHours(8, 0, 0, 0);
    
    if (morningOf <= new Date()) {
      return; // Don't schedule if time has passed
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Job Today',
        body: 'You have a job scheduled for today',
        data: { jobId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: morningOf,
      },
    });
  } catch (error) {
    console.error('Error scheduling job reminder:', error);
  }
};

export const sendPushNotification = async (
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};
