import React, { useState } from 'react';
import { BranchesOutlined, ClusterOutlined, FilePptOutlined, HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from '@/components/icons';

const MENUS = [
  {
    label: 'Home',
    path: '/',
    icon: (
      <HomeOutlined
        rev={undefined}
        style={{
          fontSize: '18px',
        }}
      />
    ),
  },

  {
    label: 'GlobalNetworkPolicy',
    path: '/globalNetworkPolicy',
    icon: (
      <FilePptOutlined
        rev={undefined}
        style={{
          fontSize: '18px',
        }}
      />
    ),
  },
  {
    label: 'HostEndpoint',
    path: '/hostEndpoint',
    icon: (
      <ClusterOutlined
        rev={undefined}
        style={{
          fontSize: '18px',
        }}
      />
    ),
  },
  {
    label: 'GlobalNetworkSet',
    path: '/globalNetworkSet',
    icon: (
      <BranchesOutlined
        rev={undefined}
        style={{
          fontSize: '18px',
        }}
      />
    ),
  },
];

const SiderApp = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  return (
    <div
      className={cn('w-[220px] flex flex-col justify-between h-full overflow-hidden transition-all ', {
        '!w-[60px]': collapsed,
      })}
    >
      <div className="w-full ">
        {MENUS.map((navitem) => {
          const activeLink = router.pathname === navitem.path;

          return (
            <Link
              key={navitem.path}
              href={navitem.path}
              className={cn(
                'px-4  py-2 mx-1 rounded mb-1 nav-item flex gap-3 h-[40px] text-black opacity-[88%] transition-all items-center',
                {
                  'nav-active': activeLink,
                  'hover:bg-gray-100 ': !activeLink,
                  'justify-center': collapsed,
                }
              )}
            >
              <div>{navitem.icon}</div>
              {!collapsed && <div>{navitem.label}</div>}
            </Link>
          );
        })}
      </div>
      <div
        className="flex items-center justify-center p-4 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ArrowRight /> : <ArrowLeft />}
      </div>
    </div>
  );
};

export default SiderApp;
