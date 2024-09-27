// home-manage/pages/memberManage/memberManage.js
const app = getApp() //获取应用实例
import { requestService } from '../../../utils/requestService'
import { getReqId, getStamp } from 'm-utilsdk/index'
import burialPoint from '../../assets/burialPoint'
import { plate, plateName } from '../../../plate'
import { PUBLIC, ERROR } from '../../../color'
const commonBehavior = require('../../assets/behavior')
import { preventDoubleClick } from '../../../utils/util'
Page({
  handleClick: preventDoubleClick(),
  behaviors: [commonBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    title: '家庭成员',
    homegroupId: '',
    memberList: [],
    roleId: '',
    selectedUid: '',
    selecteduserId: '',
    selectedRoleId: '',
    roleNameList: {
      1001: '创建者',
      1002: '管理员',
      1003: '成员',
    },
    actionShow: false,
    actions: [],
    deleteDialogShow: false,
    publicColor: PUBLIC,
    errorColor: ERROR,
    plate: plate,
  },

  //获取权限弹窗文案
  getActionList(currentRoId, selectRoleId) {
    let actions = []
    if (currentRoId == 1001) {
      if (selectRoleId == 1002) {
        actions = [
          { name: '取消管理员', operate: 2 },
          { name: '移除该成员', operate: 3 },
        ]
      } else if (selectRoleId == 1003) {
        actions = [
          { name: '设为管理员', subname: '(可以对成员、设备和家庭信息进行管理)', operate: 1 },
          { name: '移除该成员', operate: 3 },
        ]
      }
    } else if (currentRoId == 1002) {
      if (selectRoleId == 1003) {
        actions = [{ name: '移除该成员', operate: 3 }]
      }
    }
    this.setData({
      actions: actions,
    })
  },
  //展示操作弹窗
  showMemberAction(e) {
    console.log(e)
    let { roleid, uid, userid } = e.currentTarget.dataset
    this.getActionList(this.data.roleId, roleid)
    if (this.data.roleId >= roleid) return
    this.setData({
      actionShow: true,
      selectedUid: uid,
      selectedRoleId: roleid,
      selecteduserId: userid,
    })
  },
  toggleActionSheet() {
    this.setData({
      actionShow: false,
    })
  },
  actionSelected(e) {
    let { operate } = e.detail
    //删除
    if (operate == 1 || operate == 2) {
      this.setRole(operate)
    } else if (operate == 3) {
      this.setData({
        deleteDialogShow: true,
      })
    }
  },
  //设置管理员或者取消管理员
  setRole(operate) {
    let roleTag
    operate == 1 ? (roleTag = '1002') : (roleTag = '1003')
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
      homegroupId: Number(this.data.homegroupId),
      memberUserId: Number(this.data.selecteduserId),
      roleTag: Number(roleTag),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('setRole', reqData)
        .then((resp) => {
          resolve(resp)
          this.homeMemberGet()
          wx.showToast({
            title: '设置成功',
            icon: 'none',
          })
        })
        .catch((error) => {
          reject(error)
          wx.showToast({
            title: '设置失败',
            icon: 'none',
          })
        })
    })
  },
  //删除
  deleteConfirm() {
    this.deleteMember()
      .then((res) => {
        console.log(res, '删除成员成功')
        wx.showToast({
          title: '移除成功',
          icon: 'none',
        })
        this.homeMemberGet()
      })
      .catch((err) => {
        wx.showToast({
          title: '移除失败',
          icon: 'none',
        })
        console.log(err, '删除成员失败')
      })
  },
  deleteCancle() {},
  //删除成员
  deleteMember() {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
      homegroupId: this.data.homegroupId,
      removeUid: this.data.selectedUid,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('deleteMember', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  homeMemberGet() {
    let reqData = {
      homegroupId: this.data.homegroupId,
      reqId: getReqId(),
      stamp: getStamp(),
      uid: app.globalData.userData.uid,
    }
    requestService
      .request('homeMemberGet', reqData)
      .then((res) => {
        this.setData({
          memberList: res.data.data.list,
        })
      })
      .catch((err) => {
        console.log(err, 'err')
        wx.showToast({
          title: '获取家庭成员失败',
          icon: 'none',
        })
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
  inviteMembersNew() {
    burialPoint.clickInvitePoint({
      page_id: 'page_family_Memberlist',
      page_name: '成员列表页',
    })
    if (this.data.memberList.length >= 20) {
      wx.showToast({
        title: '您的家庭成员已经达到20个上限，无法继续新增',
        icon: 'none',
      })
      return
    }
    const { homeDetail, homegroupId } = this.data
    this.gotoInvite(homeDetail, homegroupId)
  },
  inviteMembers() {
    if (this.handleClick()) {
      this.inviteMembersNew()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      homeDetail: JSON.parse(decodeURIComponent(options.homedetail)),
      homegroupId: options.homegroupId,
      // memberList: JSON.parse(options.memberList),
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
    this.homeMemberGet()
    burialPoint.pagefamilyMemberListBurialPoint()
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
