import { useRouter } from 'expo-router';
import * as React from 'react';
import * as Notifications from 'expo-notifications';
import {
  BACKEND_ORIGIN,
  BACKGROUND_NOTIFICATION_TASK,
  SET_APP_DATA_PATH,
  SET_AUTH_PATH,
} from '../constants';
import Constants from 'expo-constants';
import { getDeviceId } from '../utils/deviceId';
import { authFetch } from '../utils/authFetch';

export const useNotifications = () => {
  const router = useRouter();

  React.useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async (notification: Notifications.Notification) => {
        console.log('New incoming notification', notification);
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      },
      handleError: (
        notificationId: string,
        error: Notifications.NotificationHandlingError,
      ) => {
        console.log(
          `Notification ${notificationId} processed with error`,
          error,
        );
      },
      handleSuccess: (notificationId: string) => {
        console.log(`Notification ${notificationId} successfully processed`);
      },
    });

    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK).catch(
      (error) =>
        console.log(`Error registering ${BACKGROUND_NOTIFICATION_TASK}`, error),
    );

    const pushTokenListener = Notifications.addPushTokenListener(
      async (devicePushToken) => {
        console.log('New device push token', devicePushToken);
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          (Constants?.easConfig as any)?.projectId;
        if (!projectId) {
          console.log('Failed to get project id!');
          return;
        }
        const token = await Notifications.getExpoPushTokenAsync({
          projectId,
          devicePushToken,
        }).catch((error) =>
          console.log('Error getting expo push token', error),
        );
        console.log(token);
        if (!token) {
          console.log('Failed to get expo push token!');
          return;
        }
        const deviceId = await getDeviceId();
        if (!deviceId) {
          console.log('Failed to get device Id!');
          return;
        }
        const checkAuthResponse = await authFetch(
          new URL(SET_AUTH_PATH, BACKEND_ORIGIN),
          {
            method: 'PATCH',
            body: JSON.stringify({ deviceId }),
          },
        );
        if (checkAuthResponse?.status !== 200) {
          Notifications.removePushTokenSubscription(pushTokenListener);
          if (checkAuthResponse?.status === 412) {
            console.log('Logged from other device!');
          } else {
            console.log('Some error!');
          }
          return;
        }
        await authFetch(new URL(SET_APP_DATA_PATH, BACKEND_ORIGIN), {
          method: 'PATCH',
          body: JSON.stringify({
            token: token || '',
          }),
        }).catch((error) => console.log('Error updating push token', error));
        console.log('Token updated');
      },
    );

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(JSON.stringify(notification));
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(JSON.stringify(response));
        const routeToFormPush =
          response.notification.request.content?.data?.routeTo;
        if (routeToFormPush) {
          console.log('Setting route search param "routeToFormPush"', routeToFormPush);
          router.setParams({ routeToFormPush });
        }
      });

    return () => {
      Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK).catch(
        (error) =>
          console.log(
            `Error unregistering ${BACKGROUND_NOTIFICATION_TASK}`,
            error,
          ),
      );
      Notifications.removePushTokenSubscription(pushTokenListener);
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
};
