// 主要保存一些 引用类型的数据
const setJson = (key, value) => {
  const jsonValue = JSON.stringify(value);
  localStorage.setItem(key, jsonValue);
};

const getJson = (key) => {
  const value = localStorage.getItem(key);
  const jsonValue = JSON.parse(value);
  return jsonValue;
};

// 保存基本类型的数据
const setItem = (key, value) => {
  localStorage.setItem(key, value);
};

const getItem = (key) => {
  const value = localStorage.getItem(key);
  return value;
};

const removeItem = (key) => {
  localStorage.removeItem(key);
};

export { setJson, getJson, setItem, getItem, removeItem };
