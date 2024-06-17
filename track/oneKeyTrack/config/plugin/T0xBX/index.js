const tracks = {
  path: 'plugin/T0xBX/index/index',
  commonParams: {
    page_id: 'plugin_page_index',
    page_name: '设备控制',
    module: '小程序设备tab',
    // page_title: '我的'
  },
  methodTracks: [
    {
      method: 'onLoad',
    },
    {
      method: 'onModeButtonClicked',
      widget_id: 'click_btn_mode',
      widget_name: '模式按钮',
    },
    {
      method: 'onOperationalEntranceClicked',
      widget_id: 'click_btn_activity',
      widget_name: '运营入口按钮',
    },
  ],
}

export default tracks
