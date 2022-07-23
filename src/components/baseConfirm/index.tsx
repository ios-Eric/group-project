/**
 * 该组件为二次确认弹框（为统一样式故单独写了下）
 */
import { ReactNode } from 'react';
import { Modal, ModalProps } from 'antd';
import BaseIcon from '../baseIcon';
import styles from './index.module.less';

Modal.defaultProps = {
  bodyStyle: { padding: '16px 16px 8px' },
};

const { confirm } = Modal;

interface IBaseConfirmProps extends ModalProps {
  content: ReactNode;
  handleConfirm: Function;
  isPromise: boolean;
}

const baseConfirm = (props: IBaseConfirmProps) => {
  const { title, content, handleConfirm, isPromise = false, ...reset } = props;

  const titleNode = (
    <div className={styles['confirm-title-box']}>
      <BaseIcon type="exclamation-circle-filled" />
      <div className={styles['confirm-title']}>{title}</div>
    </div>
  );

  const handleConfirmPromise = () => {
    if (isPromise) {
      return new Promise((resolve, reject) => {
        handleConfirm(resolve, reject);
      });
    }
    handleConfirm();
    return '';
  };

  const contentNode = (
    <div className={styles['confirm-content']}>{content}</div>
  );

  confirm({
    title: titleNode,
    icon: false,
    content: contentNode,
    onOk: handleConfirmPromise,
    width: 376,
    ...reset,
  });
};

export default baseConfirm;
