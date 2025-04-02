import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Dropdown,
  Space,
  message,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import ImportDataModal from "../ImportDataModal";
import ajax from "@/services";
import "./index.scss";

const { TextArea } = Input;
const { createDataset, editDataset } = ajax.dataset;

export const dataSetType = [
  {
    label: "图片",
    value: "image",
  },
  {
    label: "视频",
    value: "video",
  },
];

const DatasetModal = (props) => {
  const { visible, onCancel, onOk, editingDataset } = props;
  const [form] = Form.useForm();

  const [importData, setImportData] = useState({
    visible: false,
    type: null,
    data: {},
  });

  const handleImport = ({ key }) => {
    form
      .validateFields()
      .then((values) => {
        setImportData({
          visible: true,
          type: key,
          data: values,
        });
      })
      .catch((err) => {
        console.log(err.message || "创建失败");
      });
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Success:", values);
        if (editingDataset) {
          editDataset(values)
            .then((res) => {
              message.success(res.message || "编辑成功");
              onOk?.();
            })
            .catch((err) => {
              console.log(err.message || "编辑失败");
            });
        } else {
          createDataset(values)
            .then((res) => {
              message.success(res.message || "创建成功");
              onOk?.();
            })
            .catch((err) => {
              console.log(err.message || "创建失败");
            });
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };

  const items = [
    {
      key: "existing",
      label: "已有数据集",
    },
    {
      key: "local",
      label: "本地数据",
    },
    {
      key: "stream",
      label: "流式数据",
    },
  ];
  useEffect(() => {
    if (visible) {
      form.setFieldsValue(editingDataset);
    }
  }, [visible]);

  return (
    <Modal
      title={editingDataset ? "编辑数据集" : "创建数据集"}
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      className="dataset-modal modal-common"
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        editingDataset ? (
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>
        ) : (
          <div>
            <Dropdown
              key="import"
              menu={{
                items,
                onClick: handleImport,
              }}
            >
              <Button>
                <Space>
                  创建并导入
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Button key="submit" type="primary" onClick={handleOk}>
              直接创建
            </Button>
          </div>
        ),
      ]}
    >
      <Form form={form} layout="vertical" className="dataset-form">
        <Form.Item
          name="dataSetName"
          label="数据集名称"
          rules={[{ required: true, message: "请输入数据集名称" }]}
        >
          <Input placeholder="请输入数据集名称" />
        </Form.Item>
        <Form.Item
          name="dataType"
          label="数据类型"
          rules={[{ required: true, message: "请选择数据类型" }]}
        >
          <Select
            options={dataSetType}
            allowClear
            placeholder="请选择数据类型"
          />
        </Form.Item>
        <Form.Item name="versionRemark" label="版本备注">
          <TextArea placeholder="请输入版本备注" />
        </Form.Item>
      </Form>
      <ImportDataModal
        visible={importData.visible}
        importType={importData.type}
        data={importData.data}
        onOk={(data) =>
          setImportData({
            visible: false,
            type: importData.type,
            data,
          })
        }
        onCancel={(data) =>
          setImportData({
            visible: false,
            type: importData.type,
            data: {},
          })
        }
      />
    </Modal>
  );
};

export default DatasetModal;
