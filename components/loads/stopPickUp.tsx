import * as React from 'react';
import * as Location from 'expo-location';
import {
  Platform,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useToast } from 'react-native-toast-notifications';
import UserDataItem from '../profile/UserDataItem';
import { fromTimeFrame } from '../../utils/fromTimeFrame';
import { toFormattedLocation } from '../../utils/toFormattedLocation';

const StopPickUp = ({
  stopNumber,
  pickUpNumber,
  stop,
}: {
  stopNumber: number;
  pickUpNumber: number;
  stop: Record<string, any>;
}) => {
  const [locationName, setLocationName] = React.useState<string>('');

  React.useEffect(() => {
    if (stop?.facility?.facilityLocation) {
      Location.reverseGeocodeAsync({
        latitude: stop.facility.facilityLocation[0],
        longitude: stop.facility.facilityLocation[1],
      }).then(
        (geocodeRes) => setLocationName(toFormattedLocation(geocodeRes[0])),
        () => setLocationName(''),
      );
    } else {
      setLocationName('');
    }
  }, [stop]);

  const addressRef = React.useRef(null);
  const locationRef = React.useRef(null);

  const toast = useToast();
  const copyToClipboard = async (text: string, toastMsg: string) => {
    if (Platform.OS === 'ios') {
      toast.hideAll();
      toast.show(toastMsg, { duration: 1500 });
    }
    await Clipboard.setStringAsync(text);
  };
  return (
    <View key={stop.stopId} style={styles.pickContainer}>
      <View style={styles.stopNumContainer}>
        <View>
          <Text style={styles.stopMainText}>{`Stop (${stopNumber})`}</Text>
        </View>
        <Text style={styles.stopAddText}>{`PickUp #${pickUpNumber}`}</Text>
      </View>
      <UserDataItem
        value={`${stop?.facility?.name ? stop.facility.name : ''}`}
        fieldName="Facility name"
      />
      <TouchableOpacity
        ref={addressRef}
        onPress={() =>
          stop?.facility?.address &&
          copyToClipboard(
            `${stop.facility.address + (stop?.facility?.address2 ? ', ' + stop.facility.address2 : '')}`,
            'Facility address copied to clipboard',
          )
        }
      >
        <UserDataItem
          value={`${stop?.facility?.address ? stop.facility.address : ''}`}
          fieldName="Address Line 1"
        />
        <UserDataItem
          value={`${stop?.facility?.address2 ? stop.facility.address2 : ''}`}
          fieldName="Address Line 2"
        />
      </TouchableOpacity>
      <TouchableOpacity
        ref={locationRef}
        onPress={() =>
          locationName &&
          copyToClipboard(
            `${locationName}`,
            'Facility location copied to clipboard',
          )
        }
      >
        <UserDataItem
          value={`${locationName ? locationName : ''}`}
          fieldName="Location"
        />
      </TouchableOpacity>
      <UserDataItem
        value={`${stop?.timeFrame ? fromTimeFrame(stop.timeFrame) : ''}`}
        fieldName="Time frame"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pickContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 10,
    width: '100%',
  },
  stopAddText: {
    paddingRight: 5,
  },
  stopMainText: {
    fontWeight: '500',
    paddingLeft: 5,
  },
  stopNumContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default StopPickUp;
