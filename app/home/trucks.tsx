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
  COLORS,
} from '../../constants';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';

const Trucks = () => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [trucks, setTrucks] = React.useState<Record<string, any>[] | null>(
    null,
  );
  const [truckError, setTruckError] = React.useState<string>('');
  const [selectedTruckId, setSelectedTuckId] = React.useState<string | null>(null);

  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Trucks screen is focused');
      setChangedAt(Date.now());
      return () => {
        console.log('Trucks screen is unfocused');
      };
    }, []),
  );

  React.useEffect(() => {
    setIsLoading(true);
    authFetch(new URL(GET_OWNER_PATH, BACKEND_ORIGIN), { method: 'GET' })
      .then(async (response) => {
        if (response && response.status === 200) {
          try {
            const owner = await response.json();
            setTrucks(
              owner?.ownTrucks
                ? owner.ownTrucks.filter((truck) => !!truck.lastLocation)
                : [],
            );
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
        } else {
          setTruckError('Network problem: slow or unstable connection');
        }
        setIsLoading(false);
      });
  }, [changedAt]);

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
