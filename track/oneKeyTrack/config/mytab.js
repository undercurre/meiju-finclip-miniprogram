const tracks = {
  path: 'pages/mytab/mytab',
  commonParams: {
    page_id: 'page_personal',
    page_name: '个人中心',
    module: '个人中心',
    // page_title: '我的'
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'gotoSign',
      dataKeys: ['pageText.signText', 'pageText.callback'],
      widget_id: 'click_btn_sign',
      widget_name: '签到',
    },
    {
      method: 'burdpointFeedback',
      dataKeys: ['pageText.callback'],
      widget_id: 'click_btn_sugesstion',
      widget_name: '建议反馈',
    },
    {
      method: 'gotoDownload',
      dataKeys: ['pageText.download'],
      widget_id: 'click_btn_download_app',
      widget_name: '下载美的美居APP',
    },
    {
      method: 'burdpointInvitation',
      dataKeys: ['pageText.invite'],
      widget_id: 'click_btn_invite_member',
      widget_name: '邀请成员',
    },
    {
      method: 'showMessage',
      dataKeys: ['pageText.invite'],
      widget_id: 'click_btn_invite_member',
      widget_name: '邀请成员',
    },
    {
      method: 'goToAbout',
      dataKeys: ['pageText.aboutmeiju'],
      widget_id: 'click_btn_about_meiju',
      widget_name: '关于美的美居',
    },
    {
      method: 'switchAccount',
      dataKeys: ['pageText.changeAccount'],
      widget_id: 'click_btn_change_account',
      widget_name: '切换账户',
    },
    {
      method: 'trackTab',
      dataKeys: ['pageText.switch_tab'],
      page_id: 'page_bottom_tab',
      widget_id: 'switch_tab',
      module: '公共',
      widget_name: '底部tab切换',
      object_type: 'tab',
      object_id: '4',
      object_name: '我的',
    },
  ],
}

export default tracks
