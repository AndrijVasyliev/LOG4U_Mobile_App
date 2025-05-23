import * as React from 'react';
import { ScrollView, ImageBackground, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from 'expo-router';

import ProfileItem from '../../components/profile/profile';
import ErrorText from '../../components/common/ErrorText';
import { images, BACKEND_ORIGIN, DRIVER_PATH } from '../../constants';
import { useUserData } from '../../hooks/userData';
import { useFetch } from '../../hooks/useFetch';
import { isProfileEnabled } from '../../utils/isEnabled';

const Profile = () => {
  const [changedAt, setChangedAt] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [truck, setTruck] = React.useState<Record<string, any> | null>(null);
  const [profileError, setProfileError] = React.useState<string>('');

  const { userData } = useUserData();
  const authFetch = useFetch();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Profile screen is focused');
      if (isProfileEnabled(userData)) {
        console.log('Profile updating');
        setChangedAt(Date.now());
      }
      return () => {
        console.log('Profile screen is unfocused');
      };
    }, []),
  );

  React.useEffect(() => {
    if (!changedAt || !userData?.type) {
      return;
    }
    setIsLoading((prev) => {
      if (!prev) {
        return true;
      }
      return prev;
    });
    authFetch(new URL(DRIVER_PATH, BACKEND_ORIGIN), { method: 'GET' })
      .then(async (response) => {
        if (response && response.status === 200) {
          try {
            const driver = await response.json();
            if (driver?.driveTrucks?.length === 1 && driver.driveTrucks[0]) {
              setTruck(driver.driveTrucks[0]);
              setProfileError('');
            } else {
              setTruck(null);
              setProfileError('No truck');
            }
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
        setProfileError('Network problem: slow or unstable connection');
        setIsLoading(false);
      });
  }, [userData?.type, changedAt]);

  return (
    <ImageBackground
      source={images.appBackground}
      resizeMode="contain"
      style={styles.background}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        {profileError ? (
          <ErrorText errMessage={profileError} />
        ) : (
          <ProfileItem truck={truck} onChanged={setChangedAt} />
        )}
        <Spinner visible={isLoading} textContent={'Loading driver data...'} />
      </ScrollView>
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
  scroll: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default Profile;
