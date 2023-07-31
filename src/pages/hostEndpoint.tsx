import React, { useMemo, useState } from 'react';
import { Button, Table, Pagination, Tag } from '@/UI';
import dayts from '@/utils/time';
import DrawerApp from '@/components/drawer';
import { useQuery } from '@tanstack/react-query';
import * as BambooService from '@/services/Bamboo.service';
import { APIResponse, IHep } from '@/interfaces';
import { ColumnsType } from 'antd/lib/table';
import JsonViewer from '@/components/drawer/ContentViewer';
import { Filter } from '@/components/common/Filter';
import { generateTagColor, uid } from '@/utils/functions';
import { DATE_FORMAT, PAGE_SIZE } from '@/configs/common';
import cn from 'classnames';

const getDefaultFilter = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const project = urlParams.get('project');

  if (!project) return [];
  return [
    {
      key: 'project',
      value: project,
    },
  ];
};

const Hep: React.FC = () => {
  const [filter, setFilter] = useState(() => getDefaultFilter());
  const [currentPage, setCurrentPage] = useState(1);
  const [hep, setHep] = useState({
    visible: false,
    record: null,
  });

  const { data, isFetching } = useQuery(
    ['hep', filter],
    async () => {
      const res: APIResponse<IHep[]> = await BambooService.searchHep({ options: filter });
      if (res?.error) return [];
      return res.data;
    },
    {
      staleTime: Infinity,
      keepPreviousData: true,
    }
  );

  const currentTableData: IHep[] = useMemo(
    () => data?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, data]
  );

  const columns: ColumnsType<IHep> = [
    {
      title: 'STT',
      key: 'ID',
      width: '4%',
      render: (_, __, index) => (
        <p className="text-center m-0">{(currentPage - 1) * PAGE_SIZE + index + 1}</p>
      ),
    },
    {
      title: 'Name',
      key: 'name',
      width: '20%',
      render: (_, record) => <span>{record?.spec?.node}</span>,
    },
    {
      title: 'IP',
      key: 'IP',
      width: '20%',
      render: (_, record) => {
        return record.spec?.expectedIPs.map((item) => {
          return <Tag key={item}>{item}</Tag>;
        });
      },
    },
    {
      title: 'Interface',
      key: 'Interface',
      width: '8%',
      render: (_, record) => <span>{record?.spec?.interfaceName}</span>,
    },
    {
      title: 'Project',
      key: 'Project',
      render: (_, record) => <span>{record?.metadata?.labels?.project}</span>,
    },
    {
      title: 'Zone',
      key: 'Zone',
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
      title: 'Role',
      key: 'Role',
      render: (_, record) => <span>{record?.metadata?.labels?.role}</span>,
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
        return <Button onClick={() => setHep({ record, visible: true })}>Detail</Button>;
      },
    },
  ];

  return (
    <div className="p-6 pt-4 bg-white h-full relative">
      <div className="flex flex-col justify-between h-full">
        <h2 className="mb-8">HostEndpoint</h2>
        <Filter
          labels={['project', 'zone', 'role', 'ip', 'name']}
          type="hostendpoints"
          getDefaultValue={() => {
            const urlParams = new URLSearchParams(window.location.search);
            const project = urlParams.get('project');

            if (!project) return {};
            return {
              project,
            };
          }}
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
      <DrawerApp open={hep.visible} onClose={() => setHep({ ...hep, visible: false })} title="Detail">
        <JsonViewer record={hep.record} listRecord={data} />
      </DrawerApp>
    </div>
  );
};

export default Hep;
