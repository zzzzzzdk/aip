import {
  DashboardOutlined,
  ExperimentOutlined,
  FolderOutlined,
  TagsOutlined,
  DeleteOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const menuItems = [
  // {
  //   key: '/dashboard',
  //   icon: <DashboardOutlined />,
  //   label: '仪表盘',
  //   path: '/dashboard'
  // },
  {
    key: "/training-model",
    icon: <ExperimentOutlined />,
    label: "训练模型",
    path: "/training-model",
  },
  {
    key: "/dataset",
    icon: <FolderOutlined />,
    label: "数据集",
    path: "/dataset",
  },
  {
    key: "/label",
    icon: <TagsOutlined />,
    label: "标签管理",
    path: "/label",
  },
  {
    key: "/recycle-bin",
    icon: <DeleteOutlined />,
    label: "回收站",
    path: "/recycle-bin",
  },
  {
    key: "/inlayout-new",
    icon: <UserOutlined />,
    label: "inlayout-new",
    path: "/inlayout-new",
    micro: {
      url: "https://ant.design/components/tree-cn#tree-demo-search",
      embedType: "inlayout", // inlayout 内嵌 、 outlayout 大屏、partial 部分
      name: "inlayout-new",
      path: "/inlayout-new", // 新增路由时需要添加不重复的path路径（注意添加路由权限）
      text: "新增inlayout",
      breadcrumb: [
        {
          text: "新增inlayout111",
        },
      ],
    },
  },
  {
    key: "/aip2",
    icon: <UserOutlined />,
    label: "aip2",
    path: "/aip2",
    micro: {
      url: "http://localhost:3001/",
      embedType: "inlayout", // inlayout 内嵌 、 outlayout 大屏、partial 部分
      name: "aip2",
      path: "/aip2", // 新增路由时需要添加不重复的path路径（注意添加路由权限）
      text: "aip2",
      breadcrumb: [
        {
          text: "aip2",
        },
      ],
    },
  },
  // {
  //   key: '/settings',
  //   icon: <SettingOutlined />,
  //   label: '系统设置',
  //   path: '/settings'
  // }
];
