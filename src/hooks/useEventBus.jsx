import { useEffect, } from 'react'
import { EventEmitter } from 'events'

const eventBus = new EventEmitter()
const preData = {}

// 注意fn要用useCallback包起来，不然会重复的监听和销毁
const useEventBus = (key, fn) => {

  useEffect(() => {
    if (key && fn) {
      eventBus.addListener(key, fn)
    }
    return () => {
      if (key && fn) {
        eventBus.removeListener(key, fn)
      }
    }
  }, [key, fn])


  const getPreData = (key) => {
    return preData[key]
  }

  const emit = (key, data) => {
    preData[key] = data
    eventBus.emit(key, data)
  }

  return {
    getPreData,
    emit
  }
}


export default useEventBus
