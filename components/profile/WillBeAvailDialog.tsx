import * as React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import {
  COLORS,
  FETCH_TIMEOUT,
  GOOGLE_GEOCODE_API,
  GOOGLE_RESPONSE_TYPE,
} from '../../constants';
import ModalButton from '../common/modalButton';
import LocationInput from './locationInput';
import DateTimeInput from './dateTimeInput';
import { getGoogleApiKey } from '../../utils/getGoogleApiKey';

const WillBeAvailableDialog = ({
  visible,
  onStateChange,
  close,
}: {
  visible: boolean;
  onStateChange: (
    newSatus: 'Will be available',
    availabilityLocation: [number, number],
    availabilityAt: Date,
  ) => void;
  close: VoidFunction;
}) => {
  const [location, setLocation] = React.useState<[number, number] | null>(null);
  const [locationLoading, setLocationLoading] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (!visible) {
      setLocation(null);
      setDate(null);
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

  const setWillBeAvailable = () => {
    onStateChange('Will be available', location, date);
  };
  return (
    <Modal
      animated={false}
      hardwareAccelerated={true}
      animationType="none"
      presentationStyle="overFullScreen"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={styles.dialogPaper}>
          <View style={styles.dialogContents}>
            <LocationInput onSet={handleSetLocation} />
            <View style={styles.spacer}></View>
            <DateTimeInput onSet={setDate} />
          </View>
          <View style={styles.spacer}></View>
          <View style={styles.buttonContainer}>
            <ModalButton text={'Close'} onPress={close} />
            <ModalButton
              text={'Set'}
              disabled={!location || !date}
              onPress={setWillBeAvailable}
            />
          </View>
        </View>
      </View>
      <Spinner visible={locationLoading} textContent={'Setting location...'} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  area: {
    backgroundColor: COLORS.modalBackground,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.modalBackground,
    flex: 1,
    justifyContent: 'center',
  },
  dialogContents: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
    zIndex: 1,
  },
  dialogPaper: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    height: 230,
    padding: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '90%',
  },
  spacer: {
    height: 10,
  },
});

export default WillBeAvailableDialog;
