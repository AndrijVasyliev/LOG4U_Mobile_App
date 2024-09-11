import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
// import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';

import '../utils/abortSignal';
import {
  BACKEND_ORIGIN,
  BACKGROUND_NOTIFICATION_TASK,
  COLORS,
  SET_APP_DATA_PATH,
  SET_AUTH_PATH,
} from '../constants';
import { UserDataProvider } from '../providers/userData';
import HeaderLogo from '../components/common/headerLogo';
import HeaderButton from '../components/common/headerButton';
import { authFetch } from '../utils/authFetch';
import { getDeviceId } from '../utils/deviceId';

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch((reason) =>
  /* reloading the app might trigger some race conditions, ignore them */
  console.log('Error in prevent splash screen', reason),
);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(login)',
};

const RootLayout = () => {
  const [loaded, error] = Font.useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  React.useEffect(() => {
    if (error) throw error;
  }, [error]);

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <Layout />;
};

const Layout = () => {
  const router = useRouter();

  /*React.useEffect(() => {
    Linking.addEventListener('url', (event) =>
      console.log('LINK', JSON.stringify(event)),
    );
  }, []);*/

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
        const routeTo = response.notification.request.content?.data?.routeTo;
        if (routeTo) {
          router.push(routeTo);
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
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <SafeAreaView
          style={{
            ...styles.container,
            paddingTop: -insets.top,
            paddingBottom: -insets.bottom,
          }}
        >
          <UserDataProvider>
            <Stack initialRouteName="(login)">
              <Stack.Screen
                name="(login)/index"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="home"
                options={{
                  headerStyle: { backgroundColor: COLORS.primary },
                  headerShadowVisible: false,
                  headerLeft: () => <HeaderLogo />,
                  headerRight: () => <HeaderButton />,
                  headerTitle: '',
                }}
              />
            </Stack>
          </UserDataProvider>
        </SafeAreaView>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroung,
    flex: 1,
  },
});

export default RootLayout;
