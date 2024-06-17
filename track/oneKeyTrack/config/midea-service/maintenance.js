const tracks = {
  path: 'midea-service/pages/maintenance/maintenance',
  commonParams: {
    page_id: 'page_maintain_service',
    page_name: '维修服务页',
    module: '服务',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'clickCharges',
      widget_id: 'click_btn_price',
      widget_name: '收费标准',
    },
    {
      method: 'clickSubmit',
      widget_id: 'click_submit',
      widget_name: '提交',
    },
  ],
}

export default tracks
