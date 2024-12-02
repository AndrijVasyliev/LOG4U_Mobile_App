import * as React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { COLORS, MODAL_VIEW_DELAY } from '../../constants';
import Modal from '../common/Modal';
import ModalButton from '../common/modalButton';
import Spacer from '../common/Spacer';

const FileErrorDialog = ({
  errorCode,
  OnClose,
}: {
  errorCode: number;
  OnClose: () => void;
}) => {
  const [isModalVisible, setIsModalVisible] =
    React.useState<boolean>(!!errorCode);

  React.useEffect(() => {
    if (!!errorCode) {
      const timeoutId = setTimeout(
        () => setIsModalVisible(!!errorCode),
        MODAL_VIEW_DELAY,
      );
      return () => clearTimeout(timeoutId);
    } else {
      setIsModalVisible(!!errorCode);
    }
  }, [errorCode]);

  const handleCloseDialog = () => {
    OnClose();
  };

  return (
    <Modal
      visible={!!errorCode}
      header={<Text>{'Error uploading file'}</Text>}
      contents={
        <View style={styles.dialogContentsHolder}>
          <Spacer />
          <Text style={styles.text}>
            {errorCode === 413
              ? 'File size is too big'
              : `Unknown error: ${errorCode}`}
          </Text>
          <Spacer />
        </View>
      }
      buttons={<ModalButton text={'Close'} onPress={handleCloseDialog} />}
      close={handleCloseDialog}
    />
  );
};

const styles = StyleSheet.create({
  dialogContentsHolder: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    height: 'auto',
    width: '100%',
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    minWidth: '70%',
  },
});

export default FileErrorDialog;
