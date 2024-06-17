const tracks = {
  path: 'midea-service/pages/faultCheck/faultCheck',
  commonParams: {
    page_id: 'page_self_check',
    page_name: '故障自查页',
    module: '服务',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'clickSelfCheckProb',
      widget_id: 'click_self_check_prob',
      widget_name: '故障类型',
      page_module: '设备故障自查列表',
    },
    {
      method: 'clickProMaintain',
      widget_id: 'click_pro_maintain',
      widget_name: '去报修',
      page_module: '专业人员维修故障',
    },
  ],
}

export default tracks
