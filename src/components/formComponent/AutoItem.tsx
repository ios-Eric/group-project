/**
 * 该组件是单个控件的组件
 * @form 表单实例
 * @item 单个控件所具有的初始属性值
 */
import { FC, memo } from 'react';
import { Form, Col } from 'antd';
// import _ from 'lodash';
import {
  handleSpecialValue,
  // changeFieldsValue,
  // refAutoFocus,
} from './const.js';
import ItemControl from '../itemControl';
import { IObject } from '@/common/constants/interface.js';

const { Item } = Form;

interface IAutoItemProps {
  form: any;
  item: IObject;
  control: IObject;
  colProps?: IObject;
  dictProps?: IObject;
  disabledAll?: boolean;
  itemStyle?: any;
}

const AutoItem: FC<IAutoItemProps> = ({
  colProps,
  form,
  item,
  control,
  dictProps,
  disabledAll,
  itemStyle,
}) => {
  const { colItemSpan } = colProps || {};
  const {
    required,
    rules = [], // 校验规则
    label, // label
    dataIndex, //name
    defaultValue,
    ...itemProps
  } = item || {};
  const { type, disabled, refFocus = false, ...controlProps } = control || {};

  console.info(form, refFocus);
  // 设置控件是否禁用
  const disabledCurrent = disabledAll || disabled;

  // 获取默认值（以及日期等特殊值处理）
  const defaultValueCurrent = handleSpecialValue({ type, val: defaultValue });
  // 定义校验规则（如果做搜索框则搜索项不设置 required 即可）
  if (required) {
    rules.push({ required: true, message: `${label}是必填项` });
  }

  const autoControlProps = { disabled: disabledCurrent, ...controlProps };

  return (
    <Col span={colItemSpan} key={dataIndex} {...colProps}>
      <Item
        label={label}
        name={dataIndex}
        style={itemStyle || { margin: 0 }}
        rules={rules}
        initialValue={defaultValueCurrent}
        {...itemProps}
      >
        <ItemControl
          type={type}
          dictProps={dictProps}
          controlProps={autoControlProps}
        />
      </Item>
    </Col>
  );
};

export default memo(AutoItem);
