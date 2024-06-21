import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
// import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import '../utils/abortSignal';
import { COLORS } from '../constants';
import { UserDataProvider } from '../providers/userData';
import HeaderLogo from '../components/common/headerLogo';
import HeaderButton from '../components/common/headerButton';

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
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

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
