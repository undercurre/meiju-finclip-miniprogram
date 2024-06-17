import { clickEventTracking } from '../../track/track'
import { getFullPageUrl } from '../../utils/util.js'
import { rangersBurialPoint } from '../../utils/requestService'

/**
 * 家庭管理-浏览家庭管理页面
 */
const homeManageViewBurialPointFun = function (list) {
  console.log('浏览家庭管理页面', list)
  let param = {}
  if (list) {
    param = {
      is_red_dot: 1,
      red_dot_family_id: list,
    }
  }
  rangersBurialPoint('user_page_view', {
    page_path: getCurrentPages()[0].route,
    page_title: '',
    module: '家庭管理',
    page_id: 'page_family_management',
    page_name: '家庭管理页',
    object_type: '',
    object_id: '',
    object_name: '',
    ext_info: param,
  })
}

/**
 * 家庭管理-点击邀请按钮埋点
 */
const clickInvitePoint = function (data) {
  rangersBurialPoint('user_behavior_event', {
    page_id: data.page_id,
    page_name: data.page_name,
    module: '家庭管理',
    page_path: getCurrentPages()[0].route,
    widget_id: 'click_bth_invite',
    widget_name: '邀请家人',
    page_module: '',
    rank: '',
    object_type: '',
    object_id: '',
    object_name: '',
    ext_info: {},
  })
}

/**
 * 家庭管理-点击美的美居App按钮埋点
 */
const clickGoToDownLoadPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    page_id: 'page_family_management',
    page_name: '家庭管理页',
    module: '家庭管理',
    page_path: getCurrentPages()[0].route,
    widget_id: 'click_go_meiju_app',
    widget_name: '更多功能尽在美的美居APP',
    page_module: '',
    rank: '',
    object_type: '',
    object_id: '',
    object_name: '',
    ext_info: {},
  })
}

/**
 * 家庭管理-新建房间浏览
 */

const familyCreateRoomDialogBurialPoint = function () {
  clickEventTracking('user_page_view', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_CreatingRoom',
    page_name: '新建房间弹窗',
  })
}

/**
 * 家庭管理-点击新建房间弹窗
 */
const familyCreateRoomDialogClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_CreatingRoom',
    widget_id: 'click_btn_create_room',
    widget_name: '新建房间',
    page_name: '新建房间弹窗',
  })
}

/**
 * 家庭管理-新建房间-点击确认
 */
const onfrimfamilyCreateRoomDialogClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_CreatingRoom',
    widget_id: 'click_popup_confirm',
    widget_name: '确认新建房间',
    page_name: '新建房间弹窗',
  })
}

/**
 * 家庭管理-新建房间-点击取消
 */
const onCancelfamilyCreateRoomDialogClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_CreatingRoom',
    widget_id: 'click_popup_cancel',
    widget_name: '取消新建房间',
    page_name: '新建房间弹窗',
  })
}

/**
 * 家庭管理-新建房间-输入
 */
const inputfamilyCreateRoomDialogClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_CreatingRoom',
    widget_id: 'click_popup_input',
    widget_name: '输入房间名称',
    page_name: '新建房间弹窗',
  })
}

/**
 * 家庭管理-退出家庭弹窗浏览
 */
const popupsfamilyQuitFamilyBurialPoint = function () {
  clickEventTracking('user_page_view', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_QuitFamily',
    page_name: '退出家庭弹窗',
  })
}
/**
 * 家庭管理-退出家庭弹窗
 */
const popupsfamilyQuitFamilyClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_QuitFamily',
    widget_id: 'click_btn_quit_family',
    widget_name: '退出家庭',
    page_name: '家庭详情',
  })
}

/**
 * 家庭管理-取消退出家庭弹窗
 */
const cancelQuitFamilyClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_QuitFamily',
    widget_name: '取消退出',
    widget_id: 'click_popup_cancel',
    page_name: '退出家庭弹窗',
  })
}

/**
 * 家庭管理-确定退出家庭弹窗
 */
const confirmQuitFamilyClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_name: '退出家庭弹窗',
    page_id: 'popups_family_QuitFamily',
    widget_id: 'click_popup_cancel',
    widget_name: '确认退出',
  })
}

/**
 * 家庭管理-删除房间弹窗浏览
 */
const popupsfamilyDeleteRoomBurialPoint = function () {
  clickEventTracking('user_page_view', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_DeleteRoom',
    page_name: '删除房间弹窗',
  })
}

/**
 * 家庭管理-删除房间弹窗
 */
const popupsfamilyDeleteRoomClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_DeleteRoom',
    page_name: '删除房间弹窗',
    widget_name: '删除房间',
    widget_id: 'click_btn_delete_room',
  })
  console.log('删除房间弹窗')
}

/**
 * 家庭管理-删除房间弹窗-确认删除
 */
const confirmpopupsfamilyDeleteRoomClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_DeleteRoom',
    page_name: '删除房间弹窗',
    widget_name: '确认删除房间',
    widget_id: 'click_popup_confirm',
  })
}

/**
 * 家庭管理-删除房间弹窗-取消删除
 */
const cancelpopupsfamilyDeleteRoomClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_DeleteRoom',
    page_name: '删除房间弹窗',
    widget_name: '取消删除房间',
    widget_id: 'click_popup_cancel',
  })
}

