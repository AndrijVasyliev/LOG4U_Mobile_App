import * as React from 'react';
import { UserData, UserDataContext } from '../hooks/userData';
import { useRouter, useGlobalSearchParams } from 'expo-router';

export const UserDataProvider = function UserDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = React.useState<UserData | null>(null);

  const { routeToFormPush } = useGlobalSearchParams<{
    routeToFormPush?: string;
  }>();
  const router = useRouter();

  React.useEffect(() => {
    if (!userData) {
      router.navigate('/');
    } else if (routeToFormPush) {
      router.navigate(routeToFormPush);
    } else {
      if (userData.type === 'Owner' || userData.type === 'Coordinator') {
        router.navigate('/home/trucks');
      } else {
        router.navigate('/home/profile');
      }
    }
  }, [userData]);

  React.useEffect(() => {
    if (userData && routeToFormPush) {
      router.navigate(routeToFormPush);
    }
  }, [routeToFormPush]);

  return (
    <UserDataContext.Provider value={[userData, setUserData]}>
      {children}
    </UserDataContext.Provider>
  );
};
