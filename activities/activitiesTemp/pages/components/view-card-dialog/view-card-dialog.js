import { actTemplateImgApi } from '../../../../../api.js'
import { getPageUrl, isTabPage } from '../../../../../utils/util.js'
import { viewActEventClickTracking } from '../../../track/track.js'
import { Base64 } from 'm-utilsdk/index'
import { webViewPage } from '../../path'
Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {
    isShowCardDialog: {
      type: Boolean,
      value: false,
      observer(newVal) {
        if (newVal) {
          this.scale()
        } else {
          this.scale1()
        }
      },
    },
    props: {
      type: Object,
      value: {},
    },
    cardPageSetting: {
      type: Object,
      value: {},
    },
    cardContainerInfo: {
      type: Object,
      value: {},
    },
    pageSetting: {
      type: Object,
      value: {},
    },
    basicSetting: {
      type: Object,
      value: {},
    },
    options: {
      type: Object,
      value: {},
    },
  },

  data: {
    imgUrl: actTemplateImgApi.url,
    isShowDialog1: false,
    animationData: {},
  }, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {
    this.animation = wx.createAnimation()
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
    hide: function () {},
    resize: function () {},
  },
  methods: {
    scale() {
      console.log('显示')
      this.animation.scale(0, 0).step()
      this.setData({ animationData: this.animation.export() })
      this.setData({
        isShowDialog1: true,
      })
      setTimeout(() => {
        this.animation.scale(1, 1).step()
        this.setData({ animationData: this.animation.export() })
      }, 400)
    },
    scale1() {
      console.log('关闭')
      this.animation.scale(0, 0).step()
      this.setData({ animationData: this.animation.export() })
      setTimeout(() => {
        this.setData({
          isShowDialog1: false,
        })
      }, 500)
    },
    actionDialogClose() {
      this.triggerEvent('actionDialogClose')
    },
    actionBtnCopy(e) {
      let self = this
      let basicItem = e.currentTarget.dataset.item
      let { extra } = this.properties.props
      console.log(extra)
      let extraObj = extra ? JSON.parse(Base64.decode(extra)) : undefined
      console.log(extraObj)
      if (extraObj && extraObj.wxAppletUrl) {
        //小程序内页
        if (extraObj.wxUseChannel == 1) {
          if (isTabPage(extraObj.wxAppletUrl)) {
            setTimeout(() => {
              wx.switchTab({
                url: extraObj.wxAppletUrl,
              })
            }, 1000)
          } else {
            setTimeout(() => {
              wx.navigateTo({
                url: extraObj.wxAppletUrl,
              })
            }, 1000)
          }
        }
        //h5
        if (extraObj.wxUseChannel == 2) {
          let encodeLink = encodeURIComponent(basicItem.appletsJumpLink)
          let currUrl = `${webViewPage}?webViewUrl=${encodeLink}`
          setTimeout(() => {
            wx.navigateTo({
              url: currUrl,
            })
          }, 1000)
        }
        // 其他小程序
        if (extraObj.wxUseChannel == 3) {
          setTimeout(() => {
            self.actionGoOtherWxapp(extraObj)
          }, 1000)
        }
      }
      this.activityTrack(basicItem)
      wx.setClipboardData({
        data: this.properties.props.virtualCouponCode || '',
      })
    },
    //跳转到其他小程序
    actionGoOtherWxapp(extraObj) {
      wx.navigateToMiniProgram({
        appId: extraObj.wxAppId,
        path: extraObj.wxAppletUrl,
        success(res) {
          console.log(res)
        },
      })
    },
    //活动按钮字节埋点
    activityTrack(basicItem) {
      const { options } = this.data
      let pageSetting = this.properties.cardPageSetting
      let initData = this.properties.pageSetting
      options['path'] = getPageUrl()
      let selectContainer = pageSetting['containerList'][0]
      viewActEventClickTracking('activity_widget_event', options, initData, pageSetting, selectContainer, basicItem)
    },
  },
})
