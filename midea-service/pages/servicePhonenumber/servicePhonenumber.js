// midea-service//pages/servicePhonenumber/servicePhonenumber.js
const app = getApp()
import { imgBaseUrl } from '../../../api.js'
import { webView } from '../../../utils/paths'
import { clickEventTracking } from '../../../track/track.js'
import { debounce } from 'm-utilsdk/index'
import { getFullPageUrl, checkNetwork } from '../../../utils/util'
import { requestService } from '../../../utils/requestService'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    baseImgUrl: imgBaseUrl.url,
    servicePhoneList: [
      {
        title: '美的',
        phone: '400-889-9315',
      },
      {
        title: '小天鹅',
        phone: '400-822-8228',
      },
      {
        title: 'COLMO',
        phone: '400-969-9999',
      },
      // {
      //   title: '比佛利',
      //   phone: '400-158-8888',
      // },
      {
        title: '华凌',
        phone: '400-889-9800',
      },
      {
        title: '布谷',
        phone: '400-930-9983',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.canToOnlineService = true
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  makePhone(e) {
    const item = e.currentTarget.dataset.item
    wx.makePhoneCall({
      phoneNumber: item.phone, //仅为示例，并非真实的电话号码
    })
    clickEventTracking('user_behavior_event', 'makePhone', {
      module: '服务',
      page_id: 'page_contact_service',
      page_name: '联系客服',
      page_path: getFullPageUrl(),
      page_module: '',
      widget_id: 'click_btn_number',
      widget_name: '热线电话',
      object_type: '',
      object_id: '',
      object_name: '',
      device_info: {},
      ext_info: {
        number: item.phone,
      },
    })
  },
  //跳转到H5在线客服页面
  toOnlineService: debounce(() => {
    if (!app.globalData.canToOnlineService) {
      return
    }
    app.globalData.canToOnlineService = false
    let callback = async () => {
      let nickname = ''
      let phone = ''
      let headimgurl = ''
      if (app?.globalData?.userData?.userInfo) {
        let { mobile, userId } = app.globalData.userData.userInfo
        phone = mobile
        let data = {
          headParams: {},
          restParams: {
            sourceSys: 'IOT',
            userId: userId,
            brand: 1,
            mobile: mobile,
          },
        }
        let resp = await requestService.request('getVipUserInfo', data)
        if (resp?.data?.data?.userCustomize?.headImgUrl) {
          let { headImgUrl, nickName } = resp.data.data.userCustomize
          headimgurl = headImgUrl
          nickname = nickName
          app.globalData.userData.userInfo.headImgUrl = headImgUrl
          app.globalData.userData.userInfo.nickName = nickName
        } else {
          let { nickName, headImgUrl } = app.globalData.userData.userInfo
          nickname = nickName
          headimgurl = headImgUrl
        }
      }
      let sessionId = app.globalData.openId
        ? app.globalData.openId + '_' + phone.substring(phone.length - 6, phone.length)
        : ''
      wx.request({
        url: 'https://cconline.midea.com:8086/yc-media/h5encrypt?action=index',
        method: 'POST',
        data: {
          channelKey: 'gh_bf92931b2bd6',
          sessionId: sessionId,
          visitTime: new Date().getTime(),
          nickname: nickname,
          mobile: phone,
          headImgurl: headimgurl,
          keyCode: 101,
          app: 'true',
          language: 'cn',
        },
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          if (res?.data?.state) {
            clickEventTracking('user_behavior_event', 'makePhone', {
              module: '服务',
              page_id: 'page_contact_service',
              page_name: '联系客服',
              page_path: getFullPageUrl(),
              page_module: '',
              widget_id: 'click_btn_service',
              widget_name: '在线客服',
              object_type: '',
              object_id: '',
              object_name: '',
              device_info: {},
              ext_info: {},
            })
            let encodeLink = encodeURIComponent(
              'https://cconline.midea.com:8086/yc-media/visit/access?param=' + res.data.data
            )
            wx.navigateTo({
              url: `${webView}?webViewUrl=${encodeLink}`,
            })
          }
        },
      })
    }
    checkNetwork(callback)
  }),
})
