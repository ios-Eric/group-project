/**
 * 该组件是单个控件的组件
 * @form 表单实例
 * @item 单个控件所具有的初始属性值
    |-- @type 当前item控件是那种类型（输入框、选择框、日期框等）值为字符串类型
    |-- @optionData 下拉框的下拉可选值数组； 值为数组类型
    |-- @disabled 当前控件是否禁用; 值为布尔值类型
    |-- @placeholder 控件为空时提示信息； 值为字符串类型
    |-- @required 该控件是否需要非空效验； 值为布尔值类型
    |-- @rules 自定义校验规则，同 antd api； 值为数组类型
    |-- @labelText label 文字； 值为字符串类型
    |-- @dataIndex 表单收集是的key值；值为字符串类型
    |-- @defaultValue 默认值，同 antd api;
    |-- @unit 当前控件的单位，类型字符串
    |-- @dict 下拉框下拉选项对应的字典，该值需和对应全局字典中一致，便于直接从全局字典中获取值；值为字符串
    |-- @mode 下拉框select 属性mode 同 antd api；值为字符串
    |-- @maxTagCount 输入控件最大可多选几个值，同 antd api
    |-- @allowClear 控件可一键清空功能，同 antd api;
    |-- @formatFun 下拉框 option 格式化，默认 (datas) => datas
    |-- @disabledOption select 或 radio option 禁用的选项；值为数组类型
    |-- @showArrow 默认展示select的箭头，同 antd api
    |-- @disabledDate 日期的disableDate 函数，默认不做任何处理, 同antd api
    |-- @itemColSpan 单个元素的 colspan
    |-- @Components 自定的的组件，基本都是自定义 search 组件居多
    |-- @itemProps 自定义 search 的props
    |-- @childrenItem 输入数字范围时的props
    |-- @disabledDateValueObj 日期组件禁用是的自定义对象 该值是一个对象有两个键值 bottomLimit 和topLimit, 分别对应需要禁用的日期上下限；值为对象
    |-- @delSelectData 针对下拉框需要排除的下拉选项的对应值；值为数组
    |-- @onlySelectData 针对下拉框只需要展示的下拉选项的对应值；值为数组
    |-- @apiSelectProps 针对需要调用接口的下拉框的props选项
    |-- @maxLength 控件最大输入长度，同 antd api；默认200
    |-- @offset 控件的偏移量，同 antd api
    |-- @autoFocus 自动聚焦，默认否, 同 antd api
    |-- @refFocus 自动聚焦，默认否(主要是解决antd Drawer组件内部使用表单导致表单控件无法自动聚焦问题)
    |-- @showCount 输入框右下角显示文字数量/总数
    |-- @itemStyle Item 组件的style样式
 * @value 单个控件的value（一般是接口返回的需要赋值时会用到）
 * @disabledAll 控制是否全部设置为disabled
 * @colSpan 控制当前控件在一行展示时最多展示几个（栅格布局）默认是展示2个
 * @controlItemWidth 输入栏的width
 * @isActiceItemWidth 输入栏的width 是否设置， 默认100%
 * @locationIndex 当前控件的下标
 */
import React, { memo, useLayoutEffect, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Col, DatePicker, Select, Input, InputNumber, Radio } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  controlItemWidth as itemWidth,
  disabledDateFun,
  handleSpecialValue,
  changeFieldsValue,
  refAutoFocus,
} from './const';

import styles from './index.module.less';

