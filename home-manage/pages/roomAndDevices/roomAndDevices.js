// home-manage/pages/roomAndDevices/roomAndDevices.js
const app = getApp() //获取应用实例
import { requestService } from '../../../utils/requestService'
import { getReqId, getStamp, validateFun } from 'm-utilsdk/index'
import burialPoint from '../../assets/burialPoint'
import { plate, plateName } from '../../../plate'
import { PUBLIC, ERROR } from '../../../color'
const commonBehavior = require('../../assets/behavior')
Page({
  behaviors: [commonBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    title: '房间与设备',
    homegroupId: '',
    roleId: '',
    roomList: [],
    roomDialogShow: false,
    autoFocus: false, //自动聚焦
    roomName: '',
    errorMessage: '',
    // tipsShow: false,
    // tips: '',
    saveAllow: true,
    deviceFilterInfo: [],
    roomNameList: [
      '客厅',
      '主卧',
      '厨房',
      '花园',
      '主卧卫生间',
      '婴儿房',
      '院子',
      '地下室',
      '浴室',
      '书房',
      '儿童房',
      '衣帽间',
      '游戏室',
      '家庭影院',
      '办公室',
      '卧室',
      '次卧',
      '客卧',
      '父母房',
      '餐厅',
      '男孩房',
      '女孩房',
      '卫生间',
      '公共卫生间',
      '阳台',
      '储物间',
      '车库',
      '保姆房',
    ],
    publicColor: PUBLIC,
    errorColor: ERROR,
  },
  //根据品牌获取大小类
  filterDeviceWithBrand(brand) {
    let reqData = {
      brand: brand,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('filterDeviceWithBrand', reqData)
        .then((resp) => {
          console.log('过滤品牌', resp)
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getRoomAndDevicesList(homegroupId) {
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
        // console.log(res, 'applianceListAggregate')
        let roomList = res.data.data.appliance[0].roomList
        //东芝品牌需要过滤设备
        if (plate == 'toshiba') {
          const order = res.data.data.appliance[0].cardOrder
          // //对设备进行过滤
          const deviceFilterInfo = this.data.deviceFilterInfo
          roomList.forEach((room) => {
            let temp
            temp = room.applianceList.filter((appliance) => {
              let obj_SN8 = {
                code: appliance.sn8,
                category: appliance.type.slice(-2), // 截取设备type最后两位字符去匹配
              }
              let obj_A0 = {
                code: appliance.modelNumber,
                category: appliance.type.slice(-2), // 截取设备type最后两位字符去匹配
              }

              return (
                JSON.stringify(deviceFilterInfo).includes(JSON.stringify(obj_SN8)) ||
                JSON.stringify(deviceFilterInfo).includes(JSON.stringify(obj_A0))
              )
            })
            // 根据cardorder排序
            if (order) {
              temp.sort((a, b) => {
                return order.indexOf(a.applianceCode) - order.indexOf(b.applianceCode)
              })
            }
            room.hasOtherDevice = room.applianceList.length != temp.length //房间里是否有美居外设备
            room.applianceList = temp
          })
        }
        this.setData({
          roomList: roomList || [],
        })
      })
      .catch((err) => {
        console.log(err, 'applianceListAggregate')
      })
  },
  addRoom() {
    //若房间名在24个房间以内，则取其index；若不在，则传1
    let n =
      this.data.roomNameList.indexOf(this.data.roomName) < 0
        ? 1
        : this.data.roomNameList.indexOf(this.data.roomName) + 1
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
      homegroupId: this.data.homegroupId,
      name: this.data.roomName,
      icon: `${n}`,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('addRoom', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  showAddDialog() {
    //点击房间弹窗
    burialPoint.familyCreateRoomDialogClick()
    if (this.data.roomList.length >= 20) {
      wx.showToast({
        title: '房间数已达上限',
        icon: 'none',
        mask: true,
      })
      return
    }
    this.setData({
      errorMessage: '',
      roomDialogShow: true,
    })
    //弹窗浏览
    burialPoint.familyCreateRoomDialogBurialPoint()
    setTimeout(() => {
      this.setData({
        autoFocus: true,
      })
    }, 200)
    // 埋点
  },
  //取消
  cancleEdit() {
    //取消保存弹窗
    burialPoint.onCancelfamilyCreateRoomDialogClick()
    this.setData({
      roomName: '',
      roomDialogShow: false,
      autoFocus: false,
      errorMessage: '',
    })
  },
  //确认
  confirmEdit() {
    //取消保存弹窗
    burialPoint.onfrimfamilyCreateRoomDialogClick()
    const errorMsg = this.validtaFunc(this.data.roomName)
    if (errorMsg) {
      this.setData({
        errorMessage: errorMsg,
      })
      return
    }
    this.addRoom()
      .then((res) => {
        console.log(res, '新建房间成功')
        if (res.data.code === 0) {
          this.setData({
            roomName: '',
            roomDialogShow: false,
            autoFocus: false,
          })
          this.getRoomAndDevicesList(this.data.homegroupId)
        }
      })
      .catch((err) => {
        console.log(err, '新建房间失败')
        if (err.data.code == 1211) {
          wx.showToast({
            title: '该房间已存在',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: '新建房间失败',
            icon: 'none',
          })
        }
      })
  },
  validtaFunc(val) {
    var validator = new validateFun()
    validator.add(val, [
      { ruleName: 'isNonEmpty', errorMsg: '房间名称不能为空' },
      { ruleName: 'isValidInput', errorMsg: '房间名称仅支持中文、英文、数字' },
    ])
    var errorMsg = validator.start()
    return errorMsg
  },
  //点击输入
  clickInput() {
    //暂时去掉
    //burialPoint.inputfamilyCreateRoomDialogClick()
  },
  //输入
  onChange(e) {
    const errorMsg = this.validtaFunc(e.detail || '')
    if (errorMsg) {
      this.setData({
        errorMessage: errorMsg,
      })
    } else {
      !!this.data.errorMessage &&
        this.setData({
          errorMessage: '',
        })
    }
    this.data.roomName = e.detail
  },
  goToRoomDetail(e) {
    let { detail, roleid, homegroupid } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/home-manage/pages/roomDetail/roomDetail?detail=${encodeURIComponent(
        JSON.stringify(detail)
      )}&roleId=${roleid}&homegroupId=${homegroupid}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      homegroupId: options.homegroupId,
      roleId: options.roleId,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.filterDeviceWithBrand(plate)
      .then((res) => {
        this.setData({
          deviceFilterInfo: res.data.data,
        })
        this.getRoomAndDevicesList(this.data.homegroupId)
      })
      .catch((err) => {
        console.log(err)
      })
    burialPoint.pagefamilyRoomDeviceBurialPoint()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    var tempTitle = `欢迎使用${plateName}`
    var tempPath = '/pages/index/index'
    var tempImageUrl = '/assets/img/img_wechat_chat01@3x.png'
    //启用页面小程序转发功能
    return {
      title: tempTitle,
      path: tempPath,
      imageUrl: tempImageUrl,
    }
  },
})
