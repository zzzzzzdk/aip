export const contains = (root, ele) => {
  let node = ele
  while (node) {
    if (node === root) {
      return true
    }
    node = node.parentNode
  }
  return false
} 