const { Item } = Form;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ControlItem = ({
  item,
  disabledAll,
  colSpan,
  value,
  form,
  controlItemWidth,
  isActiceItemWidth,
  locationIndex,
}) => {
  const { DICTS } = useSelector((state) => state.Common.DICTS);
  const inputNumberRef = useRef(null);

  const itemInlineStyle = isActiceItemWidth
    ? {
        width: controlItemWidth,
      }
    : {
        width: '100%',
        // minWidth: '100px',
      };

  const {
    type,
    optionData,
    disabled,
    placeholder,
    required,
    rules = [], // 校验规则
    labelText, // label
    dataIndex, //name
    defaultValue,
    unit, // 单位
    dict, // select optiop dict
    mode, // select mode
    maxTagCount,
    allowClear = true, // 清除icon
    formatFun = (datas) => datas, // option 格式化
    disabledOption = [], // select 或 radio option 禁用的选项
    showArrow = true, //  默认展示select的箭头
    disabledDate = () => false, // 日期的disableDate 函数，默认不做任何处理
    itemColSpan = null, // 单个元素的colspan
    Components, // 自定的的search
    itemProps, // 自定义search的props
    childrenItem,
    // isEdit,
    disabledDateValueObj,
    delSelectData = [], // 要去掉的下拉选项的对应值
    onlySelectData = [], // 只需要展示的下拉选项的对应值
    apiSelectProps,
    // labelItemCol = { span: 8 }, //单个元素label的span
    maxLength = 200,
    offset,
    autoFocus = false, // 自动聚焦，默认否
    refFocus = false, // 自动聚焦，默认否(主要是解决antd Drawer组件内部使用表单导致表单控件无法自动聚焦问题)
    dependencies,
    showCount,
    itemStyle,
    ...restprops
  } = item || {};

  useEffect(() => {
    if (refFocus && !disabledAll && !disabled) {
      switch (type) {
        case 'inputNumber':
          refAutoFocus(inputNumberRef);
          return;
        default:
          break;
      }
    }
  }, [refFocus, type, disabledAll, disabled]);

  useLayoutEffect(() => {
    if (!_.isEmpty(form) && value && dataIndex) {
      let obj = changeFieldsValue({ type, dataIndex, value });
      form.setFieldsValue(obj);
      obj = null;
    }
  }, [dataIndex, value, form, type]);

  // 设置控件是否禁用
  const disabledCurrent = disabledAll || disabled;

  let label = labelText;
  if (unit) {
    label = `${labelText}(${unit})`;
  }
  // 获取默认值（以及日期等特殊值处理）
  const defaultValueCurrent = handleSpecialValue({ type, val: defaultValue });
  // 定义校验规则（如果做搜索框则搜索项不设置 required 即可）
  if (required) {
    rules.push({ required: true, message: `${labelText}是必填项` });
  }

  const optionGeneration = (dict, formatFun) => {
    let selectOptions = '';
    let itemKeys = Object.keys(DICTS?.[dict] || {});
    if (!_.isEmpty(delSelectData)) {
      itemKeys = itemKeys.filter((it) => !delSelectData.includes(it));
    } else if (!_.isEmpty(onlySelectData)) {
      itemKeys = [...onlySelectData];
    }
    selectOptions = formatFun(itemKeys).map((it) => ({
      label: DICTS[dict][it],
      value: it,
      key: it,
      disabled: disabledOption.includes(`${it}`),
    }));
    itemKeys = null;
    return selectOptions;
  };

  // inputNumber
  const inputNumberGerneration = ({
    disabled,
    max,
    min,
    step,
    placeholder,
    precision = 2,
    styleProps,
    classNameProps,
    addonAfter,
    ...props
  }) => {
    let addonAfterContent = null;
    if (Object.keys(addonAfter || {}).length) {
      addonAfterContent = (
        <Item
          name={addonAfter['dataIndex']}
          style={{
            margin: 0,
            width: 80,
          }}
        >
          {selectGerneration(addonAfter)}
        </Item>
      );
    }
    if (typeof addonAfter === 'string') {
      addonAfterContent = addonAfter;
    }
    return (
      <InputNumber
        placeholder={placeholder || (disabled ? '' : `请输入${labelText}`)}
        style={{ ...itemInlineStyle, ...styleProps }}
        max={max}
        min={min}
        step={step}
        disabled={disabledCurrent}
        precision={precision}
        className={`${classNameProps ? styles[classNameProps] : ''}`}
        addonAfter={addonAfterContent}
        ref={inputNumberRef}
        {...props}
      />
    );
  };

  // select geraneration
  const selectGerneration = (props) => {
    const {
      optionData,
      disabled,
      placeholder,
      labelText, // label
      maxTagCount,
      allowClear = true, // 清除icon
      showArrow = true, //  默认展示select的箭头
      dict,
      mode = 'default',
      formatFun = (datas) => datas, // option 格式化
      styleProps,
      ...rest
    } = props;
    let selectOptions = optionGeneration(dict, formatFun);
    return (
      <Select
        placeholder={
          ([null, undefined].includes(placeholder) ? '' : placeholder) ||
          (disabled ? '' : `请选择${labelText}`)
        }
        style={{ ...itemInlineStyle, ...styleProps }}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        mode={mode}
        maxTagCount={maxTagCount || 1}
        options={optionData || selectOptions}
        showArrow={showArrow}
        allowClear={allowClear}
        disabled={disabledCurrent}
        {...rest}
      />
    );
  };

  // range width 处理待优化
  const rangeGerneration = (childrenItem) => {
    const [first, last] = childrenItem;
    return (
      <div className={`${styles['site-input-group-wrapper']}`}>
        <Item
          name={first['dataIndex']}
          style={{
            margin: 0,
          }}
          rules={first['rules']}
          dependencies={first['dependencies']}
        >
          {inputNumberGerneration({
            ...first,
            classNameProps: 'site-input-left',
          })}
        </Item>
        <Input
          className={`${styles['site-input-split']}`}
          placeholder="~"
          disabled
        />
        <Item
          name={last['dataIndex']}
          style={{ margin: 0 }}
          rules={last['rules']}
          dependencies={last['dependencies']}
        >
          {inputNumberGerneration({
            ...last,
            classNameProps: 'site-input-right',
            addonAfter: last['addonAfter'],
          })}
        </Item>
        {/* 单位 */}
        {/* {hasSuffix ? (
          <Item
            name={last['suffixAfter']['dataIndex']}
            style={{
              margin: 0,
            }}
          >
            {selectGerneration({
              ...last['suffixAfter'],
            })}
          </Item>
        ) : null} */}
      </div>
    );
  };

  // 处理select Option 数据
  let selectOptions = optionGeneration(dict, formatFun);

  let itemDom = '';
  switch (type) {
    case 'input':
      itemDom = (
        <Input
          allowClear={allowClear}
          placeholder={placeholder || (disabled ? '' : `请输入${labelText}`)}
          style={itemInlineStyle}
          autoComplete="off"
          disabled={disabledCurrent}
          autoFocus={autoFocus}
        />
      );
      break;
    case 'singleSelect':
      itemDom = selectGerneration(item);
      break;
    case 'moreSelect':
      itemDom = (
        <Select
          placeholder={placeholder}
          style={itemInlineStyle}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          mode={mode}
          maxTagCount={maxTagCount || 1}
          maxTagTextLength={mode ? 3 : 99}
          allowClear={allowClear}
          notFoundContent={null}
          options={selectOptions}
          showArrow={showArrow}
          disabled={disabledCurrent}
          autoFocus={autoFocus}
        />
      );
      break;
    case 'treeSelect':
      itemDom = (
        <Select
          placeholder={placeholder}
          style={itemInlineStyle}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          mode={mode}
          disabled={disabledCurrent}
          autoFocus={autoFocus}
        >
          {selectOptions}
        </Select>
      );
      break;
    case 'apiSelect':
      itemDom = (
        <Select
          placeholder={placeholder || (disabled ? '' : `请选择${labelText}`)}
          filterOption={false}
          showSearch={true}
          showArrow={false}
          allowClear={allowClear}
          style={itemInlineStyle}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          autoFocus={autoFocus}
          {...apiSelectProps}
          mode={mode}
        />
      );
      break;
    case 'autoComplete':
      itemDom = <Components {...itemProps} />;
      break;
    case 'inputNumber':
      itemDom = inputNumberGerneration(item);
      break;
    case 'date':
      itemDom = (
        <DatePicker
          placeholder={placeholder}
          style={itemInlineStyle}
          disabled={disabledCurrent}
          autoFocus={autoFocus}
          disabledDate={
            _.isEmpty(disabledDateValueObj)
              ? disabledDate
              : (e) => disabledDateFun({ e, disabledDateValueObj })
          }
          allowClear
          {...restprops}
        />
      );
      break;
    case 'dateRange':
      itemDom = (
        <RangePicker
          placeholder={placeholder}
          style={itemInlineStyle}
          allowClear={allowClear}
          autoFocus={autoFocus}
          {...restprops}
        />
      );
      break;
    case 'textArea':
      itemDom = (
        <TextArea
          placeholder={placeholder || (disabled ? '' : `请输入${labelText}`)}
          style={itemInlineStyle}
          allowClear={allowClear}
          maxLength={maxLength}
          disabled={disabledCurrent}
          autoFocus={autoFocus}
          showCount={showCount}
          {...restprops}
        />
      );
      break;
    case 'radio':
      itemDom = (
        <Radio.Group
          options={optionData || selectOptions}
          style={itemInlineStyle}
          {...restprops}
        />
      );
      break;
    case 'numberRange':
      itemDom = rangeGerneration(childrenItem);
      break;
    default:
      itemDom = <label>{value}</label>;
      break;
  }

  const computedOffset = (offset) => {
    return Object.prototype.toString.call(offset) === '[object Function]'
      ? offset(locationIndex)
      : offset;
  };

  return (
    <Col
      span={itemColSpan || colSpan}
      key={dataIndex}
      offset={computedOffset(offset)}
    >
      <Item
        // labelCol={labelItemCol}
        label={label}
        name={dataIndex}
        style={{ margin: 0 }}
        rules={rules}
        initialValue={defaultValueCurrent}
        dependencies={dependencies}
        {...itemStyle}
      >
        {itemDom}
      </Item>
    </Col>
  );
};

ControlItem.defaultProps = {
  colSpan: 12,
  disabledAll: false,
  item: {},
  form: {},
  value: '',
  controlItemWidth: itemWidth,
  isActiceItemWidth: true,
  offset: 0,
};

ControlItem.propTypes = {
  colSpan: PropTypes.number,
  disabledAll: PropTypes.bool,
  item: PropTypes.object,
  form: PropTypes.object,
  value: PropTypes.any,
  controlItemWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isActiceItemWidth: PropTypes.bool,
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.func,
  ]),
};

export default memo(ControlItem);
