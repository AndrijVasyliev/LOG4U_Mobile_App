import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TrackingTransparency from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAppPermissions = async (): Promise<Record<string, any>> => {
  const [
    prominentDisclosureStatus,
    trackingTransparencyStatus,
    notificationsStatus,
    foregroundLocationPermissionStatus,
    backgroundLocationPermissionStatus,
  ] = await Promise.all([
    AsyncStorage.getItem('pdstatus'),
    TrackingTransparency.getTrackingPermissionsAsync(),
    Notifications.getPermissionsAsync(),
    Location.getForegroundPermissionsAsync(),
    Location.getBackgroundPermissionsAsync(),
  ]);
  return {
    prominentDisclosureStatus,
    trackingTransparencyStatus,
    notificationsStatus,
    foregroundLocationPermissionStatus,
    backgroundLocationPermissionStatus,
  };
};
