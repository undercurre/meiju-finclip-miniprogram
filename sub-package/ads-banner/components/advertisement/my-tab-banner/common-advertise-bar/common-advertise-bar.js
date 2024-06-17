// pages/component/advertise-bar/advertise-bar.js
const app = getApp() //获取应用实例

import { webView } from '../../../../../../utils/paths.js'
import { advertiseBannerEventTracking } from '../../../../../../track/track.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    initData: {
      type: Array,
      value: [],
      observer(val) {
        this.getInitData(val)
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    autoPlay: true,
    indicatorDots: true,
    isLogin: app.globalData.isLogon,
    bannerList: [],
    currentIndex: 1,
    defaultBac: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 处理广告数据
    getInitData(list) {
      if (list.length == 0) return
      if (list.length > 5) {
        list = list.slice(0, 5)
      }
      if (list.length == 1) {
        this.setData({
          indicatorDots: false,
        })
      }
      this.setData({
        bannerList: list || [],
        currentIndex: 1,
        defaultBac: this.pathToBase64(),
      })
      this.advertineExposure(1)
      console.log('banner 广告数据', this.data.bannerList)
    },

    // advertise 广告item曝光事件
    advertineExposure(index) {
      const { isLogin } = this.data
      const definedObj = {
        rank: index,
        object_type: 'banner',
        isLogin: isLogin,
      }
      const selectItem = this.data.bannerList[index - 1]
      advertiseBannerEventTracking('content_exposure_event', selectItem, definedObj)
    },

    swiperChange(e) {
      console.log('swiper e', e.detail.current)
      let currentIndex = e.detail.current + 1 // 埋点rank索引从1开始
      this.setData({
        currentIndex,
      })
      this.advertineExposure(currentIndex)
    },

    // 广告位点击跳转事件
    advertiseBarLink(e) {
      const { isLogin, bannerList } = this.data
      const item = e.currentTarget.dataset.item
      let index
      // console.log("banner数据", item)
      // 不能使用当前的banner索引currentIndex作为埋点上报的字段，因为在过渡时点击当前banner，会上报下一个banner的index
      for (let i = 0; i < bannerList.length; i++) {
        if (item.jumpLinkUrl == bannerList[i].jumpLinkUrl) {
          index = i + 1
        }
      }

      const definedObj = {
        widget_id: 'click_banner',
        widget_name: '广告位',
        object_type: 'banner',
        rank: index,
        // rank:currentIndex,
        isLogin: isLogin,
      }
      advertiseBannerEventTracking('user_behavior_event', item, definedObj)
      // urlType: 6: 小程序内部原生,7：美居lite外小程序,8：webH5页面  旧api
      // jumpType: 跳转类型 1H5 2小程序 3自定义
      // jumpLinkUrl 跳转链接
      if (item.jumpType == 2) {
        console.log('jumpType=2为小程序链接, miniAppCode, jumpLinkUrl----', item.miniAppCode, item.jumpLinkUrl)
        let link = ''
        if (item.miniAppCode == 'wxb12ff482a3185e46') {
          if (item.jumpLinkUrl[0] != '/') {
            link = `/${item.jumpLinkUrl}`
          } else {
            link = item.jumpLinkUrl
          }
          wx.navigateTo({
            url: link,
          })
        } else {
          wx.navigateToMiniProgram({
            // appId: item.appId?item.appId: "wxc5bbd0a3c30743f2",
            appId: item.miniAppCode,
            path: item.jumpLinkUrl,
            envVersion: 'release', //develop/trial/release
            success(res) {
              console.log('dddddd', res)
              // 打开成功
            },
          })
        }
      }
      // 跳转小程序 新接口暂不提供该跳转方式
      if (item.jumpType == 3) {
        console.log('小程序不支持跳转app内链接')
      }
      // 跳转h5 webview
      if (item.jumpType == 1) {
        console.log('广告数据跳转h5 webview')
        // let originUrl = `${webView}?webViewUrl=${encodeURIComponent('https://www.baidu.com')}&loginState=true` 测试链接
        let originUrl = `${webView}?webViewUrl=${encodeURIComponent(item.jumpLinkUrl)}`
        wx.navigateTo({
          url: originUrl,
        })
      }
    },
    pathToBase64() {
      return 'data:image/png;base64,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'
    },
  },
  /*组件生命周期*/
  lifetimes: {
    created() {},
    attached() {
      this.triggerEvent('attached')
    },
    ready() {
      console.log('浮窗', this.properties.initData)
    },
    moved() {},
    detached() {},
    error() {},
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function () {
        // 页面被展示
        this.setData({
          autoPlay: true,
        })
      },
      hide: function () {
        // 页面被隐藏
        this.setData({
          autoPlay: false,
        })
      },
      resize: function () {
        // 页面尺寸变化
      },
    },
  },
})
