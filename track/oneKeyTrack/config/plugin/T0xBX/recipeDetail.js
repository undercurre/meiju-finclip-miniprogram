const tracks = {
  path: 'plugin/T0xBX/recipeDetail/recipeDetail',
  commonParams: {
    page_id: 'plugin_page_recipe_detail',
    page_name: '食谱详情',
  },
  methodTracks: [
    {
      method: 'onLoad',
    },
    {
      method: 'onFooterButtonClicked',
      widget_id: 'click_btn_footer',
      widget_name: '页面底部按钮',
    },
  ],
}

export default tracks
