import AsyncStorage from '@react-native-async-storage/async-storage';
import { stopLocation } from './location';
import { STORAGE_USER_LOGIN, STORAGE_USER_PASSWORD } from '../constants';

export const logout = async () => {
  console.log('Logging out');
  return await Promise.all([
    AsyncStorage.removeItem(STORAGE_USER_LOGIN),
    AsyncStorage.removeItem(STORAGE_USER_PASSWORD),
    stopLocation(),
  ]);
};
