import { rangersBurialPoint } from '../../../../utils/requestService'
import { getFullPageUrl } from '../../../../utils/util.js'

export const burialPoint = {
  /**
   * 来自首页的下载页面浏览埋点
   */
  fmIndexDowmPageView: () => {
    rangersBurialPoint('user_page_view', {
      page_path: getCurrentPages()[0].route,
      page_title: '下载美的美居App',
      module: '首页',
      page_id: 'page_save_qrcode',
      page_name: '保存二维码下载页',
      object_type: '',
      object_id: '',
      object_name: '',
      ext_info: {
        refer_page_path: getFullPageUrl('prev'),
      },
    })
  },
  /**
   * 来自首页的点击保存二维码埋点
   */
  fmIndexSaveQcode: () => {
    rangersBurialPoint('user_behavior_event', {
      page_id: 'page_save_qrcode',
      page_name: '保存二维码下载页',
      module: '首页',
      page_path: getCurrentPages()[0].route,
      widget_id: 'click_btn_save_album',
      widget_name: '保存二维码到相册',
      page_module: '',
      rank: '',
      object_type: '',
      object_id: '',
      object_name: '',
      ext_info: {
        refer_page_path: getFullPageUrl('prev'),
      },
    })
  },
}
