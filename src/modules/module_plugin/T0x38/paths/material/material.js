// plugin/T0xB8/cards/X9/paths/material/material.js
import api from '../../api/api'
let app = getApp()
const environment = app.getGlobalConfig().environment
const IMAGE_SERVER = environment == 'prod' ? 'https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0x38/' : 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0x38/'
import { cloudDecrypt } from 'm-utilsdk/index'
let key = app.globalData.userData.key
const appKey = app.getGlobalConfig().appKey


Page({
  /**
   * 页面的初始数据
   */
  data: {
    applianceData:{},
    sn: null,
    navBarName: "滤材健康",
    list: [
    ],
    resetList: [],//弹框中能重置的滤材
    showResetPopup:false,
    result: [],//选中的重置滤材,
    showVideoPopup: false,
    settingPopupCloseIcon: `${IMAGE_SERVER}close.png`,//关闭图标
    knowMoreIcon: `${IMAGE_SERVER}know_more.png`,//维护保养功能
    videoList: [
      {
        videoTitle: "清水箱清理",
        time: "00:20",
        audience: "0.1w"
      },
      {
        videoTitle: "滚刷拆卸和安装",
        time: "00:20",
        audience: "0.1w"
      },
      {
        videoTitle: "自清洁使用指南",
        time: "00:20",
        audience: "0.1w"
      },
    ],//视频列表（维护保养功能）
  },
  //去购买
  goBuy(e) {
    wx:wx.navigateTo({
      url: '../buyMaterial/buyMaterial',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', {buyLink: e.currentTarget.dataset.buylink})
      },
      fail: (res) => {console.log(res);},
    })
  },
  //显示重置弹框
  resetPopupShow() {
    this.setData({showResetPopup: true})
  },
  //显示保养视频弹框
  videoPopupShow() {
    this.setData({showVideoPopup: true})
  },
  //关闭弹框
  onClose() {
    this.setData({showResetPopup: false,showVideoPopup: false})
    this.setData({result:[]})
  },
  //重置的选项
  checkBoxChange(e) {
    this.setData({result: e.detail})
  },
  //重置
  reset() {
    wx.showLoading({
      title: '',
    })
    let params = {
      "suppliesType": "",
      "sn": this.data.sn,
    }
    let luaParams = {
      "control_type": "collect_reset",
    }
    this.data.resetList.forEach((item) => luaParams[item.suppliesType] = "none")
    for(let i of this.data.result) {
      params['suppliesType'] = params['suppliesType'].length > 0 ? params['suppliesType'] + '#' + i : i
      luaParams[i] = "confirm"
      console.log('params',params);
      console.log('luaParams',luaParams);
    }
    api.luaControl(this.data.applianceData.applianceCode,luaParams).then((res) => {
      console.log('电控重置',res);
      api.resetMaterial(params).then(res => {
        console.log('网络重置',res)
        wx.hideLoading()
        this.queryMaterial()
        wx.showToast({
          title: '重置成功',
          icon: 'none'
        })
        this.onClose()
      },(err) => console.log(err))
    },(err) => console.log(err))
  },
  //去了解
  knowMore(e) {
    console.log(e.currentTarget.dataset.item);
    this.onClose()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx:wx.showLoading({
      title: '加载中'
    })
    if(options.applianceData) {
      this.setData({applianceData: JSON.parse(decodeURIComponent(options.applianceData))})
    }
    let sn = cloudDecrypt(this.data.applianceData.sn, key, appKey)
    this.setData({sn})
    this.queryMaterial()
    // //查询视频-视频弹窗使用
    // api.queryVideo({sn8:this.data.applianceData.sn8}).then(res => {
    //   console.log(res);
    //   // this.setData({
    //   //   videoList: res.result.items
    //   // })
    // })
  },
  queryMaterial() {
    const params = {
      "applianceId": "",
      "homeId": "",
      "sn": this.data.sn
    }
    //查询滤材
    api.queryMaterial(params).then(res => {
      console.log('查询滤材',res);
      let temp = {}
      let list = []
      for(let item of res.result.suppliesDetailDtoList) {
        temp = {...item,
          value: item.suppliesType == 'one_time'?item.currentPrice : item.suppliesTimeLeftPercent,
          unit: item.suppliesType == 'one_time'?'￥' : '%',
          suppliesTypeDesc: item.suppliesType == 'one_time'?'清洁液' : item.suppliesTypeDesc,
          tip: item.suppliesType != 'one_time'&&item.suppliesTimeLeftPercent <= 20 ? true : false,
          des: item.suppliesType == 'one_time'?'洗地机专用，深度清洁杀菌':'预计剩余'+item.suppliesTimeLeftDay+'天更换'
        }
        list.push(temp)
      }
      this.setData({resetList: list.slice(0,2),list})
      
      wx:wx.hideLoading({
        noConflict: true
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 返回
  onClickLeft() {
    wx.navigateBack({
      delta: 1,
      fail: (err) => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
    })
  },
})