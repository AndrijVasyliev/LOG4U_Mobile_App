import * as Location from 'expo-location';
// import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import {
  BACKEND_ORIGIN,
  SET_LOCATION_PATH,
  // BACKGROUND_FETCH_TASK,
  LOCATION_TRACKING,
  BACKGROUND_GEOFENCE_TASK,
  LOCATION_UPDATE_INTERVAL,
  LOCATION_DISTANCE_INTERVAL,
  GEOFENCE_DISTANCE_INTERVAL,
  LOCATION_NOTIFICATION_BODY,
  LOCATION_NOTIFICATION_TITLE,
  COLORS,
  PERMISSION_GRANTED,
  FETCH_TIMEOUT,
  BUILD_VERSION,
} from '../constants';
import { getDeviceId } from './deviceId';
import { throttle } from './throttle';

let isStarting = false;

const startLocation = async (isStartedAfterLogin = false) => {
  if (isStarting) {
    console.log('Already starting');
    return;
  }
  isStarting = true;

  if (isStartedAfterLogin) {
    try {
      const resf = await Location.requestForegroundPermissionsAsync();
      const resb = await Location.requestBackgroundPermissionsAsync();
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
  } else {
    try {
      const resf = await Location.getForegroundPermissionsAsync();
      const resb = await Location.getBackgroundPermissionsAsync();
      if (
        resf.status != PERMISSION_GRANTED &&
        resb.status !== PERMISSION_GRANTED
      ) {
        console.log('Permission to access location was denied');
        isStarting = false;
        return;
      }
      console.log('Permission to access location granted');
    } catch (error) {
      console.log('Error, requesting permissions: ', error);
      isStarting = false;
      return;
    }
  }

  try {
    await startLocationTask();
    const currentLocation = await getLocation();
    await Promise.all([
      startGeofenceTask(currentLocation),
      throttledSendLocation(currentLocation),
    ]);
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

  const geofenceHasStarted = await Location.hasStartedGeofencingAsync(
    BACKGROUND_GEOFENCE_TASK,
  );
  console.log('Geofence tracking started (Start)? ', geofenceHasStarted);
  if (!geofenceHasStarted) {
    isStarting = false;
    return;
  }

  isStarting = false;
  return;
};

const stopLocation = async () => {
  const tasks = [];
  const isGeofenceStarted = await Location.hasStartedGeofencingAsync(
    BACKGROUND_GEOFENCE_TASK,
  );
  if (isGeofenceStarted) {
    console.log('Geofence was running');
    tasks.push(Location.stopGeofencingAsync(BACKGROUND_GEOFENCE_TASK));
  }

  const isLocationStarted =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
  if (isLocationStarted) {
    console.log('Location was running');
    tasks.push(Location.stopLocationUpdatesAsync(LOCATION_TRACKING));
  }
  await Promise.all(tasks);

  console.log('Stopped');
};
const startLocationTask = async () => {
  const alreadyStarted =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
  if (alreadyStarted) {
    console.log('Location already started');
    return;
  }
  await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
    activityType: Location.ActivityType.Other, // Location.ActivityType.AutomotiveNavigation,
    // deferredUpdatesDistance: 0,
    // deferredUpdatesInterval: 0,
    // deferredUpdatesTimeout: 1000 * 60 * 30,
    foregroundService: {
      killServiceOnDestroy: false,
      notificationBody: LOCATION_NOTIFICATION_BODY,
      notificationTitle: LOCATION_NOTIFICATION_TITLE,
      notificationColor: COLORS.locationNotification,
    },
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
    // next from getCurrentPositionAsync
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: LOCATION_DISTANCE_INTERVAL,
    mayShowUserSettingsDialog: true,
    timeInterval: LOCATION_UPDATE_INTERVAL,
  });

  const hasStarted =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
  console.log('Location tracking started? ', hasStarted);
  if (!hasStarted) {
    isStarting = false;
    return;
  }
};
const startGeofenceTask = async (currentLocation: Location.LocationObject) => {
  if (currentLocation) {
    console.log(
      `New location for geofencing: ${JSON.stringify(currentLocation)}`,
    );
    await Location.startGeofencingAsync(BACKGROUND_GEOFENCE_TASK, [
      {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        notifyOnEnter: false,
        notifyOnExit: true,
        radius: GEOFENCE_DISTANCE_INTERVAL,
      },
    ]);
    console.log('New geofence started');
  } else {
    console.log('No current location');
  }
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
          'Login response status code: ',
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
        await Promise.all([
          startGeofenceTask(currentLocation),
          throttledSendLocation(currentLocation),
          startLocationTask(),
        ]);
        return;
      } catch (error) {
        console.log('Error, restarting geofence', error);
      }
    }
    return;
  });
} else {
  console.log('Already registered: ', LOCATION_TRACKING);
}

if (!TaskManager.isTaskDefined(BACKGROUND_GEOFENCE_TASK)) {
  console.log('Registering: ', BACKGROUND_GEOFENCE_TASK);
  TaskManager.defineTask<{
    eventType: Location.GeofencingEventType;
    region: Location.LocationRegion;
  }>(BACKGROUND_GEOFENCE_TASK, async ({ data, error }) => {
    console.log(`${new Date().toISOString()}: Geofence task`);
    if (error) {
      console.log('Geofence task ERROR:', error);
      return;
    }
    const { eventType, region } = data;
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log("You've entered region:", region);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log("You've left region:", region);
      try {
        const currentLocation = await getLocation();
        await Promise.all([
          startGeofenceTask(currentLocation),
          throttledSendLocation(currentLocation),
          startLocationTask(),
        ]);
        return;
      } catch (error) {
        console.log('Error, restarting geofence', error);
      }
    }
  });
} else {
  console.log('Already registered: ', BACKGROUND_GEOFENCE_TASK);
}

export { startLocation, stopLocation };
