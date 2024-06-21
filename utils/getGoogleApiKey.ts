import { Platform } from 'react-native';
import { GOOGLE_API_KEY_ANDROID, GOOGLE_API_KEY_IOS } from '../constants';

export const getGoogleApiKey = () => {
  if (Platform.OS === 'android') {
    return GOOGLE_API_KEY_ANDROID;
  }
  if (Platform.OS === 'ios') {
    return GOOGLE_API_KEY_IOS;
  }
};
