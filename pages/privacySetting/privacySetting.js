const app = getApp() //获取应用实例
import { requestService, uploadFileTask } from '../../utils/requestService'
import {webView} from '../../utils/paths'
import Dialog from 'm-ui/mx-dialog/dialog';
import { setIsAutoLogin, clearStorageSync } from '../../utils/redis.js'
import { showToast } from '../../utils/util.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cellList: [
        {
            id: 1,
            title: '允许App访问您的相机权限',
            _checkType: 0,
            _status: 0,
            _authName: 'scope.camera',
            rightText: '',
            desc: '用于扫码设备二维码进行设备配网功能，更改头像等'
        },
        {
            id: 2,
            title: '允许App访问您的位置信息',
            _checkType: 0,
            _status: 0,
            _authName: 'scope.userLocation',
            rightText: '',
            desc: '获取您当前的位置信息，不会追踪您的行踪轨迹，用于设备配网，设置家庭地址等'
        },
        {
            id: 3,
            title: '允许App访问您的语音权限',
            _checkType: 0,
            _status: 0,
            _authName: 'scope.record',
            rightText: '',
            desc: '获用于语音控制设备，带语音功能的家电进行通话'
        },
        {
            title: '允许App访问您的日历',
            _checkType: 0,
            _status: 0,
            _authName: 'scope.addPhoneCalendar',
            rightText: '',
            desc: '在日历内添加提醒，用于提供衣服晾晒等预约类型功能，为您提供提醒服务'
        },
        {
            id: 4,
            title: '撤回隐私协议授权',
            _checkType: 1,
            _status: 0,
            _authName: '',
            rightText: '',
            desc: '撤回隐私协议授权后，将自动退出登录，且无法使用美的美居App所有功能'
        }
    ]
  },
  jumpTargetPath(event) {
    let clickItemInfo = event.currentTarget.dataset.item
    console.log(clickItemInfo)
    if(clickItemInfo._checkType == 0){
        // wx.openAppAuthorizeSetting()
        wx.authorize({
            scope: clickItemInfo._authName,
            success: res => {
                this.getSystemAuth()
            },
            complete: res => {
                console.log(`authorize result: ${JSON.stringify(res)}`)
                wx.openAppAuthorizeSetting()
            }
        })
    }else{
        this.withdrawPrivacyAuth()
    }
  },
  withdrawPrivacyAuth() {
    const context = this
    Dialog.confirm({
      zIndex: 10001,
      context: this,
      message: '撤回隐私协议授权将自动退出登录，确定要撤回吗？',
    })
      .then((res) => {
        context.changeWithdrowModal(res)
      })
      .catch((error) => {
        context.changeWithdrowModal(error)
      })
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
                wx.navigateTo({
                url: '/pages/login/login',
                })
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
    wx.getSetting({
        success: res => {
            console.log(`授权结果查询：${JSON.stringify(res.authSetting)}`)
            let authSetting = res.authSetting
            let cellList = this.data.cellList
            cellList.forEach(ele => {
                if(ele._checkType != 1){
                    let authStatus = typeof authSetting[ele._authName] != 'undefined' ? authSetting[ele._authName] : false
                    ele._status = authStatus
                    ele.rightText = authStatus ? '已允许' : '去设置'
                }
            })
            this.setData({
                cellList: cellList
            })
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    
  },

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
