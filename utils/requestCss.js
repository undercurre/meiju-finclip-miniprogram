/**
 * css接口request
 */
import url from "../api/main/css-api"
const app = getApp()
export default function requestCss({ urlKey, data = {}, method = 'POST', contentType = 'application/json', allRes = false }) {
  return new Promise((resolve, reject) => {
    if (!app.globalData.cssToken) reject({ msg: 'cssToken缺失,停止request', url: url[urlKey] })
    wx.request({
      url: url[urlKey],
      method,
      data,
      header: {
        "content-type": contentType,
        authorization: app.globalData.cssToken
      },
      success: res => {
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          allRes ? resolve(res) : resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}