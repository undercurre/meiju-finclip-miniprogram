// import { getTimeStamp, getUID, getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../../../utils/requestService'

//模拟数据
const isMock = false
import { mockData } from 'mockData'

const service = {
  // 故障自查 故障可能原因查询
  queryservicerequireproduct(params) {
    console.log('service getExcludedFault')
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.getExcludedFault,
        }
        if (resp.data.code == 0) {
          resolve()
        } else {
          reject(resp)
        }
        return
      }

      let reqData = {
        body: {
          ...params,
        },
      }
      requestService.request('queryservicerequireproduct', reqData).then(
        (resp) => {
          resolve(resp.data)
          // reject(resp)
        },
        (error) => {
          reject(error)
        }
      )
    })
  },

  // 故障自查 故障可能原因查询 假性故障
  getExcludedFault(params) {
    console.log('service getExcludedFault')
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.getExcludedFault,
        }
        if (resp.data.code == 0) {
          resolve()
        } else {
          reject(resp)
        }
        return
      }

      let reqData = {
        body: {
          ...params,
        },
      }
      requestService.request('getexcludedfaultlist', reqData).then(
        (resp) => {
          console.log('service getExcludedFault  resp', resp)
          resolve(resp.data)
          // reject(resp)
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
}
export { service }
