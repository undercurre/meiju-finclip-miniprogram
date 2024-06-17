const app = getApp()
import { imgBaseUrl, api, baseImgApi } from '../../api.js'
import {
  installation,
  maintenance,
  upkeep,
  branchList,
  guideBook,
  productSelect,
  login,
  orderList,
  servicePhonenumber,
  serviceWarranty,
} from '../../utils/paths.js'
import { getStamp } from 'm-utilsdk/index'
import { judgeWayToMiniProgram, navigateToMiniProgram, getFullPageUrl } from '../../utils/util'
import { clickEventTracking } from '../../track/track.js'
Page({
  data: {
    topBac: baseImgApi.url + 'me_img_bk@2x.png',
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //顶部状态栏的高度
    baseImgUrl: imgBaseUrl.url,
    imgH: '/mideaServices/images/icon.png?stampTime=' + getStamp(),
    doorServiceList: [
      {
        imgUrl: 'ic_weixiufuwu@3x.png',
        name: '维修服务',
        path: maintenance,
      },
      {
        imgUrl: 'ic_anzhuangfuwu@3x.png',
        name: '安装服务',
        path: installation,
      },
      {
        imgUrl: 'ic_baoyangfuwu@3x.png',
        name: '保养服务',
        path: upkeep,
      },
      {
        imgUrl: 'ic_yihuandaixiu.png',
        name: '以换代修',
      },
    ],
    selfServiceList: [
      {
        imgUrl: 'ic_jinduchaxun@3x.png',
        name: '进度查询',
        path: orderList,
      },
      {
        imgUrl: 'ic_guzhangzicha@3x.png',
        name: '故障自查',
      },
      {
        imgUrl: 'ic_wangdianchaxun@3x.png',
        name: '网点查询',
        path: branchList,
      },
      {
        imgUrl: 'ic_shuomingshu@3x.png',
        name: '电子说明书',
        path: 'minPro',
      },
      {
        imgUrl: 'ic_shoufeibiaozhun@3x.png',
        name: '收费标准',
        path: `${productSelect}?fromPage=serviceChargeTypes`,
      },
      {
        imgUrl: 'ic_baoxiuzhengce@3x.png',
        name: '保修政策',
      },
      {
        imgUrl: 'ic_fujinmendian@3x.png',
        name: '附近门店',
      },
      {
        imgUrl: 'ic_kefurexian@3x.png',
        name: '联系客服',
      },
    ],
    servicePhoneList: [
      {
        title: '美的',
        phone: '400-889-9315',
      },
      {
        title: '小天鹅',
        phone: '400-822-8228',
      },
      {
        title: 'COLMO',
        phone: '400-969-9999',
      },
      {
        title: '比弗利',
        phone: '400-158-8888',
      },
      {
        title: '华凌',
        phone: '400-889-9800',
      },
      {
        title: '布谷',
        phone: '400-158-8888',
      },
    ],
  },
  onLoad: function () {},
  // 进入页面
  enterPage(e) {
    let index = e.currentTarget.dataset.index
    if (!app.globalData.isLogon) {
      wx.navigateTo({
        url: login,
      })
    } else {
      switch (index) {
        case 0:
          this.goMaintenance()
          break
        case 1:
          this.goInstall()
          break
        case 2:
          this.goupkeep()
          break
        case 3:
          this.exchangeRepair()
          break
      }
    }
  },
  // 安装
  goInstall() {
    clickEventTracking('user_behavior_event', 'goInstall')
    wx.navigateTo({
      url: installation,
    })
  },
  // 维修
  goMaintenance() {
    clickEventTracking('user_behavior_event', 'goMaintenance')
    wx.navigateTo({
      url: maintenance,
    })
  },
  // 保养
  goupkeep() {
    clickEventTracking('user_behavior_event', 'goUpkeep')
    wx.navigateTo({
      url: upkeep,
    })
  },
  //以换代修
  exchangeRepair() {
    clickEventTracking('user_behavior_event', 'exchangeRepair', {
      module: '服务',
      page_id: 'page_service',
      page_name: '服务中心首页',
      page_path: getFullPageUrl(),
      page_module: '',
      widget_id: 'click_btn_replace',
      widget_name: '以换代修',
      object_type: '',
      object_id: '',
      object_name: '',
      device_info: {},
      ext_info: {},
    })
    app.showToast('功能升级中')
    // let path =
    //   'pages/authorize/authorize?pathName=/pages/appointment/exchangeMachine/exchangeMachine&serviceType=replaceNew'
    // let extra = {
    //   jp_source: 'midea-meiju-lite',
    //   jp_c4a_uid: app.globalData.userData.uid,
    // }
    // judgeWayToMiniProgram(api.serviceAppid, path, extra)
  },
  // 进度查询
  goProgress() {
    clickEventTracking('user_behavior_event', 'goProgress')
    wx.navigateTo({
      url: orderList,
    })
  },
  // 故障自查
  goFaultInspection() {
    clickEventTracking('user_behavior_event', 'goFaultInspection')
    wx.navigateTo({
      url: `${productSelect}?fromPage=faultCheck`,
    })
  },
  //网点查询
  goBranchList() {
    clickEventTracking('user_behavior_event', 'goBranchList')
    wx.navigateTo({
      url: `${productSelect}?fromPage=branchList`,
    })
  },
  // 电子说明书
  goGuideBook() {
    clickEventTracking('user_behavior_event', 'goGuideBook')
    wx.navigateTo({
      url: guideBook,
    })
  },
  //收费标准
  goChargeStandard() {
    clickEventTracking('user_behavior_event', 'goChargeStandard')
    wx.navigateTo({
      url: `${productSelect}?fromPage=serviceChargeTypes`,
    })
  },
  //保修政策
  goWarrantyPolicy() {
    clickEventTracking('user_behavior_event', 'goWarrantyPolicy')
    wx.navigateTo({
      url: serviceWarranty,
    })
  },
  // 自助服务
  enterSelfHelpPage(e) {
    let index = e.currentTarget.dataset.index
    if (!app.globalData.isLogon) {
      wx.navigateTo({
        url: login,
      })
      return
    }
    switch (index) {
      case 0:
        this.goProgress() //进度查询
        break
      case 1:
        this.goFaultInspection() //故障自查
        break
      case 2:
        this.goBranchList() //网点查询
        break
      case 3:
        this.gotoICSpecification() //电子说明书
        break
      case 4:
        this.goChargeStandard() //收费标准
        break
      case 5:
        this.goWarrantyPolicy() //保修政策
        break
      case 6:
        this.gotoNearShop() //附近门店
        break
      case 7:
        this.hotLine() //客服热线
        break
    }
  },
  //客服电话
  goServicePhone() {
    clickEventTracking('user_behavior_event', 'goServicePhone')
    wx.navigateTo({
      url: servicePhonenumber,
    })
  },
  /**
   * 跳转到美书小程序（电子说明书）
   */
  gotoICSpecification() {
    const currentUid =
      app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
        ? app.globalData.userData.uid
        : ''
    const randam = getStamp()
    clickEventTracking('user_behavior_event', 'gotoICSpecification')
    let appId = 'wxd0e673a1e4dfb3c8'
    let path = '/pages/index/index'
    let extraData = {
      jp_source: 3,
      jp_c4a_uid: currentUid,
      jp_rand: randam,
    }
    judgeWayToMiniProgram(appId, path, extraData)
  },
  /**
   * 前往美的智慧家小程序（附近门店）
   */
  gotoNearShop() {
    clickEventTracking('user_behavior_event', 'gotoNearShop')
    let appId = 'wx255b67a1403adbc2'
    let path = '/page/nearby_stores/nearby_stores'
    judgeWayToMiniProgram(appId, path)
  },
  //客服热线
  hotLine() {
    clickEventTracking('user_behavior_event', 'goServicePhone')
    wx.navigateTo({
      url: servicePhonenumber,
    })
  },
  //打开美的服务小程序
  gotoServiceMiniProgram() {
    let uid = app?.globalData?.userData?.uid ? app.globalData.userData.uid : ''
    clickEventTracking('user_behavior_event', 'gotoServiceMiniProgram', {
      module: '服务',
      page_id: 'page_service',
      page_name: '服务中心首页',
      page_path: getFullPageUrl(),
      page_module: '',
      widget_id: 'click_btn_more',
      widget_name: '更多服务',
      object_type: '',
      object_id: '',
      object_name: '',
      device_info: {},
      ext_info: {},
    })
    let path = `pages/authorize/authorize?pathName=/pages/index/index&uid=${uid}`
    let extra = {
      jp_source: 'midea-meiju-lite',
      jp_c4a_uid: uid,
    }
    navigateToMiniProgram(api.serviceAppid, path, extra)
  },
  onReady: function () {},
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
      })
    }
    app
      .checkGlobalExpiration()
      .then(() => {
        this.setData({
          isLogon: app.globalData.isLogon,
        })
      })
      .catch(() => {
        app.globalData.isLogon = false
        this.setData({
          isLogon: app.globalData.isLogon,
        })
      })
    clickEventTracking('user_page_view', 'onShow')
  },
  trackTab() {
    clickEventTracking('user_behavior_event', 'trackTab')
  },
  makePhone(e) {
    const item = e.currentTarget.dataset.item
    wx.makePhoneCall({
      phoneNumber: item.phone, //仅为示例，并非真实的电话号码
    })
  },
  onAddToFavorites() {
    return {
      title: '服务',
      imageUrl: '',
      query: '',
    }
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
})
