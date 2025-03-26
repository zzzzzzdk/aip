import { useState, useRef, useEffect } from 'react'
import useThrottle from './useThrottle'
import useDebounce from './useDebounce'

const useRequest = (config) => {

  const {
    ajax,
    onBefore,
    onSuccess,
    onError,
    onFinally,
    loadingDelay = 0, // 默认0  loading被设置为true后 最短loadingDelay ms后被设置为false
    throttleWait = 0, // 默认0  不开启节流。 如300  那么每隔300ms只会执行一次请求。 这个参数的优先级更高
    debounceWait = 0, // 默认0  不开启防抖。 如300  那么300ms后执行最后一次操作
  } = config

  const destroy = useRef(false)

  const count = useRef(0)

  const [loading, setLoading] = useState(true)

  const loadingTimer = useRef(null)
  const loadingLastTime = useRef(null)

  const throttle = useThrottle(throttleWait)

  const debounce = useDebounce(debounceWait)

  const setLoadingTrue = () => {
    // if (loadingDelay) {
    //   if (loadingTimer.current) {
    //     clearTimeout(loadingTimer.current)
    //     loadingTimer.current = null
    //   }
    //   loadingLastTime.current = Date.now()
    // }
    setLoading(true)
  }

  const setLoadingFalse = () => {
    // if (loadingDelay) {
    //   let d = Date.now() - loadingLastTime.current
    //   if (d < loadingDelay) {
    //     loadingTimer.current = setTimeout(() => {
    //       setLoading(false)
    //     }, loadingDelay - d)
    //   } else {
    //     setLoading(false)
    //   }
    // } else {
    //   setLoading(false)
    // }
    setLoading(false)
  }

  const getData = (params, option) => {
    if (destroy.current) return
    onBefore?.(params, option)
    count.current += 1
    let _count = count.current
    setLoadingTrue()
    ajax(params).then((res) => {
      if (_count === count.current && !destroy.current) {
        setLoadingFalse()
        onSuccess?.(res, params)
        onFinally?.(params)
      }
    }).catch((err) => {
      if (_count === count.current && !destroy.current) {
        setLoadingFalse()
        onError?.(err, params)
        onFinally?.(params)
      }
    })
  }

  const run = (params = {}, option = {}) => {
    if (destroy.current) return
    if (throttleWait) {
      throttle.run(() => { getData(params, option) })
    } else if (debounceWait) {
      debounce.run(() => { getData(params, option) })
    } else {
      getData(params, option)
    }
  }

  useEffect(() => {
    destroy.current = false
    return (() => {
      destroy.current = true
    })
  }, [])

  return {
    loading,
    run
  }

}


export default useRequest
