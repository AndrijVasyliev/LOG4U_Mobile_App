import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Location from "expo-location";

const origin = 'https://admin-test-lt5d.onrender.com';
const LOCATION_TRACKING = 'location-tracking';
const locationUpdateInterval = 1000 * 60 * 3;

SplashScreen.preventAutoHideAsync();

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

const startLocation = async () => {
  const resf = await Location.requestForegroundPermissionsAsync();
  const resb = await Location.requestBackgroundPermissionsAsync();
  if (resf.status != 'granted' && resb.status !== 'granted') {
    console.log('Permission to access location was denied');
  } else {
    console.log('Permission to access location granted');
    setLocation('P G');
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: locationUpdateInterval,
      distanceInterval: 0,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING,
    );
    setLocationStarted(hasStarted);
    console.log('tracking started?', hasStarted);
  }
};
const stopLocation = async () => {
  const isStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TRACKING,
  );
  if (isStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    setLocationStarted(false);
  }
};

export default Layout;
