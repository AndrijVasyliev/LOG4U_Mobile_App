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

  const { routeToFormPush } = useGlobalSearchParams<{
    routeToFormPush?: string;
  }>();
  const router = useRouter();

  React.useEffect(() => {
    let navigateTo = '';
    if (!userData) {
      navigateTo = '/';
    } else if (routeToFormPush) {
      navigateTo = routeToFormPush;
    } else {
      if (userData.type === 'Owner' || userData.type === 'Coordinator') {
        navigateTo = '/home/trucks';
      } else {
        navigateTo = '/home/profile';
      }
    }
    if (navigateTo) {
      setTimerId(setTimeout(() => router.navigate(navigateTo), ROUTE_SET_DELAY));
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
        setTimeout(undefined);
      }
    };
  }, [userData]);

  React.useEffect(() => {
    if (userData && routeToFormPush) {
      setTimerId(
        setTimeout(() => router.navigate(routeToFormPush), ROUTE_SET_DELAY),
      );
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
        setTimeout(undefined);
      }
    };
  }, [routeToFormPush]);

  return (
    <UserDataContext.Provider value={[userData, setUserData]}>
      {children}
    </UserDataContext.Provider>
  );
};
