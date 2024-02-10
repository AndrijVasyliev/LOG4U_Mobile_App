import { encode as btoa } from 'base-64';
import { BUILD_VERSION } from '../constants';

export const getHeaders = ({
  login,
  password,
  deviceId,
}: {
  login: string;
  password: string;
  deviceId: string;
}): Headers => {
  const headers = new Headers();
  headers.set('X-User-Login', `${login}`);
  headers.set('X-Device-Id', `${deviceId}`);
  headers.set('X-App-Version', `${BUILD_VERSION}`);
  headers.set('Authorization', 'Basic ' + btoa(login + ':' + password));
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  return headers;
};
