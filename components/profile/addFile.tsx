import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FileNameDialog from './fileNameDIalog';
import { BACKEND_ORIGIN, COLORS, FILE_PATH } from '../../constants';
import { getDeviceId } from '../../utils/deviceId';
import { getHeaders } from '../../utils/getHeaders';
import { logout } from '../../utils/logout';
import { useUserData } from '../../hooks/userData';
import FileErrorDialog from './fileErrorDialog';
import { FileOfType } from './fileList';
import { CameraType } from 'expo-image-picker/src/ImagePicker.types';

const AddFile = ({
  objectId,
  objectType,
  tags,
  setChangedAt,
}: {
  objectId?: string;
  objectType?: FileOfType;
  tags?: Record<string, string>;
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
    let mediaLibraryPermissions =
      await ImagePicker.getMediaLibraryPermissionsAsync();
    if (
      !mediaLibraryPermissions.granted &&
      mediaLibraryPermissions.canAskAgain
    ) {
      mediaLibraryPermissions =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
    if (!mediaLibraryPermissions.granted) {
      setFileUri('');
      return;
    }

    const pickImageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const takePhoto = async () => {
    let cameraPermissions = await ImagePicker.getCameraPermissionsAsync();
    if (!cameraPermissions.granted && cameraPermissions.canAskAgain) {
      cameraPermissions = await ImagePicker.requestCameraPermissionsAsync();
    }
    if (!cameraPermissions.granted) {
      setFileUri('');
      return;
    }

    const photoImageResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: false,
      allowsMultipleSelection: false,
      cameraType: CameraType.back,
    });

    if (photoImageResult.canceled || !photoImageResult.assets[0].uri) {
      setFileUri('');
      return;
    }

    setFileUri(photoImageResult.assets[0].uri);
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
    const parameters: Record<string, string> = {
      linkedTo: objectId,
      fileOf: objectType,
      comment: fileName,
    };
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        parameters[`tags[${key}]`] = `${value}`;
      });
    }
    const uploadResult = await FileSystem.uploadAsync(
      new URL(`${FILE_PATH}`, BACKEND_ORIGIN).toString(),
      fileUri,
      {
        parameters,
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
    <View style={styles.buttonContainer}>
      <FileNameDialog
        opened={!!fileUri}
        OnClose={handleCloseDialog}
        OnSubmit={handleSubmit}
      />
      <FileErrorDialog errorCode={uploadError} OnClose={handleFileErrorClose} />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          takePhoto();
        }}
      >
        <MaterialCommunityIcons
          name="camera-plus-outline"
          color={COLORS.black}
          size={24}
        />
      </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
  addButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default AddFile;
