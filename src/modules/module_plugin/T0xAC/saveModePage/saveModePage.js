// plugin/T0xAC/saveModePage.js
let app = getApp()
const requestService = app.getGlobalConfig().requestService
import { cloudDecrypt } from 'm-utilsdk/index';
import selfApi from '../api/api'
// let key = app.globalData.userData.key
let appKey = app.getGlobalConfig().appKey
Page({
  /**
   * 页面的初始数据
   */
  data: {
    safeModeSwitch: false,
    showPswSet: false,
    password: '',
    sn: '',
    mac: '',
    oldtime:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let infos = JSON.parse(decodeURIComponent(options.deviceInfo))
    let deviceSnBle = options.deviceSnBle
    let sn = ''
    // console.log(infos, infos.sn, infos.sn.length)
    // if (options.ctrlType == 1) {
    //   if (infos.sn.length == 32) {
    //     sn = infos.sn
    //   } else {
    //     sn = deviceSnBle
    //   }
    // } else {
    sn = cloudDecrypt(infos.sn, app.globalData.userData.key, appKey)
    // }
    // let sn = options.ctrlType == 1 ? deviceSnBle : cloudDecrypt(infos.sn,key,appKey)
    // console.log(deviceSnBle,infos);
    let openId6 = wx.getStorageSync('openId6')
    this.setData({
      deviceInfo: infos,
      deviceSn: sn,
      mac: infos.btMac,
      openId6: openId6,
      ctrlType: options.ctrlType,
    })

    console.log(this.data.deviceInfo, openId6)
    this.getSafeModeInfo()

    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],
    })
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

  onPswSwitch(e) {
    let flag = e.detail
    if (flag) {
      this.setData({
        showPswSet: true,
        open: flag,
        password: '',
      })
    } else {
      this.confirmPsw()
    }

    // this.setData({
    //   safeModeSwitch: e.detail
    // })
    console.log(e)
  },
  onClose() {
    this.setData({
      safeModeSwitch: false,
    })
  },
  cancelPsw() {
    this.setData({
      showPswSet: false,
    })
  },
  confirmPsw() {
    if (this.preventclick(800)) {
      console.log(this.data.password)
      let that = this
      if ((that.data.password.length == '' || that.data.password.length < 6) && !that.data.safeModeSwitch) {
        wx.showToast({
          title: '请输入六位密码',
          icon: 'none',
        })
        return
      }
      if (!that.data.deviceSn) {
        wx.showToast({
          title: '获取sn码异常',
          icon: 'none',
        })
      }
      let param = {
        mac: that.data.mac,
        open: !that.data.safeModeSwitch ? 1 : 0,
        sn: that.data.deviceSn,
        openId6: that.data.openId6,
        passwd: that.data.password,
        snLast4: that.data.deviceSn.slice(24,28)
      }
      wx.showLoading({
        title: '设置中...',
      })
      requestService
        .request(selfApi.safeModeSet, param, 'POST')
        .then((res) => {
          console.log('安全模式设置', res.data, res.data.data.result)
          if (res.data.data.errCode == 0) {
            // console.log('安全模式查询', res.data.data.result);
            wx.hideLoading({
              success: (res) => {},
            })
            that.setData({
              showPswSet: false,
            })
            setTimeout(() => {
              wx.showToast({
                title: res.data.data.result.msg,
                icon: 'none',
              })
            }, 800)
          } else {
            setTimeout(() => {
              wx.showToast({
                title: res.data.data.errMsg,
                icon: 'none',
              })
            }, 200)
          }
          that.getSafeModeInfo()
        })
        .catch((err) => {
          console.log('安全模式查询', err)
        })
      console.log(JSON.stringify(param))
    }
  },
  getSafeModeInfo() {
    let that = this
    let data = {
      mac: this.data.mac,
      sn: that.data.deviceSn,
    }
    console.log('安全模式查询param', data)
    requestService
      .request(selfApi.safeModeQuery, data, 'POST')
      .then((res) => {
        console.log('安全模式查询', res.data)
        if (res.data.errCode == 0) {
          // console.log('安全模式查询', res.data.data.result);
          that.setData({
            safeModeSwitch: res.data.result.open == 1,
          })
        } else {
          console.log(res.data.errCode)
        }
        // wx.hideLoading()
      })
      .catch((err) => {
        console.log('安全模式查询', err)
      })
  },
  goScanQr() {
    let that = this
    wx.scanCode({
      complete(res) {
        console.log(res)
        if (res.errMsg == 'scanCode:fail cancel') {
          wx.showToast({
            icon: 'none',
            title: '您已取消扫码',
            duration: 3000,
          })
          return
        }
        let validCode = false
        if (res.result && res.result.indexOf('sn=') > -1) {
          let sn = res.result.substring(res.result.indexOf('sn=') + 3)
          let selfSn = that.data.deviceSn
          let sn_28 = selfSn.slice(0, 28);
          console.log(sn, selfSn)

          if (sn.length == 28 && sn_28 == sn) {
            validCode = true
            // 有效的sn就进行clear操作
            let param = {
              sn: that.data.deviceSn,
              mac: that.data.mac,
              openId6: that.data.openId6,
              uid: app.globalData.userData.uid,
              homegroupId: that.data.deviceInfo.homegroupId,
              roomId: that.data.deviceInfo.roomId,
            }
            requestService
              .request(selfApi.safeModeClear, param, 'POST')
              .then((res) => {
                console.log('安全模式清除', res.data)
                if (res.data.errCode == 0) {
                  let btMac = that.data.mac ? that.data.mac.replace(/:/g, '') : ''
                  let remoteDeviceList = wx.getStorageSync('remoteDeviceList') ?
                    wx.getStorageSync('remoteDeviceList') :
                    []
                  remoteDeviceList = remoteDeviceList.filter((item) => item.btMac != btMac)
                  wx.setStorageSync('remoteDeviceList', remoteDeviceList)
                  app.addDeviceInfo.mode = '' //置空模式
                  wx.showModal({
                    title: '提示',
                    content: that.data.ctrlType == 1 ? '密码已解除，请重新搜索连接空调' : '密码已解除，请及时点击上方开关重设密码',
                    showCancel: false,
                    confirmText: '好的',
                    success(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        if (that.data.ctrlType == 1) {
                          wx.reLaunch({
                            url: '/pages/index/index', // 清除设备之后relaunch设备列表页
                          })
                        }
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    },
                  })
                } else {
                  console.log(res.data.errCode == 0)
                }
                that.getSafeModeInfo()
              })
              .catch((err) => {
                console.log(err)
              })
          } else if (selfSn != sn) {
            validCode = true
            wx.showToast({
              icon: 'none',
              title: '非本机二维码，请重新扫码',
              duration: 3000,
            })
          }
        }
        if (!validCode) {
          wx.showToast({
            icon: 'none',
            title: '二维码无效',
            duration: 3000,
          })
        }
      },
    })
  },
  preventclick(msc) {
    if (this.data.oldtime == "") {
      this.data.oldtime = new Date().getTime();
      return true;
    } else {
      var newtime = new Date().getTime();
      if (newtime - this.data.oldtime > msc) {
        this.data.oldtime = new Date().getTime();
        return true;
      } else {
        return false;
      }
    }
  },
})
