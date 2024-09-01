import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import Constants from 'expo-constants';
import { PermissionStatus } from 'expo-modules-core/src/PermissionsInterface';
import { BACKGROUND_NOTIFICATION_TASK } from '../constants';

const registerForPushNotificationsAsync = async (): Promise<string | void> => {
  let token: Notifications.ExpoPushToken;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== PermissionStatus.GRANTED) {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== PermissionStatus.GRANTED) {
      console.log('Failed to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      (Constants?.easConfig as any)?.projectId;
    if (!projectId) {
      console.log('Failed to get project id!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
};

if (!TaskManager.isTaskDefined(BACKGROUND_NOTIFICATION_TASK)) {
  console.log('Registering: ', BACKGROUND_NOTIFICATION_TASK);
  TaskManager.defineTask<Notifications.PushNotificationTrigger>(
    BACKGROUND_NOTIFICATION_TASK,
    async ({ data, error, executionInfo }) => {
      console.log(
        `${new Date().toISOString()}: Notification task`,
        executionInfo,
      );

      if (error) {
        console.log('Notification task ERROR:', error);
        return;
      }
      if (data) {
        const { type, payload, remoteMessage } = data;
        console.log(
          `Notification data of type ${type}`,
          payload,
          remoteMessage,
        );
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'LOG4U',
            body: `${JSON.stringify(data)}`,
          },
          trigger: null,
        });
      }
      return;
    },
  );
} else {
  console.log('Already registered: ', BACKGROUND_NOTIFICATION_TASK);
}

export { registerForPushNotificationsAsync };
