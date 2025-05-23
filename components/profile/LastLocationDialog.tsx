import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import {
  FETCH_TIMEOUT,
  GOOGLE_GEOCODE_API,
  GOOGLE_RESPONSE_TYPE,
} from '../../constants';
import Modal from '../common/Modal';
import ModalButton from '../common/modalButton';
import Spacer from '../common/Spacer';
import LocationInput from '../common/locationInput';
import { getGoogleApiKey } from '../../utils/getGoogleApiKey';

const LastLocationDialog = ({
  visible,
  onStateChange,
  close,
}: {
  visible: boolean;
  onStateChange: (lastLocation: [number, number]) => void;
  close: VoidFunction;
}) => {
  const [location, setLocation] = React.useState<[number, number] | null>(null);
  const [locationLoading, setLocationLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!visible) {
      setLocation(null);
    }
  }, [visible]);

  const handleSetLocation = (placeId: string) => {
    if (!placeId) {
      return;
    }
    setLocationLoading(true);
    const uri = new URL(GOOGLE_RESPONSE_TYPE, GOOGLE_GEOCODE_API);
    uri.searchParams.set('place_id', placeId);
    uri.searchParams.set('key', getGoogleApiKey());
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const init = {
      method: 'GET',
      signal: controller.signal,
    };
    console.log(
      `Geocoding Places for ${uri.toString()}: ${JSON.stringify(init)}`,
    );
    fetch(uri, init)
      .then((response) => {
        console.log(
          'Geocode response status code: ',
          response && response.status,
        );
        if (!response || response.status !== 200) {
          throw new Error('Incorrect or no response');
        }
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        console.log(JSON.stringify(response.results));
        if (
          response?.results?.length &&
          response.results[0]?.geometry?.location
        ) {
          const location = response.results[0]?.geometry?.location;
          setLocation([location.lat, location.lng]);
        } else {
          setLocation(null);
        }
      })
      .catch((error) => {
        console.log('Error Geocoding for Place', error);
        setLocation(null);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLocationLoading(false);
      });
  };

  const setLastLocationAvailable = () => {
    onStateChange(location);
  };

  return (
    <>
      <Modal
        visible={visible}
        header={<Text>{'Set Current Location'}</Text>}
        contents={
          <>
            <View style={styles.dialogContentsHolder}>
              <Spacer />
              <LocationInput onSet={handleSetLocation} />
              <Spacer />
              <Spacer />
              <Text style={styles.text}>
                {'Set current truck location manually'}
              </Text>
              <Spacer />
              <Spacer />
            </View>
          </>
        }
        buttons={
          <>
            <ModalButton text={'Close'} onPress={close} />
            <ModalButton
              text={'Set'}
              disabled={!location}
              onPress={setLastLocationAvailable}
            />
          </>
        }
        close={close}
      />
      <Spinner visible={locationLoading} textContent={'Setting location...'} />
    </>
  );
};

const styles = StyleSheet.create({
  dialogContentsHolder: {
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    height: 'auto',
    width: '100%',
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    minWidth: '70%',
  },
});

export default LastLocationDialog;
