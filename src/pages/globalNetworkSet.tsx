import React, { useMemo, useState } from 'react';
import { Button, Table, Pagination, Tag } from '@/UI';
import dayts from '@/utils/time';
import DrawerApp from '@/components/drawer';
import { useQuery } from '@tanstack/react-query';
import { APIResponse, IGns } from '@/interfaces';
import * as BambooService from '@/services/Bamboo.service';
import { ColumnsType } from 'antd/lib/table';
import { generateTagColor, uid } from '@/utils/functions';
import JsonViewer from '@/components/drawer/ContentViewer';
import cn from 'classnames';
import { Filter } from '@/components/common/Filter';
import { DATE_FORMAT, PAGE_SIZE } from '@/configs/common';

const Gns: React.FC = () => {
  const [filter, setFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [gns, setGns] = useState({
    visible: false,
    record: null,
  });

  const { data, isFetching } = useQuery(
    ['gns', filter],
    async () => {
      const res: APIResponse<IGns[]> = await BambooService.searchGns({ options: filter });
      if (res?.error) return [];
      return res.data;
    },
    {
      staleTime: Infinity,
      keepPreviousData: true,
    }
  );

  const currentTableData: IGns[] = useMemo(
    () => data?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, data]
  );

  const columns: ColumnsType<IGns> = [
    {
      title: 'STT',
      key: 'stt',
      width: '3%',
      align: 'center',
      render: (_, __, index) => (
        <p className="text-center m-0">{(currentPage - 1) * PAGE_SIZE + index + 1}</p>
      ),
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => <span>{record?.metadata?.name}</span>,
    },
    {
      title: 'Subnets',
      key: 'Subnets',
      render: (_, record) => (
        <div className="h-[50px] overflow-auto bg-zinc-100 rounded">
          {record?.spec?.nets.map((item) => {
            return (
              <div className="hover:bg-zinc-200 px-4 transition-all" key={item}>
                <span className="select-none">- </span>
                {item}
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: 'Zone',
      key: 'zone',
      width: '10%',
      render: (_, record) => {
        const tagName = record?.metadata?.labels?.zone || 'null';
        const color = generateTagColor(tagName);

        return (
          <Tag
            color={color}
            className={cn({
              '!text-black !border !border-solid !border-gray-300': color === 'white',
            })}
          >
            {tagName}
          </Tag>
        );
      },
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
        return <Button onClick={() => setGns({ record, visible: true })}>Detail</Button>;
      },
    },
  ];

  return (
    <div className="p-6 pt-4 bg-white h-full relative">
      <div className="flex flex-col justify-between h-full">
        <h2 className="mb-8">GlobalNetworkSet</h2>
        <div className="flex items-center justify-between mb-6">
          <Filter
            labels={['zone', 'name']}
            type="globalnetworksets"
            onSubmit={(value) => {
              setFilter(value);
              setCurrentPage(1);
            }}
          />
        </div>
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
      <DrawerApp open={gns.visible} onClose={() => setGns({ ...gns, visible: false })} title="Detail">
        <JsonViewer record={gns.record} listRecord={data} />
      </DrawerApp>
    </div>
  );
};

export default Gns;
