import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import routes from "./router.config";
import { AuthGuard, PublicGuard } from "./guards";

const RouterView = () => {
  const renderRoutes = (routes) => {
    return routes.map((route, index) => {
      const Guard = route.public ? PublicGuard : AuthGuard;
      // const Guard = AuthGuard;

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
