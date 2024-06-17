import { actTemplateImgApi } from '../../../../../api.js'
import { isEmptyObject, getEncodeString } from 'm-utilsdk/index'
Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {
    isShowLogisticsDialog: {
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
      observer(newVal) {
        !isEmptyObject(newVal) && this.initData()
      },
    },
  },

  data: {
    imgUrl: actTemplateImgApi.url,
    userName: '',
    userMobile: '',
    userAddress: '', //9已发货，10，未发货
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
      this.setData({
        animationData: this.animation.export(),
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
    actionBtnCopy() {
      wx.setClipboardData({
        data: this.properties.props.waybillNumber || '',
      })
    },
    initData() {
      let { userName, userMobile, userAddress } = this.properties.props
      this.setData({
        userName: getEncodeString(userName) || '',
        userMobile: getEncodeString(userMobile) || '',
        userAddress: getEncodeString(userAddress) || '',
      })
    },
  },
})
