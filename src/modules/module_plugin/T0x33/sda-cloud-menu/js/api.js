import { Format } from './format'
import { commonApi } from '../../assets/scripts/api'
const app = getApp()

const requestService = app.getGlobalConfig().requestService

const imgBaseUrl = app.getGlobalConfig().imgBaseUrl
const imageDomain = imgBaseUrl.url + '/plugin'
export { imageDomain }

export class RemoteControl {
  // 启动设备
  static work(params) {
    return new Promise((resolve, reject) => {
      let control = {
        control: {
          ...params.controlParams,
        },
      }
      let uriParams = {
        applianceId: params.applianceId,
        applianceType: params.applianceType,
        modelNo: params.modelNo,
        menuType: params.menuType,
      }
      let urlDataString = Format.jsonToParam(uriParams).substr(1)
      let jsonOrderString = '&jsonOrder=' + JSON.stringify(control)
      urlDataString += jsonOrderString
      let sendParams = {
        serviceName: 'remote-control',
        uri: '/v2/' + params.applianceType.slice(-2) + '/control/work',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        userId: app.globalData.userData.iotUserId,
        data: urlDataString,
      }
      requestService
        .request(commonApi.sdaTransmit, sendParams)
        .then((res) => {
          console.log('启动设备 传参: ', sendParams)
          console.log('启动设备 返回参: ', res)
          resolve(res)
        })
        .catch((err) => {
          console.error('启动设备 错误: ', err)
          reject(err)
        })
    })
  }

  // 查询设备状态
  static getStatus(params) {
    return new Promise((resolve, reject) => {
      let uriParams = {
        applianceId: params.applianceCode,
        applianceType: params.applianceType,
        modelNo: params.modelNo,
        userId: app.globalData.userData.iotUserId,
        queryType: params.queryType || 0,
      }
      let sendParams = {
        serviceName: 'remote-control',
        uri: '/v2/' + params.applianceType.slice(-2) + '/control/getStatus' + Format.jsonToParam(uriParams),
        method: 'POST',
        contentType: 'application/json',
        userId: app.globalData.userData.iotUserId,
      }
      requestService
        .request(commonApi.sdaTransmit, sendParams)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          if (err.data) {
            resolve(err)
          } else {
            reject(err)
          }
        })
    })
  }
}

export class RecipeService {
  // 获取全部食谱
  static getRecipeList(params) {
    console.log('获取全部食谱 接口: ')
    const { deviceInfo, pageIndex, pageSize } = params
    let uriParams = {
      applianceType: deviceInfo.type,
      modelNo: deviceInfo.sn8,
      page: pageIndex,
      pageSize: pageSize,
    }
    console.log('获取全部食谱 接口: ', uriParams)
    let sendParams = {
      serviceName: 'recipe-service',
      uri: '/v2/modelNumber/recipes' + Format.jsonToParam(uriParams),
      method: 'GET',
      contentType: 'application/json',
      // userId: '6876490357',
      userId: app.globalData.userData.iotUserId,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request(commonApi.sdaTransmit, sendParams, 'POST')
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          console.error('获取全部食谱 错误: ', err)
          reject(err)
        })
    })
  }

  // 获取食谱详情
  static recipeDetail(params) {
    return new Promise((resolve, reject) => {
      let uriParams = {
        applianceId: params.applianceId,
        applianceType: params.applianceType,
        modelNo: params.modelNo,
        recipeCode: params.recipeCode,
      }
      let sendParams = {
        serviceName: 'recipe-service',
        uri: '/v2/recipe/detail' + Format.jsonToParam(uriParams),
        method: 'GET',
        contentType: 'application/json',
        userId: app.globalData.userData.iotUserId,
      }
      requestService
        .request(commonApi.sdaTransmit, sendParams)
        .then((res) => {
          console.log('获取食谱详情 传参: ', sendParams)
          console.log('获取食谱详情 返回参: ', res)
          resolve(res)
        })
        .catch((err) => {
          console.error('获取食谱详情 错误: ', err)
          reject(err)
        })
    })
  }

  // 搜索食谱
  static recipeSearch(params) {
    return new Promise((resolve, reject) => {
      let uriParams = {
        applianceId: params.applianceId,
        applianceType: params.applianceType,
        modelNo: params.modelNo,
        keyWord: params.keyWord,
        uid: app.globalData.userData.uid,
      }
      let sendParams = {
        serviceName: 'recipe-service',
        uri: '/v2/recipe/search' + Format.jsonToParam(uriParams),
        method: 'GET',
        contentType: 'application/json',
        userId: app.globalData.userData.iotUserId,
      }
      requestService
        .request(commonApi.sdaTransmit, sendParams)
        .then((res) => {
          console.log('搜索食谱 传参: ', sendParams)
          console.log('搜索食谱 返回参: ', res)
          resolve(res)
        })
        .catch((err) => {
          console.error('搜索食谱 错误: ', err)
          reject(err)
        })
    })
  }

  // 获取食谱合集信息
  static getTopicInfo(params) {
    return new Promise((resolve, reject) => {
      let uriParams = {
        applianceId: params.applianceId,
        applianceType: params.applianceType,
        modelNo: params.modelNo,
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        topicId: params.topicId,
        key: 0,
      }
      let sendParams = {
        serviceName: 'recipe-service',
        uri: '/v2/topic/info' + Format.jsonToParam(uriParams),
        method: 'GET',
        contentType: 'application/json',
        userId: app.globalData.userData.iotUserId,
      }
      requestService
        .request(commonApi.sdaTransmit, sendParams)
        .then((res) => {
          console.log('获取食谱合集信息 传参: ', sendParams)
          console.log('获取食谱合集信息 返回参: ', res)
          resolve(res)
        })
        .catch((err) => {
          console.error('获取食谱合集信息 错误: ', err)
          reject(err)
        })
    })
  }

  // 获取食谱分类
  static categories(params) {
    let uriParams = {
      applianceType: params.applianceType,
      modelNo: params.modelNo,
      applianceId: params.applianceId,
    }
    let sendParams = {
      serviceName: 'recipe-service',
      uri: '/v3/categories' + Format.jsonToParam(uriParams),
      method: 'GET',
      contentType: 'application/json',
      userId: app.globalData.userData.iotUserId,
    }
    return new Promise((resolve, reject) => {
      requestService
        .request(commonApi.sdaTransmit, sendParams, 'POST')
        .then((res) => {
          console.log('获取食谱分类 传参: ', sendParams)
          console.log('获取食谱分类 返回参: ', res)
          resolve(res)
        })
        .catch((err) => {
          console.error('获取食谱分类 错误: ', err)
          reject(err)
        })
    })
  }
}
