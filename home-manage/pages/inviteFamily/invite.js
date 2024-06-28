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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      homegroupId: options.homegroupid,
      homeItem: JSON.parse(options.homeItem),
      // roleId: options.roleId,
    })
    this.getMemberQrcode(options.homegroupid)
    this.receiveSocketData()
  },
  //接收推送
  receiveSocketData() {
    receiveSocketMessage('', (message) => {
      if (message.data) {
        let pushData = JSON.parse(message.data)
        console.log('websocket onReceivedMsg invite.js推送测试收到服务器内容message==>', pushData.data)
        console.log('websocket onReceivedMsg invite.js推送测试收到服务器内容message==>', pushData.data.current)
      }
    })
  },
  //返回
  onClickLeft() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({
        delta: 1,
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
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
        // this.setData({
        //渲染图形验证吗
        // codeUrl: res.data.data.codeUrl,
        // })
      })
      .catch((error) => {
        wx.hideLoading()
        Toast({ context: this, position: 'bottom', message: error.data.data.msg })
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
  onShareAppMessage() {},
})
