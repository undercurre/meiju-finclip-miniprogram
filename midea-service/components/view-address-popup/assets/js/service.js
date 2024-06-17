import { getTimeStamp, getUID } from 'm-utilsdk/index'
import { requestService } from '../../../../../utils/requestService'

//模拟数据
const isMock = false
import { mockData } from 'mockData'

const service = {
  // it部活动配置系统-获取地区
  receiveGetAddress(code) {
    console.log('receiveGetAddress, 进入了 service')
    return new Promise((resolve, reject) => {
      let data = {
        reqId: getUID(),
        stamp: getTimeStamp(new Date()),
        activityId: 'HD',
        regionCode: code,
      }
      requestService
        .request('receiveGetAddress', data)
        .then((res) => {
          console.log('data88888888888888', res)
          if (res.data.code === 0) {
            resolve(res)
          } else {
            reject()
          }
          wx.hideLoading()
        })
        .catch(() => {
          wx.hideLoading()
          reject()
        })
    })
  },

  // 获取省市区
  getAreaList(code) {
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
        restParams: {
          parentCode: code,
          sourceSys: 'APP',
        },
        headParams: {},
      }
      requestService.request('getAreaList', reqData, 'POST').then(
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

  // 添加地址
  getOnlineAdvertise() {
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

      let reqData = {}
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

  // 删除地址
  delAddr() {
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

      let reqData = {}
      requestService.request('deleteAddress', reqData).then(
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
