import * as Location from 'expo-location';
// import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { merge } from 'lodash';

import {
  BACKEND_ORIGIN,
  SET_LOCATION_PATH,
  // BACKGROUND_FETCH_TASK,
  LOCATION_TRACKING,
  // BACKGROUND_GEOFENCE_TASK,
  LOCATION_UPDATE_INTERVAL,
  LOCATION_DISTANCE_INTERVAL,
  // GEOFENCE_DISTANCE_INTERVAL,
  LOCATION_NOTIFICATION_BODY,
  LOCATION_NOTIFICATION_TITLE,
  COLORS,
  PERMISSION_GRANTED,
  FETCH_TIMEOUT,
  BUILD_VERSION,
} from '../constants';
import { getDeviceId } from './deviceId';
import { throttle } from './throttle';

export type AdditionalLocationOptions = Partial<Location.LocationTaskOptions>;

const baseLocationOptions: Location.LocationTaskOptions = {
  // deferredUpdatesDistance: 0,
  // deferredUpdatesInterval: 0,
  // deferredUpdatesTimeout: 1000 * 60 * 30,
  foregroundService: {
    killServiceOnDestroy: false,
    notificationBody: LOCATION_NOTIFICATION_BODY,
    notificationTitle: LOCATION_NOTIFICATION_TITLE,
    notificationColor: COLORS.locationNotification,
  },
  activityType: Location.ActivityType.Other, // Location.ActivityType.AutomotiveNavigation,
  pausesUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: true,
  // next options from getCurrentPositionAsync
  accuracy: Location.Accuracy.Balanced,
  distanceInterval: LOCATION_DISTANCE_INTERVAL,
  mayShowUserSettingsDialog: true,
  timeInterval: LOCATION_UPDATE_INTERVAL,
};

let isStarting = false;

const startLocation = async (addLocationParams: AdditionalLocationOptions) => {
  if (isStarting) {
    console.log('Already starting');
    return;
  }
  isStarting = true;

  try {
    const resf = await Location.requestForegroundPermissionsAsync();
    const resb = await Location.requestBackgroundPermissionsAsync();
    await Location.enableNetworkProviderAsync(); // Probably don`t need that
    if (
      resf.status != PERMISSION_GRANTED &&
      resb.status !== PERMISSION_GRANTED
    ) {
      console.log('No Permission to access location');
      isStarting = false;
      return;
    }
    console.log('Permission to access location present');
  } catch (error) {
    console.log('Error, getting permissions: ', error);
    isStarting = false;
    return;
  }

  try {
    await Location.startLocationUpdatesAsync(
      LOCATION_TRACKING,
      merge({}, baseLocationOptions, addLocationParams),
    );

    const hasStarted =
      await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
    console.log('Location tracking started? ', hasStarted);
    if (!hasStarted) {
      isStarting = false;
      return;
    }
    const currentLocation = await getLocation();
    await throttledSendLocation(currentLocation);
  } catch (e) {
    console.log(`Error, while starting location: ${e.message}`);
    isStarting = false;
    return;
  }

  const locationHasStarted =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
  console.log('Location tracking started (Start)? ', locationHasStarted);
  if (!locationHasStarted) {
    isStarting = false;
    return;
  }
  isStarting = false;
  return;
};

const stopLocation = async () => {
  const isLocationStarted =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
  if (isLocationStarted) {
    console.log('Location was running');
    await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
  }
  console.log('Stopped');
};

const getLocation = async () => {
  let currentLocation: Location.LocationObject;
  try {
    currentLocation = await Location.getLastKnownPositionAsync();
    console.log(
      `${
        currentLocation
          ? 'Current location at: ' + currentLocation.timestamp
          : 'No last known location'
      }`,
    );
    if (!currentLocation) {
      currentLocation = await Location.getCurrentPositionAsync();
      console.log(`New location location at: ${currentLocation.timestamp}`);
    }
  } catch (error) {
    console.log('Error getting location: ', error);
  }
  return currentLocation;
};

const sendLocation = async (currentLocation: Location.LocationObject) => {
  if (currentLocation) {
    const deviceId = await getDeviceId();
    const headers = new Headers();
    headers.set('X-Device-Id', `${deviceId}`);
    headers.set('X-App-Version', `${BUILD_VERSION}`);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    const uri = new URL(SET_LOCATION_PATH, BACKEND_ORIGIN);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const init = {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        deviceId,
        location: {
          coords: {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          },
        },
      }),
    };
    console.log(
      `Sending location to ${uri.toString()}: ${JSON.stringify(init)}`,
    );
    try {
      await fetch(uri, init).then((response) => {
        console.log(
          'Location response status code: ',
          response && response.status,
        );
        if (response && response.status === 412) {
          return stopLocation();
        }
      });
      console.log('Location sent');
    } catch (error) {
      console.log('Error sending location', error);
    } finally {
      clearTimeout(timeoutId);
    }
  } else {
    console.log('No location to send');
  }
};

const throttledSendLocation = throttle(sendLocation, FETCH_TIMEOUT * 3);

if (!TaskManager.isTaskDefined(LOCATION_TRACKING)) {
  console.log('Registering: ', LOCATION_TRACKING);
  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    console.log(`${new Date().toISOString()}: Location task`);

    if (error) {
      console.log('Location task ERROR:', error);
      return;
    }
    if (data) {
      const { locations } = data as { locations: Location.LocationObject[] };
      console.log(`Location data: ${JSON.stringify(data)}`);
      try {
        const currentLocation = locations[0];
        await throttledSendLocation(currentLocation);
        return;
      } catch (error) {
        console.log('Error, sending location', error);
      }
    }
    return;
  });
} else {
  console.log('Already registered: ', LOCATION_TRACKING);
}

export { startLocation, stopLocation };
