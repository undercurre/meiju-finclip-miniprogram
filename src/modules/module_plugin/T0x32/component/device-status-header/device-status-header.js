// plugin/T0x32/component/device-status-header/device-status-header.js
import { imageDomain } from '../../assets/scripts/api'
import { Format } from '../../assets/scripts/format'
import { EC } from '../../card/js/EC'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    deviceInfo: {
      type: Object,
      observer: function (newValue) {
        // console.log('头部组件数据: ',newValue);
        this.setStatusBarInfo(newValue)
        const { sn8 } = newValue
        const { iconUrl, hasLoadDeviceImage } = this.data
        if (!hasLoadDeviceImage) {
          // 获取设备头图
          iconUrl.deviceImage = imageDomain + '/0x32/device-image/' + sn8 + '.png'
          this.setData({ iconUrl, hasLoadDeviceImage: true })
        }
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    hasLoadDeviceImage: false,
    iconUrl: {
      // deviceImage: imageDomain+'/0x32/device_image.png',
      deviceImage: '',
      bgImage: imageDomain + '/0x32/home_bg_FF8225.png',
    },
    statusBarModel: {
      type: 'disabled',
      text: '加载中',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击状态栏
    onClickBar() {
      const deviceInfo = this.properties.deviceInfo
      // 跳转到状态页
      wx.navigateTo({
        url:
          '../status/status' +
          Format.jsonToParam({
            applianceType: deviceInfo.type,
            modelNo: deviceInfo.sn8,
            applianceId: deviceInfo.applianceCode,
          }),
      })
    },
    // 加载设备主图失败
    loadImageError() {
      let iconUrl = this.data.iconUrl
      iconUrl.deviceImage = imageDomain + '/0x32/device_image.png'
      this.setData({ iconUrl, hasLoadDeviceImage: true })
    },
    // 获取状态栏信息
    setStatusBarInfo(deviceInfo) {
      let statusBarModel = EC.setStatusBarInfo(deviceInfo, this.data.statusBarModel)
      this.setData({ statusBarModel })
    },
  },
})
