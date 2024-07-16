const app = getApp() //获取应用实例
import { service } from './assets/js/service.js'
import { privacyApi } from '../../../api'

import { getFullPageUrl } from '../../../utils/util'

import { rangersBurialPoint } from '../../../utils/requestService'

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    // dialogShow: {
    //   type: Boolean,
    //   value: app.globalData.agreementDialog
    //   value: false
    // }
    agreementShow: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        if (newVal) {
          this.setData({
            agreementDialogShow: false,
          })
        }
      },
    },
  },
  options: {
    addGlobalClass: true,
  },
  observers: {
    '**': function () {
      // 每次 setData 都触发
    },
  },
  data: {
    buttons: [
      {
        text: '不同意并退出',
      },
      {
        text: '同意',
      },
    ],
    agreementDialogShow: false,
    btnArr: [
      { text: '不同意并退出', openType: 'exit' },
      { text: '同意', openType: 'handle' },
    ],
    titlesArr: [],
  },

  methods: {
    // 协议跳转
    gotoAgree(data) {
      let type = data.target.dataset.type
      if (type == 'privacy') {
        this.userBehaviorEventTrack('click_privacy', '美居隐私条例')
      } else {
        this.userBehaviorEventTrack('click_service_agreements', '软件许可及用户服务协议')
      }
      let currLink = `${privacyApi.url}/mobile/agreement/?system=meijuApp&agreement_type=${type}`
      let encodeLink = encodeURIComponent(currLink)
      let currUrl = `/pages/webView/webView?webViewUrl=${encodeLink}`
      wx.navigateTo({
        url: currUrl,
      })
    },
    //登录状态回调
    watchBack(isLogon, that) {
      if (isLogon) {
        setTimeout(() => {
          that.checkAgreement()
        })
      }
    },

    //协议更新——协议变更判断
    checkAgreement() {
      let mobile =
        app.globalData.userData && app.globalData.userData.userInfo ? app.globalData.userData.userInfo.mobile : ''
      let phoneNumber = app.globalData.phoneNumber ? app.globalData.phoneNumber : mobile
      return new Promise(() => {
        service.checkAgreement(phoneNumber).then((res) => {
          // res.data.code = '10025'
          if (res.data && res.data.code == '10025') {
            this.getAgreementTitle() //调用协议标题
            this.userPageViewTrack() //协议更新弹窗埋点
            app.globalData.isUpdateAgreement = false
            this.setData({
              agreementDialogShow: true,
            })
          } else {
            app.globalData.isUpdateAgreement = true
          }
        })
      })
    },
    //协议更新——协议标题列表
    getAgreementTitle() {
      return new Promise(() => {
        service.agreementTitle().then((res) => {
          this.setData({
            titlesArr: res.result || [],
          })
          console.log('titlesArr', this.data.titlesArr)
        })
      })
    },

    // 协议弹窗点击按钮事件
    // 协议更新——同意最新协议接口
    agreeLatest() {
      let agreeVersions = []
      const { titlesArr } = this.data
      titlesArr.forEach((item) => {
        agreeVersions.push({ type: item.type, version: item.agreementVersion })
      })
      console.log('agreeVersions:', agreeVersions)
      let data = {
        mobile: app.globalData.userData.userInfo.mobile,
        agreeVersions: agreeVersions || [],
      }
      this.userBehaviorEventTrack('click_agree', '同意') // 同意协议埋点
      return new Promise(() => {
        service.agreeLatest(data).then((res) => {
          if (res && res.code == '0') {
            this.setData({
              agreementDialogShow: false,
            })
            app.globalData.isUpdateAgreement = true
          }
        })
      })
    },

    // 不同意并退出
    exitMiniProgram() {
      ft.terminateSelf()
      this.userBehaviorEventTrack('click_not_agree_quit', '不同意并退出')
    },

    // 协议更新浏览埋点
    userPageViewTrack() {
      rangersBurialPoint('user_page_view', {
        module: '公共', //写死
        page_id: 'popups_protocol update', //参考接口请求参数“pageId”
        page_name: '协议更新弹窗', //当前页面的标题，顶部的title
        page_path: getFullPageUrl(), //当前页面的URL
        page_module: '公共',
      })
    },

    // this.userBehaviorEventTrack("click_agree","同意")
    // this.userBehaviorEventTrack("click_not_agree_quit","不同意并退出")
    //  点击埋点
    userBehaviorEventTrack(widget_id, widget_name) {
      rangersBurialPoint('user_behavior_event', {
        module: '公共', //写死
        page_id: 'popups_protocol update', //参考接口请求参数“pageId”
        page_name: '协议更新弹窗', //当前页面的标题，顶部的title
        page_path: getFullPageUrl(), //当前页面的URL
        widget_id: widget_id,
        widget_name: widget_name,
        page_module: '公共',
      })
    },
  },
  /*组件生命周期*/
  lifetimes: {
    created() {
      setTimeout(() => {
        if (app.globalData.isLogon) {
          this.checkAgreement() // 页面展示时检查一遍
        }
      }, 2000)
    },
    attached() {
      console.log('在组件实例进入页面节点树时执行')
      setTimeout(() => {
        if (app.globalData.isLogon) {
          this.checkAgreement()
        }
      }, 500)
      // 调用app中监听登录状态的方法
      app.watchLogin(this.watchBack, this)
    },
    error() {
      console.log('每当组件方法抛出错误时执行')
    },
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function () {
        // 页面被展示
        this.checkAgreement() // 页面展示时检查一遍
      },
      hide: function () {
        // 页面被隐藏
        console.log('页面被隐藏')
        this.setData({
          agreementDialogShow: false,
        })
      },
    },
  },
})
