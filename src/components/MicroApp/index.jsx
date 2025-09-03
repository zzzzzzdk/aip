import React, { useEffect, useRef, memo } from "react";
import WujieReact from "wujie-react";
import { useNavigate } from "react-router-dom";
import lifecycles from "./lifecycles";
import { getToken } from "@/utils/cookie";
import "./index.scss";

const { bus, setupApp, preloadApp, destroyApp } = WujieReact;

// 微应用封装组件
const MicroApp = memo(({ microAppConfig, onChange }) => {
  const navigation = useNavigate();
  const degrade =
    window.localStorage.getItem("degrade") === "true" ||
    !window.Proxy ||
    !window.CustomElementRegistry;

  const path = microAppConfig.url.split("#/")[1];
  const props = {
    jump: (name) => {
      console.log(`${window.location.origin}/${name}`);
      navigation(`${name}`);
    },
  };

  useEffect(() => {
    setupApp({
      name: microAppConfig.name,
      url: microAppConfig.url,
      exec: true,
      alive: true,
      degrade,
      ...lifecycles,
    });

    if (window.localStorage.getItem("preload") !== "false") {
      console.log("执行预加载");
      preloadApp({
        name: microAppConfig.name,
        exec: true,
      });
    }
    // 告诉子应用要跳转哪个路由
    path && WujieReact.bus.$emit("router-change", path);

    // 下发token给子应用
    bus.$emit("subApp:setToken", getToken());

    // 事件监听
    WujieReact.bus.$on("mainApp:login", (data) => {
      // 处理登录逻辑，比如刷新用户信息、跳转首页等
    });

    // 监听子应用发来的登出事件
    WujieReact.bus.$on("mainApp:logout", () => {
      // 处理登出逻辑，比如清空用户信息、跳转登录页等
      console.log("收到子应用登出事件");
    });
  }, []);

  return (
    <>
      <WujieReact
        width="100%"
        height="100%"
        name={microAppConfig.name}
        url={microAppConfig.url}
        sync={microAppConfig.sync || !path}
        alive={true}
        props={props}
        // plugins={plugins}
      />
    </>
  );
});

export default MicroApp;