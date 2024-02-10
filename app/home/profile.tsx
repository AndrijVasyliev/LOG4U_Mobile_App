import * as React from 'react';
import { View, ImageBackground, Text, Switch, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect, useRouter } from 'expo-router';

import UserDataItem from '../../components/profile/UserDataItem';
import ErrorText from '../../components/common/ErrorText';
import {
  images,
  BACKEND_ORIGIN,
  COLORS,
  GET_DRIVER_PATH,
  UPDATE_TRUCK_PATH,
} from '../../constants';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';

const Profile = () => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [profile, setProfile] = React.useState<Record<string, any> | null>(
    null,
  );
  const [profileError, setProfileError] = React.useState<string>('');
  const [status, setStatus] = React.useState<boolean>(false);

  const router = useRouter();

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
    authFetch(new URL(GET_DRIVER_PATH, BACKEND_ORIGIN), { method: 'GET' })
      .then(async (response) => {
        if (response && response.status === 200) {
          try {
            const driver = await response.json();
            setProfile(driver);
            setProfileError('');
            setIsLoading(false);
          } catch (error) {
            setProfileError(`Incorrect response from server: ${error.message}`);
          }
        } else {
          setProfileError(
            `Incorrect response from server: status = ${response.status}`,
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof NotAuthorizedError) {
          setProfileError('Not authorized');
          router.navigate('/');
        } else {
          setProfileError('Network problem: slow or unstable connection');
        }
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
    authFetch(new URL(UPDATE_TRUCK_PATH, BACKEND_ORIGIN), {
      method: 'PATCH',
      body: JSON.stringify({
        status: value ? 'Available' : 'Not Available',
      }),
    })
      .then(() => setChangedAt(Date.now()))
      .catch((error) => {
        setProfileError(`Something went wrong: ${error.message}`);
        setIsLoading(false);
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
