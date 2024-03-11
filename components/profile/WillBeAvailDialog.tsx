import * as React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { COLORS } from '../../constants';
import ModalButton from '../common/modalButton';
import LocationInput from './locationInput';
import DateTimeInput from './dateTimeInput';

const WillBeAvailableDialog = ({
  visible,
  onStateChange,
  close,
}: {
  visible: boolean;
  onStateChange: (
    newSatus: 'Will be available',
    availabilityLocation: [number, number],
    availabilityAt: Date,
  ) => void;
  close: VoidFunction;
}) => {
  const [location, setLocation] = React.useState<[number, number] | null>(null);
  const [date, setDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (!visible) {
      setLocation(null);
      setDate(null);
    }
  }, [visible]);

  const setWillBeAvailable = () => {
    onStateChange('Will be available', location, date);
  };
  return (
    <Modal
      animated={true}
      hardwareAccelerated={true}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={styles.dialogPaper}>
          <View style={styles.dialogContents}>
            <LocationInput onSet={setLocation} />
            <View style={styles.spacer}></View>
            <DateTimeInput onSet={setDate} />
          </View>
          <View style={styles.spacer}></View>
          <View style={styles.buttonContainer}>
            <ModalButton text={'Close'} onPress={close} />
            <ModalButton
              text={'Set'}
              disabled={!location || !date}
              onPress={setWillBeAvailable}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  area: {
    backgroundColor: COLORS.modalBackground,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.modalBackground,
    flex: 1,
    justifyContent: 'center',
  },
  dialogContents: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
    zIndex: 1,
  },
  dialogPaper: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    height: 230,
    padding: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '90%',
  },
  spacer: {
    height: 10,
  },
});

export default WillBeAvailableDialog;
