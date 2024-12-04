import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Stops from './Stops';
import UserDataItem from '../common/UserDataItem';

const Load = ({
  load,
  expanded = false,
  onChanged = () => {},
}: {
  load: Record<string, any>;
  expanded?: boolean;
  onChanged?: (number) => void;
}) => {
  return (
    <>
      <View style={styles.loadNumContainer}>
        <View>
          <Text
            style={styles.loadMainText}
          >{`Load # ${load?.loadNumber} [${load.status}]`}</Text>
        </View>
        <Text style={styles.loadMilesText}>{`${
          load?.milesByRoads
            ? load.milesByRoads.toFixed(2)
            : load?.milesHaversine
              ? 'Approx. ' + load.milesHaversine.toFixed(2)
              : '?'
        } Miles`}</Text>
      </View>
      <UserDataItem
        iconName="truck"
        value={`${load?.truck?.truckNumber ? load?.truck?.truckNumber : ''}`}
        fieldName="Truck #"
      />
      <UserDataItem
        iconName="account"
        value={`${load?.truck?.driver?.fullName ? load?.truck?.driver?.fullName : ''}`}
        fieldName="Driver"
      />
      <UserDataItem
        iconName="currency-usd"
        value={`${load?.rate ? load?.rate : ''}`}
        fieldName="Drivers rate"
      />
      {!expanded ? null : (
        <Stops loadId={load.id} stops={load.stops} onChanged={onChanged} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadMainText: {
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  loadMilesText: {
    paddingRight: 5,
  },
  loadNumContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default Load;
