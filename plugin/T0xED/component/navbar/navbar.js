const app = getApp()
import { navigateToAll } from '../../../../utils/util.js'
import { imgBaseUrl } from '../../../../api'
const backImg = imgBaseUrl.url + '/plugin/0xED/back_black.png'
Component({
  properties: {
    backTo: {
      //返回方法
      type: String,
      value: '',
    },
    navBarName: {
      //标题
      type: String,
      value: '',
    },
    hasEmpty: {
      //是否需要空白占位
      type: Boolean,
      value: true,
    },
    bgColor: {
      //背景颜色
      type: String,
      value: 'transparent',
    },
  },
  data: {
    backImg,
    statusBarHeight: app.globalData.statusBarHeight, //状态栏高
    statusNavBarHeight: app.globalData.statusNavBarHeight, //状态栏高 + 标题栏高
    navBarHeight: app.globalData.navBarHeight, //标题栏高
  },
  methods: {
    clickBack() {
      if (this.properties.backTo) {
        navigateToAll(this.properties.backTo)
      } else {
        if (getCurrentPages().length < 2) {
          navigateToAll('/pages/index/index')
        } else {
          wx.navigateBack({
            delta: 1,
          })
          console.log('没传返回指定页面path')
        }
      }
    },
  },
})
