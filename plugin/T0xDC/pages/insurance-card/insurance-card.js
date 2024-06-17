/* eslint-disable no-unused-vars */
// plugin/T0xDB/pages/insurance-card/insurance-card.js
import { imageApi, environment } from '../../../../api'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../../utils/requestService'

import { CryptoJS } from '../../../../miniprogram_npm/m-utilsdk/index'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    backgroundImgs: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    showHistory: false,
    descriptionText: '',
    descriptionShortText: '',
    isInputMood: true,
    insuranceCardListData: {},
    inputPhoneNum: '',
    inputSecure: '',
  },
  getZhiNengXiYiBaseUrl() {
    let baseUrl = 'https://app.zhinengxiyifang.cn:10087/'
    if (environment === 'sit' || environment === 'dev') {
      baseUrl = 'https://sit.zhinengxiyifang.cn:10087/'
    }
    return baseUrl
  },
  getIotInsuranceCardBaseUrl() {
    let baseUrl = 'https://activity-prod.smartmidea.net/'
    if (environment === 'sit' || environment === 'dev') {
      baseUrl = 'https://activity-sit.smartmidea.net/'
    }
    return baseUrl
  },
  getInsuranceCardList() {
    let userData = app.globalData.userData
    if (userData.uid && userData.uid.length && this.data.activityId.length) {
      console.log('取得延保服务信息')
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '未取得延保服务',
        icon: 'error',
        duration: 3000,
      })
      setTimeout((item) => {
        wx.navigateBack({
          delta: 1, //返回上一级页面
        })
      }, 3000)
    }
    let time = Date.parse(new Date())
    let reqId = getReqId()
    // let header = {};
    let body = { uid: userData.uid, activityId: this.data.activityId, stamp: time, reqId: reqId }
    // let sign = this.getHmacSHA256(body, this.f(), time);
    // header['Content-Type'] = "application/json";

    return new Promise((resolve, reject) => {
      requestService
        .request('washerActivityQueryGuaranteeCard', body)
        .then((res) => {
          console.log('\n\n\n__func__ getInsuranceCardList info : ' + JSON.stringify(res))
          resolve(res)
        })
        .catch((err) => {
          console.log('\n\n\n__func__ getInsuranceCardList info ERROR : ' + JSON.stringify(err))
          reject(err)
        })
    })
  },
  errorDescription(errorCode) {
    let description = '未知系统错误'
    switch (errorCode) {
      case 1000:
        description = '未知系统错误'
        break
      case 1002:
        description = '参数为空'
        break
      case 1105:
        description = '账户不存在'
        break
      case 3000:
        description = '无效的活动信息'
        break
      case 3001:
        description = '已经领取了延保卡权益'
        break
      case 3002:
        description = '没有领取权限'
        break
      case 3003:
        description = '延保卡数量不足'
        break
      case 3004:
        description = '无效的手机号码'
        break
      case 3005:
        description = '获取卡权益信息错误'
        break
      default:
        break
    }
    return description
  },
  settingSecurecode(e) {
    this.setData({
      inputSecure: e.detail.value,
    })
  },
  inputSecurecode(e) {
    let result = e.detail.value
    if (result.length != 11) {
      wx.showToast({
        title: '激活码错误',
        icon: 'error',
        duration: 3000,
      })
      return
    }
    this.setData({
      inputSecure: result,
    })
  },
  settingPhone(e) {
    this.setData({
      inputPhoneNum: e.detail.value,
    })
  },
  inputPhone(e) {
    let result = e.detail.value
    if (result.length != 11) {
      wx.showToast({
        title: '手机号码错误',
        icon: 'error',
        duration: 3000,
      })
      return
    }
    this.setData({
      inputPhoneNum: result,
    })
  },
  // sit环境
  aSit() {
    return '6PlzRc'
  },
  hSit() {
    return 'IYg70u'
  },
  mSit() {
    return 'rhaX'
  },

  // pro环境
  a() {
    return 'DAfxl8'
  },
  h() {
    return 'czvGeP'
  },
  m() {
    return 'TmIE'
  },

  f() {
    console.log('const f() appEnv: ' + environment)
    if (environment === 'sit' || environment === 'dev') {
      return 'rukPQLXDTW0sGoMY'
    } else {
      return 'bfYKdcAQt3HGFaq2'
    }
  },
  // 加密
  getHmacSHA256(params, key, timestamp) {
    let content = ''
    console.log('HmacSHA256 params: ' + JSON.stringify(params))
    console.log('HmacSHA256 key: ' + key)
    console.log('HmacSHA256 timestamp: ' + timestamp)
    if (typeof params == 'string') {
      content = params
    } else if (typeof params == 'object') {
      let newKeys = Object.keys(params)
      newKeys.push('timestamp')
      // let newKeys = Object.keys(params).sort();
      console.log('HmacSHA256 newKeys: ' + newKeys)
      let sortKeys = newKeys.sort()
      console.log('HmacSHA256 sortKeys: ' + sortKeys)
      // let newKeys = Object.keys(params).push('timestamp').sort();
      for (let i = 0; i < sortKeys.length; i++) {
        if (i > 0) {
          content = content + '&'
        }
        let value
        if (newKeys[i] === 'timestamp') {
          value = timestamp
        } else {
          value = params[newKeys[i]]
        }
        // content = content + newKeys[i] + '=' + encodeURI(value);
        content = content + newKeys[i] + '=' + value
      }
    } else {
      return ''
    }
    console.log('HmacSHA256 content: ' + content)
    let result = CryptoJS.HmacSHA256(content, key).toString()
    console.log('HmacSHA256 result: ' + result)
    return result
  },
  // fetchGuideRightsInfo() {
  //   let userData = app.globalData.userData;
  //   let time = Date.parse(new Date()) / 1000;
  //   let header = {};
  //   let body = {"uid": userData.uid, "nickName": userData.userInfo.nickName ? userData.userInfo.nickName : '0', "mobile": this.data.inputSecure, "userId": userData.userInfo.userId? userData.userInfo.userId:'0', "iotUserId": userData.iotUserId ?  userData.iotUserId : '0'};
  //   let sign = this.getHmacSHA256(body, this.f(), time);
  //   console.log('HmacSHA256 key is : ' + sign );
  //   header['Content-Type'] = "application/json";
  //   header['timestamp'] = time.toString();
  //   header['appKey'] = "wechatapplet";
  //   header['sign'] = sign.toString();
  //   return new Promise((resolve, reject) => {
  //     wx.request({
  //       url: this.getZhiNengXiYiBaseUrl() + 'wechat/v1/mobile/verify',
  //       data: body,
  //       header: header,
  //       method: "POST",
  //       success(resData) {
  //         if (resData.data.code === 200) {
  //           resolve();
  //         } else {
  //           reject(resData);
  //         }
  //       },
  //       fail(error) {
  //         reject(error)
  //         console.log('resData error : ' + JSON.stringify(error) );
  //       }
  //     })
  //   })
  // },
  fetchGuideRightsInfo() {
    let userData = app.globalData.userData
    let resourceUri = '/xyj/wechat/v1/mobile/verify'
    let body = {
      uid: userData.uid,
      nickName: userData.userInfo.nickName ? userData.userInfo.nickName : '0',
      mobile: this.data.inputSecure,
      userId: userData.userInfo.userId ? userData.userInfo.userId : '0',
      iotUserId: userData.iotUserId ? userData.iotUserId : '0',
    }
    return new Promise((resolve, reject) => {
      requestService
        .request(resourceUri, body, 'POST')
        .then((res) => {
          if (res.data.code === 200) {
            resolve()
          } else {
            reject(res)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getInsuranceCard() {
    let userInfo = app.globalData.userData.userInfo
    if (userInfo.uid && userInfo.uid.length && this.data.activityId.length) {
      console.log('取得延保服务信息')
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '未取得延保服务',
        icon: 'error',
        duration: 3000,
      })
      setTimeout((item) => {
        wx.navigateBack({
          delta: 1, //返回上一级页面
        })
      }, 3000)
    }

    let time = Date.parse(new Date())
    let reqId = getReqId()
    let header = {}
    let body = {
      uid: userInfo.uid,
      activityId: this.data.activityId,
      guidePhoneNum: this.data.inputSecure,
      applianceType: '0xDC',
      stamp: time,
      reqId: reqId,
    }
    header['Content-Type'] = 'application/json'

    return new Promise((resolve, reject) => {
      requestService
        .request('washerActivityGetGuaranteeCard', body)
        .then((res) => {
          console.log('\n\n\n__func__ getInsuranceCard info : ' + JSON.stringify(res))
          resolve(res)
        })
        .catch((err) => {
          console.log('\n\n\n__func__ getInsuranceCard info ERROR : ' + JSON.stringify(err))
          reject(err)
        })
    })
  },
  getInsuranceBtnClick(event) {
    let that = this
    if (this.data.inputSecure.length != 11) {
      wx.showToast({
        title: '激活码错误',
        icon: 'error',
        duration: 3000,
      })
      return
    }
    // if (this.data.inputPhoneNum.length != 11) {
    //   wx.showToast({
    //     title: '手机号码错误',
    //     icon: 'error',
    //     duration: 3000
    //   })
    //   return;
    // }
    wx.showLoading({
      title: '加载中...',
    })
    this.fetchGuideRightsInfo()
      .then((response) => {
        this.getInsuranceCard()
          .then((res) => {
            wx.hideLoading()
            if (res.data.code === 0) {
              wx.showModal({
                title: '操作完成',
                content: '已成功领取延保卡权益。',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.checkCardUsedInfo()
                  }
                },
              })
            } else {
              let errorDesc = this.errorDescription(res.data.code)
              wx.showModal({
                title: '错误提示',
                content: errorDesc,
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.checkCardUsedInfo()
                  }
                },
              })
            }
          })
          .catch((err) => {
            wx.hideLoading()
            let errorDesc = '发生未知错误，请退出重试'
            if (err.data && err.data.code) {
              errorDesc = this.errorDescription(err.data.code)
            }
            wx.showModal({
              title: '错误提示',
              content: errorDesc,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  that.checkCardUsedInfo()
                }
              },
            })
          })
      })
      .catch((err) => {
        wx.hideLoading()
        wx.showModal({
          title: '验证失败',
          content: '请填写正确的激活码。',
          showCancel: false,
        })
      })
  },
  contentShrinkClick(event) {
    if (this.data.showHistory && this.data.isInputMood) {
      return
    }
    this.setData({
      showHistory: true,
      isInputMood: true,
    })
  },
  contentStreatchClick(event) {
    if (!this.data.showHistory && this.data.isInputMood) {
      return
    }
    this.setData({
      showHistory: false,
      isInputMood: true,
    })
  },
  descriptionTextClick(event) {
    wx.navigateTo({
      url: '../insurance-regulations/insurance-regulations',
    })
  },
  checkCardUsedInfo() {
    this.getInsuranceCardList()
      .then((res) => {
        console.log('\n\n__func__ checkCardUsedInfo : ' + JSON.stringify(res))
        if (res.data.code === 0) {
          if (res.data.data) {
            this.setData({
              insuranceCardListData: res.data.data,
            })
            if (res.data.data.notUsedList.length > 0) {
              for (let i = 0; i < res.data.data.notUsedList.length; i++) {
                let temp = res.data.data.notUsedList[i]
                if (temp.applianceTypes === '0xDC') {
                  this.setData({
                    isInputMood: false,
                    showHistory: true,
                  })
                  return
                }
              }
            }
          }
        }
      })
      .catch((err) => {})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var value = wx.getStorageSync('washer_activity_insurance')
      if (value) {
        // Do something with return value
        this.setData(
          {
            activityId: value.activityId,
            backgroundImgs: value.contentBgs,
            descriptionText: value.descriptionText,
            descriptionShortText: value.descriptionShortText,
          },
          () => {
            this.checkCardUsedInfo()
          }
        )
      }
    } catch (e) {
      // Do something when catch error
      wx.showToast({
        title: '未取得延保服务',
        icon: 'error',
        duration: 3000,
      })
      setTimeout((item) => {
        wx.navigateBack({
          delta: 1, //返回上一级页面
        })
      }, 3000)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
})
