import * as React from 'react';
import { Platform, TouchableOpacity, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import { COLORS } from '../../constants';

const Load = ({ load }: { load: Record<string, any> }) => {
  const pickRef = React.useRef(null);
  const deliverRef = React.useRef(null);
  const copyToClipboard = async (text: string, toastMsg: string) => {
    if (Platform.OS === 'ios') {
      Toast.show(toastMsg, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
    await Clipboard.setStringAsync(text);
  };
  return (
    <View
      style={{
        flexDirection: 'column',
        width: '100%',
        height: 110,
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
        <View>
          <Text
            style={{
              paddingLeft: 5,
              fontWeight: 'bold',
            }}
          >{`Load # ${load?.loadNumber}`}</Text>
        </View>
        <Text>{`${
          load?.milesByRoads ? load.milesByRoads.toFixed(2) : ''
        } Miles`}</Text>
      </View>
      <View
        style={{
          paddingTop: 10,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          ref={pickRef}
          onPress={() =>
            load?.pick?.formatted_address &&
            copyToClipboard(
              `${load.pick.formatted_address}`,
              'Pick address copied to clipboard',
            )
          }
        >
          <Text
            style={{
              paddingLeft: 5,
            }}
            numberOfLines={2}
          >{`First pickup: ${
            load?.pick?.formatted_address ? load.pick.formatted_address : ''
          }`}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingTop: 10,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          ref={deliverRef}
          onPress={() =>
            load?.deliver?.formatted_address &&
            copyToClipboard(
              `${load.deliver.formatted_address}`,
              'Deliver address copied to clipboard',
            )
          }
        >
          <Text
            style={{
              paddingLeft: 5,
            }}
            numberOfLines={2}
          >{`Last delivery: ${
            load?.deliver?.formatted_address
              ? load.deliver.formatted_address
              : ''
          }`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Load;
