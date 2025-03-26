import { useState, useEffect } from 'react'

function _throttle(wait) {
  let timerId = null
  let preTime = 0
  return {
    cancel: function () {
      preTime = 0
      clearTimeout(timerId)
    },
    run: function (fn) {
      let now = Date.now()
      if (now - preTime >= wait) {
        clearTimeout(timerId)
        fn()
        preTime = now
      } else {
        clearTimeout(timerId)
        timerId = setTimeout(() => {
          fn()
          preTime = Date.now()
        }, wait - (now - preTime))
      }
    }
  }
}

// 节流，频繁触发 run，只会每隔 300ms 执行最后一次。
const useThrottle = (wait = 300) => {

  const [throttle] = useState(_throttle(wait))

  useEffect(() => {
    return () => {
      throttle.cancel()
    }
  }, [])

  return throttle
}

export default useThrottle
