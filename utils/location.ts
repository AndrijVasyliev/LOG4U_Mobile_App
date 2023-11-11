//import * as SecureStore from 'expo-secure-store';
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

import {
  BACKEND_ORIGIN,
  SET_LOCATION_PATH,
} from '../constants';

const baseConfig: Config = {
  // Geolocation Config
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  distanceFilter: 0,
  locationUpdateInterval: 1000,
  // Activity Recognition
  // stopTimeout: 5,
  // Application config
  debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
  logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
  stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
  startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
  // HTTP / SQLite config
  url: BACKEND_ORIGIN + SET_LOCATION_PATH,
  batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
  autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
};

let isStarting = false;
let isStarted = false;
let login = 'Mego2Man';
let password = 'Super2Pass';

const startLocation = async () => {
  if (isStarting) {
    console.log('Already starting');
    return;
  }
  isStarting = true;

  /*try {
    [login, password] = await Promise.all([
      SecureStore.getItemAsync('login'),
      SecureStore.getItemAsync('password'),
    ]);
  } catch (error) {
    console.log('Error, getting login and password: ', error);
  }*/

  if (!login || !password) {
    console.log('No login or password');
    isStarting = false;
    return;
  }

  try {
    const state = await BackgroundGeolocation.getState();
    console.log('State: ', state);
    if (state.enabled) {
      console.log('Already running' );
      isStarting = false;
      return;
    }
    const config: Config = {
      ...baseConfig,
      headers: {
        'Authorization': 'Basic ' + btoa(login + ':' + password),
      },
    };
    const readyState = !isStarted ? await BackgroundGeolocation.ready(config) : await BackgroundGeolocation.setConfig(config);
    isStarted = true;
    console.log('After ready: ', readyState);
    const startState = await BackgroundGeolocation.start();
    console.log('After start: ', startState);
  } catch (e) {
    console.log('Error, while starting location: ', e );
    isStarting = false;
    return;
  }

  isStarting = false;
  return;
};

const stopLocation = async () => {
  const state = await BackgroundGeolocation.getState();
  console.log('State: ', state);
  if (state.enabled) {
    const stopState = await BackgroundGeolocation.stop();
    console.log('After stop: ', stopState);
  }

  login = '';
  password = '';
  console.log('Stopped');
};

export { startLocation, stopLocation };
