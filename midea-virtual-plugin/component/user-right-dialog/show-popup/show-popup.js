// m-ui/mx-popup/mx-popup.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: '',
    },
    single: {
      type: Boolean,
      value: false,
    },
    backgroundColor: {
      type: String,
      value: '#fff',
    },
    showBtn: {
      type: Boolean,
      value: true,
    },
    ZIndex: {
      type: Number,
      value: 10000000,
    },
    borderRadius: {
      type: Number,
      value: 56,
    },
    singleLabel: {
      type: String,
      value: '取消',
    },
    cancelLabel: {
      type: String,
      value: '取消',
    },
    confirmLabel: {
      type: String,
      value: '确定',
    },
    // 点击蒙层是否可以关闭弹窗
    clickMaskClose: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    popHeight: 0,
    animate: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击确定
    btnCkicked(e) {
      const { dataset } = e.currentTarget
      // console.log("dataset", dataset)
      //隐藏底部
      this.setData({
        show: false,
      })
      this.triggerEvent('onBtnCkicked', dataset, {})
    },
    //点击空白区域
    maskClicked() {
      let { clickMaskClose } = this.data
      if (!clickMaskClose) {
        return
      }
      //隐藏底部
      this.setData({
        show: false,
      })
      this.triggerEvent('maskClicked')
    },
    //点击取消
    btnCancelCkicked(e) {
      const { dataset } = e.currentTarget
      this.setData({
        show: false,
      })
      this.triggerEvent('btnCancelCkicked', dataset, {})
    },
  },

  lifetimes: {
    attached: function () {
      this.setData({
        isIphoneX: app.globalData.isIphoneX,
      })
      console.log('isIphoneX', this.data.isIphoneX)
      // 在组件实例进入页面节点树时执行
    },

    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function () {
    // 在组件实例进入页面节点树时执行
    setTimeout(() => {
      wx.createSelectorQuery()
        .select('#popup')
        .boundingClientRect(function (rect) {
          console.log('out of attached components rect', rect)
          this.setData({
            popHeight: 2 * rect.height,
          })
        })
        .exec()
    }, 300)
  },
  detached: function () {
    // 在组件实例被从页面节点树移除时执行
  },
  // ...
})
