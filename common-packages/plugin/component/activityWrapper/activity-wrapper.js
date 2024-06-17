// plugin/T0xB7/activityWrapper/activity-wrapper.js
import { requestService } from '../../../../utils/requestService'
import { dateFormat, aesEncrypt, aesDecrypt, CryptoJS, md5 } from 'm-utilsdk/index'
// const CryptoJS = require('../../../../utils/cryptojs')
import { api } from '../../../../api'
import { pluginEventTrack } from '../../../../track/pluginTrack.js'
const nowDate = dateFormat(new Date(), 'yyyy-MM-dd')
const app = getApp()
Component({
  properties: {
    activeStyle: {
      type: String,
      value: '',
    },
  },
  data: {
    hide: false,
    topActivity: {},
    tipsFlagObj: {},
    isShow: true,
    activityList: [
      // {
      //   beginDate: "2022-08-30",
      //   endDate: "2022-09-30",
      //   iconLink: "https://midea-video.oss-cn-hangzhou.aliyuncs.com/activityIcon_res/upload/ca932e711c3b4a6ca72f9531dcd64641.png",
      //   jumpLink: "https://m.midea.cn",
      //   location: "bottom",
      //   title: "底部活动1"
      // }
    ],
    info: {},
  },
  lifetimes: {
    attached: function () {
      this._observer = null
      let res = {}
      if (
        !app.globalData.currDeviceInfo ||
        !app.globalData.userData ||
        !app.globalData.applianceHomeData ||
        app.globalData.aesKey == '' ||
        app.globalData.aesIv == ''
      ) {
        // 关键信息都没有的情况下，不显示浮窗跟活动栏
        this.setData({
          isShow: false,
        })
        return
      }
      setTimeout(() => this.sendAdData(), 0)
      // console.log('1111', app.globalData)
      // console.log('1111', JSON.stringify(app.globalData.aesKey))
      // console.log('1111', JSON.stringify(app.globalData.aesIv))
      // console.log('1111', !app.globalData.currDeviceInfo)
      // 在组件实例进入页面节点树时执行
      wx.getStorage({
        key: 'tipsFlag_' + app.globalData.currDeviceInfo.applianceCode,
        success(result) {
          res = Object.assign({}, result.data)
        },
      })
      // 因获取缓存异步，宏任务处理
      setTimeout(() => {
        this.data.tipsFlagObj = res
        if (this.data.tipsFlagObj?.activityCardClosed == nowDate) {
          this.setData({
            // 不显示浮窗，但是仍然需要请求
            isShow: false,
          })
          // return // 直接不请求
        }
      }, 0)
      this.setData({
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
          type: app.globalData.currDeviceInfo.type.split('0x')[1],
          applianceCode: app.globalData.currDeviceInfo.applianceCode,
          sn8: app.globalData.currDeviceInfo.sn8,
        },
      })
      let params = {
        protype: this.data.info.type,
        sn8: this.data.info.sn8,
        applianceId: this.data.info.applianceCode,
      }
      requestService.request('getWechatDeviceActivity', params).then((rs) => {
        if (rs.data.retCode == 0 && rs.data.result) {
          let getActivity = false
          let list = []
          rs.data.result.map((item) => {
            console.log('getWechatDeviceActivity: ' + JSON.stringify(item))
            // if (getActivity) return // 已获取活动，不再遍历
            // 时间限制：只有在活动时间段内才显示
            let timeLimit = nowDate >= item.beginDate && nowDate <= item.endDate
            console.log('getWechatDeviceActivity: ' + timeLimit)
            let isDomain = true // 目前默认云端对活动域名做了处理，在小程序中就不做判断了 item.jumpLink.indexOf('https://kh-content.midea-hotwater.com') > -1
            // 判断各种限制，符合才显示
            if (timeLimit && isDomain) {
              if (item.location === 'top' && !getActivity) {
                console.log('getWechatDeviceActivity: ' + item.location)
                this.setData({
                  topActivity: item,
                })
                getActivity = true
              }
              if (item.location === 'bottom' && list.length < 4) {
                // list.push(item)
                list.push(item)
              }
            }
          })
          this.setData({
            activityList: list,
          })
          console.log('list111: ', this.data.activityList)
        }
      })
    },
    detached: function () {
      if (this._observer) this._observer.disconnect()
    },
  },
  observers: {
    topActivity: function (topActivity) {
      console.log('pp', JSON.stringify(topActivity), this.data.isShow)
      if (JSON.stringify(topActivity) !== '{}' && this.data.isShow) {
        this.initObserver()
      }
    },
    isShow: function (isShow) {
      // 只监听isShow变化
      if (!isShow && this._observer) {
        this._observer.disconnect()
      }
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
    initObserver() {
      this._observer = wx.createIntersectionObserver(this)
      this._observer
        .relativeTo('.active-topper')
        // .relativeToViewport({top:50})
        .observe('.active-dialog', (res) => {
          console.log('pp2', res)
          if (res.intersectionRatio > 0 && !this.data.hide) {
            this.setData({
              hide: true,
            })
          }
        })
    },
    clickTop(e) {
      if (this.data.hide) {
        this.setData({
          hide: false,
        })
        return
      }
      this.clickToWebView(e, true)
    },
    clickToWebView(e, isTop = false) {
      console.log('111', e.currentTarget.dataset.url)
      setTimeout(() => {
        pluginEventTrack('user_behavior_event', null, {
          page_id: 'page_control',
          page_name: '插件首页',
          widget_id: isTop ? 'click_float_activity' : 'click_bottom_activity',
          widget_name: isTop ? '浮窗活动' : '底部活动',
          ext_info: e.currentTarget.dataset.title,
        })
      }, 0)
      let currLink = e.currentTarget.dataset.url
      let { info } = this.data
      let { aesKey, aesIv, applianceCode, type, uid, userId, homegroupId, roomId, headImgUrl, nickName, sn } = info
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
      let currUrl = `../../../pages/webView/webView?webViewUrl=${encodeLink}`
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
      wx.setStorage({
        key: 'tipsFlag_' + app.globalData.currDeviceInfo.applianceCode,
        data: tipsFlagObj,
      })
      this.setData({
        tipsFlagObj,
        isShow: false,
      })
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_activity_close',
        widget_name: '活动浮窗关闭',
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
