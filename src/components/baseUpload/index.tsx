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
import React, {
  memo,
  useEffect,
  useRef,
  useState,
  // useMemo,
  ReactNode,
} from 'react';
import {
  Upload,
  message,
  // Tooltip,
  Progress,
  Button,
  Popconfirm,
  UploadProps,
} from 'antd';
import BaseIcon from '../baseIcon';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  fileDownload,
  // getAllAttachmentList,
  deleteAttachmentByID,
} from '@/apiUrl/index.js';
import { IObject } from '@/common/constants/interface';
import StatusIcon from '@/components/statusIcon';
import { saveFilesList } from '@/common/redux/actions/attachment';
// import { AuthButton } from '@/modules/cms/common/const';
import ReactPDFView from '../reactPDFView/index.js';
// import { ownerTypeValue } from '../../common/constants/files/filesType.ts';
import styles from './index.module.less';

const { Dragger } = Upload;

interface IUploadProps extends UploadProps {
  fileType: string;
  uploadText: ReactNode;
  textTip?: ReactNode;
  isDragger?: boolean;
  downloadIconShow?: boolean;
  deleteIconShow?: boolean;
  viewIconShow?: boolean;
  isHideBtn?: boolean;
  accept?: string;
  params?: IObject;
  multiple?: boolean;
  otherParams?: IObject;
  isViewProgress?: boolean;
  isfileNameType?: boolean;
  saveId?: number | string;
  validationName?: string;
}

