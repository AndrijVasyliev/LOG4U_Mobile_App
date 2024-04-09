import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { COLORS } from '../../constants';

const FileNameInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (newValue: string) => void;
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Enter Filename"
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
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-start',
    marginTop: 5,
    width: '100%',
  },
  input: {
    height: 40,
    paddingLeft: 5,
    width: '95%',
  },
});

export default FileNameInput;
