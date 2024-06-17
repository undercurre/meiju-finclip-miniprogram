/*
 * @Description: 用户权益接口
 * @Author: 朱承财
 * @Date: 2022-04-15 15:57:54
 * @LastEditTime: 2022-04-24 18:04:08
 */
import { requestService } from '../../../../utils/requestService'
import { api } from '../../../../api'
const app = getApp()
const service = {
  // 默认地址
  getDefaultAddress() {
    let data = {
      headParams: {},
      restParams: {
        mobile: app.globalData.userData.userInfo.mobile,
        sourceSys: 'IOT',
      },
    }
    return new Promise((resolve, reject) => {
      requestService.request('getDefaultAddress', data).then(
        (resp) => {
          if (resp && resp.data && resp.data.code == 0) {
            resolve(resp.data.data)
          } else {
            reject(resp)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  // 绑定图片
  commitImgToMscp(params) {
    let data = params
    let headerObj = 'multipart/form-data'
    console.log(data)
    console.log('data' + '图片')
    // fileName: tempFiles.path,
    // imgMeta: 'data:image/png;base64,',
    // contentStr: wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64'),
    // imgUrl: base64,
    // size: tempFiles.size,

    // baseStr: list.imgUrl, //图片的 base64 编码
    // file: list.contentStr, //上传文件
    // url: list.fileName, //上传图片路径
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: api.commitImgToMscp.masUrl,
        filePath: data.url,
        name: 'file',
        header: {
          'Content-Type': headerObj,
          accessToken: app.globalData.userData.mdata.accessToken,
        },
        formData: {
          file: data.contentStr,
          // baseStr: data.imgUrl,
          // url: data.url,
        },
        success(res) {
          let resData = JSON.parse(res.data)
          if (res.statusCode == 200) {
            resolve(resData.data)
          } else {
            reject(res)
          }
        },
        fail(err) {
          console.log(err)
          reject(err)
        },
      })
      // requestService.request('commitImgToMscp', data, 'POST', headerObj).then(
      //   (resp) => {
      //     console.log(resp)
      //     if (resp && resp.data && resp.data.code == 0) {
      //       resolve(resp.data.data)
      //     } else {
      //       reject(resp)
      //     }
      //   },
      //   (error) => {
      //     reject(error)
      //   }
      // )
    })
  },
}
export { service }
