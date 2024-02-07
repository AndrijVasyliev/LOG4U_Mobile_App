import * as React from 'react';
import {View, ImageBackground, Text, Switch, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64';

import UserDataItem from '../../components/profile/UserDataItem';
import ErrorText from '../../components/common/ErrorText';
import {
  BACKEND_ORIGIN,
  BUILD_VERSION,
  COLORS,
  FETCH_TIMEOUT,
  GET_DRIVER_PATH,
  images,
  STORAGE_USER_LOGIN,
  STORAGE_USER_PASSWORD,
  UPDATE_TRUCK_PATH,
} from '../../constants';
import { getDeviceId } from '../../utils/deviceId';

const Profile = () => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [profile, setProfile] = React.useState<Record<string, any> | null>(
    null,
  );
  const [profileError, setProfileError] = React.useState<string>('');
  const [status, setStatus] = React.useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Profile screen is focused');
      setChangedAt(Date.now());
      return () => {
        console.log('Profile screen is unfocused');
      };
    }, []),
  );

  React.useEffect(() => {
    setIsLoading(true);
    Promise.all([
      AsyncStorage.getItem(STORAGE_USER_LOGIN),
      AsyncStorage.getItem(STORAGE_USER_PASSWORD),
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
      AsyncStorage.getItem(STORAGE_USER_LOGIN),
      AsyncStorage.getItem(STORAGE_USER_PASSWORD),
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

  return (
    <ImageBackground
      source={images.appBackground}
      resizeMode="contain"
      style={styles.background}
    >
      <View style={styles.container}>
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
        <View style={styles.controlContainer}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name="truck-fast"
              color={COLORS.black}
              size={24}
            />
            <Text style={styles.valueText}>{`${
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
            disabled={
              profile?.driveTrucks?.length !== 1 ||
              (profile?.driveTrucks[0]?.status !== 'Available' &&
                profile?.driveTrucks[0]?.status !== 'Not Available')
            }
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

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'flex-start',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'flex-start',
    width: '100%',
  },
  controlContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
  iconWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 150,
  },
  valueText: {
    paddingLeft: 5,
  },
});

export default Profile;
