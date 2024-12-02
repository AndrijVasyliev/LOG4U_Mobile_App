import * as React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import Modal from '../common/Modal';
import ModalButton from '../common/modalButton';
import Spacer from '../common/Spacer';

const ForceLoginModal = ({
  visible,
  cancel,
  proceed,
}: {
  visible: boolean;
  cancel: VoidFunction;
  proceed: VoidFunction;
}) => {
  return (
    <Modal
      visible={visible}
      header={<Text>{'Confirm login'}</Text>}
      contents={
        <ScrollView
          style={styles.dialogContentsScroll}
          contentContainerStyle={styles.dialogContents}
        >
          <Spacer />
          <Text style={styles.message}>
            Seems like you where logged in on other device. If you still want to
            continue from this device, then press Continue button. Or press
            Cancel.
          </Text>
          <Text style={styles.note}>
            Note: You can use only one device to track location at a time.
          </Text>
          <Spacer />
        </ScrollView>
      }
      buttons={
        <>
          <ModalButton text={'Cancel'} onPress={cancel} />
          <ModalButton text={'Continue'} onPress={proceed} />
        </>
      }
      close={cancel}
    />
  );
};

const styles = StyleSheet.create({
  dialogContentsScroll: {
    flexDirection: 'column',
    height: 'auto',
    width: '100%',
  },
  dialogContents: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
  message: {
    fontSize: 20,
  },
  note: {
    fontSize: 18,
    paddingTop: 20,
  },
});

export default ForceLoginModal;
