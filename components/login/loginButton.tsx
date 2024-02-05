import * as React from 'react';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../constants';

const LoginButton = ({
  onClick,
}: {
  onClick: (event: GestureResponderEvent) => void;
}) => {
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: 40,
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TouchableOpacity
        style={{
          width: '100%',
          height: 40,
          backgroundColor: COLORS.primary,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onClick}
      >
        <Text style={{ color: COLORS.white }}>LOG IN</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginButton;
