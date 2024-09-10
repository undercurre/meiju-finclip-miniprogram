import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { requestService } from '../../../utils/requestService'
import { getReqId, getStamp, dateFormat } from 'm-utilsdk/index'
import images from './assets/js/img.js'
import getSetting from './assets/js/setting'
// const lottie  = require('../../../activities/common/lottie-miniprogram/index')
import { pluginEventTrack } from '../../../track/pluginTrack.js'
import { openSubscribe } from '../openSubscribe.js'
// import { delete } from 'vue/types/umd';
// import { delete } from 'vue/types/umd';

let btnPressTimer,
  queryTimer,
  errorDialogShow = false
let canvasDom = null
const errorShow = function () {
  if (!errorDialogShow) {
    errorDialogShow = true
    wx.showModal({
      title: '烟机故障',
      content: ['请立即关闭烟机', '若不能自行解决', '请联系专业维修人员', '400-889-9315'].join('\n'),
      showCancel: false,
      success: () => {
        errorDialogShow = false
      },
    })
  }
}
Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
  },
  data: {
    images,
    isCardActived: false,
    isNewVersion: false,
    scrollViewTop: 0,
    power: {
      imgList: {
        on: images.power_on,
        off: images.power_off,
      },
      mode: 'on',
      desc: '开机',
    },
    gear: {
      index: 0, // 当前选择的档位
      items: [], // 面板档位列表，从配置中读取
    },
    maxGear: {
      used: true, // 是否有爆炒按钮
      lastGear: 0, // 变成爆炒前的档位，点击取消爆炒后恢复
      desc: '',
      mode: 'off',
      imgList: {
        off: images.gear_max_off,
        on: images.gear_max_on,
      },
    },
    light: {
      // 照明
      desc: '照明',
      mode: 'off',
      imgList: {
        off: images.light_off,
        on: images.light_on,
      },
    },
    delayPowerOff: {
      // 延时关机
      used: true,
      desc: '延时关机',
      mode: 'off',
      imgList: {
        off: images.delay_off,
        on: images.delay_on,
      },
    },
    _applianceData: {
      name: '',
      roomName: '',
      onlineStatus: 0,
    },
    _applianceDataStatus: {
      error_code: 0,
      gear: 0,
      light: 'off',
      minutes: 0,
      power: 'off',
      version: 4,
      destination_time: 3,
    },
    isPowerOn: false,
    showManualItems: false,
    clockScale: new Array(120),
    btnPress: '',
    electronicControlVersion: 1,
    delayOffTime: 0,
    multiArray: ['1分钟', '2分钟', '3分钟', '4分钟', '5分钟', '6分钟', '7分钟', '8分钟', '9分钟', '10分钟'],
    multiIndex: [0],
    // timeArray: [1,2,3,4,5,6,7,8,9,10],
    timeArray: ['1分钟', '2分钟', '3分钟', '4分钟', '5分钟', '6分钟', '7分钟', '8分钟', '9分钟', '10分钟'],
    isAidry: {
      // 智感干洗
      desc: '智感干洗',
      mode: 'off',
      imgList: {
        off: images.aiDry_off,
        on: images.aiDryC_on,
      },
      isShow: false,
    },
    gears: [],
    sliderValue: 1,
    lightEnableStr: '0',
    screenWidth: 0,
    funcList: [],
    activityArr: [],
    deviceId: '',
    isLoad: false,
    isElectron: false,
    isZhigan: false,
    isDelayPower: false,
    isOtherOne: false,
    electronic_control_version: 1,
    cardOnBg: images.cardBg,
    fengJiNum: 0,
    youHeNum: 0,
    lvWangNum: 0,
    fanColor: '',
    oilColor: '',
    netColor: '',
    cleanData: {},
    bgColorGood: '#EBFAFF',
    bgColorSoso: '#FFF2E9',
    bgColorBad: '#FFEBEA',
    setting: {}
  },
  methods: {
    getCurrentMode() {
      return {
        applianceCode: this.data._applianceData.applianceCode,
        mode: this.data._applianceData.onlineStatus == 1 ? CARD_MODE_OPTION.COLD : CARD_MODE_OPTION.OFFLINE,
      }
    },
    getActived() {
      this.triggerEvent('modeChange', this.getCurrentMode())
      this.setData({ isCardActived: true })
      this.query()
    },
    getImage(desc) {
      // console.log('image',desc)
      if (desc == 'lights') {
        return images.light_white
      } else if (desc == 'cleaningHousekeeper') {
        return images.cleaning
      } else if (desc == 'zhiganSetting') {
        return images.aiDryC_on
      } else if (desc == 'lightSetting') {
        return images.aiLight
      } else if (desc == 'delayPowerOff') {
        return images.delayPowerOff
      }
    },
    getDestoried() {
      this.setData({ isCardActived: false })
      if (queryTimer) clearTimeout(queryTimer)
    },
    query(showLoading = true) {
      requestService
        .request('luaGet', {
          applianceCode: this.properties.applianceData.applianceCode,
          command: {},
          reqId: getStamp().toString(),
          stamp: getStamp(),
        })
        .then((rs) => {
          wx.hideLoading()
          this.setData({ _applianceDataStatus: rs.data.data })
          this.rendering(this.data._applianceDataStatus)
        })
        .catch((err) => {
          wx.hideLoading()
          if (err.data != undefined) {
            if (err.data.code == '1307') {
              this.setData({ '_applianceData.onlineStatus': '0' })
              this.triggerEvent('modeChange', this.getCurrentMode())
              // 设备离线
            } else if (err.data.code == '1306' && showLoading) {
              wx.showToast({ title: '设备未响应，请稍后尝试刷新', icon: 'none', duration: 2000 })
            }

            queryTimer = setTimeout(() => this.query(false), 5000) // 刷新失败5秒后重试
          }
        })
    },
    requestControl(control) {
      if (this.checkWorkStatusError()) {
        return Promise.reject()
      }
      wx.showLoading({
        mask: true,
        title: '加载中',
      })
      return requestService
        .request('luaControl', {
          applianceCode: this.properties.applianceData.applianceCode,
          command: { control },
          reqId: getStamp().toString(),
          stamp: getStamp(),
        })
        .then((rs) => {
          this.query()
          delete rs.data.data.status['work_status_desc']
          console.log(rs.data.data.status)
          this.setData({
            _applianceDataStatus: {
              ...this.data._applianceDataStatus,
              ...rs.data.data.status,
            },
          })
          this.rendering(this.data._applianceDataStatus)
          wx.hideLoading()
        })
        .catch((err) => {
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '请求失败，请稍后重试',
            icon: 'none',
            duration: 2000,
          })
          throw new Error('请求失败，请稍后重试')
        })
    },

    checkWorkStatusError(status) {
      if (this.properties.applianceData.sn8 === '00TJ9011' || this.properties.applianceData.sn8 === '00TT9012') {
        if (this.data._applianceDataStatus.error_code !== 0) {
          errorShow()
          return true
        }
      } else if (
        this.data._applianceDataStatus.error_code != 0 ||
        this.data._applianceDataStatus.work_status_desc == 'error'
      ) {
        errorShow()
        return true
      }
      return false
    },
    // 开关机
    powerToggle() {
      let params = {}
      var powerStatus = ''
      var workStatus = ''
      if (this.data._applianceDataStatus.power === 'off') {
        params.power = 'on'
        params.gear = this.data.isOtherOne ? 3 : 2
        powerStatus = 'on'
        workStatus = 'working'
      } else if (this.data._applianceDataStatus.power === 'delay_off') {
        params.power = 'off'
        powerStatus = 'off'
        workStatus = 'power_off'
      } else {
        // params.power = this.data.delayPowerOff.mode === 'on' ? 'delay_off' : 'off';
        // powerStatus = this.data.delayPowerOff.mode === 'on' ? 'delay_off' : 'off';
        // workStatus = this.data.delayPowerOff.mode === 'on' ? 'power_off_delay' : 'power_off';
        if (
          this.data._applianceDataStatus.ir === 'on' ||
          this.data._applianceDataStatus.work_status_desc == 'hotclean' ||
          this.data._applianceDataStatus.work_status == 21 ||
          this.data._applianceDataStatus.gear == 35 ||
          this.data._applianceDataStatus.work_status_desc == 'aidry'
        ) {
          params.power = 'off'
        } else if (!this.data.delayPowerOff.used) {
          params.power = 'off'
        } else if (!this.data.isDelayPower) {
          params.power = 'off'
        } else if (this.data.delayPowerOff.mode === 'off') {
          params.power = 'off'
        } else if (this.data.isZhigan && this.data.delayPowerOff.mode === 'on') {
          params.power = 'off'
        } else {
          params.power = 'off'
        }
      }

      if (this.data._applianceDataStatus.electronic_control_version == 2) {
        params.type = 'b6'
        params.b6_action = 'control'
        params.electronic_control_version = 2
        params.wind_type = 5
      } else {
        if (this.data._applianceDataStatus.work_status_desc == 'hotclean') {
          params.type = 'b6'
          params.b6_action = 'control'
          params.electronic_control_version = 2
          params.wind_type = 5
          params.steaming = 'off'
        }
      }

      if (params.power == 'off') {
        this.setData({
          isLoad: false,
        })
      }

      this.requestControl(params).then((rs) => {
        // this.query()
        if ((params.power = 'delay_off')) {
          let data = { '_applianceDataStatus.power': params.power }
          if (params.power === 'delay_off') params.gear = 1
          if (params.gear) data['_applianceDataStatus.gear'] = params.gear
          this.setData(data)
        } else {
          let data = { '_applianceDataStatus.power': params.power }
          if (params.power === 'delay_off') params.gear = 1
          if (params.gear) data['_applianceDataStatus.gear'] = params.gear
          this.setData(data)
          // this.rendering(this.data._applianceDataStatus);
        }
      })
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_power',
        widget_name: '开关机',
        ext_info: params.power === 'on' ? '开' : params.power === 'delay_off' ? '延时关机' : '关',
      })
    },
    // 点击爆炒控制按钮
    maxGearModeToggle() {
      let gear = 0
      if (this.data.maxGear.mode === 'off') {
        // 开启爆炒模式
        gear = this.data.gear.items[this.data.gear.items.length - 1].gear
        this.requestControl({ gear: gear })
      } else {
        gear = this.data.maxGear.lastGear
        this.requestControl({ gear: gear }) // 从爆炒模式还原
        // this.powerToggle();//直接关机
      }
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_gear',
        widget_name: '档位',
        ext_info: `${gear}档`,
      })
    },

    // 照明按钮
    lightToggle() {
      let params = {}
      params.light = this.data._applianceDataStatus.light == 'on' ? 'off' : 'on'
      if (this.data._applianceDataStatus.electronic_control_version == 2) {
        params.type = 'b6'
        params.b6_action = 'setting'
        params.setting = 'light'
        params.electronic_control_version = 2
      }
      this.requestControl(params)
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_light',
        widget_name: '照明',
        ext_info: params.power === 'on' ? '开' : '关',
      })
    },
    zhiganToggle() {
      var zhiganState = this.data.isAidry.mode == 'on' ? 'off' : 'on'
      let params = { aidry: zhiganState }
      if (this.data._applianceDataStatus.electronic_control_version == 2) {
        params.type = 'b6'
        params.b6_action = 'control'
        params.electronic_control_version = 2
      }
      console.log(params)
      if (zhiganState == 'on') {
        if (this.data.isDelayPower) {
          // delete params.aidry
          // params.power = 'delay_off';
          // params.b6_action = 'control';
          this.requestControl(params).then((rs) => {
            this.setData({
              'isAidry.mode': 'on',
              'light.mode': 'off',
              '_applianceDataStatus.work_status_desc': 'aidry',
            })
          })
        } else {
          this.requestControl(params)
        }
      } else {
        this.powerToggle()
      }
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_aidry',
        widget_name: '智感干洗',
        ext_info: zhiganState === 'on' ? '开' : '关',
      })
    },

    // 延时关机按钮
    delayPowerOffToggle() {
      if (this.data._applianceDataStatus.electronic_control_version == 2) {
      } else {
        try {
          const code = this.properties.applianceData.applianceCode
          const key = `key_B6_${code}_delay_off_status`
          const value = wx.getStorageSync(key)
          wx.setStorageSync(key, value === 'delay_off' ? '' : 'delay_off')
          this.setData({
            'delayPowerOff.mode': value === 'delay_off' ? 'off' : 'on',
          })
        } catch (e) {}
      }
    },
    //延时关机时间
    delayPowerOffSubmit(e) {
      var selectIndex = e.detail
      var timeText = this.data.timeArray[selectIndex]
      var time = Number(timeText.replace('分钟', ''))
      this.requestControl({
        type: 'b6',
        b6_action: 'setting',
        setting: 'power_off_delay',
        power_off_delay_timevalue: time,
        electronic_control_version: 2,
      }).then((rs) => {
        console.log('延时关机时间设置')
        this.setData({
          '_applianceDataStatus.destination_time': time,
        })
      })
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_power_off_delay_timevalue',
        widget_name: '延时关机时间设置',
        ext_info: `${time}分钟`,
      })
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_power_off_delay_timevalue',
        widget_name: '延时关机时间设置',
        ext_info: `${time}分钟`,
      })
    },

    rendering(status) {
      if (!this.data.isCardActived) return false
      if (queryTimer) clearTimeout(queryTimer)
      queryTimer = setTimeout(() => this.query(false), 3000)
      if (this.checkWorkStatusError()) return false
      let powerStatus = {}

      console.log(status.power)
      console.log(status.work_status_desc)
      console.log(this.data.isLoad)

      if (status.power === 'off' && status.work_status_desc != 'hotclean') {
        // 已经关机
        powerStatus = {
          'power.mode': 'on',
          'power.desc': '开机',
          isPowerOn: false,
        }
      } else {
        // 延时关机 // 正在运行
        powerStatus = {
          'power.mode': 'off',
          'power.desc': '关机',
          isPowerOn: true,
        }
      }
      let gearStatus = {}
      if (status.gear && status.gear != 18 && status.gear != 21) {
        var maxGear = this.data.gear.items[this.data.gear.items.length - 1].value
        if (status.gear > 4) {
          switch (status.gear) {
            case 121:
            case 127:
              status.gear = 1
              break
            case 139:
              status.gear = 2
              break
            case 151:
            case 157:
              status.gear = 3
              break
            case 8:
            case 181:
            case 193:
              status.gear = 4
              break
            case 21:
              status.gear = status.gear_detail
              break
            case 22:
              status.gear = 22
              break
            default:
              status.gear = maxGear
          }
          const newIndex = this.data.gear.items.findIndex((x) => x.value == status.gear || x.gear == status.gear)
          gearStatus['gear.index'] = newIndex
          if (this.data.maxGear.used) {
            gearStatus['maxGear.mode'] = this.data.gear.items[newIndex].super ? 'on' : 'off'
            const superGear = this.data.gear.items[this.data.gear.items.length - 1].gear
            if (status.gear !== superGear && status.power === 'on') {
              gearStatus['maxGear.lastGear'] = status.gear
              // 记录当前档位到爆炒按钮点击后获取档位
            }
          }
        } else {
          const newIndex = this.data.gear.items.findIndex((x) => x.value == status.gear || x.gear == status.gear)
          gearStatus['gear.index'] = newIndex
          if (this.data.maxGear.used) {
            gearStatus['maxGear.mode'] = this.data.gear.items[newIndex].super ? 'on' : 'off'
            const superGear = this.data.gear.items[this.data.gear.items.length - 1].gear
            if (status.gear !== superGear && status.power === 'on') {
              gearStatus['maxGear.lastGear'] = status.gear
              // 记录当前档位到爆炒按钮点击后获取档位
            }
          }
        }
      }

      console.log(status)

      this.setData({
        // 开关机按钮
        ...powerStatus,
        ...gearStatus,
        'delayPowerOff.mode': status.destination_time > 0 ? 'on' : 'off',
        '_applianceData.onlineStatus': '1',
        // 照明
        'light.mode': status.light,
        'isAidry.mode': status.aidry == 'on' || status.work_status == 21 ? 'on' : 'off',
        delayOffTime: status.destination_time,
        '_applianceDataStatus.gear': status.gear,
      })

      // if (!(status.power === 'off' && status.work_status_desc != 'hotclean') && !this.data.isLoad) {
      //     this.init()
      // }
      // else if ((status.power === 'on' && status.work_status_desc == 'hotclean')) {
      //     this.init()
      // }
    },
    renderCircle() {
      let circleProgressBar = this.selectComponent('#circleProgressBar') //重新渲染环状条
      if (circleProgressBar) circleProgressBar.updateProgress(this.isPowerOn ? this._applianceDataStatus.gear : 0)
    },
    gearChange(e) {
      if (e.target.id == 'tempMinus') {
        if (this.data.gear.index === 0) {
          wx.showToast({ title: '已达最低档位', icon: 'none' })
          return false
        }
        this.setData({ btnPress: 'left' })
        this.requestControl({ gear: this.data.gear.items[this.data.gear.index - 1].gear, power: 0 })
      }
      if (e.target.id == 'tempPlus') {
        if (this.data.gear.index === this.data.gear.items.length - 1) {
          wx.showToast({ title: '已达最高档位', icon: 'none' })
          return false
        }
        this.setData({ btnPress: 'right' })
        this.requestControl({ gear: this.data.gear.items[this.data.gear.index + 1].gear, power: 2 })
      }
      if (btnPressTimer) clearTimeout(btnPressTimer)
      btnPressTimer = setTimeout(() => {
        this.setData({ btnPress: '' })
      }, 250)
    },
    sliderChange: function (e) {
      let params = {}
      params.gear = e.detail.value
      if (this.data.electronicControlVersion == 2) {
        params.type = 'b6'
        params.b6_action = 'control'
        params.electronic_control_version = 2
      }
      this.requestControl(params)
      openSubscribe(this.data.applianceData)
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: 'click_gear',
        widget_name: '档位',
        ext_info: params.gear + '档',
      })
    },
    // clickToStewardServe: function(e) {
    //     var selectType = e.currentTarget.id
    //     wx.navigateTo({
    //         url: '../stewardServe/stewardServe?selectType=' + selectType + '&applianceId=' + this.properties.applianceData.applianceCode + '&platform=' + this.properties.applianceData.sn8,
    //     })
    // },
    // 初始化加载动画
    init() {
      var that = this
      // require('../card/assets/js/index.js', lottie => {
      //     console.log(lottie, '=====');
      //     that.initLottie(lottie)
      // })
      // let self=this
      // require('../../../sub-package/common-package/js/lottie-miniprogram/index', lottie => {
      //     console.log(lottie);
      //     self.initLottie(lottie)
      // })
    },
    initLottie(lotties) {
      let query = wx.createSelectorQuery()
      query
        .in(this)
        .select('#lottie_demo')
        .node((res) => {
          if (res != undefined) {
            const canvas = res.node
            const context = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = 750 * dpr
            canvas.height = 750 * dpr

            const requestAnimationFrame = canvas.requestAnimationFrame
            canvas.requestAnimationFrame = function () {
              rid = requestAnimationFrame.apply(canvas, arguments)
              return rid
            }
            canvasDom = canvas
            lotties.setup(canvas)
            lotties.loadAnimation({
              loop: true,
              autoplay: true,
              animationData: require('../card/assets/js/catrim.js'),
              //   path: `${images.b6DataJSON}`,
              rendererSettings: {
                context,
              },
            })

            // context.scale(dpr, dpr)
            // lotties.setup(canvas)
            // lotties.loadAnimation({
            //     loop: true,
            //     autoplay: true,
            //     path: `${images.b6DataJSON}`,
            //     rendererSettings: {
            //         context,
            //     },
            // })
          }
        })
        .exec()
      this.setData({
        isLoad: true,
      })
    },
    clickToWebView(e) {
      var selectIndex = parseInt(e.currentTarget.id)
      var currLink = this.data.activityArr[selectIndex].jumpLink
      let encodeLink = encodeURIComponent(currLink)
      let currUrl = `../../../pages/webView/webView?webViewUrl=${encodeLink}`
      wx.navigateTo({
        url: currUrl,
      })
    },
    handleDeviceData(datas) {
      var scoreData = datas
      // 风机40%，油盒25%，滤网20%，外表面15%
      // var score = scoreData.fanDirtyPercent * 0.4 + scoreData.oilBoxDirtyPercent * 0.25 + scoreData.netDirtyPercent* 0.2 + scoreData.surfaceDirtyPercent* 0.15
      let firstColor = ''
      let secondColor = ''
      let thirdColor = ''
      if (scoreData.fanDirtyPercent > 20) {
        firstColor = '#29C3FF'
      } else if (scoreData.fanDirtyPercent > 0 && scoreData.fanDirtyPercent <= 20) {
        firstColor = '#FF8225'
      } else {
        firstColor = '#E55225'
      }

      if (scoreData.oilBoxDirtyPercent > 20) {
        secondColor = '#29C3FF'
      } else if (scoreData.oilBoxDirtyPercent > 0 && scoreData.oilBoxDirtyPercent <= 20) {
        secondColor = '#FF8225'
      } else {
        secondColor = '#E55225'
      }

      if (scoreData.netDirtyPercent > 20) {
        thirdColor = '#29C3FF'
      } else if (scoreData.netDirtyPercent > 0 && scoreData.netDirtyPercent <= 20) {
        thirdColor = '#FF8225'
      } else {
        thirdColor = '#E55225'
      }

      this.setData({
        fengJiNum: scoreData.fanDirtyPercent,
        youHeNum: scoreData.oilBoxDirtyPercent,
        lvWangNum: scoreData.netDirtyPercent,
        cleanData: scoreData,
        fanColor: firstColor,
        oilColor: secondColor,
        netColor: thirdColor,
      })
    },
    deviceCleanStatus() {
      let types = 'getDirty'
      let params = {
        applianceId: this.data.applianceData.applianceCode,
        platform: this.data.applianceData.sn8,
        task: [],
      }
      requestService
        .request('getDeviceCleanStatus', {
          msg: types,
          params: params,
        })
        .then((res) => {
          console.log(res)
          if (res.data.desc == 'success') {
            this.handleDeviceData(res.data.result)
          }
        })
        .catch((err) => {
          console.log(err)
          if (err.data.desc == 'success') {
            this.handleDeviceData(err.data.result)
          }
        })
    },
    clickToStewardServe(e) {
      let allDataStr = JSON.stringify(this.data.cleanData)
      let selectNum = e.currentTarget.id
      let selectType = selectNum == '3' || selectNum == 'lightSetting' ? 'lightSetting' : 'clean'
      if (selectNum == '3') {
        wx.navigateTo({
          url:
            '../stewardServe/stewardServe?selectType=' +
            selectType +
            '&applianceId=' +
            this.data.applianceData.applianceCode +
            '&platform=' +
            this.data.applianceData.sn8,
        })
      } else {
        wx.navigateTo({
          url:
            '../stewardServe/stewardServe?selectType=' +
            selectType +
            '&cleanDataStr=' +
            allDataStr +
            '&cleanSelectNum=' +
            selectNum +
            '&applianceId=' +
            this.data.applianceData.applianceCode +
            '&platform=' +
            this.data.applianceData.sn8,
        })
      }
    },
  },

  async attached() {
    var app = getApp()
    console.log('attached: card')
    this.setData({
      uid: app.globalData.userData.uid,
      _applianceData: this.properties.applianceData,
    })

    this.deviceCleanStatus()

    console.log(this.properties.applianceData)
    const code = this.properties.applianceData.applianceCode
    let setting = await getSetting(this.properties.applianceData.sn8)
    if (setting.funcList) {
        setting.funcList = []
    //   setting.funcList.map((i) => {
    //     let desc = i
    //     i = { desc }
    //     i.type = this.getImage(i.desc)
    //     return i
    //   })
    }
    console.log('setting', setting)
    let gear = {
      'gear.items': setting.gear || [],
    }
    if (setting.gear && setting.gear.length) {
      gear['maxGear.lastGear'] = setting.gear[setting.gear.length > 1 ? 1 : 0].gear
      gear['maxGear.used'] = false
      if (setting.gear[setting.gear.length - 1].super) {
        gear['maxGear.used'] = true
        gear['maxGear.desc'] = setting.gear[setting.gear.length - 1].name
      }
    }
    var url = 'https://kh-content.midea-hotwater.com/luckybag_h5/index.html?deviceId=' + code
    var isNew = setting.funcList != undefined ? true : false
    var zhigan = setting.zhiganganxiUsed != undefined ? true : false
    var delayPower = setting.delayPowerOffUsed === false ? false : true
    var isOne = setting.isOtherOne != undefined ? true : false
    this.setData({
      'gear.item': setting.gear,
      ...gear,
      electronicControlVersion: setting.electronic_control_version == 2 ? 2 : 1,
      isNewVersion: isNew,
      isZhigan: zhigan,
      isDelayPower: delayPower,
      screenWidth: wx.getSystemInfoSync().screenWidth * 2 - 64,
      funcList: setting.funcList,
      deviceId: url,
      isElectron: setting.isElectron != undefined ? true : false,
      isOtherOne: isOne,
      electronic_control_version: setting.electronic_control_version || 1,
      setting: setting
    })
    // if(setting.electronic_control_version == 2) {

    // }
    // else {
    //     let delayPowerOff = {}
    //     if (setting.delayPowerOffUsed === false) {
    //         delayPowerOff['delayPowerOff.used'] = false;
    //     } else {
    //         try {
    //             const value = wx.getStorageSync(`key_B6_${code}_delay_off_status`);
    //             delayPowerOff['delayPowerOff.mode'] = value === 'delay_off' ? 'on' : 'off';
    //         } catch (e) {}
    //     }

    //     // if(setting.zhiganganxiUsed === true) {
    //     //     isAidry['isAidry.isShow'] = true
    //     // }

    //     this.setData({
    //         'gear.item': setting.gear,
    //         ...gear,
    //         ...delayPowerOff,
    //         electronicControlVersion: 1,
    //         screenWidth: wx.getSystemInfoSync().screenWidth * 2 - 64
    //     })
    // }
    requestService
      .request('getDeviceCleanStatus', {
        msg: 'b6CloudHousekeeper',
        params: {
          action: 'get',
          applianceId: code,
          platform: this.properties.applianceData.sn8,
        },
      })
      .then((res) => {
        console.log(res)
      })
      .catch((rs) => {
        console.log(rs)
      })
  },
  ready() {
    console.log('ready: card')
    this.init()
  },
})
