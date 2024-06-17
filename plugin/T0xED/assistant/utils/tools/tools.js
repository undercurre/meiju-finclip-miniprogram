export function isFunction(fn) {
  return (
    !!fn &&
    !fn.nodeName &&
    fn.constructor != String &&
    fn.constructor != RegExp &&
    fn.constructor != Array &&
    /function/i.test(fn + '')
  )
}

export function autoSleep(duration = 10) {
  return new Promise((res) => {
    setTimeout(() => res(), duration)
  })
}

export function manualSleep(callback) {
  return new Promise((res) => {
    callback(res)
  })
}
