import React, { useCallback, useRef, useMemo, ReactElement } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import type { ColumnsType } from 'antd/lib/table';
import type { DragObjectWithType } from 'react-dnd';
import { MenuOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import HTML5Backend from 'react-dnd-html5-backend';
// import BaseTable from '../../components/baseComponents/BaseTable.js';
import EditFormTable from '../editFormTable';
// import styles from './index.module.less';

interface DndTableProps {
  dropAfterOption?: ({
    // eslint-disable-next-line no-unused-vars
    dragRecord,
    // eslint-disable-next-line no-unused-vars
    dropRecord,
  }: {
    dragRecord: any;
    dropRecord: any;
  }) => void;
  // eslint-disable-next-line no-unused-vars
  dragChangeData: (p: any) => void;
  tableData: any[];
  tableColumn: any[];
  isLoading?: boolean;
  total?: number;
  name?: string;
  handleSave?: Function;
  handleDel?: Function;
  changeTableData?: Function;
  isOutStyle?: boolean;
  bodyRow?: ReactElement;
  onRow?: Function;
  addTableRowProps?: {
    isAddBtn: boolean;
    addClassName?: string;
    addText?: string;
    addDisabled?: boolean;
  };
}

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  render: () => any;
}

interface DragTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number;
  // eslint-disable-next-line no-unused-vars
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  dropAfterOption: ({
    // eslint-disable-next-line no-unused-vars
    dragRecord,
    // eslint-disable-next-line no-unused-vars
    dropRecord,
  }: {
    dragRecord: any;
    dropRecord: any;
  }) => void;
  record: any;
}

interface IDropFun extends DragObjectWithType {
  index: number;
  record: any;
}

const type = 'DragTableRow';

const DragHandle = <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />;

const DragTableRow = (props: DragTableRowProps) => {
  const {
    index,
    moveRow,
    className,
    style,
    record,
    dropAfterOption,
    ...restProps
  } = props;
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? 'drop-over-downward' : 'drop-over-upward',
      };
    },
    drop: (item: IDropFun) => {
      if (dropAfterOption) {
        dropAfterOption({ dragRecord: item.record, dropRecord: record });
      }
    },
    hover: (item: IDropFun, monitor) => {
      const { index: dragIndex } = item;
      if (dragIndex === index) return null;
      // const { top, bottom } = ref.current?.getBoundingClientRect();
      // const halfOfHoverHeight = (bottom - top) / 2;
      // const { y } = monitor.getClientOffset();
      // const hoverClientY = y - top;
      // if (
      //   (dragIndex < index && hoverClientY < halfOfHoverHeight) ||
      //   (dragIndex > index && hoverClientY < halfOfHoverHeight)
      // ) {
      //   return;
      // }
      moveRow(item.index, index);
      monitor.getItem().index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: {
      type,
      index,
      record,
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const defaultStyle: React.CSSProperties = useMemo(
    () => ({
      opacity: index === -1 ? 1 : isDragging ? 0.1 : 1,
    }),
    [isDragging],
  );
  drag(drop(ref));
  console.log({ isDragging, isOver });
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ ...style, ...defaultStyle }}
      {...restProps}
    />
  );
};

const DndTable = (props: DndTableProps) => {
  const {
    dropAfterOption = () => {},
    tableData = [],
    tableColumn = [],
    dragChangeData = () => {},
    ...rest
  } = props;

  const columns: ColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'drag-visible',
      width: 30,
      className: 'drag-visible',
      render: () => DragHandle,
    },
    ...tableColumn,
  ];

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = tableData[dragIndex];
      dragChangeData(
        update(tableData, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [tableData],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <EditFormTable
        tableData={tableData}
        tableColumn={columns}
        isOutStyle={false}
        bodyRow={DragTableRow}
        onRow={(record: any, index: number) => {
          const attr: DragTableRowProps = {
            index,
            moveRow,
            record,
            dropAfterOption,
          };
          return attr;
        }}
        {...rest}
      />
    </DndProvider>
  );
};

export default DndTable;
