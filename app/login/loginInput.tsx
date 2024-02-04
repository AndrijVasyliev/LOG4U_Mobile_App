import * as React from 'react';
import { TextInput, View } from 'react-native';
import { COLORS } from '../../constants';

const LoginInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (newValue: string) => void;
}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 40,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: COLORS.gray,
        borderWidth: 1,
        marginTop: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <TextInput
        style={{
          paddingLeft: 5,
          width: '95%',
          height: 40,
        }}
        value={value}
        onChangeText={onChange}
        placeholder="Enter Login"
      />
    </View>
  );
};

export default LoginInput;
