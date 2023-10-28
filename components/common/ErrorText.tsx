import * as React from 'react';
import { Text, View } from 'react-native';
import { COLORS } from '../../constants';

const ErrorText = ({ errMessage }: { errMessage?: string }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <Text
        style={{
          color: COLORS.red,
        }}
      >{`${errMessage ? 'Error: ' + errMessage : ''}`}</Text>
    </View>
  );
};

export default ErrorText;
