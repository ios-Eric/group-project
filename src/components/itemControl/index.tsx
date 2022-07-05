/**
 * 该组件是单个控件的组件
 * @type 控件类型
 * @controlProps 单个控件所具有的初始属性值
 * @dictProps 字典匹配的props
 */
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { DatePicker, Select, Input, InputNumber } from 'antd';
import SearchSelect from '../searchSelect';
import { getDictOptions } from '../formComponent/const.js';
import NumberRange from './NumberRange';

const { RangePicker }: { RangePicker: any } = DatePicker;

interface Iprops {
  type: string;
  controlProps: any;
  dictProps?: any;
  data?: any;
}

const ItemControl: React.FC<Iprops> = (props) => {
  const { type, controlProps, dictProps, ...rest } = props;
  const { dictKey, onlySelectData, delSelectData, disabledOption } =
    dictProps || {};
  const { DICTS } = useSelector((state: any) => state.Common.DICTS);

  const autoItemProps = { ...controlProps };

  // 处理字典匹配的下拉值
  if (dictKey) {
    autoItemProps.options = getDictOptions({
      DICTS,
      dictKey,
      onlySelectData,
      delSelectData,
      disabledOption,
    });
  }
  let children = <></>;
  switch (type) {
    case 'input':
      children = <Input {...controlProps} {...rest} />;
      break;
    case 'select':
      children = <Select {...autoItemProps} {...rest} />;
      break;
    case 'apiSelect':
      children = <SearchSelect {...controlProps} {...rest} />;
      break;
    case 'inputNumber':
      children = <InputNumber {...controlProps} {...rest} />;
      break;
    case 'numberRange':
      children = <NumberRange {...controlProps} {...rest} />;
      break;
    case 'date':
      children = <DatePicker {...controlProps} {...rest} />;
      break;
    case 'dateRange':
      children = <RangePicker {...controlProps} {...rest} />;
  }
  return children;
};

export default memo(ItemControl);
