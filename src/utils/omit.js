// delete keys from object
export default function omit(obj, keys) {
  const clone = {
    ...obj,
  }
  keys.forEach((key) => {
    if (key in clone) {
      delete clone[key]
    }
  })
  return clone
} 