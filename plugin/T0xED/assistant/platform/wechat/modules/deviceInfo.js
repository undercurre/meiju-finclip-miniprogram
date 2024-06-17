/**
 * 设备信息模块
 */
import broadcastChannel from '../../../utils/channel/channel'
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../platformOptions'
const console = consoleFunction(platformOptions.platform)

export default {
  options: {
    module: 'deviceInfo',
  },
  states: {
    deviceInfo: null,
    deviceSetting: null,
    updateDeviceInfoChannel: null,
  },
  init: function () {
    this.updateDeviceInfoChannel = broadcastChannel.create('updateDeviceInfo')
  },
  methods: {
    getDeviceInfo: function (data = null) {
      if (data) {
        this.deviceInfo = data
        this.deviceInfo.applianceCode = '' + this.deviceInfo.applianceCode || ''
        this.updateDeviceInfoChannel.postMessage()
        return
      } else {
        return this.deviceInfo
      }
    },
    getDeviceSetting: function (data = undefined) {
      console('getDeviceSetting: ', data)
      if (data == undefined) {
        return this.deviceSetting
      } else {
        this.deviceSetting = data
      }
    },
  },
}
