import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Stops from './Stops';
import UserDataItem from '../profile/UserDataItem';

const Load = ({
  load,
  expanded = true,
}: {
  load: Record<string, any>;
  expanded?: boolean;
}) => {
  return (
    <>
      <View style={styles.loadNumContainer}>
        <View>
          <Text
            style={styles.loadMainText}
          >{`Load # ${load?.loadNumber} (${load.status})`}</Text>
        </View>
        <Text style={styles.loadMilesText}>{`${
          load?.milesByRoads ? load.milesByRoads.toFixed(2) : '?'
        } Miles`}</Text>
      </View>
      {expanded ? null : (
        <UserDataItem
          value={`${load?.stops?.at(0)?.facility?.name ? load.stops.at(0).facility.name : ''}`}
          fieldName="From"
        />
      )}
      {expanded ? null : (
        <UserDataItem
          value={`${load?.stops?.at(-1)?.facility?.name ? load.stops.at(-1).facility.name : ''}`}
          fieldName="To"
        />
      )}
      {!expanded ? null : <Stops stops={load.stops} />}
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
