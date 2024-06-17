// import { getTimeStamp, getUID, getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../../../utils/requestService'

//模拟数据
const isMock = false
import { mockData } from 'mockData'

const service = {
  // 获取品类收费类型
  getChargeStandardList(params) {
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData['getChargeStandardList'],
        }
        if (resp.data.code == 0) {
          resolve(resp)
        } else {
          reject(resp)
        }
        return
      }

      let reqData = {
        ...params,
      }
      requestService.request('getChargeStandardList', reqData).then(
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
