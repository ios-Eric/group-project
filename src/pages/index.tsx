import React, { useState } from "react";
import { Table } from "antd";
import ResizeableTitle from "./components/ResizeableTitle";
import { Link } from "react-router-dom";

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 100,
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: 100,
  },
];

const Page = () => {
  const [colum, setColum] = useState(columns);
  
  const handleResize = (index: number) => (_, { size: any }) => {
    setColum((item: any) => {
      const nextColumns = [...item];
      nextColumns[index] = {
        ...nextColumns[index],
        width: 200,
      };
      return { columns: nextColumns };
    });
  };

  const tableCloumn = colum.map((col, index) => ({
    ...col,
    onHeaderCell: (cumns: any) => ({
      width: cumns.width,
      onResize: handleResize(index)
    })
  }));
  return (
    <div>
      这是首页11
      <Link to='/shopping'>商店</Link>
      <Table dataSource={dataSource} columns={tableCloumn} components={{header: { cell: ResizeableTitle }}} />
    </div>
  )
}

export default Page;