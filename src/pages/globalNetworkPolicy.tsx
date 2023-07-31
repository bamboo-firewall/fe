import React, { useMemo, useState } from 'react';
import { Button, Table, Pagination } from '@/UI';
import dayts from '@/utils/time';
import DrawerApp from '@/components/drawer';
import JsonViewer from '@/components/drawer/ContentViewer';
import { useQuery } from '@tanstack/react-query';
import * as BambooService from '@/services/Bamboo.service';
import { APIResponse, IPolicy } from '@/interfaces';
import { ColumnsType } from 'antd/es/table';
import { Filter } from '@/components/common/Filter';
import { uid } from '@/utils/functions';
import { DATE_FORMAT, PAGE_SIZE } from '@/configs/common';

const Policies: React.FC = () => {
  const [filter, setFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [policy, setPolicy] = useState({
    visible: false,
    record: null,
  });

  const { data, isFetching } = useQuery(
    ['policies', filter],
    async () => {
      const res: APIResponse<IPolicy[]> = await BambooService.searchPolicy({ options: filter });
      if (res?.error) return [];
      return res.data;
    },
    {
      staleTime: Infinity,
      keepPreviousData: true,
    }
  );

  const currentTableData: IPolicy[] = useMemo(
    () => data?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, data]
  );

  const columns: ColumnsType<IPolicy> = [
    {
      title: 'STT',
      key: 'ID',
      width: '3%',
      render: (_, __, index) => (
        <p className="text-center m-0">{(currentPage - 1) * PAGE_SIZE + index + 1}</p>
      ),
    },
    {
      title: 'Name',
      key: 'name',
      width: '15%',
      render: (_, record) => <span>{record?.metadata?.name}</span>,
    },
    {
      title: 'Selector',
      key: 'selector',
      width: '40%',
      render: (_, record) => <span>{record?.spec?.selector}</span>,
    },
    {
      title: 'Create',
      key: 'create',
      width: '10%',
      render: (_, record) => <span>{dayts(record?.metadata?.creationTimestamp).format(DATE_FORMAT)}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      width: '5%',
      render: (_, record) => {
        return <Button onClick={() => setPolicy({ record, visible: true })}>Detail</Button>;
      },
    },
  ];

  return (
    <div className="p-6 pt-4 bg-white h-full relative">
      <div className="flex flex-col justify-between h-full">
        <h2 className="mb-8">GlobalNetworkPolicy</h2>
        <Filter
          labels={['name']}
          type="globalnetworkpolicies"
          onSubmit={(value) => {
            setFilter(value);
            setCurrentPage(1);
          }}
        />
        <div className="h-full w-full overflow-auto">
          <Table
            bordered
            columns={columns}
            dataSource={currentTableData}
            rowKey={(record) => record?.metadata?.uid || uid(6)}
            pagination={false}
            loading={isFetching}
          />
        </div>

        <div className="flex justify-end mt-2">
          <Pagination
            pageSize={PAGE_SIZE}
            total={data?.length || 0}
            current={currentPage}
            onChange={(page) => {
              setCurrentPage(page);
            }}
            showSizeChanger={false}
          />
        </div>
      </div>
      <DrawerApp
        open={policy.visible}
        onClose={() => setPolicy({ ...policy, visible: false })}
        title="Detail"
      >
        <JsonViewer record={policy.record} listRecord={data} />
      </DrawerApp>
    </div>
  );
};

export default Policies;
