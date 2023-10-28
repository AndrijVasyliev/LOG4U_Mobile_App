import * as React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

const Main = () => {
  const router = useRouter();

  return (
    <View>
      <Text>On Main</Text>
    </View>
  );
};

export default Main;
