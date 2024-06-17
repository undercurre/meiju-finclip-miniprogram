/*
 * @desc: 卡片埋点
 * @author: zhucc22
 * @Date: 2024-03-11 10:42:36
 */
const rangersBurialPoint = getApp().getGlobalConfig().rangersBurialPoint
const indexClickPoint = function (params) {
  rangersBurialPoint('user_behavior_event', {
    page_path: getCurrentPages()[0].route,
    page_module: '首页设备卡片',
    module: '公共',
    page_id: 'page_home',
    page_name: '首页',
    widget_id: params.requestKey,
    widget_name: params.requestValue,
    object_type: 'smartProductID',
    object_id: params.smartProductId,
    ext_info: {
      applianceType: params.type || '',
      applianceCode: params.applianceCode || '',
    },
  })
}

export { indexClickPoint }
