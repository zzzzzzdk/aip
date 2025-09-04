import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown } from "antd";
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
  const [currentLang, setCurrentLang] = useState('zhcn');

  const activeKey = useSelector((state) => {
    return state.comment.routerData.name;
  });

  // 语言列表
  const languages = [
    { key: 'zhcn', name: '中文' },
    { key: 'en', name: 'English' },
    { key: 'ja', name: '日本語' },
    { key: 'ko', name: '한국어' },
    { key: 'ru', name: 'Русский' },
  ];

  // 切换语言
  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    // 保存语言设置到localStorage
    localStorage.setItem('lang', lang);
    if (window.$changeLang) {
      window.$changeLang(lang);
      window.location.reload()
    }
  };

  // 初始化语言
  useEffect(() => {
    // 从localStorage获取语言设置
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      setCurrentLang(savedLang);
    }
  }, []);
  
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
    console.log(key);
    navigate(key);
  };

  const menuData = menuItems.map(item => ({
    ...item,
    // label: window.$$t(item.label),
  }))

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
          items={menuData}
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
            <div className="language-switcher">
              <Dropdown
                menu={{
                  items: languages.map(lang => ({
                    key: lang.key,
                    label: lang.name,
                    onClick: () => changeLanguage(lang.key)
                  })),
                }}
                trigger={['click']}
              >
                <span className="ant-dropdown-link" style={{ cursor: 'pointer' }}>
                  {languages.find(lang => lang.key === currentLang)?.name}
                </span>
              </Dropdown>
            </div>
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
