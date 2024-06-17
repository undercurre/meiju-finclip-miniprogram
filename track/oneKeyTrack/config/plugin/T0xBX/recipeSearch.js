const tracks = {
  path: 'plugin/T0xBX/recipeSearch/recipeSearch',
  commonParams: {
    page_id: 'plugin_page_recipe_search',
    page_name: '食谱搜索',
    module: '设备面板',
  },
  methodTracks: [
    {
      method: 'onLoad',
    },
    {
      method: 'onCardClicked',
      widget_id: 'click_recipe_card',
      widget_name: '食谱卡片',
    },
  ],
}

export default tracks
