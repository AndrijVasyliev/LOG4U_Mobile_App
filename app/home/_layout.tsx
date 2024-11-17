import * as React from 'react';
import { StatusBar } from 'react-native';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserData } from '../../hooks/userData';
import {
  isLoadsEnabled,
  isLoadsListEnabled,
  isMapEnabled,
  isProfileEnabled,
  isTrucksEnabled,
} from '../../utils/isEnabled';

const TabLayout = () => {
  const [userData] = useUserData();
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
            href: isProfileEnabled(userData)
              ? { pathname: '/home/profile' }
              : null,
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
            href: isLoadsEnabled(userData) ? { pathname: '/home/loads' } : null,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="format-list-bulleted-square" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="loadsList"
          options={{
            title: 'Loads List',
            href: isLoadsListEnabled(userData)
              ? { pathname: '/home/loadsList' }
              : null,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="format-list-text" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="trucks"
          options={{
            title: 'Trucks',
            href: isTrucksEnabled(userData)
              ? { pathname: '/home/trucks' }
              : null,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="truck"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            href: isMapEnabled(userData) ? { pathname: '/home/map' } : null,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="map-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
