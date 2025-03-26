import { useState, useEffect } from 'react'

function _debounce(wait) {
  let timerId = null
  return {
    cancel: function () {
      clearTimeout(timerId)
    },
    run: function (fn) {
      clearTimeout(timerId)
      timerId = setTimeout(() => {
        fn()
      }, wait)
    }
  }
}

// 防抖，频繁触发 run，只会300ms后执行最后一次。
const useDebounce = (wait = 300) => {

  const [debounce] = useState(_debounce(wait))

  useEffect(() => {
    return () => {
      debounce.cancel()
    }
  }, [])

  return debounce
}

export default useDebounce
