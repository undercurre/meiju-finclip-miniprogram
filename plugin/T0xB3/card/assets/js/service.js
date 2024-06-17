import { requestService } from '../../../../../utils/requestService'
import { getReqId, getStamp } from 'm-utilsdk/index'
const url1 = '/cfhrs/common/v1/api'
const url2 = '/cfhrs/b3/v1/api'

export default {
  getCommonDataFromServe(requestData, callback) {
    let res = requestService.request(url1, requestData)
    // let res = await page.requestCentralClound(url1, requestData)
    callback(res.result)
  },
  async getDataFromServe(requestData, callback) {
    let res = await requestService.request(url2, requestData)
    callback(res.data.result)
    return res.data.result
  },
  // 查询云消存程序列表
  getOtaModeList(callback) {
    let requestData = {
      msg: 'getCloudTimingSeqList',
      params: {},
    }
    return this.getDataFromServe(requestData, callback)
  },
  // AI暖盘开关状态查改
  AIswitch: function (action, type, key, callback) {
    let self = this
    let deviceInfo = wx.getStorageSync('device')
    let deviceObj = JSON.parse(deviceInfo.data)
    let requestData = {
      msg: type == 'clean' ? 'aiCleanTasteSetting' : 'aiDashSwitch',
      params: {
        applianceId: deviceObj.applianceId,
        action: action,
        switch: key,
      },
    }
    self.getDataFromServe(requestData, callback)
  },
  // AI暖盘开启时间查询
  getAIendTime: function (callback) {
    let self = this
    let deviceInfo = wx.getStorageSync('device')
    let deviceObj = JSON.parse(deviceInfo.data)
    let requestData = {
      msg: 'aiDashGetRecommendTime',
      params: {
        applianceId: deviceObj.applianceId,
      },
    }
    self.getDataFromServe(requestData, callback)
  },
  // AI暖盘剩余学习时间查询
  getLeftDay: function (callback) {
    let self = this
    let deviceInfo = wx.getStorageSync('device')
    let deviceObj = JSON.parse(deviceInfo.data)
    let requestData = {
      msg: 'aiDashGetCountdownDays',
      params: {
        applianceId: deviceObj.applianceId,
      },
    }
    self.getDataFromServe(requestData, callback)
  },
  // 查询AI暖盘设定时间和温度参数列表
  getTimeList: function (callback) {
    let self = this
    let deviceInfo = wx.getStorageSync('device')
    let deviceObj = JSON.parse(deviceInfo.data)
    let requestData = {
      msg: 'aiDashGetRecommendTimeTest',
      params: {
        applianceId: deviceObj.applianceId,
      },
    }
    self.getDataFromServe(requestData, callback)
  },
  // 查询自定义暖盘时间和温度参数列表
  getDiyTimeList: function (callback) {
    let self = this
    let deviceInfo = wx.getStorageSync('device')
    let deviceObj = JSON.parse(deviceInfo.data)
    let requestData = {
      msg: 'aiDashModeUserSetting',
      params: {
        applianceId: deviceObj.applianceId,
        action: 'get',
        setting: [],
      },
    }
    self.getDataFromServe(requestData, callback)
  },
  // 保存自定义暖盘时间和温度参数列表
  setDiyTimeList: function (list, callback) {
    let self = this
    let deviceInfo = wx.getStorageSync('device')
    let deviceObj = JSON.parse(deviceInfo.data)
    let requestData = {
      msg: 'aiDashModeUserSetting',
      params: {
        applianceId: deviceObj.applianceId,
        action: 'set',
        setting: list,
      },
    }
    self.getDataFromServe(requestData, callback)
  },
  // AI和自定义模式查询和设置
  aiModeEdit: function (type, mode = 0, callback) {
    let self = this
    let deviceInfo = wx.getStorageSync('device')
    let deviceObj = JSON.parse(deviceInfo.data)
    let requestData = {
      msg: 'aiDashMode',
      params: {
        applianceId: deviceObj.applianceId,
        sn8: deviceObj.sn8,
        action: type,
        mode: mode,
      },
    }
    self.getDataFromServe(requestData, callback)
  },
  // 查询消毒次数数据
  getTimesInfo: function (callback) {
    let self = this
    let deviceInfo = wx.getStorageSync('device')
    let deviceObj = JSON.parse(deviceInfo.data)
    let requestData = {
      msg: 'getDisinfectCountInfo',
      params: {
        applianceId: deviceObj.applianceId,
      },
    }
    self.getDataFromServe(requestData, callback)
  },
  // 重置消毒次数记录时间
  setTimes: function (times, callback) {
    let self = this
    let deviceInfo = wx.getStorageSync('device')
    let deviceObj = JSON.parse(deviceInfo.data)
    let requestData = {
      msg: 'setDisinfectCountOnReset',
      params: {
        applianceId: deviceObj.applianceId,
        count: times,
      },
    }
    self.getDataFromServe(requestData, callback)
  },
}
