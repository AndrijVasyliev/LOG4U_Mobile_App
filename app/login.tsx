import * as React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64';

import { startLocation } from '../utils/location';
import {
  BACKEND_ORIGIN,
  COLORS,
  FETCH_TIMEOUT,
  icons,
  PATCH_AUTH_PATH,
  PERMISSION_DENIED,
  PERMISSION_GRANTED,
} from '../constants';
import { getDeviceId } from '../utils/deviceId';

const Login = () => {
  const [prominentDisclosureVisible, setProminentDisclosureVisible] =
    React.useState<boolean>(false);
  const [pdStatus, setPDStatus] = React.useState<string>('');
  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string>('');
  const [isAutentificating, setIsAutentificating] =
    React.useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Login screen is focused');
      if (!pdStatus) {
        AsyncStorage.getItem('pdstatus').then((pdstatus) =>
          setPDStatus(pdstatus),
        );
      }
      return () => {
        console.log('Login screen is unfocused');
      };
    }, [pdStatus]),
  );

  React.useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('login'),
      AsyncStorage.getItem('password'),
      AsyncStorage.getItem('pdstatus'),
    ])
      .then(([login, password, pdstatus]) => {
        if (Platform.OS !== 'android' && !pdstatus) {
          setPDStatus(PERMISSION_GRANTED);
          AsyncStorage.setItem('pdstatus', PERMISSION_GRANTED);
        } else if (!pdstatus) {
          setProminentDisclosureVisible(true);
        } else {
          setPDStatus(pdstatus);
        }
        if (login && password) {
          setLogin(login);
          setPassword(password);
          setPDStatus(pdstatus);
          if (pdstatus) {
            setTimeout(() => handleClick(null, login, password, pdstatus), 1);
          }
        }
      })
      .catch(() => {
        return;
      });
  }, []);

  const router = useRouter();

  const handleLoginChange = (text) => {
    setLoginError((prev) => (prev ? '' : prev));
    setLogin(text);
  };
  const handlePasswordChange = (text) => {
    setLoginError((prev) => (prev ? '' : prev));
    setPassword(text);
  };
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleClick = (event, log = login, pas = password, pds = pdStatus) => {
    if (!log || !pas) {
      return setLoginError(
        `${!log ? 'Login' : ''}${!log && !pas ? ' and ' : ''}${
          !pas ? 'Password' : ''
        } must not be empty!`,
      );
    }
    console.log('PD Status', pds, log, pas);
    setIsAutentificating(true);
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(log + ':' + pas));
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    getDeviceId(pds).then((deviceId) =>
      fetch(new URL(PATCH_AUTH_PATH, BACKEND_ORIGIN), {
        method: 'PATCH',
        headers,
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
        body: JSON.stringify({
          deviceId,
        }),
      })
        .catch(() => {
          setLoginError('Some network problem');
          setIsAutentificating(false);
        })
        .then((response) => {
          console.log(
            'Login response status code: ',
            response && response.status,
          );
          if (response && response.status === 200) {
            return response
              .json()
              .then((driver) =>
                AsyncStorage.setItem('username', driver.fullName),
              )
              .then(() => AsyncStorage.setItem('login', log))
              .then(() => AsyncStorage.setItem('password', pas))
              .then(() => requestTrackingPermissionsAsync())
              .then(({ status }) => {
                if (
                  status === PERMISSION_GRANTED &&
                  pds === PERMISSION_GRANTED
                ) {
                  console.log('Permission to track data is here');
                  return startLocation(true).catch((reason) =>
                    console.log('Error starting location from login', reason),
                  );
                }
              })
              .then(() => {
                setIsAutentificating(false);
                router.replace('/home');
              });
          } else {
            setLoginError('Login or Password is incorrect');
            setIsAutentificating(false);
          }
        })
        .catch(() => {
          setLoginError('Something went wrong');
          setIsAutentificating(false);
        }),
    );
    return;
  };

  const handleGrant = () => {
    setProminentDisclosureVisible(false);
    setPDStatus(PERMISSION_GRANTED);
    AsyncStorage.setItem('pdstatus', PERMISSION_GRANTED);
    return;
  };
  const handleReject = () => {
    setProminentDisclosureVisible(false);
    setPDStatus(PERMISSION_DENIED);
    AsyncStorage.setItem('pdstatus', PERMISSION_DENIED);
    return;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={prominentDisclosureVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
          // handleToggleUserMenu();
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
          <View
            style={{
              backgroundColor: COLORS.white,
              height: '45%',
              width: '90%',
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
              flexDirection: 'column',
            }}
          >
            <ScrollView
              style={{
                flexDirection: 'column',
                width: '100%',
              }}
              contentContainerStyle={{
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                This app collects location data to enable 4U Logistics to
                provide most suitable orders for you, even when the app is
                closed or not in use.
              </Text>
              <Text
                style={{
                  paddingTop: 20,
                  fontSize: 18,
                  color: COLORS.link,
                }}
                onPress={() =>
                  Linking.openURL('https://mobile.4u-logistics.com/pp.html')
                }
              >
                You can see the full text of our Privacy Policy here.
              </Text>
            </ScrollView>
            <View
              style={{
                height: 40,
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  width: '45%',
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
                  onPress={handleReject}
                >
                  <Text style={{ color: COLORS.white }}>Deny</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '45%',
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
                  onPress={handleGrant}
                >
                  <Text style={{ color: COLORS.white }}>Allow</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.white },
          headerShadowVisible: false,
          headerTitle: '',
        }}
      />
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Image
            source={icons.LOGO_4U_Red}
            style={{
              alignSelf: 'center',
              resizeMode: 'contain',
              height: 200,
            }}
          />
        </View>
        <View
          style={{
            flex: 3,
            flexDirection: 'column',
            paddingLeft: '5%',
            paddingRight: '5%',
          }}
        >
          <Text style={{ fontSize: 25 }}>Login</Text>
          <Text>Enter your credentials to login</Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              height: 40,
              borderRadius: 10,
              borderStyle: 'solid',
              borderColor: COLORS.gray,
              borderWidth: 1,
              marginTop: 5,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <TextInput
              style={{
                paddingLeft: 5,
                width: '95%',
                height: 40,
              }}
              value={login}
              onChangeText={handleLoginChange}
              placeholder="Enter Login"
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              height: 40,
              borderRadius: 10,
              borderStyle: 'solid',
              borderColor: COLORS.gray,
              borderWidth: 1,
              marginTop: 5,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <TextInput
              style={{
                paddingLeft: 5,
                width: '92%',
                height: 40,
              }}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="Enter Password"
            />
            <TouchableOpacity onPress={handleShowPassword}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                color={COLORS.black}
                size={20}
              />
            </TouchableOpacity>
          </View>
          {!loginError ? null : (
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Text style={{ color: COLORS.red }}>{loginError}</Text>
            </View>
          )}
          <View
            style={{
              flex: 1,
              width: '100%',
              height: 40,
              marginTop: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                width: '100%',
                height: 40,
                backgroundColor: COLORS.primary,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleClick}
            >
              <Text style={{ color: COLORS.white }}>LOG IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Spinner visible={isAutentificating} textContent={'Logging in...'} />
    </SafeAreaView>
  );
};

export default Login;
