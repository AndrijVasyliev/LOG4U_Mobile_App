import AsyncStorage from '@react-native-async-storage/async-storage';
import { stopLocation } from './location';

export const logout = async () => {
  return await Promise.all([
    AsyncStorage.removeItem('username'),
    AsyncStorage.removeItem('login'),
    AsyncStorage.removeItem('password'),
    stopLocation(),
  ]);
};
