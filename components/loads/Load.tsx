import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Stops from './Stops';
import ConfirmationLoadAlert from './confirmationLoadAlert';
import UserDataItem from '../common/UserDataItem';
import FileList from '../file/fileList';

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
      <ConfirmationLoadAlert
        load={load}
        expanded={expanded}
        onChanged={onChanged}
      />
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
        iconName="weight"
        value={`${load?.weight ? load?.weight : ''}`}
        fieldName="Weight"
      />
      {!expanded ? null : (
        <UserDataItem
          iconName="marker-check"
          value={`${load?.checkInAs ? load.checkInAs : ''}`}
          fieldName="Check In As"
        />
      )}
      {expanded ? null : (
        <UserDataItem
          iconName="source-commit-start"
          value={`${load?.stops?.at(0)?.facility?.name ? load.stops.at(0).facility.name : ''}`}
          fieldName="From"
        />
      )}
      {expanded ? null : (
        <UserDataItem
          iconName="source-commit-end"
          value={`${load?.stops?.at(-1)?.facility?.name ? load.stops.at(-1).facility.name : ''}`}
          fieldName="To"
        />
      )}
      {!expanded ? null : (
        <Stops loadId={load.id} stops={load.stops} onChanged={onChanged} />
      )}
      {!expanded ? null : (
        <FileList
          objectId={load.id}
          objectType="Load"
          label="Bill Files"
          isAddDisabled={true}
          isDeleteDisabled={true}
          tags={{ [`${load.id}`]: 'Bill' }}
        />
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
