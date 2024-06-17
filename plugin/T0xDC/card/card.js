/* eslint-disable no-unused-vars */
// pages/T0xDC/card.js
import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { judgeWayToMiniProgram } from '../../../utils/util'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { imageApi, environment } from '../../../api'
import { openSubscribeModal } from '../../../globalCommon/js/deviceSubscribe.js'
import { modelIds, templateIds } from '../../../globalCommon/js/templateIds.js'
import statusToLua from '../dc_status_to_lua'
import luaToStatus from '../dc_lua_to_status'
import deviceUtils from '../utils/deviceUtils'
const app = getApp()
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  // 组件的属性列表
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
  },
  // 组件的初始数据
  data: {
    applianceStatus: {
      power: '',
    },
    styles: {
      tempBtnColor: '#5D75F6',
    },
    powerImg: {
      on: imageApi.getImagePath.url + '/0xDC/icon_switch_on01@3x.png',
      off: imageApi.getImagePath.url + '/0xDC/icon_switch_off01@3x.png',
    },
    // startImg: {
    //   on: imageApi.getImagePath.url + '/0xDC/icon_start_on01@3x.png',
    //   off: imageApi.getImagePath.url + '/0xDC/icon_start_off01@3x.png',
    // },
    startImg: {
      on: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_start.png',
      off: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_start_disable.png',
    },
    // pauseImg: {
    //   on: imageApi.getImagePath.url + '/0xDC/icon_pause_on01@3x.png',
    //   off: imageApi.getImagePath.url + '/0xDC/icon_pause_off01@3x.png',
    // },
    pauseImg: {
      on: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_pause.png',
      off: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_pause_disable.png',
    },
    circleImg: {
      on: imageApi.getImagePath.url + '/0xDC/img_wash_machine_circle01@3x.png',
      off: imageApi.getImagePath.url + '/0xDC/img_wash_machine_circle04@3x.png',
    },
    modeImg: {
      on: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_modeSelect.png',
      off: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_modeSelect_disable.png',
    },
    modeDesc: {
      delay: '预约中',
      delay_choose: '预约选择中',
      delay_pause: '预约暂停',
      fault: '错误状态',
      standby: '大约需要',
      start: '运行中',
      end: '运行完成',
      pause: '已暂停',
    },
    power: {
      mainImg: imageApi.getImagePath.url + '/0xDC/icon_switch_off01@3x.png',
      desc: '关机',
    },
    circleSrc: imageApi.getImagePath.url + '/0xDC/img_wash_machine_circle04@3x.png',
    machineIcon: imageApi.getImagePath.url + '/0xDC/img_wash-machine@3x.png',
    animationData: {},
    running_status1: {
      mainImg: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_start.png',
      desc: '启动',
    },
    running_status2: {
      mainImg: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_pause.png',
      desc: '暂停',
    },
    running_status3: {
      mainImg: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_start.png',
      desc: '设置模式',
    },
    showOfflineCard: false,
    scrollViewTop: 0,
    sliderColor: '#5D75F6',
    uiStyle: 'default',
    modeItemImgSize: '80rpx',
    renderRemainTimeId: null,
    runningAnimationTimerId: null,
    isQueryOffLine: false,
    configActivitys: [],
    runningAnimationValue: 0,
    modes: [],
    modeNames: [],
    modeIndex: 0,
    modeNameShown: '',
    selectModeIndex: -1,
    isShowModePicker: false,
    deviceConfig: {},
    notShowMode: false,
    pickerNameValue: [],
    needHorse: true,
    saveWaterImage: '',
    project_no: 0
  },
  // 组件的方法列表
  methods: {
    //*****固定方法，供外界调用****
    getCurrentMode() {
      //计算当前UI风格，common/js/cardMode.js文件只有defult/cold/heat/offline四种模式
      let mode
      if (this.data.applianceData.onlineStatus == 0 || this.data.isQueryOffLine) {
        // 离线
        mode = CARD_MODE_OPTION.OFFLINE
      } else {
        if (this.data.applianceStatus.power == 'off') {
          mode = CARD_MODE_OPTION.DEFAULT
        } else {
          mode = this.data.applianceStatus.mode == 'heat' ? CARD_MODE_OPTION.HEAT : CARD_MODE_OPTION.COLD
        }
      }
      return {
        applianceCode: this.data.applianceData.applianceCode,
        mode: mode,
      }
    },
    getActived() {
      //当设备列表页切换到当前页面时触发
      //通知外界更新界面
      // this.triggerEvent('modeChange', this.getCurrentMode());
      //刷新设备状态

      // this.loadActivitys();

      //创建运行状态动效
      this.animationData = wx.createAnimation({
        // duration: 1780,
        // delay: 0,
        // // timingFunction: 'linear',
        // transformOrigin: '50% 50% 0',
        // success: function(res) {
        //   console.log('res');
        // }
      })

      this.init()
      this.startTimer()

      // beging 添加字节埋点：进入插件页
      let param = {}
      param['page_name'] = '首页'
      param['object'] = '进入插件页'
      this.rangersBurialPointClick('plugin_page_view', param)
      // end 添加字节埋点：进入插件页
    },
    loadActivitys() {
      let fileName =
        environment === 'sit' || environment === 'dev' ? 'ActivityListMeijuLiteSit' : 'ActivityListMeijuLitePro'
      let resourceUri = '/xyj/midea_json_new/' + 'activity/' + fileName + '.json?time=' + Date.parse(new Date())
      requestService
        .request(resourceUri, {}, 'GET')
        .then((res) => {})
        .catch((err) => {
          if (err.statusCode === 200 && err.data && err.data.activityList) {
            this.setData(
              {
                configActivitys: err.data.activityList,
              },
              () => {}
            )
          }
        })
    },
    rotateAnimate: function (n) {
      this.animationData.rotate(0).step({ duration: 1 })
      this.setData({
        animationData: this.animationData.export(),
      })
      setTimeout(() => {
        this.animationData.rotate(360).step({ duration: 1800 })
        this.setData({
          animationData: this.animationData.export(),
        })
      }, 50)
    },
    initCard() {
      let self = this
      //初始化卡片页
      if (!this.data.isInit) {
        this.setData({
          isInit: true,
        })
        this.init()

        // this.setData({
        //   configActivitys: this.data.configActivitys
        // });

        this.getActivityConfig()
          .then((res) => {
            this.data.configActivitys = res.data.activityList
            this.setData({
              configActivitys: res.data.activityList,
            })
            this.getSaveWaterImage()
          })
          .catch((err) => {})

          this.data.project_no = parseInt(this.data.applianceData.modelNumber) > 0 ? parseInt(this.data.applianceData.modelNumber) : 0;
          if (this.data.project_no) {
            this.loadJsonConfig()
            .then((res) => {
              self.initDeviceJson(res)
            })
            .catch((err) => {})
          }
      }
    },
    initDeviceJson(res) {
      if (res && res.data) {
        this.setData({
          deviceConfig: res.data,
        })
        for (var i in res.data.paramData) {
          let mode = res.data.paramData[i]
          if (mode && mode.modeName) {
            this.data.modes.push(mode)
            this.data.modeNames.push(mode.modeName)
          }
        }
        if (this.checkNotShowMode()) {
          this.setData({
            notShowMode: true,
          })
        } else {
          this.setData({
            modes: this.data.modes,
            modeNames: this.data.modeNames,
          })
        }
      }
    },
    checkNotShowMode() {
      var result = false
      var notShowList = ['12343']
      if (this.data.project_no && notShowList.indexOf(this.data.applianceData.project_no) > -1) {
        result = true
      }
      return result
    },
    getDestoried() {
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      this.stopRenderRemainTime()
      this.stopRenderRunningTimer()
    },
    //*****固定方法，供外界调用****

    getActivityConfig() {
      // let configFileUrl = 'https://ismart.zhinengxiyifang.cn/midea_json_new/activity/ActivityListMeijuLitePro.json'
      let configFileUrl =
        'https://ismart.zhinengxiyifang.cn/midea_json_new/activity/ActivityListMeijuLiteRelease.json' +
        '?time=' +
        Date.parse(new Date())
      if (environment === 'sit' || environment === 'dev') {
        configFileUrl =
          'https://ismart.zhinengxiyifang.cn/midea_json_new/activity/ActivityListMeijuLiteSit.json' +
          '?time=' +
          Date.parse(new Date())
      }
      let header = {}
      header['Content-Type'] = 'application/json'
      return new Promise((resolve, reject) => {
        wx.request({
          url: configFileUrl,
          header: header,
          method: 'GET',
          success(resData) {
            resolve(resData)
          },
          fail(error) {
            reject(error)
          },
        })
      })
    },
    loadJsonConfig() {
      let jsonFileUrl =
        'https://ismart.zhinengxiyifang.cn/midea_json_new/DC/0000.dc.' +
        this.data.project_no +
        '.json?time=' +
        Date.parse(new Date())
      let header = {}
      header['Content-Type'] = 'application/json'
      return new Promise((resolve, reject) => {
        wx.request({
          url: jsonFileUrl,
          header: header,
          method: 'GET',
          success(resData) {
            resolve(resData)
          },
          fail(error) {
            reject(error)
          },
        })
      })
    },
    async getSaveWaterImage() {
      let saveWater = this.data.configActivitys.find((item) => {
        return item.type === 'saveWater'
      })
      console.log('save water', saveWater)
      if (saveWater && saveWater.hide !== true) {
        let begin = new Date(saveWater.beginTime).getTime()
        let end = new Date(saveWater.endTime).getTime()
        let now = new Date().getTime()
        if (now < begin || now > end) {
          return
        }
      } else {
        return
      }
      let res = await deviceUtils.getSaveWaterImage({
        idDeviceBase: this.data.applianceData.applianceCode,
      })
      console.log(res)
      this.setData({
        saveWaterImage: res?.data?.data?.entranceIconUrl,
      })
    },
    goToSaveWater() {
      let isOwner = app.globalData.applianceHomeData.createUserUid === app.globalData.userData.uid ? 1 : 0
      wx.navigateTo({
        url:
          '../pages/save-water/save-water-main/save-water-main?deviceId=' +
          this.data.applianceData.applianceCode +
          '&isOwner=' +
          isOwner,
      })
    },
    clickCloseWater() {
      this.setData({
        saveWaterImage: '',
      })
    },
    gotoMall() {
      if (this.data.applianceData.isAutoInput === true) {
        openSubscribeModal(
          modelIds[2],
          this.data.applianceData.name,
          this.data.applianceData.sn,
          [templateIds[22][0], templateIds[8][0]],
          this.data.applianceData.sn8,
          this.data.applianceData.type,
          this.data.applianceData.applianceCode
        )
      }
      const currentUid =
        app.globalData.userData && app.globalData.userData.uid && app.globalData.isLogon
          ? app.globalData.userData.uid
          : ''
      const randam = getStamp()
      let appId = 'wx255b67a1403adbc2'
      let res = this.data.configActivitys.find((item) => {
        return item.name === 'xiyiye'
      })
      if (!res || res.hide) {
        return
      }
      let path = res.url
      let extra = {
        jp_source: 3,
        jp_c4a_uid: currentUid,
        jp_rand: randam,
      }
      judgeWayToMiniProgram(appId, path, extra, this.data.shangchen__envVersion)
    },
    gotoPW() {
      this.clickToWebView()
      return
    },
    computeStatus() {
      if (this.data.applianceStatus && this.data.deviceConfig && this.data.deviceConfig.paramData) {
        let result = luaToStatus(this.data.applianceStatus)
        let currentMode = this.data.deviceConfig.paramData.find((mode) => {
          return mode.value === result.wash_mode
        })
        if (!currentMode) {
          this.data.modeNameShown = '云程序'
          this.data.modeIndex = 0
          this.data.pickerNameValue[0] = 0
          this.setData({
            modeNameShown: '云程序',
            modeIndex: 0,
            pickerNameValue: this.data.pickerNameValue,
          })
        } else {
          if (
            this.data.modes &&
            (!this.data.modeNameShown ||
              this.data.modeNameShown === '云程序' ||
              (this.data.modes[this.data.modeIndex] &&
                currentMode.value !== this.data.modes[this.data.modeIndex].value))
          ) {
            let index = this.data.modeNames.indexOf(currentMode.modeName)
            this.data.modeNameShown = currentMode.modeName
            this.data.modeIndex = index > -1 ? index : 0
            this.data.pickerNameValue[0] = this.data.modeIndex
            this.setData({
              modeNameShown: this.data.modeNameShown,
              modeIndex: this.data.modeIndex,
              pickerNameValue: this.data.pickerNameValue,
            })
          }
        }
      }
    },
    modeToggle() {
      let applianceStatus = this.data.applianceStatus
      if (
        applianceStatus.power == 'on' &&
        applianceStatus.running_status !== 'start' &&
        applianceStatus.running_status !== 'pause' &&
        applianceStatus.running_status !== 'fault' &&
        applianceStatus.running_status !== 'delay' &&
        applianceStatus.running_status !== 'end'
      ) {
        this.isShowModePicker = true
        this.setData({
          isShowModePicker: true,
        })
      } else {
        if (
          applianceStatus.power == 'on' &&
          this.data.deviceConfig.canChangeCycleOnPause &&
          applianceStatus.running_status === 'pause'
        ) {
          this.isShowModePicker = true
          this.setData({
            isShowModePicker: true,
          })
        } else {
          //showHint
        }
      }
    },
    closeModePop() {
      this.data.isShowModePicker = false
      this.setData({
        isShowModePicker: false,
      })
      setTimeout(() => {
        this.setData({
          pickerNameValue: this.data.pickerNameValue,
        })
      }, 500)
    },
    confirmModePop() {
      if (this.data.selectModeIndex === -1) {
        return
      }
      this.data.isShowModePicker = false
      this.setData({
        isShowModePicker: false,
      })
      if (this.data.selectModeIndex > -1 && this.data.selectModeIndex != this.data.modeIndex) {
        var mode = this.data.modes[this.data.selectModeIndex]
        this.changeMode(mode)
        this.data.selectModeIndex = -1
      }
    },
    selectModeChange(e) {
      if (e && e.detail && e.detail.value) {
        var result = e.detail.value[0]
        if (this.data.selectModeIndex != result) {
          if (result >= 0 && result < this.data.modes.length && this.data.modes[result]) {
            this.data.selectModeIndex = result
          }
        }
      }
    },
    changeMode(mode) {
      if (mode && mode.modeName) {
        let luaAttrs = statusToLua(
          {
            wash_mode: mode.value,
          },
          this.data.deviceConfig
        )
        let reqId = getReqId()
        this.luaControl(luaAttrs, reqId).then(() => {})
      }
    },
    computePower() {
      //渲染电源按钮和中间旋转圆圈
      let applianceStatus = this.data.applianceStatus
      let power = {}
      if (applianceStatus.power == 'on') {
        power = {
          mainImg: this.data.powerImg.off,
          desc: '关机',
        }
        // circleSrc = this.data.circleImg.on
      } else {
        power = {
          mainImg: this.data.powerImg.on,
          desc: '开机',
        }
        // circleSrc = this.data.circleImg.off
      }
      this.setData({
        power,
        // circleSrc
      })
    },
    computeStart() {
      //渲染启动按钮
      let applianceStatus = this.data.applianceStatus
      let running_status1 = {}
      if (
        applianceStatus.power == 'on' &&
        applianceStatus.running_status !== 'start' &&
        applianceStatus.running_status !== 'fault' &&
        applianceStatus.running_status !== 'delay' &&
        applianceStatus.running_status !== 'end'
      ) {
        running_status1 = {
          mainImg: this.data.startImg.on,
          desc: '启动',
        }
      } else {
        running_status1 = {
          mainImg: this.data.startImg.off,
          desc: '启动',
        }
      }
      this.setData({
        running_status1,
      })
    },
    computePause() {
      //渲染暂停按钮
      let applianceStatus = this.data.applianceStatus
      let running_status2 = {}
      if (
        applianceStatus.power == 'on' &&
        applianceStatus.running_status == 'start' &&
        applianceStatus.baby_lock !== 1
      ) {
        running_status2 = {
          mainImg: this.data.pauseImg.on,
          desc: '暂停',
        }
      } else {
        running_status2 = {
          mainImg: this.data.pauseImg.off,
          desc: '暂停',
        }
      }
      this.setData({
        running_status2,
      })
    },
    computeModeChange() {
      //渲染切程序按钮
      let applianceStatus = this.data.applianceStatus
      let running_status3 = {}
      if (
        applianceStatus.power == 'on' &&
        applianceStatus.running_status !== 'start' &&
        applianceStatus.running_status !== 'pause' &&
        applianceStatus.running_status !== 'fault' &&
        applianceStatus.running_status !== 'delay' &&
        applianceStatus.running_status !== 'end'
      ) {
        running_status3 = {
          mainImg: this.data.modeImg.on,
          desc: '设置模式',
        }
      } else {
        if (
          this.data.deviceConfig.canChangeCycleOnPause &&
          applianceStatus.running_status === 'pause' &&
          applianceStatus.running_status !== 'fault' &&
          applianceStatus.baby_lock !== 1
        ) {
          running_status3 = {
            mainImg: this.data.modeImg.on,
            desc: '设置模式',
          }
        } else {
          running_status3 = {
            mainImg: this.data.modeImg.off,
            desc: '设置模式',
          }
        }
      }
      this.setData({
        running_status3,
      })
    },
    computeButtons() {
      if (this.data.needHorse === true) {
        this.setData({
          needHorse: false,
        })
      }
      // this.computePower()
      this.computeStart()
      this.computePause()
      this.computeModeChange()
      //this.triggerEvent('modeChange', this.getCurrentMode());//向上层通知mode更改
    },
    renderRemainTime() {
      let remain_time = this.data.applianceStatus.remain_time
      if (this.data.applianceStatus.remain_time === 65535) {
        //向下拖动刷新，预约或者干衣完成将剩余时间显示为'--'
        remain_time = '--'
      } else {
        remain_time = this.data.applianceStatus.remain_time
      }
      this.setData({
        'applianceStatus.remain_time': remain_time,
      })
      if (this.data.applianceStatus.error_code != 0) {
        //直接向下拖动刷新后，预约故障等上报的是standby，需要以及error_code判断出故障状态；
        this.setData({
          'applianceStatus.remain_time': remain_time,
          'applianceStatus.running_status': 'fault',
        })
      }
    },
    stopRenderRemainTime() {
      clearInterval(this.data.renderRemainTimeId)
    },
    stopRenderRunningTimer() {
      clearInterval(this.data.runningAnimationTimerId)
      this.data.runningAnimationTimerId = null
    },
    startTimer() {
      this.stopRenderRemainTime()
      this.data.renderRemainTimeId = setInterval(
        function () {
          this.luaQuery(false)
            .then((res) => {
              this.computeButtons()
              this.renderRemainTime()
            })
            .catch((err) => {})
        }.bind(this),
        3000
      )
    },
    startRunningTimer() {
      this.stopRenderRunningTimer()
      let self = this
      self.rotateAnimate()
      this.data.runningAnimationTimerId = setInterval(
        function () {
          self.rotateAnimate()
        }.bind(this),
        2000
      )
    },
    checkRunningAnimation() {
      if (this.data.applianceStatus.power !== 'off' && this.data.applianceStatus.running_status == 'start') {
        if (this.data.runningAnimationTimerId) {
          return
        }
        this.startRunningTimer()
      } else {
        this.stopRenderRunningTimer()
      }
    },
    controlPower(p) {
      let self = this
      let power = p
      let remain_time = '--'
      let reqId = getReqId()
      this.luaControl(
        {
          power: power,
        },
        reqId
      ).then(() => {
        // beging 添加字节埋点：电源开关
        let param = {}
        param['page_name'] = '首页'
        param['object'] = '电源开关'
        param['ex_value'] = power == 'on' ? '关' : '开'
        param['value'] = power == 'on' ? '开' : '关'
        param['req_id'] = reqId
        this.rangersBurialPointClick('plugin_function_click_result', param)
        // end 添加字节埋点：电源开关

        // setTimeout(
        //   function () {
        //     this.luaQuery(true)
        //       .then((res) => {
        //         let result = res.data.data
        //         if (result.remain_time === 65535) {
        //           remain_time = '--'
        //         } else {
        //           remain_time = result.remain_time
        //         }
        //         result.remain_time = remain_time
        //         this.setData(
        //           {
        //             applianceStatus: result,
        //           },
        //           () => {
        //             self.checkRunningAnimation()
        //             self.computeStatus()
        //             self.renderRemainTime()
        //             self.computeButtons()
        //           }
        //         )
        //       })
        //       .catch((err) => {})
        //   }.bind(this),
        //   1000
        // )
      })
    },
    powerToggle() {
      //切换电源状态
      openSubscribeModal(
        modelIds[1],
        this.data.applianceData.name,
        this.data.applianceData.sn,
        [templateIds[1][0], templateIds[2][0]],
        this.data.applianceData.sn8,
        this.data.applianceData.type,
        this.data.applianceData.applianceCode
      )
      let self = this
      let power = this.data.applianceStatus.power == 'on' ? 'off' : 'on'
      if (
        power == 'off' &&
        (this.data.applianceStatus.running_status === 'start' ||
          this.data.applianceStatus.running_status === 'pause' ||
          this.data.applianceStatus.running_status === 'delay')
      ) {
        wx.showModal({
          title: '确认提示',
          content: '是否确认关机？',
          success(res) {
            if (res.confirm) {
              self.controlPower(power)
            }
          },
        })
        return
      }
      this.controlPower(power)
    },
    startToggle() {
      //切换启动状态
      openSubscribeModal(
        modelIds[1],
        this.data.applianceData.name,
        this.data.applianceData.sn,
        [templateIds[1][0], templateIds[2][0]],
        this.data.applianceData.sn8,
        this.data.applianceData.type,
        this.data.applianceData.applianceCode
      )
      let self = this
      let control_status = ''
      let remain_time = '--'
      if (
        this.data.applianceStatus.power == 'on' &&
        (this.data.applianceStatus.running_status == 'idle' ||
          this.data.applianceStatus.running_status == 'standby' ||
          this.data.applianceStatus.running_status == 'pause')
      ) {
        control_status = 'start'
        let reqId = getReqId()
        let exStatus =
          this.data.applianceStatus.running_status == 'idle' || this.data.applianceStatus.running_status == 'standby'
            ? '待机'
            : '暂停'
        this.luaControl(
          {
            control_status: control_status,
          },
          reqId
        ).then(() => {
          // beging 添加字节埋点：启动设备
          let param = {}
          param['page_name'] = '首页'
          param['object'] = '启动程序'
          param['ex_value'] = exStatus
          param['value'] = '启动'
          param['req_id'] = reqId
          this.rangersBurialPointClick('plugin_function_click_result', param)
          // end 添加字节埋点：启动设备
          // setTimeout(
          //   function () {
          //     this.luaQuery(true)
          //       .then((res) => {
          //         let result = res.data.data
          //         if (result.remain_time === 65535) {
          //           remain_time = '--'
          //         } else {
          //           remain_time = result.remain_time
          //         }
          //         result.remain_time = remain_time
          //         this.setData(
          //           {
          //             applianceStatus: result,
          //           },
          //           () => {
          //             self.checkRunningAnimation()
          //             self.computeStatus()
          //             self.renderRemainTime()
          //             self.computeButtons()
          //           }
          //         )
          //       })
          //       .catch((err) => {})
          //   }.bind(this),
          //   1000
          // )
        })
      } else {
        return //启动后禁止点击
      }
    },
    pauseToggle() {
      if (this.data.applianceStatus.running_status === 'start' && this.data.applianceStatus.baby_lock === 1) {
        wx.showToast({
          title: '请先关闭童锁',
          icon: 'none',
        })
        return
      }

      //切换暂停状态
      openSubscribeModal(
        modelIds[1],
        this.data.applianceData.name,
        this.data.applianceData.sn,
        [templateIds[1][0], templateIds[2][0]],
        this.data.applianceData.sn8,
        this.data.applianceData.type,
        this.data.applianceData.applianceCode
      )
      let self = this
      let control_status = ''
      let remain_time = ''
      //this.renderRemainTime()
      if (this.data.applianceStatus.running_status == 'start' && this.data.applianceStatus.baby_lock !== 1) {
        control_status = 'pause'
        let reqId = getReqId()
        this.luaControl(
          {
            control_status: control_status,
          },
          reqId
        ).then(() => {
          // beging 添加字节埋点：暂停设备
          let param = {}
          param['page_name'] = '首页'
          param['object'] = '暂停程序'
          param['ex_value'] = '启动'
          param['value'] = '暂停'
          param['req_id'] = reqId
          this.rangersBurialPointClick('plugin_function_click_result', param)
          // end 添加字节埋点：暂停设备
          // setTimeout(
          //   function () {
          //     this.luaQuery(true)
          //       .then((res) => {
          //         let result = res.data.data
          //         if (result.remain_time === 65535) {
          //           remain_time = '--'
          //         } else {
          //           remain_time = result.remain_time
          //         }
          //         result.remain_time = remain_time
          //         this.setData(
          //           {
          //             applianceStatus: result,
          //           },
          //           () => {
          //             self.checkRunningAnimation()
          //             self.computeStatus()
          //             self.renderRemainTime()
          //             self.computeButtons()
          //           }
          //         )
          //       })
          //       .catch((err) => {})
          //   }.bind(this),
          //   1000
          // )
        })
      } else {
        return //暂停后禁止点击
      }
    },
    luaQuery(manual) {
      let self = this
      return new Promise((resolve, reject) => {
        let reqData = {
          applianceCode: this.data.applianceData.applianceCode,
          command: {},
          stamp: +new Date(),
          reqId: getReqId(),
        }
        requestService
          .request('luaGet', reqData)
          .then((res) => {
            if (this.data.project_no <= 0 && parseInt(res.data.data.project_no) > 0) {
              this.data.project_no = parseInt(res.data.data.project_no);
              this.loadJsonConfig()
              .then((res) => {
                self.initDeviceJson(res)
              })
              .catch((err) => {})
            }
            this.setData({
              isQueryOffLine: false,
              'applianceData.onlineStatus': '1',
            })
            this.setData(
              {
                applianceStatus: res.data.data,
              },
              () => {
                self.checkRunningAnimation()
                self.computeStatus()
                resolve(res)
              }
            )
          })
          .catch((err) => {
            if (err && err.data && err.data.code == 1306 && manual) {
              // wx.showToast({
              //   title: '设备未响应，请稍后尝试刷新',
              //   icon: 'none'
              // })
            }
            if (err && err.data && err.data.code == 1307) {
              //离线,初始化
              this.setData({
                isQueryOffLine: true,
                'applianceData.onlineStatus': '0',
                needHorse: false,
              })
              //this.getActived()
              //this.initCard()
              // this.triggerEvent('modeChange', this.getCurrentMode());
            }
          })
      })
    },
    luaControl(changeItem, reqId) {
      //发送设备控制lua
      return new Promise((resolve, reject) => {
        wx.showLoading({
          title: '加载中...',
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 1500)
        let reqData = {
          applianceCode: this.data.applianceData.applianceCode,
          command: {
            control: changeItem,
          },
          stamp: +new Date(),
          reqId: reqId,
        }
        requestService
          .request('luaControl', reqData)
          .then((res) => {
            if (res.data.code == 0) {
              // this.setData({
              //   applianceStatus: res.data.data.status,
              // })
              // //this.renderCircle()
              // this.renderRemainTime()
              resolve(res)
            } else {
              reject(res)
            }
          })
          .catch((err) => {
            // wx.showToast({
            //   title: '设备控制失败，请稍后重试',
            //   icon: 'none'
            // })
            this.init()
          })
      })
    },
    rangersBurialPointClick(eventName, param) {
      if (this.data.applianceData) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '干衣机',
          widget_cate: this.data.applianceData.type,
          sn8: this.data.applianceData.sn8,
          sn: this.data.applianceData.sn,
          a0: this.data.project_no,
          iot_device_id: this.data.applianceData.applianceCode,
          online_status: this.data.applianceData.onlineStatus,
        }
        paramBurial = Object.assign(paramBase, param)
        rangersBurialPoint(eventName, paramBurial)
      }
    },
    init() {
      this.luaQuery(true)
        .then((res) => {
          let remain_time = '--'
          if (this.data.applianceStatus.remain_time === 65535) {
            //向下拖动刷新，预约、洗涤结束或者上报剩余时间为65535，将剩余时间显示为'--'
            remain_time = '--'
          } else {
            remain_time = this.data.applianceStatus.remain_time
          }
          this.setData({
            'applianceStatus.remain_time': remain_time,
          })
          this.renderRemainTime()
          this.computeButtons()
        })
        .catch((err) => {})
    },
  },
  attached() {
    this.init()
  },
})
