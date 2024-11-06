import { rangersBurialPoint } from '../../../../../utils/requestService'

export const burialPoint = {
  /**
     * 失败页面浏览埋点
     */
  multiSnFailView: (params) => {
    rangersBurialPoint('user_page_view', {
      module: 'appliance',
      page_id: 'multiple_sn_connected_failure',
      page_name: '多SN联网失败',
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
