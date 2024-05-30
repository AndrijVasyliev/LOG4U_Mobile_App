import * as React from 'react';

export type UserData = {
  id: string;
  fullName: string;
  appLogin: string;
  appPassword: string;
  type:
    | 'Driver'
    | 'Owner'
    | 'OwnerDriver'
    | 'Coordinator'
    | 'CoordinatorDriver';
  deviceId: string;
  useGoogleMaps?: boolean;
};

export const UserDataContext = React.createContext<
  [userData: UserData, setUserData: (userData: UserData) => void]
>(null!);

export const useUserData = function useUserData() {
  return React.useContext(UserDataContext);
};
