import React, { useMemo, useState } from 'react';
import { Table, Pagination, Tag } from '@/UI';
import { Author } from '@/components/auth/author';
import { useQuery } from '@tanstack/react-query';
import { APIResponse, IUser } from '@/interfaces';
import * as BambooService from '@/services/Bamboo.service';
import { COLOR } from '@/configs/authorize';
import { PAGE_SIZE } from '@/configs/common';

const Group: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useQuery(
    ['users'],
    async () => {
      const res: APIResponse<IUser[]> = await BambooService.getAllUser();
      if (res?.error) return [];
      return res.data;
    },
    {
      keepPreviousData: true,
    }
  );

  const groupUsers = useMemo(() => {
    return data?.reduce((acc, cur) => {
      const { role } = cur;

      const group = acc.find((item) => item.name === role);

      if (!group) {
        acc.push({
          name: role,
          users: [cur],
        });
        return acc;
      }

      group.users.push(cur);
      return acc;
    }, []);
  }, [data]);

  const currentTableData: IUser[] = useMemo(
    () => groupUsers?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, groupUsers]
  );

  const columns: any = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: '3%',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '6%',
      render: (_, record) => <Tag color={COLOR[record?.name]}>{record?.name}</Tag>,
    },
    {
      title: 'Users',
      key: 'user',
      render: (_, record) => {
        return (
          <div className="flex flex-wrap">
            {record?.users?.map((user) => (
              <Tag key={user?.ID} className="mr-2">
                {user?.name}
              </Tag>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-white h-full">
      <div className="flex flex-col justify-between h-full">
        <div>
          <h2 className="mb-8">Groups</h2>
          <div className="overflow-auto">
            <Table
              bordered
              columns={columns}
              dataSource={currentTableData}
              rowKey={'name'}
              pagination={false}
            />
          </div>
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
    </div>
  );
};

const WithAuthorize = () => {
  return (
    <Author allowRole={['admin']} isRenderFallBack>
      <Group />
    </Author>
  );
};

export default WithAuthorize;
