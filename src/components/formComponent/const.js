/**
 * 表单控件以及表单需要处理的函数可以直接在此定义
 * 单独创建一个文件的目的，后期开发维护只要是控件或者表单相关的处理函数都可以先在这里找，找不到再在这里定义
 * 尽量不要在引用的地方去单独定义，这样很容易造成，后期多处引用时出现多个地方存在同样或者差别很小的函数，维护比较麻烦
 * 定义函数时注意下，如果函数参数比较多，或者后期会比较多，尽量都使用对象解构参数的方式例如 disabledDateFun 函数
 */
import moment from 'moment';
import _ from 'lodash';
import { getValue } from '../../utils/utils';
import { formatDate } from '../../utils/dayjs';

// 设置控件的宽度为200px
const controlItemWidth = '200px';

// 处理特殊控件值比如：日期等（提交、或者搜索时可以对获取的的表单值做一层参数处理）
const handleSearchParams = () => {
  console.log('格式化参数');
};

// 单个日期选择框的禁用处理函数
const disabledDateFun = ({ e, disabledDateValueObj }) => {
  if (!e) return;
  let flag = false;
  const itemKeys = Object.keys(disabledDateValueObj);
  const currentValue = moment(e, 'YYYYMMDD');
  itemKeys.map((it) => {
    if (!disabledDateValueObj[it]) return;
    let itemValue = moment(disabledDateValueObj[it], 'YYYYMMDD');
    // 日期可选的下限，不含disabledDateValueObj['bottomLimit']值
    if (it === 'bottomLimit' && currentValue.diff(itemValue, 'days') < 0) {
      flag = true;
    }
    // 日期可选的下限，含disabledDateValueObj['bottomLimit']值
    if (
      it === 'bottomLimitEqual' &&
      currentValue.diff(itemValue, 'days') <= 0
    ) {
      flag = true;
    }
    // 日期可选的上限，不含disabledDateValueObj['topLimit']值
    if (it === 'topLimit' && currentValue.diff(itemValue, 'days') > 0) {
      flag = true;
    }
    // 日期可选的上限，含disabledDateValueObj['topLimit']值
    if (it === 'topLimitEqual' && currentValue.diff(itemValue, 'days') >= 0) {
      flag = true;
    }
    return null;
  });
  return flag;
};

// 处理日期等特殊值的方法（该方法只处理表单默认值展示）
const handleSpecialValue = ({ type, val }) => {
  if (type === 'date' && val) {
    return moment(val, 'YYYY-MM-DD');
  }
  if (type === 'dateRange' && !_.isEmpty(val)) {
    return [moment(val[0], 'YYYY-MM-DD'), moment(val[1], 'YYYY-MM-DD')];
  }
  return val;
};

// 处理接口返回的value覆盖表单(主要是日期或者自定义的一些值处理)
const changeFieldsValue = ({ type, dataIndex, value }) => {
  const obj = {};
  if (type === 'date') {
    obj[dataIndex] = moment(value, 'YYYY-MM-DD');
  } else if (type === 'dateRange' && !_.isEmpty(value)) {
    obj[dataIndex] = [
      moment(value[0], 'YYYY-MM-DD'),
      moment(value[1], 'YYYY-MM-DD'),
    ];
  } else if (type === 'numberRange') {
    if (Object.keys(value).length) {
      Object.keys(value).map((key) => {
        obj[key] = value[key];
      });
    }
  } else {
    obj[dataIndex] = value;
  }
  return obj;
};

// SearchForm 组件的 props 定义
const searchFromPropsLabelCol = {
  'default-0': { span: 8, style: { lineHeight: '28px' } },
  'search-1': { span: 8 },
};

const searchFromPropsWrapperCol = {
  'default-0': { style: { lineHeight: '32px' } },
  'search-1': { style: { width: '100%' } },
};

const searchFromPropsRowGutter = {
  'default-0': {},
  'search-1': { gutter: [16, 8] },
};

// SearchForm 组件的 formItem 默认 props 定义
const formItemDefaultProps = {
  colSpan: 6,
};

// 处理过滤栏控件value值变化保存到组件state中
const updateSearchState = ({ values, searchKeyArray }) => {
  // TODO: 去除空格(目前新增债券时是没有去空格，故这里先不处理)
  // Object.keys(values || {}).map((key) => {
  //   if (typeof values[key] === 'string') {
  //     values[key] = values[key].replaceAll(' ', '');
  //   }
  //   return null;
  // });
  const issueArray = values.issue || ['', ''];
  const issueStartDateRange = values.issueStart || ['', ''];
  const issueEndDateRange = values.issueEnd || [
    values?.issueEndDateLower || '',
    values?.issueEndDateUpper || '',
  ];
  const newValue = {
    ...values,
    issueStartDate: !issueArray[0] ? '' : formatDate('YYYYMMDD', issueArray[0]),
    issueEndDate: !issueArray[1] ? '' : formatDate('YYYYMMDD', issueArray[1]),
    statuses: values.statuses,
    markets: getValue(values.markets),
    internalBondLevels: getValue(values.internalBondLevels),
    fundToInvest: values.fundToInvest ? 1 : undefined,
    issueTypes: getValue(values.issueTypes),
    payTime: values.payTime
      ? formatDate('YYYYMMDD', values.payTime)
      : undefined,
    createDate: values.createDate
      ? formatDate('YYYYMMDD', values.createDate)
      : undefined,
    issueStartDateLower: !issueStartDateRange[0]
      ? ''
      : formatDate('YYYYMMDD', issueStartDateRange[0]),
    issueStartDateUpper: !issueStartDateRange[1]
      ? ''
      : formatDate('YYYYMMDD', issueStartDateRange[1]),
    issueEndDateLower: !issueEndDateRange[0]
      ? ''
      : formatDate('YYYYMMDD', issueEndDateRange[0]),
    issueEndDateUpper: !issueEndDateRange[1]
      ? ''
      : formatDate('YYYYMMDD', issueEndDateRange[1]),
  };
  return _.pick(newValue, searchKeyArray);
};

// 通过组件ref 实现自动聚焦效果
const refAutoFocus = (domRef) => {
  if (domRef && domRef.current) {
    domRef.current.focus({ cursor: 'end' });
  }
};

export {
  controlItemWidth,
  handleSearchParams,
  disabledDateFun,
  handleSpecialValue,
  changeFieldsValue,
  searchFromPropsLabelCol,
  searchFromPropsWrapperCol,
  searchFromPropsRowGutter,
  formItemDefaultProps,
  updateSearchState,
  refAutoFocus,
};
