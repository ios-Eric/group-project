/**
 * 该组件为拖拽上传，文件上传最后一个关联文件接口不在此调用(一般都是提交时调用)
 * @type 文件所属哪个分类（必填，该值定义要和redux库中 state 命名保持一致，方便组件直接可以获取）
 * @isHideBtn 该参数控制上传按钮是否展示，传入true 则不展示上传按钮
 * @accept 上传时可支持的文件类型，默认全部
 * @downloadIconShow 下载图标展示
 * @deleteIconShow 删除图标展示
 * @params 获取文件列表所需的参数集合
 * @saveFileList redux 库中的修改数据源的函数，该参数不用传，组件已通过 connect 获取
 */
import React, { memo, useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Upload, message, Tooltip, Progress } from 'antd';
import { BaseIcon } from '../icons';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  // fileUpload,
  fileDownload,
  getAllAttachmentList,
  // fileUploadRecordList,
  deleteAttachmentByID,
} from '../../api/index';
import { saveFilesList } from '../../redux/actions/attachment';
// import { AuthButton } from '@/modules/cms/common/const';
import BasePopconfirm from '../secondaryModal/BasePopconfirm';
import ReactPDFView from '../reactPDFView';
import IconLoading from '../icons/IconLoading';
import { ownerTypeValue } from '../../common/constants/files/filesType.ts';
import styles from './index.module.less';

const { Dragger } = Upload;

const DraggerUpload = (props) => {
  const {
    type,
    isHideBtn,
    accept,
    downloadIconShow,
    deleteIconShow,
    viewIconShow,
    params,
    multiple,
  } = props;
  const dispatch = useDispatch();
  const [pdfFile, setPdfFile] = useState({});
  const [visible, setVisible] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [downLoading, setDownLoading] = useState(false);
  const percentRef = useRef(0);
  const { FILES } = useSelector((state) => state.cms.FILES);
  const { owner, business } = params || {};
  // const [fileList, setFileList] = useState([]);
  const userId = Number(localStorage.getItem('userId')) || null;

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
      default:
        return 7;
    }
  }, [type]);

  // 获取全部附件信息列表
  const getFilesList = async () => {
    const res = await getAllAttachmentList({
      ...params,
      userId,
      isIPOFile: [10].includes(ownerType),
      ownerType,
    });
    if (_.isArray(res)) {
      saveFilesList([...res], type, dispatch);
    }
  };

  useEffect(() => {
    if (owner && business) {
      getFilesList();
    }
  }, [owner, business]);

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
  }, 50);

  const deleteFile = _.debounce((item) => {
    const { name, id, response, lastModified, uid } = item || {};
    if (!response || !id) {
      let newFiles = [];
      FILES[type].map((it) => {
        if (it.lastModified === lastModified && it.uid === uid) {
          return null;
        }
        newFiles.push(it);
        return null;
      });
      saveFilesList(newFiles, type, dispatch);
      message.success(`${name} 删除成功`);
      newFiles = null;
      return;
    }
    if (delLoading) return;
    setDelLoading(true);
    deleteAttachmentByID(id)
      .then(() => {
        message.success(`${name} 删除成功`);
        getFilesList();
      })
      .finally(() => {
        setDelLoading(false);
      });
  }, 50);

  const handleView = (file) => {
    let path = file.uri || file?.response?.data?.path;
    console.log(file);
    if (!path || !/.pdf$/.test(path)) {
      message.warning('暂不支持的文件预览格式');
      return;
    }
    setPdfFile({
      uri: path,
      name: file.name,
      uid: file.uid,
    });
    setVisible(true);
    path = null;
  };

  // 上传组件配置
  const uploadProps = {
    accept,
    multiple,
    showUploadList: false,
    action: `${window.origin}/xone-api/attachment/v1.0/attachment/jyupload`,
    data: {
      userId,
    },
    onProgress: (e) => {
      percentRef.current = e.percent;
      console.log(e.percent);
    },
    onChange: (info) => {
      const { status, uid } = info.file;
      let newFiles = [];
      let filterItem = FILES[type].filter((it) => it.uid === uid);
      if (_.isEmpty(filterItem)) {
        FILES[type].push(info.file);
        newFiles = FILES[type];
      } else {
        FILES[type].map((item) => {
          if (item.uid === uid) {
            if (status === 'done') {
              newFiles.push(info.file);
            }
            return null;
          }
          newFiles.push(item);
          return null;
        });
      }
      saveFilesList(newFiles, type, dispatch);
      filterItem = null;
      newFiles = null;
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  const tipContent = (item) => (
    <div>
      <div>{item.name}</div>
      <div>文件类型: {ownerTypeValue[ownerType]}</div>
      <div>
        <span className={styles['tip-user-name']}>{item.userName}</span>
        {item.createDate}
      </div>
    </div>
  );

  // 文件item 展示
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
        <Tooltip key={index} placement="top" title={tipContent(item)}>
          {/* <> */}
          <div className={styles['upload-file-item']}>
            <div className={styles['file-item-content']}>
              <BaseIcon
                className={styles['file-item-icon']}
                type="paper-clip"
              />
              <div className={styles['item-name-overflow']}>{fileName}</div>
              <div>{fileExtension}</div>
            </div>
            <div className={styles['file-item-option']}>
              {viewIconShow && (
                <BaseIcon
                  className={styles['option-icon']}
                  type="eye-o"
                  onClick={() => handleView(item)}
                />
              )}
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
              {deleteIconShow && (
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
          {item.status === 'uploading' && (
            <Progress
              showInfo={false}
              percent={percentRef.current}
              strokeWidth={1}
              status="active"
            />
          )}
          {/* </> */}
        </Tooltip>
      );
    });

  return (
    <span className={styles['dragger-warp-bg']}>
      {!isHideBtn && (
        <Dragger {...uploadProps}>
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
      <ReactPDFView
        file={pdfFile}
        visible={visible}
        onClose={() => {
          setVisible(false);
          setPdfFile({});
        }}
      />
    </span>
  );
};

DraggerUpload.defaultProps = {
  downloadIconShow: true,
  deleteIconShow: true,
  viewIconShow: false,
  isHideBtn: false,
  accept: '',
  params: {},
  multiple: true,
};

DraggerUpload.propTypes = {
  type: PropTypes.string.isRequired,
  downloadIconShow: PropTypes.bool,
  deleteIconShow: PropTypes.bool,
  viewIconShow: PropTypes.bool,
  isHideBtn: PropTypes.bool,
  accept: PropTypes.string,
  params: PropTypes.object,
  multiple: PropTypes.bool,
};

export default memo(DraggerUpload);
