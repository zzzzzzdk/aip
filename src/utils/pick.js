// pick item from object
export default function pick(obj, keys) {
  const clone = {}
  keys.forEach((key) => {
    if (key in obj) {
      clone[key] = obj[key]
    }
  })
  return clone
} 