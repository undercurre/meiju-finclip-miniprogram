import './homePage/store'
import {
  actTemplateHome,
  download,
  actTemplateInviteList,
  commonSubPage,
  webViewPage,
  actTemplateReceiveAdress,
  actTemplateScoreList,
  actTemplateRankList,
} from 'path.js'
import { getPageUrl, isTabPage, showToast } from '../../../utils/util.js'
import { Base64, formatTime, hasKey } from 'm-utilsdk/index'
import { actTemplateH5Addr } from '../../../api.js'
import { actEventClickTracking, actEventViewPageTracking, actCaptchaTracking } from '../track/track.js'
import { dialogText, errorMsg } from 'containerCommon.js'
import loginMethods from '../../../globalCommon/js/loginRegister.js'
const commonMixin = require('commonMixin.js')
import { mockData } from 'mockData.js'

const app = getApp()
// const isMock = true
module.exports = Behavior({
  behaviors: [commonMixin],
  properties: {},
  data: {
    isMock: false, //使用模拟数据
    isShowLuck: false, //阻止滚动穿透
    isLoading: false,
    platform: '', //设备平台ios或者安卓
    isActNotStart: false, // true 活动未开始
    targetList: ['callback'],
    commonData: {
      isActNormal: true, //活动期间
      isBlackUser: false, //校验黑产用户true:是黑产；false：不是黑产
      isStatusUser: true, //校验用户是否符合当前活动的参与条件，true：符合；false：不符合
      isLogoutUser: false, //校验用户是否在当前活动中注销过，true：注销过，false:没有注销过
      slidingValidation: false, //校验后台是否配置了滑块验证，true：有配置，false,没配置
    },
    fullShadow: false,
    invitationCode: '', //邀请家庭 登录接口返回的状态
    pageId: '',
    receiveFlag: false, //我的奖励领取防暴击
    isCloseDialog: 'false',
    // 新增滑块验证
    captchaShow: false,
    captchaReload: false,
    sliderValidation: false,
    appId: 'a8abfe7204ddad1832dca9994bf176c3', //请保持和滑块验证公共组件中的appId一致 /sub-package/common-backage/components/catcha/catchaBasic/catchaBasic.js
    isSliderValidation: '',
    //滚动签到
    actionRollingSignContainerE: '',
    actionRollingSignContainerBasicItem: '',
    actionRollingSignContainerSelectContainer: '',
    //免费领取
    freeReceiveContainer: '',
    actionFreeReceiveContainerE: '',
    actionFreeReceiveContainerBasicItem: '',
    actionFreeReceiveContainerSelectContainer: '',
    //虚拟券
    actionReceiveE: '',
    actionReceiveVirtualCouponE: '',
    //填写地址
    actionGoAddressE: '',
    //权益直充
    actionReceiveDirectChargeE: '',
    // options: {
    //   path: '',
    //   gameId: ''
    // },
    //容器类型(1、通用容器；2、我的奖励卡片;3、邀请注册；4、邀请绑定设备；5、邀请加入家庭)
    containerTypeMap: {
      1: 'normal', // "通用容器"
      2: 'my-reward', //"我的奖励卡片"
      3: 'invite-register', // "邀请注册"
      4: 'invite-register', //"邀请绑定设备"
      5: 'join-family', //"邀请加入家庭)",
      6: 'my-task', //"任务盒子",
      7: 'calendar-rolling-sign', //"滚动签到",
      8: 'calendar-day-sign', //"固定签到",
      9: 'my-luck-grid', //"九宫格",
      10: 'tasks-register', //新用户注册
      12: 'my-score-rank', //道具排名
      13: 'my-luck-eggs', //扭蛋
      14: 'my-task', //"任务盒子-访问插件页"
      16: 'my-task', //"任务盒子-分享美的美居"
      18: 'my-task', //"任务盒子-创建场景并启用"
      19: 'my-task', //"任务盒子-访问指定内容"
      20: 'my-task', //"任务盒子-分享活动"
      21: 'free-receive-container', //"免费领取玩法",
      22: 'my-task', //"任务盒子-分享食谱（发现页-美食）"
      23: 'my-luck-scratch', //刮刮乐,
      24: 'my-luck-cards', //翻卡牌
    },
    //0、无交互；1、关闭；2、活动内页面；3、分享；4、美的美居；5、链接；6、定制功能；7弹窗，8、活动主页；9、邀请页；10、我的奖励列表页；11、我的邀请列表页
    //12、保存二维码；13、接受邀请；14、我也参与；15、注册；16、领取；17、加入；18、激活
    // isShowDialog: false,
    selectData: {},
    shareParam: {
      path: '',
    },
    dialogComponentInitData: {
      isShowDialog: false,
    },
    toastComponentInitData: {
      isShowToast: false,
      toastDuration: 3000,
    },
    hotzoneComponentInitData: [
      {
        isShowToast: false,
      },
    ],
    lottieComponentInitData: {
      isShowLottie: false,
    },
    invitepanelComponentInitData: {
      isShowInvitepanel: false,
    },
    faceComponentInitData: {
      isShowFace: false, //面对面弹框
    },
    cardComponentInitData: {
      isShowCardDialog: false, //显示券码弹窗
    },
    moneyComponentInitData: {
      isShowMoneyDialog: false, //显示红包弹窗
    },
    rewardComponentInitData: {
      isShowRewardDialog: false, //显示组合奖励弹窗
    },
    awardComponentInitData: {
      isShowAwardDialog: false, //显示抽奖机会弹窗
    },
    templateMethods: {
      actionDialogClose: 'actionDialogClose',
      actionBtnConfirm: 'actionBtnConfirm',
      actionToastClose: 'actionToastClose',
      actionHotzoneDialog: 'actionHotzoneDialog',
      actionDialogBtn: 'actionDialogBtn',
      actionInvite: 'actionInvite',
      actionInviteShare: 'actionInviteShare',
      actionHideFaceModal: 'actionHideFaceModal',
      actionJoinFamily: 'actionJoinFamily',
      actionJoinFamilyShare: 'actionJoinFamilyShare',
      actionLaunchAppError: 'actionLaunchAppError',
      actionLaunchAppSuccess: 'actionLaunchAppSuccess',
      actionLaunchAppDialogError: 'actionLaunchAppDialogError',
      actionLaunchAppDialogSuccess: 'actionLaunchAppDialogSuccess',
      actionAcceptInvite: 'actionAcceptInvite', //接受邀请
      actionJoinIn: 'actionJoinIn', // 我也要参与
      actionGetphonenumber: 'actionGetphonenumber',
      actionActStatus: 'actionActStatus', //校验活动是否开始或结束
      actionGoRewardList: 'actionGoRewardList', //跳转奖励列表
      actionOpenFaceToFace: 'actionOpenFaceToFace', //面对面邀请按钮
      actionLaunchAppDialog: 'actionLaunchAppDialog', //弹框跳转app
      actionHotzoneCustom: 'actionHotzoneCustom', //热区通用方法
      actionContainer: 'actionContainer',
      actionLaunchApp: 'actionLaunchApp', //打开美居app
      actionGoAddress: 'actionGoAddress', //跳转编辑地址
      actionShowToast: 'actionShowToast', //弹出toast
      actionFullShadow: 'actionFullShadow', //全屏遮罩
      actionReceive: 'actionReceive', //校验奖品是否需要在美居内领取
      actionCheckCharge: 'actionCheckCharge', //查看权益直充
      captchaOpen: 'captchaOpen', //打开滑块验证
    },
  },
  methods: {
    getDevice() {
      // 系统：0安卓，1 IOS
      const isIphone = wx.getStorageSync('isIphone') || ''
      if (!isIphone) {
        wx.getSystemInfo({
          success(res) {
            let modelmes = res.model
            if (modelmes.search('iPhone') != -1) {
              wx.setStorageSync('isIphone', '1')
              this.setData({
                platform: '1',
              })
            } else {
              wx.setStorageSync('isIphone', '0')
              this.setData({
                platform: '0',
              })
            }
          },
        })
      } else {
        this.setData({
          platform: isIphone,
        })
      }
    },
    getShowLuck(obj) {
      return obj.popups.rollFlag && obj.type == '5' ? true : false
    },
    checkActStatus() {
      //3已结束，4已关闭
      this.getActStatus()
      //未开始
      this.checkIfActNotStart()
    },
    // 获取活动状态，活动是否开始或者结束
    getActStatus() {
      const { status } = this.data.basicSetting
      // 3已结束，4已关闭
      const statusMap = ['3', '4']
      if (statusMap.indexOf(status.toString()) > -1) {
        this.setData({
          'commonData.isActNormal': false,
        })
      }
    },
    getRiskUser() {
      const { riskSwitch } = this.data.basicSetting
      if (riskSwitch != 'Y') return
      this.blackUserCheck().then((res) => {
        // const { riskSwitch } = this.data.basicSetting
        console.log('fenxiang', res.data.data.result, riskSwitch == 'Y')
        this.setData({
          'commonData.isBlackUser': res.data.data.result && riskSwitch == 'Y',
        })
      })
    },
    getIsLogoutUser() {
      const { logoutValidation } = this.data.basicSetting
      const { logout } = this.data.userInfo
      if (!logout) logout == false
      if (logoutValidation != 'Y') return
      this.setData({
        'commonData.isLogoutUser': logout && logoutValidation == 'Y',
      })
    },
    //获取当前用户的活动状态（是否符合当前活动条件（人群包））
    getStatusUser() {
      const { userInfo } = this.data
      //人群包通用校验（需要排除“新用户注册,九宫格和扭蛋机”，九宫格扭蛋机需要在组件内控制）
      if (hasKey(userInfo, 'status') && userInfo.status === 0) {
        this.setData({
          'commonData.isStatusUser': false,
        })
      }
    },
    //获取当前用户的活动状态（是否符合当前活动条件（人群包））
    getValidation() {
      const { basicSetting } = this.data
      //人群包通用校验（需要排除“新用户注册,九宫格和扭蛋机”，九宫格扭蛋机需要在组件内控制）
      if (hasKey(basicSetting, 'slidingValidation')) {
        this.setData({
          'commonData.slidingValidation': basicSetting.slidingValidation === 'Y' ? true : false,
        })
      }
    },
    // 校验邀请类玩法库存 showStockDialog是否展示库存不足弹窗 1默认展示
    isCheckAwardStock(e, showStockDialog = '1') {
      console.log(e, 'isCheckAwardStock')
      let conType = e ? e.containerType : ''
      return new Promise((resolve, reject) => {
        this.invitePrizeStore(conType)
          .then((res) => {
            console.log(res, '邀请类玩法库存检验res')
            if (res.data.data.awardStockStatus === true) {
              // 库存充足返1
              resolve({ code: 1 })
            } else if (res.data.data.awardStockStatus === false) {
              // 库存不足返2
              if (showStockDialog == 1) {
                this.showUpperLimit()
              }
              resolve({ code: 2 })
            } else {
              resolve({ code: 3 })
            }
          })
          .catch(() => {
            reject({ code: 0 })
          })
      })
    },
    // 校验任务盒子玩法库存 showStockDialog 是否展示库存不足弹窗 1默认展示
    isCheckTaskAwardStock(e, showStockDialog = '1') {
      console.log(e, 'isCheckTaskAwardStock')
      let taskId = e.data && e.data.taskInfo ? e.data.taskInfo.id : '' //2021.05.31接口需求为taskInfo.id,原来为taskInfo.taskId
      return new Promise((resolve, reject) => {
        this.prizeStore(taskId)
          .then((res) => {
            console.log(res, '任务盒子玩法库存检验res')
            if (res.data.data.remaining === true) {
              // 库存充足返1
              resolve({ code: 1 })
            } else if (res.data.data.remaining === false) {
              // 库存不足返2
              if (showStockDialog == 1) {
                this.showUpperLimit()
              }
              resolve({ code: 2 })
            } else {
              resolve({ code: 3 })
            }
          })
          .catch(() => {
            reject({ code: 0 })
          })
      })
    },
    // 显示奖励发放上限弹窗
    showUpperLimit(type = 'award') {
      let content = errorMsg.sellout
      if (type == 'draw') {
        content = errorMsg.maximumDraw
      }
      if (type == 'sign') {
        content = errorMsg.selloutSign
      }
      let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
      this.setStaticDialog(4, content, basic)
    },
    // 校验活动是否有开始
    checkIfActNotStart() {
      // 0未发布，1未开始，2进行中，3已结束，4已关闭，5待审核，6审核中
      const { status } = this.data.basicSetting
      const statusMap = ['0', '1', '5', '6']
      console.log('活动状态', statusMap.indexOf(status.toString()))
      if (statusMap.indexOf(status.toString()) > -1) {
        let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, '活动未开始，敬请期待～', basic)
        this.setData({
          isActNotStart: true,
        })
      }
    },
    // 校验活动是否已失效
    checkIfActivityEnd() {
      const { status } = this.data.basicSetting
      // 0未发布，1未开始，2进行中，3已结束，4已关闭，5待审核，6审核中
      if (status == 3 || status == 4) {
        this.checkGameOver(true)
        return false
      }
      return true
    },
    checkGameOver(flag) {
      if (flag) {
        let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, '来晚啦！活动已结束～', basic)
        return false
      }
      return true
    },
    checkGameNoStart(flag) {
      if (flag) {
        let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, '活动未开始，敬请期待～', basic)
        this.setData({
          isActNotStart: true,
        })
        return false
      }
      return true
    },
    checkIsBlackUser(flag) {
      if (flag) {
        let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, '您当前帐号存在异常，详情请查看活动规则或咨询客服，谢谢～', basic)
        return false
      }
      return true
    },
    checkHomeOwner(flag) {
      if (flag) {
        let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, errorMsg.notHomeOwner, basic)
        return false
      }
      return true
    },
    setToast(content) {
      this.data.selectPageObj.popups.content = content
      this.data.selectPageObj.type = 3
      this.setData({
        'toastComponentInitData.isShowToast': true,
        selectData: this.data.selectPageObj,
      })
    },
    setDialog(type, content, btnText, target, params) {
      this.data.selectPageObj.type = 4
      const basicList = [
        {
          // "content": , // 按钮文案
          target: target, // 跳转类型
          targetUrl: '', // 跳转地址
          name: btnText,
          params: params, //参数
        },
      ]
      console.log('弹框传参', type, content, btnText, target)
      this.data.selectPageObj.popups.content = content
      this.data.selectPageObj.popups.basicList = basicList
      this.data.selectPageObj.type = type
      this.setData({
        'dialogComponentInitData.isShowDialog': true,
        selectData: this.data.selectPageObj,
      })
    },
    // 最开始的邀请注册激活玩法里面有使用，新写的代码统一使用actionLaunchApp
    async actionLaunchAppDialog(e) {
      const { content, nameList, from } = e.detail
      console.log('这里。。。。。')
      // if(from == 'task' && !this.checkIfActivityEnd()) return
      if (from == 'task' || from == 'reward') {
        //时时校验活动是否已结束--start
        const res = await this.gameStatus()
        const game_finish = res.data.data.game_finish
        if (!this.checkGameOver(game_finish)) return
        //时时校验活动是否已结束---end
      }
      this.activityTrack(e)
      this.data.selectPageObj.isStatic = true
      this.data.selectPageObj.type = 4
      let basicList = [
        {
          target: 1, // 跳转类型
          targetUrl: '', // 跳转地址
          name: nameList[0],
        },
        {
          target: 4, // 跳转类型
          targetUrl: '', // 跳转地址
          name: nameList[1],
        },
      ]
      //新增引导去支付宝，只有一个按钮
      basicList = nameList.length == 1 ? [basicList[0]] : basicList
      console.log('打开app-弹框传参', content, nameList)
      this.data.selectPageObj.popups.content = content
      this.data.selectPageObj.popups.basicList = basicList
      this.setData({
        'dialogComponentInitData.isShowDialog': true,
        selectData: this.data.selectPageObj,
      })
    },

    // 打开美的美居APP,后面增加，和这个函数actionContainer一起使用
    actionLaunchAppOnHome(e) {
      let content = dialogText.toApp,
        nameList = [dialogText.iKnow, dialogText.buttonToApp]
      this.data.selectPageObj.isStatic = true
      this.data.selectPageObj.type = 4
      const basicList = [
        {
          target: 1, // 跳转类型
          targetUrl: '', // 跳转地址
          name: nameList[0],
        },
        {
          target: 4, // 跳转类型
          targetUrl: '', // 跳转地址
          name: nameList[1],
        },
      ]
      console.log('打开app-弹框传参', content, nameList)
      this.data.selectPageObj.popups.content = content
      this.data.selectPageObj.popups.basicList = basicList
      const { from } = e.detail
      //从实物-红包弹框返回
      if (from == 'real-gift') {
        this.setData({
          'awardComponentInitData.isShowAwardDialog': false,
        })
      }
      this.setData({
        'dialogComponentInitData.isShowDialog': true,
        selectData: this.data.selectPageObj,
      })
    },

    actionActStatus(e) {
      const { status } = e.detail
      //校验是否在活动期间
      if (status == 'isActNormal' && !this.checkIfActivityEnd()) return
      //校验用户是否符合活动条件（人群包）
      if (status == 'isStatusUser' && !this.checkStatusUser()) return
      //校验黑厂手机
      if (status == 'isBlackUser' && !this.activityCheckPhone()) return
      //校验是否活动期间注销过本账号
      if (status == 'isLogoutUser' && this.checkLogoutUser()) return
      //校验是否在活动期间
      if (!this.checkIfActivityEnd()) return
      //校验用户是否符合活动条件（人群包）
      if (!this.checkStatusUser()) return
      //校验黑厂手机
      if (!this.activityCheckPhone()) return
      //校验是否活动期间注销过本账号
      if (!this.checkLogoutUser()) return
    },
    checkStatusUser(isReturnFalse = false) {
      const { isStatusUser } = this.data.commonData
      if (isReturnFalse || !isStatusUser) {
        let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, errorMsg.unqualified, basic)
        return false
      }
      return true
    },
    //校验是否活动期间注销过账号，注销过的显示弹窗
    checkLogoutUser() {
      const { isLogoutUser } = this.data.commonData
      if (isLogoutUser) {
        let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, errorMsg.accountRisk, basic) //注销过账号的提示跟黑产用户一直，都是账号异常
        return false
      }
      return true
    },
    // 校验黑厂手机
    activityCheckPhone() {
      // isBlackUser = true 黑厂手机,false不是黑厂手机
      console.log('校验黑厂手机', this.data.commonData.isBlackUser, this.data.basicSetting.riskSwitch)
      if (this.data.commonData.isBlackUser && this.data.basicSetting.riskSwitch == 'Y') {
        let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, '您当前帐号存在异常，详情请查看活动规则或咨询客服，谢谢～', basic)
        return false
      } else {
        return true
      }
    },
    //活动按钮字节埋点
    activityTrack(e) {
      const { basicItem, selectContainer } = e.detail
      const { options, pageSetting } = this.data
      actEventClickTracking('activity_widget_event', options, pageSetting, selectContainer, basicItem)
    },
    activityShareTrack(e) {
      if (e.from == 'button') {
        //分享的变量驼峰命名变成了全部小写
        const item = e.target.dataset.item
        const selectContainer = e.target.dataset.selectcontainer
        const { options, pageSetting } = this.data
        // console.log("分享的埋点",e, e.target.dataset.selectcontainer)
        actEventClickTracking('activity_widget_event', options, pageSetting, selectContainer, item)
      }
    },
    activityDialogTrack(e) {
      const { basicItem } = e.detail
      const { options, pageSetting } = this.data
      actEventClickTracking('activity_widget_event', options, pageSetting, {}, basicItem)
    },
    //配置打开app
    actionGoApp() {},
    getAppH5ActUrl() {
      const encodeWeexUrl = encodeURIComponent(actTemplateH5Addr.actHome.url + '?fm=wx')
      const appHomePage = `midea-meiju://com.midea.meiju/main?type=jumpWebView&url=${encodeWeexUrl}&needNavi=1`
      return appHomePage
    },
    getInitOptions(options) {
      if (hasKey(options, 'query')) {
        options = options.query
      }
      if (hasKey(options, 'scene')) {
        console.log('获取options---scene', decodeURIComponent(options.scene))
        const scene = decodeURIComponent(options.scene)
        const data = this.getSceneData(scene)
        options.gameId = data.gId
        options.channelId = data.cId
      } else if (options.gId || options.cId) {
        options.gameId = options.gId
        options.channelId = options.cId
      }
      const pageUrl = getPageUrl()
      options.path = pageUrl
      console.log('onLoad解析后的options传参', options)
      this.setData({
        options,
        // pageUrl: pageUrl
      })
    },
    getSceneData(scene) {
      // gId=4101&cId=4233&env=prod
      const list = scene.split('&')
      const obj = {}
      list.forEach((item) => {
        const list2 = item.split('=')
        const key = list2[0]
        const value = list2[1]
        obj[key] = value
      })
      return obj
    },
    getPageId(e) {
      const { basicItem } = e.detail
      console.log('获取页面', basicItem)
      return basicItem.targetUrl
    },
    actionDialogClose(e) {
      const item = e && e.detail && e.detail.currentTarget ? e.detail.currentTarget.dataset.item : {}
      // 新用户注册 静态图片弹窗
      if (item.type == 5 && this.data.selectPageObj.isStatic) {
        this.getGamePageInit_token()
      }
      this.setData({
        'dialogComponentInitData.isShowDialog': false,
        'cardComponentInitData.isShowCardDialog': false,
        'moneyComponentInitData.isShowMoneyDialog': false,
        'rewardComponentInitData.isShowRewardDialog': false,
        'awardComponentInitData.isShowAwardDialog': false,
        isShowLuck: false,
        isCloseDialog: 'true',
      })
    },
    actionToastClose() {
      this.setData({
        'toastComponentInitData.isShowToast': false,
      })
    },
    //校验弹框是否需要埋点
    checkDialogIfTrack(e) {
      const { targetList } = this.data
      const { selectPage, basicItem } = e.detail
      const isStatic = hasKey(selectPage, 'isStatic') ? selectPage.isStatic : false
      console.log('按钮弹框', isStatic, targetList.indexOf(basicItem.target) > -1)
      return targetList.indexOf(basicItem.target) > -1 || isStatic ? false : true
    },
    actionDialogBtn(e) {
      const { options } = this.data
      const { selectPage, basicItem } = e.detail
      const callConfigFn = app.globalData.isLogon ? this.getGamePage_token : this.getGamePage
      const pageId = this.getPageId(e)

      if (this.checkDialogIfTrack(e)) {
        this.activityDialogTrack(e)
      }
      //target:   0、无交互；1、关闭；2、活动内页面；3、分享；4、美的美居；5、链接；6、定制功能；7、弹窗；callback、执行回调
      if (basicItem.target == '1') {
        this.setData({
          'dialogComponentInitData.isShowDialog': false,
          isShowLuck: false,
        })
        if (this.data.isActNotStart) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
      // 执行回调
      if (basicItem.target == 'callback') {
        this.setData({
          'dialogComponentInitData.isShowDialog': false,
          isShowLuck: false,
        })
        console.log('basicItem111', basicItem)
        const { params } = basicItem
        this.data.options.pageId = params.pageId
        callConfigFn(params.pageId).then((res) => {
          // 浏览页面埋点
          actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
        })
      }
      // 保存地址回调
      if (basicItem.target == 'navigateBack') {
        console.log('navigateBack。。。')
        //跳转
        wx.navigateBack({
          delta: 1,
        })
      }

      if (basicItem.target == '7') {
        console.log('弹框的打开toast配置')
        callConfigFn(pageId, false)
          .then((res) => {
            if (res.data.data.pageSetting.type == '3') {
              console.log('弹框的打开toasst配置', res.data.data.pageSetting.type == '3')
              this.setData({
                selectData: res.data.data.pageSetting,
                'dialogComponentInitData.isShowDialog': false,
                'toastComponentInitData.isShowToast': true,
              })
            } else if (res.data.data.pageSetting.type == '4' || res.data.data.pageSetting.type == '5') {
              const isShowLuck = this.getShowLuck(res.data.data.pageSetting)
              this.setData({
                selectData: res.data.data.pageSetting,
                'dialogComponentInitData.isShowDialog': true,
                isShowLuck: isShowLuck,
              })
            }
          })
          .catch()
      }
      if (basicItem.target == 2 || basicItem.target == 5) {
        this.actionGoUrl(basicItem, 'dialog')
      }
      //无交互时关闭弹框
      if (basicItem.target == 0) {
        this.actionDialogClose()
      }
      //确认关闭签到通知
      if (basicItem.target == 'closeSignNotice') {
        this.actionSignNotice(0)
      }
      //自定义回调事件
      if (basicItem.target == 'customizeCallBack') {
        this.setData({
          'dialogComponentInitData.isShowDialog': false,
          isShowLuck: false,
        })
        console.log(selectPage)
        if (selectPage.popups.confirmFunc) {
          selectPage.popups.confirmFunc()
        }
      }
    },
    actionSignNotice(extensionField) {
      this.signNotice(extensionField).then(() => {
        this.actionDialogClose()
        this.getGamePageInit_token()
      })
    },
    actionHotzoneDialog(e) {
      console.log('热区返回', e)

      //字节埋点
      this.activityTrack(e)
      const pageId = this.getPageId(e)
      console.log('页面pageId', pageId)
      if (this.data.isMock) {
        if (mockData.res.data.pageSetting.type == '3') {
          this.setData({
            selectData: mockData.res.data.pageSetting,
            'toastComponentInitData.isShowToast': true,
          })
        } else if (mockData.res.data.pageSetting.type == '4' || mockData.res.data.pageSetting.type == '5') {
          this.setData({
            selectData: mockData.res.data.pageSetting,
            'dialogComponentInitData.isShowDialog': true,
            isShowLuck: true,
          })
        }
      } else {
        const callConfigFn = app.globalData.isLogon ? this.getGamePage_token : this.getGamePage
        callConfigFn(pageId, false).then((res) => {
          if (res.data.data.pageSetting.type == '3') {
            this.setData({
              selectData: res.data.data.pageSetting,
              'toastComponentInitData.isShowToast': true,
            })
          } else if (res.data.data.pageSetting.type == '4' || res.data.data.pageSetting.type == '5') {
            const isShowLuck = this.getShowLuck(res.data.data.pageSetting)
            this.setData({
              selectData: res.data.data.pageSetting,
              'dialogComponentInitData.isShowDialog': true,
              isShowLuck: isShowLuck,
            })
          }
        })
      }
    },
    // 邀请注册组件回调
    // 1、邀请好友助力；2、保存图片到系统相册；3、接受邀请；4、我也要参与；5、获取头像；6、获取昵称，7、面对面邀请；8、邀请记录;9、二维码地址
    async actionInvite(e) {
      const item = e.detail.basicItem
      console.log('邀请注册组件回调', item)
      const { gameId, channelId } = this.data.options
      const pageId = this.getPageId(e)
      if (item.custom != '8') {
        // if(!this.checkIfActivityEnd()) return

        //时时校验活动是否已结束--start
        const res = await this.gameStatus()
        const game_finish = res.data.data.game_finish
        if (!this.checkGameOver(game_finish)) return
        //时时校验活动是否已结束---end

        //校验黑厂手机
        if (!this.activityCheckPhone()) return
      }
      this.activityTrack(e)
      if (item.custom == '7') {
        this.getGamePage_token(item.targetUrl, false).then((res) => {
          this.setData({
            userInfo: res.data.data.userInfo,
            selectData: res.data.data.pageSetting,
          })
          //打开面对面弹框
          this.actionShowFaceModal()
        })
      } else if (item.custom == '8') {
        //查看更多邀请记录
        wx.navigateTo({
          url: `${actTemplateInviteList}?pageId=${pageId}&gameId=${gameId}&channelId=${channelId}&fromSite=1&os=1`,
        })
      }
    },

    // 加入家庭
    actionJoinFamily(e) {
      console.log('JoinFamily methods')
      const item = e.detail.basicItem
      const { selectContainer } = e.detail
      const { options, os } = this.data
      console.log('basicItem', item)
      console.log('actionJoinFamily options...', options)
      const gameId = hasKey(options, 'gameId') ? options.gameId : ''
      const inviteUserId = hasKey(options, 'inviteUserId') ? options.inviteUserId : '523939' // seffid=524079，xym=523939
      const inviteType = selectContainer.containerType ? selectContainer.containerType : ''
      const shareId = hasKey(options, 'shareId') ? options.shareId : ''
      const fromSite = hasKey(options, 'fromSite') ? options.fromSite : ''
      const channelId = hasKey(options, 'channelId') ? options.channelId : ''
      const participateStatus = this.data.invitationCode
      let params = {
        gameId,
        inviteUserId,
        inviteType,
        shareId,
        fromSite,
        os,
        channelId,
        participateStatus,
      }
      this.receiveJoinFamily(params).then((res) => {
        console.log('receiveJoinFamily res', res)
        let pageId = res.data.data.next_page_id ? res.data.data.next_page_id : ''
        this.setData({
          inviteFamilyCode: res.data.code,
          'options.pageId': pageId,
        })
        //211214接受邀请后，刷新页面要清除invitationCode,否则跳转到首页会弹窗
        app.globalData.invitationCode = ''
        this.getGamePage_token(pageId)
          .then((res) => {
            // 浏览页面埋点
            actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
          })
          .catch((e) => {
            console.log('e', e)
          })
      })
    },

    // 接受邀请
    async actionAcceptInvite(e) {
      this.setData({
        joinBtnClicked: true,
      })
      //校验是否在活动期间
      // if(!this.checkIfActivityEnd()) return

      //时时校验活动是否已结束--start
      const gameStatusRes = await this.gameStatus()
      const game_finish = gameStatusRes.data.data.game_finish
      if (!this.checkGameOver(game_finish)) return
      //时时校验活动是否已结束---end

      //校验黑厂手机
      if (!this.activityCheckPhone()) return
      //校验是否活动期间注销过本账号
      if (!this.checkLogoutUser()) return
      wx.showLoading({
        title: '加载中...',
      })
      this.activityTrack(e)
      const { selectContainer } = e.detail
      const { options } = this.data
      const { fromSite, os } = this.data
      // console.log("selectContainer", selectContainer)
      // console.log("options", options)
      const gameId = hasKey(options, 'gameId') ? options.gameId : ''
      const inviteUserId = hasKey(options, 'inviteUserId') ? options.inviteUserId : ''
      const inviteType = selectContainer.containerType ? selectContainer.containerType : ''
      const shareId = hasKey(options, 'shareId') ? options.shareId : ''
      const channelId = hasKey(options, 'channelId') ? options.channelId : ''
      let params = {
        gameId,
        inviteUserId,
        inviteType,
        shareId,
        fromSite,
        os,
        channelId,
      }
      this.receiveInvited(params)
        .then((res) => {
          console.log('receiveInvited res', res)
          let pageId = res.data.data.next_page_id ? res.data.data.next_page_id : ''
          this.setData({
            'options.pageId': pageId,
          })
          this.getGamePage_token(pageId)
            .then((res) => {
              // 浏览页面埋点
              actEventViewPageTracking('page_view', options, res.data.data.pageSetting)
            })
            .catch((e) => {
              console.log('e', e)
            })
        })
        .catch((e) => {
          wx.hideLoading()
          console.log('e', e)
        })
      console.log('邀请页面按钮')
      this.setData({
        joinBtnClicked: false,
      })
      wx.hideLoading()
    },

    // 我也要参与  跳转至首页
    actionJoinIn(e) {
      const { options } = this.data
      console.log('options。。。page', options)
      this.activityTrack(e) //点击埋点
      wx.navigateTo({
        url: `${actTemplateHome}?gameId=${options.gameId}&channelId=${options.channelId}`,
      })
    },
    actionShowFaceModal() {
      this.setData({
        'faceComponentInitData.isShowFace': true,
      })
    },
    //面对面弹框
    actionHideFaceModal() {
      this.setData({
        'faceComponentInitData.isShowFace': false,
      })
    },
    // 通用热区打开app
    actionLaunchAppError(e) {
      this.activityTrack(e) //点击埋点
      wx.navigateTo({
        url: download,
      })
    },
    // 通用热区打开app
    actionLaunchAppSuccess(e) {
      this.activityTrack(e) //点击埋点
    },
    // 弹窗打开app
    actionLaunchAppDialogError(e) {
      console.log('打开美居app失败')
      if (this.checkDialogIfTrack(e)) {
        this.activityDialogTrack(e)
      }
      this.actionDialogClose()
      wx.navigateTo({
        url: download,
      })
    },
    // 弹窗打开app
    actionLaunchAppDialogSuccess(e) {
      if (this.checkDialogIfTrack(e)) {
        this.activityDialogTrack(e)
      }
      // this.activityDialogTrack(e)  //点击埋点
      this.actionDialogClose()
    },
    //跳转奖励列表
    actionGoRewardList(e) {
      this.activityTrack(e)
      const { gameId, channelId } = this.data.options
      let item = e.detail.basicItem
      let targetUrl = `/activities/activitiesTemp/pages/rewardList/rewardList?pageId=${item.targetUrl}&gameId=${gameId}&channelId=${channelId}&fromSite=1&os=1`
      wx.navigateTo({
        url: targetUrl,
      })
    },
    actionOpenFaceToFace(e) {
      const item = e.detail.basicItem
      console.log('面对面按钮回调', item)
      if (!this.activityCheckPhone()) return
      this.activityTrack(e)
      if (item.custom == '7') {
        this.getGamePage_token(item.targetUrl, false).then((res) => {
          this.setData({
            userInfo: res.data.data.userInfo,
            selectData: res.data.data.pageSetting,
          })
          //打开面对面弹框
          this.actionShowFaceModal()
        })
      }
    },
    //热区通用方法
    actionHotzoneCustom(e) {
      this.activityTrack(e)
      console.log('热区通用弹框', e)
      const { basicItem } = e.detail
      if (basicItem.target == 8) {
        const { options } = this.data
        wx.navigateTo({
          url: `${actTemplateHome}?gameId=${options.gameId}&channelId=${options.channelId}`,
        })
      }
      //跳转内页或链接
      else if (basicItem.target == 2 || basicItem.target == 5) {
        this.actionGoUrl(basicItem)
      } else if (basicItem.target == 9) {
        let { isHomeowner, isFullFamilyPeople } = basicItem
        if (isHomeowner === false) {
          showToast(errorMsg.notHomeOwner)
        } else if (isFullFamilyPeople === true) {
          this.setToast(errorMsg.fullFamilyPeople)
        }
      }
    },
    actionGoUrl(basicItem, type) {
      // appletsJumpType: 1、小程序原生页；2、H5
      // target: 2、活动内页面；5、链接；
      let { gameId, channelId } = this.data.options
      let currUrl
      let isTabFlag = false
      if (basicItem.target == 2) {
        currUrl = `${commonSubPage}?gameId=${gameId}&channelId=${channelId}&pageId=${basicItem.targetUrl}`
      } else {
        if (basicItem.appletsJumpType == 2) {
          let encodeLink = encodeURIComponent(basicItem.appletsJumpLink)
          currUrl = `${webViewPage}?webViewUrl=${encodeLink}`
        } else if (basicItem.appletsJumpType == 3) {
          this.actionGoOtherWxapp(basicItem)
        } else {
          isTabFlag = isTabPage(basicItem.appletsJumpLink)
          currUrl = basicItem.appletsJumpLink
        }
      }
      if (isTabFlag) {
        wx.switchTab({
          url: currUrl,
        })
      } else {
        wx.navigateTo({
          url: currUrl,
        })
      }
      if (type == 'dialog') {
        this.actionDialogClose()
      }
    },
    actionGoOtherWxapp(basicItem) {
      wx.navigateToMiniProgram({
        appId: basicItem.appId,
        path: basicItem.appletsJumpLink,
        success(res) {
          console.log(res)
        },
      })
    },
    //跳转到邀请记录页面
    actionGoInviteList(e) {
      const { gameId, channelId } = this.data.options
      const pageId = this.getPageId(e)
      wx.navigateTo({
        url: `${actTemplateInviteList}?pageId=${pageId}&gameId=${gameId}&channelId=${channelId}&fromSite=1&os=1`,
      })
    },
    //签到提醒
    actionSignAttention(e, basicItem, selectContainer) {
      const { rollSignInfo } = selectContainer.data
      console.log('rollSignInfo', rollSignInfo)
      //签到提醒,0-关闭，1-开启
      if (rollSignInfo.signNotice == 1) {
        const content = '关闭后将无法获得活动消息,可能会错过签到奖品哦~'
        const basicList = [
          {
            // "content": , // 按钮文案
            target: 1, // 跳转类型
            targetUrl: '', // 跳转地址
            name: '暂不关闭',
          },
          {
            // "content": , // 按钮文案
            target: 'closeSignNotice', // 跳转类型
            targetUrl: '', // 跳转地址
            name: '确定关闭',
          },
        ]
        this.setStaticDialog(4, content, basicList)
      } else if (rollSignInfo.signNotice == 0) {
        this.actionSignNotice(1)
      }
    },
    actionMoneyDialog(awardObj) {
      this.setData({
        'moneyComponentInitData.isShowMoneyDialog': true,
        selectData: awardObj,
      })
    },
    actionComposeDialog(awardObj, awardPageId, res) {
      const selectData = {
        awardPageId: awardPageId,
        signAwardInfo: awardObj,
      }
      this.setData({
        composePageSetting: res,
        composeContainerInfo: res.containerList.length ? res.containerList[0] : {},
        selectData: selectData,
        'rewardComponentInitData.isShowRewardDialog': true,
      })
    },
    actionCardDialog(awardObj, res) {
      this.setData({
        cardPageSetting: res,
        cardContainerInfo: res.containerList.length ? res.containerList[0] : {},
        selectData: awardObj,
        'cardComponentInitData.isShowCardDialog': true,
      })
    },
    // 奖励弹窗（抽奖机会）
    actionAwardDialog(awardObj, res) {
      this.setData({
        awardPageSetting: res,
        awardContainerInfo: res.containerList.length ? res.containerList[0] : {},
        selectData: awardObj,
        'awardComponentInitData.isShowAwardDialog': true,
      })
    },
    checkSign(res) {
      if (res.data.code == 10) {
        console.log('签到活动', res.data)
        const time = formatTime(new Date(res.data.data.signStartDate), '-')
        const content = `签到活动将于${time}开始，请准时参加哦`
        const basicList = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, content, basicList)
        return false
      } else if (res.data.code == 11) {
        const content = errorMsg.signStatusEnd
        const basicList = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, content, basicList)
        return false
      } else if (res.data.code == 12) {
        const content = '您当前帐号存在异常，详情请查看活动规则或咨询客服，谢谢～'
        const basicList = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, content, basicList)
        return false
      } else if (res.data.code == 14) {
        const content = res.data.msg
        const basicList = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, content, basicList)
        this.getGamePageInit_token()
        return false
      } else if (res.data.code == 15) {
        const content = errorMsg.selloutSign
        const basicList = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, content, basicList)
        this.getGamePageInit_token()
        return false
      } else if (res.data.code == 16) {
        const content = res.data.msg
        const basicList = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, content, basicList)
        this.getGamePageInit_token()
        return false
      } else if (res.data.code == 18) {
        //已连续签到一个周期
        const content = res.data.msg
        const basicList = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, content, basicList)
        // this.getGamePageInit_token()
        return false
      } else if (res.data.code == 3001 || res.data.code == 3003) {
        //活动没发布或者没开始
        const content = errorMsg.noStart
        const basicList = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, content, basicList)
        // this.getGamePageInit_token()
        return false
      } else if (res.data.code == 3002 || res.data.code == 3004) {
        //活动没发布或者没开始
        const content = errorMsg.end
        const basicList = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        this.setStaticDialog(4, content, basicList)
        // this.getGamePageInit_token()
        return false
      }
      return true
    },
    //签到
    actionSign() {
      this.signRolling().then((res) => {
        console.log('签到奖品', res.data)
        if (!this.checkSign(res)) return
        const { signAwardInfo, awardMessage, receiveAwardPageId, awardPageId, awardStockStatus, drawStockStatus } =
          res.data.data
        if (signAwardInfo.length == 0) {
          if (awardStockStatus === false) {
            // 奖品上限
            this.showUpperLimit('sign')
          } else if (drawStockStatus === false) {
            // 抽奖机会达上限
            this.showUpperLimit('draw')
          } else {
            const toastTips = awardMessage || '恭喜您完成了一次签到~'
            this.setToast(toastTips)
          }
        } else if (signAwardInfo.length == 1) {
          // 奖励类型，类型列表请查看containerMixins
          const awardObj = signAwardInfo[0]
          awardObj['prizeType'] = awardObj.type
          if (awardObj.type == 0 || awardObj.type == 1) {
            this.getGamePage_token(receiveAwardPageId, false).then((res) => {
              this.actionAwardDialog(awardObj, res.data.data.pageSetting)
            })
          } else if (awardObj.type == 3 || awardObj.type == 4) {
            this.getGamePage_token(receiveAwardPageId, false).then((res) => {
              this.actionCardDialog(awardObj, res.data.data.pageSetting)
            })
          } else if (awardObj.type == 6 || awardObj.type == 8) {
            this.getGamePage_token(receiveAwardPageId, false).then((res) => {
              this.actionAwardDialog(awardObj, res.data.data.pageSetting) // 可配置弹窗（获得抽奖机会）
            })
          } else if (awardObj.type == 9) {
            this.getGamePage_token(receiveAwardPageId, false).then((res) => {
              this.actionAwardDialog(awardObj, res.data.data.pageSetting) // 可配置弹窗（获得抽奖机会）
            })
          } else {
            this.actionComposeDialog(awardObj, awardPageId)
          }
        } else {
          const awardObj = signAwardInfo
          this.getGamePage_token(receiveAwardPageId, false).then((res) => {
            this.actionComposeDialog(awardObj, awardPageId, res.data.data.pageSetting)
            //this.actionComposeDialog(awardObj, awardPageId)
          })
        }
        this.getGamePageInit_token()
      })
    },
    //邀请家庭容器的通用处理
    async actionJoinFamilyContainer(e, basicItem) {
      // 1、邀请加入家庭；2、加入；3、获取头像；4、获取昵称、5邀请记录;6、没奖原因
      if (basicItem.custom == 1) {
        //校验是否在活动期间
        //  if(!this.checkIfActivityEnd()) return

        //时时校验活动是否已结束--start
        const gameStatusRes = await this.gameStatus()
        const game_finish = gameStatusRes.data.data.game_finish
        if (!this.checkGameOver(game_finish)) return
        //时时校验活动是否已结束---end
        //引导去美居app
        this.actionLaunchAppOnHome(e)
        return
        //校验黑厂手机
        // if (!this.activityCheckPhone()) return
        //校验注销
        // if (!this.checkLogoutUser()) return
      }
      if (basicItem.custom == 5) {
        this.actionGoInviteList(e)
      } else if (basicItem.custom == 2) {
        //校验是否在活动期间
        // if(!this.checkIfActivityEnd()) return
        //校验黑厂手机
        if (!this.activityCheckPhone()) return
        //校验是否活动中注销过
        if (!this.checkLogoutUser()) return
        // app.globalData.invitationCode=""
        //loginMethods.loginAPi('Y')
        this.loginAPi('Y')
          .then((res) => {
            console.log('云端加入家庭接口返回 re', res)
            this.setData({
              invitationCode: res.invitationCode,
            })
            console.log('invitationCode res', this.data.invitationCode)
            this.actionJoinFamily(e)
          })
          .catch((err) => {
            console.log('云端加入家庭接口返回 er', err)
            this.setData({
              invitationCode: err.data.code,
            })
            console.log('invitationCode er', this.data.invitationCode)
            // this.actionJoinFamily(e)
          })
      } else if (basicItem.custom == 7) {
        //校验是否在活动期间
        //  if(!this.checkIfActivityEnd()) return
        //时时校验活动是否已结束--start
        const gameStatusRes = await this.gameStatus()
        const game_finish = gameStatusRes.data.data.game_finish
        if (!this.checkGameOver(game_finish)) return
        //时时校验活动是否已结束---end
        //引导去美居app
        this.actionLaunchAppOnHome(e)
        //校验黑厂手机
        if (!this.activityCheckPhone()) return
      } else {
        //
      }
      // actionLaunchApp  打开美居
    },
    //签到容器的通用处理
    async actionRollingSignContainer(e, basicItem, selectContainer) {
      this.setData({
        rollingSignContainer: true,
        actionRollingSignContainerE: e,
        actionRollingSignContainerBasicItem: basicItem,
        actionRollingSignContainerSelectContainer: selectContainer,
      })
      // 1.点击签到;2.签到日历;3.签到提醒
      if (basicItem.custom == 1) {
        //时时校验活动是否已结束--start
        const gameStatusRes = await this.gameStatus()
        const game_finish = gameStatusRes.data.data.game_finish
        if (!this.checkGameOver(game_finish)) return
        //时时校验活动是否已结束---end
        //校验用户是否符合活动条件（人群包）
        if (!this.checkStatusUser()) return
        //是否在美居
        let { needLoad, min } = e.detail.selectGameRule
        if (needLoad) {
          const params = {
            basicItem: basicItem,
            selectContainer: selectContainer,
            content: min == 1 ? dialogText.toApp : dialogText.toZFB,
            nameList: min == 1 ? [dialogText.iKnow, dialogText.buttonToApp] : [dialogText.iKnow],
          }
          this.actionLaunchAppDialog({ detail: params })
          return
        }
        //校验黑厂手机
        if (!this.activityCheckPhone()) return
        //校验是否活动期间注销过本账号
        if (!this.checkLogoutUser()) return
        //滑块校验
        let captRes = await this.checkCaptchaStatus()
        let self = this
        if (captRes === false) {
          self.setData({
            captchaShow: true,
            captchaReload: true,
          })
          return
        }
        this.actionSign(e, basicItem, selectContainer)
      } else if (basicItem.custom == 3) {
        //校验是否在活动期间
        //  if(!this.checkIfActivityEnd()) return
        //时时校验活动是否已结束--start
        const gameStatusRes = await this.gameStatus()
        const game_finish = gameStatusRes.data.data.game_finish
        if (!this.checkGameOver(game_finish)) return
        //时时校验活动是否已结束---end
        //校验用户是否符合活动条件（人群包）
        if (!this.checkStatusUser()) return
        //校验黑厂手机
        if (!this.activityCheckPhone()) return
        this.actionSignAttention(e, basicItem, selectContainer)
      }
    },
    //统一容器入口处理方法
    actionContainer(e) {
      console.log('actionContainer==========', e)
      const { basicItem, selectContainer } = e.detail
      if (basicItem) {
        this.activityTrack(e)
      }
      // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；5、邀请加入家庭；6，任务盒子；7、滚动签到；8、固定签到；9、九宫格 10、新用户 11、道具排行 21、免费领取)
      switch (selectContainer.containerType) {
        case 1:
          break
        case 2:
          break
        case 3:
          this.actionInviteContainer(e, basicItem, selectContainer)
          break
        case 4:
          this.actionInviteContainer(e, basicItem, selectContainer)
          break
        case 5:
          this.actionJoinFamilyContainer(e, basicItem)
          break
        case 6:
          this.actionMyTaskContainer(e, basicItem, selectContainer)
          break
        case 7:
          this.actionRollingSignContainer(e, basicItem, selectContainer)
          break
        case 9:
          this.actionLuckGridContainer(e, basicItem, selectContainer)
          break
        case 10:
          this.actionTasksRegisterContainer(e)
          break
        case 12:
          this.actionPropRankContainer(e, basicItem)
          break
        case 13:
          this.actionLuckGridContainer(e, basicItem, selectContainer)
          break
        case 14:
          this.actionMyTaskContainer(e, basicItem, selectContainer)
          break
        case 16:
          this.actionMyTaskContainer(e, basicItem, selectContainer)
          break
        case 18:
          this.actionMyTaskContainer(e, basicItem, selectContainer)
          break
        case 19:
          this.actionMyTaskContainer(e, basicItem, selectContainer)
          break
        case 20:
          this.actionMyTaskContainer(e, basicItem, selectContainer)
          break
        case 21:
          this.actionFreeReceiveContainer(e, basicItem, selectContainer)
          break
        case 23:
          this.actionLuckGridContainer(e, basicItem, selectContainer)
          break
        case 24:
          this.actionLuckGridContainer(e, basicItem, selectContainer)
          break
        default:
          break
      }
    },
    actionGoAddress(e) {
      //校验是否在活动期间
      let prizeId = e.detail
      const { gameId, channelId } = this.data.options
      this.gameStatus().then((res) => {
        let game_finish = res.data.data.game_finish
        if (game_finish) {
          this.checkGameOver(true)
        } else {
          // //滑块验证 使用前请在上面的then方法里面的res前加上async
          // let captRes = await this.checkCaptchaStatus()
          // if (captRes === false) {
          //   this.setData({
          //     captchaReload: true,
          //     captchaShow: true,
          //     actionGoAddressE: e,
          //   })
          //   return
          // }
          wx.navigateTo({
            url: `${actTemplateReceiveAdress}?prizeId=${prizeId}&gameId=${gameId}&channelId=${channelId}`,
          })
        }
      })
    },
    //九宫格抽奖
    actionLuckGridContainer(e, basicItem, selectContainer) {
      console.log('actionLuckGridContainer======', e)
      console.log(basicItem, selectContainer)
      // 奖励类型，类型列表请查看containerMixins
      let { result, game_finish, game_nostart, game_blackuser, receiveAwardPageId, repeat_click } =
        e.detail.currDrawInfo
      //抽中
      if (result) {
        let awardObj = e.detail.currDrawInfo.prize
        if (awardObj.prizeType == 0 || awardObj.prizeType == 1) {
          //this.actionGiftDialog(awardObj)
          this.getGamePage_token(receiveAwardPageId, false).then((res) => {
            console.log('-----------------------------------------', awardObj)
            this.actionAwardDialog(awardObj, res.data.data.pageSetting)
          })
        } else if (awardObj.prizeType == 3 || awardObj.prizeType == 4) {
          this.getGamePage_token(receiveAwardPageId, false).then((res) => {
            this.actionCardDialog(awardObj, res.data.data.pageSetting)
          })
        } else if (awardObj.prizeType == 9) {
          this.getGamePage_token(receiveAwardPageId, false).then((res) => {
            this.actionAwardDialog(awardObj, res.data.data.pageSetting)
          })
        }
        this.getGamePageInit_token()
      }
      //活动结束弹框
      if (game_finish) {
        this.checkGameOver(true)
        return
      }
      // 活动未开始弹窗
      if (game_nostart) {
        this.checkGameNoStart(true)
        return
      }
      // 风险用户
      if (game_blackuser) {
        this.checkIsBlackUser(true)
      }
      // 重复点击
      if (repeat_click) {
        showToast(errorMsg.clickRepeatedly)
      }
    },
    actionShowToast(e) {
      this.setToast(e.detail)
    },
    actionFullShadow() {
      this.setData({
        fullShadow: !this.data.fullShadow,
      })
    },
    // 新用户注册容器处理
    actionTasksRegisterContainer(e) {
      // 展示前端自定义弹窗
      //21.10.21改成可配置
      // let { imgUrl } = e.detail;
      // this.setStaticDialog("5", "", [], imgUrl, 600, 741)
      let { pageId } = e.detail
      this.getGamePage_token(pageId, false).then((res) => {
        this.actionAwardDialog({}, res.data.data.pageSetting)
        this.getGamePageInit_token()
      })
    },
    // 道具排行容器处理
    actionPropRankContainer(e, basicItem) {
      console.log(e, '道具排行容器处理')
      if (basicItem.custom == 3) {
        //跳转我的积分记录页面
        this.actionGoScoreList(e)
      } else if (basicItem.custom == 4) {
        //跳转榜单
        this.actionGoRankList(e)
      }
    },
    actionGoScoreList(e) {
      let pageId = this.getPageId(e)
      const { gameId, channelId } = this.data.options
      wx.navigateTo({
        url: `${actTemplateScoreList}?pageId=${pageId}&gameId=${gameId}&channelId=${channelId}&fromSite=1&os=1`,
      })
    },
    actionGoRankList(e) {
      let pageId = this.getPageId(e)
      const { gameId, channelId } = this.data.options
      wx.navigateTo({
        url: `${actTemplateRankList}?pageId=${pageId}&gameId=${gameId}&channelId=${channelId}&fromSite=1&os=1`,
      })
    },
    // 邀请注册/绑定容器处理
    actionInviteContainer(e, basicItem, selectContainer) {
      let cusArr = [1, 3, 7]
      if (cusArr.indexOf(basicItem.custom) != '-1') {
        this.isCheckAwardStock(selectContainer).then((res) => {
          if (res.code == 2) return
          if (basicItem.custom == 7) {
            this.actionOpenFaceToFace(e)
          }
        })
      }
    },
    // 自定义静态数据弹框使用
    setStaticDialog(type, content, basicList, imgUrl = '', width = '', height = '') {
      this.data.selectPageObj.isStatic = true
      this.data.selectPageObj.type = type
      this.data.selectPageObj.popups.content = content
      this.data.selectPageObj.popups.basicList = basicList
      this.data.selectPageObj.popups.title = basicList.length ? basicList[0].title : '' // kk add
      if (type == 5) {
        this.data.selectPageObj.popups.imgUrl = imgUrl // wqh加 新用户注册新增弹窗
        this.data.selectPageObj.popups.width = width
        this.data.selectPageObj.popups.height = height
        this.data.selectPageObj.popups.rollFlag = false
      }
      this.setData({
        'dialogComponentInitData.isShowDialog': true,
        selectData: this.data.selectPageObj,
      })
    },
    checkReceiveChannel(e) {
      let self = this
      let { prizeId } = e.detail
      return new Promise((resolve, reject) => {
        self.isPrizeReceiveChannel(prizeId).then((res) => {
          // console.log('view===drawGrid=====', res)
          if (res.data.code != 0) {
            // self.actionFullShadow()
            self.setData({
              isLoading: false,
            })
            //活动结束弹框 3002 已关闭  3004 已结束 3005 已删除 3001 未发布 3003 未开始 4001 风险号
            if (res.data.code == 3002 || res.data.code == 3004 || res.data.code == 3005) {
              self.checkGameOver(true)
            } else {
              showToast(res.data.msg)
            }
            reject()
            return
          } else {
            //接口正常返回处理
            resolve(res)
            return
          }
        })
      })
    },
    //包函了虚拟券和权益直充
    async actionReceive(e) {
      const gameStatusRes = await this.gameStatus()
      const game_finish = gameStatusRes.data.data.game_finish
      if (!this.checkGameOver(game_finish)) return
      //时时校验活动是否已结束---end
      //校验用户是否符合活动条件（人群包）
      //20220407删除本地校验，交由接口校验
      // if (!this.checkStatusUser()) return

      if (this.data.actionReceiveE) {
        this.setData({
          receiveFlag: false,
        })
      }
      if (this.data.receiveFlag) {
        showToast(errorMsg.clickRepeatedly)
        return
      }
      this.setData({
        receiveFlag: true,
      })
      if (e.detail.awardsInfo.type != 9) {
        this.setData({
          actionReceiveE: e,
        })
      }
      let self = this
      let { from, prizeId } = e.detail
      //防暴击
      let awardsInfo
      if (from == 'reward-list') {
        awardsInfo = e.detail
      } else {
        awardsInfo = e.detail.awardsInfo
      }
      this.checkReceiveChannel(e)
        .then((res) => {
          if (res.data.data.awardChannel === 2) {
            //awardChannel  领取奖励渠道  1.不限  2.仅限美居app
            self.setData({
              receiveFlag: false,
            })
            if (from == 'my-reward' || from == 'view-award-dialog') {
              self.actionLaunchAppOnHome(e)
            }
            if (from == 'reward-list') {
              e.detail.content = dialogText.toApp
              e.detail.nameList = [dialogText.iKnow, dialogText.buttonToApp]
              self.actionLaunchAppDialog(e)
            }
          } else {
            //校验黑厂手机
            if (!this.activityCheckPhone()) {
              this.setData({
                receiveFlag: false,
              })
              return
            }
            //校验是否活动期间注销过本账号
            if (!this.checkLogoutUser()) {
              this.setData({
                receiveFlag: false,
              })
              return
            }
            //awardsInfo.type 类型列表请查看containerMixins
            if (awardsInfo.type === 0 || awardsInfo.prizeType === 0) {
              //实物奖励调用actionGoAdress,跳转到填写地址
              if (from == 'my-reward' || from == 'view-award-dialog') {
                let e = { detail: prizeId }
                self.actionGoAddress(e)
              } else {
                let e = { detail: prizeId }
                self.actionGoAddress(e)
              }
              setTimeout(() => {
                self.setData({
                  receiveFlag: false,
                })
              }, 500)
            } else if (
              awardsInfo.type === 3 ||
              awardsInfo.prizeType === 3 ||
              awardsInfo.type === 4 ||
              awardsInfo.prizeType === 4
            ) {
              //虚拟券调用actionReceiveVirtualCoupon领取方法
              self.actionReceiveVirtualCoupon(e)
            } else if (awardsInfo.type === 9 || awardsInfo.prizeType === 9) {
              if (from != 'charge') {
                self.setData({
                  receiveFlag: false,
                })
                //从奖励列表或者我的奖励跳转
                self.actionCheckCharge(e)
              } else {
                self.actionReceiveDirectCharge(e)
              }
            }
          }
        })
        .catch(() => {
          self.setData({
            receiveFlag: false,
          })
        })
    },
    async actionReceiveVirtualCoupon(e) {
      //虚拟券滑块验证
      let captRes = await this.checkCaptchaStatus()
      if (captRes === false) {
        this.setData({
          captchaShow: true,
          captchaReload: true,
          actionReceiveVirtualCouponE: e,
        })
        return
      }
      let { prizeId, from } = e.detail
      let self = this
      console.log('领取虚拟券调用滑块前', this.$state.sliderKey, this.data.verifyCode)
      this.receiveVirtualCoupon(prizeId)
        .then((res) => {
          self.setData({
            receiveFlag: false,
          })
          if (res.data.code != 0) {
            //活动结束弹框 3002 已关闭  3004 已结束  3005已删除 3001 未发布 3003 未开始 4001 风险号
            if (res.data.code == 3002 || res.data.code == 3004 || res.data.code == 3005) {
              self.checkGameOver(true)
            } else if (res.data.code == 3007) {
              this.showUpperLimit()
            } else if (res.data.code == 3008) {
              this.checkIsBlackUser(true)
            } else if (res.data.code == 4041) {
              this.checkStatusUser(true)
            } else if (res.data.code == 3009) {
              showToast(errorMsg.clickRepeatedly)
            } else {
              showToast(res.data.msg)
            }
            return
          } else {
            let { awardPageId, virtualCouponCode } = res.data.data
            //接口正常返回
            if (from == 'my-reward') {
              let awardsInfo = e.detail.awardsInfo
              awardsInfo['virtualCouponCode'] = virtualCouponCode
              self.getGamePage_token(awardPageId, false).then((res) => {
                self.actionCardDialog(awardsInfo, res.data.data.pageSetting)
              })
            }
            if (from == 'reward-list') {
              e.detail.targetUrl = awardPageId
              e.detail['virtualCouponCode'] = virtualCouponCode
              self.actionViewCard(e)
              self.initData()
              return
            }
            if (e.detail.isBeInvite) {
              self.refreshPageReward_token(false)
            } else {
              self.getGamePageInit_token()
            }
          }
        })
        .catch(() => {
          self.setData({
            receiveFlag: false,
          })
        })
    },
    //免费领取容器的通用处理
    async actionFreeReceiveContainer(e, basicItem, selectContainer) {
      if (!this.data.actionFreeReceiveContainerE) {
        this.setData({
          clickFlag: false,
        })
      }
      this.setData({
        actionFreeReceiveContainerE: e,
        actionFreeReceiveContainerBasicItem: basicItem,
        actionFreeReceiveContainerSelectContainer: selectContainer,
      })
      let self = this
      //不在领取周期内
      if (
        selectContainer.data.freeToReceiveInfo.freeActivityStatus == 0 ||
        selectContainer.data.freeToReceiveInfo.freeActivityStatus == 2
      ) {
        let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
        let content = errorMsg.notOperational
        this.setStaticDialog(4, content, basic)
        self.setData({
          clickFlag: true,
        })
        return
      }
      //滑块验证
      console.log('this.$state', this.$state)
      let captRes = await this.checkCaptchaStatus()
      if (captRes === false) {
        this.setData({
          freeReceiveContainer: true,
          captchaShow: true,
          captchaReload: true,
        })
        return
      }
      this.freeReceive()
        .then(() => {
          this.getGamePage_token(basicItem.targetUrl, false).then((res) => {
            self.setData({
              clickFlag: true,
            })
            this.actionAwardDialog({}, res.data.data.pageSetting)
            this.getGamePageInit_token()
          })
        })
        .catch((res) => {
          self.setData({
            clickFlag: true,
          })
          let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
          let { code } = res.data
          switch (code) {
            case 1:
              this.setStaticDialog(4, '你今天已经领取过了，不能再领取。明天再来吧~', basic)
              break
            case 16:
              this.setStaticDialog(4, errorMsg.accountRisk, basic)
              break
            case 3003:
              this.setStaticDialog(4, errorMsg.notStart, basic)
              break
            case 3004:
              this.setStaticDialog(4, errorMsg.end, basic)
              break
            case 4004:
              this.setStaticDialog(4, errorMsg.notOperational, basic)
              break
            case 4005:
              this.setStaticDialog(4, errorMsg.notOperational, basic)
              break
            case 4006:
              this.setStaticDialog(4, errorMsg.sellout, basic)
              break
            case 4008:
              this.setStaticDialog(4, errorMsg.maximumDraw, basic)
              break
            case 4009:
              this.setStaticDialog(4, errorMsg.failPoints, basic)
              break
            default:
              break
          }
        })
    },
    //任务盒子容器的通用处理
    actionMyTaskContainer(e, basicItem, selectContainer) {
      this.activityTrack(e)
      const { isAwardStock } = e.detail
      if (isAwardStock === false) {
        this.showUpperLimit()
        return
      }
      const { containerType } = selectContainer
      if (containerType == 6) {
        wx.redirectTo({
          url: '/distribution-network/scan-devices/pages/scan-device/scan-device',
        })
      } else if (containerType == 14) {
        //"任务盒子-访问插件页"
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else if (containerType == 16) {
        //"任务盒子-分享美的美居"
        this.actionLaunchApp()
      } else if (containerType == 18) {
        //"任务盒子-创建场景并启用"
        this.actionLaunchApp()
      } else if (containerType == 19) {
        // 打开特定链接（后端提供）
        setTimeout(() => {
          this.actionFinishTask(containerType)
        }, 1000)
        this.actionGoUrl(basicItem)
      } else if (containerType == 20) {
        //"任务盒子-分享活动"
        this.actionGoUrl()
      } else if (containerType == 22) {
        //"任务盒子-分享食谱（发现页-美食）"
        this.actionLaunchApp()
      }
    },
    actionFinishTask(containerType) {
      let { gameId } = this.data.options
      let params = {
        gameId,
        containerType,
      }
      this.finishTask(params)
    },
    //查看权益直充
    actionCheckCharge(e) {
      let { pageId, prizeId } = e.detail.awardsInfo
      let { gameId, channelId } = this.data.options
      wx.navigateTo({
        url: `/activities/activitiesTemp/pages/directCharge/directCharge?pageId=${pageId}&gameId=${gameId}&channelId=${channelId}&fromSite=1&os=1&prizeId=${prizeId}`,
      })
    },
    //领取权益直充
    async actionReceiveDirectCharge(e) {
      //虚拟券滑块验证
      let captRes = await this.checkCaptchaStatus()
      if (captRes === false) {
        this.setData({
          captchaShow: true,
          captchaReload: true,
          actionReceiveDirectChargeE: e,
        })
        return
      }
      let { prizeId } = e.detail.awardsInfo
      let { mobile } = e.detail
      let params = {
        prizeId,
        mobile,
      }
      this.activityTrack(e)
      this.receiveDirectCharge(params)
        .then(() => {
          this.setData({
            receiveFlag: false,
          })
          this.initpage()
        })
        .catch((res) => {
          if (res.data.code == 3002 || res.data.code == 3004 || res.data.code == 3005) {
            self.checkGameOver(true)
          } else if (res.data.code == 3007) {
            this.showUpperLimit()
          } else if (res.data.code == 3008) {
            this.checkIsBlackUser(true)
          } else if (res.data.code == 3010) {
            this.setToast(errorMsg.clickRepeatedly)
          } else if (res.data.code == 3011) {
            this.setToast(errorMsg.errorOther)
          } else {
            showToast('程序员小哥哥植发去了，请稍后重试')
          }
          this.setData({
            receiveFlag: false,
          })
        })
    },

    //以下区域存放组件专用公共方法，方法中的参数在本文件中无法找到的请到调用此方法的组件中找

    //获取数据中对应玩法的参与渠道限制
    getSelectGameRule(list) {
      // 容器类型(1、通用容器；2、我的奖励卡片；3、邀请注册；4、邀请绑定设备；5、邀请加入家庭；6，任务盒子)
      if (list.length === 0) return
      const selectContainer = this.properties.props
      const selectGameRule = list.filter((item) => {
        return this.data.gameRuleMap[item.playType] == selectContainer.containerType
      })
      if (selectGameRule.length === 0) return
      //20211124改动，改动渠道字段channelType变为数组，[0]为不限制，[1,2,3] 1美居2微信小程序3支付宝
      if (
        (Array.isArray(selectGameRule[0].channelType) &&
          !(selectGameRule[0].channelType.includes(0) || selectGameRule[0].channelType.includes(2))) ||
        selectGameRule[0].channelType === 2
      ) {
        let min = selectGameRule[0].channelType === 2 ? 1 : Math.min(...selectGameRule[0].channelType)
        selectGameRule[0] = { ...selectGameRule[0], min: min, needLoad: true }
      } else {
        selectGameRule[0] = { ...selectGameRule[0], needLoad: false }
      }
      console.log('选中的gameRule=====', selectGameRule[0])
      this.setData({
        selectGameRule: selectGameRule[0],
      })
    },
    //打开app弹框
    actionLaunchApp(e) {
      const item = e.currentTarget.dataset.item
      let loadType = e.currentTarget.dataset.loadtype
      const params = {
        basicItem: item,
        selectContainer: this.properties.props,
        content: loadType == 1 ? dialogText.toApp : dialogText.toZFB,
        nameList: loadType == 1 ? [dialogText.iKnow, dialogText.buttonToApp] : [dialogText.iKnow],
      }
      this.triggerEvent('actionLaunchAppDialog', params)
    },
    captchaOpen(e) {
      let { id, funcName, verifyCode } = e.detail
      this.setData({
        verifyCode,
        captchaShow: true,
        captchaReload: true,
      })
      if (id) {
        this.setData({
          otherContainerE: id,
          otherContainerEFuncName: funcName,
        })
      }
    },
    // 验证码成功回调
    captchaSuccess(e) {
      console.log('验证码成功回调', e)
      const token = e.detail
      const { options, pageSetting } = this.data
      actCaptchaTracking('activity_widget_event', options, pageSetting, { is_success: 1 })
      let params = {
        gameId: this.data.options.gameId,
        token: Base64.encode(token),
        appId: this.data.appId,
      }
      console.log('我走这里')
      this.actionCheckCaptcha(params)
        .then(() => {
          this.setData({
            captchaShow: false,
          })
          // 验证成功返回的token
          let { actionRollingSignContainerE } = this.data
          let { actionRollingSignContainerBasicItem } = this.data
          let { actionRollingSignContainerSelectContainer } = this.data
          if (actionRollingSignContainerE) {
            this.actionRollingSignContainer(
              actionRollingSignContainerE,
              actionRollingSignContainerBasicItem,
              actionRollingSignContainerSelectContainer
            )
            this.setData({
              actionRollingSignContainerE: '',
            })
            return
          }

          //免费领取
          let { actionFreeReceiveContainerE } = this.data
          let { actionFreeReceiveContainerBasicItem } = this.data
          let { actionFreeReceiveContainerSelectContainer } = this.data
          if (actionFreeReceiveContainerE) {
            this.actionFreeReceiveContainer(
              actionFreeReceiveContainerE,
              actionFreeReceiveContainerBasicItem,
              actionFreeReceiveContainerSelectContainer
            )
            this.setData({
              actionFreeReceiveContainerE: '',
            })
            return
          }
          //虚拟券
          let { actionReceiveE } = this.data
          if (actionReceiveE) {
            this.actionReceive(actionReceiveE).then(() => {
              this.setData({
                actionReceiveE: '',
              })
              return
            })
          }
          //权益直充
          let { actionReceiveDirectChargeE } = this.data
          if (actionReceiveDirectChargeE) {
            this.actionReceiveDirectCharge(actionReceiveDirectChargeE)
            this.setData({
              actionReceiveDirectChargeE: '',
            })
          }
          // //填写地址
          // let { actionGoAddressE } = this.data
          // if (actionGoAddressE) {
          //   this.actionGoAddress(actionGoAddressE)
          // }
          let { otherContainerE, otherContainerEFuncName } = this.data
          if (otherContainerE && otherContainerEFuncName) {
            console.log(typeof this.selectComponent('#' + otherContainerE)[otherContainerEFuncName])
            this.selectComponent('#' + otherContainerE)[otherContainerEFuncName]()
            this.setData({
              otherContainerE: '',
              otherContainerEFuncName: '',
            })
            return
          }
        })
        .catch(() => {
          this.setData({
            captchaShow: false,
          })
        })
    },
    // 验证码关闭回调
    captchaHide(e) {
      console.log('captcha_hide', e)
      const { options, pageSetting } = this.data
      actCaptchaTracking('activity_widget_event', options, pageSetting, { is_success: 0 })
      // freeReceiveContainerE: '',
      this.setData({
        captchaShow: false,
        actionReceiveE: '',
        actionGoAddressE: '',
        actionFreeReceiveContainerE: '',
        actionRollingSignContainerE: '',
        actionReceiveDirectChargeE: '',
        otherContainerE: '',
        otherContainerEFuncName: '',
      })
      if (this.data.receiveFlag) {
        this.setData({
          receiveFlag: false,
        })
      }
    },
    checkCaptchaStatus() {
      return new Promise((resolve, reject) => {
        let params = {
          gameId: this.data.options.gameId,
        }
        let { slidingValidation } = this.data.commonData
        //判断后端配置为不需要滑块验证时，直接通过
        if (!slidingValidation) {
          resolve(true)
          return
        }
        this.getCaptchaStatus(params)
          .then((res) => {
            //this.$state.sliderKey = res.data.data.verifyResult === true ? 'N' : 'Y'
            if (res.data.data.verifyResult === true) {
              resolve(true)
            } else {
              this.setData({
                //isSliderValidation: this.$state.sliderKey,
                verifyCode: res.data.data.verifyResult === true ? '' : res.data.data.verifyCode,
              })
              resolve(false)
            }
            // this.setData({
            //   //isSliderValidation: this.$state.sliderKey,
            //   verifyCode: res.data.data.verifyResult === true ? '' : res.data.data.verifyCode,
            // })
            // console.log('是否验证', this.data.isSliderValidation)
          })
          .catch(() => {
            reject()
            // this.setData({
            //   isSliderValidation: this.$state.sliderKey,
            // })
          })
      })
    },
    actionCheckCaptcha(params) {
      return new Promise((resolve, reject) => {
        this.checkCaptcha(params)
          .then(() => {
            resolve(true)
          })
          .catch((res) => {
            let basic = [{ target: 1, targetUrl: '', name: dialogText.iKnow, params: '' }]
            if (res.data.code == 40001) {
              showToast(errorMsg.checkCaptchaCatch)
            }
            if (res.data.code == 40002) {
              this.setStaticDialog(4, errorMsg.checkCaptchaFail, basic)
            }
            reject()
          })
      })
    },
  },
})
