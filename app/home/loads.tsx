import * as React from 'react';
import { ScrollView, ImageBackground, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect, useRouter } from 'expo-router';

import Load from '../../components/loads/Load';
import ErrorText from '../../components/common/ErrorText';
import { images, BACKEND_ORIGIN, GET_LOADS_PATH } from '../../constants';
import { useUserData } from '../../hooks/userData';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';

const Loads = () => {
  const [changedAt, setChangedAt] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loads, setLoads] = React.useState<Record<string, any>[] | null>(null);
  const [loadError, setLoadError] = React.useState<string>('');

  const [, setUserData] = useUserData();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Loads screen is focused');
      setChangedAt(Date.now());
      return () => {
        console.log('Loads screen is unfocused');
      };
    }, []),
  );

  React.useEffect(() => {
    if (!changedAt) {
      return;
    }
    setIsLoading(true);
    authFetch(new URL(GET_LOADS_PATH, BACKEND_ORIGIN), { method: 'GET' })
      .then(async (response) => {
        if (response && response.status === 200) {
          try {
            const loads = await response.json();
            setLoads(loads.items);
            setLoadError('');
            setIsLoading(false);
          } catch (error) {
            setLoadError(`Incorrect response from server: ${error.message}`);
          }
        } else {
          setLoadError(
            `Incorrect response from server: status = ${response.status}`,
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof NotAuthorizedError) {
          setLoadError('Not authorized');
          router.navigate('/');
          setUserData(null);
        } else {
          setLoadError('Network problem: slow or unstable connection');
        }
        setIsLoading(false);
      });
  }, [setUserData, changedAt]);

  return (
    <ImageBackground
      source={images.appBackground}
      resizeMode="contain"
      style={styles.background}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        {loadError ? (
          <ErrorText errMessage={loadError} />
        ) : (
          loads?.map((load) => <Load key={load.id} load={load} />)
        )}
        <Spinner visible={isLoading} textContent={'Loading loads list...'} />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'flex-start',
    width: '100%',
  },
  scroll: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default Loads;
