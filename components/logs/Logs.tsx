import * as React from 'react';
import { ScrollView, ImageBackground, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { encode as btoa } from 'base-64';

import BackgroundGeolocation, {
    State,
    Config,
    Location,
    LocationError,
    Geofence,
    GeofenceEvent,
    GeofencesChangeEvent,
    HeartbeatEvent,
    HttpEvent,
    MotionActivityEvent,
    MotionChangeEvent,
    ProviderChangeEvent,
    ConnectivityChangeEvent
} from 'react-native-background-geolocation';

import ErrorText from '../common/ErrorText';
import { images, BACKEND_ORIGIN, GET_LOADS_PATH } from '../../constants';

const Logs = ({ navigation }: { navigation: any }) => {
  const [changedAt, setChangedAt] = React.useState<number>(Date.now());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [logs, setLogs] = React.useState<string>('');

  React.useEffect(() => {
      (async () => {
          const newLogs = await BackgroundGeolocation.logger.getLog();
          setLogs(newLogs);
      })()
  }, [navigation]);


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
      <Text>{logs}</Text>
      </ScrollView>
    </ImageBackground>
  );
};

export default Logs;
