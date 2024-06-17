const tracks = {
  path: 'midea-service/pages/serviceChargeTypes/serviceChargeTypes',
  commonParams: {
    page_id: 'page_fees_standard',
    page_name: '收费标准页',
    module: '服务',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'clickCategoty',
      widget_id: 'click_category',
      widget_name: '收费一级分类',
    },
  ],
}

export default tracks
