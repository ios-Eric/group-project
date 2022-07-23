/**
 * 该组件为多行省略实现
 * @linClamp 最多几行省略，传数字即可
 * @title 该段文字的标题，可以传字符串也可以是标签
 * @text 需要省略的文本
 * @lineHeight 当前文本的行高，默认是20，该值主要是为了确定省略所需要的文本高度
 * @titleControl 判断当前控制是在句末还是句首
 * @noExpand 特定场景不需要展开内容时传入
 *  |--- @noExpandText 为true时点击不会展开文字
 *  |--- @handleClick 不展开文字时点击触发的其他副作用函数
 */
import React, { memo, useRef, useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import cn from 'classnames';
import styles from './index.module.less';

interface NoExpandProps {
  noExpandText: boolean;
  handleClick?: Function;
}

interface IProps {
  linClamp: number;
  text?: React.ReactNode;
  title?: React.ReactNode;
  lineHeight?: number;
  titleControl?: boolean;
  noExpand?: NoExpandProps;
}

const TextFold: React.FC<IProps> = (props) => {
  const { text, title, lineHeight, linClamp, titleControl, noExpand } = props;
  const { noExpandText, handleClick } = noExpand || {};
  const textBoxRef = useRef<HTMLDivElement>(null);
  const [isViewIcon, setIsViewIcon] = useState<Boolean>(false);
  const [isOpenText, setIsOpenText] = useState<Boolean>(false);
  const [opacity, setOpacity] = useState(0);
  const [webkitLineClamp, setWebkitLineClamp] = useState<number>(linClamp);

  useEffect(() => {
    if (text && textBoxRef && textBoxRef.current) {
      if (noExpandText) {
        setIsViewIcon(true);
        setOpacity(1);
        return;
      } // 特殊场景：不需要展开的情况
      const offsetHT = textBoxRef.current?.offsetHeight || 0;
      const lineHT = lineHeight || 20;
      const maxVHT = linClamp || 6;
      if (offsetHT > lineHT * maxVHT) {
        setIsViewIcon(true);
        setWebkitLineClamp(linClamp);
      } else {
        setIsViewIcon(false);
        setWebkitLineClamp(99999999);
      }
      setOpacity(1);
    }
  }, [lineHeight, linClamp, text]);

  const changeIsOpenState = () => {
    if (noExpandText && handleClick) {
      setIsOpenText(!isOpenText);
      handleClick();
      return;
    }
    if (isOpenText) {
      setWebkitLineClamp(linClamp);
    } else {
      setWebkitLineClamp(99999999);
    }
    setIsOpenText(!isOpenText);
  };

  const iconDom = (
    <DownOutlined
      className={cn({
        [styles['icon-base']]: true,
        [styles['icon-rate']]: isOpenText,
      })}
    />
  );

  // 当控制是(展开、收起)文字在句末时的子节点
  const childrenDom = (
    <>
      {isViewIcon && (
        <label onClick={changeIsOpenState} className={styles['text-fold-btn']}>
          <span>{!isOpenText ? '展开' : '收起'}</span>
          {iconDom}
        </label>
      )}
      <span>
        {title && <span className={styles['fold-title']}>{title}</span>}
        {text}
      </span>
    </>
  );

  // 当控制展开收起（icon）在标题处的子节点
  const titleChildrenDom = (
    <span>
      {title && (
        <span
          onClick={isViewIcon ? changeIsOpenState : () => 'javaScript;'}
          className={styles['fold-title-control']}
        >
          {title}
          {isViewIcon && iconDom}
        </span>
      )}
      {text}
    </span>
  );

  return (
    <div className={styles['text-fold-box']}>
      <div ref={textBoxRef} className={styles['text-fold-content-mask']}>
        {title}
        {text}
      </div>
      <div
        style={{
          WebkitLineClamp: webkitLineClamp,
          lineHeight,
          opacity,
        }}
        className={styles['text-fold-content']}
      >
        {titleControl ? titleChildrenDom : childrenDom}
      </div>
    </div>
  );
};

export default memo(TextFold);
