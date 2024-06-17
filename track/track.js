import { rangersBurialPoint } from '../utils/requestService'
import { hasKey, isEmptyObject } from 'm-utilsdk/index'
import { getOptions, getFullPageUrl, getPageUrl } from '../utils/util.js'
import { getDeviceInfo } from './tools/index.js'
import trackConfig from './oneKeyTrack/config/index.js'
import commonLogon from './oneKeyTrack/config/commonLogon'
const loadApiList = [
  'getOpendId2',
  'loginMuc',
  'homeList',
  'deviceFilterList',
  'applianceListAggregate',
  'getSceneItemList',
  'getAdvertisement_Token',
  'getAdvertisement',
  'checkAgreementApi',
  'scanCodeJoinFamily',
  'nfcBindGet',
]
//---活动模板埋点start---
export const eventTracking = (event, params) => {
  const click_id = getClickId()
  // if (this.data.gdt_vid || this.data.channel || this.data.subchannel) {
  if (event.indexOf('page_view') !== -1) {
    rangersBurialPoint('activity_page_view', {
      module: '活动', //写死 “活动”
      page_id: params['page_id'], //参考接口请求参数“pageId”
      game_id: params['game_id'], //参考接口请求参数“gameId”
      page_name: params['page_name'], //当前页面的标题，顶部的title
      page_path: params['page_path'], //当前页面的URL
      click_id: click_id, //gdt_vid 或者 qz_gdt
    })
  } else if (event.indexOf('widget_event') !== -1) {
    rangersBurialPoint('activity_widget_event', {
      module: '活动', //写死 “活动”
      page_id: params['page_id'], //参考接口请求参数“pageId”
      game_id: params['game_id'], //参考接口请求参数“gameId”
      page_name: params['page_name'], //当前页面的标题，顶部的title
      page_path: params['page_path'], //当前页面的URL
      page_type: params['page_type'], //页面类型
      container_type: params['container_type'], //对应后台接口返回的容器类型：
      container_id: params['container_id'], //对应后台接口反正的容器ID，containerId
      container_custom: params['container_custom'], //对应custom字段的值
      view_type: params['view_type'], //后台接口对应的 viewType
      area_name: params['area_name'], //页面内的区域模块名称
      hole_name: params['hole_name'], //坑位名称
      hole_title: params['hole_title'], //弹窗标题
      hole_content: params['hole_content'], //弹窗文案
      target: params['target'], //响应方式字典
      target_url: params['target_url'], //响应的跳转链接
      click_id: click_id, //gdt_vid 或者 qz_gdt
      ext_info: '', //扩展信息
    })
  }
  // }
}
export const actEventClickTracking = (event, options, pageSetting, selectContainer, selectBasic) => {
  const hole_name = getHoleName(pageSetting, selectBasic)
  const hole_title = getHoleTitle(pageSetting, selectBasic)
  const hole_content = getHoleContent(pageSetting, selectBasic)
  const fullPath = getFullPageUrl()
  const params = {
    page_id: hasKey(options, 'pageId') ? options.pageId : '', //参考接口请求参数“pageId”
    game_id: hasKey(options, 'gameId') ? options.gameId : '', //参考接口请求参数“gameId”
    page_name: pageSetting.name || '', //当前页面的标题，顶部的title
    page_path: fullPath || '', //当前页面的URL
    page_type: pageSetting.type || '', //页面类型
    container_type: hasKey(selectContainer, 'containerType') ? selectContainer.containerType : '', //对应后台接口返回的容器类型：
    container_id: hasKey(selectContainer, 'id') ? selectContainer.id : '', //对应后台接口反正的容器ID，containerId
    container_custom: hasKey(selectBasic, 'custom') ? selectBasic.custom : '', //对应custom字段的值
    view_type: selectBasic.type || '', //后台接口对应的 viewType
    area_name: '', //页面内的区域模块名称
    hole_name: hole_name, //坑位名称
    hole_title: hole_title, //弹窗标题
    hole_content: hole_content, //弹窗文案
    target: hasKey(selectBasic, 'target') ? selectBasic.target : '', //响应方式字典
    target_url: hasKey(selectBasic, 'targetUrl') ? selectBasic.targetUrl : '', //响应的跳转链接
  }
  eventTracking(event, params)
}
export const actEventViewPageTracking = (event, options, pageSetting) => {
  const fullPath = getFullPageUrl()
  const params = {
    page_id: hasKey(options, 'pageId') ? options.pageId : '', //参考接口请求参数“pageId”
    game_id: hasKey(options, 'gameId') ? options.gameId : '', //参考接口请求参数“gameId”
    page_name: pageSetting.name || '', //当前页面的标题，顶部的title
    page_path: fullPath || '', //当前页面的URL
  }
  eventTracking(event, params)
}
export const getHoleName = (pageSetting, selectBasic) => {
  if (pageSetting.type == 3 || pageSetting.type == 4 || pageSetting.type == 5) {
    return hasKey(selectBasic, 'name') ? selectBasic.name : ''
  } else {
    return (selectBasic.code || selectBasic.code == 0) && selectBasic.code != '' ? selectBasic.code : selectBasic.name
  }
}
export const getHoleTitle = (pageSetting) => {
  if (pageSetting.type == 3 || pageSetting.type == 4 || pageSetting.type == 5) {
    return pageSetting.popups.title
  }
  return ''
}
export const getHoleContent = (pageSetting) => {
  if (pageSetting.type == 3 || pageSetting.type == 4 || pageSetting.type == 5) {
    return pageSetting.popups.content
  }
  return ''
}
//---活动模板埋点end---

