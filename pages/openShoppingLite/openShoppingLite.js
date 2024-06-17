// 打开商城小程序引导页面
const app = getApp()
import { getStamp } from 'm-utilsdk/index'
import { judgeWayToMiniProgram, getFullPageUrl } from '../../utils/util'
import { baseImgApi } from '../../api'
import { clickEventTracking } from '../../track/track.js'
import { rangersBurialPoint } from '../../utils/requestService'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImgUrl: baseImgApi.url,
    keyword: '', //搜索关键字
    deviceInfo: null, //设备信息
    msgId: '', //消息模板id
    tip: '', //服务通知里的提示说明，用于埋点
    msgType: '', //消息类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('传入的参数', options)
    let search = ''
    switch(options.keyword){
      case '':
        search = '洗衣液'
        break
      case '1':
        search = '洗衣液'
        break
      case '2':
        search = '柔顺剂'
        break
      case '3':
        search = '洗衣液'
        break
      case '4':
        search = '元气棒'
        break
      case '5':
        search = '香薰'
        break  
    }
    if(options.msgType == '洗衣机清洁提醒'){
      search = '槽清洁剂'
    }
    this.setData({
      keyword: search,
      deviceInfo: JSON.parse(decodeURIComponent(options.deviceInfo)),
      msgId: options.msgId,
      tip: options.tip,
      msgType: options.msgType
    })
    console.log('关键字', this.data.keyword)
    console.log('设备信息', this.data.deviceInfo)
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
   let { msgId, tip, keyword, deviceInfo, msgType } = this.data
   //预览埋点
   rangersBurialPoint('user_page_view', {
    page_path: getFullPageUrl(),
    module: '消息',
    page_id: 'page_commodity_buy',
    page_name: '耗材_购买页',
    object_type: '消息',
    object_id: msgId,
    object_name: msgType,
    device_info: {
      sn8: deviceInfo.sn8, //sn8码
      widget_cate: deviceInfo.type, //设备品类
    },
    ext_info: {
      content:tip,
      keywords:keyword
    },
  })
  },

  //打开美的智慧家小程序
  openLite(){
    let { msgId, tip, keyword, deviceInfo, msgType } = this.data
    //点击埋点
    clickEventTracking('user_behavior_event', 'openLite', {
      page_path: getFullPageUrl(),
      page_id: 'page_commodity_buy',
      page_name: '耗材_购买页',
      page_module: '',
      widget_id: 'click_btn_now_buy',
      widget_name: '立即选购',
      object_type: '消息',
      object_id: msgId,
      object_name: msgType,
      device_info: {
        sn8: deviceInfo.sn8, //sn8码
        widget_cate: deviceInfo.type, //设备品类
      },
      ext_info: {
        content:tip,
        keywords:keyword
      },
   })
   const currentUid =
        app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
          ? app.globalData.userData.uid
          : ''
   const randam = getStamp()
   let appId = 'wx255b67a1403adbc2'
   let path = `/subpackage/page/search/search_sku/search_sku?scene=6&keyword=${this.data.keyword}&mtag=10087.10.7`
   let extra = {
    jp_source: 3,
    jp_c4a_uid: currentUid,
    jp_rand: randam,
    }
    judgeWayToMiniProgram(appId, path, extra, this.data.shangchen__envVersion)
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
   let { deviceInfo, msgId } = this.data
   app.globalData.isFromOpenShopLite = true
   app.globalData.shopDeviceInfo = deviceInfo
   app.globalData.shopMsgID = msgId
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

  }
})