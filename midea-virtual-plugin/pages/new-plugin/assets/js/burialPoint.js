import { rangersBurialPoint } from '../../../../../utils/requestService'
import { clickEventTracking } from '../../../../../track/track.js'
import { getFullPageUrl } from '../../../../../utils/util'

/**
 * 页面载入时
 */
const virtualPluginEnterBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    module: '插件',
    page_id: 'page_non_smart_vitural_plugin',
    page_name: '非智能设备虚拟插件首页',
    ...params,
  })
}

// 成功调用接口及tsn/dsn/type解析成功后
const virtualPluginBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    page_path: getFullPageUrl(),
    module: '插件',
    page_id: 'page_non_smart_vitural_plugin_success',
    page_name: '成功进入非智能设备虚拟插件首页',
    ...params,
  })
}
const enterPluginBindSuccess = function (params) {
  rangersBurialPoint('user_behavior_event', {
    module: '插件',
    page_id: 'page_non_smart_vitural_plugin_success',
    page_name: '成功进入非智能设备虚拟插件首页',
    widget_name: '绑定家庭成功',
    widget_id: 'bind_family_success',
    // ext_info:{
    //   if_sys:1,
    // },
    ...params,
  })
}
const commonPluginClicks = function (params) {
  rangersBurialPoint('user_behavior_event', {
    module: '非智设备页面',
    page_id: 'page_non_smart_vitural_plugin',
    page_name: '非智设备扫码进入页面',
    page_path: getFullPageUrl(),
    ...params,
  })
}
//添加企业微信弹窗
const enterAddOfficeWechat = function (params) {
  clickEventTracking('user_page_view', 'enterAddOfficeWechat', {
    ...params,
  })
}
//登记365代修活动信息业
const enterRegisterInformation = function (params) {
  clickEventTracking('user_page_view', 'enterRegisterInformation', {
    ...params,
  })
}
//点击联系我
const clickWechatContact = function (params) {
  clickEventTracking('user_behavior_event', 'clickWechatContact', {
    ...params,
  })
}
//点击按钮关闭微企弹窗
const clickWechatClose = function (params) {
  clickEventTracking('user_behavior_event', 'clickWechatClose', {
    ...params,
  })
}
//点击空白关闭微企弹窗
const clickWechatBlankClose = function (params) {
  clickEventTracking('user_behavior_event', 'clickWechatBlankClose', {
    ...params,
  })
}
//点击按钮关闭登记信息页面弹窗
const clickInformationClose = function (params) {
  clickEventTracking('user_behavior_event', 'clickInformationClose', {
    ...params,
  })
}
//点击提交信息按钮
const clickSumbitInformation = function (params) {
  clickEventTracking('user_behavior_event', 'clickSumbitInformation', {
    ...params,
  })
}
//点击提交图片购买凭证
const clickChoosePic = function (params) {
  clickEventTracking('user_behavior_event', 'clickChoosePic', {
    ...params,
  })
}
//点击选择购买时间
const clickChooseDate = function (params) {
  clickEventTracking('user_behavior_event', 'clickChooseDate', {
    ...params,
  })
}
//点击服务地址
const clickChooseAddress = function (params) {
  clickEventTracking('user_behavior_event', 'clickChooseAddress', {
    ...params,
  })
}

//点击扫码
const clickScanCode = function (params) {
  clickEventTracking('user_behavior_event', 'clickScanCode', {
    ...params,
  })
}
//点击跳转服务小程序
const clickAndGoToServiceMiniProgram = function (params) {
  rangersBurialPoint('user_behavior_event', {
    page_id: 'page_non_smart_vitural_plugin',
    module: '非智设备页面',
    page_name: '非智设备扫码进入页面',
    page_path: getFullPageUrl(),
    page_module: '',
    widget_name: '服务中心',
    widget_id: 'click_service_center',
    object_id: '',
    ...params,
  })
}
export {
  virtualPluginEnterBurialPoint,
  virtualPluginBurialPoint,
  enterPluginBindSuccess,
  commonPluginClicks,
  enterAddOfficeWechat,
  enterRegisterInformation,
  clickWechatContact,
  clickWechatClose,
  clickWechatBlankClose,
  clickInformationClose,
  clickSumbitInformation,
  clickChoosePic,
  clickChooseDate,
  clickChooseAddress,
  clickScanCode,
  clickAndGoToServiceMiniProgram,
}
