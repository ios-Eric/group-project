/**
 * 该组件主要用于表单收集
 * @form 表单实例
 * @name 表单的名称
 * @children 子组件节点
 * @wrapperContainer 是否需要Row包裹Item
 * @formItemLayout 表单的布局
 */
import React, { memo, ReactNode } from 'react';
import { Form, FormProps, Row } from 'antd';
import { formItemLayout as itemLayout } from './const.js';
import { Gutter } from 'antd/lib/grid/row';

interface IFormWrapProps extends FormProps {
  children: ReactNode;
  formItemLayout?: any;
  rowGutter?: any[];
}

const FormWrap: React.FC<IFormWrapProps> = (props) => {
  const {
    children,
    form,
    name,
    formItemLayout = itemLayout,
    rowGutter = [0, 0],
    ...rest
  } = props;

  return (
    <Form
      form={form}
      colon={false}
      size="small"
      layout="horizontal"
      name={name}
      {...formItemLayout}
      {...rest}
    >
      <Row gutter={rowGutter as Gutter}>{children}</Row>
    </Form>
  );
};

export default memo(FormWrap);
