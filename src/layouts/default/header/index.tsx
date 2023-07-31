import React, { useEffect, useState } from 'react';
import { Dropdown, MenuProps } from '@/UI';
import { ProfileOutlined, LogoutOutlined, UsergroupAddOutlined, GroupOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { ArrowDownIcon } from '@/components/icons';
import { useRouter } from 'next/router';
import { useAuth } from '@/provider/AppProvider';
import { CAN_VIEW } from '@/configs/authorize';
import { AvatarApp } from '@/components/common/Avatar';
import { useQueryClient } from '@tanstack/react-query';

const items: MenuProps['items'] = [
  {
    label: 'Profile',
    key: '/profile',
    icon: (
      <ProfileOutlined
        rev={undefined}
        style={{
          fontSize: '16px',
        }}
      />
    ),
  },
  {
    type: 'divider',
  },
  {
    label: <div>Users</div>,
    key: '/users',
    icon: (
      <UsergroupAddOutlined
        rev={undefined}
        style={{
          fontSize: '16px',
        }}
      />
    ),
  },
  {
    label: <div>Groups</div>,
    key: '/groups',
    icon: (
      <GroupOutlined
        rev={undefined}
        style={{
          fontSize: '16px',
        }}
      />
    ),
  },
  {
    type: 'divider',
  },
  {
    label: <div>Log out</div>,
    key: 'logout',
    icon: (
      <LogoutOutlined
        rev={undefined}
        style={{
          fontSize: '16px',
        }}
      />
    ),
    danger: true,
  },
];

const Header = () => {
  const router = useRouter();
  const [navItems, setNavItems] = useState(items);
  const { userInfo } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    setNavItems(
      items.filter((item: any) => {
        if (CAN_VIEW[userInfo?.role] === '*') return item;
        if (CAN_VIEW[userInfo?.role]?.includes(item.key as string) || item.key === 'logout') {
          return item;
        }
      })
    );
  }, [userInfo]);

  const onMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'logout': {
        queryClient.removeQueries(['userInfo']);
        localStorage.clear();
        router.push('/login');
        break;
      }
      case '/profile':
      case '/users':
      case '/groups': {
        router.push(key);
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <header className="flex justify-between h-16">
      <Link href="/" className="text-green-600">
        <div className="logo flex items-center justify-center w-44 h-full ml-8">
          <img className="w-[50px]" src="./logo.png" alt="Logo" />
          <span className="ml-3 text-xl whitespace-nowrap">Bamboo Firewall</span>
        </div>
      </Link>

      <Dropdown
        menu={{
          items: navItems,
          onClick: onMenuClick,
        }}
        trigger={['click']}
      >
        <div className="w-56 flex items-center cursor-pointer my-auto mx-0 justify-end mr-8">
          <div className="mr-2">
            <AvatarApp />
          </div>
          <div className="flex text-black ">
            <ArrowDownIcon />
          </div>
        </div>
      </Dropdown>
    </header>
  );
};

export default Header;
