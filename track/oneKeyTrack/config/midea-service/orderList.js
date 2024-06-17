const tracks = {
  path: 'midea-service/pages/orderList/orderList',
  commonParams: {
    page_id: 'page_progress_check',
    page_name: '进度查询页',
    module: '服务',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'clickResubmit',
      widget_id: 'click_resubmit',
      widget_name: '重新报单',
    },
    {
      method: 'clickCancel',
      widget_id: 'click_cancel_order',
      widget_name: '取消工单',
    },
    {
      method: 'clickEdit',
      widget_id: 'click_edit',
      widget_name: '补充信息',
    },
    {
      method: 'clickServicePoint',
      widget_id: 'click_service_point',
      widget_name: '查看网点',
    },
    {
      method: 'clickChangeTime',
      widget_id: 'click_change_time',
      widget_name: '改约时间',
    },
  ],
}

export default tracks
