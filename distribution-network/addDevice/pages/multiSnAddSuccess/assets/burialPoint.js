import { rangersBurialPoint } from '../../../../../utils/requestService'

export const burialPoint = {
  /**
   * 成功下发授权指令时
   */
   multipleSnConnectedSuccessful: (params) => {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'multiple_sn_connected_successful',
      page_name: '多SN联网成功',
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
   * 点击设置按钮
   */
   multipleSnSet: (params) => {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      widget_id: 'multiple_sn_connected_successful_set',
      widget_name: '多SN联网成功设置按钮',
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
