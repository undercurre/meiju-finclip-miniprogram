import { getTimeStamp, getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../../../utils/requestService'

const service = {
  // 解析qrtext
  analyzeQRtext(params) {
    return new Promise((resolve, reject) => {
      let reqData = {
        headParams: {},
        restParams: {
          model: params.qrtext,
        },
        // qrtext:'4oMiCLMqzY5eDZ1KnG_twg==',
        reqId: getReqId(),
        stamp: getTimeStamp(new Date()),
      }
      requestService.request('selectNewMsProduct', reqData).then(
        (resp) => {
          if (resp.data.code == '000000') {
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
  // 解析qrtext
  NewanalyzeQRtext(params) {
    console.log(params)
    return new Promise((resolve, reject) => {
      let reqData = {
        headParams: {},
        restParams: {
          model: params.qrtext, 
        }, 
      }
      console.log(reqData)
      requestService.request('newSelectNewMsProduct', reqData).then(
        (resp) => {
          console.log(resp)
          if (resp.data.code =='000000') {
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
  getHomeGrouplistService: () => {
    //获取家庭列表
    return new Promise((resolve, reject) => {
      let reqData = {
        reqId: getReqId(),
        stamp: getStamp(),
      }
      requestService.request('homeList', reqData).then(
        (resp) => {
          console.log(resp)
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
}
export { service }
