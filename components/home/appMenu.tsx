import * as React from 'react';
import {
  Modal,
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
      router.replace('/');
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.modalBackground,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: COLORS.modalBackground,
            }}
          />
        </TouchableWithoutFeedback>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 10,
            padding: 35,
            alignItems: 'center',
            shadowColor: COLORS.black,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <View
            style={{
              width: '100%',
              height: 40,
              marginTop: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                width: 100,
                height: 40,
                backgroundColor: COLORS.primary,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleLogout}
            >
              <Text style={{ color: COLORS.white }}>LOG OUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppMenuModal;