//---首页浮窗埋点start---
export const homeFloatEventTracking = (event, params) => {
  const fullPath = getFullPageUrl()
  if (event.indexOf('user_behavior_event') !== -1) {
    rangersBurialPoint('user_behavior_event', {
      page_id: 'page_home',
      page_name: '小程序首页',
      page_path: fullPath || '', //当前页面的URL,
      module: '首页',
      widget_id: 'floatingAds',
      widget_name: '浮动广告',
      page_module: '',
      ramk: '',
      object_type: '广告',
      object_id: params['object_id'],
      object_name: params['object_name'],
    })
  } else if (event.indexOf('content_exposure_event') !== -1) {
    rangersBurialPoint('content_exposure_event', {
      page_id: 'page_home',
      page_name: '小程序首页',
      page_path: fullPath || '', //当前页面的URL,
      module: '首页',
      page_module: '',
      rank: '',
      object_type: '广告',
      object_id: params['object_id'],
      object_name: params['object_name'],
      is_default: '',
      ext_info: '',
    })
  }
}
export const userBehaviorEeventTrack = (event, obj) => {
  const params = {
    page_id: 'page_home',
    page_name: '小程序首页',
    module: '首页',
    widget_id: 'floatingAds',
    widget_name: '浮动广告',
    page_module: '',
    ramk: '',
    object_type: '广告',
    object_id: hasKey(obj, 'describeLink') ? obj.describeLink : '',
    object_name: hasKey(obj, 'adName') ? obj.adName : '',
  }
  homeFloatEventTracking(event, params)
}
// export const contentExposureEventTrack = (event, obj, extralObj) => {
//   const params = {
//     page_id:'page_home',
//     page_name: extralObj.page_name || '小程序首页',
//     module:extralObj.module || '首页',
//     widget_name:extralObj.widget_name || '',
//     page_module:'',
//     rank:extralObj.rank || '',
//     object_type:extralObj.object_type || '广告',
//     object_id: hasKey(obj,"describeLink") ? obj.describeLink: '',
//     object_name:hasKey(obj, "adName") ? obj.adName : '',
//     is_default:'',
//     ext_info:''
//   }
//   homeFloatEventTracking(event,params)
// }

//---首页浮窗埋点end---

//---首页banner广告埋点start---
export const homeBannerEventTracking = (event, params) => {
  const fullPath = getFullPageUrl()
  if (event.indexOf('user_behavior_event') !== -1) {
    rangersBurialPoint('user_behavior_event', {
      page_id: 'page_home',
      page_name: '小程序首页',
      page_path: fullPath || '', //当前页面的URL,
      module: '首页',
      widget_id: 'click_banner',
      widget_name: '广告位',
      page_module: '',
      rank: '',
      object_type: 'banner',
      object_id: params['object_id'],
      object_name: params['object_name'],
    })
  } else if (event.indexOf('content_exposure_event') !== -1) {
    rangersBurialPoint('content_exposure_event', {
      page_id: 'page_home',
      page_name: '小程序首页',
      page_path: fullPath || '', //当前页面的URL,
      module: '首页',
      page_module: '',
      rank: params.rank || '',
      object_type: 'banner',
      object_id: params['object_id'],
      object_name: params['object_name'],
      is_default: '',
      ext_info: '',
    })
  }
}
export const indexBannerUserBehaviorEeventTrack = (event, obj, extralObj) => {
  const params = {
    page_id: 'page_home',
    page_name: '小程序首页',
    module: '首页',
    widget_id: extralObj.widget_id || '',
    widget_name: extralObj.widget_name ? extralObj.widget_name : '',
    page_module: '',
    rank: extralObj.rank ? extralObj.rank : '',
    object_type: extralObj.object_type ? extralObj.object_type : '',
    object_id: hasKey(obj, 'describeLink') ? obj.describeLink : '',
    object_name: hasKey(obj, 'adName') ? obj.adName : '',
  }
  homeBannerEventTracking(event, params)
}
//---首页banner广告埋点end---

