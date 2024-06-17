// import { getTimeStamp, getUID, getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../../../utils/requestService'

//模拟数据
const isMock = false
import { mockData } from 'mockData'

const service = {
  // 订单列表
  getUserOrderList(params) {
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
      }
      requestService.request('orderList', reqData).then(
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
