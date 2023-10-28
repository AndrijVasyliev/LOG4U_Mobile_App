import * as React from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Main, Loads, Truck } from '../components';


import { COLORS, icons, images, SIZES } from '../constants';


const Tab = createBottomTabNavigator();

const Home = () => {
  const [userName, setUserName] = React.useState<string>("");
  const [userMenuVisible, setUserMenuVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    SecureStore.getItemAsync('username')
      .then((userName) => setUserName(userName))
      .catch(() => { return; })
  }, []);

  const router = useRouter();

  const handleToggleUserMenu = () => setUserMenuVisible((prev) => !prev);
  const handleLogout = () => {
    Promise.all([
      SecureStore.deleteItemAsync('username'),
      SecureStore.deleteItemAsync('login'),
      SecureStore.deleteItemAsync('password'),
    ])
      .then(() => {
        setUserMenuVisible((prev) => !prev);
        router.replace('/login');
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.backgroung,
      }}
    >
        <Modal
          animationType="fade"
          transparent={true}
          visible={userMenuVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            handleToggleUserMenu();
          }}>
          <View style={{
            flex: 1,
            backgroundColor: 'yello',
            justifyContent: 'center',
            alignItems: 'center',
            // marginTop: '20%',
          }}>
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
            <View style={{
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
            }}>
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
            <Image source={icons.LOGO_4U_White} style={{resizeMode: 'contain', height: 40, width: 40}}/>
          ),
          headerRight: () => (
            <>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
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
          headerTitle: "",
        }}
      />
      <StatusBar
        barStyle={'light-content'}
      />
      <Tab.Navigator
          initialRouteName="Main"
          screenOptions={{
              headerShown: false,
              tabBarShowLabel: false,
          }}>
        <Tab.Screen
            name="Main"
            options={{
                tabBarLabel: 'Main',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
            }}
            component={Main}
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
        <Tab.Screen
          name="Loads"
          options={{
            tabBarLabel: 'Loads',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
          component={Truck}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Home;
