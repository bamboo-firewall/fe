/* eslint-disable no-unused-vars */
import React, { ReactNode, useMemo, useState } from 'react';
import cn from 'classnames';
import { Tabs, message } from '@/UI';
import { TabsProps } from 'antd';
import { ArrowLeft, ArrowRight, CopyIcon, StepBackward, StepForward } from '../icons';
import { IGns, IHep, IPolicy } from '@/interfaces';
import { stringify as yamlStringify } from 'yaml';
import { onCopy } from '@/utils/functions';
import { JsonViewer } from './JsonViewer';
import { YamlViewer } from './YamlViewer';

interface Props {
  listRecord: IPolicy[] | IHep[] | IGns[];
  record: IPolicy | IHep | IGns;
}

interface RecordControllerProps {
  currentRecord: IPolicy | IHep | IGns;
  listRecord: IPolicy[] | IHep[] | IGns[];
  setCurrentRecord: (record: any) => void;
}

interface TabProp {
  data: string;
  render: (data: string) => ReactNode;
}

const ContentViewer: React.FC<Props> = ({ listRecord, record }) => {
  const [activeKey, setActiveKey] = useState('json');
  const [currentRecord, setCurrentRecord] = useState(record);

  const items: TabsProps['items'] = [
    {
      key: 'json',
      label: 'JSON',
      children: (
        <Tab data={JSON.stringify(currentRecord, null, 1)} render={(data) => <JsonViewer data={data} />} />
      ),
    },
    {
      key: 'yaml',
      label: 'YAML',
      children: <Tab data={yamlStringify(currentRecord)} render={(data) => <YamlViewer data={data} />} />,
    },
  ];

  const onChangeTab = (key: string) => setActiveKey(key);

  return (
    <div className="h-full pb-10">
      <RecordController
        currentRecord={currentRecord}
        listRecord={listRecord}
        setCurrentRecord={setCurrentRecord}
      />
      <Tabs accessKey={activeKey} items={items} onChange={onChangeTab} />
    </div>
  );
};

const RecordController: React.FC<RecordControllerProps> = ({
  currentRecord,
  listRecord,
  setCurrentRecord,
}) => {
  const currentRecordIndex = listRecord.findIndex(
    (item) => item?.metadata?.uid === currentRecord?.metadata?.uid
  );

  const onChangeRecord = (type: 'prev' | 'next') => {
    if (type === 'prev' && currentRecordIndex === 0) return;
    if (type === 'next' && currentRecordIndex === listRecord.length - 1) return;
    const index = type === 'prev' ? currentRecordIndex - 1 : currentRecordIndex + 1;
    setCurrentRecord(listRecord[index]);
  };

  const onStepToEndList = (type: 'prev' | 'next') => {
    if (type === 'prev') {
      setCurrentRecord(listRecord[0]);
      return;
    }
    setCurrentRecord(listRecord[listRecord.length - 1]);
  };

  const prevClassName = useMemo(
    () =>
      cn('cursor-pointer transition-all text-gray-700', {
        '!text-gray-300 cursor-not-allowed': currentRecordIndex === 0,
      }),
    [currentRecordIndex]
  );

  const nextClassName = useMemo(
    () =>
      cn('cursor-pointer transition-all text-gray-700', {
        '!text-gray-300 cursor-not-allowed': currentRecordIndex === listRecord.length - 1,
      }),
    [currentRecordIndex, listRecord]
  );

  return (
    <div className="flex justify-between items-center">
      <p className="text-lg">
        <span className="font-bold">Name:</span> {currentRecord?.metadata?.name}
      </p>
      <div className="flex gap-4">
        <StepBackward className={prevClassName} onClick={() => onStepToEndList('prev')} />
        <ArrowLeft className={prevClassName} onClick={() => onChangeRecord('prev')} />
        <div className="flex gap-2">
          <span className="text-blue-500 font-bold select-none">{currentRecordIndex + 1}</span>
          <span>of</span>
          <span className="font-bold select-none">{listRecord.length}</span>
        </div>
        <ArrowRight className={nextClassName} onClick={() => onChangeRecord('next')} />
        <StepForward className={nextClassName} onClick={() => onStepToEndList('next')} />
      </div>
    </div>
  );
};

const Tab: React.FC<TabProp> = ({ data, render }) => {
  const onCopyToClipboard = () => {
    onCopy(data);
    message.success('Copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-full">
      <a
        className="flex justify-end items-center gap-2 text-blue-600 cursor-pointer mb-3"
        onClick={onCopyToClipboard}
      >
        <CopyIcon /> Copy to clipboard
      </a>
      <div className="flex-1 overflow-auto">{render(data)}</div>
    </div>
  );
};

export default ContentViewer;
