/*
 * @desc: 判断是否需要续期 如果要续期 则手动续期
 * @author: zhucc22
 * @Date: 2024-06-17 16:59:38
 */
import loginMethods from '../../../globalCommon/js/loginRegister'
import { checkTokenExpired } from '../../../utils/redis.js'
const app = getApp()
Component({
  // 属性定义（详情参见下文）
  properties: {},
  observers: {},
  ready: function () {},
  data: {
    //imgNoHome: baseImgApi.url + 'img_no_home.png',
    imgNoHome: '/assets/img/img_no_home.png',
  },
  methods: {
    initHomeInfo() {
      let MPTOKEN_EXPIRATION = 0
      let MPTOKEN_USERINFO
      let THAT = this
      MPTOKEN_EXPIRATION = wx.getStorageSync('MPTOKEN_EXPIRATION')
      MPTOKEN_USERINFO = wx.getStorageSync('userInfo')
      if (!app.globalData.noNetWork && !checkTokenExpired(MPTOKEN_USERINFO, MPTOKEN_EXPIRATION)) {
        app.globalData.wxExpiration = true
        loginMethods.loginAPi().then(() => {
          console.log('resfreshToken sucesss')
          app.globalData.wxExpiration = true
          THAT.triggerEvent('initHomeInfo')
        })
      } else {
        this.triggerEvent('initHomeInfo')
      }
    },
  },
})
