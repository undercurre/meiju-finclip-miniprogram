/*
 * @Description: 导购添加微信弹窗
 * @Author: 朱承财
 * @Date: 2022-04-15 16:44:56
 * @LastEditTime: 2022-04-24 10:18:49
 */
import { imgBaseUrl } from '../../../api'
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    guideInfo: {
      type: Object,
      observer: function (newValue, oldValue) {
        console.log(newValue)
      },
    },
  },
  data: {
    imgBaseUrl: imgBaseUrl.url,
    title: '恭喜您已获得权益',
    contactMe: '联系我获取一对一贴心服务',
    iconSrc: '../../../assets/img/meiju-icon.png',
    logoImg: '/virtual-plugin/images/365logo@3x.png',
    customerImg: '/virtual-plugin/images/img_kefu_default@3x.png',
    closeImg: '/virtual-plugin/images/pop_ic_close@2x.png',
  },
  options: {
    addGlobalClass: true,
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {},
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 组件的方法列表
  methods: {
    //点击其他空白区域关闭
    MaskhideDialog() {
      this.setData({
        show: false,
      })
      this.triggerEvent('clickWechatBlankClose')
    },
    //点击关闭按钮隐藏弹框
    CloseHideDialog() {
      this.setData({
        show: false,
      })
      this.triggerEvent('clickWechatClose')
    },
    //监听按钮点击事件执行开始时的回调
    startmessage() {
      this.triggerEvent('clickWechatContact')
    },
    //监听按钮点击事件执行完毕后的回调
    completemessage() {},
  },
})
