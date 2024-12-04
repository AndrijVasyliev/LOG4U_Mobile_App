import * as React from 'react';
import { UserDataContext } from './userData';
import { FETCH_TIMEOUT, HTTP_UNAUTHORIZED } from '../constants';
import { NotAuthorizedError } from '../utils/notAuthorizedError';
import { getHeaders } from '../utils/getHeaders';
import { getDeviceId } from '../utils/deviceId';

export const useFetch = function useFetch() {
  const ctx = React.useContext(UserDataContext);

  console.log('HER', ctx);

  return async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const deviceId = await getDeviceId();

    console.log('BLJAD', ctx);

    const {
      userData: { appLogin: login, appPassword: password },
      logout,
    } = ctx;

    if (!login || !password) {
      throw new NotAuthorizedError(
        `No ${!login ? 'login' : ''}${!login && !password ? ' and ' : ''}${!password ? 'password' : ''} specified`,
      );
    }
    const response = await fetch(input, {
      headers: getHeaders({ login, password, deviceId }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      ...init,
    });
    if (response.status === HTTP_UNAUTHORIZED) {
      logout();
      throw new NotAuthorizedError('Wrong credentials');
    }
    return response;
  };
};
