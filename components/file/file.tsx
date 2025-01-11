import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeleteFile from './deleteFile';
import {
  BACKEND_ORIGIN,
  COLORS,
  FILE_PATH,
  HTTP_UNAUTHORIZED,
  MAX_FILE_NAME_LENGTH,
} from '../../constants';
import { getHeaders } from '../../utils/getHeaders';
import { getDeviceId } from '../../utils/deviceId';
import { useUserData } from '../../hooks/userData';

const File = ({
  file,
  isDeleteDisabled = false,
  setChangedAt,
}: {
  file?: Record<string, any>;
  isDeleteDisabled?: boolean;
  setChangedAt: (changedAt: number) => void;
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { userData, logout } = useUserData();

  const download = async () => {
    setIsLoading(true);
    const deviceId = await getDeviceId();
    const headers = {};
    getHeaders({
      login: userData.appLogin,
      password: userData.appPassword,
      deviceId,
    }).forEach((hVal, hKey) => (headers[hKey] = hVal));
    const filename = file.comment
      ? file.comment + '.' + file.filename.split('.').slice(-1)[0]
      : file.filename;
    const downloadResult = await FileSystem.downloadAsync(
      new URL(`${FILE_PATH}/${file.id}/download`, BACKEND_ORIGIN).toString(),
      FileSystem.cacheDirectory + filename,
      { headers },
    );

    if (downloadResult.status === HTTP_UNAUTHORIZED) {
      logout();
    }

    if (downloadResult.status === 200 && downloadResult.uri) {
      setTimeout(
        () =>
          saveFile(
            downloadResult.uri,
            filename,
            downloadResult.headers['content-type'],
          ),
        150,
      );
    }
    setIsLoading(false);
  };

  const saveFile = async (uri, filename, mimetype) => {
    if (Platform.OS === 'android') {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimetype,
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch((e) => console.log(e));
      } else {
        Sharing.shareAsync(uri);
      }
    } else {
      Sharing.shareAsync(uri);
    }
  };

  let name = file.comment || file.filename;
  name =
    name.slice(0, MAX_FILE_NAME_LENGTH) +
    (name.length > MAX_FILE_NAME_LENGTH ? '...' : '');

  return (
    <>
      <View key={file.id} style={styles.container}>
        <TouchableOpacity
          style={styles.folderButton}
          onPress={() => {
            download();
          }}
        >
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name="file-image-outline"
              color={COLORS.black}
              size={24}
            />
            <Text style={styles.valueText}>{`${name}`}</Text>
          </View>
        </TouchableOpacity>
        <DeleteFile
          file={file}
          disabled={isDeleteDisabled}
          setChangedAt={setChangedAt}
        />
      </View>
      <Spinner visible={isLoading} textContent={'Downloading file...'} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
  },
  folderButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  valueText: {
    paddingLeft: 5,
    paddingRight: 15,
  },
});

export default File;
