import { addDeviceSDK } from '../../../utils/distribution-network/addDeviceSDK'
/**
 * 不支持配网的设备
 */
const isNotColmo = (params = {}) => {
  getApp().fn('pageViewRecord', {
    module: 'appliance',
    page_id: 'pages_not_support_add_appliance',
    page_name: '不支持小程序配网页',
    ext_info: {
      error_msg: params.error_msg || ''
    },
    device_info: {
      device_session_id: getApp().globalData.deviceSessionId || '', //一次配网事件标识
      sn: params.plainSn || '', //sn码
      sn8: params.sn8 || '', //sn8码
      a0: '', //a0码
      widget_cate: params.type || params.category || '', //设备品类
      wifi_model_version: params.moduleVersion || params.blueVersion || '', //模组wifi版本
      link_type: params.linkType || addDeviceSDK.getLinkType(params.mode) || '', //连接方式 bluetooth/ap/...
      iot_device_id: params.applianceCode || '', //设备id
    },
  })
}

/**
 * 用户点击埋点 发现设备
 */
const connectTypeMap = {
  1: '一代蓝牙发现',
  2: '二代蓝牙发现',
  3: 'AP发现'
}
const versionTypeMap = {
  1: '一代蓝牙（蓝牙+wifi）',
  2: '二代蓝牙（蓝牙+wifi）',
  3: '一代单蓝牙',
  4: '二代单蓝牙',
}
const clickfoundDeviceTrack = (params = {}) => {
  getApp().fn('clickRecord', {
    module: 'appliance',
    page_id: 'page_add_appliance',
    page_name: '添加设备页',
    widget_id: 'arround_find_device',
    widget_name: '发现设备',
    ext_info: {
      connectType: connectTypeMap[params.connectType] || '', //设备配网方式
      versionType: versionTypeMap[params.versionType] || '', //蓝牙模组版本
    },
    device_info: {
      device_session_id: getApp().globalData.deviceSessionId || '', //一次配网事件标识
      sn: params.plainSn || '', //sn码
      sn8: params.sn8 || '', //sn8码
      a0: '', //a0码
      widget_cate: params.type || params.category || '', //设备品类
      wifi_model_version: params.moduleVersion || params.blueVersion || '', //模组wifi版本
      link_type: params.linkType || addDeviceSDK.getLinkType(params.mode) || '', //连接方式 bluetooth/ap/...
      iot_device_id: params.applianceCode || '', //设备id
    },
  })
}

/**
 * 配网指引返回结果
 */
const server_return_addGuide = (params = {}) => {
  getApp().fn('clickRecord', {
    module: 'appliance',
    page_id: 'device_guidebook_page',
    page_name: '配网指引返回结果',
    widget_id: 'server_return',
    widget_name: '服务器返回',
    ext_info: {
      code: params.code, //服务器返回码、无网络报-101
      cate: params.cate || '',
      sn8: params.sn8 || ''
    },
    device_info: {
      device_session_id: getApp().globalData.deviceSessionId || '', //一次配网事件标识
      sn: params.plainSn || '', //sn码
      sn8: params.sn8 || '', //sn8码
      a0: params.a0 || '', //a0码
      widget_cate: params.type || params.category || '', //设备品类
      wifi_model_version: params.moduleVersion || params.blueVersion || '', //模组wifi版本
      link_type: params.linkType || addDeviceSDK.getLinkType(params.mode) || '', //连接方式 bluetooth/ap/...
      iot_device_id: params.applianceCode || '', //设备id
    },
  })
}

export const commonBuriedPoint = {
  isNotColmo,
  clickfoundDeviceTrack,
  server_return_addGuide
}