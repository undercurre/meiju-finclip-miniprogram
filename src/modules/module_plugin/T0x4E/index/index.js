const app = getApp()
const requestService = app.getGlobalConfig().requestService

import { getOfflineSn } from '../api/api'

import {
  getReqId,
  getStamp
} from 'm-utilsdk/index'
let offlineComposeApplianceSnArr = []
let offlineComposeApplicanceA0Arr = []
let onlineApplianceCodeArr = []
let composeApplianceNum = 0
let offlineAppliance = []
const pluginMixin=require('m-miniCommonSDK/utils/plugin-mixin')
Page({
  behaviors: [pluginMixin],

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    backIcon:`../assets/img/ic_back_meiju@3x.png`,
    composeDeviceInfo: {}, // 组合设备信息
    type: '',
    currentDeviceInfo: null,
    isCurInit: false,
    dialog:{
			showDialog:false,
			mainText:'',
			subTitle:'',
			cancelTxt:'取消',
      confirmTxt:'去联网',
      confirmBtnType: 'text',
      defaultClose: true
		},
    from: '',
    hasOnshow: false,
    familyPermissionText: {
			addDevice: {
				title: '普通成员不支持添加设备',
				content: '您为当前家庭的普通成员，暂不支持添加设备。请家庭管理员添加设备~',
				confirmText: '我知道了',
			},
      distributionNetwork: {
        title: '普通成员不支持添加设备',
        content: '您为当前家庭的普通成员，暂不支持添加设备。请家庭管理员更改角色权限后再试~',
        confirmText: '返回首页',
      },
		}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'options')
    this.getUrlparams(options);
    console.log('获取参数: ', this.data.deviceInfo);
    let composeDeviceInfo = this.data.deviceInfo  
    app.combinedDeviceCode = composeDeviceInfo.applianceCode
    app.combinedDeviceType = composeDeviceInfo.type
    app.combinedDeviceName = composeDeviceInfo.name
    app.composeApplianceList = composeDeviceInfo.composeApplianceList

    if (composeDeviceInfo.composeApplianceList.length > 0 ) {
      this.setData({
        isCurInit: true,
        currentDeviceInfo: composeDeviceInfo.composeApplianceList[0],
        type: composeDeviceInfo.composeApplianceList[0].type,
        composeDeviceInfo: composeDeviceInfo,
      })
    }
    setTimeout(() => {
      this.getComponrentInstance(this.data.currentDeviceInfo.applianceCode)
      this.initPlugin()
    }, 2000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.composeDeviceInfo, 'onshow data')
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    console.log(currPage.__data__)
    if (currPage.__data__.from == 'reLinkCombined') {
      return
    }
    if (this.data.hasOnshow) {
      return
    }
    this.setData({
      hasOnshow: true
    })
    if (this.data.composeDeviceInfo) {
      app.composeApplianceList = this.data.composeDeviceInfo.composeApplianceList
      this.checkReconnect(this.data.composeDeviceInfo)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // clearInterval(this.data.luaQueryInterval)
    offlineComposeApplianceSnArr = []
    onlineApplianceCodeArr = []
    offlineComposeApplicanceA0Arr = []
    composeApplianceNum = 0
    offlineAppliance = []
    console.log('hide init')
    this.setData({
      dialog:{
        showDialog:false,
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.luaQueryInterval)
    offlineComposeApplianceSnArr = []
    onlineApplianceCodeArr = []
    offlineComposeApplicanceA0Arr = []
    composeApplianceNum = 0
    offlineAppliance = []
    console.log('onUnload init')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 自定义事件
   */

  clickBack() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  onChange(e) {
    console.log(e, 'eee')
    console.log(this.data.composeDeviceInfo.composeApplianceList[e.detail.index], 'composeDeviceInfo')
    let choseDeviceInfo = this.data.composeDeviceInfo.composeApplianceList[e.detail.index]
    this.setData({
      currentDeviceInfo: choseDeviceInfo,
      type: e.detail.name
    })
  },
  /**
     * 组合设备查询离线的sn
     * @param {*} applianceCode 在线设备的编号
     * @returns 离线设备的sn和a0
     */
   getOfflineSn(applianceCode) {
    let reqData = null
    reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      applianceCode: applianceCode
    }
    console.log('getOfflineSn reqData===', reqData)
    return new Promise((reslove, reject) => {
      requestService
        .request(getOfflineSn, reqData, 'POST')
        .then((resp) => {
          console.log('@module combineDeviceMixin.js\n@method getOfflineSn\n@desc 查询离线的sn\n', resp)
          // log.info('getOfflineSn result', resp)
          if (resp.data.code == 0) {
            reslove(resp)
          } else {
            console.error('@module combineDeviceMixin.js\n@method getOfflineSn\n@desc 查询离线sn失败\n', resp)
          }
        })
        .catch((error) => {
          reject(error)
          console.error('@module combineDeviceMixin.js\n@method getOfflineSn\n@desc 查询离线sn失败\n', error)
        })
    })
  },
  // 检查是否需要重连
  checkReconnect(composeDeviceInfo) {
    composeApplianceNum = composeDeviceInfo.composeApplianceList.length
    
    let isAllOnline = composeDeviceInfo.composeApplianceList.every(item => item.onlineStatus == '1')
    console.log(isAllOnline)
    if (isAllOnline) {
      return
    }
    composeDeviceInfo.composeApplianceList.forEach((element) => {
      if (element.onlineStatus == '1') {
        onlineApplianceCodeArr.push(element.applianceCode)
        this.getOfflineSn(element.applianceCode).then((res) => {
          if (res.data.code == 0 && res.data.data.length > 0) {
            offlineComposeApplianceSnArr.push(res.data.data[0].sn)
            offlineComposeApplicanceA0Arr.push(res.data.data[0].a0)
            setTimeout(() => {
              this.alert()
            }, 1000);
          }
        })
      } else {
        offlineAppliance.push(element)
      }
    })
  },
  alert() {
    console.log(offlineComposeApplianceSnArr, 'offlineComposeApplianceSnArr')
    if (offlineComposeApplianceSnArr.length > 0 && offlineAppliance.length < composeApplianceNum) {
      let that = this
      wx.showModal({
        title: `${offlineAppliance[0]['name']}离线了`,
        content: `${offlineAppliance[0]['name']}离线了，无法正常使用。可点击“去联网”按钮重新联网`,
        confirmText: '去联网',
        success (res) {
          if (res.confirm) {
            if (that.checkFamilyPermission()) {
              console.log('link:', `/distribution-network/addDevice/pages/reLinkCombined/reLinkCombined?sn=${offlineComposeApplianceSnArr[0]}&applianceCode=${onlineApplianceCodeArr[0]}&a0=${offlineComposeApplicanceA0Arr[0]}`)
              wx.navigateTo({
                url: `/distribution-network/addDevice/pages/reLinkCombined/reLinkCombined?sn=${offlineComposeApplianceSnArr[0]}&applianceCode=${onlineApplianceCodeArr[0]}&a0=${offlineComposeApplicanceA0Arr[0]}`
              })
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  /**
		 * @description 校验用户在此家庭的权限
		 * @param {Object} params （对家庭/设备进行的）操作
		 */
  checkFamilyPermission(params = 'addDevice') {
    const { curFamilyInfo } = app.globalData
    const permissionText = this.data.familyPermissionText[params]
    if (!curFamilyInfo) {
      // wx.navigateTo({
      //   url: paths.index,
      // })
      wx.showToast({
        title: '家庭信息获取失败',
        icon: 'none'
      })
      return false
    }
    // 1001是创建者
    // 1002是管理员
    // 1003是普通成员
    if (curFamilyInfo.roleId === '1003') {
      wx.showModal({
        title: permissionText.title,
        content: permissionText.content,
        confirmText: permissionText.confirmText,
        showCancel: false
      })
      return false
    }
    return true
  },
})