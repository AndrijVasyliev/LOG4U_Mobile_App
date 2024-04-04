import * as React from 'react';
import { UserData, UserDataContext } from '../hooks/userData';

export const UserDataProvider = function UserDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = React.useState<UserData | null>(null);

  return (
    <UserDataContext.Provider value={[userData, setUserData]}>
      {children}
    </UserDataContext.Provider>
  );
};
