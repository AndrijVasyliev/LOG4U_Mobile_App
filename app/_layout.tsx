import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch((reason) =>
  /* reloading the app might trigger some race conditions, ignore them */
  console.log('Error in prevent splash screen', reason),
);

import '../utils/abortSignal';
import { startLocation } from '../utils/location';
startLocation().catch((reason) =>
  console.log('Error starting location from start', reason),
);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'login',
};

const Layout = () => {
  React.useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default Layout;
