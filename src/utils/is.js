const typeString = Object.prototype.toString

export const isArray = (obj) => typeString.call(obj) === '[object Array]'
export const isObject = (obj) => typeString.call(obj) === '[object Object]'
export const isEmptyObject = (obj) => isObject(obj) && Object.keys(obj).length === 0
export const isString = (obj) => typeString.call(obj) === '[object String]'
export const isNumber = (obj) => typeString.call(obj) === '[object Number]'
export const isFile = (obj) => typeString.call(obj) === '[object File]'
export const isBlob = (obj) => typeString.call(obj) === '[object Blob]'
export const isRegExp = (obj) => typeString.call(obj) === '[object RegExp]'
export const isUndefined = (obj) => obj === undefined
export function isFunction(obj) {
  return typeof obj === 'function'
} 