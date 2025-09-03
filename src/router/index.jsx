import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import routes from "./router.config";
import { AuthGuard, PublicGuard } from "./guards";
import MicroApp from "@/components/MicroApp";

// 假设menuData是从项目中获取的导航数据
// 在实际应用中，这可能来自状态管理或API请求
// const menuData = [];
import { menuItems as menuData } from "../components/Layout/menu.config";

const RouterView = () => {
  // 处理微应用路由
  const processMicroApps = (routes) => {
    let newRoutes = [...routes];

    // 处理需要替换主应用路由的微应用
    menuData.forEach((menuItem) => {
      // 如果导航有微应用配置，则添加微应用路由
      if (menuItem.micro) {
        const microApp = menuItem.micro;

        if (
          menuItem.micro.embedType === "inlayout" ||
          menuItem.micro.embedType === "partial"
        ) {
          let isAdd = true; // 如果在主应用路由中，没有相同path，则在layout下新增子路由
          // 查找并替换主应用路由
          const replaceRoute = (routes) => {
            for (let i = 0; i < routes.length; i++) {
              const route = routes[i];
              if (route.path === menuItem.path) {
                isAdd = false;
                if (
                  menuItem.micro?.embedType === "inlayout" ||
                  menuItem.micro?.embedType === "outlayout"
                ) {
                  route.element = (
                    <MicroApp
                      microAppConfig={{
                        ...microApp,
                        baseRouter: microApp.path ? "" : microApp.baseroute,
                      }}
                    />
                  );
                }
                route.isMicroApp = true;
                route.microAppConfig = microApp;
                if (menuItem.micro?.embedType === "outlayout") {
                  route.noNeedAuth = true;
                }
                return true;
              }
              if (route.children && replaceRoute(route.children)) {
                return true;
              }
            }
            return false;
          };

          replaceRoute(newRoutes);

          // 在layout下新增子路由
          if (isAdd) {
            newRoutes = newRoutes.map((item) =>
              item.path === "/"
                ? {
                    ...item,
                    children: [
                      ...(item.children || []),
                      {
                        element: (
                          <MicroApp
                            microAppConfig={{
                              ...microApp,
                              baseRouter: microApp.path
                                ? "" 
                                : microApp.baseroute,
                            }}
                          />
                        ),
                        name: menuItem.micro?.name,
                        text: menuItem.micro?.text,
                        path: menuItem.micro?.path,
                        breadcrumb: menuItem.micro?.breadcrumb || [],
                      },
                    ],
                  }
                : item
            );
          }
        }
        if (menuItem.micro.embedType === "outlayout") {
          // 添加独立大屏微应用路由
          newRoutes.push({
            name: microApp.name,
            path: menuItem.path || microApp.baseroute + "/*",
            element: (
              <MicroApp
                microAppConfig={{
                  ...microApp,
                  baseRouter: microApp.path ? "" : microApp.baseroute,
                }}
              />
            ),
            isMicroApp: true,
            microAppConfig: microApp,
            noNeedAuth: true,
          });
        }
      }
    });

    return newRoutes;
  };

  const renderRoutes = (routes) => {
    // 处理微应用路由
    const processedRoutes = processMicroApps(routes);

    return processedRoutes.map((route, index) => {
      const Guard = route.public || route.noNeedAuth ? PublicGuard : AuthGuard;

      return (
        <Route
          key={index}
          path={route.path}
          element={<Guard data={route}>{route.element}</Guard>}
        >
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });
  };

  return (
    <Suspense fallback={<Spin size="large" className="global-spin" />}>
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
};

export default RouterView;
