import { requestService } from '../../../../../utils/requestService'

//模拟数据
const isMock = false
import { mockData } from 'mockData'

const service = {
  // 添加地址
  addAddress(params) {
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.addAddress,
        }
        if (resp.data.code == 0) {
          resolve()
        } else {
          reject(resp)
        }
        return
      }

      let reqData = {
        ...params,
      }
      requestService.request('addAddress', reqData).then(
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
  // 修改地址
  modifyAddr(params) {
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.addAddress,
        }
        if (resp.data.code == 0) {
          resolve()
        } else {
          reject(resp)
        }
        return
      }

      let reqData = {
        ...params,
      }
      requestService.request('modifyAddr', reqData).then(
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

  // 删除当前地址
  deleteAddr(params) {
    return new Promise((resolve, reject) => {
      if (isMock) {
        let resp = {
          data: mockData.setDefautAddress,
        }
        if (resp.data.code == 0) {
          resolve()
        } else {
          reject(resp)
        }
        return
      }

      let reqData = {
        ...params,
      }
      requestService.request('delAddress', reqData).then(
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
