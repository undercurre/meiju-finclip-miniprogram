const tracks = {
  path: 'pages/midea-service/midea-service',
  commonParams: {
    page_id: 'page_service',
    page_name: '服务中心首页',
    module: '服务',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'onShow',
      widget_id: '',
      widget_name: '',
    },
    {
      method: 'goServicePhone',
      widget_id: 'click_btn_service',
      widget_name: '客服',
    },
    {
      method: 'goInstall',
      widget_id: 'click_btn_install',
      widget_name: '安装服务',
    },
    {
      method: 'goMaintenance',
      widget_id: 'click_btn_maintain',
      widget_name: '维修服务',
    },
    {
      method: 'goUpkeep',
      widget_id: 'click_btn_maintenance',
      widget_name: '保养服务',
    },
    {
      method: 'goProgress',
      widget_id: 'click_btn_progress',
      widget_name: '进度查询',
    },
    {
      method: 'gotoICSpecification',
      widget_id: 'click_btn_guide_book',
      widget_name: '电子说明书',
    },
    {
      method: 'goFaultInspection',
      widget_id: 'click_btn_self_check',
      widget_name: '故障自查',
    },
    {
      method: 'goBranchList',
      widget_id: 'click_btn_servicepoints',
      widget_name: '服务网点',
    },
    {
      method: 'goChargeStandard',
      widget_id: 'click_btn_fees_standard',
      widget_name: '收费标准',
    },
    {
      method: 'goWarrantyPolicy',
      widget_id: 'click_btn_warranty',
      widget_name: '保修政策',
    },
    {
      method: 'gotoNearShop',
      widget_id: 'click_btn_store',
      widget_name: '附近门店',
    },
    {
      method: 'trackTab',
      dataKeys: ['pageText.switch_tab'],
      page_id: 'page_bottom_tab',
      widget_id: 'switch_tab',
      module: '公共',
      widget_name: '底部tab切换',
      object_type: 'tab',
      object_id: '2',
      object_name: '服务',
    },
  ],
}

export default tracks
