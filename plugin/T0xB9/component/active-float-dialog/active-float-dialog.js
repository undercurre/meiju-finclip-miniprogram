import { actTemplateImgApi } from '../../../../api.js'
import { webViewPage } from '../../../../utils/paths.js'
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    initData: {
      type: Array,
      value: [],
      observer(val) {
        this.getInitData(val)
      },
    },
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    // 这里是一些组件内部数据
    show: false,
    imgUrl: actTemplateImgApi.url,
    selectData: {},
  },
  methods: {
    getInitData(list) {
      console.log('读取浮窗', list)
      if (list.length == 0) return

      // const storage = wx.getStorageInfoSync()
      let ishow = true
      // console.log("storage.keys type", typeof(storage.keys))
      // console.log("storage.keys",storage.keys)
      // console.log("storage.keys", Object.keys(storage.keys))
      // let storageKeysArr = Object.keys(storage.keys)
      // for (let index = 0; index < storageKeysArr.length; index++) {
      //     if (storage.keys[index] == 'floatTimestamp' ) {
      //         console.log("存在属性 floatTimestamp")
      //         let storageTimestamp = wx.getStorageSync('floatTimestamp')
      //         let timestamp = new Date().getTime()
      //         let tempTimestamp = 48*60*60*1000
      //         // let tempTimestamp = 1*60*1000   //1分钟测试
      //          console.log("storageTimestamp 关闭时间", storageTimestamp)
      //          console.log("timestamp 当前时间", timestamp)
      //          console.log("timestamp-storageTimestamp 相差", timestamp-storageTimestamp)
      //          console.log("tempTimestamp 设定间隔时间", tempTimestamp)
      //         ishow =  (timestamp-storageTimestamp)<tempTimestamp?false:true
      //      }
      // }

      const selectItem = list[0]
      console.log('浮窗选中的广告', ishow, selectItem)
      // userBehaviorEeventTrack("content_exposure_event", selectItem )
      this.setData({
        selectData: selectItem || {},
        show: ishow,
      })
    },
    // 关闭浮窗
    closeFloatDialog() {
      this.setData({
        show: false,
      })

      // let timestamp = new Date().getTime()
      // // console.log("timestamp 时间戳",timestamp)
      // const storage = wx.getStorageInfoSync()
      // console.log("storage.keys", storage.keys)
      // console.log("storage.keys.indexOf('floatTimestamp')", storage.keys.indexOf('floatTimestamp'))
      // if (storage.keys.indexOf('floatTimestamp') == -1) {
      //     wx.setStorageSync('floatTimestamp', timestamp)
      // } else {
      //     wx.removeStorageSync('floatTimestamp')
      //     wx.setStorageSync('floatTimestamp', timestamp)
      // }
    },

    floatDialogGO(e) {
      const item = e.currentTarget.dataset.item
      console.log('浮窗处理数据', item)
      // userBehaviorEeventTrack("user_behavior_event", item)
      // urlType: 6: 小程序内部原生,7：美居lite外小程序,8：webH5页面   旧广告接口
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
    created() {},
    attached() {
      // this.triggerEvent('attached')
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
