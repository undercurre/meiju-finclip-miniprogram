function getContext() {
  let pages = getCurrentPages()
  return pages[pages.length - 1]
}
let defaultOptions = {
  content: '提示',
  selector: '#media-toast',
  duration: 2000,
}
let queue = []
function MideaToast(options) {
  let toast = null
  let content = defaultOptions.content
  let selector = defaultOptions.selector
  let duration = defaultOptions.duration
  if (typeof options === 'string') {
    content = options
  } else {
    content = options.content || content
    selector = options.selector || selector
    if (options.duration === 0) {
      duration = options.duration
    } else {
      duration = options.duration || duration
    }
  }
  let toastOptions = {
    content: content,
    isShow: true,
  }
  toast = getContext().selectComponent(selector)
  if (!toast) {
    console.warn('未找到 van-toast 节点，请确认 selector 及 context 是否正确')
    return
  }
  delete options.context
  delete options.selector
  toast.clear = function () {
    toast.setData({ isShow: false })
    if (options.onClose) {
      options.onClose()
    }
  }
  queue.push(toast)
  toast.setData(toastOptions)
  clearTimeout(toast.timer)
  if (duration != null && duration > 0) {
    toast.timer = setTimeout(function () {
      toast.clear()
      queue = queue.filter(function (item) {
        return item !== toast
      })
    }, duration)
  }
  return toast
}
MideaToast.clear = function () {
  queue.forEach(function (toast) {
    toast.clear()
  })
  queue = []
}
export default MideaToast
