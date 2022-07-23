// 该组件目的是在antd的icon组件做一层封装，统一icon在此项目的大部分样
import React, { memo } from 'react';
import {
  MinusSquareOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  PaperClipOutlined,
  LoadingOutlined,
  InboxOutlined,
  ExclamationCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
} from '@ant-design/icons';
import cn from 'classnames';
import styles from './index.module.less';
interface IPropsIcon {
  type: string;
  loading?: boolean;
  className?: string;
  [key: string]: any;
}

const BaseIcon: React.FC<IPropsIcon> = (props) => {
  const { type, loading = false, className, ...rest } = props;

  if (loading) {
    return <LoadingOutlined />;
  }
  switch (type) {
    case 'minus-square':
      return (
        <MinusSquareOutlined
          className={cn(styles['base-icon'], className)}
          {...rest}
        />
      );
    case 'plus-square':
      return (
        <PlusSquareOutlined
          className={cn(styles['base-icon'], className)}
          {...rest}
        />
      );
    case 'delete':
      return (
        <DeleteOutlined
          className={cn(styles['base-icon'], className)}
          {...rest}
        />
      );
    case 'download':
      return (
        <DownloadOutlined
          className={cn(styles['base-icon'], className)}
          {...rest}
        />
      );
    case 'eye-o':
      return (
        <EyeOutlined className={cn(styles['base-icon'], className)} {...rest} />
      );
    case 'paper-clip':
      return (
        <PaperClipOutlined
          className={cn(styles['base-icon'], className)}
          {...rest}
        />
      );
    case 'loading':
      return (
        <LoadingOutlined
          className={cn(styles['base-icon'], className)}
          {...rest}
        />
      );
    case 'inbox':
      return (
        <InboxOutlined
          className={cn(styles['base-icon'], className)}
          {...rest}
        />
      );
    case 'exclamation-circle-filled':
      return (
        <ExclamationCircleFilled
          className={cn(styles['base-icon'], styles['warning-icon'], className)}
          {...rest}
        />
      );
    case 'close-circle-filled':
      return (
        <CloseCircleFilled
          className={cn(styles['base-icon'], styles['error-icon'], className)}
          {...rest}
        />
      );
    case 'check-circle-filled':
      return (
        <CheckCircleFilled
          className={cn(styles['base-icon'], styles['success-icon'], className)}
          {...rest}
        />
      );
    default:
      return null;
  }
};

export default memo(BaseIcon);
