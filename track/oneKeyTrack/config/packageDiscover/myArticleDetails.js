const tracks = {
  path: 'packageDiscover/pages/myArticleDetails/myArticleDetails',
  commonParams: {
    module: '发现',
  },
  elementTracks: [],
  methodTracks: [
    {
      method: 'clickCard',
      page_id: 'page_discover_detail',
      page_name: '内容详情页',
      page_module: '好物推荐',
      widget_name: 'click_goods_card',
      widget_id: '商品卡片',
      object_type: '商品',
    },
    {
      method: 'clickAllTitle',
      page_id: 'page_discover_detail',
      page_name: '内容详情页',
      page_module: '好物推荐',
      widget_name: 'click_all_goods',
      widget_id: '查看全部推荐',
    },
    {
      method: 'clickCardItem',
      page_id: 'page_goods_rec_pop',
      page_name: '好物推荐弹窗',
      // page_module: '好物推荐',
      widget_name: 'click_goods_card',
      widget_id: '商品卡片',
      object_type: '商品',
    },
    {
      method: 'clickCardItemClosed',
      page_id: 'page_goods_rec_pop',
      page_name: '好物推荐弹窗',
      // page_module: '好物推荐',
      widget_name: 'click_close',
      widget_id: '关闭',
    },
    {
      method: 'toastShowView',
      page_id: 'page_discover_detail_all_goods',
      page_name: '内容详情页-查看全部推荐',
    },
    {
      method: 'toastShow',
      page_id: 'page_goods_rec_pop',
      page_name: '好物推荐弹窗',
    },
    {
      method: 'clickMoreComments',
      page_id: 'page_discover_detail',
      page_name: '内容详情页',
      widget_id: 'click_fold_comment',
      widget_name: '被折叠评论',
      rank: '',
      device_info: '',
      ext_info: '',
    },
  ],
}

export default tracks
