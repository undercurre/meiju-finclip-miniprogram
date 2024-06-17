// change-room/pages/changeRoom/changeRoom.js
const app = getApp()
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { baseImgApi } from '../../../api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    roomList: [],
    chooseIco: baseImgApi.url + 'icon_check@2x.png',
    roomId: null,
    homegroupId: null,
  },
  //更换房间
  changeRoom(item) {
    console.log('切换房间', item)
    this.changeRoomClickBurialPoint()
    this.setData({
      roomId: item.currentTarget.dataset.roomid,
    })
    let { applianceCode, isOtherEquipment, cardType } = app.globalData.applianceItem
    if (cardType) {
      //蓝牙直连未上云设备修改房间
      this.bluetoothChangeRoom()
      return
    }
    let reqData = {
      applianceCode: applianceCode,
      homegroupId: this.data.homeGrounpId,
      roomId: this.data.roomId,
      isOtherEquipment: isOtherEquipment,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('changRoom', reqData)
        .then((resp) => {
          console.log('changRoom成功', resp)
          if (resp.data.code === 0) {
            wx.navigateBack()
          }
          resolve(resp)
        })
        .catch((error) => {
          console.log('changRoom失败', error)
          wx.showToast({
            title: '修改房间失败',
            icon: 'none',
          })
          reject(error)
        })
    })
  },
  bluetoothChangeRoom() {
    console.log('蓝牙直连设备修改房间')
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      homegroupId: this.data.homeGrounpId,
      roomId: this.data.roomId,
      applianceName: app.globalData.applianceItem.name,
      sn: app.globalData.applianceItem.sn,
    }
    requestService
      .request('changeBluetoothRoom', reqData)
      .then((resp) => {
        console.log('changRoom成功', resp)
        if (resp.data.code === 0) {
          wx.navigateBack()
        }
      })
      .catch((error) => {
        console.log('changRoom失败', error)
        wx.showToast({
          title: '修改房间失败',
          icon: 'none',
        })
      })
  },
  //页面浏览埋点
  changeRoomViewBurialPoint() {
    console.log('浏览埋点', app.globalData.applianceItem, getCurrentPages())
    let support = app.globalData.applianceItemSupport
    let params = app.globalData.applianceItem
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1]
    rangersBurialPoint('user_page_view', {
      page_path: currentPage.route,
      module: '设备卡片',
      page_id: 'page_room_appliance_list',
      page_name: '设备所在房间列表页',
      object_type: 'appliance',
      object_id: params.applianceCode,
      object_name: params.name,
      ext_info: {
        onlineStatus: params.onlineStatus, //设备在线状态1在线/0离线
        pluginType: params.type, //设备品类
        sn8: params.sn8, //SN8码
        is_support_current_device: support ? 1 : 0, //设备是否支持小程序控制
      },
    })
  },
  //更改房间点击埋点
  changeRoomClickBurialPoint() {
    let support = app.globalData.applianceItemSupport
    let params = app.globalData.applianceItem
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1]
    console.log('点击房间埋点参数', params)
    rangersBurialPoint('user_behavior_event', {
      page_path: currentPage.route,
      module: '设备卡片',
      page_id: 'page_room_appliance_list',
      page_name: '设备所在房间列表页',
      page_module: '',
      widget_name: '点击房间',
      widget_id: 'click_room',
      rank: '',
      object_type: 'appliance',
      object_id: params.applianceCode,
      object_name: params.name,
      ext_info: {
        onlineStatus: params.onlineStatus, //设备在线状态1在线/0离线
        pluginType: params.type, //设备品类
        sn8: params.sn8, //SN8码
        is_support_current_device: support ? 1 : 0, //设备是否支持小程序控制
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('roomsId==', options)
    console.log(app.globalData.applianceItem)
    this.setData({
      roomList: app.globalData.roomList,
      roomId: app.globalData.applianceItem.roomId,
      homeGrounpId: options.homeGrounpId,
    })
    this.changeRoomViewBurialPoint()
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
