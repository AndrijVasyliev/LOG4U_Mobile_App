import * as React from 'react';
import { ScrollView, ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useRouter } from 'expo-router';
import { encode as btoa } from 'base-64';

import Load from './Load';
import ErrorText from '../common/ErrorText';
import { images, BACKEND_ORIGIN, GET_LOADS_PATH } from '../../constants';

const Loads = ({ navigation }: { navigation: any }) => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loads, setLoads] = React.useState<Record<string, any>[] | null>(null);
  const [loadError, setLoadError] = React.useState<string>('');

  React.useEffect(() => {
    return navigation.addListener('focus', () => {
      setChangedAt(Date.now());
    });
  }, [navigation]);

  React.useEffect(() => {
    setIsLoading(true);
    Promise.all(['Mego2Man', 'Super2Pass'])
      .then(([login, password]) => {
        if (login && password) {
          const headers = new Headers();
          headers.set('Authorization', 'Basic ' + btoa(login + ':' + password));
          return fetch(new URL(GET_LOADS_PATH, BACKEND_ORIGIN), {
            method: 'GET',
            headers,
          })
            .catch(() => {
              setLoadError('Some network problem');
              setIsLoading(false);
            })
            .then((response) => {
              if (response && response.status === 200) {
                return response.json().then((loads) => {
                  setLoads(loads.items);
                  setLoadError('');
                  setIsLoading(false);
                });
              } else {
                setLoadError(
                  `Incorrect response from server: ${
                    !response ? 'empty response' : 'status = ' + response.status
                  }`,
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

  const router = useRouter();

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
