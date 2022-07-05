import _ from 'lodash';
/**
 * numberRange 涉及的方法
 * @param name 表单收集的值
 * @param data 表格返回的record值集合
 */
interface IGetDefaultValueProps {
  name: string[] | string;
  data: {
    [key: string]: any;
  };
}
const getDefaultValue = ({ name, data }: IGetDefaultValueProps) => {
  if (_.isEmpty(name) || _.isEmpty(data)) return null;
  if (typeof name === 'string') {
    return data[name];
  }
  if (_.isArray(name)) {
    const nameKey = name[name.length - 1];
    return data[nameKey as string];
  }
  return null;
};

export { getDefaultValue };
