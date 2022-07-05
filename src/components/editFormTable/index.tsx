import { Form, Button } from 'antd';
import React, { memo, ReactNode, useState } from 'react';
import type { TableColumnsType } from 'antd';
import ItemControl from '../itemControl';
import BaseTable from '../../components/baseComponents/BaseTable.js';
import { OptionButton } from '../../components/baseComponents/index.js';
import BasePopconfirm from '../../components/secondaryModal/BasePopconfirm.js';
import styles from './index.module.less';

type ID = string | number | null;

interface Columns extends TableColumnsType {
  dataIndex: string;
  id: ID;
  key?: string;
  age?: number;
  address?: string;
  controlType?: string;
  controlProps?: any;
  dictProps?: any;
  itemProps?: any;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  controlType: string;
  record: Columns;
  index: number;
  children: React.ReactNode;
  controlProps: any;
  dictProps: any;
  itemProps?: any;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  // title,
  controlType,
  // record,
  controlProps,
  dictProps,
  itemProps,
  // index,
  children,
  ...restProps
}) => (
  <td {...restProps}>
    {editing ? (
      <Form.Item name={dataIndex} style={{ margin: 0 }} {...itemProps}>
        <ItemControl
          type={controlType}
          controlProps={controlProps}
          dictProps={dictProps}
        />
      </Form.Item>
    ) : (
      children
    )}
  </td>
);

interface ITableProps {
  tableColumn: any[];
  tableData: any[];
  name?: string;
  handleSave?: Function;
  handleDel?: Function;
  isOutStyle?: boolean;
  bodyRow?: ReactNode;
  onRow?: Function;
  addTableRowProps?: {
    isAddBtn: boolean;
    addClick: Function;
    addClassName?: string;
    addText?: string;
    addDisabled?: boolean;
  };
}

const EditFormTable: React.FC<ITableProps> = (props) => {
  const {
    tableColumn,
    handleSave,
    handleDel = () => {},
    tableData,
    name,
    isOutStyle,
    bodyRow,
    onRow = () => {},
    addTableRowProps,
  } = props;
  const { isAddBtn, addClick, addClassName, addText, addDisabled } =
    addTableRowProps || {};
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<ID>(null);

  const { validateFields, setFieldsValue, resetFields } = form || {};

  const isEditing = (record: Columns) => record.id === editingKey;

  const edit = (record: Columns) => {
    setFieldsValue({ record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    resetFields();
    setEditingKey(null);
  };

  const save = async (record: Columns) => {
    const { id } = record || {};
    try {
      const values = (await validateFields()) as Columns;
      if (handleSave) {
        handleSave({ id, values });
      }
    } catch (errInfo) {
      console.info('Validate Failed:', errInfo);
    }
  };

  const columns = [
    ...tableColumn,
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 100,
      render: (_: any, record: Columns) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <OptionButton onClick={() => save(record)} text="保存" />
            <OptionButton onClick={cancel} text="取消" />
          </span>
        ) : (
          <span>
            <OptionButton
              disabled={editingKey}
              onClick={() => edit(record)}
              text="编辑"
            />
            <BasePopconfirm
              title="确定要删除吗？"
              onOk={() => handleDel(record)}
            >
              <OptionButton disabled={editingKey} text="删除" />
            </BasePopconfirm>
          </span>
        );
      },
    },
  ];

  const handleAddClick = () => {
    if (addClick) {
      addClick();
    }
    setEditingKey('new_child');
  };

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Columns) => ({
        record,
        controlType: col.controlType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        controlProps: col.controlProps,
        dictProps: col.dictProps,
        itemProps: col.itemProps,
      }),
    };
  });

  return (
    <Form name={name} form={form}>
      {isAddBtn && (
        <Button
          className={`${styles['auto-dis-add']} ${addClassName}`}
          disabled={addDisabled || !!editingKey}
          type="primary"
          onClick={handleAddClick}
        >
          {addText || '新增'}
        </Button>
      )}
      <BaseTable
        components={{
          body: {
            cell: EditableCell,
            row: bodyRow,
          },
        }}
        tableData={tableData}
        tableColumn={mergedColumns}
        isOutStyle={isOutStyle}
        pagination={false}
        onRow={onRow}
      />
    </Form>
  );
};

export default memo(EditFormTable);
