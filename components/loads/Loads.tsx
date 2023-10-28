import * as React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

const Loads = () => {
  const router = useRouter();

  return (
    <View>
      <Text>On Loads</Text>
    </View>
  );
};

export default Loads;
