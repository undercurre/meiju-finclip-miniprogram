const modeList = {
  0: 'ap',
  1: '快连',
  2: '声波配网',
  3: '蓝牙配网',
  4: '零配',
  5: '单蓝牙',
  6: 'zebee网关',
  7: '网线',
  8: 'NB - IOT',
  9: 'Msmart - lite协议',
  10: '本地蓝牙直连',
  17: '数字遥控器配网',
  'air_conditioning_bluetooth_connection': '家用协议直连',
  'air_conditioning_bluetooth_connection_network': '家用协议配网',
  'WB01_bluetooth_connection': 'msmart 直连', //小程序自定义
  'WB01_bluetooth_connection_network': 'msmart 直连后做wifi绑定', //小程序自定义
  100: '动态二维码(触屏配网)',
  101: 'zebee网关 + 手机蓝牙',
  102: '蓝牙网关 + 手机蓝牙',
  103: '大屏账号绑定',
  104: '蓝牙网关 + zebee网关 + 手机蓝牙',
  998: '客方配网',
  999: '非智能设备',
}

module.exports = {
  modeList,
}
