/**
 * 该组件只是表单和控件之间的中间层
 * @formItemArr 需要展示控件的数组
 * @formData 如果某个控件有接口返回的值需要赋值时传入
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ControlItem from './ControlItem';

const FormItemNew = (props) => {
  const { formItemArr, formData, ...set } = props;

  const content =
    !_.isEmpty(formItemArr) &&
    _.isArray(formItemArr) &&
    formItemArr.map((item, index) => {
      const value = formData[item.dataIndex] || '';
      return (
        <ControlItem
          key={item.dataIndex}
          locationIndex={index}
          value={value}
          {...set}
          item={item}
        />
      );
    });

  return content;
};

FormItemNew.defaultProps = {
  formItemArr: [],
  formData: {},
};

FormItemNew.propTypes = {
  formItemArr: PropTypes.array,
  formData: PropTypes.object,
};

export default memo(FormItemNew);
