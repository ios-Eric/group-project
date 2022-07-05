import { useReducer } from 'react';

const tableReducer = (state, action) => {
  switch (action.type) {
    // 进入页面首次拉取数据前的loading
    case 'INIT':
      return { ...state, isLoading: true };
    // 当前页码发生变化时的处理
    case 'PAGE_INDEX':
      return {
        ...state,
        isLoading: true,
        pageIndex: action.payload,
      };
    // 每页条数发生变化时的处理
    case 'PAGE_SIZE':
      return {
        ...state,
        isLoading: true,
        pageSize: action.payload,
      };
    // 接口请求数据成功时的处理
    case 'SUCCESS':
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        total: action.payload.total,
      };
    // 接口请求数据失败时的处理
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        data: [],
        total: 0,
      };
    // 新增删除假数据时的处理（此时只修改data其他均不发生变动）
    case 'CHANGE_DATA':
      return {
        ...state,
        data: action.payload.data,
      };
    // 只关闭loading, 不做其他处理
    case 'CLOSE_LOADING':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return null;
  }
};

const useTableReducer = (defaultPageSize = 10) => {
  const [
    { data, pageIndex, pageSize, isLoading, total },
    dispatch,
  ] = useReducer(tableReducer, {
    data: [],
    pageIndex: 1,
    pageSize: defaultPageSize,
    isLoading: false,
    total: 0,
  });
  return [
    {
      data,
      pageIndex,
      pageSize,
      isLoading,
      total,
    },
    dispatch,
  ];
};

export default useTableReducer;
