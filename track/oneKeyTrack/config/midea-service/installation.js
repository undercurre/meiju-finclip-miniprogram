const tracks = {
  path: 'midea-service/pages/installation/installation',
  commonParams: {
    page_id: 'page_install_service',
    page_name: '安装服务页',
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
      method: 'clickSubmit',
      widget_id: 'click_submit',
      widget_name: '提交',
    },
  ],
}

export default tracks
