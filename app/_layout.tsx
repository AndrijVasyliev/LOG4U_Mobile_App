import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch((reason) =>
  /* reloading the app might trigger some race conditions, ignore them */
  console.log('Error in prevent splash screen', reason),
);

import '../utils/abortSignal';
import { startLocation } from '../utils/location';
import { COLORS, icons, STORAGE_USER_NAME } from '../constants';
import { Image, StatusBar, Text, TouchableOpacity } from 'react-native';
import HeaderLogo from '../components/common/headerLogo';

startLocation().catch((reason) =>
  console.log('Error starting location from start', reason),
);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(login)',
};

export default function RootLayout() {
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
}

const Layout = () => {
  const [userName, setUserName] = React.useState<string>('');

  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_USER_NAME)
      .then((username) => {
        username && setUserName(username);
      })
      .catch(() => {
        return;
      });
  }, []);

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: COLORS.backgroung,
            paddingTop: -insets.top,
            paddingBottom: -insets.bottom,
          }}
        >
          <Stack>
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
                headerRight: () => (
                  <>
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {} /*handleToggleUserMenu*/}
                    >
                      <Image
                        source={icons.AccountCircle}
                        resizeMode="contain"
                        style={{ resizeMode: 'contain', height: 20, width: 20 }}
                      />
                    </TouchableOpacity>
                    <Text style={{ color: COLORS.white }}>{userName}</Text>
                  </>
                ),
                headerTitle: '',
              }}
            />
          </Stack>
        </SafeAreaView>
      </ToastProvider>
    </SafeAreaProvider>
  );
};
