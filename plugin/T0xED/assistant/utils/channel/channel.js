/**
 * 页面/组件/功能模块通信通道
 * 基本实现页面之间通信，参考美居weex通信实现，写法基本一致
 */

const broadcastChannel = {
  channel: {},
}

class Channel {
  constructor(name) {
    this.name = name
    this.list = []
  }
  onMessage(callback) {
    this.list.push(callback)
  }
  postMessage(data) {
    this.list.forEach((callback) => {
      callback(data)
    })
  }
  close() {
    broadcastChannel.close(this.name)
  }
}

broadcastChannel.create = function (name) {
  if (!this.channel[name]) {
    this.channel[name] = new Channel(name)
  }
  return this.channel[name]
}
broadcastChannel.close = function (name) {
  if (this.channel[name]) {
    delete this.channel[name]
  }
}
broadcastChannel.closeAll = function () {
  let keys = Object.keys(this.channel)
  keys.forEach((name) => {
    this.close(name)
  })
}

export default broadcastChannel
