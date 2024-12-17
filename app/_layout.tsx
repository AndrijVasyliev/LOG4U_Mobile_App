import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';

import '../utils/abortSignal';
import { COLORS } from '../constants';
import { UserDataProvider } from '../providers/userData';
import HeaderLogo from '../components/app/headerLogo';
import HeaderButton from '../components/app/headerButton';
import { useNotifications } from '../hooks/notifications';
import { useLinking } from '../hooks/linking';

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
      SplashScreen.hideAsync().finally(() =>
        console.log('Splash screen is hidden'),
      );
    }
  }, [loaded]);

  React.useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    ).finally(() => console.log('Orientation locked'));
    return () => {
      ScreenOrientation.unlockAsync().finally(() =>
        console.log('Orientation unlocked'),
      );
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <UserDataProvider>
      <Layout />
    </UserDataProvider>
  );
};

const Layout = () => {
  useNotifications();
  useLinking();

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
          <Stack initialRouteName="(login)/index">
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
