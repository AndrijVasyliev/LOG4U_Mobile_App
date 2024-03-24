import * as React from 'react';
import { StatusBar } from 'react-native';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_USER_TYPE } from '../../constants';

const TabLayout = () => {
  const [userType, setUserType] = React.useState<string>('');
  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_USER_TYPE)
      .then((usertype) => {
        usertype && setUserType(usertype);
      })
      .catch(() => {
        return;
      });
  }, []);
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
            href:
              userType === 'Driver' ||
              userType === 'OwnerDriver' ||
              userType === 'CoordinatorDriver'
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
            href:
              userType === 'Driver' ||
              userType === 'OwnerDriver' ||
              userType === 'CoordinatorDriver'
                ? { pathname: '/home/loads' }
                : null,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="truck" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            href:
              userType === 'Owner' || userType === 'OwnerDriver'
                ? { pathname: '/home/map' }
                : null,
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
