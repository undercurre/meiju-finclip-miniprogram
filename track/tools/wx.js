/*
 * @desc:
 * @author: zhucc22
 * @Date: 2024-05-22 14:59:33
 */
// 罗盘
const onCompassChange = () => {
  return new Promise((resolve) => {
    // 低版本库兼容
    if (!canIUse('onCompassChange') || !canIUse('offCompassChange')) {
      resolve(null)
      return
    }
    wx.onCompassChange((res) => {
      wx.offCompassChange()
      resolve(res)
      return
    })
  })
}

// 设备方向
const onDeviceMotionChange = () => {
  return new Promise((resolve) => {
    // 低版本库兼容
    if (
      !canIUse('startDeviceMotionListening') ||
      !canIUse('onDeviceMotionChange') ||
      !canIUse('stopDeviceMotionListening') ||
      !canIUse('offDeviceMotionChange')
    ) {
      resolve(null)
      return
    }
    wx.stopDeviceMotionListening()
    wx.startDeviceMotionListening()
    wx.onDeviceMotionChange((res) => {
      wx.offDeviceMotionChange()
      wx.stopDeviceMotionListening()
      resolve(res)
      return
    })
    // 没监听到onDeviceMotionChange，3S后reject，防止promise一直pending
    setTimeout(() => {
      wx.offDeviceMotionChange()
      wx.stopDeviceMotionListening()
      resolve(null)
    }, 3000)
  })
}
// 加速器
const onAccelerometerChange = () => {
  return new Promise((resolve) => {
    // 低版本库兼容
    if (!canIUse('onAccelerometerChange') || !canIUse('offAccelerometerChange')) {
      resolve(null)
      return
    }
    wx.onAccelerometerChange((res) => {
      wx.offAccelerometerChange()
      resolve(res)
      return
    })
  })
}

// 电池
const getBatteryInfo = () => {
  return new Promise((resolve) => {
    // 低版本库兼容
    if (!canIUse('getBatteryInfo')) {
      resolve(null)
      return
    }
    // wx.getBatteryInfo({
    // success: (res) => {
    // resolve(res)
    // },
    // fail: () => {
    // resolve(null)
    // },
    // })
  })
}

const canIUse = (scheme) => {
  const canIUse = wx.canIUse(scheme)
  return canIUse
}

module.exports = {
  onCompassChange,
  onDeviceMotionChange,
  onAccelerometerChange,
  getBatteryInfo,
}
