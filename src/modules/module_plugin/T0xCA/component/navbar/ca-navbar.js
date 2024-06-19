import {
  navigateToAll
} from 'm-miniCommonSDK/utils/util'
const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    backTo: {
      type: String,
      value: '',
    },
    navTitle: {
      type: String,
      value: '',
    },
    showView: {
      type: Number,
      value: 1,
    },
  },
  data: {
    // 这里是一些组件内部数据
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    statusNavBarHeight: app.globalData.statusNavBarHeight,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    showView: 1,
    menuWidth: wx.getMenuButtonBoundingClientRect().width, //顶部胶囊宽度
    menuRight: wx.getMenuButtonBoundingClientRect().right, //胶囊距离右侧距离
    menuLeft: wx.getMenuButtonBoundingClientRect().left, //胶囊距离左侧距离
  },
  methods: {
    clickBack() {
      if (!this.data.backTo) {
        console.log('getCurrentPages:', getCurrentPages())
        if (getCurrentPages().length < 2) {
          navigateToAll('/pages/index/index')
        }
        wx.navigateBack({
          delta: 1,
        })
        console.log('没传返回指定页面path')
        return
      }
      if (this.data.backTo) {
        navigateToAll(this.data.backTo)
      }
      this.triggerEvent('clickBack')
    },
  },
})
