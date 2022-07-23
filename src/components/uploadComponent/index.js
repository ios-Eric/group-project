/**
 * 该组件为文件上传组件（组件包含功能有上传、下载）展示时也可以隐藏掉上传按钮，仅供查看文件
 * @type 文件所属哪个分类（必填，该值定义要和redux库中 state 命名保持一致，方便组件直接可以获取）
 * @isHideBtn 该参数控制上传按钮是否展示，传入true 则不展示上传按钮
 * @accept 上传时可支持的文件类型，默认全部
 * @downloadIconShow 下载图标展示
 * @deleteIconShow 删除图标展示
 * @params 获取文件列表所需的参数集合
 * @FILES redux 库中的数据源，该参数不用传，组件已通过 connect 获取
 * @saveFileList redux 库中的修改数据源的函数，该参数不用传，组件已通过 connect 获取
 * @isDragger 决定当前是否是拖拽上传
 */
import React, { memo, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Upload, message, Tooltip } from 'antd';
import { BaseIcon } from '../icons';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  fileUpload,
  fileDownload,
  getAllAttachmentList,
  fileUploadRecordList,
  deleteAttachmentByID,
} from '../../api/index';
import { ownerTypeValue } from '../../common/constants/files/filesType.ts';
import { mapDispatchToProps, mapStateToProps } from '../../redux/attachment';
import BasePopconfirm from '../secondaryModal/BasePopconfirm';
import { AuthButton } from '@/modules/cms/common/const';
import IconLoading from '../icons/IconLoading';
import styles from './index.module.less';

const { Dragger } = Upload;

