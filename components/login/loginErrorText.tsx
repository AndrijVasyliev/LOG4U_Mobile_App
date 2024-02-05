import * as React from 'react';
import { Text, View } from 'react-native';
import { COLORS } from '../../constants';

const LoginErrorText = ({ errorText }: { errorText: string }) => {
  if (!errorText) return null;
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Text style={{ color: COLORS.red }}>{errorText}</Text>
    </View>
  );
};

export default LoginErrorText;
