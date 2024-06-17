// pages/component/advertise-bar/advertise-bar.js

import { webViewPage } from '../../../../../../utils/paths.js'
import { indexBannerUserBehaviorEeventTrack } from '../../../../../../track/track.js'

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
    show: false,
    selectData: {},
    isAndroid: false,
    isNewIphone:
      wx.getSystemInfoSync().model.indexOf('iPhone13,2') > -1 ||
      wx.getSystemInfoSync().model.indexOf('iPhone13,3') > -1 ||
      wx.getSystemInfoSync().model.indexOf('iPhone13,4') > -1 ||
      wx.getSystemInfoSync().model.indexOf('iPhone12,1') > -1 ||
      wx.getSystemInfoSync().model.indexOf('iPhone12,3') > -1 ||
      wx.getSystemInfoSync().model.indexOf('iPhone12,5') > -1,
    // iphone12 12pro 12promax机型兼容，iphone11 11pro 11promax机型兼容
    // isIphonese2:wx.getSystemInfoSync().model.indexOf('iPhone12,8') > -1    //
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 处理广告数据
    getInitData(list) {
      if (list.length == 0) return
      const selectItem = list[0]
      console.log('banner选中的广告', selectItem)
      const definedObj = {
        rank: 1,
        object_type: 'banner',
      }
      indexBannerUserBehaviorEeventTrack('content_exposure_event', selectItem, definedObj)
      this.setData({
        selectData: [selectItem] || [{}],
        show: true,
      })
    },
    // 广告位点击跳转事件
    advertiseBarLink(e) {
      console.log('e000000000000', e)
      const item = e.currentTarget.dataset.item
      console.log('banner数据', item)
      const definedObj = {
        widget_id: 'click_banner',
        widget_name: '广告位',
        object_type: 'banner',
      }
      indexBannerUserBehaviorEeventTrack('user_behavior_event', item, definedObj)
      // urlType: 6: 小程序内部原生,7：美居lite外小程序,8：webH5页面
      // jumpType: 跳转类型 1H5 2小程序 3自定义  //新广告接口
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
        const webViewUrl = encodeURIComponent(item.jumpLinkUrl)
        console.log('webViewUrl', webViewUrl)
        wx.navigateTo({
          url: `${webViewPage}?webViewUrl=${webViewUrl}`,
        })
      }
    },
  },
  /*组件生命周期*/
  lifetimes: {
    created() {
      const res = wx.getSystemInfoSync()
      console.log('res 000000000', res)
      // 判断是否是安卓操作系统 （标题栏苹果为44px,安卓为48px）
      if (res && res['system'].indexOf('Android') > -1) {
        console.log('res["system"]', res['system'])
        this.setData({
          isAndroid: true,
        })
      } else {
        console.log('res["system"]', res['system'])
        this.setData({
          isAndroid: false,
        })
      }

      console.log('设备model:', wx.getSystemInfoSync().model)
    },
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
        console.log('页面被展示')
      },
      hide: function () {
        // 页面被隐藏
        console.log('页面被隐藏')
      },
      resize: function () {
        // 页面尺寸变化
        console.log('页面尺寸变化')
      },
    },
  },
})
