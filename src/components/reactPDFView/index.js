import React, { memo, useState, useEffect, useCallback } from 'react';
import PDF from 'react-pdf-js';
import PropTypes from 'prop-types';
import { fileDownload } from '@/apiUrl/index.js';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Pagination, Modal, Button, Spin, message } from 'antd';
import style from '@/common/styles/index.module.less';
import styles from './index.module.less';

const ReactPDFView = (props) => {
  const { visible, file, onClose } = props;
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [scale, setScale] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);

  const parseViewFile = useCallback(() => {
    const [fileGroup] = file.uri.split('/');
    const reg = new RegExp(`^${fileGroup}/`, 'g');
    const fileName = encodeURIComponent(file.name); // 对文件名转码
    fileDownload({
      fileName,
      group: fileGroup,
      path: encodeURIComponent(file.uri.replace(reg, '')),
    })
      .then(async (res) => {
        const disposition = res.headers.get('content-disposition');
        if (!(disposition && disposition.match(/attachment;/))) {
          message.error('获取文件失败');
          return;
        }
        const reader = new FileReader();
        const data = await res.blob();
        const blob = new Blob([data], { type: 'application/pdf' });
        if (blob) {
          reader.readAsDataURL(blob);
          reader.addEventListener(
            'load',
            () => {
              // react-pdf-js支持base64文件流
              setPdfFile(reader.result);
              setLoading(false);
            },
            false,
          );
        } else {
          message.error('文件打开错误');
          setLoading(false);
        }
      })
      .catch(() => {
        message.error('获取文件失败');
        setLoading(false);
      });
  }, [file]);

  useEffect(() => {
    if (file.uid && visible) {
      parseViewFile();
    }
  }, [file, parseViewFile, visible]);

  const onDocumentComplete = (pageSize) => {
    setPage(1);
    setPages(pageSize);
  };

  const handleChange = (pageIndex) => setPage(pageIndex);

  const handleAddScale = () => {
    if (scale < 2) {
      setScale(scale + 0.2);
    }
  };

  const handleDelScale = () => {
    if (scale > 0.5) {
      setScale(scale - 0.2);
    }
  };

  const childrenDom = () => {
    let childrenNode = '';
    if (loading) {
      childrenNode = <Spin />;
    } else if (pdfFile) {
      childrenNode = (
        <PDF
          file={pdfFile}
          scale={scale}
          onDocumentComplete={onDocumentComplete}
          page={page}
        />
      );
    } else {
      childrenNode = '文件打开失败';
    }
    return childrenNode;
  };

  return (
    <Modal
      title={file.name}
      closable={false}
      maskClosable={false}
      width="960px"
      visible={visible}
      style={{ overflow: 'hidden' }}
      centered
      footer={[
        <div key="sum" className={style['comui-dis-flex__end']}>
          <div key="zoom">
            <ZoomOutOutlined
              style={{ fontSize: 24, cursor: 'pointer', marginRight: 20 }}
              onClick={handleDelScale}
            />
            <ZoomInOutlined
              style={{ fontSize: 24, cursor: 'pointer' }}
              onClick={handleAddScale}
            />
          </div>
          <Pagination
            className={`${style['comui-ml-40']} ${style['comui-mr-40']}`}
            key="page"
            onChange={handleChange}
            total={pages}
            current={page}
          />
          <Button key="submit" type="primary" onClick={onClose}>
            确定
          </Button>
        </div>,
      ]}
    >
      <div className={styles['canvas-box']}>{childrenDom()}</div>
    </Modal>
  );
};

ReactPDFView.propTypes = {
  file: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default memo(ReactPDFView);
