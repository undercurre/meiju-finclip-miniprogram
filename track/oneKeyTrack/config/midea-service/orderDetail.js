const tracks = {
  path: 'midea-service/pages/orderDetail/orderDetail',
  commonParams: {
    page_id: 'page_order_detail',
    page_name: '工单详情页',
    module: '服务',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'clickCharges',
      widget_id: 'click_charges',
      widget_name: '收费标准',
    },
    {
      method: 'clickReportAgain',
      widget_id: 'click_report_again',
      widget_name: '重新上报',
    },
    {
      method: 'clickCancelOrder',
      widget_id: 'click_cancel_order',
      widget_name: '取消工单',
    },
    {
      method: 'clickEdit',
      widget_id: 'click_edit',
      widget_name: '补充信息',
    },
    {
      method: 'clikcLatestProgress',
      widget_id: 'click_latest_progress',
      widget_name: '最新进度',
    },
    {
      method: 'clickChangeTime',
      widget_id: 'click_change_time',
      widget_name: '改约时间',
    },
  ],
}

export default tracks
