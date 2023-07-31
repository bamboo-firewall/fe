/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Select, Spin } from '@/UI';
import lo from 'lodash';
import { capitalizeFirstLetter } from '@/utils/functions';
import { useQuery } from '@tanstack/react-query';
import * as BambooService from '@/services/Bamboo.service';
import { APIResponse } from '@/interfaces';
import { ISearchLabel, ISearchType } from '@/services/interfaces';

interface Props {
  type: ISearchType;
  labels: string[];
  onSubmit: (values: any) => void;
  getDefaultValue?: () => object;
}

interface SelectProps {
  value: string;
  type: ISearchType;
  label: ISearchLabel;
  onChange: (value: string, label: string) => void;
  filter: any;
  labels: string[];
}

export const Filter: React.FC<Props> = ({ type, labels, onSubmit, getDefaultValue }) => {
  const [formValues, setFormValues] = useState(getDefaultValue ? () => getDefaultValue() : {});

  useEffect(() => {
    const newValue = lo.map(formValues, (value: string, key: string) => {
      return {
        key,
        value,
      };
    });
    onSubmit(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  const onChange = (name: string, value: string) => {
    if (!value) {
      setFormValues((prev) => lo.omit(prev, name));
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormValues({});
    onSubmit([]);
  };

  return (
    <div className="flex gap-3 mb-4">
      {lo.map(labels, (label: ISearchLabel) => {
        return (
          <SelectCustom
            filter={formValues}
            key={label}
            value={formValues[label]}
            type={type}
            label={label}
            labels={labels}
            onChange={onChange}
          />
        );
      })}
      <Button type="text" onClick={handleClear} disabled={lo.isEmpty(formValues)}>
        Clear
      </Button>
    </div>
  );
};

const SelectCustom: React.FC<SelectProps> = ({ value, type, label, onChange, filter, labels }) => {
  const prevLabels = labels.slice(labels.indexOf(label), labels.length);
  const getFilter = () => lo.omit(filter, [...prevLabels, label]);
  const [filterQuery, setFilterQuery] = useState(() => getFilter());

  useEffect(() => {
    const newFilter = getFilter();
    setFilterQuery(newFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const { data } = useQuery(
    [type, label, filterQuery],
    async () => {
      const filter = getFilter();

      const params = {
        type,
        label,
        filter: lo.map(filter, (value: string, key: string) => ({ key, value })),
      };
      const res: APIResponse<{ key: string; value: string }[]> = await BambooService.getOptions(params);
      if (res?.error) return [];
      return res.data;
    },
    {
      staleTime: Infinity,
    }
  );

  const handleChange = (value: any) => {
    prevLabels.forEach((prevLabel) => {
      if (filter[prevLabel] && prevLabel !== label) {
        onChange(prevLabel, undefined);
      }
    });
    onChange(label, value);
  };

  const handleFilter = (input: string, option) =>
    ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase());

  const dropdownRender = (menu) => <Spin spinning={!data}>{menu}</Spin>;

  return (
    <Select
      value={value}
      className="w-[300px]"
      placeholder={capitalizeFirstLetter(label)}
      onChange={handleChange}
      showSearch
      allowClear
      onClear={() => onChange(label, null)}
      filterOption={handleFilter}
      dropdownRender={dropdownRender}
      options={data?.map(({ value }) => {
        return {
          label: value,
          value,
        };
      })}
    />
  );
};
