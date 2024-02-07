import * as React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
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
    width: '92%',
  },
});

export default PasswordInput;
