import { Spin, message } from '@/UI';
import * as BambooService from '@/services/Bamboo.service';
import DefaultLayout from '@/layouts/default';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { APIResponse, IUser } from '@/interfaces';

interface Props {
  children: ReactNode;
}

interface IContextValue {
  userInfo: IUser | undefined;
}

const AppContext = createContext<IContextValue>(null);
const PUBLIC_ROUTES = ['/login'];

const AppProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();

  const isPublicRoute = useMemo(() => PUBLIC_ROUTES.includes(router.pathname), [router.pathname]);

  const { data: userInfo } = useQuery(
    ['userInfo'],
    async () => {
      const res: APIResponse<IContextValue['userInfo']> = await BambooService.getUserInfo();
      if (res?.error) return null;
      message.success(`Welcome back, ${res?.data?.name}`);

      const role = res?.data?.role ?? 'user';
      return { ...res?.data, role: role.toLowerCase() as IUser['role'] };
    },
    {
      staleTime: Infinity,
      enabled: Boolean(isAuthenticated && !isPublicRoute),
    }
  );

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      if (isPublicRoute) setIsAuthenticated(false);
      else router.push('/login');
      return;
    }

    if (isPublicRoute) router.push('/');
    setIsAuthenticated(true);
  }, [router, isPublicRoute]);

  const contextValue: IContextValue = useMemo(() => {
    return {
      userInfo,
    };
  }, [userInfo]);

  if (typeof isAuthenticated === 'undefined')
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin />
      </div>
    );

  if (isPublicRoute && !isAuthenticated) return <>{children}</>;

  return (
    <AppContext.Provider value={contextValue}>
      <DefaultLayout>{children}</DefaultLayout>
    </AppContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AppContext);
};

export default AppProvider;
