/*
 * @desc: 物模型容器组件
 * @author: zhucc22
 * @Date: 2023-10-25 17:53:35
 */
import { getNewStyle } from './../common/common'
Component({
  properties: {
    cardContainerItem: {
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
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.geNewSatus()
    },
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {},
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {
    geNewSatus() {
      let styles = getNewStyle({ ...this.data.cardContainerItem.styles, ...this.data.cardContainerItem.layouts })
      this.setData({
        styles,
      })
    },
  },
})
