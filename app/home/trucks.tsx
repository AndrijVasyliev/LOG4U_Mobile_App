import * as React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect, useRouter } from 'expo-router';

import ProfileItem from '../../components/profile/profile';
import ErrorText from '../../components/common/ErrorText';
import {
  images,
  BACKEND_ORIGIN,
  GET_OWNER_PATH,
  GET_COORDINATOR_PATH,
  COLORS,
} from '../../constants';
import { useUserData } from '../../hooks/userData';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';
import { isTrucksEnabled } from '../../utils/isEnabled';

const Trucks = () => {
  const [changedAt, setChangedAt] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [trucks, setTrucks] = React.useState<Record<string, any>[] | null>(
    null,
  );
  const [truckError, setTruckError] = React.useState<string>('');
  const [selectedTruckId, setSelectedTuckId] = React.useState<string | null>(
    null,
  );

  const [userData, setUserData] = useUserData();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Trucks screen is focused');
      if (isTrucksEnabled(userData)) {
        console.log('Trucks updating');
        setChangedAt(Date.now());
      }
      return () => {
        console.log('Trucks screen is unfocused');
      };
    }, []),
  );

  React.useEffect(() => {
    if (!changedAt) {
      return;
    }
    setIsLoading(true);
    let path = '';
    switch (userData?.type) {
      case 'Coordinator':
      case 'CoordinatorDriver':
        path = GET_COORDINATOR_PATH;
        break;
      case 'Owner':
      case 'OwnerDriver':
        path = GET_OWNER_PATH;
        break;
    }
    authFetch(new URL(path, BACKEND_ORIGIN), { method: 'GET' })
      .then(async (response) => {
        if (response && response.status === 200) {
          try {
            const person = await response.json();
            let trucks = [];
            switch (userData?.type) {
              case 'Coordinator':
              case 'CoordinatorDriver':
                trucks = person?.coordinateTrucks
                  ? person.coordinateTrucks
                  : [];
                break;
              case 'Owner':
              case 'OwnerDriver':
                trucks = person?.ownTrucks ? person.ownTrucks : [];
                break;
            }
            setTrucks(trucks);
            setTruckError('');
            setIsLoading(false);
          } catch (error) {
            setTruckError(`Incorrect response from server: ${error.message}`);
          }
        } else {
          setTruckError(
            `Incorrect response from server: status = ${response.status}`,
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof NotAuthorizedError) {
          setTruckError('Not authorized');
          router.navigate('/');
          setUserData(null);
        } else {
          setTruckError('Network problem: slow or unstable connection');
        }
        setIsLoading(false);
      });
  }, [userData, setUserData, changedAt]);

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
        {truckError ? (
          <ErrorText errMessage={truckError} />
        ) : (
          trucks?.map((truck) => (
            <View key={truck.id} style={styles.truckContainer}>
              <TouchableOpacity
                style={styles.touchableTruckContainer}
                onPress={() =>
                  setSelectedTuckId((prev) =>
                    prev === truck.id ? null : truck.id,
                  )
                }
              >
                <ProfileItem
                  truck={truck}
                  expanded={selectedTruckId === truck.id}
                  onChanged={setChangedAt}
                />
              </TouchableOpacity>
            </View>
          ))
        )}
        <Spinner visible={isLoading} textContent={'Loading trucks list...'} />
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
  touchableTruckContainer: {},
  truckContainer: {
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 'auto',
    marginTop: 5,
    width: '100%',
  },
});

export default Trucks;
