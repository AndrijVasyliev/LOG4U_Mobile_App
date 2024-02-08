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
import { useRouter, useFocusEffect } from 'expo-router';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64';

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
  BUILD_VERSION,
  COLORS,
  FETCH_TIMEOUT,
  SET_AUTH_PATH,
  PERMISSION_DENIED,
  PERMISSION_GRANTED,
  STORAGE_USER_TYPE,
  STORAGE_USER_NAME,
  STORAGE_USER_LOGIN,
  STORAGE_USER_PASSWORD,
  STORAGE_USER_PD_STATUS,
} from '../../constants';
import { getDeviceId } from '../../utils/deviceId';
import { getAppPermissions } from '../../utils/getAppPermissions';

const Login = () => {
  const [forceLoginVisible, setForceLoginVisible] =
    React.useState<boolean>(false);
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
        AsyncStorage.getItem(STORAGE_USER_PD_STATUS).then((pdstatus) =>
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
      AsyncStorage.getItem(STORAGE_USER_LOGIN),
      AsyncStorage.getItem(STORAGE_USER_PASSWORD),
      AsyncStorage.getItem(STORAGE_USER_PD_STATUS),
      getDeviceId(),
    ])
      .then(([login, password, pdstatus, deviceId]) => {
        setDeviceId(deviceId);
        if (Platform.OS !== 'android' && !pdstatus) {
          setPDStatus(PERMISSION_GRANTED);
          AsyncStorage.setItem(STORAGE_USER_PD_STATUS, PERMISSION_GRANTED);
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
              () => handleLogin(null, { login, password, deviceId, pdstatus }),
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
      deviceId: devId = deviceId,
      pdstatus: pds = pdStatus,
      force = false,
    }: {
      login?: string;
      password?: string;
      deviceId?: string;
      pdstatus?: string;
      force?: boolean;
    } = {
      login: login,
      password: password,
      deviceId: deviceId,
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
    console.log('PD Status', pds, log, pas);
    setIsAutentificating(true);
    setLoginError('');
    const headers = new Headers();
    headers.set('X-User-Login', `${log}`);
    headers.set('X-Device-Id', `${devId}`);
    headers.set('X-App-Version', `${BUILD_VERSION}`);
    headers.set('Authorization', 'Basic ' + btoa(log + ':' + pas));
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    getAppPermissions().then((appPermissions) =>
      fetch(new URL(SET_AUTH_PATH, BACKEND_ORIGIN), {
        method: 'PATCH',
        headers,
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
        body: JSON.stringify({
          force,
          deviceId: devId,
          appPermissions,
        }),
      })
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
                Promise.all([
                  AsyncStorage.setItem(STORAGE_USER_NAME, person.fullName),
                  AsyncStorage.setItem(STORAGE_USER_TYPE, person.type),
                ]),
              )
              .then(() => AsyncStorage.setItem(STORAGE_USER_LOGIN, log))
              .then(() => AsyncStorage.setItem(STORAGE_USER_PASSWORD, pas))
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
                router.navigate('/home');
              });
          } else if (response && response.status === 401) {
            setLoginError('Login or Password is incorrect');
            setIsAutentificating(false);
          } else if (response && response.status === 412) {
            setForceLoginVisible(true);
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
    <>
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
      <View style={styles.container}>
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
      </View>
      <Spinner visible={isAutentificating} textContent={'Logging in...'} />
    </>
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
