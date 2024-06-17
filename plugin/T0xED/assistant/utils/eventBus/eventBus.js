//eventbus.js
var events = new Map()
/**
 * 消息订阅
 * key：消息标识
 * callback：回调函数
 * 返回id：回调函数的id，用于取消订阅
 */
function sub(key, callback) {
  if (!events.has(key)) {
    events.set(key, [])
  }
  let list = events.get(key)
  list.push(callback)
  let id = list.length - 1
  events.set(key, list)
  return id
}
/**
 * 消息发布
 * key：消息标识
 * data：回调数据
 */
function pub(key, data) {
  if (!events.has(key)) return
  let list = events.get(key)
  list.forEach(callback => callback(data))
}
/**
 * 取消订阅
 * key：消息标识
 * id：回调函数的id
 */
function cancel(key, id) {
  if (!events.has(key)) return
  let list = events.get(key)
  list[id] = () => {}
}

module.exports = {
  sub: sub,
  pub: pub,
  cancel: cancel
}