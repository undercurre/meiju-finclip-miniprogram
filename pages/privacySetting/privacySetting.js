const app = getApp() //获取应用实例
import { requestService, uploadFileTask } from '../../utils/requestService'
import {webView} from '../../utils/paths'

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
        wx.openSetting()
    }else{

    }
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
