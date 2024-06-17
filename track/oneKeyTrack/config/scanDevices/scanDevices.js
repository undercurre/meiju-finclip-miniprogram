const tracks = {
  path: 'distribution-network/scan-devices/pages/scan-device/scan-device',
  commonParams: {
    page_id: 'page_add_appliance',
    page_name: '添加设备页',
    // module: 'appliance',
    // page_title: '首扫码添加设备页'
  },
  elementTracks: [
    {
      element: '.test',
      dataKeys: ['data.id'],
    },
  ],
  methodTracks: [
    {
      method: 'onShow',
      dataKeys: ['pageText.page_scan_add_appliance'],
      widget_id: '',
      module: 'appliance',
      widget_name: '',
    },
    // {
    //   method: 'goHelp',
    //   dataKeys: ['pageText.appliance_help'],
    //   widget_id: 'click_appliance_help',
    //   module: 'appliance',
    //   widget_name: '扫描不到设备怎么办'
    // },
    {
      method: 'goNetwork',
      dataKeys: ['pageText.click_found_appliance'],
      widget_id: 'click_found_appliance',
      module: 'appliance',
      widget_name: '附近设备icon',
    },
    {
      method: 'trackClickScan',
      dataKeys: ['pageText.click_scan_add'],
      widget_id: 'click_scan_add',
      module: 'appliance',
      widget_name: '扫码添加设备',
    },
    {
      method: 'trackViewScan',
      dataKeys: ['pageText.click_found_appliance'],
      widget_id: '',
      module: 'appliance',
      widget_name: '',
      page_id: 'page_scan_add_appliance',
      page_name: '扫码添加设备页',
    },
    {
      method: 'trackScanResult',
      dataKeys: ['pageText.add_appliance_scan_result'],
      widget_id: 'add_appliance_scan_result',
      module: 'appliance',
      widget_name: '扫码添加设备结果',
      page_id: 'page_scan_add_appliance',
      page_name: '扫码添加设备页',
      object_type: '二维码链接',
    },
    {
      method: 'goScanHelp',
      dataKeys: ['pageText.page_add_appliance'],
      widget_id: 'click_unfound_appliance',
      module: 'appliance',
      widget_name: '搜索不到设备',
      page_id: 'page_add_appliance',
      page_name: '添加设备页',
    },
    {
      method: 'serverGuideResult',
      dataKeys: ['pageText.page_add_appliance'],
      widget_id: 'server_return',
      module: 'appliance',
      widget_name: '服务器返回',
      page_id: 'device_guidebook_page',
      page_name: '配网指引返回结果',
    },
    {
      method: 'scanCodeNotSuppotr',
      dataKeys: ['pageText.popups_scan_not_support'],
      widget_id: '',
      module: 'appliance',
      widget_name: '',
      page_id: 'popups_scan_not_support',
      page_name: '扫码不支持小程序配网弹窗',
    },
  ],
}

export default tracks
