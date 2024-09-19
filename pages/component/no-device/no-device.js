/*
 * @desc:
 * @author: zhucc22
 * @Date: 2024-06-17 16:59:38
 */
// pages/component/no-device/no-device.js
import { baseImgApi } from '../../../api'
const home_img_jiadian_low = '../../../assets/img/index/home_img_jiadian_low.png'
const normalPic = baseImgApi.url + 'home_img_jiadian.png'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    autoHeight: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: '',
    },
    btnConent: {
      type: String,
      value: getApp().globalData.isLogon ? '去添加' : '添加智能设备',
    },
    isCanAddDevice: {
      type: Boolean,
      // value: false,
    },
    isLogon: {
      type: Boolean,
      // value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // img: {
    addDeviceImg: normalPic,
    deviceFlag: false,
    // },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    errorImgLoad() {
      this.setData({
        addDeviceImg: home_img_jiadian_low,
      })
    },
    updateValue(val) {
      this.setData({
        btnConent: val,
      })
    },
    checkFun() {
      if (this.data.deviceFlag) {
        return
      }
      getApp().checkNetLocal()
      this.data.deviceFlag = true
      console.log('this.data.type', this.data.type)
      console.log('this.properties.isCanAddDevice')
      if (this.properties.isLogon && !this.properties.isCanAddDevice) {
        this.triggerEvent('goToOtherChancel', '')
        return
      }
      this.triggerEvent('checkNoDeviceBtn', this.data.type)
      setTimeout(() => {
        this.data.deviceFlag = false
      }, 1500)
    },
  },
})
