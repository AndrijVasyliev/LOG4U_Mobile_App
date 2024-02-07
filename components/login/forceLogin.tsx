import * as React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants';
import ModalButton from '../common/modalButton';

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
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ScrollView
            style={styles.textContainer}
            contentContainerStyle={styles.textContainerContent}
          >
            <Text style={styles.message}>
              Seems like you where logged in on other device. If you still want
              to continue from this device, then press Continue button. Or press
              Cancel.
            </Text>
            <Text style={styles.note}>
              Note: You can use only one device to track location at a time.
            </Text>
          </ScrollView>
          <View style={styles.buttonHolder}>
            <ModalButton text={'Cancel'} onPress={cancel} />
            <ModalButton text={'Continue'} onPress={proceed} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonHolder: {
    flexDirection: 'row',
    height: 40,
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.modalBackground,
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    height: '45%',
    padding: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '90%',
  },
  message: {
    fontSize: 20,
  },
  note: {
    fontSize: 18,
    paddingTop: 20,
  },
  textContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  textContainerContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default ForceLoginModal;
