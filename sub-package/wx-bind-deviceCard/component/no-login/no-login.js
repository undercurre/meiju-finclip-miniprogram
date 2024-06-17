import { baseImgApi } from '../../../../api.js'
import { login } from '../../../../utils/paths.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseImgUrl: baseImgApi.url + 'img_no_location@3x.png',
    title: '帐号未登录',
    desText1: '你还未登录，暂不能操控设备',
    desText2: '请登录后再试~',
    item: {
      color: '#FFFFFF',
      size: 'normal',
      type: 'default',
      text: '前往登录',
      background: '#267AFF',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //跳到登录页
    buttonClicked() {
      wx.navigateTo({
        url: login,
      })
    },
  },
})
