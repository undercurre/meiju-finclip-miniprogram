const tracks = {
  path: 'midea-service/pages/serviceWarranty/serviceWarranty',
  commonParams: {
    page_id: 'page_warranty_service',
    page_name: '保修政策页',
    module: '服务',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'checkRequest',
      widget_id: 'check_request',
      widget_name: '提交请求查询',
    },
  ],
}

export default tracks
