import React from 'react'
import { Spin } from 'antd'
import './index.scss'

function ResultFlow(props) {
  const {
    style,
    spinTip = "",
    ajaxLoad, // loading显示状态
    nodata = false,
    isTable = true,
    nodataMessage = '暂无数据'
  } = props

  let prefixCls = 'ysd-result-flow'

  return (
    <div className={prefixCls} style={style}>
      {
        ajaxLoad === true ?
          <div className={`${prefixCls}-load`}>
            <Spin size="large" tip={spinTip} />
          </div> :
          <>
            {
              !isTable && nodata ?
                <div className={`${prefixCls}-nodata`}>
                  <div className={`${prefixCls}-nodata-img`}>
                    {nodataMessage}
                  </div>
                </div> :
                <div className={`${prefixCls}-data`}>
                  {props.children}
                </div>
            }
          </>
      }
    </div>
  )
}

export default ResultFlow
