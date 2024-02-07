import * as React from 'react';
import { ScrollView, ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64';

import Load from '../../components/loads/Load';
import ErrorText from '../../components/common/ErrorText';
import {
  images,
  BACKEND_ORIGIN,
  GET_LOADS_PATH,
  FETCH_TIMEOUT,
  BUILD_VERSION,
  STORAGE_USER_LOGIN,
  STORAGE_USER_PASSWORD,
} from '../../constants';
import { getDeviceId } from '../../utils/deviceId';

const Loads = () => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loads, setLoads] = React.useState<Record<string, any>[] | null>(null);
  const [loadError, setLoadError] = React.useState<string>('');

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
    setIsLoading(true);
    Promise.all([
      AsyncStorage.getItem(STORAGE_USER_LOGIN),
      AsyncStorage.getItem(STORAGE_USER_PASSWORD),
      getDeviceId(),
    ])
      .then(([login, password, deviceId]) => {
        if (login && password) {
          const headers = new Headers();
          headers.set('X-User-Login', `${login}`);
          headers.set('X-Device-Id', `${deviceId}`);
          headers.set('X-App-Version', `${BUILD_VERSION}`);
          headers.set('Authorization', 'Basic ' + btoa(login + ':' + password));
          return fetch(new URL(GET_LOADS_PATH, BACKEND_ORIGIN), {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(FETCH_TIMEOUT),
          })
            .catch(() => {
              setLoadError('Network problem: no connection');
              setIsLoading(false);
            })
            .then((response) => {
              if (!response) {
                setLoadError('Network problem: slow or unstable connection');
              } else if (response && response.status === 200) {
                return response.json().then((loads) => {
                  setLoads(loads.items);
                  setLoadError('');
                  setIsLoading(false);
                });
              } else {
                setLoadError(
                  `Incorrect response from server: status = ${response.status}`,
                );
              }
              setIsLoading(false);
            });
        } else {
          setLoadError('Not authorized');
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setLoadError(`Something went wrong: ${e.message}`);
        setIsLoading(false);
      });
  }, [changedAt]);

  return (
    <ImageBackground
      source={images.appBackground}
      resizeMode="contain"
      style={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <ScrollView
        style={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
        contentContainerStyle={{
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
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

export default Loads;
