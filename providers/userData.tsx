import * as React from 'react';
import { UserData, UserDataContext } from '../hooks/userData';
import { useRouter } from 'expo-router';

export const UserDataProvider = function UserDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = React.useState<UserData | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    if (!userData) {
      router.navigate('/');
    } else {
      if (userData.type === 'Owner' || userData.type === 'Coordinator') {
        router.navigate('/home/trucks');
      } else {
        router.navigate('/home/profile');
      }
    }
  }, [userData]);

  return (
    <UserDataContext.Provider value={[userData, setUserData]}>
      {children}
    </UserDataContext.Provider>
  );
};
