/*
 * @desc:
 * @author: zhucc22
 * @Date: 2024-06-25 14:05:41
 */
import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../../utils/requestService'
import { api } from '../../../../api'

const service = {
  memberQrcode: (homegroupId) => {
    //获取管理员邀请二维码
    return new Promise((resolve, reject) => {
      let reqData = {
        iotAppId: api.iotAppId,
        uid: getApp().globalData.userData.uid,
        homegroupId: homegroupId,
        reqId: getReqId(),
        stamp: getStamp(),
      }
      requestService.request('memberQrcode', reqData).then(
        (resp) => {
          if (resp.data.code == 0) {
            resolve(resp)
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
}

export { service }
