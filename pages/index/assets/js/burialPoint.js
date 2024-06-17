import { rangersBurialPoint } from '../../../../utils/requestService'

/**
 * 插件曝光埋点
 */
const pluginAppearBurialPoint = function (params) {
  rangersBurialPoint('device_view', {
    module: '设备',
    page_name: '首页',
    tab_name: '设备',
    apptype_name: params.name,
    widget_cate: params.type,
  })
}

/**
 * 加入家庭结果埋点
 */
const joinResultBurialPoint = function (params) {
  rangersBurialPoint('interface_res_event', {
    intf_name: 'member_join_family',
    code: params.code,
    msg: params.msg,
    path: '/pages/index/index',
    invite_channel: params.channel,
  })
}

/**
 * 首页浏览埋点
 */
const indexViewBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    page_path: getCurrentPages()[0].route,
    page_title: '美的美居',
    module: '首页',
    page_id: 'page_home',
    page_name: '小程序首页',
    object_type: '家庭',
    object_id: params.familyId,
    object_name: params.familyName,
    ext_info: {
      is_red_dot: params.redDot,
      tab_name: params.tabName,
    },
  })
}
/**
 * 首页小程序首页-家庭下拉列表浏览埋点
 */
const indexHomerGroupListViewBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    page_id: 'page_home_family_list',
    page_name: '小程序首页-家庭下拉列表',
    module: '首页',
    widget_id: 'show_red_dot',
    widget_name: '展示红点',
    page_path: getCurrentPages()[0].route,
    object_type: '',
    object_id: '',
    object_name: '',
    ext_info: params.ext_info,
  })
}

/**
 * 点击切换家庭
 */
const clickSwitchFamilyBurialPoint = function (params) {
  rangersBurialPoint('user_behavior_event', {
    page_id: 'page_home',
    page_name: '小程序首页',
    module: '首页',
    page_path: getCurrentPages()[0].route,
    widget_id: 'click_bth_family',
    widget_name: '切换家庭',
    page_module: '',
    rank: '',
    object_type: '家庭',
    object_id: params.homeId,
    object_name: params.homeName,
    ext_info: {},
  })
}

/**
 * 点击打开插件埋点
 */
const clickOpenPluginBurialPoint = function (params) {
  console.log('点击打开插件埋点', params)
  rangersBurialPoint('user_behavior_event', {
    page_id: 'page_home',
    page_name: '小程序首页',
    module: '首页',
    page_path: getCurrentPages()[0].route,
    widget_id: 'click_btn_open_plugin',
    widget_name: '打开插件',
    page_module: '',
    rank: '',
    object_type: 'appliance',
    object_id: params.applianceCode,
    object_name: params.deviceName,
    plugin_type: params.pluginType,
    ext_info: {
      onlineStatus: params.onlineStatus,
      pluginType: params.pluginType,
      sn8: params.sn8,
    },
  })
}

//打开物模型插件埋点
const cardClickPluginBurialPoint = function (params) {
  rangersBurialPoint('user_behavior_event', {
    page_id: 'page_home',
    page_name: '首页',
    module: '公共',
    page_path: getCurrentPages()[0].route,
    widget_id: 'card_click',
    widget_name: '首页卡片点击上报',
    page_module: '',
    rank: '',
    object_type: 'smartProductID',
    object_id: params.smartProductId,
    object_name: params.deviceName,
    sn8: params.sn8,
    plugin_type: params.pluginType,
    ext_info: {
      applianceType: params.type || '',
      applianceCode: params.applianceCode || '',
      spid: 'params.smartProductId', //设备的SPID码
      plugin_type: params.pluginType, //品类编码
      plugin_type_name: '', //品类名称
      brand_name: '', //品牌名称
      appliance_name: params.deviceName, //设备名称
      appliance_model: '', //设备型号
      online_status: params.onlineStatus,
      is_support_current_device: params.is_support_current_device,
    },
  })
}

/**
 * 首页点击更多功能打开app下载页
 */
const clickIndexOpendAppBurialPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    page_id: 'page_home',
    page_name: '小程序首页',
    module: '首页',
    page_path: getCurrentPages()[0].route,
    widget_id: 'click_open_app',
    widget_name: '更多功能可以打开美居APP',
    page_module: '',
    rank: '',
    object_type: '',
    object_id: '',
    object_name: '',
    ext_info: {},
  })
}

/**
 * 首页切换tab埋点
 */
const clickTabSwitchBurialPoint = function (params) {
  rangersBurialPoint('user_behavior_event', {
    page_id: 'page_home',
    page_name: '小程序首页',
    module: '场景',
    page_path: getCurrentPages()[0].route,
    widget_id: 'switch_tab',
    widget_name: '首页tab切换',
    page_module: '',
    rank: '',
    object_type: 'tab',
    object_id: params.index + 1,
    object_name: params.name,
    ext_info: {},
  })
}

