import * as React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants';

const PasswordInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (newValue: string) => void;
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

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
          width: '92%',
          height: 40,
        }}
        secureTextEntry={!showPassword}
        value={value}
        onChangeText={onChange}
        placeholder="Enter Password"
      />
      <TouchableOpacity onPress={handleShowPassword}>
        <MaterialCommunityIcons
          name={showPassword ? 'eye-off' : 'eye'}
          color={COLORS.black}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
