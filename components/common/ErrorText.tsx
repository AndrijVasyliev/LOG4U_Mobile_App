import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants';

const ErrorText = ({ errMessage }: { errMessage?: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{`${
        errMessage ? 'Error: ' + errMessage : ''
      }`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
  message: {
    color: COLORS.red,
  },
});

export default ErrorText;
