import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRouterData } from "@/store/slices/comment";
import { getParams } from "@/utils";

export const AuthGuard = ({ children, data }) => {
  const dispatch = useDispatch();
  // 这里添加认证逻辑
  const isAuthenticated = true; // 示例：替换为实际的认证状态

  useEffect(() => {
    const params = getParams(window.location.search);
    // console.log("AuthGuard", data);
    if (params.breadcrumbName) {
      // 在页面上自己处理面包屑
    } else {
      dispatch(setRouterData(data));
    }
  }, [data]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const PublicGuard = ({ children, data }) => {
  // 这里添加公共路由逻辑
  return children;
};
