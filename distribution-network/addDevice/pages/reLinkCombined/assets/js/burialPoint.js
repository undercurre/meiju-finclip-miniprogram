import { rangersBurialPoint } from '../../../../../../utils/requestService'
import { getFullPageUrl } from 'm-miniCommonSDK/index'
const app = getApp()

export const burialPoint = {
  /**
   * 组合成功页面曝光埋点
   */
  combinedSuccessView: (params) => {
    rangersBurialPoint('user_page_view', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'combined_device_success_page',
      page_name: '组合成功页',
      widget_id: '',
      widget_name: '',
      rank: '',
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        sn: params.plainSn, //sn码
        sn8: params.sn8, //sn8码
        a0: params.a0, //a0码
        widget_cate: params.type, //设备品类
        wifi_model_version: app.addDeviceInfo.moduleVersion || '', //上报模组版本
        link_type: '', //连接方式
        iot_device_id: '', //设备id
        product_model: '' //设备型号
      },
    })
  },
  /**
   * 组合进度页面浏览埋点
   */
  combinedDeviceView: (params) => {
    rangersBurialPoint('user_page_view', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: params.pageId || 'combined_device_networking_page',
      page_name: params.pageName || '辅设备联网页',
      widget_id: '',
      widget_name: '',
      rank: '',
      ext_info: {
        entrance: params.entrance || ''
      },
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        sn: params.plainSn, //sn码
        sn8: params.sn8, //sn8码
        a0: params.a0, //a0码
        widget_cate: params.type, //设备品类
        wifi_model_version: app.addDeviceInfo.moduleVersion || '', //上报模组版本
        link_type: '', //连接方式
        iot_device_id: '', //设备id
        product_model: '' //设备型号
      },
    })
  },
  /**
   * 放弃添加设备弹窗
   */
  abandonAddDialogView: (params) => {
    rangersBurialPoint('user_page_view', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'combined_device_networking_cancel_popup',
      page_name: '组合设备联网页-取消联网二次确认弹窗',
      widget_id: '',
      widget_name: '',
      rank: '',
      ext_info: {
        entrance: params.entrance || ''
      },
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        sn: params.plainSn, //sn码
        sn8: params.sn8, //sn8码
        a0: params.a0, //a0码
        widget_cate: params.type, //设备品类
        wifi_model_version: app.addDeviceInfo.moduleVersion || '', //上报模组版本
        link_type: '', //连接方式
        iot_device_id: '', //设备id
        product_model: '' //设备型号
      },
    })
  },

  /**
   * 放弃添加设备弹窗 点击再等等
   */
  clickWaitAminuteDialog: (params) => {
    rangersBurialPoint('user_behavior_event', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'combined_device_networking_cancel_popup',
      page_name: '组合设备联网页-取消联网二次确认弹窗',
      widget_id: 'wait_buttom',
      widget_name: '再等等按钮',
      rank: '',
      ext_info: {
        entrance: params.entrance || ''
      },
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        sn: params.plainSn, //sn码
        sn8: params.sn8, //sn8码
        a0: params.a0, //a0码
        widget_cate: params.type, //设备品类
        wifi_model_version: app.addDeviceInfo.moduleVersion || '', //上报模组版本
        link_type: '', //连接方式
        iot_device_id: '', //设备id
        product_model: '' //设备型号
      },
    })
  },
  /**
   * 放弃添加设备弹窗 点击放弃添加
   */
  clickCancelAbandonDialog: (params) => {
    rangersBurialPoint('user_behavior_event', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'combined_device_networking_cancel_popup',
      page_name: '组合设备联网页-取消联网二次确认弹窗',
      widget_id: 'quit_buttom',
      widget_name: '放弃添加按钮',
      rank: '',
      ext_info: {
        entrance: params.entrance || ''
      },
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        sn: params.plainSn, //sn码
        sn8: params.sn8, //sn8码
        a0: params.a0, //a0码
        widget_cate: params.type, //设备品类
        wifi_model_version: app.addDeviceInfo.moduleVersion || '', //上报模组版本
        link_type: '', //连接方式
        iot_device_id: '', //设备id
        product_model: '' //设备型号
      },
    })
  },

  /**
   * 组合失败弹窗
   */
  combinedFailDialogView: (params) => {
    rangersBurialPoint('user_page_view', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'combined_failed_popup',
      page_name: '组合失败提示弹窗',
      widget_id: '',
      widget_name: '',
      rank: '',
      ext_info: {
        entrance: params.entrance || ''
      },
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        sn: params.plainSn, //sn码
        sn8: params.sn8, //sn8码
        a0: params.a0, //a0码
        widget_cate: params.type, //设备品类
        wifi_model_version: app.addDeviceInfo.moduleVersion || '', //上报模组版本
        link_type: '', //连接方式
        iot_device_id: '', //设备id
        product_model: '' //设备型号
      },
    })
  },
  /**
   * 组合失败弹窗 点击重试
   */
  clickRetryFailDialog: (params) => {
    rangersBurialPoint('user_behavior_event', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'combined_failed_popup',
      page_name: '组合失败提示弹窗',
      widget_id: 'retry_buttom',
      widget_name: '重试按钮',
      rank: '',
      ext_info: {
        entrance: params.entrance || ''
      },
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        sn: params.plainSn, //sn码
        sn8: params.sn8, //sn8码
        a0: params.a0, //a0码
        widget_cate: params.type, //设备品类
        wifi_model_version: app.addDeviceInfo.moduleVersion || '', //上报模组版本
        link_type: '', //连接方式
        iot_device_id: '', //设备id
        product_model: '' //设备型号
      },
    })
  },
  /**
   * 组合失败弹窗 点击取消
   */
  clickCancelFailDialog: (params) => {
    rangersBurialPoint('user_behavior_event', {
      page_path: getFullPageUrl(),
      module: 'appliance',
      page_id: 'combined_failed_popup',
      page_name: '组合失败提示弹窗',
      widget_id: 'cancel_buttom',
      widget_name: '取消按钮',
      rank: '',
      ext_info: {
        entrance: params.entrance || ''
      },
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        sn: params.plainSn, //sn码
        sn8: params.sn8, //sn8码
        a0: params.a0, //a0码
        widget_cate: params.type, //设备品类
        wifi_model_version: app.addDeviceInfo.moduleVersion || '', //上报模组版本
        link_type: '', //连接方式
        iot_device_id: '', //设备id
        product_model: '' //设备型号
      },
    })
  }
}