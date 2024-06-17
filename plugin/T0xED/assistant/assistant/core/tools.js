export const typeObj = function (obj) {
  let type = Object.prototype.toString.call(obj)
  if (type == '[object Number]') {
    return 'Number'
  } else if (type == '[object String]') {
    return 'String'
  } else if (type == '[object Boolean]') {
    return 'Boolean'
  } else if (type == '[object Object]') {
    return 'Object'
  } else if (type == '[object Array]') {
    return 'Array'
  } else if (type == '[object Null]') {
    return 'Null'
  } else if (type == '[object Undefined]') {
    return 'Undefined'
  } else if (type == '[object Function]') {
    return 'Function'
  } else if (type == '[object Symbol]') {
    return 'Symbol'
  } else if (type == '[object Date]') {
    return 'Date'
  } else if (type == '[object RegExp]') {
    return 'RegExp'
  }
}

export function manualSleep(callback) {
  return new Promise((res) => {
    callback(res)
  })
}
