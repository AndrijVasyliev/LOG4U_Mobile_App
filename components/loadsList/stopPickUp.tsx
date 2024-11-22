import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useToast } from 'react-native-toast-notifications';
import UserDataItem from '../profile/UserDataItem';
import { fromTimeFrame } from '../../utils/fromTimeFrame';
import { getStatusText } from '../../utils/getStopStatus';
import { COLORS } from '../../constants';


const StopPickUp = ({
  index,
  stops,
}: {
  index: number;
  stops: Record<string, any>[];
}) => {
  const stop = stops[index];
  const stopNumber = index + 1;
  const pickUpNumber = stops
    .slice(0, index + 1)
    .filter((stop) => stop.type === 'PickUp').length;

  const status = getStatusText(stop?.status);

  const addressRef = React.useRef(null);

  const toast = useToast();

  const copyToClipboard = async (text: string, toastMsg: string) => {
    if (Platform.OS === 'ios') {
      toast.hideAll();
      toast.show(toastMsg, { duration: 1500 });
    }
    await Clipboard.setStringAsync(text);
  };

  return (
    <>
      <View key={stop.stopId} style={styles.pickContainer}>
        <View style={styles.stopNumContainer}>
          <Text
            style={
              stop?.status === 'New'
                ? styles.stopNewText
                : stop?.status === 'Completed'
                  ? styles.stopCompletedText
                  : styles.stopInProgressText
            }
          >{`Stop (${stopNumber})  ${status ? '[' + status + ']' : ''}`}</Text>
          <Text style={styles.stopAddText}>{`PickUp #${pickUpNumber}`}</Text>
        </View>
        <UserDataItem
          value={`${stop?.timeFrame ? fromTimeFrame(stop.timeFrame) : ''}`}
          fieldName="Time frame"
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
      </View>
    </>
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

export default StopPickUp;
