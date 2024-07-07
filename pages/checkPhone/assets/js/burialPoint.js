/*
 * @desc: 个人中心页埋点
 * @author: zhucc22
 * @Date: 2022-12-28 11:23:27
 */
import { clickEventTracking } from '../../../../../track/track.js'
import { getFullPageUrl } from '../../../../../utils/util'

//进入个人中心页
const enterPersonalCneter = function (params) {
  clickEventTracking('user_page_view', 'enterPersonalCneter', {
    page_path: getFullPageUrl(),
    module: 'appliance',
    page_id: 'page_personal_information',
    page_name: '个人信息页',
    ...params,
  })
}
//修改头像
const clickModifyPhoto = function (params) {
  clickEventTracking('user_behavior_event', 'clickModifyPhoto', {
    page_path: getFullPageUrl(),
    module: 'appliance',
    page_id: 'page_personal_information',
    page_name: '个人信息页',
    widget_name: '修改头像',
    widget_id: 'click_btn_modify_profile_photo',
    ...params,
  })
}
//修改昵称
const clickModifyNickname = function (params) {
  clickEventTracking('user_behavior_event', 'clickModifyNickname', {
    page_path: getFullPageUrl(),
    module: 'appliance',
    page_id: 'page_personal_information',
    page_name: '个人信息页',
    widget_name: '修改昵称',
    widget_id: 'click_btn_modify_nickname',
    ...params,
  })
}

export { enterPersonalCneter, clickModifyPhoto, clickModifyNickname }
