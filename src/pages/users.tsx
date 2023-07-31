import React, { useMemo, useState } from 'react';
import { Button, Table, Input, Pagination, message, Tag, MenuProps, Dropdown } from '@/UI';
import { Author } from '@/components/auth/author';
import { useQuery } from '@tanstack/react-query';
import * as BambooService from '@/services/Bamboo.service';
import { APIResponse, IUser } from '@/interfaces';
import { ColumnsType } from 'antd/es/table';
import { normalizeText } from '@/utils/functions';
import { ModalApp } from '@/components/modal';
import { useAuth } from '@/provider/AppProvider';
import { COLOR } from '@/configs/authorize';
import { PAGE_SIZE } from '@/configs/common';
import { UpdateUser } from '@/components/modal/UpdateUser';
import { ArrowDownIcon, DeleteIcon, EditIcon } from '@/components/icons';
import { UpdatePassword } from '@/components/modal/UpdatePassword';
import { CreateUser } from '@/components/modal/CreateUser';
import { DeleteUser } from '@/components/modal/DeleteUser';

const User: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [visible, setVisible] = useState({
    createNew: false,
    updateUser: false,
    updatePass: false,
    deleteUser: false,
  });
  const [currentRecord, setCurrentRecord] = useState<IUser>(null);
  const { userInfo } = useAuth();

  const { data, refetch } = useQuery(
    ['users'],
    async () => {
      const res: APIResponse<IUser[]> = await BambooService.getAllUser();
      if (res?.error) return [];
      return res.data;
    },
    {
      keepPreviousData: true,
      select: (user) => user.filter((item) => item?.name.toLowerCase().includes(searchValue.toLowerCase())),
    }
  );

  const columns: ColumnsType<IUser> = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: '3%',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: '10%',
      render: (_, record) => (
        <Tag color={COLOR[record?.role]} key={record?.ID} className="mr-2">
          {record?.role}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '5%',
      render: (_, record) => {
        if (record?.ID === userInfo?.user_id) return null;

        return (
          <Dropdown menu={{ items, onClick: ({ key }) => onMenuClick({ key, record }) }} trigger={['click']}>
            <Button size="small" type="text">
              Action <ArrowDownIcon />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const items: MenuProps['items'] = [
    {
      key: 'updateUser',
      label: (
        <div className="flex items-center gap-2">
          <EditIcon /> Update profile
        </div>
      ),
    },
    {
      key: 'updatePass',
      label: (
        <div className="flex items-center gap-2">
          <EditIcon /> Update password
        </div>
      ),
    },
    {
      key: 'deleteUser',
      label: (
        <div className="flex items-center gap-2">
          <DeleteIcon /> Delete account
        </div>
      ),
      danger: true,
    },
  ];

  const onMenuClick = ({ key, record }) => {
    setCurrentRecord(record);

    if (typeof visible[key] === 'undefined') return;
    setVisible({ ...visible, [key]: true });
  };

  const currentTableData: IUser[] = useMemo(
    () => data?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, data]
  );

  const onSearch = (value: string) => {
    const searchValue = normalizeText(value.trim());

    setSearchValue(searchValue);
    setCurrentPage(1);
  };

  const onChange = (e) => {
    const { value } = e.target;
    if (value === '') {
      setCurrentPage(1);
      setSearchValue('');
    }
  };

  const handleDeleteUser = async (id: string) => {
    const res: APIResponse = await BambooService.deleteUser({ id });
    if (res?.error) {
      message.error(res.error);
      return;
    }
    setVisible({ ...visible, deleteUser: false });
    refetch();
    message.success('Delete user successfully');
  };

  return (
    <div className="p-6 bg-white h-full">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between">
            <h2 className="mb-8">User management</h2>
            <Button
              type="primary"
              className="w-[300px]"
              onClick={() => setVisible({ ...visible, createNew: true })}
            >
              Add new
            </Button>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Input.Search
                placeholder="Name"
                allowClear
                enterButton="Search"
                onSearch={onSearch}
                onChange={onChange}
                className="w-[300px]"
                size="small"
              />
            </div>
          </div>
        </div>
        <div className="h-full w-full overflow-auto">
          <Table bordered columns={columns} dataSource={currentTableData} rowKey={'ID'} pagination={false} />
        </div>

        <div className="flex justify-end mt-2">
          <Pagination
            pageSize={10}
            current={currentPage}
            onChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </div>
      </div>
      <ModalApp
        open={visible.createNew}
        onCancel={() => setVisible({ ...visible, createNew: false })}
        title="Create new user"
      >
        <CreateUser refetchUser={refetch} onClose={() => setVisible({ ...visible, createNew: false })} />
      </ModalApp>
      <ModalApp
        open={visible.updateUser}
        onCancel={() => setVisible({ ...visible, updateUser: false })}
        title="Update user"
      >
        <UpdateUser
          user={currentRecord}
          onSubmit={async (values) => {
            const res: APIResponse = await BambooService.updateUser(values);
            setVisible({ ...visible, updateUser: false });
            if (res?.error) {
              message.error(res.error);
              return;
            }
            message.success('Update user successfully');
            refetch();
          }}
        />
      </ModalApp>
      <ModalApp
        open={visible.updatePass}
        onCancel={() => setVisible({ ...visible, updatePass: false })}
        title="Update password"
      >
        <UpdatePassword
          user={currentRecord}
          onSubmit={async (values) => {
            const res: APIResponse = await BambooService.updateUser(values);
            setVisible({ ...visible, updatePass: false });
            if (res?.error) {
              message.error(res.error);
              return;
            }
            message.success('Update user successfully');
          }}
        />
      </ModalApp>
      <ModalApp
        open={visible.deleteUser}
        onCancel={() => setVisible({ ...visible, deleteUser: false })}
        title="Delete user"
      >
        <DeleteUser
          user={currentRecord}
          onSubmit={handleDeleteUser}
          onCancel={() => setVisible({ ...visible, deleteUser: false })}
        />
      </ModalApp>
    </div>
  );
};

const WithAuthorize = () => {
  return (
    <Author allowRole={['admin']} isRenderFallBack>
      <User />
    </Author>
  );
};

export default WithAuthorize;
