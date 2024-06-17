import { rangersBurialPoint } from '../../../../../utils/requestService'
import { getFullPageUrl } from '../../../../../utils/util'

/**
 * 页面载入时
 */

const virtualPluginEnterBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    module: '插件',
    page_id: 'page_non_smart_vitural_plugin',
    page_name: '非智能设备虚拟插件首页',
    page_path: params.page_path,
    sourceID: params.sourceID,
  })
}

// 成功调用登录接口及qrtext解析成功后
const virtualPluginBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    module: '插件',
    page_id: 'page_non_smart_vitural_plugin_success',
    page_name: '成功进入非智能设备虚拟插件首页',
    ...params,
  })
}

// 绑定家庭成功
const enterPluginBindSuccess = function (params) {
  rangersBurialPoint('user_behavior_event', {
    module: '插件',
    page_id: 'page_non_smart_vitural_plugin_success',
    page_name: '成功进入非智能设备虚拟插件首页',
    widget_name: '绑定家庭成功',
    widget_id: 'bind_family_success',
    ext_info: {
      if_sys: 1,
    },
    ...params,
  })
}
const familyPermissionBurialPoint = () => {
  rangersBurialPoint('user_page_view', {
    page_path: getFullPageUrl(),
    module: 'appliance',
    page_id: 'pop_ord_memb_no_autr_add_appliance',
    page_name: '普通成员无权限添加设备弹窗',
    device_info: {},
  })
}
export { virtualPluginEnterBurialPoint, virtualPluginBurialPoint, enterPluginBindSuccess, familyPermissionBurialPoint }
