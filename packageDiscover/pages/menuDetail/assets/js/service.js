import { getTimeStamp, getReqId } from 'm-utilsdk/index'
import { requestService } from '../../../../../utils/requestService'

//模拟数据
const isMock = false
import { mockData } from 'mockData'

const service = {
  getMenuDetail: (recipeId) => {
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.menuDetail,
        }
        if (resp.data.code == 0) {
          resolve(resp.data.data)
        } else {
          reject(resp)
        }
        return
      }
      let data = {
        recipeId: recipeId,
        reqId: getReqId(),
        stamp: getTimeStamp(new Date()),
      }
      requestService.request('detailquery', data).then(
        (resp) => {
          if (resp.data.code == 0) {
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
}
export { service }
