import React, { ReactNode } from 'react';
import cn from 'classnames';
import { handleCheckType, isContainBrace } from '@/utils/functions';

interface Props {
  data: string;
}

const renderDevider = (str: string): ReactNode => {
  return str.split('').map((item, index) => {
    if (item === ' ' && index !== 0)
      return (
        <span key={index}>
          <span className="json-devider"> </span>
          {item}
        </span>
      );
    return <span key={index}>{item}</span>;
  });
};

export const JsonViewer: React.FC<Props> = ({ data }) => {
  const arr = data.split('\n');

  const result = arr.map((item: string, index) => {
    const key = item.split(':')[0];
    const value = item.split(': ')[1];
    let content;

    if (!item.includes(': ')) {
      const { valueRemoved, type, isContainComma } = handleCheckType(item);

      content = (
        <pre
          className={cn('mb-0 overflow-hidden json-brace', {
            'json-string': !isContainBrace(valueRemoved),
            'json-number': type === 'number',
            'json-boolean': type === 'boolean',
            'json-null': type === 'null',
          })}
        >
          {renderDevider(valueRemoved)}
          {isContainComma && <span className="json-brace">,</span>}
        </pre>
      );
    } else {
      const { valueRemoved, type, isContainComma } = handleCheckType(value);

      content = (
        <div className="flex">
          <pre className="mb-0 json-property overflow-hidden">{renderDevider(key)}: </pre>
          {isContainBrace(item) ? (
            <pre className="mb-0 json-brace">{valueRemoved}</pre>
          ) : (
            <pre
              className={cn('mb-0 json-brace', {
                'json-string': !isContainBrace(valueRemoved),
                'json-number': type === 'number',
                'json-boolean': type === 'boolean',
                'json-null': type === 'null',
              })}
            >
              {valueRemoved}
              {isContainComma && <span className="json-null">,</span>}
            </pre>
          )}
        </div>
      );
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
