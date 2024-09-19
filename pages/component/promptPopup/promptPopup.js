/*
 * @desc: 首次启动弹窗提示
 * @author: zhucc22
 * @Date: 2024-09-19 14:10:54
 */

Component({
  properties: {
    innerShow: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    title: '使用公告',
    confirmButtonText: '我知道了',
    tiptilte: '尊敬的用户，欢迎使用HarmonyOS NEXT系统版本的美的美居。请您关注：',
    desc1: '1、此版本的美的美居功能正在持续建设中，当前暂仅支持部分设备的联网、控制能力；',
    desc2:
      '2、此版本基于HarmonyOS NEXT系统开发，功能体验依赖系统能力，若在使用过程中遇到问题，请联系美的官方客服进行反馈、处理。',
    addDeviceClickFlag: false,
  },
  lifetimes: {
    ready: function () {
      let promptPopup = wx.getStorageSync('PROMPTPOPUP')
      if (!promptPopup) {
        this.popUp()
      }
    },
    detached: function () {},
  },
  pageLifetimes: {
    show() {},
  },
  methods: {
    handleAgree() {
      this.disPopUp()
      wx.setStorageSync('PROMPTPOPUP', true)
      this.triggerEvent('handleAgree')
    },
    popUp() {
      if (this.data.innerShow === false) {
        this.setData({
          innerShow: true,
        })
      }
    },
    disPopUp() {
      if (this.data.innerShow === true) {
        this.setData({
          innerShow: false,
        })
      }
    },
  },
})