/**
 * 加入家庭结果弹框埋点
 */
const intoFamilyResultBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    page_path: getCurrentPages()[0].route,
    module: '家庭',
    page_id: params.page_id,
    page_name: params.page_name,
    object_type: params.invitedCode,
    object_id: params.invitedCode,
    object_name: params.tip,
    ext_info: {},
  })
}
/**
 * 修改设备弹窗 确认删除设备弹窗 设备所在房间列表页 浏览埋点
 */
const editAndDeleteApplianceViewBurialPoint = function (params) {
  console.log('浏览埋点', params)
  rangersBurialPoint('user_page_view', {
    page_path: getCurrentPages()[0].route,
    module: '设备卡片',
    page_id: params.page_id,
    page_name: params.page_name,
    object_type: 'appliance',
    object_id: params.applianceCode,
    object_name: params.name,
    ext_info: {
      onlineStatus: params.onlineStatus, //设备在线状态1在线/0离线
      pluginType: params.pluginType, //设备品类
      sn8: params.sn8, //SN8码
      is_support_current_device: params.isSupport, //设备是否支持小程序控制
      sn: params.sn,
      is_smart: params.is_smart,
      tsn: params.tsn || '',
      dsn: params.dsn || '',
      type: params.type || '',
    },
  })
}

/**
 * 首页删除编辑点击埋点
 */
const editAndDeleteApplianceClickBurialPoint = function (params) {
  console.log('首页删除编辑点击埋点', params)
  rangersBurialPoint('user_behavior_event', {
    page_path: getCurrentPages()[0].route,
    module: params.module ? '首页' : '设备卡片',
    page_id: params.page_id,
    page_name: params.page_name,
    page_module: '',
    widget_name: params.widget_name,
    widget_id: params.widget_id,
    rank: '',
    object_type: 'appliance',
    object_id: params.applianceCode,
    object_name: params.name,
    ext_info: {
      onlineStatus: params.onlineStatus, //设备在线状态1在线/0离线
      pluginType: params.pluginType, //设备品类
      sn8: params.sn8, //SN8码
      is_support_current_device: params.isSupport, //设备是否支持小程序控制
      sn: params.sn,
      is_smart: params.is_smart,
      tsn: params.tsn || '',
      dsn: params.dsn || '',
      type: params.type || '',
    },
  })
}
/**
 * 家庭权限弹窗埋点(操作设备)
 */
const checkFamilyPermissionBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    page_path: getCurrentPages()[0].route,
    module: '设备卡片',
    page_id: params.page_id,
    page_name: params.page_name,
    object_type: '设备',
    object_id: params.object_id,
    object_name: params.object_name,
    ext_info: {
      onlineStatus: params.onlineStatus, //设备在线状态1在线/0离线
      pluginType: params.pluginType, //设备品类
      sn8: params.sn8, //SN8码
      is_support_current_device: params.is_support_current_device, //设备是否支持小程序控制
      homegroup_id: params.homegroup_id, // 当前家庭id
    },
  })
}
/**
 * 家庭权限弹窗埋点(新增设备)
 */
const checkFamilyPermissionAddBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    page_path: getCurrentPages()[0].route,
    module: '设备卡片',
    page_id: 'pop_ord_memb_no_autr_add_appliance',
    page_name: '普通成员无权限添加设备弹窗',
    device_info: params && params.device_info,
  })
}

/**
 * 家庭权限弹窗埋点(新增设备)
 */
const clickFamilyManagement = function (params) {
  rangersBurialPoint('user_behavior_event', {
    page_path: getCurrentPages()[0].route,
    module: '首页',
    page_id: 'page_home_family_list',
    page_name: '小程序首页-家庭下拉列表',
    widget_name: '家庭管理',
    widget_id: 'click_bth_management',
  })
}
export {
  pluginAppearBurialPoint,
  joinResultBurialPoint,
  indexViewBurialPoint,
  clickSwitchFamilyBurialPoint,
  clickOpenPluginBurialPoint,
  clickIndexOpendAppBurialPoint,
  clickTabSwitchBurialPoint,
  indexHomerGroupListViewBurialPoint,
  intoFamilyResultBurialPoint,
  editAndDeleteApplianceViewBurialPoint,
  editAndDeleteApplianceClickBurialPoint,
  checkFamilyPermissionBurialPoint,
  checkFamilyPermissionAddBurialPoint,
  clickFamilyManagement,
  cardClickPluginBurialPoint,
}
