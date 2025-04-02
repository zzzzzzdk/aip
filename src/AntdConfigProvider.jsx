import React from 'react'
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import zhCN from 'antd/locale/zh_CN';


function AntdConfigProvider(props) {
  return <StyleProvider hashPriority="high">
    <ConfigProvider
      {...props}
      locale={zhCN}
      theme={{
        cssVar: { key: 'app' },
        hashed: false,
        token: {
          colorPrimary: '#0588FF',
          borderRadius: 10,
          controlHeight: 36
        },
        components: {
          Table: {
            borderColor: '#e8e8e8'
          },
          Menu: {
            activeBarHeight: 0,
            iconSize: 16,
            horizontalItemBorderRadius: 10,
            horizontalLineHeight: 38,
            itemPaddingInline: 18,
          },
        }
      }}>
    </ConfigProvider>
  </StyleProvider>
}

export default AntdConfigProvider




