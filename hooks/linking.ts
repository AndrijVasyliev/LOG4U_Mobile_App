import * as React from 'react';
import * as Linking from 'expo-linking';

export const useLinking = () => {
  React.useEffect(() => {
    Linking.addEventListener('url', (event) =>
      console.log('LINK', JSON.stringify(event)),
    );
  }, []);
};
