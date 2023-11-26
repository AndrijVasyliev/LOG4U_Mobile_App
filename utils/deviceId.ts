import 'react-native-get-random-values';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { v4 as uuidv4 } from 'uuid';
import { PERMISSION_GRANTED } from '../constants';

export const getDeviceId = async (
  prominentDisclosureStatus: string = PERMISSION_GRANTED,
) => {
  if (prominentDisclosureStatus !== PERMISSION_GRANTED) {
    return 'u:' + uuidv4().toString();
  }
  let deviceId = '';
  try {
    if (Platform.OS === 'android') {
      deviceId = Application.androidId;
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
