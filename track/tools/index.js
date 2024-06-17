import { onCompassChange, onDeviceMotionChange, onAccelerometerChange, getBatteryInfo } from './wx.js'

// 获取传感器， 设备方向， 加速计， 电池等信息
const getDeviceInfo = () => {
  return new Promise((resolve, reject) => {
    Promise.all([onCompassChange(), onDeviceMotionChange(), onAccelerometerChange(), getBatteryInfo()])
      .then((res) => {
        const [compassRes, deviceMotionRes, accelerometerData, batteryInfoRes] = res
        const data = {}
        if (compassRes) {
          data.cp_d = compassRes.direction //罗盘面对的方向度数,number
          data.cp_a = compassRes.accuracy //罗盘面对的精度,number
        }
        if (deviceMotionRes) {
          data.m_b = deviceMotionRes.beta //设备方向alpha值,number
          data.m_a = deviceMotionRes.alpha //设备方向beta值,number
          data.m_g = deviceMotionRes.gamma //设备方向gramma值,number
        }
        if (accelerometerData) {
          data.ac_x = accelerometerData.x //加速器X轴,numbe
          data.ac_y = accelerometerData.y //加速器Y轴,numbe
          data.ac_z = accelerometerData.z //加速器Z轴,numbe
        }
        if (batteryInfoRes) {
          data.ba_l = batteryInfoRes.level //电量,number
          data.is_c = +batteryInfoRes.isCharging //是否充电中 1是/0否,boolean
        }
        resolve(data)
      })
      .catch((e) => {
        console.log(e, 'all maidian e')
        reject()
      })
  })
}

module.exports = {
  getDeviceInfo,
}
