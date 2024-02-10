import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceId } from './deviceId';
import { NotAuthorizedError } from './notAuthorizedError';
import { getHeaders } from './getHeaders';
import { logout } from './logout';
import {
  FETCH_TIMEOUT,
  STORAGE_USER_LOGIN,
  STORAGE_USER_PASSWORD,
} from '../constants';

export const authFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const [login, password, deviceId] = await Promise.all([
    AsyncStorage.getItem(STORAGE_USER_LOGIN),
    AsyncStorage.getItem(STORAGE_USER_PASSWORD),
    getDeviceId(),
  ]);
  if (!login || !password) {
    throw new NotAuthorizedError(
      `No ${!login ? 'login' : ''}${!login && !password ? 'and' : ''}${!password ? 'password' : ''} specified`,
    );
  }
  const response = await fetch(input, {
    headers: getHeaders({ login, password, deviceId }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    ...init,
  });
  if (response.status === 401) {
    await logout();
    throw new NotAuthorizedError('Wrong credentials');
  }
  return response;
};
