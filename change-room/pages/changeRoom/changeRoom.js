// change-room/pages/changeRoom/changeRoom.js
const app = getApp()
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { baseImgApi } from '../../../api'
import { index } from '../../../utils/paths.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '移动设备',
    roomList: [],
    homeList: [],
    chooseIco: baseImgApi.url + 'icon_check@2x.png',
    roomId: null,
    homegroupId: null,
    actionShow: false,
    actions: [],
    selelectFamilyInfo: {},
    selected: '',
  },
  //返回
  onClickLeft() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({
        delta: 1,
      })
    } else {
      wx.switchTab({
        url: index,
      })
    }
  },
  //关闭家庭选择
  toggleActionSheet() {
    this.setData({
      actionShow: false,
    })
  },
  //打开家庭选择
  onClickHomeList() {
    if (this.data.selelectFamilyInfo.roleId != '1001') {
      return
    }
    this.setData({
      actionShow: true,
    })
  },
  //选择家庭
  actionSelected(e) {
    console.log(e)
    let { homeitem } = e.currentTarget.dataset
    this.setData({
      actionShow: false,
      selelectFamilyInfo: homeitem,
      homegroupId: homeitem.homegroupId,
    })
    //切换房间
    this.getRoomAndDevicesList(homeitem.homegroupId)
  },
  //获取创建者家庭
  gethomeList() {
    let actions = getApp().globalData.homeGrounpList.filter((item) => {
      return item.roleId == '1001'
    })
    // actions.push(getApp().globalData.selelectFamilyInfo)
    this.setData({
      actions,
    })
  },
  //保存移动设备
  onClickRight() {
    let { applianceCode, isOtherEquipment, cardType } = app.globalData.applianceItem
    if (cardType) {
      //蓝牙直连未上云设备修改房间
      this.bluetoothChangeRoom()
      return
    }
    wx.showLoading({ title: '保存中', icon: 'loading', duration: 10000 })
    let reqData = {
      applianceCode: applianceCode,
      homegroupId: this.data.homegroupId,
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
          wx.hideLoading()
          if (resp.data.code === 0) {
            wx.navigateBack()
          }
          resolve(resp)
        })
        .catch((error) => {
          console.log('changRoom失败', error)
          wx.hideLoading()
          wx.showToast({
            title: '移动设备失败',
            icon: 'none',
          })
          reject(error)
        })
    })
  },
  //更换房间
  changeRoom(item) {
    console.log('切换房间', item)
    this.changeRoomClickBurialPoint()
    this.setData({
      roomId: item.currentTarget.dataset.roomid,
    })
  },
  bluetoothChangeRoom() {
    console.log('蓝牙直连设备修改房间')
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      homegroupId: this.data.homegroupId,
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
          title: '移动设备失败',
          icon: 'none',
        })
      })
  },
  //获取房间设备
  getRoomAndDevicesList(homegroupId) {
    wx.showLoading({ title: '切换中', icon: 'loading', duration: 10000 })
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
      cardType: [
        {
          type: 'appliance',
          query: {
            homegroupId: homegroupId,
          },
        },
      ],
    }
    requestService
      .request('applianceListAggregate', reqData)
      .then((res) => {
        wx.hideLoading()
        // console.log(res, 'applianceListAggregate')
        let roomList = res.data.data.appliance[0].roomList
        this.setData({
          roomList: roomList || [],
          roomId: roomList[0]?.roomId,
        })
      })
      .catch((err) => {
        wx.hideLoading()
        console.log(err, 'applianceListAggregate')
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
      selelectFamilyInfo: app.globalData.curFamilyInfo,
      roomList: app.globalData.roomList,
      roomId: app.globalData.applianceItem.roomId,
      homegroupId: options.homeGrounpId,
    })
    this.gethomeList()
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
