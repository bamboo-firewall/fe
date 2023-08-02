import { useAuth } from '@/provider/AppProvider';
import { Button, Result, Spin } from '@/UI';
import Link from 'next/link';
import React from 'react';

interface Props {
  children: React.ReactNode;
  allowRole: string[];
  isRenderFallBack?: boolean;
}

export const Author: React.FC<Props> = ({ children, allowRole, isRenderFallBack = false }) => {
  const { userInfo } = useAuth();

  if (typeof userInfo === 'undefined')
    return (
      <div className="h-full flex items-center justify-center">
        <Spin />
      </div>
    );

  if (!allowRole.includes(userInfo?.role)) {
    return isRenderFallBack ? <FallBack /> : null;
  }
  return <>{children}</>;
};

const FallBack = () => (
  <div className="h-full flex items-center justify-center">
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary">
          <Link href={'/'}>Back Home</Link>
        </Button>
      }
    />
  </div>
);
