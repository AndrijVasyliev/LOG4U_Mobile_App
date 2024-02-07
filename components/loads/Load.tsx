import * as React from 'react';
import {
  Platform,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useToast } from 'react-native-toast-notifications';
import { COLORS } from '../../constants';

const Load = ({ load }: { load: Record<string, any> }) => {
  const pickRef = React.useRef(null);
  const deliverRef = React.useRef(null);
  const toast = useToast();
  const copyToClipboard = async (text: string, toastMsg: string) => {
    if (Platform.OS === 'ios') {
      toast.hideAll();
      toast.show(toastMsg, { duration: 1500 });
    }
    await Clipboard.setStringAsync(text);
  };
  return (
    <View style={styles.container}>
      <View style={styles.loadNumContainer}>
        <View>
          <Text style={styles.loadText}>{`Load # ${load?.loadNumber}`}</Text>
        </View>
        <Text>{`${
          load?.milesByRoads ? load.milesByRoads.toFixed(2) : ''
        } Miles`}</Text>
      </View>
      <View style={styles.pickContainer}>
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
          <Text style={styles.pickText} numberOfLines={2}>{`First pickup: ${
            load?.pick?.formatted_address ? load.pick.formatted_address : ''
          }`}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.deliverContainer}>
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
          <Text style={styles.deliverText} numberOfLines={2}>{`Last delivery: ${
            load?.deliver?.formatted_address
              ? load.deliver.formatted_address
              : ''
          }`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'column',
    height: 110,
    justifyContent: 'center',
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
  deliverContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    width: '100%',
  },
  deliverText: {
    paddingLeft: 5,
  },
  loadNumContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  loadText: {
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  pickContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    width: '100%',
  },
  pickText: {
    paddingLeft: 5,
  },
});

export default Load;
