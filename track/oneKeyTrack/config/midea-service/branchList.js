const tracks = {
  path: 'midea-service/pages/branchList/branchList',
  commonParams: {
    page_id: 'page_service_point',
    page_name: '网点查询页',
    module: '服务',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'clickGoHere',
      widget_id: 'click_go_here',
      widget_name: '到这去',
    },
  ],
}

export default tracks
