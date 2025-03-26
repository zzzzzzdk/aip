import React from 'react';
import { Card, Table, Button, Space } from 'antd';
import './index.scss';

const User = () => {
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: '管理员',
    },
    {
      key: '2',
      username: 'user',
      email: 'user@example.com',
      role: '普通用户',
    },
  ];

  return (
    <div className="user-page">
      <Card
        title="用户管理"
        extra={<Button type="primary">添加用户</Button>}
      >
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default User; 