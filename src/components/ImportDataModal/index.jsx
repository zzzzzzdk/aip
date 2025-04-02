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

const ImportDataModal = (props) => {
  const { visible, onCancel, onOk, importType = "existing", data = {} } = props;
  const dataType = data.dataType;

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
        <TableTransfer
          targetKeys={targetKeys}
          onChange={handleChange}
        />
      ),
    },
    {
      key: "local",
      label: "导入本地数据",
      children: (
        <Tabs
          defaultActiveKey={"image"}
          onChange={(key) => setUploadType(key)}
          activeKey={uploadType}
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
        defaultActiveKey={activeTab}
        items={items}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      />
    </Modal>
  );
};

export default ImportDataModal;
