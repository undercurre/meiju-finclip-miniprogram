const trackAction = {
  powerOff: {
    // 与请求的key值完全一致
    widget_id: 'click_power',
    widget_name: '开关机',
    ext_info: '关',
  },
}

const getTrackAction = function (action) {
  return trackAction[action] || null
}

export default getTrackAction
