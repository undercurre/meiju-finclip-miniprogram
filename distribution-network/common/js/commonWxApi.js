export const wxGetSystemInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success (res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}
export const wxGetOpenSetting = () => {
  return new Promise(resolve => {
    wx.openSetting({
      success (res) {
        resolve(res)
      }
    })
  })
}
export const wxGetSetting = () => {
  return new Promise(resolve => {
    wx.getSetting({
      success (res) {
        console.log(res.authSetting)
        resolve(res.authSetting)
      }
    })
  })
}
export const wxAuthorize = (attr) => {
  return new Promise(resolve => {
    wx.authorize({
      scope: `scope.${attr}`,
      success (res) {
        resolve(res)
      }
    })
  })
}