import * as Application from 'expo-application';
import { PermissionStatus } from 'expo-modules-core/src/PermissionsInterface';

export const BUILD_VERSION =
  Application.nativeBuildVersion + '@' + Application.nativeApplicationVersion;

export const FETCH_TIMEOUT = 15000;

export const ROUTE_SET_DELAY = 5;
export const MODAL_VIEW_DELAY = 20;

export const BACKEND_ORIGIN = 'https://mobile.4u-logistics.com';
// export const BACKEND_ORIGIN = 'https://admin-test-lt5d.onrender.com';
// export const BACKEND_ORIGIN = 'http://192.168.0.148:8181';
// export const BACKEND_ORIGIN = 'http://172.20.10.2:8181';
export const GOOGLE_GEOCODE_API =
  'https://maps.googleapis.com/maps/api/geocode/';
export const GOOGLE_PLACES_API =
  'https://maps.googleapis.com/maps/api/place/autocomplete/';
export const GOOGLE_RESPONSE_TYPE = 'json';
export const GOOGLE_API_KEY_IOS = 'AIzaSyA0s5QTfaGUrGr2rq6YQNiWlRLBm2iWfks';
export const GOOGLE_API_KEY_ANDROID = 'AIzaSyAXrZIMXhNiPaw03zrG7fQQH9hZhP0exCk';
export const BACKEND_PREFIX = 'mobileApp';
export const SET_AUTH_PATH = `${BACKEND_PREFIX}/setAuth`;
export const SET_APP_DATA_PATH = `${BACKEND_PREFIX}/setAppData`;
export const DRIVER_PATH = `${BACKEND_PREFIX}/driver`;
export const OWNER_PATH = `${BACKEND_PREFIX}/owner`;
export const COORDINATOR_PATH = `${BACKEND_PREFIX}/coordinator`;
export const LOAD_OWNER_LIST_PATH = `${BACKEND_PREFIX}/loadsByOwner`;
export const LOAD_COORDINATOR_LIST_PATH = `${BACKEND_PREFIX}/loadsByCoordinator`;
export const LOAD_PATH = `${BACKEND_PREFIX}/load`;
export const TRUCK_PATH = `${BACKEND_PREFIX}/truck`;
export const SET_LOCATION_PATH = `${BACKEND_PREFIX}/setTruckLocation`;
export const FILE_PATH = `${BACKEND_PREFIX}/file`;
export const LOCATION_TRACKING = 'location-tracking';
export const BACKGROUND_NOTIFICATION_TASK = 'background-notification';
// export const BACKGROUND_FETCH_TASK = 'background-fetch';
// export const BACKGROUND_GEOFENCE_TASK = 'background-geofence';
export const LOCATION_NOTIFICATION_BODY = '4U TRACK is tracking your location';
export const LOCATION_NOTIFICATION_TITLE = '4U TRACK Location Service';
export const LOCATION_UPDATE_INTERVAL = 1000 * 60 * 30;
export const LOCATION_DISTANCE_INTERVAL = 3000;
// export const GEOFENCE_DISTANCE_INTERVAL = 300;
export const PERMISSION_GRANTED = PermissionStatus.GRANTED;
export const PERMISSION_DENIED = PermissionStatus.DENIED;
export const STORAGE_USER_LOGIN = 'login';
export const STORAGE_USER_PASSWORD = 'password';
export const STORAGE_USER_PD_STATUS = 'pdstatus';
export const GEOCODING_THROTTLE_INTERVAL = 500;
export const MAX_FILES_TO_LOAD = 15;
export const MAX_FILE_NAME_LENGTH = 30;
export const MIN_FILE_NAME_LENGTH = 3;
