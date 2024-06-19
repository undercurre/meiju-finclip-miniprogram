import { rangersBurialPoint } from '../../../../../../utils/requestService'
import { getFullPageUrl } from 'm-miniCommonSDK/index'

export const burialPoint = {

  /**
 * 点击 扫描wifi二维码 
 */
  clickScanCode: (params) => {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'retrieve_wifi_password',
      page_name: '如何找回wifi密码说明页',
      widget_id: 'Scan_wifi_QR	',
      widget_name: '扫描wifi二维码',
      open_id: '',
      page_path: getFullPageUrl(),
      object_type: '',
      object_id: '',
      click_id: '',
      object_name: '',
      page_title: '',
      device_info: {
        device_session_id: params.deviceSessionId, // 一次配网事件标识
        wifi_model_version: params.moduleVison, // 模组wifi版本
        iot_device_id: params.deviceId, // 设备id
        link_type: params.linkType || 'bluetooth', // 连接方式 bluetooth/ap/...
        sn: params.sn, // sn码
        sn8: params.sn8, // sn8码
        widget_cate: params.type, // 设备品类
        a0: params.type, //a0码
        product_model:'',//设备型号
      },
      ext_info: {},
    })
  },


  /**
   * 点击 手机品牌切换
  */
  switchBrand: (params) => {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      page_id: 'retrieve_wifi_password',
      page_name: '如何找回wifi密码说明页',
      widget_id: 'Switching_phone_buttom',
      widget_name: '切换手机品牌',
      open_id: '',
      page_path: getFullPageUrl(),
      object_type: '',
      object_id: '',
      click_id: '',
      object_name: '',
      page_title: '',
      device_info: {
        device_session_id: params.deviceSessionId, // 一次配网事件标识
        wifi_model_version: params.moduleVison, // 模组wifi版本
        iot_device_id: params.deviceId, // 设备id
        link_type: params.linkType || 'bluetooth', // 连接方式 bluetooth/ap/...
        sn: params.sn, // sn码
        sn8: params.sn8, // sn8码
        widget_cate: params.type, // 设备品类
        a0: params.type, //a0码
        product_model:'',//设备型号
      },
      ext_info: {},
    })
  },

  /**
   * 弹出“该二维码不是wifi二维码”
  */
  isNotQRcode: (params) => {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'retrieve_wifi_password',
      page_name: '如何找回wifi密码说明页',
      widget_id: 'Not _QR code_windows',
      widget_name: '该二维码不是wifi二维码的弹窗',
      open_id: '',
      page_path: getFullPageUrl(),
      object_type: '',
      object_id: '',
      click_id: '',
      object_name: '',
      page_title: '',
      device_info: {
        device_session_id: params.deviceSessionId, // 一次配网事件标识
        wifi_model_version: params.moduleVison, // 模组wifi版本
        iot_device_id: params.deviceId, // 设备id
        link_type: params.linkType || 'bluetooth', // 连接方式 bluetooth/ap/...
        sn: params.sn, // sn码
        sn8: params.sn8, // sn8码
        widget_cate: params.type, // 设备品类
        a0: params.type, //a0码
        product_model:'',//设备型号
      },
      ext_info: {},
    })
  },

  /**
   * 弹出“wifi名称与...不一致”
  */
  wifiNameInconsistent: (params) => {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'retrieve_wifi_password',
      page_name: '如何找回wifi密码说明页',
      widget_id: 'wifi_name_inconformity',
      widget_name: 'wifi名称不一致的弹窗',
      open_id: '',
      page_path: getFullPageUrl(),
      object_type: '',
      object_id: '',
      click_id: '',
      object_name: '',
      page_title: '',
      device_info: {
        device_session_id: params.deviceSessionId, // 一次配网事件标识
        wifi_model_version: params.moduleVison, // 模组wifi版本
        iot_device_id: params.deviceId, // 设备id
        link_type: params.linkType || 'bluetooth', // 连接方式 bluetooth/ap/...
        sn: params.sn, // sn码
        sn8: params.sn8, // sn8码
        widget_cate: params.type, // 设备品类
        a0: params.type, //a0码
        product_model:'',//设备型号
      },
      ext_info: {},
    })
  },
  /**
   * 弹出“未找到二维码”
  */
  isNotFoundQRcode: (params) => {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'retrieve_wifi_password',
      page_name: '如何找回wifi密码说明页',
      widget_id: 'Not _QR code_windows',
      widget_name: '未找到二维码的弹窗',
      open_id: '',
      page_path: getFullPageUrl(),
      object_type: '',
      object_id: '',
      click_id: '',
      object_name: '',
      page_title: '',
      device_info: {
        device_session_id: params.deviceSessionId, // 一次配网事件标识
        wifi_model_version: params.moduleVison, // 模组wifi版本
        iot_device_id: params.deviceId, // 设备id
        link_type: params.linkType || 'bluetooth', // 连接方式 bluetooth/ap/...
        sn: params.sn, // sn码
        sn8: params.sn8, // sn8码
        widget_cate: params.type, // 设备品类
        a0: params.type, //a0码
        product_model:'',//设备型号
      },
      ext_info: {},
    })
  },

}
