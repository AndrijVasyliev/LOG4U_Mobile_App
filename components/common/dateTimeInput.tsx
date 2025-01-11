import * as React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import dayjs from 'dayjs';
// import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
// import { SingleChange } from 'react-native-ui-datepicker/src/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from './Modal';
import ModalButton from './modalButton';
import { COLORS } from '../../constants';
import { toCorrected } from '../../utils/dateTimeConverters';

const DateTimeInput = ({ onSet }: { onSet: (date?: Date) => void }) => {
  const [pickerVisible, setPickerVisible] = React.useState<boolean>(false);
  const [date, setDate] = React.useState</*DateType*/ Date | undefined>(undefined);
  const [mode, setMode] = React.useState<'date' | 'time' | 'datetime'>(Platform.OS === 'ios' ? 'datetime' : 'date');

  const onClick = () => {
    const currDate = new Date();
    setDate(currDate);
    onSet(toCorrected(currDate));
    setPickerVisible(true);
  };
  /*const handleDateChange: SingleChange = ({ date }) => {
    setDate(date);
  };*/
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    if (Platform.OS !== 'ios') {
      if (mode === 'date') {
        setMode('time');
      } else {
        setMode('date');
        onSet(toCorrected(currentDate));
        setPickerVisible(false);
      }
    }
    setDate(currentDate);
  };
  const handleClose = () => {
    setPickerVisible(false);
  };
  const handleSet = () => {
    // onSet(toCorrected(dayjs(date).toDate()));
    onSet(toCorrected(date));
    setPickerVisible(false);
  };

  return (
    <>
      {Platform.OS === 'android' && pickerVisible ? (
        <DateTimePicker
          mode={mode}
          display='default'
          is24Hour={true}
          minimumDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
          value={date}
          onChange={handleDateChange}
        />
      ) : (
        <Modal
          visible={pickerVisible}
          header={<Text>{'Select Will Be Available At'}</Text>}
          contents={
            <View style={styles.dialogContentsHolder}>
              {/*<DateTimePicker
              mode="single"
              headerButtonColor={COLORS.primary}
              selectedItemColor={COLORS.primary}
              displayFullDays={true}
              timePicker={true}
              minDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
              date={date}
              onChange={handleDateChange}
            />*/}
              <DateTimePicker
                mode={mode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                is24Hour={true}
                minimumDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
                value={date}
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
      )}
      <View style={styles.controlContainer}>
        <TouchableOpacity style={styles.button} onPress={onClick}>
          {date ? (
            <Text
              style={styles.valueText}
            >{`${/*dayjs(date).toDate().toDateString()*/ date.toDateString()}`}</Text>
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
