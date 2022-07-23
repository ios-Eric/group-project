import React, { memo, ReactElement } from 'react';
import { Table, Pagination, Empty, TableProps } from 'antd';
import { IObject } from '@/common/constants/interface';
import cn from 'classnames';
import styles from './index.module.less';

interface ITableProps extends TableProps<any> {
  tableColumn: any[];
  isLoading: boolean;
  tableData: IObject[];
  total?: number;
  onChangePageIndex?: Function;
  onChangePageSize?: Function;
  pageIndex?: number;
  tablePagination?: boolean;
  tableScroll?: IObject;
  isOutStyle?: boolean;
  pageSizeOptionType?: string;
  emptyDescriptionDom?: ReactElement;
}

// 表格的基础配置
const BaseTable: React.FC<ITableProps> = (props) => {
  const {
    tableColumn = [],
    isLoading = false,
    tableData = [],
    total = 0,
    onChangePageIndex = () => {},
    onChangePageSize = () => {},
    rowKey = (record) => record.id,
    pageIndex = 1,
    tablePagination = true,
    tableScroll = { x: 'max-content' },
    isOutStyle = true,
    pageSizeOptionType = 'big',
    emptyDescriptionDom = <span>暂无数据</span>,
    locale = false,
  } = props;

  let basePageSizeOptions = ['20', '30', '50', '100'];
  if (pageSizeOptionType !== 'big') {
    basePageSizeOptions = ['10', '20', '30', '50'];
  }

  return (
    <div
      className={cn({
        [styles['table-content']]: isOutStyle,
      })}
    >
      <Table
        {...props}
        rowKey={rowKey}
        columns={tableColumn}
        loading={isLoading}
        dataSource={tableData}
        scroll={{ ...tableScroll }}
        pagination={false}
        locale={
          locale || {
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={emptyDescriptionDom}
              />
            ),
          }
        }
      />
      {tablePagination && total > 0 && (
        <div className={styles['table-pagination']}>
          {total > Number(basePageSizeOptions[0]) ? (
            <Pagination
              size="small"
              total={total}
              showTotal={(t) => `共 ${t} 条`}
              showSizeChanger
              showQuickJumper
              onChange={(i) => onChangePageIndex(i)}
              onShowSizeChange={(cur, size) => onChangePageSize(size)}
              current={pageIndex}
              pageSizeOptions={basePageSizeOptions}
            />
          ) : (
            <Pagination
              size="small"
              total={total}
              showTotal={(t) => `共 ${t} 条`}
              showSizeChanger
              pageSizeOptions={basePageSizeOptions}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(BaseTable);
