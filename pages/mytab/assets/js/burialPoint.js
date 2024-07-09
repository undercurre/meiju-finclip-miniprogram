/*
 * @desc: 我的主页埋点
 * @author: zhucc22
 * @Date: 2024-06-17 16:59:38
 */
import { clickEventTracking } from '../../../../track/track.js'
import { rangersBurialPoint } from '../../../../utils/requestService'

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

//未登录点击
const clickLoginBurialPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    home_tab: '我的',
    page_id: 'page_my',
    page_name: '我的',
    widget_name: '个人资料',
    widget_id: 'click_btn_personalData',
    ext_info: {
      action: 'login',
    },
  })
}
//点击个人中心
const clickPersonalBurialPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    home_tab: '我的',
    page_id: 'page_my',
    page_name: '我的',
    widget_name: '个人资料',
    widget_id: 'click_btn_personalData',
    ext_info: {
      action: 'view',
    },
  })
}
//点击隐私安全与保护
const clickSeetingMenuPrivcyBurialPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    home_tab: '我的',
    page_id: 'page_my',
    page_name: '我的',
    widget_name: '隐私安全与保护',
    widget_id: 'click_setting_menu_item',
  })
}
//点击关于美的美居
const clickSeetingMenuAboutBurialPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    home_tab: '我的',
    page_id: 'page_my',
    page_name: '我的',
    widget_name: '关于美的美居',
    widget_id: 'click_setting_menu_item',
  })
}
//点击设置
const clickSeetingMenuSettingBurialPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    home_tab: '我的',
    page_id: 'page_my',
    page_name: '我的',
    widget_name: '设置',
    widget_id: 'click_menu_item',
  })
}

//我的页面曝光
const myPageViewBurialPoint = function () {
  rangersBurialPoint('user_page_view', {
    home_tab: '我的',
    page_id: 'page_my',
    page_name: '我的',
  })
}
export {
  vipRightsBurialPoint,
  clickLoginBurialPoint,
  clickPersonalBurialPoint,
  clickSeetingMenuPrivcyBurialPoint,
  clickSeetingMenuAboutBurialPoint,
  clickSeetingMenuSettingBurialPoint,
  myPageViewBurialPoint,
}
