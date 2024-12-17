import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants';

const ModalButton = ({
  text,
  disabled = false,
  onPress,
}: {
  text: string;
  disabled?: boolean;
  onPress: VoidFunction;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        disabled={disabled}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 100,
  },
  buttonText: { color: COLORS.white },
  container: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginTop: 5,
    width: '45%',
  },
});

export default ModalButton;
