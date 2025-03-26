import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRouterData } from "@/store/slices/comment";

export const AuthGuard = ({ children, data }) => {
  const dispatch = useDispatch();
  // 这里添加认证逻辑
  const isAuthenticated = true; // 示例：替换为实际的认证状态

  useEffect(() => {
    console.log("AuthGuard", data);
    dispatch(setRouterData(data));
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
