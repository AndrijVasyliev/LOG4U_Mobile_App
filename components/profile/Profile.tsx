import * as React from 'react';
import { View, ImageBackground, Text, Switch } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64';

import UserDataItem from './UserDataItem';
import ErrorText from '../common/ErrorText';
import {
  BACKEND_ORIGIN,
  BUILD_VERSION,
  COLORS,
  FETCH_TIMEOUT,
  GET_DRIVER_PATH,
  images,
  UPDATE_TRUCK_PATH,
} from '../../constants';
import { getDeviceId } from '../../utils/deviceId';

const Profile = ({ navigation }: { navigation: any }) => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [profile, setProfile] = React.useState<Record<string, any> | null>(
    null,
  );
  const [profileError, setProfileError] = React.useState<string>('');
  const [status, setStatus] = React.useState<boolean>(false);

  React.useEffect(() => {
    return navigation.addListener('focus', () => {
      setChangedAt(Date.now());
    });
  }, [navigation]);

  React.useEffect(() => {
    setIsLoading(true);
    Promise.all([
      AsyncStorage.getItem('login'),
      AsyncStorage.getItem('password'),
      getDeviceId(),
    ])
      .then(([login, password, deviceId]) => {
        if (login && password) {
          const headers = new Headers();
          headers.set('X-User-Login', `${login}`);
          headers.set('X-Device-Id', `${deviceId}`);
          headers.set('X-App-Version', `${BUILD_VERSION}`);
          headers.set('Authorization', 'Basic ' + btoa(login + ':' + password));
          return fetch(new URL(GET_DRIVER_PATH, BACKEND_ORIGIN), {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(FETCH_TIMEOUT),
          })
            .catch(() => {
              setProfileError('Network problem: no connection');
              setIsLoading(false);
            })
            .then((response) => {
              if (!response) {
                setProfileError('Network problem: slow or unstable connection');
              } else if (response && response.status === 200) {
                return response.json().then((driver) => {
                  setProfile(driver);
                  setProfileError('');
                  setIsLoading(false);
                });
              } else {
                setProfileError(
                  `Incorrect response from server: status = ${response.status}`,
                );
              }
              setIsLoading(false);
            });
        } else {
          setProfileError('Not authorized');
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setProfileError(`Something went wrong: ${e.message}`);
        setIsLoading(false);
      });
  }, [changedAt]);

  React.useEffect(() => {
    setStatus(
      profile?.driveTrucks?.length === 1
        ? profile.driveTrucks[0]?.status === 'Available'
        : false,
    );
  }, [profile]);

  const handleChangeState = (value) => {
    setIsLoading(true);
    setStatus(value);
    Promise.all([
      AsyncStorage.getItem('login'),
      AsyncStorage.getItem('password'),
      getDeviceId(),
    ])
      .then(([login, password, deviceId]) => {
        if (login && password) {
          const headers = new Headers();
          headers.set('X-User-Login', `${login}`);
          headers.set('X-Device-Id', `${deviceId}`);
          headers.set('X-App-Version', `${BUILD_VERSION}`);
          headers.set('Authorization', 'Basic ' + btoa(login + ':' + password));
          headers.set('Accept', 'application/json');
          headers.set('Content-Type', 'application/json');
          return fetch(new URL(UPDATE_TRUCK_PATH, BACKEND_ORIGIN), {
            method: 'PATCH',
            headers,
            signal: AbortSignal.timeout(FETCH_TIMEOUT),
            body: JSON.stringify({
              status: value ? 'Available' : 'Not Available',
            }),
          }).catch(() => {
            setProfileError('Network problem: no connection');
            setIsLoading(false);
          });
        }
      })
      .then(() => setChangedAt(Date.now()))
      .catch((e) => {
        setProfileError(`Something went wrong: ${e.message}`);
        setChangedAt(Date.now());
      });
  };

  const router = useRouter();

  return (
    <ImageBackground
      source={images.appBackground}
      resizeMode="contain"
      style={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <UserDataItem
          iconName="account"
          value={`${profile?.fullName ? profile.fullName : ''}`}
          fieldName="Username"
        />
        <UserDataItem
          iconName="email"
          value={`${profile?.email ? profile.email : ''}`}
          fieldName="Email"
        />
        <UserDataItem
          iconName="phone"
          value={`${profile?.phone ? profile.phone : ''}`}
          fieldName="Phone"
        />
        <UserDataItem
          iconName="truck"
          value={`${
            profile?.driveTrucks?.length === 1
              ? profile.driveTrucks[0]?.truckNumber
              : ''
          }`}
          fieldName="Truck #"
        />
        <UserDataItem
          iconName="message-cog"
          value={`${
            profile?.driveTrucks?.length === 1
              ? profile.driveTrucks[0]?.vinCode
              : ''
          }`}
          fieldName="VINCODE"
        />
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: 60,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <View
            style={{
              width: 150,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="truck-fast"
              color={COLORS.black}
              size={24}
            />
            <Text
              style={{
                paddingLeft: 5,
              }}
            >{`${
              profile?.driveTrucks?.length === 1
                ? profile.driveTrucks[0]?.status
                : ''
            }`}</Text>
          </View>
          <Switch
            trackColor={{ false: COLORS.toggleOff, true: COLORS.toggleOn }}
            thumbColor={status ? COLORS.toggleThumbOn : COLORS.toggleThumbOff}
            ios_backgroundColor={COLORS.toggleOff}
            onValueChange={handleChangeState}
            disabled={profile?.driveTrucks?.length !== 1}
            value={status}
          />
          <Text>Truck status</Text>
        </View>
        <ErrorText errMessage={profileError} />
        <Spinner visible={isLoading} textContent={'Loading driver data...'} />
      </View>
    </ImageBackground>
  );
};

export default Profile;
