const app = getApp() //获取应用实例
import { requestService, uploadFileTask } from '../../utils/requestService'
import { webView } from '../../utils/paths'
import Dialog from 'm-ui/mx-dialog/dialog'
import { setIsAutoLogin, clearStorageSync } from '../../utils/redis.js'
import { showToast } from '../../utils/util.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cellList: [
      {
        id: 2,
        title: '允许App访问您的位置信息',
        _checkType: 0,
        _status: false,
        _authName: 'scope.userLocation',
        _apiName: 'getLocation',
        _checkName: 'locationAuthorized',
        rightText: '',
        desc: '获取您当前的位置信息，不会追踪您的行踪轨迹，用于设备配网，设置家庭地址等',
      },
      {
        id: 3,
        title: '允许App访问您的蓝牙权限',
        _checkType: 0,
        _status: false,
        _authName: 'scope.bluetooth',
        _apiName: 'openBluetoothAdapter',
        _checkName: 'bluetoothAuthorized',
        _closeApiName: 'closeBluetoothAdapter',
        rightText: '',
        desc: '获用于语音控制设备，带语音功能的家电进行通话',
      },
      {
        id: 4,
        title: '撤回隐私协议授权',
        _checkType: 1,
        _status: 0,
        _authName: '',
        rightText: '',
        desc: '撤回隐私协议授权后，将自动退出登录，且无法使用美的美居App所有功能',
      },
    ],
  },
  jumpTargetPath(event) {
    let clickItemInfo = event.currentTarget.dataset.item
    console.log(`authorizeName clickItemInfo=${JSON.stringify(clickItemInfo)}`)
    if (clickItemInfo._checkType == 0) {
      // wx.openAppAuthorizeSetting()
      if (!clickItemInfo._status) {
        wx[clickItemInfo._apiName]({
          complete: (res) => {
            this.getSystemAuth()
            if (clickItemInfo._closeApiName) {
              wx[clickItemInfo._closeApiName]()
            }
            console.log(`authorizeName: ${clickItemInfo._apiName},resutl =${JSON.stringify(res)}`)
            wx.openAppAuthorizeSetting()
          },
        })
      } else {
        wx.openAppAuthorizeSetting()
      }
    } else {
      this.withdrawPrivacyAuth()
    }
  },
  //撤销隐私协议
  withdrawPrivacyAuth() {
    if (app.globalData.isLogon) {
      const context = this
      Dialog.confirm({
        zIndex: 10001,
        context: this,
        title: '撤回隐私协议授权将自动退出登录，确定要撤回吗？',
      })
        .then((res) => {
          context.changeWithdrowModal(res)
        })
        .catch((error) => {
          context.changeWithdrowModal(error)
        })
    } else {
      let data = {
        action: 'confirm',
      }
      this.changeWithdrowModal(data)
    }
  },
  backPage() {
    wx.navigateBack()
  },
  getNetworkType() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        },
      })
    })
  },
  // 撤销授权协议
  changeWithdrowModal(e) {
    const action = e.action
    if (action === 'confirm') {
      wx.showLoading({
        mask: true,
        title: '加载中',
      })
      setTimeout(() => {
        this.cancelAgreeAgreement()
      }, 1000)
    }
    if (action === 'cancel') {
    }
  },
  // 撤回授权协议接口请求
  cancelAgreeAgreement() {
    requestService
      .request('cancelAgreeAgreement', {
        mobile: app.globalData.phoneNumber,
      })
      .then((res) => {
        const data = res && res.data
        if (data && +data.code === 0) {
          this.logout()
          wx.hideLoading()
          try {
            ft.clearAppCache()
            ft.restartApp()
          } catch (e) {}
        } else {
          showToast('撤回失败，请稍后重试')
        }
      })
      .catch((e) => {
        console.log(e, 'cancelAgreeAgreement')
        wx.hideLoading()
        this.getNetworkType().then((res) => {
          const networkType = res.networkType
          if (networkType === 'none') {
            showToast('网络异常，请稍后再试')
          } else {
            showToast('撤回失败，请稍后重试')
          }
        })
      })
  },
  // 退出登录
  logout() {
    getApp().globalData.isLogon = false
    clearStorageSync()
    setIsAutoLogin(false)
  },
  getSystemAuth() {
    const authList = wx.getAppAuthorizeSetting()
    console.log(`授权结果查询：${JSON.stringify(authList)}`)
    console.log()
    let cellList = this.data.cellList
    cellList.forEach((ele) => {
      if (ele._checkType != 1) {
        let authStatus =
          typeof authList[ele._checkName] != 'undefined' ? authList[ele._checkName] == 'authorized' : false
        ele._status = authStatus
        ele.rightText = authStatus ? '已允许' : '去设置'
      }
    })
    this.setData({
      cellList: cellList,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getSystemAuth()
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
})
