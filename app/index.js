import * as React from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

export default function Index() {
  React.useEffect(() => {
    (async () => {
      await SplashScreen.hideAsync();
    })();
  }, []);
  return <Redirect href="/login" />;
}
