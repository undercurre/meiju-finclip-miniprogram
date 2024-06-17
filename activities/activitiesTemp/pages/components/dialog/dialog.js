import { actTemplateImgApi, actTemplateH5Addr } from '../../../../../api.js'
const commonMixin = require('../../commonMixin.js')
const actTempmetMethodsMixins = require('../../actTempmetMethodsMixins.js')
Component({
  behaviors: [commonMixin, actTempmetMethodsMixins],
  // 属性定义（详情参见下文）
  properties: {
    myProperty: {
      // 属性名
      type: String,
      value: '',
    },
    options: {
      type: Object,
      value: {},
    },
    isShowDialog: {
      type: Boolean,
      value: false,
      // observer(newVal, oldVal) {
      //   console.log('isShowDialog=======', newVal)
      //   if(newVal) {
      //     this.getStyle()
      //     this.getOptions()
      //     this.scale()
      //   } else {
      //     this.scale1()
      //   }
      // }
    },
    props: {
      type: Object,
      value: {
        isStatic: false,
        // type: '2', //弹框类型
        // title: '弹框标题',
        // btnCancelText: '取消',
        // btnConfirmText: '确认',
        // content: '弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容弹框内容'
      },
    },
    myProperty2: String, // 简化的定义方式
  },
  observers: {
    isShowDialog(newVal) {
      if (newVal) {
        this.getStyle()
        this.getOptions()
        this.scale()
      } else {
        this.scale1()
      }
    },
  },
  data: {
    imgUrl: actTemplateImgApi.url,
    style: '',
    isShowDialog1: false,
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
      this.setData({ animation: this.animation.export() })
      this.setData({
        isShowDialog1: true,
      })
      this.animation.scale(1, 1).step()
      this.setData({ animation: this.animation.export() })
    },
    scale1() {
      console.log('关闭')
      if (!this.animation) return
      this.animation.scale(0, 0).step()
      this.setData({ animation: this.animation.export() })
      setTimeout(() => {
        this.setData({
          isShowDialog1: false,
        })
      }, 500)
    },
    getOptions() {
      const { gameId, channelId } = this.properties.options
      const { fromSite } = this.data
      const encodeWeexUrl = encodeURIComponent(
        actTemplateH5Addr.actHome.url + `?gameId=${gameId}&channelId=${channelId}&fromSite=${fromSite}`
      )
      const appHomePage = `midea-meiju://com.midea.meiju/main?type=jumpWebView&url=${encodeWeexUrl}&needNavi=1`
      console.log('dialog组件', appHomePage, this.properties.options)
      this.setData({
        appParameter: appHomePage,
      })
    },
    getStyle() {
      const { props } = this.properties
      if (props.type == 5) {
        this.setData({
          style: `width:${props.popups.width}rpx;height:${props.popups.height}rpx;${
            props.popups.rollFlag ? 'overflow-y: scroll;' : ''
          };`,
        })
      } else {
        this.setData({
          style: '',
        })
      }
    },
    actionDialogClose(e) {
      const item = e.currentTarget.dataset.item
      if (item.type == 4) {
        return
      }
      this.triggerEvent('actionDialogClose', e)
    },
    actionBtnConfirm() {
      this.triggerEvent('actionBtnConfirm')
    },
    actionDialogBtn(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectPage: this.properties.props,
      }
      this.triggerEvent('actionDialogBtn', params)
    },
    launchAppError(e) {
      // this.actionDialogClose()
      console.log('弹框里的按钮', e)
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectPage: this.properties.props,
      }
      this.triggerEvent('actionLaunchAppDialogError', params)
    },
    launchAppSuccess(e) {
      const item = e.currentTarget.dataset.item
      const params = {
        basicItem: item,
        selectPage: this.properties.props,
      }
      console.log('打开app成功')
      this.triggerEvent('actionLaunchAppDialogSuccess', params)
    },
    bindlaunchappSuccess() {
      this.triggerEvent('actionDialogClose')
    },
  },
})
