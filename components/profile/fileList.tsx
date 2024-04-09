import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddFile from './addFile';
import File from './file';
import {
  BACKEND_ORIGIN,
  COLORS,
  FILES_PATH,
  MAX_FILES_TO_LOAD,
} from '../../constants';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';
import { useRouter } from 'expo-router';
import ErrorText from '../common/ErrorText';

const FileList = ({
  objectId,
  objectType,
  caption,
}: {
  objectId?: string;
  objectType?: 'Truck' | 'Person';
  caption: string;
}) => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<Record<string, any>[] | null>(null);
  const [filesError, setFilesError] = React.useState<string>('');

  const router = useRouter();

  React.useEffect(() => {
    if (!expanded || !objectId || !objectType) {
      setFiles(null);
      setFilesError('');
      return;
    }
    setIsLoading(true);
    authFetch(
      new URL(
        `${FILES_PATH}?limit=${MAX_FILES_TO_LOAD}&offset=0&${objectType.toLowerCase()}=${objectId}`,
        BACKEND_ORIGIN,
      ),
      { method: 'GET' },
    )
      .then(async (response) => {
        if (response && response.status === 200) {
          try {
            const files = await response.json();
            setFiles(files.items);
            setFilesError('');
            setIsLoading(false);
          } catch (error) {
            setFilesError(`Incorrect response from server: ${error.message}`);
          }
        } else {
          setFilesError(
            `Incorrect response from server: status = ${response.status}`,
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof NotAuthorizedError) {
          setFilesError('Not authorized');
          router.navigate('/');
          setFiles(null);
        } else {
          setFilesError('Network problem: slow or unstable connection');
        }
        setIsLoading(false);
      });
  }, [changedAt, expanded, objectId, objectType]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="folder-table-outline"
            color={COLORS.black}
            size={24}
          />
          <TouchableOpacity
            style={styles.folderButton}
            onPress={() => {
              setExpanded((prev) => !prev);
            }}
          >
            <Text style={styles.valueText}>{`${caption}`}</Text>
            <MaterialCommunityIcons
              name={expanded ? 'menu-up' : 'menu-down'}
              color={COLORS.black}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <AddFile
          objectId={objectId}
          objectType={objectType}
          setChangedAt={setChangedAt}
        />
      </View>
      <Spinner visible={isLoading} textContent={'Loading files list...'} />
      {!expanded ? null : filesError ? (
        <ErrorText errMessage={filesError} />
      ) : (
        files &&
        files.map((file) => (
          <File key={file.id} file={file} setChangedAt={setChangedAt} />
        ))
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
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

export default FileList;
