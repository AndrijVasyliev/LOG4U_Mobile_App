import * as React from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import dayjs from 'dayjs';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import { SingleChange } from 'react-native-ui-datepicker/src/types';
import ModalButton from '../common/modalButton';
import { COLORS } from '../../constants';
import { toCorrected } from '../../utils/dateTimeConverters';

const DateTimeInput = ({ onSet }: { onSet: (date?: Date) => void }) => {
  const [pickerVisible, setPickerVisible] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<DateType | undefined>(undefined);

  const onClick = () => {
    setPickerVisible(true);
  };
  const handleDateChange: SingleChange = ({ date }) => {
    setDate(date);
  };
  const handleClose = () => {
    setPickerVisible(false);
  };
  const handleSet = () => {
    onSet(toCorrected(dayjs(date).toDate()));
    setPickerVisible(false);
  };

  return (
    <>
      <Modal
        animated={false}
        hardwareAccelerated={true}
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={pickerVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
      >
        <View style={styles.dialogContainer}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.area} />
          </TouchableWithoutFeedback>
          <View style={styles.dialogPaper}>
            <View style={styles.dialogContents}>
              <DateTimePicker
                mode="single"
                headerButtonColor={COLORS.primary}
                selectedItemColor={COLORS.primary}
                displayFullDays={true}
                timePicker={true}
                minDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
                date={date}
                onChange={handleDateChange}
              />
            </View>
            <View style={styles.spacer}></View>
            <View style={styles.buttonContainer}>
              <ModalButton text={'Cancel'} onPress={handleClose} />
              <ModalButton text={'Set'} onPress={handleSet} />
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.controlContainer}>
        <TouchableOpacity style={styles.button} onPress={onClick}>
          {date ? (
            <Text
              style={styles.valueText}
            >{`${dayjs(date).toDate().toDateString()}`}</Text>
          ) : (
            <Text style={styles.placeholderText}>Enter date</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
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
  button: {
    alignItems: 'flex-start',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
  },
  controlContainer: {
    alignItems: 'center',
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-start',
    marginTop: 5,
    width: '100%',
  },
  dialogContainer: {
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
    height: 500,
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
  placeholderText: { color: COLORS.gray2, paddingLeft: 5 },
  spacer: {
    height: 30,
  },
  valueText: { paddingLeft: 5 },
});

export default DateTimeInput;
