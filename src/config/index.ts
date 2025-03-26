export const prefixCls = 'fusion3'
export const getPrefixCls = (componentName: string): string => componentName ? `${prefixCls}-${componentName}` : prefixCls



// 配置信息默认设置 接口挂了会用默认的
export const settingConfig = {
  "cross": {
    "time_range": {
      "min": "0",
      "default": "7",
      "max": "30",
    },
    threshold: {
      default: "80",
      max: "100",
      min: "60"
    }
  },
}