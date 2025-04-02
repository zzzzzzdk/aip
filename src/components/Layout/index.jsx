import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import Breadcrumb from "@/components/Layout/Breadcrumb";
import { menuItems } from "./menu.config";
import { useSelector } from 'react-redux';
import "./index.scss";

const { Sider, Content } = Layout;

const LayoutComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const activeKey = useSelector((state) => {
    return state.comment.routerData.name;
  });
  
  // const menuItems = [
  //   {
  //     key: "/",
  //     icon: <HomeOutlined />,
  //     label: "首页",
  //   },
  //   {
  //     key: "/training-model",
  //     icon: <ExperimentOutlined />,
  //     label: "训练模型",
  //   },
  //   {
  //     key: "/user",
  //     icon: <UserOutlined />,
  //     label: "用户管理",
  //   },
  //   {
  //     key: "/settings",
  //     icon: <SettingOutlined />,
  //     label: "系统设置",
  //   },
  // ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout className="app-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="app-sider"
      >
        <div className="logo">
          {!collapsed ? (
            <>
              <img src={"/static/images/logo.png"} alt="logo" />
              <span>模型训练系统</span>
            </>
          ) : (
            <img src={"/static/images/logo.png"} alt="logo" />
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={handleMenuClick}
        />
        <div className="trigger" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </Sider>
      <Layout>
        <Content
          className={`app-content-wrapper ${collapsed ? "collapsed" : ""}`}
        >
          <div className="breadcrumb-container">
            <Breadcrumb />
          </div>
          <Content className="app-content">
            <Outlet />
          </Content>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
