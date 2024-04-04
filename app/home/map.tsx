import * as React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect, useRouter } from 'expo-router';
import { A } from '@expo/html-elements';
import MapView, {
  Marker,
  Callout /*, PROVIDER_GOOGLE*/,
} from 'react-native-maps';

import ErrorText from '../../components/common/ErrorText';
import {images, BACKEND_ORIGIN, GET_OWNER_PATH, GET_COORDINATOR_PATH} from '../../constants';
import { useUserData } from '../../hooks/userData';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';

const Map = () => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [trucks, setTrucks] = React.useState<Record<string, any>[] | null>(
    null,
  );
  const [mapError, setMapError] = React.useState<string>('');

  const [userData, setUserData] = useUserData();
  const router = useRouter();
  const mapRef = React.useRef();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Map screen is focused');
      setChangedAt(Date.now());
      return () => {
        console.log('Map screen is unfocused');
      };
    }, []),
  );

  React.useEffect(() => {
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
            setMapError('');
            setIsLoading(false);
          } catch (error) {
            setMapError(`Incorrect response from server: ${error.message}`);
          }
        } else {
          setMapError(
            `Incorrect response from server: status = ${response.status}`,
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof NotAuthorizedError) {
          setMapError('Not authorized');
          router.navigate('/');
          setUserData(null);
        } else {
          setMapError('Network problem: slow or unstable connection');
        }
        setIsLoading(false);
      });
  }, [userData, setUserData, changedAt]);

  React.useEffect(() => {
    if (mapRef.current && trucks) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      mapRef.current.fitToSuppliedMarkers(trucks.map((truck) => truck.id));
    }
  }, [trucks]);

  return (
    <ImageBackground
      source={images.appBackground}
      resizeMode="contain"
      style={styles.background}
    >
      <View style={styles.container}>
        {mapError ? (
          <ErrorText errMessage={mapError} />
        ) : (
          <MapView
            ref={mapRef}
            /*provider={PROVIDER_GOOGLE}*/
            style={styles.map}
          >
            {trucks?.map((truck) => (
              <Marker
                key={truck.id}
                identifier={truck.id}
                coordinate={{
                  latitude: truck.lastLocation[0],
                  longitude: truck.lastLocation[1],
                }}
                title={`${truck.truckNumber}`}
                description={`${truck.status}${(truck.coordinator || truck.owner).fullName}`}
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text
                      style={styles.calloutHeader}
                    >{`${truck.truckNumber}`}</Text>
                    <Text style={styles.calloutText}>{`${truck.status}`}</Text>
                    <Text
                      style={styles.calloutText}
                    >{`${(truck.coordinator || truck.owner)?.fullName}`}</Text>
                    <A
                      href={
                        (truck.coordinator || truck.owner)?.phone
                          ? `tel:${(truck.coordinator || truck.owner).phone}`
                          : ''
                      }
                    >
                      <Text
                        style={styles.calloutText}
                      >{`${(truck.coordinator || truck.owner)?.phone ? (truck.coordinator || truck.owner).phone : ''}`}</Text>
                    </A>
                    <Text
                      style={styles.calloutText}
                    >{`${truck?.lastCity ? truck.lastCity.name + ', ' + truck.lastCity.stateCode + ', ' + truck.lastCity.zipCode : ''}`}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        )}
        <Spinner
          visible={isLoading}
          textContent={'Loading trucks for map...'}
        />
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
  calloutContainer: { alignItems: 'center', padding: 1 },
  calloutHeader: { fontSize: 14 },
  calloutText: { fontSize: 10 },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    height: '100%',
    width: '100%',
  },
});

export default Map;
