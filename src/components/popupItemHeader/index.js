/**
 * 二级弹窗页面的单个模块标题封装
 * @title 模块标题(默认是流程，其他需外部传入)
 * @isShowControlIcon 是否显示控制内容展示的icon图标
 * @defaultVisible 内容部分默认展开还是收起，若@isShowControlIcon 传false,该项要传true
 * @optionIcon 兼容部分标题右侧有输入框或者其他内容的情况
 * @children 模块内容
 * @openSingleVisible 控制title 右侧icon或者btn 部分是否有打开内容的功能
 * @noChose 控制该模块不让关闭并可以通过函数给一些提示性信息
 * @retainNode 该项传true的话，该组件内部节点不会销毁和重新创建，而是隐藏效果，主要用于一些输入控件的展开收起时不需要清空控件的值
 */
import React, { memo, useState, useCallback } from 'react';
import { BaseIcon } from '../icons';
import cn from 'classnames';
import PropsType from 'prop-types';
import styles from './index.module.less';

const PopupItemHeader = (props) => {
  const {
    optionIcon,
    isShowControlIcon,
    openSingleVisible,
    defaultVisible,
    title,
    children,
    noChose,
    retainNode,
  } = props;
  const [visible, setVisible] = useState(defaultVisible);

  // 右侧按钮或者其他 能够打开内容区
  const onChangePropsVisible = () => {
    if (!visible && openSingleVisible) setVisible(true);
  };

  const onChangeVisible = useCallback(() => {
    if (noChose() && visible) {
      noChose(true);
    } else {
      setVisible((v) => !v);
    }
  }, []);

  const noRetainNodes = visible && children;

  const retainNodes = (
    <div className={cn({ [styles['content-hidden']]: !visible })}>
      {children}
    </div>
  );

  return (
    <div className={styles['popup-item-wrap']}>
      <div className={styles['item-title-box']}>
        <div className={styles['title-box-left']}>
          <div className={styles['item-title-prefix']} />
          <div className={styles['item-title-text']}>{title}</div>
          {isShowControlIcon && (
            <BaseIcon
              type={visible ? 'minus-square' : 'plus-square'}
              onClick={onChangeVisible}
            />
          )}
        </div>
        <div role="button" tabIndex={0} onClick={onChangePropsVisible}>
          {optionIcon}
        </div>
      </div>
      {retainNode ? retainNodes : noRetainNodes}
    </div>
  );
};

PopupItemHeader.defaultProps = {
  optionIcon: '',
  isShowControlIcon: true,
  defaultVisible: false,
  title: '流程',
  openSingleVisible: false,
  noChose: () => false,
  retainNode: false,
};

PopupItemHeader.propTypes = {
  children: PropsType.element.isRequired,
  optionIcon: PropsType.oneOfType([PropsType.element, PropsType.string]),
  isShowControlIcon: PropsType.bool,
  openSingleVisible: PropsType.bool,
  defaultVisible: PropsType.bool,
  title: PropsType.string,
  noChose: PropsType.func,
  retainNode: PropsType.bool,
};

export default memo(PopupItemHeader);
