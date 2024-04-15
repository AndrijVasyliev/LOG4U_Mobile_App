import * as React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import FileNameInput from './fileNameInput';
import {
  COLORS,
  MAX_FILE_NAME_LENGTH,
  MIN_FILE_NAME_LENGTH,
} from '../../constants';
import ModalButton from '../common/modalButton';

const FileErrorDialog = ({
  errorCode,
  OnSubmit,
  OnClose,
}: {
  errorCode: number;
  OnClose: () => void;
}) => {
  const handleCloseDialog = () => {
    OnClose();
  };

  return (
    <Modal
      animated={false}
      hardwareAccelerated={true}
      animationType="none"
      presentationStyle="overFullScreen"
      transparent={true}
      visible={!!errorCode}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handleCloseDialog}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={styles.dialogPaper}>
          <View style={styles.dialogContents}>
            <Text style={styles.title}>
              Error uploading file
            </Text>
            <Text style={styles.message}>
              { errorCode === 413 ? 'File is too big' : `Unknown error: ${errorCode}`}
            </Text>
          </View>
          <View style={styles.spacer}></View>
          <View style={styles.buttonContainer}>
            <ModalButton text={'Close'} onPress={handleCloseDialog} />
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
    alignItems: 'center',
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
  },
  dialogPaper: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    height: 170,
    padding: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '60%',
  },
  title: {
    flex: 1,
    fontSize: 15,
  },
  message: {
    flex: 1,
    fontSize: 13,
    paddingTop: 10,
  },
  spacer: {
    height: 15,
  },
});

export default FileErrorDialog;
