import { Divider } from '@/UI';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { useCountUp } from 'use-count-up';

interface Props {
  title: string;
  value?: number;
  render?: () => ReactNode;
  path?: string;
}

export const CardHome: React.FC<Props> = ({ render, title, value, path }) => {
  const { value: countValue } = useCountUp({ end: value, duration: 1, isCounting: Boolean(value) });

  return (
    <div className="bg-white p-4 flex-1 h-full overflow-hidden">
      <p className="mb-0 text-gray-500 font-semibold">{title}</p>
      <Divider className="my-4" />
      {Boolean(value) && (
        <Link href={path} className="font-bold text-3xl text-center mb-0 text-black block">
          {countValue}
        </Link>
      )}
      {Boolean(render) && render()}
    </div>
  );
};
