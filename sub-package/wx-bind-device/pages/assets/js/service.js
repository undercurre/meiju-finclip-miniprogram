import { getReqId, getStamp } from 'm-utilsdk/index'
import { requestService } from '../../../../../utils/requestService'

//模拟数据
const service = {
  wxbindList: () => {
    return new Promise((resolve, reject) => {
      const data = {
        reqId: getReqId(),
        stamp: getStamp(),
      }
      requestService.request('wxbindList', data).then(
        (resp) => {
          console.log('微信设备列表：', resp)
          if (resp.data.code == 0) {
            resolve(resp.data.data)
          } else {
            reject(resp)
          }
        },
        (error) => {
          console.log('微信设备列表失败：', error)
          reject(error)
        }
      )
    })
  },
  wxDeviceDetail: (ilinkImSdkId) => {
    return new Promise((resolve, reject) => {
      const data = {
        reqId: getReqId(),
        stamp: getStamp(),
        ilinkImSdkId: ilinkImSdkId,
      }
      requestService.request('wxDeviceDetail', data).then(
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
  wxBind: (ilinkImSdkId) => {
    return new Promise((resolve, reject) => {
      const data = {
        reqId: getReqId(),
        ilinkImSdkId: ilinkImSdkId,
      }
      requestService.request('wxBind', data).then(
        (resp) => {
          if (resp.data.code == 0) {
            resolve(resp.data.data)
          } else {
            reject(resp.data.data)
          }
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  wxUnbind: (ilinkImSdkId) => {
    return new Promise((resolve, reject) => {
      const data = {
        reqId: getReqId(),
        ilinkImSdkId: ilinkImSdkId,
      }
      requestService.request('wxUnbind', data).then(
        (resp) => {
          if (resp.data.code == 0) {
            resolve(ilinkImSdkId)
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
