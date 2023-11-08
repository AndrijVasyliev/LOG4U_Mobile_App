import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { startLocation } from '../utils/location';

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const Layout = () => {
  const [canShow, setCanShow] = React.useState<boolean>(false);
  const router = useRouter();
  React.useEffect(() => {
    const start = async () => {
      try {
        await startLocation();
      } catch (error) {
        console.log('Error, while startring: ', error);
      } finally {
        setCanShow(true);
      }
    };
    start();
  }, []);
  React.useEffect(() => {
    if (canShow) {
      (async () => {
        await SplashScreen.hideAsync();
        router.replace('/login');
      })();
    }
  }, [canShow]);

  if (!canShow) {
    return null;
  }

  return canShow ? (
    <SafeAreaProvider>
      <ToastProvider>
        <Stack initialRouteName="login">
          <Stack.Screen name="login" />
          <Stack.Screen name="home" />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  ) : null;
};

export default Layout;
