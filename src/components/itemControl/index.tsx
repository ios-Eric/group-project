/**
 * 该组件是单个控件的组件
 * @type 控件类型
 * @controlProps 单个控件所具有的初始属性值
 * @dictProps 字典匹配的props
 */
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { DatePicker, Select, Input, InputNumber, Radio } from 'antd';
import SearchSelect from '../searchSelect';
import { getDictOptions } from '../formComponent/const.js';
import NumberRange from './NumberRange';
import TextFold from '../textFold';

const { RangePicker }: { RangePicker: any } = DatePicker;
const { TextArea } = Input;

export interface IItemControlProps {
  type: string;
  controlProps: any;
  dictProps?: any;
  value?: any;
}

const ItemControl: React.FC<IItemControlProps> = (props) => {
  const { type, controlProps, dictProps, ...rest } = props;
  const { dictKey, onlySelectData, delSelectData, disabledOption } =
    dictProps || {};
  const { DICTS } = useSelector((state: any) => state.publicData.DICTS);

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
      children = <Input autoComplete="off" {...controlProps} {...rest} />;
      break;
    case 'select':
      children = (
        <Select
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          {...autoItemProps}
          {...rest}
        />
      );
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
      children = <DatePicker format="YYYY-MM-DD" {...controlProps} {...rest} />;
      break;
    case 'dateRange':
      children = <RangePicker {...controlProps} {...rest} />;
      break;
    case 'textArea':
      children = <TextArea {...controlProps} {...rest} />;
      break;
    case 'textFold':
      children = <TextFold {...controlProps} {...rest} />;
      break;
    case 'radio':
      children = <Radio.Group {...controlProps} {...rest} />;
      break;
  }
  return children;
};

export default memo(ItemControl);
