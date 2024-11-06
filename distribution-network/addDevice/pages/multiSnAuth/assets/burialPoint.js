import { rangersBurialPoint } from '../../../../../utils/requestService'

export const burialPoint = {
  /**
   * 页面浏览埋点
   */
  multiSnAuthView: (params) => {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'multiple_sn_authorize',
      page_name: '多SN授权页面',
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        tsn: params.tsn,
        sn8: params.sn8, //sn8码
        widget_cate: params.type, //设备品类
        link_type: params.link_type || 'bluetooth', //连接方式 bluetooth/ap/...
      },
    })
  },

  /**
   * 点击埋点
   */
  clickAuthBtn: (params) => {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      widget_id: 'multiple_sn_authorize_button',
      widget_name: '多SN授权按钮',
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        tsn: params.tsn,
        sn8: params.sn8, //sn8码
        widget_cate: params.type, //设备品类
        link_type: params.link_type || 'bluetooth', //连接方式 bluetooth/ap/...
      },
    })
  },

  /**
   * 点击埋点
   */
   AuthSuccessBurialPoint: (params) => {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      widget_id: 'issue_authorize_instruction',
      widget_name: '下发授权指令成功',
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        tsn: params.tsn,
        sn8: params.sn8, //sn8码
        widget_cate: params.type, //设备品类
        link_type: params.link_type || 'bluetooth', //连接方式 bluetooth/ap/...
      },
    })
  },


  /**
   * 点击取消授权按钮
   */
  cancleAuthClick: (params) => {
    rangersBurialPoint('user_behavior_event', {
      module: 'appliance',
      widget_id: 'multiple_sn_cancel_authorize_button',
      widget_name: '多SN取消授权按钮',
      device_info: {
        device_session_id: params.deviceSessionId, //一次配网事件标识
        tsn: params.tsn,
        sn8: params.sn8, //sn8码
        widget_cate: params.type, //设备品类
        link_type: params.link_type || 'bluetooth', //连接方式 bluetooth/ap/...
      },
    })
  },
}
