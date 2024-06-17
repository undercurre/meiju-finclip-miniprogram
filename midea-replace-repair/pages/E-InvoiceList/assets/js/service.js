// import { getTimeStamp, getUID, getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../../../utils/requestService'

//模拟数据
const isMock = false
import { mockData } from 'mockData'

const service = {
  // 发票列表
  getInvoiceList(params) {
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.invoiceList,
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
      requestService.request('invoiceList', reqData).then(
        (resp) => {
          console.log('invoiceList resp', resp)
          // data中没有code
          if (resp.data.status) {
            console.log('invoiceList resp status', resp.data.status)
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
