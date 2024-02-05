import 'react-native-get-random-values';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { v4 as uuidv4 } from 'uuid';

export const getDeviceId = async () => {
  let deviceId = '';
  try {
    if (Platform.OS === 'android') {
      deviceId = Application.getAndroidId();
    }
    if (Platform.OS === 'ios') {
      deviceId = await Application.getIosIdForVendorAsync();
    }
    if (!deviceId) {
      deviceId = 't:' + uuidv4().toString();
    }
  } catch (error) {
    console.log('Error, getting device Id: ', error);
  }
  return deviceId;
};
