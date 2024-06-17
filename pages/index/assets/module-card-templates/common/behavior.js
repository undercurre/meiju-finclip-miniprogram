/*
 * @desc: 组件通用混入文件
 * @author: zhucc22
 * @Date: 2023-10-26 15:13:15
 */
import { getNewStyle } from './common'
module.exports = Behavior({
  properties: {
    cardItem: {
      type: Object,
      value: '',
    },
    deviceInfo: {
      type: Object,
      value: '',
    },
  },
  observers: {
    deviceInfo: function (val) {
      this.geNewSatus()
    },
  },
  data: {
    styles: {}, //处理样式
    deviceItem: {},
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.geNewSatus()
    },
    moved: function () {},
    detached: function () {},
  },
  methods: {
    //修改设备状态
    geNewSatus() {
      let textColorStyles = {}
      let deviceItem = this.data.deviceInfo.cardDataTemplate[this.data.cardItem.id]
      let styles = getNewStyle({ ...this.data.cardItem.styles, ...this.data.cardItem.layouts })
      if (deviceItem?.textColor) {
        textColorStyles = {
          color: deviceItem.textColor,
        }
        styles = { ...styles, ...textColorStyles }
      }
      if (deviceItem?.alpha) {
        textColorStyles = {
          opacity: deviceItem.alpha,
        }
        styles = { ...styles, ...textColorStyles }
      }
      if (deviceItem?.background) {
        styles = { ...styles, ...{ background: deviceItem.background } }
      }
      this.setData({
        styles,
        deviceItem,
      })
    },
  },
})
