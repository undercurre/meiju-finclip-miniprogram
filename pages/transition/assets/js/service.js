import { getReqId, getStamp } from 'm-utilsdk/index'

import { requestService } from '../../../../utils/requestService'

const service = {
  getHomeGrouplistService: () => {
    //获取家庭列表
    return new Promise((resolve, reject) => {
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
      }
      requestService.request('homeList', reqData).then(
        (resp) => {
          if (resp.data.code == 0) {
            resolve(resp.data.data.homeList)
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

  getApplianceHomeDataService(homegroupId) {
    //获取当前家庭设备列表
    return new Promise((resolve, reject) => {
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
        homegroupId: homegroupId,
      }
      requestService.request('applianceList', reqData).then(
        (resp) => {
          if (resp.data.code == 0) {
            resolve(resp.data.data.homeList[0] || {})
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

  //设备确权状态
  getApplianceAuthType(applianceCode) {
    let reqData = {
      applianceCode: applianceCode,
      reqId: getReqId(),
      stamp: getStamp(),
    }
    return new Promise((resolve, reject) => {
      requestService
        .request('getApplianceAuthType', reqData)
        .then((resp) => {
          resolve(resp)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export { service }
