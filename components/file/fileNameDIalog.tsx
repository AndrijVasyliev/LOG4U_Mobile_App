import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MAX_FILE_NAME_LENGTH, MIN_FILE_NAME_LENGTH } from '../../constants';
import Modal from '../common/Modal';
import ModalButton from '../common/modalButton';
import TextInputControl from '../common/TextInputControl';
import Spacer from '../common/Spacer';

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

  React.useEffect(() => {
    setFileName('');
  }, [opened]);

  const handleFileNameChange = (newValue: string) => {
    setFileName(newValue);
  };
  const handleUpload = () => {
    OnSubmit(fileName);
  };
  const handleCloseDialog = () => {
    OnClose();
  };

  return (
    <Modal
      visible={opened}
      header={<Text>{'Enter the name for your document'}</Text>}
      contents={
        <View style={styles.dialogContentsHolder}>
          <Spacer />
          <TextInputControl
            placeholder="Enter Filename"
            value={fileName}
            onChange={handleFileNameChange}
          />
          <Text style={styles.note}>
            {`Note: Name must be from ${MIN_FILE_NAME_LENGTH} to ${MAX_FILE_NAME_LENGTH} characters long.`}
          </Text>
        </View>
      }
      buttons={
        <>
          <ModalButton text={'Close'} onPress={handleCloseDialog} />
          <ModalButton
            text={'Upload'}
            disabled={
              fileName.length < MIN_FILE_NAME_LENGTH ||
              fileName.length > MAX_FILE_NAME_LENGTH
            }
            onPress={handleUpload}
          />
        </>
      }
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
  note: {
    fontSize: 13,
    paddingTop: 20,
    height: 'auto',
    width: '90%',
  },
});

export default FileNameDialog;
