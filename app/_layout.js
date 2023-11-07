import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { startLocation } from '../utils/location';

SplashScreen.preventAutoHideAsync();

startLocation();

const Layout = () => {
  return (
    <SafeAreaProvider>
      <RootSiblingParent>
        <Stack initialRouteName="login">
          <Stack.Screen name="login" />
          <Stack.Screen name="home" />
        </Stack>
      </RootSiblingParent>
    </SafeAreaProvider>
  );
};

export default Layout;
