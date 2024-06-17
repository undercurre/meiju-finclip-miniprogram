const app = getApp()
import { actTemplateImgApi } from '../../../../../api.js'
Component({
  properties: {
    text: String,
    styleObj: {
      type: Object,
      value: {
        bg: '#fff',
        fontSize: '36',
        color: '#030303',
      },
    },
  },
  data: {
    imgUrl: actTemplateImgApi.url,
    statusBarHeight: parseInt(app.globalData.statusBarHeight),
    // navigationBarHeight: (app.globalData.navHeight + 44) * 2 + 'rpx',
    navigationBarHeight: parseInt(app.globalData.navBarHeight),
    home: true,
    back: false,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let pagesLength = getCurrentPages().length
      this.setData({
        home: pagesLength <= 1 ? true : false,
        back: pagesLength > 1 ? true : false,
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    backHome: function () {
      // wx.navigateTo({
      //   url: '/pages/index/index'
      // })
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    back: function () {
      wx.navigateBack({
        delta: 1,
      })
    },
  },
})
