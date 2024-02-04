import * as React from 'react';
import { ScrollView, Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64';

import ProminentDisclosureModal from './prominentDisclosure';
import ForceLoginModal from './forceLogin';
import Logo from './logo';
import LoginInput from './loginInput';
import PasswordInput from './passwordInput';
import LoginButton from './loginButton';
import LoginErrorText from './loginErrorText';
import WelcomeText from './wellcomeText';
import { startLocation } from '../../utils/location';
import {
  BACKEND_ORIGIN,
  BUILD_VERSION,
  COLORS,
  FETCH_TIMEOUT,
  SET_AUTH_PATH,
  CHECK_AUTH_PATH,
  PERMISSION_DENIED,
  PERMISSION_GRANTED,
} from '../../constants';
import { getDeviceId } from '../../utils/deviceId';
import { getAppPermissions } from '../../utils/getAppPermissions';

const Login = () => {
  const [prominentDisclosureVisible, setProminentDisclosureVisible] =
    React.useState<boolean>(false);
  const [pdStatus, setPDStatus] = React.useState<string>('');
  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [deviceId, setDeviceId] = React.useState<string>('');
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
      getDeviceId(),
    ])
      .then(([login, password, pdstatus, deviceId]) => {
        setDeviceId(deviceId);
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
            setTimeout(
              () => handleLogin(null, { login, password, pdstatus }),
              1,
            );
          }
        }
      })
      .catch(() => {
        return;
      });
  }, []);

  const router = useRouter();

  const handleLoginChange = (text: string) => {
    setLoginError((prev) => (prev ? '' : prev));
    setLogin(text);
  };
  const handlePasswordChange = (text) => {
    setLoginError((prev) => (prev ? '' : prev));
    setPassword(text);
  };

  const handleLogin = (
    event: any,
    {
      login: log = login,
      password: pas = password,
      pdstatus: pds = pdStatus,
      force = false,
    }: {
      login?: string;
      password?: string;
      pdstatus?: string;
      force?: boolean;
    } = {
      login: login,
      password: password,
      pdstatus: pdStatus,
      force: false,
    },
    // log = login,
    // pas = password,
    // pds = pdStatus,
  ) => {
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
    headers.set('X-User-Login', `${login}`);
    headers.set('X-Device-Id', `${deviceId}`); // ToDo Move this below
    headers.set('X-App-Version', `${BUILD_VERSION}`);
    headers.set('Authorization', 'Basic ' + btoa(log + ':' + pas));
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    Promise.all([getDeviceId(pds), getAppPermissions()]).then(
      ([deviceId, appPermissions]) =>
        fetch(
          new URL(force ? SET_AUTH_PATH : CHECK_AUTH_PATH, BACKEND_ORIGIN),
          {
            method: 'PATCH',
            headers,
            signal: AbortSignal.timeout(FETCH_TIMEOUT),
            body: JSON.stringify({
              deviceId,
              appPermissions,
            }),
          },
        )
          .catch(() => {
            setLoginError('Network problem: no connection');
            setIsAutentificating(false);
          })
          .then((response) => {
            console.log(
              'Login response status code: ',
              response && response.status,
            );
            if (!response) {
              setLoginError('Network problem: slow or unstable connection');
            } else if (response && response.status === 200) {
              return response
                .json()
                .then((person) =>
                  AsyncStorage.setItem('username', person.fullName),
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
                  router.replace('/home/home');
                });
            } else if (response && response.status === 401) {
              setLoginError('Login or Password is incorrect');
              setIsAutentificating(false);
            } else if (response && response.status === 412) {
              setLoginError('Logged From other device');
              setIsAutentificating(false);
            } else {
              setLoginError(
                `Incorrect response from server: status = ${response.status}`,
              );
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

  const handlePDGrant = () => {
    setProminentDisclosureVisible(false);
    setPDStatus(PERMISSION_GRANTED);
    AsyncStorage.setItem('pdstatus', PERMISSION_GRANTED);
    return;
  };
  const handlePDReject = () => {
    setProminentDisclosureVisible(false);
    setPDStatus(PERMISSION_DENIED);
    AsyncStorage.setItem('pdstatus', PERMISSION_DENIED);
    return;
  };

  const handleForceLoginProceed = () => {
    handleLogin(null, { force: true });
  };

  const handleForceLoginCancel = () => {
    setLoginError((prev) => (prev ? '' : prev));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ProminentDisclosureModal
        visible={prominentDisclosureVisible}
        grant={handlePDGrant}
        reject={handlePDReject}
      />
      <ForceLoginModal
        visible={loginError === 'Logged From other device'}
        proceed={handleForceLoginProceed}
        cancel={handleForceLoginCancel}
      />
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
        <Logo />
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
          <LoginInput value={login} onChange={handleLoginChange} />
          <PasswordInput value={password} onChange={handlePasswordChange} />
          <LoginErrorText errorText={loginError} />
          <LoginButton onClick={handleLogin} />
        </View>
        <WelcomeText />
      </ScrollView>
      <Spinner visible={isAutentificating} textContent={'Logging in...'} />
    </SafeAreaView>
  );
};

export default Login;
