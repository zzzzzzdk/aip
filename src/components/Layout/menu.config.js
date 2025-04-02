import {
  DashboardOutlined,
  ExperimentOutlined,
  FolderOutlined,
  TagsOutlined,
  DeleteOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';

export const menuItems = [
  // {
  //   key: '/dashboard',
  //   icon: <DashboardOutlined />,
  //   label: '仪表盘',
  //   path: '/dashboard'
  // },
  {
    key: '/training-model',
    icon: <ExperimentOutlined />,
    label: '训练模型',
    path: '/training-model'
  },
  {
    key: '/dataset',
    icon: <FolderOutlined />,
    label: '数据集',
    path: '/dataset'
  },
  {
    key: '/label',
    icon: <TagsOutlined />,
    label: '标签管理',
    path: '/label'
  },
  {
    key: '/recycle-bin',
    icon: <DeleteOutlined />,
    label: '回收站',
    path: '/recycle-bin'
  },
  // {
  //   key: '/user',
  //   icon: <UserOutlined />,
  //   label: '用户中心',
  //   path: '/user'
  // },
  // {
  //   key: '/settings',
  //   icon: <SettingOutlined />,
  //   label: '系统设置',
  //   path: '/settings'
  // }
]; 