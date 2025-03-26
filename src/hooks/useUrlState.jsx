import { useState, useRef } from 'react'

const useUrlState = (value) => {

  const valueHandle = (value) => {
    if (typeof value === 'function') {
      return value()
    } else {
      return value
    }
  }

  const dataRef = useRef(valueHandle(value))
  const [data, setData] = useState(dataRef.current)

  const setValue = (value) => {
    dataRef.current = valueHandle(value)
    setData(dataRef.current)
  }

  const updateUrl = () => {

  }

  return [data, setValue, dataRef, updateUrl]
}


export default useUrlState




// import { useState } from 'react'
// import { useLocation, useHistory } from "react-router-dom";
// import useStateRef from './useStateRef'
// import qs from 'qs';

// // 获取地址栏搜索参数 search 格式，如： ?deal_status=2  太大的数据别放到这里面
// export function getParams(search) {
//   let result = {}
//   let searchParamsStr = search.split('?')[1]
//   if (searchParamsStr) {
//     result = qs.parse(searchParamsStr)
//   }
//   return result
// }

// // 初始化和set值的时候只接受对象
// const useUrlState = (defaultData) => {

//   const location = useLocation()

//   const history = useHistory()

//   const initData = () => {
//     const params = getParams(location.search)
//     let _data = {}
//     Object.keys(defaultData).forEach((key) => {
//       _data[key] = params[key] === undefined ? defaultData[key] : params[key]
//     })
//     return _data
//   }

//   const [state, setState, stateRef] = useStateRef(initData)

//   const updateUrl = () => {
//     history.replace(location.pathname + '?' + qs.stringify(stateRef.current))
//   }

//   return [state, setState, stateRef, updateUrl]
// }


// export default useUrlState
