/*
 * @desc: 二维码邀请页面
 * @author: zhucc22
 * @Date: 2024-06-25 09:56:25
 */
//const inviteIcon = '/assets/img/index/invite.png'
import { service } from 'assets/service'
import Toast from 'm-ui/mx-toast/toast'
import drawQrcode from '../../../utils/weapp.qrcode.min.js'
import { receiveSocketMessage } from '../../../utils/initWebsocket.js'
import { imgBaseUrl } from '../../../api'
const inviteIcon = imgBaseUrl.url + '/harmonyos/index/invite.png'
import { index } from '../../../utils/paths.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    homeItem: {},
    homegroupId: '',
    inviteIcon,
    title: '',
    codeUrl: '',
    timer: null,
    resferTime: 5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      homegroupId: options.homegroupid,
      homeItem: JSON.parse(decodeURIComponent(options.homeItem)),
      // roleId: options.roleId,
    })
    this.getMemberQrcode(options.homegroupid)
    //this.receiveSocketData()
  },
  //接收推送
  receiveSocketData() {
    //待云端梳理推送
    receiveSocketMessage('', (message) => {
      if (message.data) {
        let pushData = JSON.parse(message.data)
        console.log('websocket onReceivedMsg invite.js推送测试收到服务器内容message==>', pushData.data)
        console.log('websocket onReceivedMsg invite.js推送测试收到服务器内容message==>', pushData.data.current)
      }
    })
  },
  //验证码倒计时
  setTime(time) {
    //let that = this
    if (this.data.timer) clearTimeout(this.data.timer)
    this.data.timer = setTimeout(() => {
      if (time > 1) {
        time--
        this.setData({
          resferTime: time,
        })
        // 迭代调用
        this.setTime(time)
      } else {
        // 倒计时结束重新刷新
        this.getMemberQrcode(this.data.homegroupId)
      }
    }, 60000)
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

  //发送二维码请求
  getMemberQrcode(homegroupId) {
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 10000 })
    service
      .memberQrcode(homegroupId)
      .then((res) => {
        wx.hideLoading()
        this.drawImgQrcode(res.data.data.codeUrl)
        this.setData({
          resferTime: 5,
        })
        this.setTime(5)
        // this.setData({
        //渲染图形验证吗
        // codeUrl: res.data.data.codeUrl,
        // })
      })
      .catch((error) => {
        wx.hideLoading()
        if (error.data.code == '1202' || error.data.code == '1203') {
          Toast({ context: this, position: 'bottom', message: '已失效' })
        } else {
          if (!getApp().globalData.noNetwork) {
            Toast({ context: this, position: 'bottom', message: error.data.msg })
          }
        }
        console.log(error)
      })
  },
  //刷新二维码
  refreshCode() {
    this.getMemberQrcode(this.data.homegroupId)
  },
  //生成二维码
  drawImgQrcode(codeUrl) {
    console.log(codeUrl)
    drawQrcode({
      width: 170,
      height: 170,
      canvasId: 'myQrcode',
      text: codeUrl,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    if (this.data.timer) clearTimeout(this.data.timer)
  },

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
  onShareAppMessage() {},
})
