import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import UserDataItem from '../profile/UserDataItem';
import { fromTimeFrame } from '../../utils/fromTimeFrame';
import { getStatusText } from '../../utils/getStopStatus';
import { COLORS } from '../../constants';

const StopDelivery = ({
  index,
  stops,
}: {
  index: number;
  stops: Record<string, any>[];
}) => {
  const stop = stops[index];
  const stopNumber = index + 1;
  const deliveryNumber = stops
    .slice(0, index + 1)
    .filter((stop) => stop.type === 'Delivery').length;

  const status = getStatusText(stop?.status);

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
          <Text
            style={styles.stopAddText}
          >{`Delivery #${deliveryNumber}`}</Text>
        </View>
        <UserDataItem
          value={`${stop?.timeFrame ? fromTimeFrame(stop.timeFrame) : ''}`}
          fieldName="Time frame"
        />
      </View>
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
