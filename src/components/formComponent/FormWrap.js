/**
 * 该组件主要用于表单收集
 * @form 表单实例
 * @name 表单的名称
 * @children 子组件节点
 * @wrapperContainer 是否需要Row包裹Item
 * @formItemLayout 表单的布局
 */
import React, { memo } from 'react';
import { Form, Row } from 'antd';
import PropsType from 'prop-types';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { style: { lineHeight: '32px' } },
};

const FormWrap = (props) => {
  const {
    children,
    form,
    name,
    onValuesChange,
    wrapperContainer,
    formItemLayout,
    ...rest
  } = props;

  const childrenNode = React.Children.map(children, (child) =>
    React.cloneElement(child, {
      form: form,
    }),
  );

  return (
    <Form
      form={form}
      onValuesChange={(changedFields, allFields) =>
        onValuesChange(changedFields, allFields)
      }
      // labelCol={{ span: 8, style: { lineHeight: '32px' } }}
      // wrapperCol={{ style: { lineHeight: '32px' } }}
      colon={false}
      size="small"
      layout="horizontal"
      name={name}
      {...formItemLayout}
      {...rest}
    >
      {wrapperContainer ? <Row type="flex">{childrenNode}</Row> : childrenNode}
    </Form>
  );
};

FormWrap.defaultProps = {
  form: {},
  name: '',
  onValuesChange: () => {},
  wrapperContainer: true,
  formItemLayout: formItemLayout,
};

FormWrap.propTypes = {
  children: PropsType.element.isRequired,
  form: PropsType.any,
  name: PropsType.string,
  onValuesChange: PropsType.func,
  wrapperContainer: PropsType.bool,
  formItemLayout: PropsType.object,
};

export default memo(FormWrap);
