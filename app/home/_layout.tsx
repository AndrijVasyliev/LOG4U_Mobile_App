import * as React from 'react';
import { StatusBar } from 'react-native';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TabLayout = () => {
  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="loads"
          options={{
            title: 'Loads',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="truck" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
