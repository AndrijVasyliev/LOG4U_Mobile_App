import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TrackingTransparency from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSION_GRANTED, STORAGE_USER_PD_STATUS } from '../constants';

export const getAppPermissions = async (): Promise<Record<string, any>> => {
  const [
    prominentDisclosureStatus,
    trackingTransparencyStatus,
    notificationsStatus,
    foregroundLocationPermissionStatus,
    backgroundLocationPermissionStatus,
  ] = await Promise.all([
    AsyncStorage.getItem(STORAGE_USER_PD_STATUS),
    TrackingTransparency.getTrackingPermissionsAsync(),
    Notifications.getPermissionsAsync(),
    Location.getForegroundPermissionsAsync(),
    Location.getBackgroundPermissionsAsync(),
  ]);
  return {
    prominentDisclosureStatus: {
      granted: prominentDisclosureStatus === PERMISSION_GRANTED,
      status: prominentDisclosureStatus,
    },
    trackingTransparencyStatus,
    notificationsStatus,
    foregroundLocationPermissionStatus,
    backgroundLocationPermissionStatus,
  };
};
