import React, { useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setRouterData } from '@/store/slices/comment';


const useBreadcrumb = () => {

  const routerData = useSelector((state) => {
    return state.comment.routerData
  });

  const dispatch = useDispatch()

  const pushHandle = useCallback((text) => {
    dispatch(setRouterData({
      ...routerData,
      breadcrumb: [...routerData.breadcrumb, { text: text }]
    }))
  }, [routerData])


  const backHandle = useCallback(() => {
    dispatch(setRouterData({
      ...routerData,
      breadcrumb: routerData.breadcrumb.slice(0, routerData.breadcrumb.length - 1)
    }))
  }, [routerData])


  return {
    pushHandle,
    backHandle
  }

}

export default useBreadcrumb