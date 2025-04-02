import React, { useState, useRef, useEffect } from "react";
import { Modal, Upload, Button, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./index.scss";

const { Dragger } = Upload;

const BoxSelector = ({ value = {}, onChange, disabled }) => {
  console.log(value);
  const { cropperData: initialCropperData, imageUrl: initialImageUrl } = value;
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const [cropperData, setCropperData] = useState(initialCropperData || null);
  const [previewScale, setPreviewScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const cropperRef = useRef(null);
  const previewRef = useRef(null);

  // 计算预览区域的缩放比例和图片位置
  const calculatePreviewScale = (img) => {
    if (!previewRef.current) return { scale: 1, x: 0, y: 0 };

    const containerWidth = previewRef.current.clientWidth;
    const containerHeight = previewRef.current.clientHeight;
    const scaleX = containerWidth / img.naturalWidth;
    const scaleY = containerHeight / img.naturalHeight;
    const scale = Math.min(scaleX, scaleY);

    // 计算图片在容器中的实际显示尺寸
    const displayWidth = img.naturalWidth * scale;
    const displayHeight = img.naturalHeight * scale;

    // 计算图片在容器中的居中位置
    const x = (containerWidth - displayWidth) / 2;
    const y = (containerHeight - displayHeight) / 2;

    return { scale, x, y };
  };

  // 处理图片上传
  const handleUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("只能上传图片文件！");
      return false;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setImageUrl(reader.result);
        setModalVisible(true);
        // 保证元素渲染之后再计算缩放比例
        setTimeout(() => {
          const { scale, x, y } = calculatePreviewScale(img);
          setPreviewScale(scale);
          setImagePosition({ x, y });
        }, 100);
      };
    };
    return false;
  };

  // 处理框选完成
  const handleCropComplete = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const data = cropper.getData();
      setCropperData(data);
      onChange?.({
        imageUrl: imageUrl,
        cropperData: data,
      });
      setModalVisible(false);
    }
  };

  // 处理取消框选
  const handleCancel = () => {
    setModalVisible(false);
  };

  // 渲染预览区域
  const renderPreview = () => {
    if (!imageUrl) return null;

    return (
      <div className="box-selector-preview" ref={previewRef}>
        <div className="box-selector-preview-image">
          <img src={imageUrl} alt="预览" />
          {cropperData && (
            <div
              className="box-selector-box"
              style={{
                transform: `translate(${imagePosition.x}px, ${imagePosition.y}px)`,

                left: `${cropperData.x * previewScale}px`,
                top: `${cropperData.y * previewScale}px`,
                width: `${cropperData.width * previewScale}px`,
                height: `${cropperData.height * previewScale}px`,
              }}
            />
          )}
        </div>
      </div>
    );
  };

  // 监听图片URL变化
  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
      setCropperData(initialCropperData || {});
      const img = new Image();
      img.src = initialImageUrl;
      img.onload = () => {
        const { scale, x, y } = calculatePreviewScale(img);
        console.log(scale, x, y);
        setPreviewScale(scale);
        setImagePosition({ x, y });
      };
    }
  }, [initialImageUrl]);


  return (
    <div className="box-selector">
      {!imageUrl ? (
        <Dragger
          accept="image/*"
          showUploadList={false}
          beforeUpload={handleUpload}
          disabled={disabled}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽图片到此区域进行框选</p>
        </Dragger>
      ) : (
        <div className="box-selector-content">
          {renderPreview()}
          {!disabled && (
            <div className="box-selector-actions">
              <Button onClick={() => setModalVisible(true)}>重新框选</Button>
              <Button
                onClick={() => {
                  setImageUrl("");
                  setCropperData(null);
                  onChange?.({
                    imageUrl: "",
                    cropperData: null,
                  });
                }}
              >
                清除
              </Button>
            </div>
          )}
        </div>
      )}

      <Modal
        title="框选目标"
        open={modalVisible}
        onOk={handleCropComplete}
        onCancel={handleCancel}
        width={800}
        destroyOnClose
      >
        <div className="box-selector-modal">
          <Cropper
            ref={cropperRef}
            src={imageUrl}
            style={{ height: 400, width: "100%" }}
            aspectRatio={NaN}
            guides={true}
            viewMode={1}
            dragMode="crop"
            zoomOnWheel={false}
            movable={false}
            autoCrop={true}
            autoCropArea={-1}
            initialAspectRatio={1}
            restore={false}
            modal={true}
            highlight={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            toggleDragModeOnDblclick={true}
            initialData={cropperData}
          />
        </div>
      </Modal>
    </div>
  );
};

export default BoxSelector;
