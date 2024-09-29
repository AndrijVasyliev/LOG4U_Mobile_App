import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Stops from './Stops';
import AcceptLoadAlert from './acceptLoadAlert';
import UserDataItem from '../profile/UserDataItem';

const Load = ({
  load,
  expanded = false,
  onChanged = () => {},
}: {
  load: Record<string, any>;
  expanded?: boolean;
  onChanged?: (number) => void;
}) => {
  const [isAcceptLoadVisible, setIsAcceptLoadVisible] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (
      expanded &&
      !isAcceptLoadVisible &&
      load.status === 'In Progress' &&
      load.stops[0].status === 'New'
    ) {
      setIsAcceptLoadVisible(true);
    } else if (!expanded && isAcceptLoadVisible) {
      setIsAcceptLoadVisible(false);
    } else if (
      isAcceptLoadVisible &&
      (load.status !== 'In Progress' || load.stops[0].status !== 'New')
    ) {
      setIsAcceptLoadVisible(false);
    }
  }, [expanded, load]);

  return (
    <>
      <AcceptLoadAlert
        visible={isAcceptLoadVisible}
        load={load}
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
        value={`${load?.weight ? load?.weight : ''}`}
        fieldName="Weight"
      />
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
