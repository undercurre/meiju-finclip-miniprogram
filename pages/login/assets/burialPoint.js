/*
 * @desc: 短信验证登录页埋点
 * @author: zhucc22
 * @Date: 2024-07-05 11:37:08
 */
import { rangersBurialPoint } from '../../../utils/requestService'
import { getFullPageUrl } from '../../../utils/util'

/**
 * 手机号输入
 */
const inputMboblieViewBurialPoint = function () {
  rangersBurialPoint('imput_mobile_view', {
    module: '登录注册',
    page_name: '短信注册页',
  })
}

/**
 * 点击获取验证码
 */
const clickBthVerifyBurialPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    widget_id: 'click_bth_verify',
    widget_name: '获取验证码',
  })
}

/**
 * 获取验证码结果
 */
const getCodeBurialPoint = function (params) {
  rangersBurialPoint('get_code', {
    module: '登录注册',
    page_name: '短信注册页',
    code: params.code,
    mobile: params.mobile,
    sms_code_type: '登录注册',
  })
}
/**
 *  不同意隐私协议
 */
const clickBtnDisAgreeBurialPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    widget_id: 'click_btn_disagree',
    widget_name: '不同意',
  })
}

/**
 * 同意隐私协议
 */
const clickBtnAgreeBurialPoint = function () {
  rangersBurialPoint('user_behavior_event', {
    widget_id: 'click_bth_agree',
    widget_name: '同意',
  })
}

/**
 * 点击登录
 */
const loginCheckResultBurialPoint = function (params) {
  rangersBurialPoint('login_check_result', {
    module: '登录注册',
    login_type: '短信注册页',
    code: params.code,
    mobile: params.mobile,
    sms_code_type: '登录注册',
  })
}

/**
 * 点击图形验证码
 */
const photoCodeEventBurialPoint = function () {
  rangersBurialPoint('phote_code_view', {
    module: '登录注册',
    page_name: '登录注册',
    type: '图形验证码',
  })
}

/**
 * 页面暴露
 */
const userPageViewTrack = function () {
  rangersBurialPoint('user_page_view', {
    module: '公共', //写死 “活动”
    page_id: 'page_login', //参考接口请求参数“pageId”
    page_name: '登录页', //当前页面的标题，顶部的title
    page_path: getFullPageUrl(), //当前页面的URL
    page_module: '公共',
  })
}

export {
  inputMboblieViewBurialPoint,
  clickBthVerifyBurialPoint,
  getCodeBurialPoint,
  clickBtnDisAgreeBurialPoint,
  clickBtnAgreeBurialPoint,
  loginCheckResultBurialPoint,
  photoCodeEventBurialPoint,
  userPageViewTrack,
}
