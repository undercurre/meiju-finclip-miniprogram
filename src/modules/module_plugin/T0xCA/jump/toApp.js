// plugin/T0xCA/jump/toApp.js
const app = getApp()
import netService from '../service/NetService'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconServiceUrl: netService.getIconServiceUrl(),
    pageTop: 0, 
    devWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({pageTop: app.globalData.statusNavBarHeight, devWidth: wx.getSystemInfoSync().windowWidth, pageTop: app.globalData.statusNavBarHeight});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  authPhotoAlbum: function() {
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
              that.saveImg();
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '若点击不授权，将无法使用保存图片功能',
                cancelText: '不授权',
                cancelColor: '#999',
                confirmText: '授权',
                confirmColor: '#f94218',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        console.log(res.authSetting);
                      },
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消');
                  }
                },
              })
            },
          })
        } else {
          that.saveImg();
        }
      },
    })
  },
    /**
   * 保存图片到相册
   */
  saveImg: function() {
    wx.showNavigationBarLoading()
    wx.getImageInfo({
      src: '../../../pages/download/assets/img/appstore@3x.png',
      success: function (res) {
        console.log(res.path)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          fail() {
            wx.showModal({
              title: '无法保存',
              content: '请在iPhone的“设置-隐私-照片”选项中，允许微信访问你的照片',
              showCancel: false,
              confirmText: '好',
              success(res) {
                if (res.confirm) {
                  // 保存图片到相册
                }
              },
            })
          },
          success(result) {
            console.log(result)
            wx.hideNavigationBarLoading()
            wx.showToast({
              title: '保存图片成功',
            })
          },
        })
      },
      fail: function () {
        wx.hideNavigationBarLoading();
        console.log('fail getImageInfo');
      },
    })
  }

})