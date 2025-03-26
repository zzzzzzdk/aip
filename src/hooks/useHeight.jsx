import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

const useHeight = (height) => {
  const routerData = useSelector((state) => {
    return state.comment.routerData;
  });

  const _height = useMemo(() => {
    let _height = {};

    let headerHeight = 0; // 导航高度
    let breadcrumbHeight = 60 + 24; // 面包屑高度
    let bottomHeight = 24; // 底部间距

    let offset =
      headerHeight +
      (routerData?.breadcrumb?.length ? bottomHeight + breadcrumbHeight : 0);

    Object.keys(height).forEach((key) => {
      _height[key] = `calc(100vh - ${height[key] + offset}px)`;
    });
    return _height;
  }, [routerData]);

  return _height;
};

export default useHeight;
