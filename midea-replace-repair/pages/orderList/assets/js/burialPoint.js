import { rangersBurialPoint } from '../../../../../utils/requestService'
/**
 * 页面载入时
 */

const virtualPluginEnterBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    module: '插件',
    page_id: 'page_non_smart_vitural_plugin',
    page_name: '非智能设备虚拟插件首页',
    page_path: params.page_path,
  })
}

// 成功调用登录接口及qrtext解析成功后
const virtualPluginBurialPoint = function (params) {
  rangersBurialPoint('user_page_view', {
    module: '插件',
    page_id: 'page_non_smart_vitural_plugin_success',
    page_name: '成功进入非智能设备虚拟插件首页',
    page_path: params.page_path,
    ext_info: params.ext_info,
    widget_id: params.loginStatus, //补
    widget_name: params.widget_name, //补
  })
}

export { virtualPluginEnterBurialPoint, virtualPluginBurialPoint }
