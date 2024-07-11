/*
 * @desc: 修改接口配置
 * @author: zhucc22
 * @Date: 2022-09-06 15:56:34
 */
import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../../../utils/requestService'

const service = {
  // 协议更新——协议变更判断
  checkAgreement(phoneNumber) {
    return new Promise((resolve) => {
      let data = { mobile: phoneNumber, uid: getApp().globalData.userData?.uid, reqId: getReqId(), stamp: getStamp() }
      requestService.request('checkAgreementApi', data).then(
        (resp) => {
          resolve(resp)
        },
        (error) => {
          // reject(error)
          // 业务上， 响应失败时当做协议有变更来处理
          resolve(error)
        }
      )
    })
  },
  // 协议更新——协议标题列表
  agreementTitle() {
    return new Promise((resolve, reject) => {
      let params = {}
      requestService.request('agreementTitleApi', params).then(
        (resp) => {
          if (resp && resp.data && resp.data.code == 0) {
            resolve(resp.data)
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

  // 协议更新——同意最新协议接口
  agreeLatest(data) {
    return new Promise((resolve, reject) => {
      let params = { ...data }
      requestService.request('agreeLatestApi', params).then(
        (resp) => {
          if (resp && resp.data && resp.data.code == 0) {
            resolve(resp.data)
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
