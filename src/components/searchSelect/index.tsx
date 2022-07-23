/**
 * 该组件用于通过接口模糊查询数据的下拉列表
 * @placeholder 提示 默认“请输入”
 * @labelKey label取值 可传人字符串和数组，数组形式用于label是通过多个变量拼接而来
 * @valueKey value取值
 * @searchKey 模糊搜索入参键值
 * @requestFn 请求接口 传入为一个promise对象
 * @requestFn 模糊搜索入参键值
 * @otherPayLoad 其他需要代入到搜索接口的入参
 */
import React, { memo, useEffect, useState } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
import type { SelectProps } from 'antd';

const { Option } = Select;

interface IPrototype extends SelectProps {
  placeholder?: string;
  labelKey: string | any[];
  valueKey: string;
  searchKey: string;
  requestFn: Function;
  otherPayLoad?: object;
  optionDataSource?: string;
}

const SearchSelect: React.FC<IPrototype> = (props) => {
  const {
    placeholder,
    labelKey,
    valueKey,
    searchKey,
    requestFn,
    otherPayLoad,
    optionDataSource = 'records',
    ...rest
  } = props;

  const [optionList, setOptionList] = useState<any[]>([]);

  const getOptionList = (e: any) => {
    const params = {
      pageIndex: 1,
      pageSize: 100,
      [searchKey]: e,
      ...otherPayLoad,
    };
    requestFn(params).then((res: any) => {
      if (optionDataSource === 'result') {
        if (_.isArray(res)) {
          setOptionList(res);
        }
      } else {
        if (_.isArray(res.records)) {
          setOptionList(res.records);
        }
      }
    });
  };

  const setLabelKey = (e: any) => {
    if (Array.isArray(labelKey)) {
      let label = '';
      for (let i = 0; i < labelKey.length; i++) {
        label += `${e[labelKey[i]]} `;
      }
      return label;
    }
    return e[labelKey];
  };

  useEffect(() => {
    getOptionList('');
    return () => {
      setOptionList([]);
    };
  }, []);
  return (
    <>
      <Select
        allowClear
        showSearch
        filterOption={false}
        placeholder={placeholder || '请输入'}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        onSearch={_.debounce((e: any) => getOptionList(e), 300)}
        onFocus={_.debounce(() => getOptionList(''), 300)}
        {...rest}
      >
        {optionList.map((e: any) => (
          <Option
            key={e[valueKey] || e.id}
            title={setLabelKey(e)}
            value={e[valueKey]}
          >
            {setLabelKey(e)}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default memo(SearchSelect);
