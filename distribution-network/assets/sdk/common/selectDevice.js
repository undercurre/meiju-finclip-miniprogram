/**
 * 设备选型相关接口
 */
const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
import { getStamp, getReqId } from 'm-utilsdk/index'
import config from '../../../../config'
const WX_LOG = require('m-miniCommonSDK/utils/log')
import { getQueryIotProductV4 } from './api'
var selectDevice = {
  /**
   * 返回查询设备列表，大类，点击选型后显示的数据
   */
  getQueryBrandCategory() {
    return new Promise((resolve, reject) => {
      let param = {
        stamp: getStamp(),
        reqId: getReqId(),
      }
      if(app.globalData.brand === 'colmo') param.iotAppId = config.iotAppId[config.environment]
      requestService
        .request('getQueryBrandCategory', param)
        .then((res) => {
          let productList = res.data.data.list.filter((arr) => {
            return arr.list0.length
          })
          WX_LOG.info('查询设备列表，大类成功', 'getQueryBrandCategory')
          resolve(productList)
        })
        .catch((error) => {
          WX_LOG.error('查询设备列表，大类失败', 'getQueryBrandCategory', error)
          reject(error)
        })
    })
  },
  /**
   * 选择对应大类设备型号列表,在选型页面，点击某个大类，返回的设备型号列表
   * 测试用例：
   * params = {
        pageNum: 1,
        productList: {},
        subCode: 'D1X1'
      }
   * @param {*} str 
   * @param {*} params 
   */
  getQueryIotProductV4(str, params) {
    return new Promise((resolve, reject) => {
      let { pageNum, productList, subCode } = params
      let param = {
        subCode,
        pageSize: '20',
        page: pageNum,
        brand: app.globalData.brand == 'meiju' ? '' : app.globalData.brand,
        stamp: getStamp(),
        reqId: getReqId(),
      }
      if(app.globalData.brand === 'colmo') {
        delete param.brand
        param.iotAppId = config.iotAppId[config.environment]
      }
      requestService
        .request(getQueryIotProductV4, param)
        .then((res) => {
          let currList = res.data.data.list || []
          let hasNextPage = res.data.data.hasNextPage
          if (!currList.length) {
            WX_LOG.warn('设备型号列表二级目录失败', 'getQueryIotProductV4', res)
            reject()
          }
          let currProduct = str != 'next' ? currList : [...productList, ...currList]
          WX_LOG.info('设备型号列表二级目录成功', 'getQueryIotProductV4')
          resolve({
            productList: currProduct,
            loadFlag: true,
            hasNext: hasNextPage,
          })
        })
        .catch((error) => {
          self.setData({
            hasNext: false,
            loadFlag: true,
          })
          WX_LOG.error('设备型号列表二级目录失败', 'getQueryIotProductV4', error)
        })
    })
  },
}

module.exports = {
  selectDevice,
}
