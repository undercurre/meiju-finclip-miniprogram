/*
 * @desc: 页面返回跳转，以及分享跳转
 * @author: zhucc22
 * @Date: 2024-06-27 11:18:17
 */
import { index, inviteHomeFamily } from '../../utils/paths.js'
module.exports = Behavior({
  properties: {},
  observers: {},
  data: {
    opacity: '0.16',
    isShowBg: true,
    bgColor: '#e1e8f8',
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },
  methods: {
    //返回
    onClickLeft() {
      if (getCurrentPages().length > 1) {
        wx.navigateBack()
      } else {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    },
    //控制头部组件以及动画组件效果颜色变化
    scroll(e) {
      let scrolltop = e.detail.scrollTop
      if (scrolltop > 50) {
        this.setData({
          isShowBg: false,
        })
      } else {
        this.setData({
          isShowBg: true,
        })
      }
    },
    //跳转邀请页面
    gotoInvite(homeItem, homegroupid) {
      const item = JSON.stringify(encodeURIComponent(homeItem))
      wx.navigateTo({
        url: `${inviteHomeFamily}?homeItem=${item}&homegroupid=${homegroupid}`,
      })
    },
  },
})
