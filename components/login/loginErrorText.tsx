import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants';

const LoginErrorText = ({ errorText }: { errorText: string }) => {
  if (!errorText) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{errorText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
  },
  errorText: { color: COLORS.red },
});

export default LoginErrorText;
