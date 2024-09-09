// change-room/pages/changeRoom/changeRoom.js
const app = getApp()
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { getReqId, getStamp, validateFun } from 'm-utilsdk/index'
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
    dialogShow: false,
    autoFocus: false, //自动聚焦
    ownHomeNum: null,
    familyValue: '',
    errorMessage: '',
    errorColor: '#FF8225',
    roomDialogShow: false, //新建房间弹窗
    roomName: '', //新建房间名称
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
  },
  //返回
  onClickLeft() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({
        url: '/pages/index/index',
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
          wx.showToast({
            title: '移动设备成功',
            icon: 'none',
          })
          wx.hideLoading()
          if (resp.data.code === 0) {
            wx.navigateBack()
          }
          resolve(resp)
        })
        .catch((error) => {
          let msg = error.data.code == 1202 ? '只有家庭创建者才允许操作' : '移动设备失败'
          wx.hideLoading()
          wx.showToast({
            title: msg,
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
        let msg = error.data.code == 1202 ? '只有家庭创建者才允许操作' : '移动设备失败'
        wx.showToast({
          title: msg,
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

  //显示添加房间按钮
  showAddDialog() {
    //点击房间弹窗
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
    setTimeout(() => {
      this.setData({
        autoFocus: true,
      })
    }, 200)
    // 埋点
  },
  //取消添加房间
  cancleEdit() {
    //取消保存弹窗
    this.setData({
      roomName: '',
      roomDialogShow: false,
      autoFocus: false,
      errorMessage: '',
    })
  },

  //确认添加房间
  confirmEdit() {
    //取消保存弹窗
    const errorMsg = this.validtaRoomFunc(this.data.roomName)
    if (errorMsg) {
      this.setData({
        errorMessage: errorMsg,
      })
      return
    }
    this.addRoom()
      .then((res) => {
        wx.showToast({
          title: '新建房间成功',
          icon: 'none',
        })
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
  //房间输入校验
  validtaRoomFunc(val) {
    var validator = new validateFun()
    validator.add(val, [
      { ruleName: 'isNonEmpty', errorMsg: '房间名称不能为空' },
      { ruleName: 'isValidInput', errorMsg: '房间名称仅支持中文、英文、数字' },
    ])
    var errorMsg = validator.start()
    return errorMsg
  },
  //输入房间名称
  onChangeRoom(e) {
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
  //添加房间
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
  //点击创建家庭
  clickCreateBtn() {
    //点击新建家庭
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
      }
    }
  },
  //计算自己创建的家庭
  calcOwnHomeNum() {
    console.log(this.data.homeList)
    let filterArr = this.data.homeList.filter((item) => {
      return item.createUserUid === app.globalData.userData.uid
    })
    this.setData({
      ownHomeNum: filterArr.length,
    })
  },
  //添加家庭
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
  //校验输入框
  validtaFunc(val) {
    var validator = new validateFun()
    validator.add(val, [{ ruleName: 'isNonEmpty', errorMsg: '房间名称不能为空' }])
    var errorMsg = validator.start()
    return errorMsg
  },
  //取消
  onCancel() {
    //取消新建家庭
    this.setData({
      errorMessage: '',
      familyValue: '',
      dialogShow: false,
      autoFocus: false,
    })
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
  //确定添加
  confirm() {
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
            this.setData({
              familyValue: '',
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
            let actions = getApp().globalData.homeGrounpList.filter((item) => {
              return item.roleId == '1001'
            })
            this.setData({
              homeList: resp.data.data.homeList,
              actions,
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
    this.getHomeGrouplistService()
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
