import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <Stack initialRouteName="login/login">
          <Stack.Screen name="login/login" />
          <Stack.Screen name="home/home" />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default Layout;
