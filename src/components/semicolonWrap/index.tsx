import { FC, memo, ReactNode } from 'react';
import { Tooltip } from 'antd';
import cn from 'classnames';
import BaseIcon from '../baseIcon';
import styles from './index.module.less';

interface ISemicolonWrapProps {
  type: string;
  text: string;
  iconDom?: ReactNode;
  itemClassName?: string;
  specialProps?: {
    specialText?: string;
    specialClassName?: string;
  };
}

const SemicolonWrap: FC<ISemicolonWrapProps> = (props) => {
  const {
    type,
    text,
    itemClassName,
    specialProps,
    iconDom = (
      <BaseIcon
        type="close-circle-filled"
        className={styles['close-warning']}
      />
    ),
  } = props || {};
  const { specialText = '不一致', specialClassName = '' } = specialProps || {};

  if (text && typeof text === 'string') {
    const textArr = text.split(';');
    const textDom = (
      <>
        {textArr.map((it: string, index: number) => {
          if (it) {
            const isDif = it.indexOf(specialText) !== -1;
            const [s] = it.split(specialText);
            return (
              <div className={itemClassName} key={index}>
                {s}
                {isDif ? (
                  <span
                    className={cn(styles['close-warning'], specialClassName)}
                  >
                    不一致;
                  </span>
                ) : (
                  ';'
                )}
              </div>
            );
          }
          return null;
        })}
      </>
    );
    if (type === 'text') {
      return textDom;
    } else if (type === 'tooltip') {
      return (
        <Tooltip title={textDom}>
          {text.indexOf(specialText) !== -1 && iconDom}
          <span className={styles['close-warning-text']}>{text}</span>
        </Tooltip>
      );
    }
  }
  return null;
};

export default memo(SemicolonWrap);
