import ProjectDougnut from '@/modules/home/ProjectDougnut';
import WordWarp from '@/modules/home/WordCloud';
import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';
import * as BambooService from '@/services/Bamboo.service';
import { APIResponse } from '@/interfaces';
import { IProject } from '@/services/interfaces';
import { CardHome } from '@/modules/home/CardHome';
import useWindowSize from '@/hooks/useWindowSize';
import cn from 'classnames';
import { useAuth } from '@/provider/AppProvider';

interface IStatistic {
  summary: {
    total_global_network_set: number;
    total_policy: number;
    total_host_endpoint: number;
    total_user: number;
  };
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const { userInfo } = useAuth();
  const { data: statistic } = useQuery(
    ['statistic'],
    async () => {
      const res: APIResponse<IStatistic> = await BambooService.getStatistic();
      if (res?.error) return;
      return res?.data;
    },
    {
      keepPreviousData: true,
    }
  );

  const { data: projects } = useQuery(
    ['projects'],
    async () => {
      const res: APIResponse<{
        project_summary: IProject[];
      }> = await BambooService.getProjectStatistic();
      if (res?.error) return;
      return res?.data;
    },
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  return (
    <div className="h-full gap-4 flex flex-col">
      <div className="flex justify-between gap-4">
        <CardHome
          path="/globalNetworkPolicy"
          title="Total Policies"
          value={statistic?.summary?.total_policy}
        />
        <CardHome
          path="/globalNetworkSet"
          title="Total NetworkSets"
          value={statistic?.summary?.total_global_network_set}
        />
        <CardHome
          path="/hostEndpoint"
          title="Total HostEndpoints"
          value={statistic?.summary?.total_host_endpoint}
        />
        {userInfo?.role === 'admin' && (
          <CardHome path="/users" title="Total Users" value={statistic?.summary?.total_user} />
        )}
      </div>
      <div className={cn('flex justify-between gap-4  overflow-auto')}>
        <CardHome title="Projects" render={() => <ProjectDougnut data={projects?.project_summary} />} />
        <CardHome title="All Projects" render={() => <WordWarp data={projects?.project_summary} />} />
      </div>
    </div>
  );
}
