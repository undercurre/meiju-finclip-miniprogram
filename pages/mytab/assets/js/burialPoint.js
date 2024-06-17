import { clickEventTracking } from '../../../../track/track.js'

const vipRightsBurialPoint = (vipLevel, levelName) => {
  clickEventTracking('user_behavior_event', null, {
    module: '个人中心',
    page_id: 'page_personal',
    page_name: '我的页',
    widget_name: '会员权益',
    widget_id: 'click_btn_member_benefit',
    object_type: '会员',
    object_id: vipLevel,
    object_name: levelName,
  })
}

export { vipRightsBurialPoint }
