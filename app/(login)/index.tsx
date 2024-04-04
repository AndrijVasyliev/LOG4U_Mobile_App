import * as React from 'react';
import {
  ScrollView,
  Text,
  View,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProminentDisclosureModal from '../../components/login/prominentDisclosure';
import ForceLoginModal from '../../components/login/forceLogin';
import Logo from '../../components/login/logo';
import LoginInput from '../../components/login/loginInput';
import PasswordInput from '../../components/login/passwordInput';
import LoginButton from '../../components/login/loginButton';
import LoginErrorText from '../../components/login/loginErrorText';
import WelcomeText from '../../components/login/wellcomeText';
import { startLocation } from '../../utils/location';
import {
  BACKEND_ORIGIN,
  COLORS,
  SET_AUTH_PATH,
  PERMISSION_DENIED,
  PERMISSION_GRANTED,
  STORAGE_USER_LOGIN,
  STORAGE_USER_PASSWORD,
  STORAGE_USER_PD_STATUS,
  SET_APP_DATA_PATH,
} from '../../constants';
import { useUserData } from '../../hooks/userData';
import { getDeviceId } from '../../utils/deviceId';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';
import { registerForPushNotificationsAsync } from '../../utils/notifications';
import { getAppPermissions } from '../../utils/getAppPermissions';
import { getDeviceStatus } from '../../utils/getDeviceStatus';

export type Person = {
  id: string;
  type:
    | 'Driver'
    | 'Owner'
    | 'OwnerDriver'
    | 'Coordinator'
    | 'CoordinatorDriver';
  fullName: string;
  appLogin: string;
  deviceId: string;
};

const Login = () => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [forceLoginVisible, setForceLoginVisible] =
    React.useState<boolean>(false);
  const [prominentDisclosureVisible, setProminentDisclosureVisible] =
    React.useState<boolean>(false);
  const [pdStatus, setPDStatus] = React.useState<string>('');
  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [loginError, setLoginError] = React.useState<string>('');
  const [isAutentificating, setIsAutentificating] =
    React.useState<boolean>(false);

  const [, setUserData] = useUserData();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Login screen is focused');
      setChangedAt(Date.now());
      return () => {
        console.log('Login screen is unfocused');
      };
    }, []),
  );

  React.useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_USER_LOGIN),
      AsyncStorage.getItem(STORAGE_USER_PASSWORD),
      AsyncStorage.getItem(STORAGE_USER_PD_STATUS),
    ])
      .then(([login, password, pdstatus]) => {
        if (Platform.OS !== 'android' && !pdstatus) {
          setPDStatus(PERMISSION_GRANTED);
          AsyncStorage.setItem(STORAGE_USER_PD_STATUS, PERMISSION_GRANTED);
        } else if (!pdstatus) {
          setProminentDisclosureVisible(true);
        } else {
          setPDStatus(pdstatus);
        }
        setLogin(login);
        setPassword(password);
        if (login && password && pdstatus) {
          // setTimeout(() => handleLogin(null, { login, password, pdstatus }), 1);
          handleLogin(null, { login, password, pdstatus });
        }
      })
      .catch(() => {
        return;
      });
  }, [changedAt]);

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
  ) => {
    if (!log || !pas) {
      return setLoginError(
        `${!log ? 'Login' : ''}${!log && !pas ? ' and ' : ''}${
          !pas ? 'Password' : ''
        } must not be empty!`,
      );
    }
    setIsAutentificating(true);
    setLoginError('');
    Promise.all([
      getDeviceId(),
      AsyncStorage.setItem(STORAGE_USER_LOGIN, log),
      AsyncStorage.setItem(STORAGE_USER_PASSWORD, pas),
    ])
      .then(([deviceId]) =>
        authFetch(new URL(SET_AUTH_PATH, BACKEND_ORIGIN), {
          method: 'PATCH',
          body: JSON.stringify({
            force,
            deviceId,
          }),
        }),
      )
      .then(async (response) => {
        console.log(
          'Login response status code: ',
          response && response.status,
        );
        if (response && response.status === 200) {
          let person: Person;
          try {
            person = await response.json();
          } catch (error) {
            setLoginError(`Incorrect response from server: ${error.message}`);
            setIsAutentificating(false);
            return;
          }
          if (person) {
            const trackingPermissions =
              await requestTrackingPermissionsAsync().catch(
                (reason) =>
                  console.log('Error requesting tracking permissions', reason),
                // setLoginError(`Track: ${JSON.stringify(reason)}`)
              );
            let token: string | void;
            if (
              trackingPermissions &&
              trackingPermissions.status === PERMISSION_GRANTED &&
              pds === PERMISSION_GRANTED
            ) {
              console.log('Permission to track data is here');
              if (
                person.type === 'Driver' ||
                person.type === 'OwnerDriver' ||
                person.type === 'CoordinatorDriver'
              ) {
                await startLocation(true).catch(
                  (reason) =>
                    console.log('Error starting location from login', reason),
                  // setLoginError(`Location: ${JSON.stringify(reason)}`)
                );
              }
              token = await registerForPushNotificationsAsync().catch(
                (reason) =>
                  console.log(
                    'Error registering for push notifications',
                    reason,
                  ),
                // setLoginError(`Push: ${JSON.stringify(reason)}`)
              );
            }
            const deviceStatus = await getDeviceStatus().catch(
              (reason) => console.log('Error getting device status', reason),
              // setLoginError(`Status: ${JSON.stringify(reason)}`)
            );
            const appPermissions = await getAppPermissions().catch(
              (reason) => console.log('Error getting app permissions', reason),
              // setLoginError(`Permissions: ${JSON.stringify(reason)}`)
            );
            let mobileDataResp: Response;
            try {
              mobileDataResp = await authFetch(
                new URL(SET_APP_DATA_PATH, BACKEND_ORIGIN),
                {
                  method: 'PATCH',
                  body: JSON.stringify({
                    token: token || '',
                    deviceStatus: deviceStatus || {},
                    appPermissions: appPermissions || {},
                  }),
                },
              );
            } catch (error) {
              setLoginError(`Error setting mobile data: ${error.message}`);
              setIsAutentificating(false);
              return;
            }
            if (mobileDataResp.status === 200) {
              setIsAutentificating(false);
              setUserData({ ...person, appPassword: pas });
              if (person.type === 'Owner' || person.type === 'Coordinator') {
                router.navigate('/home/trucks');
              } else {
                router.navigate('/home/profile');
              }
              return;
            } else if (mobileDataResp.status) {
              setLoginError(
                `Error setting mobile data: status = ${mobileDataResp.status}`,
              );
              setIsAutentificating(false);
              return;
            } else {
              setLoginError('No response for set mobile data');
              setIsAutentificating(false);
              return;
            }
          }
        } else if (response && response.status === 412) {
          setForceLoginVisible(true);
          setLoginError('Logged From other device');
          setIsAutentificating(false);
          return;
        } else {
          setLoginError(
            `Incorrect response from server: status = ${response.status}`,
          );
          setIsAutentificating(false);
          return;
        }
      })
      .catch((error) => {
        if (error instanceof NotAuthorizedError) {
          setLoginError('Login or Password is incorrect');
        } else {
          setLoginError('Network problem: slow or unstable connection');
        }
        setIsAutentificating(false);
      });
    return;
  };

  const handlePDGrant = () => {
    setProminentDisclosureVisible(false);
    setPDStatus(PERMISSION_GRANTED);
    AsyncStorage.setItem(STORAGE_USER_PD_STATUS, PERMISSION_GRANTED);
    return;
  };
  const handlePDReject = () => {
    setProminentDisclosureVisible(false);
    setPDStatus(PERMISSION_DENIED);
    AsyncStorage.setItem(STORAGE_USER_PD_STATUS, PERMISSION_DENIED);
    return;
  };

  const handleForceLoginProceed = () => {
    setForceLoginVisible(false);
    handleLogin(null, { force: true });
  };

  const handleForceLoginCancel = () => {
    setForceLoginVisible(false);
    setLoginError((prev) => (prev ? '' : prev));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <ForceLoginModal
        visible={forceLoginVisible}
        proceed={handleForceLoginProceed}
        cancel={handleForceLoginCancel}
      />
      <ProminentDisclosureModal
        visible={prominentDisclosureVisible}
        grant={handlePDGrant}
        reject={handlePDReject}
      />
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.white },
          headerShadowVisible: false,
          headerTitle: '',
        }}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        <Logo />
        <View style={styles.controlsWrapper}>
          <Text style={styles.headerText}>Login</Text>
          <Text>Enter your credentials to login</Text>
          <LoginInput value={login} onChange={handleLoginChange} />
          <PasswordInput value={password} onChange={handlePasswordChange} />
          <LoginErrorText errorText={loginError} />
          <LoginButton onClick={handleLogin} />
        </View>
        <WelcomeText />
      </ScrollView>
      <Spinner visible={isAutentificating} textContent={'Logging in...'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flex: 1,
    justifyContent: 'center',
  },
  controlsWrapper: {
    flex: 3,
    flexDirection: 'column',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  headerText: { fontSize: 25 },
  scroll: { flex: 1 },
  scrollContainer: {
    marginBottom: 'auto',
    marginTop: 'auto',
  },
});

export default Login;
