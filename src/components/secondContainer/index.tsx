import { Button } from 'antd';
import React, { memo, useState, useEffect } from 'react';
import styles from './index.module.less';
import _ from 'lodash';
interface IProps {
  visible: boolean;
  hasFooter?: boolean;
  hasHeader?: boolean;
  close: () => void;
  submit?: () => void;
  children: any;
}
const SecondContainer: React.FC<IProps> = (props) => {
  const {
    visible,
    hasHeader,
    hasFooter,
    close,
    submit = () => {},
    children,
  } = props;

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // 添加防抖 避免快速点击确认接口时调用接口
  const debounceSubmitOk = _.debounce(() => {
    submitOk();
  }, 300);

  const submitOk = () => {
    setSubmitLoading(true);
    submit();
  };

  useEffect(() => {
    if (!visible) {
      setSubmitLoading(false);
    }
  }, [visible]);
  return (
    <>
      {visible && (
        <>
          <div
            className={styles['second-container']}
            style={{ paddingBottom: hasFooter ? '56px' : '8px' }}
          >
            {hasHeader && (
              <div className={styles['second-header']}>
                <Button type="default" onClick={close}>
                  返回
                </Button>
              </div>
            )}
            {children}
          </div>
          {hasFooter && (
            <div className={styles['second-footer']}>
              <Button onClick={close}>取消</Button>
              <Button
                type="primary"
                onClick={debounceSubmitOk}
                loading={submitLoading}
              >
                提交
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default memo(SecondContainer);
