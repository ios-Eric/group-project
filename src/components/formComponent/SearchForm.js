/**
 * 该组件主要用于主列表的过滤栏
 * @formBtn 控制是否需要展示查询、重置功能按钮
 * @form 表单的实例
 * @name 表单的名称
 * @formIemArr 表单的控件数组
 * @isHideHead 是否展示标题
 * @otherOption 可以手动添加需要的操作按钮
 * @title 标题
 * @onSearch 搜索的处理函数，返回promise 再调用finally方法处理按钮loading状态
 * @isResetSearch 判断重置后是否需要重新搜索
 * @searchPropsLoading 查询按钮的loading 效果由外部控制
 * @defaultSearchItemsLength 默认展示几个搜索框
 * @otherResetHandleFun 重置时的额外的处理函数
 * @typeKey 该值决定一些样式比如search-1就是过滤栏必用的样式控件之间的边距等，默认的间距没有固定
 * @formItemOtherProps 表单Item（控件）需要的其他 props 其中 colSpan 栅格布局控制表单一行展示几个控件（默认是展示4个）
 * @updateState 监听表单值发生变化时更新组件的搜索条件state值
 */
import React, { memo, useState } from 'react';
import { Form, Row, Button, Col } from 'antd';
import _ from 'lodash';
import cn from 'classnames';
import PropsTypes from 'prop-types';
import { AuthButton } from '@/modules/cms/common/const';
import FormItemNew from './FormItem';
import {
  searchFromPropsLabelCol,
  searchFromPropsWrapperCol,
  searchFromPropsRowGutter,
  formItemDefaultProps,
} from './const';
import styles from './index.module.less';

const SearchForm = (props) => {
  const {
    formBtn,
    form,
    name,
    searchItems,
    isHideHead,
    otherOption,
    title,
    onSearch,
    isResetSearch,
    searchPropsLoading,
    defaultSearchItemsLength,
    otherResetHandleFun,
    handleResetFun,
    typeKey,
    formItemOtherProps,
    updateState,
    searchExtraContent,
    ...rest
  } = props;
  const { getFieldsValue, resetFields } = form || {};
  const [isExpand, setIsExpand] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  // const [searchLoading, setSearchLoading] = useState(searchPropsLoading);

  // 重置按钮
  const handleReset = _.debounce(() => {
    if (resetLoading) return;
    if (handleResetFun) {
      handleResetFun();
    }
    resetFields();
    if (isResetSearch) {
      setResetLoading(true);
      setTimeout(() => {
        otherResetHandleFun().finally(() => {
          setResetLoading(false);
        });
      }, 50);
    }
  }, 300);

  // 查询按钮
  const handleSearch = _.debounce(() => {
    if (searchPropsLoading) return;
    // setSearchLoading(true);
    const values = getFieldsValue(true);
    if (onSearch) {
      onSearch(values);
    }
  }, 300);

  return (
    <div className={styles['form-wrap-box']}>
      <Form
        form={form}
        labelCol={searchFromPropsLabelCol[typeKey]}
        wrapperCol={searchFromPropsWrapperCol[typeKey]}
        className={cn({
          [styles['form-box']]: true,
          // [styles['form-box-gutter']]: typeKey === 'search-1',
        })}
        colon={false}
        size="small"
        layout="horizontal"
        name={name}
        onValuesChange={updateState}
        {...rest}
      >
        {!isHideHead && (
          <div
            className={cn({
              [styles['form-header-title']]: true,
              [styles['form-header-title-noborder']]:
                defaultSearchItemsLength === 0 && !isExpand,
            })}
          >
            <h3>{title}</h3>
            <div
              className={cn({
                [styles['form-header-extra']]: searchExtraContent,
              })}
            >
              {searchExtraContent && (
                <div className={styles['form-header-extra-content']}>
                  {searchExtraContent}
                </div>
              )}
              {searchItems.length > defaultSearchItemsLength && (
                <Button onClick={() => setIsExpand(!isExpand)}>
                  {isExpand ? '收起筛选' : '展开筛选'}
                </Button>
              )}
              {otherOption}
            </div>
          </div>
        )}
        {defaultSearchItemsLength === 0 && !isExpand ? (
          ''
        ) : (
          <Row
            style={{ marginLeft: 0 }}
            {...searchFromPropsRowGutter[typeKey]}
            type="flex"
            className={cn({
              [styles['form-box-gutter']]: typeKey === 'search-1',
            })}
          >
            <FormItemNew
              {...formItemDefaultProps}
              {...formItemOtherProps}
              form={form}
              formItemArr={
                isExpand
                  ? searchItems
                  : searchItems.slice(0, defaultSearchItemsLength)
              }
            />
            {formBtn && (
              <Col
                span={(4 - ((isExpand ? searchItems.length : 3) % 4)) * 6 || 24}
              >
                <div className={styles['form-btn-option']}>
                  <Button
                    onClick={handleReset}
                    loading={resetLoading}
                    disabled={searchPropsLoading && !resetLoading}
                  >
                    重置
                  </Button>
                  <AuthButton
                    className={styles['form-btn-search']}
                    type="primary"
                    onClick={handleSearch}
                    loading={searchPropsLoading && !resetLoading}
                    disabled={resetLoading}
                    btnkey="查询"
                  >
                    查询
                  </AuthButton>
                </div>
              </Col>
            )}
          </Row>
        )}
      </Form>
    </div>
  );
};

SearchForm.defaultProps = {
  form: {},
  name: '',
  formBtn: true,
  searchItems: [],
  defaultSearchItemsLength: 3,
  isHideHead: false,
  otherOption: [],
  title: '',
  onSearch: () => {},
  isResetSearch: true,
  searchPropsLoading: false,
  otherResetHandleFun: () => {},
  handleResetFun: () => {},
  typeKey: 'default-0',
  formItemOtherProps: {},
  updateState: () => {},
  searchExtraContent: null,
};

SearchForm.propTypes = {
  formBtn: PropsTypes.bool,
  form: PropsTypes.any,
  name: PropsTypes.string,
  searchItems: PropsTypes.array,
  defaultSearchItemsLength: PropsTypes.number,
  isHideHead: PropsTypes.bool,
  otherOption: PropsTypes.array,
  searchExtraContent: PropsTypes.node,
  title: PropsTypes.string,
  onSearch: PropsTypes.func,
  isResetSearch: PropsTypes.bool,
  searchPropsLoading: PropsTypes.bool,
  otherResetHandleFun: PropsTypes.func,
  handleResetFun: PropsTypes.func,
  typeKey: PropsTypes.string,
  formItemOtherProps: PropsTypes.object,
  updateState: PropsTypes.func,
};

export default memo(SearchForm);
