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
import Spinner from 'react-native-loading-spinner-overlay';
import { BACKEND_ORIGIN, COLORS, LOAD_PATH } from '../../constants';
import UserDataItem from '../common/UserDataItem';
import { fromTimeFrame } from '../../utils/fromTimeFrame';
import { toFormattedLocation } from '../../utils/toFormattedLocation';
import { getStatusText } from '../../utils/getStopStatus';
import { useFetch } from '../../hooks/useFetch';

import IconButton from '../common/IconButton';

const StopDelivery = ({
  loadId,
  index,
  stops,
  setSelectedDriversInfo,
  onChanged = () => {},
}: {
  loadId: string;
  index: number;
  stops: Record<string, any>[];
  setSelectedDriversInfo?: (number) => void;
  onChanged?: (number) => void;
}) => {
  const stop = stops[index];
  const stopNumber = index + 1;
  const deliveryNumber = stops
    .slice(0, index + 1)
    .filter((stop) => stop.type === 'Delivery').length;

  const status = getStatusText(stop?.status);

  const [locationName, setLocationName] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const addressRef = React.useRef(null);
  const locationRef = React.useRef(null);

  const authFetch = useFetch();
  const toast = useToast();

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

  const copyToClipboard = async (text: string, toastMsg: string) => {
    if (Platform.OS === 'ios') {
      toast.hideAll();
      toast.show(toastMsg, { duration: 1500 });
    }
    await Clipboard.setStringAsync(text);
  };

  const handleSetOnSite = () => {
    setIsLoading(true);
    const data: {
      status: string;
    } = {
      status: 'On site DEL',
    };
    authFetch(
      new URL(
        `${LOAD_PATH}/${loadId}/stopDelivery/${stop.stopId}`,
        BACKEND_ORIGIN,
      ),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    ).finally(() => {
      setIsLoading(false);
      setTimeout(() => onChanged(Date.now()), 1);
    });
  };
  const handleSelectDriversInfo = () => {
    setSelectedDriversInfo(index);
  };
  const handleSetWaitingGTG = () => {
    setIsLoading(true);
    const data: {
      status: string;
    } = {
      status: 'Unloaded, Waiting GTG',
    };
    authFetch(
      new URL(
        `${LOAD_PATH}/${loadId}/stopDelivery/${stop.stopId}`,
        BACKEND_ORIGIN,
      ),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    ).finally(() => {
      setIsLoading(false);
      setTimeout(() => onChanged(Date.now()), 1);
    });
  };

  return (
    <>
      <View key={stop.stopId} style={styles.deliverContainer}>
        <View style={styles.stopNumContainer}>
          <Text
            style={
              stop?.status === 'New'
                ? styles.stopNewText
                : stop?.status === 'Completed'
                  ? styles.stopCompletedText
                  : styles.stopInProgressText
            }
          >{`Stop (${stopNumber}) ${status ? '[' + status + ']' : ''}`}</Text>
          {stop.status !== 'On route to DEL' ? null : (
            <IconButton
              iconName="truck-check-outline"
              onClick={handleSetOnSite}
            />
          )}
          {stop.status !== 'On site DEL' ? null : (
            <IconButton
              iconName="file-document-edit-outline"
              onClick={handleSelectDriversInfo}
            />
          )}
          {stop.status !== 'On site DEL' ||
          !(stop?.driversInfo?.length >= stop?.bolList?.length) ? null : (
            <IconButton
              iconName="truck-delivery-outline"
              onClick={handleSetWaitingGTG}
            />
          )}
          <Text
            style={styles.stopAddText}
          >{`Delivery #${deliveryNumber}`}</Text>
        </View>
        <TouchableOpacity
          ref={addressRef}
          onPress={() =>
            stop?.facility?.address &&
            copyToClipboard(
              `${stop?.facility?.name ? stop?.facility?.name + '\n' : ''}${(stop.facility.address ? stop.facility.address + '\n' : '') + (stop?.facility?.address2 ? stop.facility.address2 + '\n' : '')}${locationName ? locationName : ''}`,
              'Facility data copied to clipboard',
            )
          }
        >
          <UserDataItem
            value={`${stop?.facility?.name ? stop.facility.name : ''}`}
            isDense
            fieldName="Facility name"
          />
          <UserDataItem
            value={`${stop?.facility?.address ? stop.facility.address : ''}`}
            isDense
            fieldName="Address Line 1"
          />
          <UserDataItem
            value={`${stop?.facility?.address2 ? stop.facility.address2 : ''}`}
            isDense
            fieldName="Address Line 2"
          />
          <UserDataItem
            value={`${locationName ? locationName : ''}`}
            isDense
            fieldName="Location"
          />
        </TouchableOpacity>
        <UserDataItem
          value={`${stop?.timeFrame ? fromTimeFrame(stop.timeFrame) : ''}`}
          isDense
          fieldName="Time frame"
        />
        <UserDataItem
          value={`${stop?.addInfo ? stop?.addInfo : ''}`}
          fieldName="Additional info"
        />
      </View>
      <Spinner visible={isLoading} textContent={'Accepting load...'} />
    </>
  );
};

const styles = StyleSheet.create({
  deliverContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 10,
    width: '100%',
  },
  stopAddText: {
    paddingRight: 5,
  },
  stopCompletedText: {
    color: COLORS.green,
    fontWeight: '500',
    paddingLeft: 5,
  },
  stopInProgressText: {
    color: COLORS.orange,
    fontWeight: '500',
    paddingLeft: 5,
  },
  stopNewText: {
    color: COLORS.blue,
    fontWeight: '500',
    paddingLeft: 5,
  },
  stopNumContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
});

export default StopDelivery;
