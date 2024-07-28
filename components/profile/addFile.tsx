import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FileNameDialog from './fileNameDIalog';
import { BACKEND_ORIGIN, COLORS, FILES_PATH } from '../../constants';
import { getDeviceId } from '../../utils/deviceId';
import { getHeaders } from '../../utils/getHeaders';
import { logout } from '../../utils/logout';
import { useUserData } from '../../hooks/userData';
import FileErrorDialog from './fileErrorDialog';
import { FileOfType } from './fileList';

const AddFile = ({
  objectId,
  objectType,
  setChangedAt,
}: {
  objectId?: string;
  objectType?: FileOfType;
  setChangedAt: (changedAt: number) => void;
}) => {
  const [fileUri, setFileUri] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [uploadError, setUploadError] = React.useState<number>(0);

  React.useEffect(() => {
    setFileUri('');
  }, [objectId, objectType]);

  const [userData, setUserData] = useUserData();
  const router = useRouter();

  const handleSubmit = (fileName: string) => {
    setFileUri('');
    uploadFile(fileUri, fileName).then(() => setChangedAt(Date.now()));
  };
  const handleCloseDialog = () => {
    setFileUri('');
  };

  const handleFileErrorClose = () => {
    setUploadError(0);
  };

  const pickImage = async () => {
    const mediaLibraryPermissions =
      await ImagePicker.getMediaLibraryPermissionsAsync();
    if (
      !mediaLibraryPermissions.granted &&
      mediaLibraryPermissions.canAskAgain
    ) {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
    const pickImageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: false,
      allowsMultipleSelection: false,
    });

    if (pickImageResult.canceled || !pickImageResult.assets[0].uri) {
      setFileUri('');
      return;
    }

    setFileUri(pickImageResult.assets[0].uri);
  };

  const uploadFile = async (fileUri: string, fileName: string) => {
    setIsLoading(true);

    const deviceId = await getDeviceId();
    const headers = {};
    getHeaders({
      login: userData.appLogin,
      password: userData.appPassword,
      deviceId,
    }).forEach((hVal, hKey) => (headers[hKey] = hVal));
    const uploadResult = await FileSystem.uploadAsync(
      new URL(`${FILES_PATH}`, BACKEND_ORIGIN).toString(),
      fileUri,
      {
        parameters: {
          linkedTo: objectId,
          fileOf: objectType,
          comment: fileName,
        },
        headers,
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        sessionType: FileSystem.FileSystemSessionType.FOREGROUND,
      },
    );

    if (uploadResult.status === 401) {
      await logout();
      router.navigate('/');
      setUserData(null);
    }

    if (uploadResult.status !== 201) {
      setUploadError(uploadResult.status);
    }

    setIsLoading(false);
  };

  return (
    <>
      <FileNameDialog
        opened={!!fileUri}
        OnClose={handleCloseDialog}
        OnSubmit={handleSubmit}
      />
      <FileErrorDialog errorCode={uploadError} OnClose={handleFileErrorClose} />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          pickImage();
        }}
      >
        <MaterialCommunityIcons
          name="file-image-plus-outline"
          color={COLORS.black}
          size={24}
        />
      </TouchableOpacity>
      <Spinner visible={isLoading} textContent={'Uploading file...'} />
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default AddFile;
