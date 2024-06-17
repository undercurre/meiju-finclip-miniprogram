import { getTimeStamp, getReqId } from 'm-utilsdk/index'
import { requestService } from '../../../../../../utils/requestService'

//模拟数据
const isMock = false
import { mockData } from 'mockData'

const service = {
  // 智能小家电列表
  getUserProductPageList(params) {
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.getUserProductPageList,
        }
        if (resp.data.code == 0) {
          resolve(resp.data.data)
        } else {
          reject(resp)
        }
        return
      }
      let reqData = {
        ...params,
        // qrtext:'4oMiCLMqzY5eDZ1KnG_twg==',
        reqId: getReqId(),
        stamp: getTimeStamp(new Date()),
      }
      requestService.request('getUserProductPageList', reqData).then(
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

  // 以换代修-判断品类码是否支持以换代修
  typeCheck(params) {
    return new Promise((resolve, reject) => {
      let reqData = {
        ...params,
        reqId: getReqId(),
        stamp: getTimeStamp(new Date()),
      }
      requestService.request('typeCheck', reqData).then(
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
