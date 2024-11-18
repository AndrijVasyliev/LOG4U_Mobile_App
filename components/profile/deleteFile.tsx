import * as React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BACKEND_ORIGIN,
  COLORS,
  FILE_PATH,
  MAX_FILE_NAME_LENGTH,
  MODAL_VIEW_DELAY,
} from '../../constants';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';
import ModalButton from '../common/modalButton';
import { useUserData } from '../../hooks/userData';

const DeleteFile = ({
  file,
  setChangedAt,
}: {
  file: Record<string, any>;
  setChangedAt: (changedAt: number) => void;
}) => {
  const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] =
    React.useState<boolean>(dialogVisible);

  const [, setUserData] = useUserData();

  React.useEffect(() => {
    if (!!dialogVisible) {
      const timeoutId = setTimeout(
        () => setIsModalVisible(!!dialogVisible),
        MODAL_VIEW_DELAY,
      );
      return () => clearTimeout(timeoutId);
    } else {
      setIsModalVisible(!!dialogVisible);
    }
  }, [dialogVisible]);

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
    })
      .then(() => {
        setIsLoading(false);
        setChangedAt(Date.now());
      })
      .catch((error) => {
        if (error instanceof NotAuthorizedError) {
          setUserData(null);
        }
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
              <Text
                style={styles.text}
              >{`Are you sure you want to delete ${name} ?`}</Text>
            </View>
            <View style={styles.spacer}></View>
            <View style={styles.buttonContainer}>
              <ModalButton text={'Close'} onPress={handleCloseDialog} />
              <ModalButton text={'Delete'} onPress={handleDeleteFile} />
            </View>
          </View>
        </View>
      </Modal>
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
  deleteButton: {
    alignItems: 'center',
    flexDirection: 'row',
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
    height: 180,
    padding: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '80%',
  },
  spacer: {
    height: 10,
  },
  text: {
    fontSize: 15,
  },
});

export default DeleteFile;
