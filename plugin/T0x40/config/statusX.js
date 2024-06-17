// 解析判断设备的json值

let status = {} // 设备状态json值

function setStatus(json) {
  //设置设备状态
  status = json
}
function isOff() {
  // 是否模式全关
  if (status.mode == undefined) return true
  return status.mode == 'close_all'
}
function isMainLightEnable() {
  // 是否照明开启
  if (status.light_mode == undefined) return false
  return status.light_mode == 'main_light'
}
function isBlowingEnable() {
  // 是否吹风模式开启
  if (status.mode == undefined) return false
  return status.mode == 'blowing' || status.mode.indexOf('blowing') != -1
}
function isVentilationEnable() {
  // 是否换气模式开启
  if (status.mode == undefined) return false
  return (
    status.mode == 'ventilation' || status.mode == 'morning_ventilation' || status.mode.indexOf('ventilation') != -1
  )
}
function windSpeed() {
  // 风速（<=34为弱风，>34为强风）
  if (isBlowingEnable()) {
    if (status.blowing_speed == undefined) return 0
    return parseInt(status.blowing_speed)
  } else if (isVentilationEnable()) {
    if (status.ventilation_speed == undefined) return 0
    return parseInt(status.ventilation_speed)
  }
  return 0
}
function isSmellEnable() {
  //（烟感）是否异味感应开启
  if (status.smelly_enable == undefined) return false
  return status.smelly_enable === 'on'
}
function isSmellTrigger() {
  // 是否异味感应触发的换气
  if (status.smelly_enable == undefined || status.smelly_trigger == undefined) return false
  return status.smelly_enable === 'on' && status.smelly_trigger === 'on'
}
function isAutoWindDirection() {
  //是否自动摆风开启
  if (isBlowingEnable()) {
    if (status.blowing_direction == undefined) return false
    return status.blowing_direction == 253
  }
  return false
}
function getStatus() {
  return status
}

export default {
  setStatus,
  isOff,
  isMainLightEnable,
  isBlowingEnable,
  isVentilationEnable,
  windSpeed,
  isSmellEnable,
  isSmellTrigger,
  isAutoWindDirection,
  getStatus,
}