const BaseUpload: React.FC<IUploadProps> = (props) => {
  const {
    fileType,
    downloadIconShow = false,
    deleteIconShow = true,
    viewIconShow = false,
    isHideBtn = false,
    accept = '',
    params = {},
    multiple = false,
    uploadText,
    textTip,
    isDragger = false,
    otherParams = {},
    isViewProgress = true,
    isfileNameType,
    saveId,
    validationName,
  } = props;
  const dispatch = useDispatch();
  const [pdfFile, setPdfFile] = useState({});
  const [visible, setVisible] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [downLoading, setDownLoading] = useState(false);
  const percentRef = useRef(0);
  const { FILES } = useSelector((state: any) => state.publicData.FILES);
  const { owner, business } = params || {};
  // const userId = Number(localStorage.getItem('userId')) || null;
  const user_token = localStorage.getItem('user_token') || '';

  console.log({ FILES, otherParams });
  // 通过type 区分文件所属
  // const ownerType = useMemo(() => {
  //   switch (fileType) {
  //     case 'MODULE_MANAGE_ZIP':
  //       return 7;
  //     case 'MODULE_MANAGE_SINGLE':
  //       return 7;
  //     default:
  //       return 7;
  //   }
  // }, [fileType]);

  // 获取全部附件信息列表
  const getFilesList = async () => {
    // const res = await getAllAttachmentList({
    //   ...params,
    //   userId,
    //   isIPOFile: false,
    //   ownerType,
    // });
    // if (_.isArray(res)) {
    //   saveFilesList({ data: [...res], type: fileType, dispatch });
    // }
  };

  useEffect(() => {
    if (owner && business) {
      getFilesList();
    }
  }, [owner, business]);

  const handleFileDownload = (res: any) => {
    const disposition = res.headers.get('content-disposition');
    if (disposition && disposition.match(/attachment;/)) {
      const filename = decodeURIComponent(
        disposition
          .replace(/attachment;.*filename=/, '')
          .replace(/"/g, '')
          .replace(/\+/g, '%20'),
      );
      res.blob().then((data: any) => {
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

  const downloadFile = _.debounce((item: any) => {
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
      .then((res: any) => {
        handleFileDownload(res);
      })
      .finally(() => {
        setDownLoading(false);
      });
  }, 50);

  const deleteFile = _.debounce((item: any) => {
    const { name, id, response, lastModified, uid } = item || {};
    if (!response || !id) {
      if (fileType === 'MODULE_MANAGE_SINGLE' && saveId) {
        let newObj: IObject | null = {};
        Object.keys(FILES[fileType] || {}).forEach((id: string) => {
          if (id !== saveId && newObj) {
            newObj[id] = FILES[fileType][id];
          }
        });
        saveFilesList({ data: newObj, type: fileType, dispatch });
        newObj = null;
      } else {
        const newFiles: any[] = [];
        FILES[fileType].map((it: any) => {
          if (it.lastModified === lastModified && it.uid === uid) {
            return null;
          }
          newFiles.push(it);
          return null;
        });
        saveFilesList({ data: newFiles, type: fileType, dispatch });
      }
      message.success(`${name} 删除成功`);
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

  const handleView = (file: any) => {
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
    action: `${window.origin}/xone-api/attachment/v1.0/file/upload`,
    data: {
      // ...otherParams,
    },
    headers: {
      Token: user_token,
    },
    beforeUpload: (file: any) => {
      let fileNameArray: string[] | string = file?.name?.split('.') || [];
      let fileType =
        typeof fileNameArray !== 'string' ? fileNameArray.pop() : '';
      let fileName =
        typeof fileNameArray !== 'string' ? fileNameArray.join('.') : '';
      if (accept && fileType && accept.indexOf(fileType) === -1) {
        let text = '';
        if (accept.indexOf('.zip')) {
          text = '压缩包';
        }
        message.error(`${text}文件格式仅支持zip格式，请重新上传`);
        text = '';
        return false;
      } else if (validationName && fileName !== validationName) {
        message.error('文件名称不匹配，请核对后重新上传');
        return false;
      }
      fileName = '';
      fileNameArray = '';
      fileType = '';
      console.log(file);
    },
    onProgress: (e: any) => {
      percentRef.current = e.percent;
    },
    onChange: (info: any) => {
      const { status } = info.file;
      if (!multiple) {
        if (status) {
          if (fileType === 'MODULE_MANAGE_SINGLE' && saveId) {
            saveFilesList({
              data: {
                ...FILES['MODULE_MANAGE_SINGLE'],
                [saveId]: [{ ...otherParams, ...info.file }],
              },
              type: fileType,
              dispatch,
            });
          } else {
            saveFilesList({
              data: [{ ...otherParams, ...info.file }],
              type: fileType,
              dispatch,
            });
          }
        }
      }
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  // const tipContent = (item: any) => (
  //   <div>
  //     <div>{item.name}</div>
  //     <div>文件类型: {ownerTypeValue[ownerType]}</div>
  //     <div>
  //       <span className={styles['tip-user-name']}>{item.userName}</span>
  //       {item.createDate}
  //     </div>
  //   </div>
  // );

  // 文件item 展示
  const fileList = () => {
    let fileLists = [];
    if (fileType === 'MODULE_MANAGE_SINGLE' && saveId) {
      fileLists = FILES['MODULE_MANAGE_SINGLE'][saveId];
    } else {
      fileLists = FILES[fileType];
    }
    if (!_.isEmpty(fileLists) && _.isArray(fileLists)) {
      return fileLists.map((item: any) => {
        const spotIndex = item.name ? item.name.lastIndexOf('.') : -1;
        let fileName = item.name;
        let fileExtension = null;
        if (spotIndex > -1) {
          fileName = item.name.slice(0, spotIndex);
          fileExtension = item.name.slice(spotIndex);
        }
        return (
          // <Tooltip key={index} placement="top" title={tipContent(item)}>
          <>
            {!isfileNameType && (
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
                    <BaseIcon
                      className={styles['option-icon']}
                      type="download"
                      loading={downLoading}
                      onClick={() => downloadFile(item)}
                    />
                  )}
                  {deleteIconShow && (
                    <Popconfirm
                      title="确定要删除吗？"
                      onConfirm={() => deleteFile(item)}
                    >
                      <BaseIcon
                        className={styles['option-icon']}
                        type="delete"
                        loading={delLoading}
                      />
                    </Popconfirm>
                  )}
                </div>
              </div>
            )}
            {item?.status && isViewProgress && (
              <Progress
                showInfo={false}
                percent={percentRef.current}
                strokeWidth={4}
                status="active"
                strokeColor={
                  item.status === 'error'
                    ? 'var(--xc-warning-color)'
                    : 'var(--xc-success-color)'
                }
              />
            )}
            {['done', 'error'].includes(item.status) && (
              <StatusIcon
                status={item.status}
                text={`文件上传${item.status === 'done' ? '成功' : '失败'}`}
              />
            )}
          </>
          // </Tooltip>
        );
      });
    }
  };

  if (isDragger) {
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
  }

  return (
    <div>
      {/* <Popconfirm > */}
      <Upload {...uploadProps}>
        {!isHideBtn && (
          <div className={styles['upload-button-box']}>
            <Button className={styles['upload-button']}>{uploadText}</Button>
            <div className={styles['batch-upload-tip']}>
              {isfileNameType &&
              fileType === 'MODULE_MANAGE_SINGLE' &&
              saveId &&
              !_.isEmpty(FILES[fileType][saveId])
                ? FILES[fileType][saveId][0]?.name
                : textTip}
            </div>
          </div>
        )}
      </Upload>
      {/* </Popconfirm> */}
      {fileList()}
    </div>
  );
};

export default memo(BaseUpload);
