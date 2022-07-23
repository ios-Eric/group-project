import React from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import styles from './index.module.less';

export type ColItemArr = Array<{
  labelText: string;
  itemColSpan?: number;
  dataIndex?: string;
  [key: string]: any;
}>;

interface IProps {
  colItemArr: ColItemArr;
  rowGutter?: number | number[] | { [key: string]: any };
  colItemValue?: { [key: string]: any };
  labelWidth?: number;
}

const ColWrap: React.FC<IProps> = (props) => {
  const { colItemArr, rowGutter = [16, 16], colItemValue = {}, labelWidth } =
    props || {};
  return (
    <Row style={{ marginLeft: 0 }} gutter={rowGutter}>
      {!_.isEmpty(colItemArr) &&
        _.isArray(colItemArr) &&
        colItemArr.map(
          (
            colItem: {
              labelText: string;
              itemColSpan?: number;
              dataIndex?: string;
            },
            index: number,
          ) => (
            <Col span={colItem.itemColSpan || 12} key={index}>
              <div className={styles['item-box']}>
                <div
                  className={styles['item-label']}
                  style={{ width: labelWidth ?? 100 }}
                >
                  {colItem.labelText}
                </div>
                <div className={styles['item-value']}>
                  {colItem.dataIndex && colItemValue[colItem.dataIndex]}
                </div>
              </div>
            </Col>
          ),
        )}
    </Row>
  );
};

export default ColWrap;
