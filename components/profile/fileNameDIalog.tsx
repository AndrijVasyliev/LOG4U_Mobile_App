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

const FileNameDialog = ({
  opened,
  OnSubmit,
  OnClose,
}: {
  opened: boolean;
  OnSubmit: (fileName: string) => void;
  OnClose: () => void;
}) => {
  const [fileName, setFileName] = React.useState<string>('');
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(opened);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => setIsModalVisible(opened), 200);
    return () => clearTimeout(timeoutId);
  }, [opened]);

  React.useEffect(() => {
    setFileName('');
  }, [opened]);

  const handleUpload = () => {
    OnSubmit(fileName);
  };
  const handleCloseDialog = () => {
    OnClose();
  };

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
        <TouchableWithoutFeedback onPress={handleCloseDialog}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={styles.dialogPaper}>
          <View style={styles.dialogContents}>
            <Text style={styles.message}>
              Enter the name for your document.
            </Text>
            <FileNameInput value={fileName} onChange={setFileName} />
            <Text style={styles.note}>
              {`Note: Name must be from ${MIN_FILE_NAME_LENGTH} to ${MAX_FILE_NAME_LENGTH} characters long.`}
            </Text>
          </View>
          <View style={styles.spacer}></View>
          <View style={styles.buttonContainer}>
            <ModalButton text={'Close'} onPress={handleCloseDialog} />
            <ModalButton
              text={'Upload'}
              disabled={
                fileName.length < MIN_FILE_NAME_LENGTH ||
                fileName.length > MAX_FILE_NAME_LENGTH
              }
              onPress={handleUpload}
            />
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
    justifyContent: 'space-between',
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
    height: 270,
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
    flex: 1,
    fontSize: 15,
  },
  note: {
    flex: 1,
    fontSize: 13,
    paddingTop: 20,
  },
  spacer: {
    height: 10,
  },
});

export default FileNameDialog;