//---tab页面 "我的" 广告埋点start---
export const advertiseBannerEventTracking = (event, params, extralObj) => {
  const fullPath = getFullPageUrl()
  if (event.indexOf('user_behavior_event') !== -1) {
    rangersBurialPoint('user_behavior_event', {
      page_id: 'page_personal',
      page_name: '个人中心',
      page_path: fullPath || '', //当前页面的URL,
      module: '首页',
      widget_id: 'click_banner',
      widget_name: '广告位',
      page_module: '',
      rank: extralObj['rank'],
      object_type: 'banner',
      object_id: params['promotePicUrl'],
      object_name: params['adName'],
      isLogin: extralObj['isLogin'],
    })
  } else if (event.indexOf('content_exposure_event') !== -1) {
    rangersBurialPoint('content_exposure_event', {
      page_id: 'page_personal',
      page_name: '个人中心',
      page_path: fullPath || '', //当前页面的URL,
      module: '首页',
      page_module: '',
      rank: extralObj['rank'],
      object_type: 'banner',
      object_id: params['promotePicUrl'],
      object_name: params['adName'],
      is_default: '',
      ext_info: '',
      isLogin: extralObj['isLogin'],
    })
  }
}
//---tab页面 "我的" 广告埋点end---

//---授权手机号弹窗埋点 start----
export const authorizedPhoneTrack = (event, params) => {
  if (event.indexOf('user_behavior_event') !== -1) {
    rangersBurialPoint('user_behavior_event', {
      page_id: 'page_user_authorized',
      page_name: '帐号授权弹窗-手机号码',
      module: '公共',
      widget_id: params['widget_id'], //click_btn_confirm || click_btn_refuse
      widget_name: params['widget_name'], //允许 || 拒绝
      page_module: '',
      rank: '',
      object_type: 'page_path',
      object_id: params['object_id'], //page/index/index?gdt_vid=122
      click_id: params['click_id'], //gdt_vid 或者 qz_gdt
      object_name: '',
      ext_info: {
        page_title: '美的美居',
        mobile: params['mobile'],
        code: params['code'],
        result: params['result'], //接口返回成功或者失败
      },
      open_id: getApp().globalData.openId || '',
    })
  }
}
export const authorizedPhoneClickTrack = (event, flag, res) => {
  //flag:1 0:拒绝
  const click_id = getClickId()

  const code = getCode(res)
  const result = getResult(res)
  const fullPath = getFullPageUrl()
  const params = {
    widget_id: flag == 1 ? 'click_btn_confirm' : 'click_btn_refuse', //click_btn_confirm || click_btn_refuse
    widget_name: flag == 1 ? '允许' : '拒绝', //允许 || 拒绝
    object_id: fullPath, //page/index/index?gdt_vid=122
    click_id: click_id, //gdt_vid 或者 qz_gdt
    mobile: getApp().globalData.phoneNumber || '',
    code: code,
    result: result, //接口返回成功或者失败
  }
  authorizedPhoneTrack(event, params)
}
//其他地方有引用，不能删除
export const getClickId = () => {
  const options = getOptions()
  return hasKey(options, 'gdt_vid') ? options.gdt_vid : hasKey(options, 'qz_gdt') ? options.qz_gdt : ''
}

export const getShareClickId = () => {
  const options = getOptions()
  const temp = hasKey(options, 'qz_gdt') ? `gdt_vid=${options.qz_gdt}` : ''
  return hasKey(options, 'gdt_vid') ? `gdt_vid=${options.gdt_vid}` : temp
}
export const getCode = (res) => {
  if (res) {
    if (hasKey(res, 'data')) {
      if (hasKey(res.data, 'code')) {
        return res.data.code
      }
    }
  }
  return ''
}
export const getResult = (res) => {
  if (res) {
    const code = res.data.code
    return code == 0 ? '成功' : '失败'
  }
  return ''
}
//---授权手机号弹窗埋点 end----

