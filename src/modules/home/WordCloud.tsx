import { IProject } from '@/services/interfaces';
import React, { useCallback, useMemo } from 'react';
import WordCloud from 'react-d3-cloud';

interface Props {
  data: IProject[];
}

const WordWarp: React.FC<Props> = ({ data }) => {
  const words = useMemo(() => {
    return data?.map(({ project_name, total }) => {
      return {
        value: total,
        text: project_name,
      };
    });
  }, [data]);

  const fontSize = useCallback(() => Math.random() * 20, []);
  const rotate = useCallback((word, index) => (index % 2 === 0 ? 0 : 90), []);

  return (
    <div className="overflow-hidden p-4">
      {words && (
        <WordCloud
          data={words}
          width={500}
          height={400}
          fontSize={fontSize}
          spiral="archimedean"
          rotate={rotate}
        />
      )}
    </div>
  );
};

export default WordWarp;
