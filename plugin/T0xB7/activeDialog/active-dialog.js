// plugin/T0xB6/activeDialog/active-dialog.js
import { requestService } from '../../../utils/requestService'
import { dateFormat, aesEncrypt, aesDecrypt } from 'm-utilsdk/index'
import { CryptoJS,md5 } from '../../../miniprogram_npm/m-utilsdk/index'
import { api } from '../../../api'
const nowDate = dateFormat(new Date(), 'yyyy-MM-dd')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeStyle: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: '',
    },
    applianceCode: {
      type: String,
      value: '',
    },
    sn8: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    activity: {},
    tipsFlagObj: {},
    info: {},
  },
  lifetimes: {
    attached: function () {
      if (
        !app.globalData.currDeviceInfo ||
        !app.globalData.userData ||
        !app.globalData.applianceHomeData ||
        app.globalData.aesKey == '' ||
        app.globalData.aesIv == ''
      ) {
        // 关键信息都没有的情况下，不显示浮窗
        return
      }
      setTimeout(() => this.sendAdData(), 0)
      console.log('1111', JSON.stringify(app.globalData.aesKey))
      console.log('1111', JSON.stringify(app.globalData.aesIv))
      console.log('1111', app.globalData)
      console.log('1111', app.globalData.userData.userInfo.headImgUrl)
      console.log('1111', app.globalData.userData.userInfo.nickName)
      console.log('1111', JSON.stringify(app.globalData.userData.uid))
      console.log('1111', JSON.stringify(app.globalData.userData.iotUserId))
      console.log('1111', JSON.stringify(this.properties.applianceCode))
      console.log('1111', app.globalData.userData)
      console.log('1111', app.globalData)
      // 在组件实例进入页面节点树时执行
      let res = wx.getStorageSync('tipsFlag_' + this.properties.applianceCode)
      this.setData({
        tipsFlagObj: res || {},
        info: {
          uid: app.globalData.userData.uid,
          userId: app.globalData.userData.iotUserId,
          aesKey: app.globalData.aesKey,
          aesIv: app.globalData.aesIv,
          sn: app.globalData.currDeviceInfo.sn,
          homegroupId: app.globalData.applianceHomeData.homegroupId,
          roomId: app.globalData.applianceHomeData.roleId,
          headImgUrl: app.globalData.userData.userInfo.headImgUrl,
          nickName: app.globalData.userData.userInfo.nickName,
        },
      })
      if (this.data.tipsFlagObj.activityCardClosed && this.data.tipsFlagObj.activityCardClosed == nowDate) {
        return // 直接不请求
      }
      let params = {
        protype: this.properties.type,
      }
      if (this.properties.sn8 !== '') {
        params['sn8'] = this.properties.sn8
        params['applianceId'] = this.properties.applianceCode
      }
      requestService.request('getWechatDeviceActivity', params).then((rs) => {
        if (rs.data.retCode == 0 && rs.data.result) {
          let getActivity = false
          rs.data.result.map((item) => {
            if (getActivity) return // 已获取活动，不再遍历
            // 时间限制：只有在活动时间段内才显示
            let timeLimit = nowDate >= item.beginDate && nowDate <= item.endDate
            let isDomain = true // 目前默认云端对活动域名做了处理，在小程序中就不做判断了 item.jumpLink.indexOf('https://kh-content.midea-hotwater.com') > -1
            // 判断各种限制，符合才显示
            if (timeLimit && isDomain && item.location === 'top') {
              this.setData({
                activity: item,
              })
            }
          })
        }
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sendAdData() {
      let options = wx.getLaunchOptionsSync()
      console.log('sendAdData options', options)
      let gdt_vid = options.query && options.query.gdt_vid && options.query.gdt_vid !== '' ? options.query.gdt_vid : ''
      let qz_gdt = options.query && options.query.qz_gdt && options.query.qz_gdt !== '' ? options.query.qz_gdt : ''
      if (gdt_vid == '' && qz_gdt == '') {
        // 没有广告id就不请求
        console.log('sendAdData no gdt_vid nor qz_gdt')
        return
      }
      if (!app.globalData.currDeviceInfo || !app.globalData.userData) {
        // 如果数据都不存在，无法请求
        console.log('sendAdData no other data')
        return
      }
      let params = {
        clickId: gdt_vid == '' ? qz_gdt : gdt_vid,
        clickType: gdt_vid == '' ? 'qz_gdt' : 'gdt_vid',
        clickTime: Date.now(),
        uid: app.globalData.userData.uid,
        userId: app.globalData.userData.iotUserId,
        deviceId: app.globalData.currDeviceInfo.applianceCode,
        deviceSn: this.decrypt(app.globalData.currDeviceInfo.sn),
        deviceType: app.globalData.currDeviceInfo.type.split('0x')[1],
        deviceSn8: app.globalData.currDeviceInfo.sn8,
      }
      console.log('sendAdData params', params)
      requestService
        .request('sendAdData', {
          msg: 'saveClickEvent',
          param: params,
        })
        .then((rs) => {
          console.log('sendAdData res', rs)
        })
        .catch((err) => {
          console.log('sendAdData err', err)
        })
    },
    clickToWebView(e) {
      let { info, activity } = this.data
      let { applianceCode, type } = this.properties
      let { aesKey, aesIv, uid, userId, sn, homegroupId, roomId, headImgUrl, nickName } = info
      var currLink = activity.jumpLink
      let params = this.urlParams({
        uid,
        userId,
        applianceCode,
        type,
        homegroupId,
        roomId,
        headImgUrl,
        nickName,
        sn: this.decrypt(sn),
      })
      console.log('1111url: ' + params)
      params = aesEncrypt(params, aesKey, aesIv)
      currLink = `${currLink}?option=${params}`
      console.log('1111url: ' + currLink)
      // return
      let encodeLink = encodeURIComponent(currLink)
      let currUrl = `../../../pages/webView/webView?webViewUrl=${encodeLink}&loginState=1`
      // let currUrl = `../../component/webView/webView?webViewUrl=${encodeLink}&loginState=1`
      wx.navigateTo({
        url: currUrl,
      })
    },
    urlParams(params) {
      let url = ''
      let keys = Object.keys(params)
      keys.forEach((key) => {
        url += `${key}=${params[key]}&`
      })
      return url.slice(0, url.length - 1)
    },
    clickToClose() {
      wx.showToast({
        title: '今日将不再显示活动浮窗',
        icon: 'none',
      })
      let tipsFlagObj = Object.assign({}, this.data.tipsFlagObj, {
        activityCardClosed: nowDate,
      })
      wx.setStorageSync('tipsFlag_' + this.properties.applianceCode, tipsFlagObj)
      this.setData({
        tipsFlagObj,
        activity: {},
      })
    },
    decrypt(chiperText) {
      let content = app.globalData.userData.key
      content = CryptoJS.enc.Hex.parse(content)
      content = CryptoJS.enc.Base64.stringify(content)
      let md5_key = md5(api.appKey).substring(0, 16)
      md5_key = CryptoJS.enc.Utf8.parse(md5_key)
      let decode_seed = CryptoJS.AES.decrypt(content, md5_key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8)
      decode_seed = CryptoJS.enc.Utf8.parse(decode_seed)
      chiperText = CryptoJS.enc.Hex.parse(chiperText)
      chiperText = CryptoJS.enc.Base64.stringify(chiperText)
      let plain = CryptoJS.AES.decrypt(chiperText, decode_seed, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      })
      plain = plain.toString(CryptoJS.enc.Utf8)
      return plain
    },
    encrypt(plainText) {
      let content = app.globalData.userData.key
      console.log('当前的key======', app.globalData.userData.key)
      content = CryptoJS.enc.Hex.parse(content)
      content = CryptoJS.enc.Base64.stringify(content)
      let md5_key = md5(api.appKey).substring(0, 16)
      md5_key = CryptoJS.enc.Utf8.parse(md5_key)
      let decode_seed = CryptoJS.AES.decrypt(content, md5_key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8)
      decode_seed = CryptoJS.enc.Utf8.parse(decode_seed)
      //加密order,加密种子是前面解密的key
      let chiperText = CryptoJS.AES.encrypt(plainText, decode_seed, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      })
      chiperText = chiperText.ciphertext.toString()
      return chiperText
    },
  },
})
