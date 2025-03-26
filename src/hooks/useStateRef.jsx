import { useState, useRef } from 'react'

const useStateRef = (value) => {

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

  return [data, setValue, dataRef]
}


export default useStateRef
