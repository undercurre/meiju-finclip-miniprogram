const tracks = {
  path: 'distribution-network/scan-devices/pages/scan-help/scan-help',
  commonParams: {
    page_id: 'page_unfound_appliance',
    page_name: '搜索不到设备页',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'onShow',
      dataKeys: ['pageText.page_unfound_appliance'],
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
      widget_name: '扫码添加',
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
  ],
}

export default tracks
