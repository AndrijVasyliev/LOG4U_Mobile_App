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
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(undefined);
    }

    if (!userData) {
      setTimerId(
        setTimeout(() => {
          if (routeToFromPush) {
            router.navigate({ pathname: '/', params: { routeToFromPush } });
          } else {
            router.navigate('/');
          }
          setTimerId(undefined);
        }, ROUTE_SET_DELAY),
      );
    } else if (routeToFromPush) {
      setTimerId(
        setTimeout(() => {
          router.navigate(routeToFromPush);
          setTimerId(undefined);
        }, ROUTE_SET_DELAY),
      );
    } else {
      let navigateTo = '';
      if (userData.type === 'Owner' || userData.type === 'Coordinator') {
        navigateTo = '/home/trucks';
      } else {
        navigateTo = '/home/profile';
      }
      setTimerId(
        setTimeout(() => {
          router.navigate(navigateTo);
          setTimerId(undefined);
        }, ROUTE_SET_DELAY),
      );
    }
  }, [userData]);

  React.useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(undefined);
    }

    if (userData && routeToFromPush) {
      setTimerId(
        setTimeout(() => {
          router.navigate(routeToFromPush);
          setTimerId(undefined);
        }, ROUTE_SET_DELAY),
      );
    }
  }, [routeToFromPush]);

  /*React.useEffect(() => {
    if (!userData) {
      router.navigate('/');
    } else if (routeToFromPush) {
      router.navigate(routeToFromPush);
    } else {
      if (userData.type === 'Owner' || userData.type === 'Coordinator') {
        router.navigate('/home/trucks');
      } else {
        router.navigate('/home/profile');
      }
    }
  }, [userData]);

  React.useEffect(() => {
    if (userData && routeToFromPush) {
      router.navigate(routeToFromPush);
    }
  }, [routeToFromPush]);*/

  return (
    <UserDataContext.Provider value={[userData, setUserData]}>
      {children}
    </UserDataContext.Provider>
  );
};
