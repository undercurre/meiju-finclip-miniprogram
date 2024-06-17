import { rangersBurialPoint } from '../../../../../../utils/requestService'

import { getFullPageUrl } from '../../../../../../utils/util'
/**
 * 页面载入时
 */

const replaceRepairEnterBurialPoint = function () {
  rangersBurialPoint('user_page_view', {
    module: '服务',
    page_id: 'page_replace_repair',
    page_name: '以换代修页',
    page_path: getFullPageUrl() || '',
  })
}

// 点击领取按钮
const clickButtonBurialPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    module: '服务',
    page_id: 'page_replace_repair',
    page_name: '以换代修页',
    widget_id: 'click_get',
    widget_name: '立即领取',
    page_path: getFullPageUrl() || '',
  })
}

export { replaceRepairEnterBurialPoint, clickButtonBurialPoint }
