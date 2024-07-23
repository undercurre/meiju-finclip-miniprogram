// home-manage/pages/roomDetail/roomDetail.js
const app = getApp() //获取应用实例
import { requestService } from '../../../utils/requestService'
import { getReqId, getStamp, validateFun, singleton } from 'm-utilsdk/index'
import burialPoint from '../../assets/burialPoint'
import { plateName } from '../../../plate'
import { PUBLIC, ERROR } from '../../../color'
const commonBehavior = require('../../assets/behavior')
Page({
  behaviors: [commonBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    roomDetail: {},
    roleId: '',
    homegroupId: '',
    deleteDialogShow: false,
    noDeleteDialogShow: false,
    editDialogShow: false,
    autoFocus: false, //自动聚焦
    roomName: '',
    roomValue: '',
    errorMessage: '',
    // tipsShow: false,
    // tips: '',
    deleteMessage: '',
    publicColor: PUBLIC,
    errorColor: ERROR,
  },
  showEditDialog() {
    if (this.data.roleId == 1003) return
    this.setData({
      errorMessage: '',
      editDialogShow: true,
      roomValue: this.data.roomName,
    })
    setTimeout(() => {
      this.setData({
        autoFocus: true,
      })
    }, 200)
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
  confirmEdit() {
    const errorMsg = this.validtaFunc(this.data.roomValue)
    if (errorMsg) {
      this.setData({
        roomName: this.data.roomDetail.name,
        errorMessage: errorMsg,
      })
      return
    }
    this.editRoom()
      .then((res) => {
        console.log(res, '修改房间名成功')
        app.globalData.ifRefreshHomeList = true
        this.setData({
          roomName: this.data.roomValue,
          editDialogShow: false,
          autoFocus: false,
        })
      })
      .catch((err) => {
        console.log(err, '修改房间名失败')
        if (err.data.code === 1202) {
          wx.showToast({
            title: '你不是家庭管理员',
            icon: 'none',
          })
        } else if (err.data.code === 1211) {
          wx.showToast({
            title: '房间名称已被使用',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: '修改房间名称失败',
            icon: 'none',
          })
        }
      })
  },
  cancleEdit() {
    this.setData({
      editDialogShow: false,
      autoFocus: false,
      errorMessage: '',
    })
  },
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
    this.data.roomValue = e.detail
  },
  editRoom() {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
      homegroupId: this.data.homegroupId,
      name: this.data.roomValue,
      icon: this.data.roomDetail.icon,
      roomId: this.data.roomDetail.roomId,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('editRoom', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  showDeleteDialog() {
    if (this.data.roleId == 1003) {
      return
    }
    //点击埋点
    burialPoint.popupsfamilyDeleteRoomClick()
    console.log(this.data.roomDetail)
    if (!this.data.roomDetail.applianceList.length) {
      if (this.data.roomDetail.hasOtherDevice) {
        this.setData({
          deleteMessage: '房间里还有其他品牌设备，请在美居APP中将设备移出房间后再进行此操作',
          noDeleteDialogShow: true,
        })
        return
      }
      this.setData({
        deleteDialogShow: true,
      })
      //浏览埋点
      burialPoint.popupsfamilyDeleteRoomBurialPoint()
    } else {
      this.setData({
        deleteMessage: '房间里还有设备，请将设备移出房间后再进行此操作',
        noDeleteDialogShow: true,
      })
    }
  },
  noDeleteConfirm() {},
  deleteConfirm() {
    //点击埋点
    burialPoint.confirmpopupsfamilyDeleteRoomClick()
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
      homegroupId: this.data.homegroupId,
      roomId: this.data.roomDetail.roomId,
    }
    requestService
      .request('deleteRoom', reqData)
      .then((res) => {
        app.globalData.ifRefreshHomeList = true
        console.log(res, '删除房间成功')
        wx.navigateBack()
      })
      .catch((err) => {
        console.log(err, '删除房间失败')
        wx.showToast({
          title: '删除房间失败',
          icon: 'none',
        })
      })
  },
  deleteCancle() {
    //点击埋点
    burialPoint.cancelpopupsfamilyDeleteRoomClick()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      roomDetail: JSON.parse(decodeURIComponent(options.detail)),
      roleId: options.roleId,
      homegroupId: options.homegroupId,
    })
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      roomName: this.data.roomDetail.name,
    })
    burialPoint.pagefamilyRoomDetailBurialPoint()
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
