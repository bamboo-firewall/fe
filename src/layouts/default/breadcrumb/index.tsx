import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Breadcrumb } from '@/UI';
import cn from 'classnames';

const BreadCrumbApp: React.FC = () => {
  const router = useRouter();
  const pathSnippets = router.pathname.split('/').filter((i) => i);
  const breadcrumbNameMap: Record<string, string> = {
    '/profile': 'Profile',
    '/users': 'Users',
    '/groups': 'Groups',
    '/globalNetworkPolicy': 'GlobalNetworkPolicy',
    '/hostEndpoint': 'HostEndpoint',
    '/globalNetworkSet': 'GlobalNetworkSet',
  };

  const extraBreadcrumbItems = pathSnippets.map((item, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    let params = breadcrumbNameMap[url];

    if (!breadcrumbNameMap[url] && !isEmpty(params)) {
      const paramKey = Object.keys(params)[0];
      params = params[paramKey];
    }

    return {
      title: (
        <Link href={url} className="!text-black">
          {params}
        </Link>
      ),
    };
  });

  const breadcrumbItems = [
    {
      title: (
        <Link
          href="/"
          className={cn({
            '!text-black': extraBreadcrumbItems.length === 0,
          })}
        >
          <HomeOutlined rev={undefined} /> Home
        </Link>
      ),
    },
    ...extraBreadcrumbItems,
  ];

  return <Breadcrumb className="mb-5" items={breadcrumbItems} />;
};

export default BreadCrumbApp;
