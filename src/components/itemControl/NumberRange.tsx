import {
  Input,
  InputNumber,
  Form,
  InputNumberProps,
  FormItemProps,
} from 'antd';
import React, { memo } from 'react';
import { getDefaultValue } from './const';
import styles from './index.module.less';

const { Item } = Form;

interface ItemProps extends FormItemProps {
  dataIndex: string[];
}

interface MProps {
  controlProps: InputNumberProps;
  itemProps: ItemProps;
}

interface Iprops extends InputNumberProps {
  minProps: MProps;
  maxProps: MProps;
  data: {
    [key: string]: any;
  };
}

const NumberRange: React.FC<Iprops> = (props) => {
  const { minProps, maxProps, data, ...rest } = props;
  const { itemProps: minItem, controlProps: minControl } = minProps || {};
  const { itemProps: maxItem, controlProps: maxControl } = maxProps || {};

  return (
    <Input.Group className={styles['input-group-box']}>
      <Item
        initialValue={getDefaultValue({ name: minItem.dataIndex, data })}
        name={minItem.dataIndex}
        noStyle
        {...minItem}
      >
        <InputNumber
          type="number"
          className={styles['input-group-left']}
          placeholder="最小值"
          {...minControl}
          {...rest}
        />
      </Item>
      <Input
        className={styles['input-group-center']}
        placeholder="~"
        disabled
      />
      <Item
        initialValue={getDefaultValue({ name: maxItem.dataIndex, data })}
        name={maxItem.dataIndex}
        noStyle
        {...maxItem}
      >
        <InputNumber
          type="number"
          className={styles['input-group-right']}
          placeholder="最大值"
          {...maxControl}
          {...rest}
        />
      </Item>
    </Input.Group>
  );
};

export default memo(NumberRange);
