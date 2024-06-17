import { rangersBurialPoint } from './../../utils/requestService'
import { getCustomParam } from './../../track/track.js'
import { getDeviceInfo } from './../../track/pluginTrack.js'
import { hasKey } from 'm-utilsdk/index'
import { getFullPageUrl, getPageUrl } from 'm-miniCommonSDK/index'
import trackConfig from './../../track/oneKeyTrack/config/index.js'

/**
 * @description 插件埋点方法
 * @param {String} eventName 事件名 点击：user_behavior_event 浏览：user_page_view
 * @param {String} method /track/oneKeyTrack/config中已配置method
 * @param {Object} params 需要上报的参数，会覆盖方法中的默认值
 * @param {Object} custom 自定义上报参数
 */
const pluginEventTrack = (eventName, method, params, custom) => {
    const reportDeviceData = getDeviceInfo()
    const reportData = Object.assign({}, { module: '插件' }, params)
    const reportCustomData = Object.assign({}, reportDeviceData, custom)
    clickEventPluginTracking(eventName, method, reportData, reportCustomData)
  }
  
  //通用事件
  const clickEventPluginTracking = (event, method, params = {}, custom = {}) => {
    const fullPath = getFullPageUrl()
    const route = getPageUrl()
    const track = trackConfig.find((item) => item.path === route) || {}
    const methodTracks = track.methodTracks || []
    const selectMethod =
      methodTracks.length > 0 && method ? methodTracks.find((item) => item.method === method) || {} : {}
    const selectParams = getCustomParam(selectMethod, track.commonParams, params)
    const ext_info = hasKey(selectParams, 'ext_info') ? selectParams['ext_info'] : ''
    const refer_page_name = hasKey(selectParams, 'refer_page_name') ? selectParams['refer_page_name'] : ''
    const reportDeviceInfo = getDeviceInfo()
    const app = getApp()
  
    const commonReportData = {
      module: hasKey(selectParams, 'module') ? selectParams['module'] : '插件',
      page_path: fullPath || '',
      page_id: hasKey(selectParams, 'page_id') ? selectParams['page_id'] : '',
      page_name: hasKey(selectParams, 'page_name') ? selectParams['page_name'] : '',
      object_type: hasKey(selectParams, 'object_type') ? selectParams['object_type'] : '',
      object_id: hasKey(selectParams, 'object_id') ? selectParams['object_id'] : '',
      object_name: hasKey(selectParams, 'object_name') ? selectParams['object_name'] : '',
      page_module: hasKey(selectParams, 'page_module') ? selectParams['page_module'] : '',
      open_id: (app && app.globalData.openId) || '',
      device_info: {
        ...(hasKey(selectParams, 'device_info') ? selectParams['device_info'] : {}),
      },
      refer_page_name,
      ext_info,
      ...custom,
      ...reportDeviceInfo,
    }
    if (event.indexOf('user_behavior_event') !== -1) {
      const userBehaviorReportData = Object.assign({}, commonReportData, {
        widget_id: hasKey(selectParams, 'widget_id') ? selectParams['widget_id'] : '',
        widget_name: hasKey(selectParams, 'widget_name') ? selectParams['widget_name'] : '',
        rank: hasKey(selectParams, 'rank') ? selectParams['rank'] : '',
        page_module: hasKey(selectParams, 'page_module') ? selectParams['page_module'] : '',
      })
      console.log('pluginReportData', event, method, userBehaviorReportData)
      rangersBurialPoint('user_behavior_event', userBehaviorReportData)
    } else if (event.indexOf('user_page_view') !== -1) {
      console.log('pluginReportData', event, method, commonReportData)
      rangersBurialPoint('user_page_view', commonReportData)
    }
  }

  module.exports = {
    pluginEventTrack
  }
  