const UploadComponent = (props) => {
  const {
    type,
    isHideBtn,
    accept,
    downloadIconShow,
    deleteIconShow,
    params,
    FILES,
    saveFileList,
    isDragger,
    isInitGetFiles,
  } = props;

  const { owner, business } = params || {};
  const userId = Number(localStorage.getItem('userId')) || null;
  const [delLoading, setDelLoading] = useState(false);
  const [downLoading, setDownLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // 通过type 区分文件所属
  const ownerType = useMemo(() => {
    switch (type) {
      case 'CREDIT_REPORT':
        return 1;
      case 'INQUIRY':
        return 10;
      case 'PAYMENT_SEAL':
        return 3;
      case 'APPROVAL_TYPE':
        return 17;
      case 'ALL_FILES':
        return 7;
      default:
        return 7;
    }
  }, [type]);

  // 获取全部附件信息列表
  const getFilesList = async () => {
    let ownerTypes = [ownerType];
    let isIPOFile = false;
    if (type === 'ALL_FILES') {
      ownerTypes = [1, 3, 10, 17, 7];
      // isIPOFile = true;
    } else if (ownerTypes.includes(10)) {
      isIPOFile = true;
    }
    const res = await getAllAttachmentList({
      ...params,
      userId,
      isIPOFile,
      ownerTypes,
    });
    if (_.isArray(res)) {
      saveFileList(res, type);
    }
  };

  useEffect(() => {
    if (owner && business && isInitGetFiles) {
      getFilesList();
    }
  }, [owner, business, isInitGetFiles]);

  const upLoadFile = _.debounce((fileObj) => {
    if (uploadLoading) return;
    setUploadLoading(true);
    const { file } = fileObj;
    const fileData = new FormData();
    fileData.append('file', file);
    fileUpload(fileData)
      .then(async (res) => {
        await fileUploadRecordList({
          attachments: [
            {
              business,
              name: file.name,
              owner,
              uri: res.data.path,
              userId,
              ownerType,
            },
          ],
          isJYFile: true,
          isSupportMultiSameType: true,
        });
        message.success(`${file.name} 上传成功`);
        getFilesList();
      })
      .catch(() => {
        message.error(`${file.name} 上传失败`);
      })
      .finally(() => {
        setUploadLoading(false);
      });
  }, 300);

  const handleFileDownload = (res) => {
    const disposition = res.headers.get('content-disposition');
    if (disposition && disposition.match(/attachment;/)) {
      const filename = decodeURIComponent(
        disposition
          .replace(/attachment;.*filename=/, '')
          .replace(/"/g, '')
          .replace(/\+/g, '%20'),
      );
      res.blob().then((data) => {
        const blobUrl = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = filename;
        a.href = blobUrl;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        });
      });
    } else {
      message.warning('获取不到下载文件');
    }
  };

  const downloadFile = _.debounce((item) => {
    const { name, uri } = item;
    if (uri.indexOf('/') < 0 || downLoading) return;
    setDownLoading(true);
    const [fileGroup] = uri.split('/');
    const reg = new RegExp(`^${fileGroup}/`, 'g');
    const fileName = encodeURIComponent(name); // 对文件名转码
    fileDownload({
      fileName,
      group: fileGroup,
      path: encodeURIComponent(uri.replace(reg, '')),
    })
      .then((res) => {
        handleFileDownload(res);
      })
      .finally(() => {
        setDownLoading(false);
      });
  }, 300);

  const deleteFile = _.debounce((item) => {
    const { name, id } = item || {};
    if (!id || delLoading) return;
    setDelLoading(true);
    deleteAttachmentByID(id)
      .then(() => {
        message.success(`${name} 删除成功`);
        getFilesList();
      })
      .finally(() => {
        setDelLoading(false);
      });
  }, 300);

  const tipContent = (item) => (
    <>
      <div>{item.name}</div>
      <div>文件类型: {ownerTypeValue[item.ownerType]}</div>
      <div>
        <span className={styles['tip-user-name']}>{item.userName}</span>
        {item.createDate}
      </div>
    </>
  );

  // 自定义文件列表展示
  const fileList = () =>
    !_.isEmpty(FILES[type]) &&
    _.isArray(FILES[type]) &&
    FILES[type].map((item, index) => {
      const spotIndex = item.name ? item.name.lastIndexOf('.') : -1;
      let fileName = item.name;
      let fileExtension = null;
      if (spotIndex > -1) {
        fileName = item.name.slice(0, spotIndex);
        fileExtension = item.name.slice(spotIndex);
      }
      return (
        <div key={index} className={styles['upload-file-item']}>
          <Tooltip placement="top" title={tipContent(item)}>
            <div className={styles['file-item-content']}>
              <BaseIcon
                className={styles['file-item-icon']}
                type="paper-clip"
              />
              <div className={styles['item-name-overflow']}>{fileName}</div>
              <div>{fileExtension}</div>
            </div>
          </Tooltip>
          <div className={styles['file-item-option']}>
            {downloadIconShow && (
              <IconLoading
                loading={downLoading}
                childComponents={
                  <BaseIcon
                    className={styles['option-icon']}
                    type="download"
                    onClick={() => downloadFile(item)}
                  />
                }
              />
            )}
            {deleteIconShow &&
              (type !== 'ALL_FILES' ||
                (type === 'ALL_FILES' && item.ownerType === 7)) && (
                <IconLoading
                  loading={delLoading}
                  childComponents={
                    <BasePopconfirm
                      title="确定要删除吗？"
                      onOk={() => deleteFile(item)}
                    >
                      <BaseIcon
                        className={styles['option-icon']}
                        type="delete"
                      />
                    </BasePopconfirm>
                  }
                />
              )}
          </div>
        </div>
      );
    });

  if (isDragger) {
    return (
      <span className={styles['dragger-warp-bg']}>
        {!isHideBtn && (
          <Dragger
            showUploadList={false}
            customRequest={upLoadFile}
            accept={accept}
          >
            <div className={styles['upload-drag-content']}>
              <BaseIcon className={styles['upload-file-icon']} type="inbox" />
              <div className={styles['upload-content-title']}>
                点击或将文件拖拽到这里上传
              </div>
              <div className={styles['upload-content-des']}>
                支持扩展名：.rar .zip .doc .docx .pdf .jpg...
              </div>
            </div>
          </Dragger>
        )}
        {fileList()}
      </span>
    );
  }

  return (
    <div>
      <Upload showUploadList={false} customRequest={upLoadFile} accept={accept}>
        {!isHideBtn && (
          <AuthButton btnkey="上传附件" className={styles['upload-button']}>
            <IconLoading
              loading={uploadLoading}
              childComponents={
                <BaseIcon type="upload" className={styles['upload-icon']} />
              }
            />
            上传文件
          </AuthButton>
        )}
      </Upload>
      {fileList()}
    </div>
  );
};

UploadComponent.defaultProps = {
  downloadIconShow: true,
  deleteIconShow: true,
  FILES: {},
  isHideBtn: false,
  accept: '',
  saveFileList: () => {},
  params: {},
  isDragger: false,
  isInitGetFiles: true,
};

UploadComponent.propTypes = {
  type: PropTypes.string.isRequired,
  downloadIconShow: PropTypes.bool,
  deleteIconShow: PropTypes.bool,
  FILES: PropTypes.object,
  isHideBtn: PropTypes.bool,
  accept: PropTypes.string,
  saveFileList: PropTypes.func,
  params: PropTypes.object,
  isDragger: PropTypes.bool,
  isInitGetFiles: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(memo(UploadComponent));
