import React, { useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { IProject } from '@/services/interfaces';
import { stringToColour } from '@/utils/functions';
import cn from 'classnames';
import { useRouter } from 'next/router';

interface Props {
  data: IProject[];
}

const ProjectDougnut: React.FC<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<IProject[]>(data);
  const router = useRouter();

  useEffect(() => {
    if (data) setChartData(data);
  }, [data]);

  const onChangeTag = (item: IProject) => {
    if (chartData.length === data.length) {
      setChartData([item]);
      return;
    }
    if (chartData.some((i) => i.project_name === item.project_name)) {
      const newData = chartData.filter((i) => i.project_name !== item.project_name);

      setChartData(newData.length ? newData : data);
      return;
    }

    setChartData([...chartData, item]);
  };

  const chartDataLabels = useMemo(() => {
    return {
      labels: chartData?.map((item) => item.project_name),
      datasets: [
        {
          label: 'Total',
          data: chartData?.map((item) => item.total),
          backgroundColor: chartData?.map(({ project_name }) => stringToColour(project_name)),
        },
      ],
    };
  }, [chartData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: chartData?.length !== data?.length,
        backgroundColor: '#fff',
        padding: 6,
        borderRadius: 4,
        color: '#000',
      },
    },
    onClick(evt, element) {
      const project = chartData[element[0]?.index];
      if (!project) return;
      router.push(`/hostEndpoint?project=${project.project_name}`);
    },
  };

  return (
    <div className="flex justify-between pb-4 h-full">
      <div className="h-[400px] my-4 w-2/3 mt-32">
        <Doughnut data={chartDataLabels} options={options} plugins={[ChartDataLabels as any]} />
      </div>
      <div className="overflow-y-auto h-[650px]">
        {data?.map((item) => {
          return (
            <ChartLabelTags
              key={item.project_name}
              data={item}
              onChangeTag={onChangeTag}
              isEnable={
                chartData?.some((i) => i.project_name === item.project_name) &&
                chartData?.length !== data?.length
              }
            />
          );
        })}
      </div>
    </div>
  );
};

const ChartLabelTags: React.FC<{
  data: IProject;
  // eslint-disable-next-line no-unused-vars
  onChangeTag: (item: IProject) => void;
  isEnable: boolean;
}> = ({ data, onChangeTag, isEnable }) => {
  const bgColor = stringToColour(data.project_name);

  return (
    <div
      className={cn('flex gap-3 items-center cursor-pointer transition-all rounded pl-2 py-[2px] mb-1 mr-2', {
        'bg-green-200': isEnable,
        'hover:bg-gray-100 ': !isEnable,
      })}
      onClick={() => onChangeTag(data)}
    >
      <div
        className="rounded"
        style={{
          backgroundColor: bgColor,
          height: '10px',
          width: '30px',
        }}
      ></div>
      <div>{data.project_name}</div>
    </div>
  );
};

export default ProjectDougnut;
