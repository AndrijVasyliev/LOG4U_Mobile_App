import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddFile from './addFile';
import File from './file';
import {
  BACKEND_ORIGIN,
  COLORS,
  FILE_PATH,
  MAX_FILES_TO_LOAD,
} from '../../constants';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';
import { useRouter } from 'expo-router';
import ErrorText from '../common/ErrorText';
import { useUserData } from '../../hooks/userData';

export const FILE_OF_TYPES = ['Truck', 'Person', 'Load'] as const;
export type FileOfType = (typeof FILE_OF_TYPES)[number];

const FileList = ({
  objectId,
  objectType,
  label,
  tags,
}: {
  objectId?: string;
  objectType?: FileOfType;
  label: string;
  tags?: Record<string, string>;
}) => {
  const [changedAt, setChangedAt] = React.useState<number>(0);
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<Record<string, any>[] | null>(null);
  const [filesError, setFilesError] = React.useState<string>('');

  const [, setUserData] = useUserData();

  React.useEffect(() => {
    if (expanded) {
      setChangedAt(Date.now());
    }
  }, [expanded]);

  React.useEffect(() => {
    if (!changedAt) {
      return;
    }
    if (!objectId || !objectType) {
      setFiles(null);
      setFilesError('');
      return;
    }
    setIsLoading(true);
    const url = new URL(`${FILE_PATH}`, BACKEND_ORIGIN);
    url.searchParams.append('limit', `${MAX_FILES_TO_LOAD}`);
    url.searchParams.append('offset', '0');
    url.searchParams.append('linkedTo', `${objectId}`);
    url.searchParams.append('fileOf', `${objectType}`);
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        url.searchParams.append(`tags[${key}]`, `${value}`);
      });
    }
    authFetch(url, { method: 'GET' })
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
          setUserData(null);
          setFiles(null);
        } else {
          setFilesError('Network problem: slow or unstable connection');
        }
        setIsLoading(false);
      });
  }, [changedAt, objectId, objectType]);

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
            <Text style={styles.valueText}>{`${label}`}</Text>
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
          tags={tags}
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
