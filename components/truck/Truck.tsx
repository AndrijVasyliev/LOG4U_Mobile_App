import * as React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

const Truck = () => {
  const router = useRouter();

  return (
    <View>
      <Text>On Truck</Text>
    </View>
  );
};

export default Truck;
