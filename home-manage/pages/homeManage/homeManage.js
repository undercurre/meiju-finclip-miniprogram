// pages/homeManage/homeManage.js
const app = getApp() //获取应用实例
import { requestService } from '../../../utils/requestService'
import { getReqId, getStamp, validateFun } from 'm-utilsdk/index'
import { baseImgApi } from '../../../api'
import burialPoint from '../../assets/burialPoint'
import { plateName } from '../../../plate'
import { PUBLIC, ERROR } from '../../../color'
const commonBehavior = require('../../assets/behavior')
import { homeDetail } from '../../../utils/paths.js'
// const roomIco = '/assets/img/index/room.png'
// const equipmentIco = '/assets/img/index/device.png'
// const parentIco = '/assets/img/index/member.png'
Page({
  behaviors: [commonBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    title: '家庭管理',
    homeList: [],
    roomIco: baseImgApi.url + 'home-manage/family_ic_home@3x.png',
    equipmentIco: baseImgApi.url + 'home-manage/family_ic_shebei@3x.png',
    parentIco: baseImgApi.url + 'home-manage/family_ic_people@3x.png',
    uid: '',
    bottomDesFixed: false,
    showBottomDes: false,
    dialogShow: false,
    autoFocus: false, //自动聚焦
    errorMessage: '',
    // tipsShow: false,
    // tips: '',
    familyValue: '',
    ownHomeNum: null,
    publicColor: PUBLIC,
    errorColor: ERROR,
    creatList: [],
    inviteList: [],
  },
  // 获取数据-家庭列表和邀请码
  getInitData() {
    this.getHomeGrouplistService().then((data) => {
      if (data) {
        this.getContentHeight()
      }
    })
  },
  //获取家庭列表
  getHomeGrouplistService() {
    let reqData = {
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('homeList', reqData)
        .then((resp) => {
          console.log('获取家庭列表', resp)
          if (resp.data.code == 0) {
            app.globalData.homeGrounpList = resp.data.data.homeList
            let creatList = resp.data.data.homeList.filter((item) => {
              return item.roleId == '1001'
            })
            let inviteList = resp.data.data.homeList.filter((item) => {
              return item.roleId !== '1001'
            })
            this.setData({
              homeList: resp.data.data.homeList,
              creatList,
              inviteList,
            })
            this.calcOwnHomeNum()
            resolve(resp.data.data.homeList)
          } else {
            wx.showToast({
              title: '获取家庭失败',
              icon: 'none',
            })
            reject(resp)
          }
        })
        .catch((error) => {
          wx.showToast({
            title: '获取家庭失败',
            icon: 'none',
          })
          reject(error)
        })
    })
  },
  // 获取邀请码
  getInvitationCode(homeGroupId) {
    return new Promise((resolve, reject) => {
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        homegroupId: homeGroupId || this.data.homeOwnerGroupId || '',
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

  //点击输入区域
  clickInput() {
    //暂时去掉
    // burialPoint.inputclickbthCreatingFamilyBurialPoint()
  },
  //输入内容
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
  //点击创建家庭
  clickCreateBtn() {
    //点击新建家庭
    burialPoint.clickbthCreatingFamilyBurialPoint()
    if (this.data.homeList.length >= 20) {
      wx.showToast({
        title: '您的家庭数量达到20个上限，无法继续新增',
        icon: 'none',
      })
    } else {
      if (this.data.ownHomeNum >= 10) {
        wx.showToast({
          title: '您创建的家庭已经达到10个上限，无法继续新增',
          icon: 'none',
        })
      } else {
        this.setData({
          dialogShow: true,
        })
        setTimeout(() => {
          this.setData({
            autoFocus: true,
          })
        }, 200)
        //新建家庭浏览
        burialPoint.CreateFamilyDialogBurialPoint()
      }
    }
  },
  //取消
  onCancel() {
    //取消新建家庭
    burialPoint.cancelclickbthCreatingFamilyBurialPoint()
    this.setData({
      errorMessage: '',
      familyValue: '',
      dialogShow: false,
      autoFocus: false,
    })
  },
  //验证
  validtaFunc(val) {
    var validator = new validateFun()
    validator.add(val, [{ ruleName: 'isNonEmpty', errorMsg: '家庭名称不能为空' }])
    var errorMsg = validator.start()
    return errorMsg
  },
  //确定
  confirm() {
    burialPoint.confirmclickbthCreatingFamilyBurialPoint()
    const errorMsg = this.validtaFunc(this.data.familyValue)
    if (errorMsg) {
      this.setData({
        errorMessage: errorMsg,
      })
      return
    }
    this.addFamily()
      .then((res) => {
        app.globalData.ifRefreshHomeList = true
        console.log(res, '创建家庭成功')
        this.setData({
          dialogShow: false,
          autoFocus: false,
        })
        this.getHomeGrouplistService()
          .then((res) => {
            app.globalData.homeGrounpList = res
            console.log(this.data.familyValue, res)
            let target = res.filter((item) => {
              return item.name === this.data.familyValue
            })
            this.calcOwnHomeNum()
            this.setData({
              familyValue: '',
            })
            let homeitem = JSON.stringify(target[0])
            //新建完家庭后跳转至该家庭详情页面
            wx.navigateTo({
              url: `${homeDetail}?homegroupId=${target[0].homegroupId}&name=${target[0].name}&roleId=${target[0].roleId}&ownHomeNum=${this.data.ownHomeNum}&homeitem=${homeitem}`,
            })
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        if (err.data.code === 1210) {
          wx.showToast({
            title: '家庭名称重复',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: '添加家庭失败',
            icon: 'none',
          })
        }
      })
  },
  addFamily() {
    let reqData = {
      uid: app.globalData.userData.uid,
      name: this.data.familyValue,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('addFamily', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  //点击邀请按钮
  clickInviteBtn(e) {
    console.log(e)
    let { homegroupid, homeitem } = e.currentTarget.dataset
    this.gotoInvite(homeitem, homegroupid)
    //burialPoint.clickInvitePoint()
  },
  // 获取列表内容高度
  getContentHeight() {
    console.log('getContentHeight')
    let that = this
    // setTimeout(function () {
    let query = wx.createSelectorQuery()
    query
      .select('.content')
      .boundingClientRect((rect) => {
        let contentHeight = rect.height
        console.log('contentHeight', contentHeight)
        let compareHeight = app.globalData.screenHeight - app.globalData.statusNavBarHeight
        that.compareHeight(contentHeight, compareHeight)
      })
      .exec()
    // }, 500)
  },
  //比较列表内容高度与屏幕高度（需减去导航栏高度）
  compareHeight(contentHeight, compareHeight) {
    this.setData({
      bottomDesFixed: contentHeight < compareHeight ? true : false,
      showBottomDes: true,
    })
    console.log('contentHeight===', contentHeight, typeof contentHeight)
    console.log('compareHeight===', compareHeight, typeof compareHeight)
    console.log(contentHeight < compareHeight)
    console.log('bottomDesFixed===', this.data.bottomDesFixed)
  },
  calcOwnHomeNum() {
    console.log(this.data.homeList)
    let filterArr = this.data.homeList.filter((item) => {
      return item.createUserUid === app.globalData.userData.uid
    })
    this.setData({
      ownHomeNum: filterArr.length,
    })
  },
  goToDetail(e) {
    let { name, homegroupid, roleid, ownhomenum, homeitem } = e.currentTarget.dataset
    homeitem = JSON.stringify(homeitem)
    burialPoint.clickbthFamilyDetailBurialPoint()
    wx.navigateTo({
      url: `${homeDetail}?homegroupId=${homegroupid}&name=${name}&roleId=${roleid}&ownHomeNum=${ownhomenum}&homeitem=${homeitem}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // console.log('app.globalData.userData.uid', app.globalData.userData.uid)
    console.log(app.globalData.statusNavBarHeight, app.globalData.screenHeight)
    this.setData({
      uid: app.globalData.userData.uid,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInitData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.setData({
    //   bottomDesFixed: false
    // })
  },

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
  async onShareAppMessage(res) {
    var tempTitle = `欢迎使用${plateName}`
    var tempPath = '/pages/index/index'
    var tempImageUrl = '/assets/img/img_wechat_chat01@3x.png'
    const homegroupid = res?.target?.dataset?.homegroupid
    console.log('不同分享', res)
    if (res.from == 'button') {
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
