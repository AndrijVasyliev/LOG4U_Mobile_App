import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BACKEND_ORIGIN,
  COLORS,
  FILE_PATH,
  MAX_FILE_NAME_LENGTH,
} from '../../constants';
import Modal from '../common/Modal';
import ModalButton from '../common/modalButton';
import Spacer from '../common/Spacer';
import { useFetch } from '../../hooks/useFetch';

const DeleteFile = ({
  file,
  setChangedAt,
}: {
  file: Record<string, any>;
  setChangedAt: (changedAt: number) => void;
}) => {
  const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const authFetch = useFetch();

  const handleOpenDialog = () => {
    setDialogVisible(true);
  };
  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  const handleDeleteFile = () => {
    setDialogVisible(false);
    setIsLoading(true);
    authFetch(new URL(`${FILE_PATH}/${file.id}`, BACKEND_ORIGIN), {
      method: 'DELETE',
    }).finally(() => {
      setIsLoading(false);
      setChangedAt(Date.now());
    });
  };

  let name = file.comment || file.filename;
  name =
    name.slice(0, MAX_FILE_NAME_LENGTH) +
    (name.length > MAX_FILE_NAME_LENGTH ? '...' : '');

  return (
    <>
      <Modal
        visible={dialogVisible}
        header={<Text>{'Confirm file deletion'}</Text>}
        contents={
          <View style={styles.dialogContentsHolder}>
            <Spacer />
            <Text
              style={styles.text}
            >{`Are you sure you want to delete "${name}" ?`}</Text>
            <Spacer />
          </View>
        }
        buttons={
          <>
            <ModalButton text={'Close'} onPress={handleCloseDialog} />
            <ModalButton text={'Delete'} onPress={handleDeleteFile} />
          </>
        }
        close={handleCloseDialog}
      />
      <TouchableOpacity style={styles.deleteButton} onPress={handleOpenDialog}>
        <MaterialCommunityIcons
          name="file-image-minus-outline"
          color={COLORS.black}
          size={24}
        />
      </TouchableOpacity>
      <Spinner visible={isLoading} textContent={'Uploading file...'} />
    </>
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
  deleteButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
  },
});

export default DeleteFile;
