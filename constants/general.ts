import { PermissionStatus } from 'expo-modules-core/src/PermissionsInterface';

export const BACKEND_ORIGIN = 'https://mobile.4u-logistics.com';
export const PATCH_AUTH_PATH = '/mobileApp/auth';
export const GET_DRIVER_PATH = '/mobileApp/driver';
export const GET_LOADS_PATH = 'mobileApp/getLoad';
export const UPDATE_TRUCK_PATH = '/mobileApp/updateTruck';
export const SET_LOCATION_PATH = '/mobileApp/setTruckLocation';
export const LOCATION_TRACKING = 'location-tracking';
export const BACKGROUND_FETCH_TASK = 'background-fetch';
export const BACKGROUND_GEOFENCE_TASK = 'background-geofence';
export const LOCATION_NOTIFICATION_BODY = '4U TRACK is tracking your location';
export const LOCATION_NOTIFICATION_TITLE = '4U TRACK Location Service';
export const LOCATION_UPDATE_INTERVAL = 1000 * 60 * 30;
export const LOCATION_DISTANCE_INTERVAL = 250;
export const GEOFENCE_DISTANCE_INTERVAL = 300;
export const PERMISSION_GRANTED = PermissionStatus.GRANTED;
export const PERMISSION_DENIED = PermissionStatus.DENIED;
