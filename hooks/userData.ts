import * as React from 'react';

export type UserData = {
  id: string;
  fullName: string;
  type:
    | 'Driver'
    | 'Owner'
    | 'OwnerDriver'
    | 'Coordinator'
    | 'CoordinatorDriver';
  deviceId: string;
  useGoogleMaps?: boolean;
};

export type AppCredentials = {
  appLogin: string;
  appPassword: string;
};

export const UserDataContext = React.createContext<{
  userData: UserData & AppCredentials;
  setUserData: (userData: UserData) => void;
  setAppCredentials: (appCredentials: AppCredentials) => void;
  logout: () => void;
}>(null!);

export const useUserData = function useUserData() {
  return React.useContext(UserDataContext);
};