//通用事件
export const clickEventTracking = (event, method, params = {}, custom = {}) => {
  const fullPath = getFullPageUrl()
  const route = getPageUrl()
  const track = trackConfig.find((item) => item.path === route) || {}

  const methodTracks = track.methodTracks || []
  const selectMethod =
    methodTracks.length > 0 && method ? methodTracks.find((item) => item.method === method) || {} : {}
  // const commonParams =  getCommonParams(track.commonParams, params)

  const selectParams = getCustomParam(selectMethod, track.commonParams, params)
  const ext_info = hasKey(selectParams, 'ext_info') ? selectParams['ext_info'] : ''
  const refer_page_name = hasKey(selectParams, 'refer_page_name') ? selectParams['refer_page_name'] : ''
  if (event.indexOf('user_behavior_event') !== -1) {
    rangersBurialPoint('user_behavior_event', {
      page_id: hasKey(selectParams, 'page_id') ? selectParams['page_id'] : 'page_home',
      page_name: hasKey(selectParams, 'page_name') ? selectParams['page_name'] : '小程序首页',
      module: hasKey(selectParams, 'module') ? selectParams['module'] : '首页',
      // ...commonParams,
      // module: hasKey(selectParams, 'module') ? selectParams["module"] : '首页',
      page_path: fullPath || '',
      widget_id: hasKey(selectParams, 'widget_id') ? selectParams['widget_id'] : '',
      widget_name: hasKey(selectParams, 'widget_name') ? selectParams['widget_name'] : '',
      page_module: hasKey(selectParams, 'page_module') ? selectParams['page_module'] : '',
      rank: hasKey(selectParams, 'rank') ? selectParams['rank'] : '',
      object_type: hasKey(selectParams, 'object_type') ? selectParams['object_type'] : '',
      object_id: hasKey(selectParams, 'object_id') ? selectParams['object_id'] : '',
      object_name: hasKey(selectParams, 'object_name') ? selectParams['object_name'] : '',
      ext_info,
      refer_page_name,
      open_id: getApp().globalData.openId || '',
      device_info: {
        ...(hasKey(selectParams, 'device_info') ? selectParams['device_info'] : {}),
      },
      ...custom,
      // click_id: click_id || ''
    })
  } else if (event.indexOf('user_page_view') !== -1) {
    rangersBurialPoint('user_page_view', {
      // ...commonParams,
      page_path: fullPath || '',
      // page_title: hasKey(track, 'page_title') ? track["page_title"] : '美的美居',
      module: hasKey(selectParams, 'module') ? selectParams['module'] : '',
      page_id: hasKey(selectParams, 'page_id') ? selectParams['page_id'] : '',
      page_name: hasKey(selectParams, 'page_name') ? selectParams['page_name'] : '',
      object_type: hasKey(selectParams, 'object_type') ? selectParams['object_type'] : '',
      object_id: hasKey(selectParams, 'object_id') ? selectParams['object_id'] : '',
      object_name: hasKey(selectParams, 'object_name') ? selectParams['object_name'] : '',
      page_module: hasKey(selectParams, 'page_module') ? selectParams['page_module'] : '',
      ext_info,
      refer_page_name,
      open_id: getApp().globalData.openId || '',
      device_info: {
        ...(hasKey(selectParams, 'device_info') ? selectParams['device_info'] : {}),
      },
      ...custom,
      // click_id: click_id || ''
    })
  } else if (event.indexOf('page_loaded_event') !== -1) {
    if (fullPath && fullPath.indexOf('pages/index/index') == -1) return
    rangersBurialPoint('page_loaded_event', {
      // ...commonParams,
      page_path: fullPath || '',
      // page_title: hasKey(track, 'page_title') ? track["page_title"] : '美的美居',
      module: hasKey(selectParams, 'module') ? selectParams['module'] : '',
      page_id: hasKey(selectParams, 'page_id') ? selectParams['page_id'] : '',
      page_name: hasKey(selectParams, 'page_name') ? selectParams['page_name'] : '',
      api_name: hasKey(selectParams, 'api_name') ? selectParams['api_name'] : '',
      node_desc: hasKey(selectParams, 'node_desc') ? selectParams['node_desc'] : '',
      start_time: parseInt(Date.now()),
      ...custom,
      ext_info: {},
      // click_id: click_id || ''
    })
  }
}
export const getCommonParams = (commonParams, params) => {
  if (isEmptyObject(params)) return commonParams
  for (let key in params) {
    if (key == 'page_id') {
      commonParams[key] = params[key]
    }
    if (key == 'page_name') {
      commonParams[key] = params[key]
    }
    if (key == 'page_title') {
      commonParams[key] = params[key]
    }
  }
  return commonParams
}
export const getCustomParam = (selectMethod, commonParams, params) => {
  let result = new Object()
  Object.assign(result, commonParams, selectMethod)
  if (isEmptyObject(params)) return result
  Object.assign(result, commonParams, selectMethod)
  for (let key in params) {
    result[key] = params[key]
  }
  return result
}
//授权通用埋点 2021-05-06 start
export const authorizedCommonTrack = (event, widget_id, ext_info) => {
  const fullPath = getFullPageUrl()
  const commonParams = commonLogon[widget_id]
  const code = getApiCode(ext_info)
  const msg = getApiMsg(ext_info)
  const res = resData(ext_info)
  const reqData = getReqData(ext_info)
  if (event.indexOf('user_behavior_event') !== -1) {
    let ext_info = {
      mobile: getApp().globalData.phoneNumber || '',
      code: code,
      msg: msg, //接口返回成功或者失败
      resData: res,
    }
    if (
      widget_id == 'api_loginMuc' ||
      widget_id == 'api_login' ||
      widget_id == 'api_mobile_bindMuc' ||
      widget_id == 'api_mobile_bind' ||
      widget_id == 'api_mobile_decodeMuc' ||
      widget_id == 'api_mobile_decode' ||
      widget_id == 'api_getOpendId2Muc'
    ) {
      ext_info['if_sys'] = 1
    }
    if (widget_id == 'api_getOpendId2Muc') {
      ext_info['reqGetOpenIdChannel'] = getApp() && getApp().globalData.reqGetOpenIdChannel
    }
    const defaultData = {
      reqData,
      ...commonParams,
      module: '公共',

      page_module: '',
      rank: '',
      page_path: fullPath || '',
      object_type: '',
      object_id: '', //page/index/index?gdt_vid=122
      object_name: '',
      ext_info: ext_info,
    }
    if (widget_id === 'api_register_bind' || widget_id === 'click_btn_confirm') {
      // 获取罗盘 设备方向 电量 加速器等信息
      getDeviceInfo().then((data) => {
        const reportData = Object.assign({}, defaultData, data)
        rangersBurialPoint('user_behavior_event', reportData)
      })
      return
    }
    rangersBurialPoint('user_behavior_event', defaultData)
  } else if (event.indexOf('user_page_view') !== -1) {
    rangersBurialPoint('user_page_view', {
      ...commonParams,
      page_path: fullPath || '',
      // page_title: '美的美居',
      module: '公共',
      object_type: '',
      object_id: '',
      object_name: '',
      ext_info: '',
    })
  }
}
export const getApiCode = (ext_info) => {
  if (ext_info) {
    return hasKey(ext_info, 'code') ? ext_info['code'] : ''
  }
  return ''
}
export const getApiMsg = (ext_info) => {
  if (ext_info) {
    if (hasKey(ext_info, 'msg')) {
      return ext_info['msg'] || ''
    } else if (hasKey(ext_info, 'errMsg')) {
      return ext_info['errMsg'] || ''
    }
    return ''
  }
  return ''
}
export const resData = (ext_info) => {
  if (ext_info) {
    return hasKey(ext_info, 'resData') ? ext_info['resData'] : ''
  }
  return ''
}
export const getReqData = (ext_info) => {
  if (ext_info) {
    return hasKey(ext_info, 'reqData') ? ext_info['reqData'] : ''
  }
  return ''
}
//授权通用埋点 2021-05-06 end

// 上报用户传感器等数据
export const deviceInfoReport = (event, method, params = {}) => {
  getDeviceInfo().then((data) => {
    clickEventTracking(event, method, params, data)
  })
}

// 计算加载时间的埋点
export const trackLoaded = (event, keyName, res, apiFlag = 0, status) => {
  if (!checkIfLoadTrack(keyName, apiFlag)) return
  const custom = getCustom(res)
  const method = getMethod(keyName, apiFlag, status)
  clickEventTracking(event, method, {}, custom)
}
export const checkIfLoadTrack = (keyName, apiFlag) => {
  //0:不是接口，1是接口
  if (apiFlag === 1) {
    return loadApiList.includes(keyName) ? true : false
  }
  return true
}
export const getMethod = (keyName, apiFlag, status) => {
  //0:不是接口，1是接口
  if (apiFlag === 1) {
    return status === 'start' ? keyName + 'Start' : keyName + 'End'
  }
  return keyName
}
export const getCustom = (resp) => {
  if (resp) {
    if (hasKey(resp, 'data')) {
      const code = resp.data.code
      const msg = resp.data.msg
      return {
        code: code,
        msg: msg,
      }
    }
  }
  return {
    code: '',
    msg: resp || '',
  }
}
