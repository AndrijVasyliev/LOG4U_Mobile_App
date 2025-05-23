import * as React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Platform,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { A } from '@expo/html-elements';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';

import ErrorText from '../../components/common/ErrorText';
import {
  images,
  BACKEND_ORIGIN,
  OWNER_PATH,
  COORDINATOR_PATH,
} from '../../constants';
import { useUserData } from '../../hooks/userData';
import { useFetch } from '../../hooks/useFetch';
import { isMapEnabled } from '../../utils/isEnabled';
import { toFormattedLocation } from '../../utils/toFormattedLocation';

const Map = () => {
  const [changedAt, setChangedAt] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [trucks, setTrucks] = React.useState<Record<string, any>[] | null>(
    null,
  );
  const [mapError, setMapError] = React.useState<string>('');

  const mapRef = React.useRef();

  const { userData } = useUserData();
  const authFetch = useFetch();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Map screen is focused');
      if (isMapEnabled(userData)) {
        console.log('Map updating');
        setChangedAt(Date.now());
      }
      return () => {
        console.log('Map screen is unfocused');
      };
    }, []),
  );

  React.useEffect(() => {
    if (!changedAt || !userData?.type) {
      return;
    }
    const updateId = changedAt;
    setIsLoading((prev) => {
      if (!prev) {
        return true;
      }
      return prev;
    });
    let path = '';
    switch (userData.type) {
      case 'Coordinator':
      case 'CoordinatorDriver':
        path = COORDINATOR_PATH;
        break;
      case 'Owner':
      case 'OwnerDriver':
        path = OWNER_PATH;
        break;
    }
    authFetch(new URL(path, BACKEND_ORIGIN), { method: 'GET' })
      .then(async (response) => {
        if (response && response.status === 200) {
          try {
            const person = await response.json();
            let trucks = [];
            switch (userData.type) {
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
            trucks = trucks.filter((truck) => truck.lastLocation);
            trucks.forEach((truck) => (truck.lastCity = 'Loading ...'));
            setTrucks(trucks);
            setMapError('');
            setIsLoading(false);

            await Promise.all(
              trucks.map((truck, index) =>
                Location.reverseGeocodeAsync({
                  latitude: truck.lastLocation[0],
                  longitude: truck.lastLocation[1],
                })
                  .then((geocodeRes) => toFormattedLocation(geocodeRes[0]))
                  .then((geocodedResult) => {
                    if (updateId === changedAt) {
                      trucks[index].lastCity = geocodedResult;
                      setTrucks([...trucks]);
                    }
                  })
                  .catch(() => (trucks[index].lastCity = 'Error geocoding.')),
              ),
            );
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
        setMapError('Network problem: slow or unstable connection');
        setIsLoading(false);
      });
  }, [userData?.type, changedAt]);

  React.useEffect(() => {
    if (mapRef.current && trucks) {
      setTimeout(
        () =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          mapRef.current.fitToSuppliedMarkers(trucks.map((truck) => truck.id)),
        1,
      );
    }
  }, [mapRef.current, trucks]);

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
            provider={
              Platform.OS === 'android' || userData?.useGoogleMaps
                ? PROVIDER_GOOGLE
                : undefined
            }
            loadingEnabled={true}
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
                description={`${truck.status}${(truck.coordinator || truck.owner)?.fullName}`}
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
                    >{`${truck?.lastCity ? truck.lastCity : ''}`}</Text>
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
