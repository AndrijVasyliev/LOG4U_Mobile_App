import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { COLORS } from '../../constants';

const TextInputControl = ({
  placeholder,
  value,
  number = false,
  onChange,
}: {
  placeholder: string;
  value: string;
  number?: boolean;
  onChange: (newValue: string | number) => void;
}) => {
  const handleOnChange = (newValue: string) => {
    if (number && Number.isInteger(Number(newValue))) {
      onChange(newValue === '' ? newValue : Number(newValue));
    } else if (!number) {
      onChange(newValue);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        inputMode={number ? 'numeric' : 'text'}
        keyboardType={number ? 'numeric' : 'default'}
        value={value}
        onChangeText={handleOnChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray2}
      />
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
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-start',
    marginTop: 5,
    width: '100%',
    zIndex: 1,
  },
  input: {
    height: 40,
    paddingLeft: 5,
    width: '100%',
  },
});

export default TextInputControl;
