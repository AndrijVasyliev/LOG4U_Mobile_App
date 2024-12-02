import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import Modal from '../common/Modal';
import { useUserData } from '../../hooks/userData';
import { logout } from '../../utils/logout';
import ModalButton from '../common/modalButton';

const AppMenuModal = ({
  visible,
  onRequestClose,
}: {
  visible: boolean;
  onRequestClose: VoidFunction;
}) => {
  const [, setUserData] = useUserData();

  const handleLogout = () => {
    logout().then(() => {
      onRequestClose();
      setUserData(null);
    });
  };

  return (
    <Modal
      visible={visible}
      header={<Text>{'Application Menu'}</Text>}
      contents={<></>}
      buttons={
        <>
          <ModalButton text={'LOG OUT'} onPress={handleLogout} />
        </>
      }
      close={onRequestClose}
    />
  );
};

const styles = StyleSheet.create({});

export default AppMenuModal;
