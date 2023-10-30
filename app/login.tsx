import * as React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { encode as btoa } from 'base-64';

import { COLORS, icons } from '../constants';

const origin = 'https://admin-test-lt5d.onrender.com';

const Login = () => {
  const [login, setLogin] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string>('');
  const [isAutentificating, setIsAutentificating] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync('login'),
      SecureStore.getItemAsync('password'),
    ])
      .then(([login, password]) => {
        if (login && password) {
          setLogin(login);
          setPassword(password);
          // handleClick(null, login, password);
          setTimeout(() => handleClick(null, login, password), 1);
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
  const handleClick = (event, log = login, pas = password) => {
    if (!log || !pas) {
      return setLoginError(
        `${!log ? 'Login' : ''}${!log && !pas ? ' and ' : ''}${
          !pas ? 'Password' : ''
        } must not be empty!`,
      );
    }
    setIsAutentificating(true);
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(log + ':' + pas));
    fetch(new URL('/mobileApp/auth', origin), { method: 'GET', headers })
      .catch((error) => {
        setLoginError('Some network problem');
        setIsAutentificating(false);
      })
      .then((response) => {
        if (response && response.status === 200) {
          return response
            .json()
            .then((driver) =>
              SecureStore.setItemAsync('username', driver.fullName),
            )
            .then(() => SecureStore.setItemAsync('login', log))
            .then(() => SecureStore.setItemAsync('password', pas))
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
      });
    return;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
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
