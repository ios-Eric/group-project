import { memo, FC, useMemo } from 'react';
import cn from 'classnames';
import BaseIcon from '../baseIcon';
import styles from './index.module.less';

type STATUS = 'error' | 'done' | 'warning' | 'success' | 'close-warning' | null;

interface IStatusIconProps {
  status?: STATUS;
  iconType?: string;
  iconClassName?: string;
  text?: string;
  isTextColor?: boolean;
}

const StatusIcon: FC<IStatusIconProps> = (props) => {
  const { iconType, status, text, isTextColor = true, iconClassName } =
    props || {};

  const colorStatusObj = useMemo(() => {
    if (iconType) {
      return {
        type: iconType,
        className: iconClassName,
      };
    }
    if (status === 'close-warning' || status === 'error') {
      return {
        type: 'close-circle-filled',
        className: styles['warning-icon'],
      };
    } else if (status === 'success' || status === 'done') {
      return {
        type: 'check-circle-filled',
        className: styles['success-icon'],
      };
    } else if (status === 'warning') {
      return {
        type: 'exclamation-circle-filled',
        className: styles['warning-icon'],
      };
    }
    return {
      type: 'exclamation-circle-filled',
    };
  }, [status, iconType, iconClassName]);

  if (status) {
    return (
      <div className={styles['status-icon-box']}>
        <BaseIcon
          type={colorStatusObj?.type}
          className={colorStatusObj?.className}
        />
        <div
          className={cn(
            styles['status-icon-text'],
            isTextColor && colorStatusObj?.className,
          )}
        >
          {text}
        </div>
      </div>
    );
  }
  return null;
};

export default memo(StatusIcon);
