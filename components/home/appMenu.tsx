import * as React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants';
import { logout } from '../../utils/logout';

const AppMenuModal = ({
  visible,
  onRequestClose,
}: {
  visible: boolean;
  onRequestClose: VoidFunction;
}) => {
  const router = useRouter();
  const handleLogout = () => {
    logout().then(() => {
      onRequestClose();
      router.navigate('/');
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={styles.modal}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={{ color: COLORS.white }}>LOG OUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  area: {
    backgroundColor: COLORS.modalBackground,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 100,
  },
  buttonContainer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginTop: 5,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.modalBackground,
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    padding: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default AppMenuModal;
