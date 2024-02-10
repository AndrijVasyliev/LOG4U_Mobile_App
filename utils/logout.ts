import AsyncStorage from '@react-native-async-storage/async-storage';
import { stopLocation } from './location';
import {
  STORAGE_USER_NAME,
  STORAGE_USER_TYPE,
  STORAGE_USER_LOGIN,
  STORAGE_USER_PASSWORD,
} from '../constants';

export const logout = async () => {
  return await Promise.all([
    AsyncStorage.removeItem(STORAGE_USER_NAME),
    AsyncStorage.removeItem(STORAGE_USER_TYPE),
    AsyncStorage.removeItem(STORAGE_USER_LOGIN),
    AsyncStorage.removeItem(STORAGE_USER_PASSWORD),
    stopLocation(),
  ]);
};
