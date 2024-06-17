const tracks = {
  path: 'midea-service/pages/upkeep/upkeep',
  commonParams: {
    page_id: 'page_service_maintenance',
    page_name: '保养服务页',
    module: '服务',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'clickServiceCharge',
      widget_id: 'click_btn_price',
      widget_name: '收费标准',
    },
    {
      method: 'clickSubmit',
      widget_id: 'click_btn_submit',
      widget_name: '提交',
    },
  ],
}

export default tracks
