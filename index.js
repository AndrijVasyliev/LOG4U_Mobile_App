import { startLocation } from './utils/location';
startLocation().catch((reason) =>
  console.log('Error starting location from start', reason),
);

import * as SplashScreen from 'expo-splash-screen';

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch((reason) =>
  /* reloading the app might trigger some race conditions, ignore them */
  console.log('Error in prevent splash screen', reason),
);

// export { default } from 'expo-router/entry';
import 'expo-router/entry';
