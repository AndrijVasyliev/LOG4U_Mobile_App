import * as React from 'react';
import {
  Dimensions,
  Modal as NativeModal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { COLORS, MODAL_VIEW_DELAY } from '../../constants';
import Spacer from './Spacer';

const Modal = ({
  visible,
  header,
  contents,
  buttons,
  close,
}: {
  visible: boolean;
  header: JSX.Element;
  contents: JSX.Element;
  buttons: JSX.Element;
  close: VoidFunction;
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(visible);

  const screenHeight = Dimensions.get('window').height;
  const calculatedHeight = (screenHeight * 90) / 100;

  React.useEffect(() => {
    if (visible) {
      const timeoutId = setTimeout(
        () => setIsModalVisible(visible),
        MODAL_VIEW_DELAY,
      );
      return () => clearTimeout(timeoutId);
    } else {
      setIsModalVisible(visible);
    }
  }, [visible]);

  return (
    <NativeModal
      hardwareAccelerated={true}
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
        close();
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={[styles.dialogPaper, { maxHeight: calculatedHeight }]}>
          <View style={styles.dialogHeader}>{header}</View>
          <View style={styles.dialogContentsHolder}>{contents}</View>
          <Spacer />
          <View style={styles.buttonContainer}>{buttons}</View>
        </View>
      </View>
    </NativeModal>
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
    height: 60,
    justifyContent: 'flex-start',
    alignContent: 'space-around',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.modalBackground,
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  dialogHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
  dialogContentsHolder: {
    height: 'auto',
    borderTopColor: COLORS.gray,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'column',
    width: '100%',
  },
  dialogPaper: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    height: 'auto',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 'auto',
    maxWidth: '90%',
  },
});

export default Modal;
