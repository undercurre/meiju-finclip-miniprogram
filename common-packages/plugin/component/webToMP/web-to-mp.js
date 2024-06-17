// plugin/T0xB6/testBack/test-back.js
let isShow = false
Page({
  onShow: function () {
    let list = getCurrentPages()
    let options = list[list.length - 1].options
    console.log('test back', options)
    // let { options } = this.data
    wx.navigateToMiniProgram({
      appId: options.appId,
      path: options.url ? decodeURIComponent(options.url) : '',
      // path: options.url ? options.url : '',
      envVersion: 'release', //develop/trial/release
      success() {
        if (isShow) return
        isShow = true
        setTimeout(() => {
          wx.showModal({
            content: '跳转结束',
            showCancel: false,
            success: function () {
              isShow = false
              wx.navigateBack({
                delta: 1,
              })
            },
          })
        }, 700)
      },
      fail() {
        if (isShow) return
        isShow = true
        setTimeout(() => {
          wx.showModal({
            content: '跳转失败',
            showCancel: false,
            success: function () {
              isShow = false
              wx.navigateBack({
                delta: 1,
              })
            },
          })
        }, 700)
      },
    })
  },
})
