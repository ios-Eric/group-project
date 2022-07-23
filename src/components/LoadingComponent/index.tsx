import { FC } from 'react';
import { Spin } from 'antd';

import styles from './index.less';

const LoadingComps: FC = () => {
  return (
    <div className={styles['loading-box']}>
      <Spin size="large" />
    </div>
  );
};
export default LoadingComps;
