import * as React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { COLORS } from '../../constants';
import ModalButton from '../common/modalButton';
import LocationInput from './locationInput';
import DateTimeInput from './dateTimeInput';

const WillBeAvailableDialog = ({
  visible,
  close,
}: {
  visible: boolean;
  close: VoidFunction;
}) => {
  const [location, setLocation] = React.useState<string>('');
  const [date, setDate] = React.useState<Date | null>(null);
  const onLocationChange = (newValue: string) => {
    setLocation(newValue);
  };

  const setWillBeAvailable = () => {
    return;
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View style={styles.container}>
        <View style={styles.dialogPaper}>
          <View style={styles.dialogContents}>
            <LocationInput value={location} onChange={onLocationChange} />
            <View style={styles.spacer}></View>
            <DateTimeInput value={date} onChange={setDate} />
          </View>
          <View style={styles.spacer}></View>
          <View style={styles.buttonContainer}>
            <ModalButton text={'Close'} onPress={close} />
            <ModalButton text={'Set'} onPress={setWillBeAvailable} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
