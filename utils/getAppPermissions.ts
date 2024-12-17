import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TrackingTransparency from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSION_GRANTED, STORAGE_USER_PD_STATUS } from '../constants';
import * as ImagePicker from 'expo-image-picker';

export const getAppPermissions = async (): Promise<Record<string, any>> => {
  const [
    prominentDisclosureStatus,
    trackingTransparencyStatus,
    notificationsStatus,
    providerStatus,
    serviceEnabled,
    locationAvailable,
    foregroundLocationPermissionStatus,
    backgroundLocationPermissionStatus,
    mediaLibraryPermissionsStatus,
    cameraPermissionsStatus,
  ] = await Promise.all([
    AsyncStorage.getItem(STORAGE_USER_PD_STATUS),
    TrackingTransparency.getTrackingPermissionsAsync(),
    Notifications.getPermissionsAsync(),
    Location.getProviderStatusAsync(),
    Location.hasServicesEnabledAsync(),
    Location.isBackgroundLocationAvailableAsync(),
    Location.getForegroundPermissionsAsync(),
    Location.getBackgroundPermissionsAsync(),
    ImagePicker.getMediaLibraryPermissionsAsync(),
    ImagePicker.getCameraPermissionsAsync(),
  ]);
  return {
    prominentDisclosureStatus: {
      granted: prominentDisclosureStatus === PERMISSION_GRANTED,
      status: prominentDisclosureStatus,
    },
    trackingTransparencyStatus,
    notificationsStatus,
    locationStatus: {
      providerStatus,
      serviceEnabled,
      locationAvailable,
      foregroundLocationPermissionStatus,
      backgroundLocationPermissionStatus,
    },
    imagePickerStatus: {
      mediaLibraryPermissionsStatus,
      cameraPermissionsStatus,
    },
  };
};
