import React, { Fragment, useState, memo, ReactNode, useEffect } from 'react';
import { Modal, Button, ModalProps } from 'antd';
import cn from 'classnames';
import styles from './index.module.less';
import _ from 'lodash';

export interface IBaseModalProps extends ModalProps {
  title: string;
  visible: boolean;
  handleOk: Function;
  children?: any;
  zIndex?: number;
  width?: number | string;
  autoFooter?: Function | boolean;
  baseFooter?: boolean;
  contentClassName?: string;
  cancelText?: ReactNode;
  okText?: ReactNode;
  okProps?: any;
}

const BaseModal: React.FC<IBaseModalProps> = (props) => {
  const {
    zIndex = 1001,
    width = 560,
    baseFooter = true,
    title = '',
    visible = false,
    autoFooter = false,
    handleOk = () => {},
    children = '',
    contentClassName = '',
    onCancel,
    cancelText = '取消',
    okText = '确认',
    okProps = {},
  } = props;
  const [btnLoading, setBtnLoading] = useState(false);

  const titleNode = <div className={styles['modal-title']}>{title}</div>;

  // 添加防抖 避免快速点击确认接口时调用接口
  const debounceHandleOkPromise = _.debounce(() => {
    handleOkPromise();
  }, 300);

  const handleOkPromise = () => {
    if (btnLoading) {
      return;
    }
    setBtnLoading(true);
    handleOk(() => setBtnLoading(false));
  };

  const onClose = (e: any) => {
    onCancel && onCancel(e);
    setBtnLoading(false);
  };

  const cancelNode = (
    <Button className={styles['modal-cancel']} onClick={onClose}>
      {cancelText}
    </Button>
  );

  const footers = () => {
    if (autoFooter && typeof autoFooter !== 'boolean') {
      return autoFooter({ btnChildren: cancelNode });
    }
    if (baseFooter) {
      return (
        <Fragment>
          {cancelNode}
          <Button
            type="primary"
            loading={btnLoading}
            onClick={debounceHandleOkPromise}
            {...okProps}
          >
            {okText}
          </Button>
        </Fragment>
      );
    }
    return '';
  };

  // 关闭弹窗则取消loading
  useEffect(() => {
    if (!visible) {
      setBtnLoading(false);
    }
  }, [visible]);

  return (
    <Modal
      title={titleNode}
      visible={visible}
      zIndex={zIndex}
      maskClosable={false}
      keyboard={false}
      width={width}
      style={{ width, maxWidth: '1024px' }}
      bodyStyle={{ width, padding: 0, maxWidth: '1024px' }}
      footer={null}
      onCancel={onClose}
      centered
      destroyOnClose
    >
      <Fragment>
        <div className={cn(styles['modal-content'], contentClassName)}>
          {children}
        </div>
        {(baseFooter || autoFooter) && (
          <div
            className={cn({
              [styles['modal-footer']]: true,
              [styles['base-footer']]: baseFooter,
            })}
          >
            {footers()}
          </div>
        )}
      </Fragment>
    </Modal>
  );
};

export default memo(BaseModal);
