import React, { useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  Transfer,
  Upload,
  Button,
  Form,
  Input,
  Space,
  message,
  Pagination,
  Skeleton,
  List,
  Checkbox,
  Table,
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import ajax from "@/services";
import { useRequest, useHeight, useStateRef } from "@/hooks";
import { createRandom, pageSizeOptions } from "@/utils";
import TableTransfer from "./TableTransfer";
import "./index.scss";

const { Dragger } = Upload;
const { getDataset, uploadFile, importDataset } = ajax.dataset;

const explainData = {
  image: {
    image: [
      "支持图片格式：jpg、jpeg、png、bmp",
      "图片分辨率限制：64px*64px≤图片分辨率≤4096px*4096px",
      "图片名称长度≤200字符",
      "图片名称不可以包含特殊符号：$、%、&",
      "单张图片大小≤20MB",
      "支持同时上传多张图片，建议单次上传图片数据≤500张",
    ],
    folder: [
      "支持图片格式：jpg、jpeg、png、bmp",
      "图片分辨率限制：64px*64px≤图片分辨率≤4096px*4096px",
      "图片名称长度≤200字符",
      "图片名称不可以包含特殊符号：$、%、&",
      "单张图片大小≤20MB",
      "建议单次上传图片数据≤500张",
    ],
    zip: [
      "支持图片格式：jpg、jpeg、png、bmp",
      "图片分辨率限制：64px*64px≤图片分辨率≤4096px*4096px",
      "图片名称长度≤200字符",
      "图片名称不可以包含特殊符号：$、%、&",
      "单张图片大小≤20MB",
      "压缩包大小≤5GB；支持压缩包格式：zip",
    ],
  },
  video: {
    image: [
      "支持视频格式：mp4；编码方式：H.264和H.265",
      "视频分辨率限制：1280px*720px≤视频分辨率≤3264px*2448px",
      "视频名称长度≤200字符",
      "视频名称不可以包含特殊符号：$、%、&",
      "单个视频时长≤10s",
      "支持同时上传多个视频，建议单次上传视频数据≤100个",
    ],
    folder: [
      "支持视频格式：mp4；编码方式：H.264和H.265",
      "视频分辨率限制：1280px*720px≤视频分辨率≤3264px*2448px",
      "视频名称长度≤200字符",
      "视频名称不可以包含特殊符号：$、%、&",
      "单个视频时长≤10s",
    ],
    zip: [
      "支持视频格式：mp4；编码方式：H.264和H.265",
      "视频分辨率限制：1280px*720px≤视频分辨率≤3264px*2448px",
      "视频名称长度≤200字符",
      "视频名称不可以包含特殊符号：$、%、&",
      "单个视频时长≤10s",
      "压缩包大小≤5GB；支持压缩包格式：zip",
    ],
  },
};

const accept = {
  image: {
    image: "image/jpeg,image/png,image/bmp",
    folder: "",
    zip: "application/zip",
  },
  video: {
    image: "video/mp4",
    folder: "",
    zip: "application/zip",
  },
};

const ImportDataModal = (props) => {
  const { visible, onCancel, onOk, importType = "existing", data = {} } = props;
  const dataType = data?.dataType || "image";

  const [targetKeys, setTargetKeys] = useState([]);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState(importType);

  const [uploadType, setUploadType] = useState("image"); // image or folder or zip

  const [importData, setImportData] = useState({
    fileList: [],
    selectedKeys: [],
    streams: [],
  });

  // 数据集列表

  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
    setImportData({
      ...importData,
      selectedKeys: nextTargetKeys,
    });
  };

  const handleUpload = (info) => {
    const { status } = info.file;
    console.log(info, "info");
    if (status === "done") {
      const { response } = info.file;
      setImportData({
        ...importData,
        fileList: [...importData.fileList, response?.url],
      });
      message.success(`${info.file.name} 文件上传成功`);
    } else if (status === "error") {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    action: "http://localhost:3002/dataset/upload",
    onChange: handleUpload,
    beforeUpload: (file) => {
      console.log(file);
      let flag;
      switch (uploadType) {
        case "image":
        case "folder":
          if (dataType === "image") {
            // 判断图片文件后缀名
            flag =
              file.name.endsWith(".jpg") ||
              file.name.endsWith(".png") ||
              file.name.endsWith(".jpeg") ||
              file.name.endsWith(".bmp");
          } else {
            // 判断视频文件后缀名
            flag = file.name.endsWith(".mp4");
            //  || file.name.endsWith(".avi") || file.name.endsWith(".mov");
          }
          break;

        // 判断文件夹
        // flag = file.type.startsWith("folder/");
        case "zip":
          // 判断压缩包
          flag = file.name.endsWith(".zip");
          break;
        default:
          flag = false;
      }
      console.log(flag, file);
      if (!flag) {
        message.error(`文件 ${file.name} 不符合上传要求`);
      }
      return flag || Upload.LIST_IGNORE;
    },
    directory: uploadType === "folder",
    accept: accept[dataType][uploadType],
  };

  const handleOk = () => {
    const streams =
      form.getFieldValue("streams")?.filter((item) => !!item) || [];
    const newFormData = {
      ...importData,
      streams: streams,
    };
    // 判断是否存在数据
    if (
      newFormData.fileList.length === 0 &&
      newFormData.streams.length === 0 &&
      newFormData.selectedKeys.length === 0
    ) {
      message.error("请至少导入一个数据");
      return;
    }

    importDataset(newFormData)
      .then((res) => {
        console.log(res, "res");
        message.success(res.message || "导入成功");
        onCancel();
      })
      .catch((err) => {
        console.log(err, "err");
        message.error(err.message || "导入失败");
      });
  };
  const items = [
    {
      key: "existing",
      label: "从已有数据集导入",
      children: (
        <TableTransfer targetKeys={targetKeys} onChange={handleChange} />
      ),
    },
    {
      key: "local",
      label: "导入本地数据",
      children: (
        <>
          <Tabs
            defaultActiveKey={"image"}
            onChange={(key) => setUploadType(key)}
            activeKey={uploadType}
            className="import-data-modal-content-tabs"
          >
            <Tabs.TabPane
              tab={dataType === "image" ? "图片上传" : "视频上传"}
              key="image"
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  点击或拖拽{dataType === "image" ? "图片" : "视频"}
                  文件到此区域上传
                </p>
              </Dragger>
            </Tabs.TabPane>
            <Tabs.TabPane tab="文件夹上传" key="folder">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件夹到此区域上传</p>
              </Dragger>
            </Tabs.TabPane>
            <Tabs.TabPane tab="压缩包上传" key="zip">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  点击或拖拽压缩包文件到此区域上传
                </p>
              </Dragger>
            </Tabs.TabPane>
          </Tabs>
          <div className="explain-data">
            <p>上传说明</p>
            <ul>
              {explainData[dataType][uploadType].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      ),
    },
    {
      key: "stream",
      label: "导入流式数据",
      children: (
        <Form form={form} layout="horizontal">
          <Form.List
            name="streams"
            initialValue={[""]}
            rules={[
              {
                validator: async (_, streams) => {
                  if (!streams || streams.length < 1) {
                    return Promise.reject(new Error("至少需要一个拉流地址"));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    required={false}
                    key={field.key + index}
                    // label={index === 0 ? "拉流地址" : ""}
                    label={"拉流地址"}
                  >
                    <Space>
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "请输入拉流地址",
                          },
                          {
                            type: "url",
                            message: "请输入有效的URL地址",
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder="请输入拉流地址"
                          style={{ width: "400px" }}
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Space>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: "400px" }}
                  >
                    添加拉流地址
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      ),
    },
  ];

  useEffect(() => {
    console.log("activeTab", activeTab);
    setImportData({
      fileList: [],
      selectedKeys: [],
      streams: [],
    });
  }, [activeTab]);

  useEffect(() => {
    if (visible) {
      setActiveTab(importType);
      setUploadType("image");
      // if (activeTab === "existing") {
      //   getData();
      // }
    }
  }, [visible]);

  return (
    <Modal
      title="导入数据"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={623}
      className="import-data-modal modal-common"
      okText="确认导入"
      cancelText="取消"
    >
      <Tabs
        className="import-data-modal-tabs"
        defaultActiveKey={activeTab}
        items={items}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      />
    </Modal>
  );
};

export default ImportDataModal;
