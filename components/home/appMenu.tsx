import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import Modal from '../common/Modal';
import { useUserData } from '../../hooks/userData';
import ModalButton from '../common/modalButton';

const AppMenuModal = ({
  visible,
  onRequestClose,
}: {
  visible: boolean;
  onRequestClose: VoidFunction;
}) => {
  const { logout } = useUserData();

  const handleLogout = () => {
    onRequestClose();
    logout();
  };

  return (
    <Modal
      visible={visible}
      header={<Text>{'Application Menu'}</Text>}
      contents={<></>}
      buttons={<ModalButton text={'LOG OUT'} onPress={handleLogout} />}
      close={onRequestClose}
    />
  );
};

const styles = StyleSheet.create({});

export default AppMenuModal;
