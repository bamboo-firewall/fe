import React from 'react';

interface Props {
  data: string;
}

export const YamlViewer: React.FC<Props> = ({ data }) => {
  const arr = data.split('\n');

  const result = arr.map((item: string, index) => {
    let content;

    if (item.includes(': ') || item.endsWith(':')) {
      const key = item.split(':')[0];
      const value = item.split(': ')[1];
      content = (
        <pre className="mb-0 json-property">
          {key}: <span className="json-string">{value}</span>
        </pre>
      );
    } else {
      content = <pre className="mb-0 json-string">{item}</pre>;
    }

    return (
      <div key={index} className="flex hover:bg-gray-200 transition-all">
        <div className="select-none text-gray-500 w-[50px] text-center json-border mr-3">{index + 1}</div>
        {content}
      </div>
    );
  });
  return <div className="bg-slate-50 py-2">{result}</div>;
};
