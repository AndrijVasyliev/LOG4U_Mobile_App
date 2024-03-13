import * as React from 'react';
import { View, ImageBackground, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect, useRouter } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';

import WillBeAvailableDialog from '../../components/profile/WillBeAvailDialog';
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

const truckStatuses = ['Will be available', 'Available', 'Not Available'];

const Profile = () => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [profile, setProfile] = React.useState<Record<string, any> | null>(
    null,
  );
  const [profileError, setProfileError] = React.useState<string>('');
  const [willBeDialogVisible, setWillBeDialogVisible] =
    React.useState<boolean>(false);

  const [statusOpen, setStatusOpen] = React.useState<boolean>(false);
  const [statusValue, setStatusValue] = React.useState<string>('');
  const [statusItems, setStatusItems] = React.useState<
    { label: string; value: string }[]
  >(truckStatuses.map((status) => ({ label: status, value: status })));

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
    setIsLoading((prev) => {
      if (!prev) {
        return true;
      }
      return prev;
    });
    authFetch(new URL(GET_DRIVER_PATH, BACKEND_ORIGIN), { method: 'GET' })
      .then(async (response) => {
        if (response && response.status === 200) {
          try {
            const driver = await response.json();
            setProfile(driver);
            setProfileError('');
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
    const statusFromProfile =
      profile?.driveTrucks?.length === 1 ? profile.driveTrucks[0]?.status : '';
    if (statusFromProfile && !truckStatuses.includes(statusFromProfile)) {
      setStatusItems(
        [...truckStatuses, statusFromProfile].map((status) => ({
          label: status,
          value: status,
        })),
      );
    } else {
      setStatusItems(
        truckStatuses.map((status) => ({
          label: status,
          value: status,
        })),
      );
    }
    setStatusValue(statusFromProfile);
  }, [profile]);

  React.useEffect(() => {
    const statusFromProfile =
      profile?.driveTrucks?.length === 1 && profile.driveTrucks[0]?.status;
    if (statusFromProfile === statusValue) {
      return;
    }
    if (statusValue === 'Available' || statusValue === 'Not Available') {
      handleChangeState(statusValue);
    } else if (statusValue === 'Will be available') {
      // setTimeout(() => setWillBeDialogVisible(true), 1);
      setWillBeDialogVisible(true);
    }
  }, [statusValue]);

  const handleChangeState = (
    value: string,
    availabilityLocation?: [number, number],
    availabilityAt?: Date,
  ) => {
    setIsLoading(true);
    const data: {
      status: string;
      availabilityLocation?: [number, number];
      availabilityAt?: Date;
    } = {
      status: value,
      availabilityLocation,
      availabilityAt,
    };
    authFetch(new URL(UPDATE_TRUCK_PATH, BACKEND_ORIGIN), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
      .then(() => {
        setChangedAt(Date.now());
      })
      .catch((error) => {
        setProfileError(`Something went wrong: ${error.message}`);
        setIsLoading(false);
        setChangedAt(Date.now());
      });
  };

  const handleStateChange = (
    value: string,
    availabilityLocation?: [number, number],
    availabilityAt?: Date,
  ) => {
    handleChangeState(value, availabilityLocation, availabilityAt);
    // setTimeout(() => setWillBeDialogVisible(false), 1);
    setWillBeDialogVisible(false);
  };
  const handleWillBeDialogClose = () => {
    // setTimeout(() => setWillBeDialogVisible(false), 1);
    setWillBeDialogVisible(false);
    setChangedAt(Date.now());
  };

  return (
    <ImageBackground
      source={images.appBackground}
      resizeMode="contain"
      style={styles.background}
    >
      <View style={{ zIndex: -1 }}>
        <WillBeAvailableDialog
          visible={willBeDialogVisible}
          onStateChange={handleStateChange}
          close={handleWillBeDialogClose}
        />
      </View>
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
            <DropDownPicker
              disableBorderRadius={false}
              placeholder="Select state"
              style={styles.dropdown}
              containerStyle={styles.dropdownControlContainer}
              disabledStyle={styles.dropdownDisabled}
              dropDownContainerStyle={styles.dropdownContainer}
              listMode="FLATLIST"
              disabled={!truckStatuses.includes(statusValue)}
              open={statusOpen}
              value={statusValue}
              items={statusItems}
              setOpen={setStatusOpen}
              setValue={setStatusValue}
              setItems={setStatusItems}
            />
          </View>
          <Text>Truck status</Text>
        </View>
        {profile?.driveTrucks?.length === 1 &&
          profile.driveTrucks[0]?.status === 'Will be available' && (
            <>
              <UserDataItem
                iconName="map-marker"
                value={`${
                  profile?.driveTrucks?.length === 1 &&
                  profile.driveTrucks[0]?.availabilityCity
                    ? `${profile.driveTrucks[0]?.availabilityCity.name}, ${profile.driveTrucks[0]?.availabilityCity.stateCode}, ${profile.driveTrucks[0]?.availabilityCity.zipCode}`
                    : ''
                }`}
                fieldName="Will be location"
              />
              <UserDataItem
                iconName="timeline-clock"
                value={`${
                  profile?.driveTrucks?.length === 1
                    ? new Date(
                        profile.driveTrucks[0]?.availabilityAt,
                      ).toDateString()
                    : ''
                }`}
                fieldName="Will be at"
              />
            </>
          )}
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
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    zIndex: 1,
  },
  dropdown: {
    backgroundColor: COLORS.unset,
    borderWidth: 0,
  },
  dropdownContainer: {
    backgroundColor: COLORS.lightWhite,
    borderColor: COLORS.gray,
  },
  dropdownControlContainer: {
    width: 160,
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  iconWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default Profile;
