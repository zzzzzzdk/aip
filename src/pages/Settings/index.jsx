import React from 'react';
import { Card, Form, Input, Button, Switch, Select } from 'antd';
import './index.scss';

const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  return (
    <div className="settings-page">
      <Card title="系统设置">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteName: '模型训练系统',
            siteDescription: '一个基于 React 的模型训练系统',
            enableRegistration: true,
            theme: 'light',
          }}
        >
          <Form.Item
            label="站点名称"
            name="siteName"
            rules={[{ required: true, message: '请输入站点名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="站点描述"
            name="siteDescription"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="允许注册"
            name="enableRegistration"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="主题"
            name="theme"
          >
            <Select>
              <Option value="light">浅色</Option>
              <Option value="dark">深色</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 