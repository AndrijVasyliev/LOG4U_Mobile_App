import * as React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(visible);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => setIsModalVisible(visible), 200);
    return () => clearTimeout(timeoutId);
  }, [visible]);

  return (
    <Modal
      hardwareAccelerated={true}
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={cancel}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={styles.dialogPaper}>
          <View style={styles.dialogContents}>
            <ScrollView
              style={styles.textContainer}
              contentContainerStyle={styles.textContainerContent}
            >
              <Text style={styles.message}>
                Seems like you where logged in on other device. If you still
                want to continue from this device, then press Continue button.
                Or press Cancel.
              </Text>
              <Text style={styles.note}>
                Note: You can use only one device to track location at a time.
              </Text>
            </ScrollView>
          </View>
          <View style={styles.spacer}></View>
          <View style={styles.buttonContainer}>
            <ModalButton text={'Cancel'} onPress={cancel} />
            <ModalButton text={'Continue'} onPress={proceed} />
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
  buttonContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.modalBackground,
    flex: 1,
    justifyContent: 'center',
  },
  dialogContents: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
    zIndex: 1,
  },
  dialogPaper: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    height: 'auto',
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
  spacer: {
    height: 10,
  },
  buttonHolder: {
    flexDirection: 'row',
    height: 40,
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
