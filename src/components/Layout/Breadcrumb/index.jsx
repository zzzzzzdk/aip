import React from 'react'
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'


export default () => {

  const routerData = useSelector((state) => {
    return state.comment.routerData
  });

  const items = routerData?.breadcrumb?.map((item) => {
    return {
      title: item.path ?
        <Link target={item.target || '_self'} to={item.path}>
          {item.text}
        </Link> :
        item.text
    }
  })

  return <Breadcrumb items={items} />
}
