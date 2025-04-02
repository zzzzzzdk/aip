import React from 'react';
import { Modal, Form, Input } from 'antd';

const LabelEditModal = ({ 
  visible, 
  onOk, 
  onCancel, 
  form, 
  editingLabel 
}) => {
  return (
    <Modal
      title={editingLabel ? "编辑标签" : "新建标签"}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="horizontal" labelAlign="right">
        <Form.Item
          name="name"
          label="标签名称"
          rules={[{ required: true, message: "请输入标签名称" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="value"
          label="标签值"
          rules={[{ required: true, message: "请输入标签值" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LabelEditModal; 