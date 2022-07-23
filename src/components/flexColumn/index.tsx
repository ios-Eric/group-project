import React, { memo } from 'react';
import cn from 'classnames';
import { IObject } from '@/common/constants/interface';
import _ from 'lodash';
import { unitConversion } from '@/utils/num.js';
import styles from './index.module.less';

interface IFlexColumProps {
  valueKeyArr: any[];
  dataArr: IObject;
  getValueDom: Function | boolean;
}

const FourFlexColumn: React.FC<IFlexColumProps> = (props) => {
  const { valueKeyArr = [], dataArr = {}, getValueDom = false } = props;
  return (
    <div className={styles['flex-four-content']}>
      {!_.isEmpty(valueKeyArr) &&
        _.isArray(valueKeyArr) &&
        valueKeyArr.map((it, i) => (
          <div
            className={cn({
              [styles['content-item']]: true,
              [styles['no-border']]: i === 0,
            })}
            key={i}
          >
            <div className={styles['item-value-box']}>
              <span className={styles['item-value']}>
                {getValueDom && typeof getValueDom !== 'boolean'
                  ? getValueDom(unitConversion(dataArr[it.valueKey]), i)
                  : unitConversion(dataArr[it.valueKey])}
              </span>
              {it.unit || '万元'}
            </div>
            <div className={styles['item-describe']}>{it.title}</div>
          </div>
        ))}
    </div>
  );
};

export default memo(FourFlexColumn);
