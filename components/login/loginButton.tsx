import * as React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onClick}>
        <Text style={styles.buttonText}>LOG IN</Text>
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
    width: '100%',
  },
  buttonText: { color: COLORS.white },
  container: {
    alignItems: 'center',
    flex: 1,
    height: 40,
    justifyContent: 'center',
    marginTop: 5,
    width: '100%',
  },
});

export default LoginButton;
