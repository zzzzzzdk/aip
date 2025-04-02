import React from 'react';
import { Table, Card, Button, Space, Tag, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const RecycleBin = () => {
  // 模拟数据
  const mockData = [
    {
      id: 1,
      name: '已删除数据集1',
      type: 'dataset',
      deleteTime: '2024-03-26 10:00:00',
      size: '1.2GB',
      count: 1000
    },
    {
      id: 2,
      name: '已删除标签1',
      type: 'label',
      deleteTime: '2024-03-26 11:00:00',
      size: '0KB',
      count: 0
    }
  ];

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'dataset' ? 'blue' : 'green'}>
          {type === 'dataset' ? '数据集' : '标签'}
        </Tag>
      ),
    },
    {
      title: '删除时间',
      dataIndex: 'deleteTime',
      key: 'deleteTime',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '数据量',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleRestore(record)}>
            恢复
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            彻底删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleRestore = (record) => {
    Modal.confirm({
      title: '确认恢复',
      content: `确定要恢复"${record.name}"吗？`,
      onOk: () => {
        message.success('恢复成功');
      },
    });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要彻底删除"${record.name}"吗？此操作不可恢复！`,
      okText: '确认删除',
      okType: 'danger',
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  return (
    <div className="p-6">
      <Card title="回收站">
        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{
            total: mockData.length,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default RecycleBin; 