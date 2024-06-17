/*
 * @desc: 物模型卡片组件
 * @author: zhucc22
 * @Date: 2023-10-25 17:53:35
 */
const commonBehavior = require('../common/behavior')
import { service } from '../assets/js/service'
import { indexClickPoint } from '../assets/buriedPoint'
Component({
  behaviors: [commonBehavior],
  properties: {},
  data: {
    loading: false,
    timer: null,
  },
  observers: {
    'deviceItem.selected': function (val) {
      this.setData({
        loading: false,
      })
      clearTimeout(this.timer)
    },
  },
  lifetimes: {
    attached: function () {},
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {},
  pageLifetimes: {},
  methods: {
    //执行物模型事件
    onChangeDevice(e) {
      this.setData({
        loading: true,
      })
      this.timer = setTimeout(() => {
        this.setData({
          loading: false,
        })
      }, 5000)
      let deviceAction = this.data.cardItem.actions.request
      let device = this.data.deviceInfo
      let checked = this.data.deviceItem.selected
      let url = deviceAction.url + device.applianceCode
      let requestKey = deviceAction.requestKey
      let reqData = {}
      reqData[requestKey] = !checked
      let _this = this
      service.controlProperties(url, reqData, deviceAction.method).then(
        (resp) => {
          if (resp.code != 0) {
            wx.showToast({
              title: '控制失败',
              icon: 'none',
            })
            this.setData({
              loading: false,
            })
            clearTimeout(_this.timer)
          }
        },
        (error) => {
          wx.showToast({
            title: error,
            icon: 'none',
          })
          this.setData({
            loading: false,
          })
          clearTimeout(_this.timer)
        }
      )
      let parmas = {
        ...this.data.deviceInfo,
        ...{
          requestKey: deviceAction.requestKey,
          requestValue: reqData[requestKey],
        },
      }
      indexClickPoint(parmas)
    },
  },
})
