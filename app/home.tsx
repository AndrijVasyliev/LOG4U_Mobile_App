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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Loads, Profile, Logs } from '../components';
import { stopLocation } from '../utils/location';
import { COLORS, icons } from '../constants';

const Tab = createBottomTabNavigator();

const Home = () => {
  const [userName, setUserName] = React.useState<string>('');
  const [login, setLogin] = React.useState<string>('');
  const [userMenuVisible, setUserMenuVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    Promise.all(['Mego2Man', 'Super2Pass'])
      .then(([username, login]) => {
        username && setUserName(username);
        login && setLogin(login);
      })
      .catch(() => {
        return;
      });
  }, []);

  const router = useRouter();

  const handleToggleUserMenu = () => setUserMenuVisible((prev) => !prev);
  const handleLogout = () => {
    Promise.all(['Test', 'Mego2Man', 'Super2Pass', stopLocation()]).then(() => {
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
        {login && login.startsWith('Mego') ? (
          <Tab.Screen
            name="Logs"
            options={{
              tabBarLabel: 'Logs',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="math-log"
                  color={color}
                  size={size}
                />
              ),
            }}
            component={Logs}
          />
        ) : null}
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Home;
