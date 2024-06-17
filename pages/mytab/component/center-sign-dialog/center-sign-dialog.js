import { judgeWayToMiniProgram } from '../../../../utils/util.js'
const imgBaseUrlMixins = require('../../../common/mixins/base-img-mixins.js')
import { clickEventTracking } from '../../../../track/track.js'
const signCycle7 = 7
const signDay7 = 7
const signDay15 = 15
Component({
  behaviors: [imgBaseUrlMixins],
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    isShowSignDialog: {
      type: Boolean,
      value: false,
      observer(val) {
        console.log('1119999999999999999')
        if (val) {
          this.getFormatInitData()
        }
      },
    },
    signData: {
      type: Object,
      value: {},
    },
    huiyuanEnvVersion: 'release',
    vipLevel: '',
    levelName: '',
    isShowB: {
      type: Boolean,
      value: false,
    },
  },
  // observers: {
  //     'signData'(newVal, oldVal){
  //         console.log("签到数据",val)
  //         this.getFormatInitData(val)
  //     }
  // },
  options: {
    addGlobalClass: true,
  },
  data: {
    // 这里是一些组件内部数据
    list: [
      { reward: 10, day: 1 },
      { reward: 10, day: 2 },
      { reward: 10, day: 3 },
      { reward: 10, day: 4 },
      { reward: 10, day: 5 },
      { reward: 10, day: 6 },
      { reward: 30, day: 7 },
    ],
    initData: {},
  },
  methods: {
    //自定义事件
    closeSignDialog() {
      this.triggerEvent('closeSignDialog')
    },
    getPoint(obj) {
      let hasGetPoint = 0
      if (obj.ContRegisterNum == signDay7) {
        hasGetPoint = obj.reward_0 + obj.reward_7
      } else if (obj.ContRegisterNum == signDay15) {
        hasGetPoint = obj.reward_0 + obj.reward_15
      } else {
        hasGetPoint = obj.reward_0
      }
      return hasGetPoint
    },
    getRollingDay(obj) {
      let remarks = ''
      if (obj.ContRegisterNum < signDay7) {
        remarks = `再连续签到${signDay7 - obj.ContRegisterNum}天额外获得${obj.reward_7}积分`
      } else if (obj.ContRegisterNum == signDay7) {
        remarks = `再连续签到${signDay15 - obj.ContRegisterNum}天额外获得${obj.reward_15}积分`
      } else if (obj.ContRegisterNum > signDay7 && obj.ContRegisterNum < signDay15) {
        remarks = `再连续签到${signDay15 - obj.ContRegisterNum}天额外获得${obj.reward_15}积分`
      } else if (obj.ContRegisterNum == signDay15) {
        remarks = remarks = `已成功签到15天,获得${obj.reward_15}积分额外奖励！`
      }
      return remarks
    },
    getListDay(obj, i) {
      //连续签到了4天，后面的自动往前滚动一天,滚到了第9天以后不需要再滚动
      const rollingDay = 5
      const rollingDay13 = 13
      if (obj.ContRegisterNum < rollingDay) {
        return i + 1
      } else if (
        obj.ContRegisterNum == rollingDay ||
        (obj.ContRegisterNum > rollingDay && obj.ContRegisterNum < rollingDay13)
      ) {
        return obj.ContRegisterNum - 3 + i
      } else {
        return 9 + i
      }
    },
    getListReward(day, obj) {
      if (day == signDay7) {
        return obj.reward_0 + obj.reward_7
      } else if (day == signDay15) {
        return obj.reward_0 + obj.reward_15
      } else {
        return obj.reward_0
      }
    },
    getListStatus(day, obj) {
      return day > obj.ContRegisterNum ? 0 : 1
    },
    getListOpacityLeft(day, obj, i) {
      return obj.ContRegisterNum > 4 && i == 0 ? 1 : 0
    },
    getListOpacityRight(day, obj, i) {
      return obj.ContRegisterNum < 15 && i == 6 ? 1 : 0
    },
    getList(obj) {
      let list = new Array()
      for (let i = 0; i < signCycle7; i++) {
        let item = new Object()
        const day = this.getListDay(obj, i)
        const reward = this.getListReward(day, obj)
        const status = this.getListStatus(day, obj)
        const opacityLeft = this.getListOpacityLeft(day, obj, i)
        const opacityRight = this.getListOpacityRight(day, obj, i)
        item.reward = reward
        item.day = day
        item.status = status
        item.opacityLeft = opacityLeft
        item.opacityRight = opacityRight
        list.push(item)
      }
      console.log('签到接口', list)
      return list
    },
    getFormatInitData() {
      const obj = this.properties.signData
      const list = this.getList(obj)
      const hasGetPoint = this.getPoint(obj)
      const remarks = this.getRollingDay(obj)

      obj.hasGetPoint = hasGetPoint
      obj.remarks = remarks
      this.setData({
        initData: obj,
        list: list || [],
      })
      this.triggerEvent('sendStr', obj)
    },
    // 跳转到会员小程序
    goToVipMiniProgram() {
      const miniProgramData = {
        appId: 'wx03925a39ca94b161',
        path: 'pages/score_mall/score_mall',
        extraData: {},
        // extraData: {
        //   jp_source: 3,
        //   jp_c4a_uid: currentUid,
        //   jp_rand: randam,
        // },
        envVersion: this.data.huiyuanEnvVersion, //develop/trial/release
      }
      judgeWayToMiniProgram(
        miniProgramData.appId,
        miniProgramData.path,
        miniProgramData.extraData,
        miniProgramData.envVersion
      )
      clickEventTracking('user_behavior_event', null, {
        module: '个人中心',
        page_id: 'popups_sign_in',
        page_name: '今日已签到弹窗',
        widget_name: '积分商城',
        widget_id: 'click_btn_integral_mall',
        object_type: '会员',
        object_id: this.data.vipLevel,
        object_name: this.data.levelName,
      })
      //上报abtest 积分入口点击数量
      const res = wx.getExptInfoSync(['expt_1672210866'])
      console.log('积分商城跳转入口样式ABtest', res, getApp().globalData.userData && getApp().globalData.userData.uid)
      if (res.expt_1672210866 == '0') {
        /* 对照组业务逻辑 */
        wx.reportEvent('points_entrance_click', {
          uid: (getApp().globalData.userData && getApp().globalData.userData.uid) || '',
          time: new Date().getTime(),
          points_entrance_click: '0',
        })
      } else if (res.expt_1672210866 == '1') {
        /* 实验组1业务逻辑 */
        wx.reportEvent('points_entrance_click', {
          uid: (getApp().globalData.userData && getApp().globalData.userData.uid) || '',
          time: new Date().getTime(),
          points_entrance_click: '1',
        })
      }
    },
    //返回app错误回调
    launchAppError() {
      console.log('hahdhafhhahdha')
      wx.navigateTo({
        url: '../download/download',
      })
    },
  },
  /*组件生命周期*/
  lifetimes: {
    created() {},
    attached() {
      console.log('在组件实例进入页面节点树时执行')
      let desc = '您已成功加入他人家庭，请前往美的美居App活动页领取福利'
      if (this.data.inviter && this.data.homeName) {
        desc = `您已成功加入“${this.data.inviter}”的“${this.data.homeName}”，请前往美的美居App活动页领取福利`
      }
      this.setData({
        desc: desc,
      })
    },
    ready() {
      console.log('在组件在视图层布局完成后执行')
    },
    moved() {
      console.log('在组件实例被移动到节点树另一个位置时执行')
    },
    detached() {
      console.log('在组件实例被从页面节点树移除时执行')
    },
    error() {
      console.log('每当组件方法抛出错误时执行')
    },
    /*组件所在页面的生命周期 */
    pageLifetimes: {
      show: function () {
        // 页面被展示
        console.log('页面被展示')
      },
      hide: function () {
        // 页面被隐藏
        console.log('页面被隐藏')
      },
      resize: function () {
        // 页面尺寸变化
        console.log('页面尺寸变化')
      },
    },
  },
})
