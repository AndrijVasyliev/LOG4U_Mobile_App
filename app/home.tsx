import * as React from 'react';
import {
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Loads, Profile } from '../components';

import { COLORS, icons } from '../constants';
import { encode as btoa } from 'base-64';

const Tab = createBottomTabNavigator();

const origin = 'https://admin-test-lt5d.onrender.com';
const LOCATION_TRACKING = 'location-tracking';
const locationUpdateInterval = 1000 * 60 * 3;

const Home = () => {
  const [locationStarted, setLocationStarted] = React.useState<boolean>(false);
  const [locationStartedAt, setLocationStartedAt] = React.useState<number>(0);
  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [userName, setUserName] = React.useState<string>('');
  const [userMenuVisible, setUserMenuVisible] = React.useState<boolean>(false);
  const [startUpdate, setStartUpdate] = React.useState<string>('');
  const [endUpdate, setEndUpdate] = React.useState<string>('');
  const [location, setLocation] = React.useState<string>('');

  React.useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync('login'),
      SecureStore.getItemAsync('password'),
      SecureStore.getItemAsync('username'),
    ])
      .then(([login, password, username]) => {
        login && setLogin(login);
        password && setPassword(password);
        username && setUserName(username);
      })
      .catch(() => {
        return;
      });
  }, []);

  React.useEffect(() => {
    const start = async () => {
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
    const stop = async () => {
      const isStarted = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TRACKING,
      );
      if (isStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
        setLocationStarted(false);
      }
    };
    if (login && password && !locationStarted) {
      start();
      // return stop;
    }
  }, [login, password, locationStarted]);

  React.useEffect(() => {
    TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
      if (error) {
        console.log('LOCATION_TRACKING task ERROR:', error);
        setLocation('Err');
        return;
      }
      if (data) {
        const { locations } = data as any;
        const lat = locations[0].coords.latitude;
        const long = locations[0].coords.longitude;

        console.log(`${new Date(Date.now()).toLocaleString()}: ${lat},${long}`);
        setLocation(`${lat},${long}`);

        if (login && password) {
          setStartUpdate(`${new Date()}`);
          const headers = new Headers();
          headers.set('Authorization', 'Basic ' + btoa(login + ':' + password));
          headers.set('Accept', 'application/json');
          headers.set('Content-Type', 'application/json');
          return fetch(new URL('/mobileApp/updateTruck', origin), {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              lastLocation: [lat, long],
            }),
          }).then(() => setEndUpdate(`${new Date()}`));
        }
      }
    });
    // TaskManager.isTaskDefined(LOCATION_TRACKING);
    // TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
  }, [locationStarted]);

  const router = useRouter();

  const handleToggleUserMenu = () => setUserMenuVisible((prev) => !prev);
  const handleLogout = () => {
    Promise.all([
      SecureStore.deleteItemAsync('username'),
      SecureStore.deleteItemAsync('login'),
      SecureStore.deleteItemAsync('password'),
    ]).then(() => {
      setUserMenuVisible((prev) => !prev);
      router.replace('/login');
    });
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.backgroung,
        paddingTop: -insets.top,
        paddingBottom: -insets.bottom,
      }}
    >
      <StatusBar barStyle={'light-content'} />
      <Modal
        animationType="fade"
        transparent={true}
        visible={userMenuVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          handleToggleUserMenu();
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.modalBackground,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback onPress={handleToggleUserMenu}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: COLORS.modalBackground,
              }}
            />
          </TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 10,
              padding: 35,
              alignItems: 'center',
              shadowColor: COLORS.black,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View
              style={{
                width: '100%',
                height: 40,
                marginTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 40,
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleLogout}
              >
                <Text style={{ color: COLORS.white }}>LOG OUT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerShadowVisible: false,
          headerLeft: () => (
            <Image
              source={icons.LOGO_4U_White}
              style={{ resizeMode: 'contain', height: 40, width: 40 }}
            />
          ),
          headerRight: () => (
            <>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleToggleUserMenu}
              >
                <Image
                  source={icons.AccountCircle}
                  resizeMode="contain"
                  style={{ resizeMode: 'contain', height: 20, width: 20 }}
                />
              </TouchableOpacity>
              <Text style={{ color: COLORS.white }}>{userName}</Text>
            </>
          ),
          headerTitle: '',
        }}
      />
      <Tab.Navigator
        initialRouteName="Profile"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Profile"
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
          component={Profile}
        />
        <Tab.Screen
          name="Truck"
          options={{
            tabBarLabel: 'Truck',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="truck" color={color} size={size} />
            ),
          }}
          component={Loads}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Home;