/**
 * 家庭管理-家庭详情
 */
const pagefamilydetailBurialPoint = function () {
  clickEventTracking('user_page_view', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'page_family_detail',
    page_name: '家庭详情',
  })
}

/**
 * 家庭管理-房间与设备
 */
const pagefamilyRoomDeviceBurialPoint = function () {
  clickEventTracking('user_page_view', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'page_family_RoomDevice',
    page_name: '房间与设备',
  })
}
/**
 * 家庭管理-房间详情
 */
const pagefamilyRoomDetailBurialPoint = function () {
  clickEventTracking('user_page_view', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'page_family_RoomDetail',
    page_name: '房间详情',
  })
}

/**
 * 家庭管理-成员列表页
 */
const pagefamilyMemberListBurialPoint = function () {
  clickEventTracking('user_page_view', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'page_family_MemberList',
    page_name: '成员列表页',
  })
}
//------------ user_behavior_event ------------

/**
 * 家庭管理-新建家庭弹窗
 */
const CreateFamilyDialogBurialPoint = function () {
  clickEventTracking('user_page_view', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_CreatingFamily',
    page_name: '新建家庭弹窗',
  })
}

/**
 * 家庭管理-新建家庭
 */
const clickbthCreatingFamilyBurialPoint = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'page_family_management',
    page_name: '家庭管理',
    widget_name: '新建家庭',
    widget_id: 'click_bth_CreatingFamily',
  })
}

/**
 * 家庭管理-新建家庭-点击确定
 */
const confirmclickbthCreatingFamilyBurialPoint = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_CreatingFamily',
    page_name: '新建家庭弹窗',
    widget_name: '确定',
    widget_id: 'click_popup_confirm',
  })
}
/**
 * 家庭管理-新建家庭-点击取消
 */
const cancelclickbthCreatingFamilyBurialPoint = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_CreatingFamily',
    page_name: '新建家庭弹窗',
    widget_name: '取消',
    widget_id: 'click_popup_cancel',
  })
}

/**
 * 家庭管理-新建家庭-输入
 */
const inputclickbthCreatingFamilyBurialPoint = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_CreatingFamily',
    page_name: '新建家庭弹窗',
    widget_name: '输入家庭名称',
    widget_id: 'click_popup_input',
  })
}

/**
 * 家庭管理-查看家庭详情
 */
const clickbthFamilyDetailBurialPoint = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'page_family_management',
    page_name: '家庭管理页',
    widget_name: '查看家庭详情',
    widget_id: 'click_bth_FamilyDetail',
  })
}

/**
 * 家庭管理-删除家庭弹窗浏览
 */
const popupsfamilyDeleteFamilyBurialPoint = function () {
  clickEventTracking('user_page_view', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_DeleteFamily',
    page_name: '删除家庭弹窗',
  })
}
/**
 * 家庭管理-删除家庭弹窗
 */
const popupsfamilyDeleteFamilyClick = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'page_family_detail',
    widget_id: 'click_btn_delete_family',
    widget_name: '删除家庭',
    page_name: '家庭详情',
  })
}

/**
 * 家庭管理-确定删除家庭
 */
const clickpopupconfirmBurialPoint = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_DeleteFamily',
    page_name: '删除家庭弹窗',
    widget_name: '确定删除家庭',
    widget_id: 'click_popup_confirm',
  })
}

/**
 * 家庭管理-取消删除家庭
 */
const clickpopupcancelBurialPoint = function () {
  clickEventTracking('user_behavior_event', '', {
    page_path: getFullPageUrl() || '',
    module: '家庭管理',
    page_id: 'popups_family_DeleteFamily',
    page_name: '删除家庭弹窗',
    widget_name: '取消删除家庭',
    widget_id: 'click_popup_cancel',
  })
}

export default {
  familyCreateRoomDialogBurialPoint,
  familyCreateRoomDialogClick,
  onfrimfamilyCreateRoomDialogClick,
  onCancelfamilyCreateRoomDialogClick,
  inputfamilyCreateRoomDialogClick,
  CreateFamilyDialogBurialPoint,
  popupsfamilyDeleteRoomBurialPoint,
  popupsfamilyDeleteRoomClick,
  confirmpopupsfamilyDeleteRoomClick,
  cancelpopupsfamilyDeleteRoomClick,
  popupsfamilyQuitFamilyBurialPoint,
  popupsfamilyQuitFamilyClick,
  cancelQuitFamilyClick,
  confirmQuitFamilyClick,
  popupsfamilyDeleteFamilyBurialPoint,
  clickbthCreatingFamilyBurialPoint,
  clickbthFamilyDetailBurialPoint,
  popupsfamilyDeleteFamilyClick,
  clickpopupconfirmBurialPoint,
  clickpopupcancelBurialPoint,
  pagefamilydetailBurialPoint,
  pagefamilyRoomDeviceBurialPoint,
  pagefamilyRoomDetailBurialPoint,
  pagefamilyMemberListBurialPoint,
  homeManageViewBurialPointFun,
  clickInvitePoint,
  clickGoToDownLoadPoint,
  confirmclickbthCreatingFamilyBurialPoint,
  cancelclickbthCreatingFamilyBurialPoint,
  inputclickbthCreatingFamilyBurialPoint,
}
