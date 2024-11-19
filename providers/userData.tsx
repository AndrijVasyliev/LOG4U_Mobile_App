import * as React from 'react';
import { UserData, UserDataContext } from '../hooks/userData';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { ROUTE_SET_DELAY } from '../constants';

export const UserDataProvider = function UserDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [timerId, setTimerId] = React.useState<NodeJS.Timeout | undefined>(
    undefined,
  );

  const { routeToFromPush } = useGlobalSearchParams<{
    routeToFromPush?: string;
  }>();
  const router = useRouter();

  React.useEffect(() => {
    if (!userData) {
      setTimerId(
        setTimeout(() => {
          router.navigate('/');
          if (routeToFromPush) {
            router.setParams({ routeToFromPush });
          }
        }, ROUTE_SET_DELAY),
      );
    } else if (routeToFromPush) {
      setTimerId(
        setTimeout(() => router.navigate(routeToFromPush), ROUTE_SET_DELAY),
      );
    } else {
      let navigateTo = '';
      if (userData.type === 'Owner' || userData.type === 'Coordinator') {
        navigateTo = '/home/trucks';
      } else {
        navigateTo = '/home/profile';
      }
      setTimerId(
        setTimeout(() => router.navigate(navigateTo), ROUTE_SET_DELAY),
      );
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
        setTimeout(undefined);
      }
    };
  }, [userData]);

  React.useEffect(() => {
    if (userData && routeToFromPush) {
      setTimerId(
        setTimeout(() => router.navigate(routeToFromPush), ROUTE_SET_DELAY),
      );
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
        setTimeout(undefined);
      }
    };
  }, [routeToFromPush]);

  return (
    <UserDataContext.Provider value={[userData, setUserData]}>
      {children}
    </UserDataContext.Provider>
  );
};
