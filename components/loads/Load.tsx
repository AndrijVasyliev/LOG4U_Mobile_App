import * as React from 'react';
import { Text, View } from 'react-native';
import { COLORS } from '../../constants';

const Load = ({ load }: { load: Record<string, any> }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        width: '100%',
        height: 60,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: COLORS.gray,
        borderWidth: 1,
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            paddingLeft: 5,
          }}
        >{`Load # ${load?.loadNumber}`}</Text>
        <Text>{`${
          load?.milesByRoads ? load.milesByRoads.toFixed(2) : ''
        } Miles`}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            paddingLeft: 5,
          }}
        >{`First pickup: ${load?.pickLocation.name}`}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            paddingLeft: 5,
          }}
        >{`Last delivery: ${load?.deliverLocation.name}`}</Text>
      </View>
    </View>
  );
};

export default Load;
