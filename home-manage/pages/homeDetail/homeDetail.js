// home-manage/pages/homeDetail/homeDetail.js
const app = getApp() //获取应用实例
import { requestService } from '../../../utils/requestService'
import { baseImgApi } from '../../../api'
import { getReqId, getStamp, validateFun } from 'm-utilsdk/index'
import burialPoint from '../../assets/burialPoint'
import { plate, plateName } from '../../../plate'
import { PUBLIC, ERROR } from '../../../color'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultAvatar: baseImgApi.url + 'home-manage/family_img_no touxiang@3x.png',
    moreIcon: baseImgApi.url + 'home-manage/family_ic_more@3x.png',
    addIcon: baseImgApi.url + 'home-manage/family_ic_add@3x.png',
    homegroupId: '',
    roleId: '',
    name: '',
    ownHomeNum: null,
    dialogShow: false,
    familyDialogShow: false,
    autoFocus: false, //自动聚焦
    familyValue: '',
    dialogTitle: '',
    dialogMessage: '',
    dialogMessageAlign: 'center',
    option: '',
    errorMessage: '',
    publicColor: PUBLIC,
    errorColor: ERROR,
    plate: plate,
  },
  homeMemberGet(id) {
    let reqData = {
      homegroupId: id,
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('homeMemberGet', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  homeDelete() {
    let reqData = {
      homegroupId: this.data.homegroupId,
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('homeDelete', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  homeQuit() {
    let reqData = {
      homegroupId: this.data.homegroupId,
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('homeQuit', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  familyNameEdit() {
    let reqData = {
      homegroupId: this.data.homegroupId,
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
      name: this.data.familyValue,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('familyNameEdit', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  showDeleteDialog(e) {
    let { option } = e.currentTarget.dataset
    if (option === 'delete') {
      if (this.data.ownHomeNum <= 1) {
        wx.showToast({
          title: '至少保留一个自己创建的家庭',
          icon: 'none',
          mask: true,
        })
        return
      }
      //点击埋点
      burialPoint.popupsfamilyDeleteFamilyClick()
      this.setData({
        dialogTitle: '删除家庭',
        dialogMessage: '删除家庭会清除家庭下所有设备与家庭成员，确定要删除该家庭吗？',
        dialogShow: true,
        option: 'delete',
        dialogMessageAlign: 'left',
      })
      //浏览埋点
      burialPoint.popupsfamilyDeleteFamilyBurialPoint()
    } else if (option === 'exit') {
      //点击埋点
      burialPoint.popupsfamilyQuitFamilyClick()
      this.setData({
        dialogTitle: '退出家庭',
        dialogMessage: '确定要退出该家庭吗',
        dialogShow: true,
        option: 'exit',
        dialogMessageAlign: 'center',
      })
      //浏览埋点
      burialPoint.popupsfamilyQuitFamilyBurialPoint()
    }
  },
  onClose() {
    console.log('close')
  },
  cancelDialog() {
    console.log('取消弹窗', this.data.option)
    if (this.data.option === 'delete') {
      // 取消删除家庭
      burialPoint.clickpopupcancelBurialPoint()
    }
    if (this.data.option === 'exit') {
      // 取消退出家庭
      burialPoint.cancelQuitFamilyClick()
    }
  },
  confirm() {
    if (this.data.option === 'delete') {
      burialPoint.clickpopupconfirmBurialPoint()
      this.homeDelete()
        .then((res) => {
          console.log(res.data.code, '删除家庭成功')
          app.globalData.ifRefreshHomeList = true
          wx.navigateBack()
        })
        .catch((err) => {
          console.log(err)
          wx.showToast({
            title: '删除家庭失败,请稍后重试',
            icon: 'none',
          })
        })
    } else if (this.data.option === 'exit') {
      burialPoint.confirmQuitFamilyClick()
      this.homeQuit()
        .then((res) => {
          console.log(res, '退出家庭成功')
          wx.navigateBack()
        })
        .catch((err) => {
          console.log(err)
          wx.showToast({
            title: '退出家庭失败,请稍后重试',
            icon: 'none',
          })
        })
    }
  },
  familyNameClick() {
    if (this.data.roleId == 1003) return
    this.setData({
      errorMessage: '',
      familyDialogShow: true,
      familyValue: this.data.name,
    })
    setTimeout(() => {
      this.setData({
        autoFocus: true,
      })
    }, 200)
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
    this.data.familyValue = e.detail
  },
  cancleEdit() {
    this.setData({
      familyDialogShow: false,
      autoFocus: false,
      name: this.data.name,
      errorMessage: '',
    })
  },
  validtaFunc(val) {
    var validator = new validateFun()
    validator.add(val, [{ ruleName: 'isNonEmpty', errorMsg: '家庭名称不能为空' }])
    var errorMsg = validator.start()
    return errorMsg
  },
  confirmEdit() {
    const errorMsg = this.validtaFunc(this.data.familyValue)
    if (errorMsg) {
      this.setData({
        errorMessage: errorMsg,
      })
      return
    }
    this.familyNameEdit()
      .then((res) => {
        console.log(res, '修改家庭名称成功')
        this.setData({
          familyDialogShow: false,
          autoFocus: false,
          name: res?.data?.data?.name,
        })
      })
      .catch((err) => {
        console.log(err, '修改家庭名称失败')
        if (err.data.code == 1210) {
          wx.showToast({
            title: '家庭名称重复',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: '修改家庭名称失败,请稍后重试',
            icon: 'none',
          })
        }
      })
  },
  goToRoomList() {
    wx.navigateTo({
      url: `/home-manage/pages/roomAndDevices/roomAndDevices?homegroupId=${this.data.homegroupId}&roleId=${this.data.roleId}`,
    })
  },
  goToMemberManage() {
    wx.navigateTo({
      url: `/home-manage/pages/memberManage/memberManage?roleId=${this.data.roleId}&homegroupId=${this.data.homegroupId}`,
    })
  },
  /**
   * 获取邀请码
   */
  getInvitationCode() {
    return new Promise((resolve, reject) => {
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        homegroupId: this.data.homegroupId || '',
      }
      requestService.request('share', reqData).then(
        (resp) => {
          resolve(resp.data.data || {})
        },
        (error) => {
          reject(error)
        }
      )
    })
  },

  //点击邀请按钮
  clickInviteBtn() {
    burialPoint.clickInvitePoint({
      page_id: 'page_family_detail',
      page_name: '家庭详情',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      homegroupId: options.homegroupId,
      name: options.name,
      roleId: options.roleId,
      familyValue: options.name,
      ownHomeNum: options.ownHomeNum,
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
    this.homeMemberGet(this.data.homegroupId)
      .then((res) => {
        console.log(res, 'res')
        this.setData({
          memberList: res.data.data.list,
        })
      })
      .catch((err) => {
        console.log(err, 'err')
      })
    burialPoint.pagefamilydetailBurialPoint()
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

  async onShareAppMessage(res) {
    var tempTitle = `欢迎使用${plateName}`
    var tempPath = '/pages/index/index'
    var tempImageUrl = '/assets/img/img_wechat_chat01@3x.png'
    const homegroupid = this.data.homegroupId
    // this.data.fromShare = true
    console.log(res)
    if (res.from == 'button') {
      if (this.data.memberList.length >= 20) {
        wx.showToast({
          title: '您的家庭成员已经达到20个上限，无法继续新增',
          icon: 'none',
        })
        return
      }
      try {
        const getInvitationCodeData = await this.getInvitationCode(homegroupid)
        tempPath = '/' + getInvitationCodeData.path
        tempTitle = '邀请你加入我的家庭控制设备'
        tempImageUrl = '/assets/img/img_wechat_chat02@3x.png'
      } catch (error) {
        console.log(error, 'onShareAppMessage')
      }
    }
    console.log('分享出来的路径', tempPath)
    //启用页面小程序转发功能
    return {
      title: tempTitle,
      path: tempPath,
      imageUrl: tempImageUrl,
    }
  },
})