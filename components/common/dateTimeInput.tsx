import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import { SingleChange } from 'react-native-ui-datepicker/src/types';
import Modal from './Modal';
import ModalButton from './modalButton';
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
        visible={pickerVisible}
        header={<Text>{'Select Will Be Available At'}</Text>}
        contents={
          <View style={styles.dialogContentsHolder}>
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
        }
        buttons={
          <>
            <ModalButton text={'Cancel'} onPress={handleClose} />
            <ModalButton text={'Set'} onPress={handleSet} />
          </>
        }
        close={handleClose}
      />
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
  dialogContentsHolder: {
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    height: 'auto',
    width: '100%',
  },
  button: {
    alignItems: 'flex-start',
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
  placeholderText: { color: COLORS.gray2, paddingLeft: 5 },
  valueText: { paddingLeft: 5 },
});

export default DateTimeInput;
