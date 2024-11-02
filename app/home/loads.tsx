import * as React from 'react';
import {
  ScrollView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  HostComponent,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  useFocusEffect,
  useRouter,
  usePathname,
  useLocalSearchParams,
} from 'expo-router';

import Load from '../../components/loads/Load';
import ErrorText from '../../components/common/ErrorText';
import { images, BACKEND_ORIGIN, LOAD_PATH, COLORS } from '../../constants';
import { useUserData } from '../../hooks/userData';
import { authFetch } from '../../utils/authFetch';
import { NotAuthorizedError } from '../../utils/notAuthorizedError';
import { isLoadsEnabled } from '../../utils/isEnabled';

const Loads = () => {
  const [changedAt, setChangedAt] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loads, setLoads] = React.useState<Record<string, any>[] | null>(null);
  const [loadError, setLoadError] = React.useState<string>('');

  const scrollViewRef = React.useRef<ScrollView>(null);
  const elementRef = React.useRef<Map<string, View>>(new Map());

  const [userData, setUserData] = useUserData();
  const router = useRouter();
  const path = usePathname();
  const { selectedLoadId, renew } = useLocalSearchParams<{
    selectedLoadId?: string;
    renew?: 'data' | 'none';
  }>();

  useFocusEffect(
    React.useCallback(() => {
      console.log('Loads screen is focused');
      if (isLoadsEnabled(userData)) {
        console.log('Loads updating');
        setChangedAt(Date.now());
      }
      return () => {
        console.log('Loads screen is unfocused');
      };
    }, []),
  );

  React.useEffect(() => {
    if (renew === 'data' && !isLoading && isLoadsEnabled(userData)) {
      console.log('Loads renewing');
      router.setParams({ renew: 'none' });
      setChangedAt(Date.now());
    }
  }, [renew]);

  React.useEffect(() => {
    if (!changedAt) {
      return;
    }
    setIsLoading(true);
    authFetch(new URL(LOAD_PATH, BACKEND_ORIGIN), { method: 'GET' })
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

  React.useEffect(() => {
    if (!selectedLoadId) {
      console.log('No selected load');
      return;
    }
    if (!scrollViewRef.current) {
      console.log('No scrollView');
      return;
    }
    const loadNode = elementRef.current.get(selectedLoadId);
    if (!loadNode) {
      console.log('No Load item found', selectedLoadId);
      return;
    }

    const id = requestAnimationFrame(() =>
      loadNode.measureLayout(
        scrollViewRef.current as unknown as HostComponent<unknown>,
        (x, y) => {
          console.log('Scrolling', y);
          scrollViewRef.current.scrollTo({ y, animated: true });
        },
        () => {
          console.log('Error measuring layout');
        },
      ),
    );

    // Cleanup the animation frame on unmount
    return () => cancelAnimationFrame(id);
  }, [loads /*isLoading*/, selectedLoadId]);

  return (
    <ImageBackground
      source={images.appBackground}
      resizeMode="contain"
      style={styles.background}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        {loadError ? (
          <ErrorText errMessage={loadError} />
        ) : (
          loads?.map((load) => (
            <View
              key={load.id}
              ref={(node) => {
                const ref = elementRef.current;
                if (!ref) {
                  return;
                }
                if (node) {
                  ref.set(load.id, node);
                } else {
                  ref.delete(load.id);
                }
              }}
              style={styles.loadContainer}
            >
              <TouchableOpacity
                style={styles.touchableLoadContainer}
                onPress={() => {
                  if (selectedLoadId === load.id) {
                    router.replace(path);
                    // router.setParams({ selectedLoadId: '' });
                  } else {
                    router.setParams({ selectedLoadId: load.id });
                  }
                }}
              >
                <Load
                  load={load}
                  expanded={selectedLoadId === load.id}
                  onChanged={setChangedAt}
                />
              </TouchableOpacity>
            </View>
          ))
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
  loadContainer: {
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 'auto',
    marginTop: 5,
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
  touchableLoadContainer: {},
});

export default Loads;
