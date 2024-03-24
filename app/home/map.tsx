import * as React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect, useRouter } from 'expo-router';
import { A } from '@expo/html-elements';
import MapView, {
  Marker,
  Callout /*, PROVIDER_GOOGLE*/,
} from 'react-native-maps';

// import Load from '../../components/loads/Load';
import ErrorText from '../../components/common/ErrorText';
import { images, BACKEND_ORIGIN, GET_OWNER_PATH } from '../../constants';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';

const Map = () => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [trucks, setTrucks] = React.useState<Record<string, any>[] | null>(
    null,
  );
  const [mapError, setMapError] = React.useState<string>('');

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
        } else {
          setMapError('Network problem: slow or unstable connection');
        }
        setIsLoading(false);
      });
  }, [changedAt]);

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
        <Spinner visible={isLoading} textContent={'Loading loads list...'} />
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
