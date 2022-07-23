/**
 * 该组件只是表单和控件之间的中间层
 * @formItemArr 需要展示控件的数组
 * @formData 如果某个控件有接口返回的值需要赋值时传入
 */
import React, { memo, useEffect } from 'react';
import { FormItemProps } from 'antd';
import _ from 'lodash';
import AutoItem from './AutoItem';
import { IObject } from '@/common/constants/interface';

interface IFormItemProps extends FormItemProps {
  formItemArr: IObject[];
  formData: IObject;
  form: any;
  itemStyle?: any;
}

const FormItem: React.FC<IFormItemProps> = (props) => {
  const { formItemArr, formData, form, ...set } = props;

  useEffect(() => {
    form?.setFieldsValue(formData);
  }, [formData]);

  const content =
    !_.isEmpty(formItemArr) &&
    _.isArray(formItemArr) &&
    formItemArr.map((it: any, index: number) => {
      const { item } = it || {};
      const value = formData[item?.dataIndex] || '';
      return (
        <AutoItem
          key={item.dataIndex}
          index={index}
          value={value}
          form={form}
          {...it}
          {...set}
        />
      );
    });

  return content;
};

export default memo(FormItem);
