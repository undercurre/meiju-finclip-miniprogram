/* eslint-disable no-unused-vars */
// pages/T0xD9/card.js
import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { judgeWayToMiniProgram } from '../../../utils/util'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { imageApi, environment } from '../../../api'
import statusToLua from '../d9_status_to_lua'
import luaToStatus from '../d9_lua_to_status'
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
    iconImg: {
      normal: imageApi.getImagePath.url + '/0xD9/img_wash-machine@3x.png',
      lc: imageApi.getImagePath.url + '/0xD9/img_wash-machine_lc@3x.png',
    },
    powerImg: {
      on: imageApi.getImagePath.url + '/0xD9/icon_switch_on01@3x.png',
      off: imageApi.getImagePath.url + '/0xD9/icon_switch_off01@3x.png',
    },
    // startImg: {
    //   on: imageApi.getImagePath.url + '/0xD9/icon_start_on01@3x.png',
    //   off: imageApi.getImagePath.url + '/0xD9/icon_start_off01@3x.png',
    // },
    startImg: {
      on: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_start.png',
      off: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_start_disable.png',
    },
    // pauseImg: {
    //   on: imageApi.getImagePath.url + '/0xD9/icon_pause_on01@3x.png',
    //   off: imageApi.getImagePath.url + '/0xD9/icon_pause_off01@3x.png',
    // },
    pauseImg: {
      on: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_pause.png',
      off: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_pause_disable.png',
    },
    circleImg: {
      on: imageApi.getImagePath.url + '/0xD9/img_wash_machine_circle01@3x.png',
      off: imageApi.getImagePath.url + '/0xD9/img_wash_machine_circle04@3x.png',
    },
    modeImg: {
      on: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_modeSelect.png',
      off: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_modeSelect_disable.png',
    },
    modeDesc: {
      standby: '大约需要',
      start: '运行中',
      pause: '已暂停',
      end: '运行完成',
      fault: '错误状态',
      delay: '预约中',
      end_prevent_wrinkle: '运行完成',
      delay_pause: '预约暂停',
      delay_choose: '预约选择中',
    },
    noPW: false,
    isAutoInput: false,
    power: {
      mainImg: imageApi.getImagePath.url + '/0xD9/icon_switch_off01@3x.png',
      desc: '关机',
    },
    circleSrc: imageApi.getImagePath.url + '/0xD9/img_wash_machine_circle04@3x.png',
    // machineIcon: imageApi.getImagePath.url + '/0xD9/img_wash-machine_lc@3x.png',
    bucketButtonClassLeft: 'bucket-button-left',
    bucketButtonClassRight: 'bucket-button-right-active',
    animationData: {},
    machineIcon: imageApi.getImagePath.url + '/0xD9/img_wash-machine@3x.png',
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
    currentTube: {},
    tubeList: [],
    pressedPowOn: false,
    configActivitys: [],
    runningAnimationValue: 0,
    modesDownTube: [], // 下筒程序
    modesUpTube: [], // 上筒程序
    modeNames: [],
    modeIndex: 0,
    modeInLocation: 1,
    modeNameShown: '',
    selectModeIndex: -1,
    isShowModePicker: false,
    deviceConfig: {},
    currentTubeStatus: {},
    notShowMode: false,
    pickerNameValue: [],
    needHorse: true,
    saveWaterImage: '',
    notShowFault_db: [0x31, 0x34, 0x35, 0x36, 0x70, 0xEA, 0xEE, 0xEF],
    notShowFault_da: [10, 23, 25]
  },
  // 组件的方法列表
  methods: {
    //*****固定方法，供外界调用****
    getCurrentMode() {
      //计算当前UI风格，common/js/cardMode.js文件只有defult/cold/heat/offline四种模式
      let mode
      if (this.data.applianceData.onlineStatus == 0) {
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

      // beging 添加字节埋点：进入插件页
      let param = {}
      param['page_name'] = '首页'
      param['object'] = '进入插件页'
      this.rangersBurialPointClick('plugin_page_view', param)
      // end 添加字节埋点：进入插件页
    },
    async loadJson() {
      let self = this
      let resourceUri =
        'https://ismart.zhinengxiyifang.cn/midea_json_new/D9/0000.d9.' +
        this.data.applianceData.modelNumber +
        '.json?time=' +
        Date.parse(new Date())
      let header = {}
      header['Content-Type'] = 'application/json'
      wx.request({
        url: resourceUri,
        header: header,
        method: 'GET',
        success(resData) {
          self.setData(
            {
              deviceConfig: resData.data,
            },
            () => {
              // 初始化筒信息
              self.configTubeList()
              self.initDeviceJson(resData.data)
            }
          )
        },
        fail(error) {
          console.log('__func__ loadJson ERROR: ' + JSON.stringify(error))
          wx.showToast({
            title: '未获取到机器信息',
            icon: 'error',
            duration: 3000,
          })
          setTimeout((item) => {
            wx.navigateBack({
              delta: 1, //返回上一级页面
            })
          }, 3000)
        },
      })
    },
    loadActivitys() {
      let fileName =
        environment === 'sit' || environment === 'dev' ? 'ActivityListMeijuLiteSit' : 'ActivityListMeijuLitePro'
      let resourceUri = '/xyj/midea_json_new/' + 'activity/' + fileName + '.json?time=' + Date.parse(new Date())
      requestService
        .request(resourceUri, {}, 'GET')
        .then((res) => {})
        .catch((err) => {
          console.log('\n\n\n__func__ loadActivitys info ERROR : ' + JSON.stringify(err))
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
    clickToWebView() {
      var urlEnv = 'pro'
      if (environment === 'sit' || environment === 'dev') {
        urlEnv = 'sit'
      }
      var currLink = `https://ismart.zhinengxiyifang.cn/washerPW_meijulite/${urlEnv}/index.html#/WashingWaterPower?env=${urlEnv}&applianceId=${this.data.applianceData.applianceCode}&deviceType=D9&deviceSubType=${this.data.applianceData.modelNumber}&userId=${app.globalData.userData.iotUserId}&deviceSn8=${this.data.applianceData.sn8}&loginState=true`
      let encodeLink = encodeURIComponent(currLink)
      let currUrl = `../../../pages/webView/webView?webViewUrl=${encodeLink}`
      wx.navigateTo({
        url: currUrl,
      })
    },
    async initCard() {
      //初始化卡片页
      if (!this.data.isInit) {
        this.setData({
          isInit: true,
        })

        await this.loadJson()

        this.getActivityConfig()
          .then((res) => {
            this.data.configActivitys = res.data.activityList
            this.setData({
              configActivitys: res.data.activityList,
            })
            this.getSaveWaterImage()
          })
          .catch((err) => {})
      }
    },
    initDeviceJson(result) {
      if (result) {
        if (result.noElectricityWater) {
          this.data.noPW = true
          this.setData({
            noPW: true,
          })
        }
        let downParamData,
          upParamData = {}
        if (result.paramData && result.paramData.length) {
          // 外层paramData结构
          for (var i = 0; i < 2; i++) {
            var temp = result.paramData[i]
            if (temp && temp['db'] && temp['db']['paramData']) {
              downParamData = temp['db']['paramData']
            } else if (temp && temp['da'] && temp['da']['paramData']) {
              upParamData = temp['da']['paramData']
            } else if (temp && temp['dc'] && temp['dc']['paramData']) {
              upParamData = temp['dc']['paramData']
            }
          }
        } else if (result.tubeList && result.tubeList.length) {
          // 外层tubelist结构，包含上下筒信息和程序
          for (var j = 0; j < 2; j++) {
            var temp2 = result.tubeList[j]
            if (temp2 && temp2['paramData'] && temp2['location'] === 1) {
              upParamData = temp2['paramData']
            } else if (temp2 && temp2['paramData'] && temp2['location'] === 2) {
              downParamData = temp2['paramData']
            }
          }
        }
        if (upParamData && downParamData) {
          for (var k in downParamData) {
            var mode = downParamData[k]
            if (mode && mode.modeName) {
              this.data.modesDownTube.push(mode)
            }
          }
          for (var m in upParamData) {
            var mode2 = upParamData[m]
            if (mode2 && mode2.modeName) {
              this.data.modesUpTube.push(mode2)
            }
          }
          this.setData({
            modesDownTube: this.data.modesDownTube,
            modesUpTube: this.data.modesUpTube,
          })
        } else {
          this.data.notShowMode = true
          this.setData({
            notShowMode: true,
          })
        }
      }
    },
    getDestoried() {
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      // 离开当前页面，停止定时器
      this.stopTimer()
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
    checkModeNames() {
      if (this.data.currentTubeStatus) {
        let result = luaToStatus(this.data.currentTubeStatus)
        let currentMode = {}
        let tempModes = {}
        if (this.data.currentTube.location === 1) {
          tempModes = this.data.modesUpTube
        } else {
          tempModes = this.data.modesDownTube
        }
        currentMode = tempModes.find((mode) => {
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
            this.data.modesDownTube &&
            this.data.modesUpTube &&
            (!this.data.modeNameShown ||
              this.data.modeNameShown === '云程序' ||
              this.data.modeInLocation !== this.data.currentTube.location ||
              (tempModes[this.data.modeIndex] && currentMode.value !== tempModes[this.data.modeIndex].value))
          ) {
            let index = this.data.modeNames.indexOf(currentMode.modeName)
            this.data.modeNameShown = currentMode.modeName
            this.data.modeIndex = index > -1 ? index : 0
            this.data.pickerNameValue[0] = this.data.modeIndex
            this.setData({
              modeNameShown: this.data.modeNameShown,
              modeIndex: this.data.modeIndex,
              pickerNameValue: this.data.pickerNameValue
            })
          }
        }
        this.setData({
          modeInLocation: this.data.currentTube.location,
        })
      }
    },
    freshPickerNameValue() {
        if (this.data.pickerNameValue >= 0) {
        } else {
          this.data.pickerNameValue[0] = 0;
        }
        this.setData({
          pickerNameValue: this.data.pickerNameValue
        })
    },
    computeStatus() {
      if (this.data.currentTube.location < 1 || this.data.currentTube.location > 2) {
        return
      }

      if (this.data.modeInLocation !== this.data.currentTube.location || this.data.modeNames.length === 0) {
        this.data.modeNames.splice(0, this.data.modeNames.length)
        var tempModes = this.data.currentTube.location === 1 ? this.data.modesUpTube : this.data.modesDownTube
        for (var i in tempModes) {
          var mode = tempModes[i]
          if (mode && mode.modeName) {
            this.data.modeNames.push(mode.modeName)
          }
        }
        this.setData(
          {
            modeNames: this.data.modeNames,
          },
          () => {
            this.checkModeNames()
          }
        )
        return
      }
      this.checkModeNames();
    },
    modeToggle() {
      let applianceStatus = this.data.applianceStatus
      if (
        applianceStatus.power == 'on' &&
        applianceStatus.running_status !== 'start' &&
        applianceStatus.running_status !== 'pause' &&
        applianceStatus.running_status !== 'fault' &&
        applianceStatus.running_status !== 'delay' &&
        applianceStatus.running_status !== 'end' &&
        applianceStatus.baby_lock !== 1 &&
        applianceStatus.lock !== 'on'
      ) {
        this.data.isShowModePicker = true
        this.setData({
          isShowModePicker: true,
        })
      } else {
        var canChangeCycleOnPause = false
        if (this.data.deviceConfig.canChangeCycleOnPause) {
          canChangeCycleOnPause = true
        } else if (
          this.data.deviceConfig.tubeList &&
          (this.data.deviceConfig.tubeList[0].canChangeCycleOnPause ||
            this.data.deviceConfig.tubeList[1].canChangeCycleOnPause)
        ) {
          canChangeCycleOnPause = true
        }
        var supportChangeCycleAfterFinish = false;
        if (this.data.deviceConfig.supportChangeCycleAfterFinish) {
          supportChangeCycleAfterFinish = true
        } else if (
            this.data.deviceConfig.tubeList &&
            (this.data.deviceConfig.tubeList[0].supportChangeCycleAfterFinish ||
              this.data.deviceConfig.tubeList[1].supportChangeCycleAfterFinish)
        ) {
          supportChangeCycleAfterFinish = true
        }
        if (applianceStatus.power == 'on' && (canChangeCycleOnPause && applianceStatus.running_status === 'pause' ||
         canChangeCycleOnPause && applianceStatus.running_status === 'delay_pause' ||
         supportChangeCycleAfterFinish && applianceStatus.running_status === 'end') &&
         applianceStatus.running_status !== 'fault' &&
         applianceStatus.lock !== 'on' &&
         applianceStatus.baby_lock !== 1) {
          this.data.isShowModePicker = true
          this.setData({
            isShowModePicker: true,
          })
        } else {
          //showHint
        }
      }
      setTimeout(() => {
        this.freshPickerNameValue();
      }, 100);
    },
    closeModePop() {
      this.data.isShowModePicker = false
      this.setData({
        isShowModePicker: false,
      })
    //   setTimeout(() => {
    //     this.setData({
    //       pickerNameValue: this.data.pickerNameValue,
    //     })
    //   }, 500)
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
        let tempModes = {}
        if (this.data.currentTube.location === 1) {
          tempModes = this.data.modesUpTube
        } else {
          tempModes = this.data.modesDownTube
        }
        var mode = tempModes[this.data.selectModeIndex]
        this.changeMode(mode)
        this.data.selectModeIndex = -1
      }
    },
    selectModeChange(e) {
      if (e && e.detail && e.detail.value) {
        var result = e.detail.value[0]
        console.log(result)
        if (this.data.modeInLocation !== this.data.currentTube.location) {
          this.closeModePop()
          return
        }

        if (this.data.selectModeIndex !== result) {
          let tempModes = {}
          if (this.data.currentTube.location === 1) {
            tempModes = this.data.modesUpTube
          } else {
            tempModes = this.data.modesDownTube
          }

          if (result >= 0 && result < tempModes.length && tempModes[result]) {
            console.log(JSON.stringify(tempModes[this.data.modeIndex]))
            this.data.selectModeIndex = result
            this.setData({
              selectModeIndex: result,
            })
          }
        }
      }
    },
    changeMode(mode) {
      if (mode && mode.modeName) {
        let result = {}
        result.wash_mode = mode.value
        result.bucket = this.data.currentTube.bucket
        result.location = this.data.currentTube.location
        let luaAttrs = statusToLua(result)
        luaAttrs.bucket = this.data.currentTube.bucket
        luaAttrs[this.data.currentTube.bucket + '_location'] = this.data.currentTube.location
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
        applianceStatus.running_status !== 'end' &&
        applianceStatus.running_status !== 'end_prevent_wrinkle'
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
        applianceStatus.baby_lock != 1 &&
        applianceStatus.baby_lock != '1' &&
        applianceStatus.baby_lock != 'on'
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
        applianceStatus.running_status !== 'end' &&
        applianceStatus.lock !== 'on' &&
        applianceStatus.baby_lock !== 1 &&
        applianceStatus.baby_lock !== '1'
      ) {
        running_status3 = {
          mainImg: this.data.modeImg.on,
          desc: '设置模式',
        }
      } else {
        var canChangeCycleOnPause = false
        if (this.data.deviceConfig.canChangeCycleOnPause) {
          canChangeCycleOnPause = true
        } else if (
          this.data.deviceConfig.tubeList &&
          (this.data.deviceConfig.tubeList[0].canChangeCycleOnPause ||
            this.data.deviceConfig.tubeList[1].canChangeCycleOnPause)
        ) {
          canChangeCycleOnPause = true
        }
        var supportChangeCycleAfterFinish = false
        if (this.data.deviceConfig.supportChangeCycleAfterFinish) {
            supportChangeCycleAfterFinish = true
        } else if (
          this.data.deviceConfig.tubeList &&
          (this.data.deviceConfig.tubeList[0].supportChangeCycleAfterFinish ||
            this.data.deviceConfig.tubeList[1].supportChangeCycleAfterFinish)
        ) {
            supportChangeCycleAfterFinish = true
        }
        if (
          applianceStatus.power == 'on' &&
          (canChangeCycleOnPause && applianceStatus.running_status === 'pause' ||
          canChangeCycleOnPause && applianceStatus.running_status === 'delay_pause' ||
          supportChangeCycleAfterFinish && applianceStatus.running_status === 'end') &&
          applianceStatus.running_status !== 'fault' &&
          applianceStatus.baby_lock !== 1 &&
          applianceStatus.baby_lock !== '1' &&
          applianceStatus.lock !== 'on'
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
    computeTube() {
      if (this.data.currentTube.location === this.data.tubeList[0].location) {
        // 上筒
        this.setData({
          bucketButtonClassLeft: 'bucket-button-left-active',
          bucketButtonClassRight: 'bucket-button-right',
        })
      } else {
        // 下筒
        this.setData({
          bucketButtonClassLeft: 'bucket-button-left',
          bucketButtonClassRight: 'bucket-button-right-active',
        })
      }
    },
    computeButtons() {
      if (this.data.needHorse === true) {
        this.setData({
          needHorse: false,
        })
      }
      this.computeTube()
      // this.computePower()
      this.computeStart()
      this.computePause()
      this.computeModeChange()
      //this.triggerEvent('modeChange', this.getCurrentMode());//向上层通知mode更改
    },
    startTimer(duration) {
      this.stopTimer()
      this.data.renderRemainTimeId = setInterval(
        function () {
          this.luaQuery(false)
            .then((res) => {
              this.renderRemainTime()
              this.computeButtons()
            })
            .catch((err) => {})
        }.bind(this),
        duration ? duration : 3000
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
    renderRemainTime() {
      let remain_time = this.data.applianceStatus.remain_time
      if (remain_time === 65535) {
        //向下拖动刷新，预约、洗涤结束或者上报剩余时间为65535，将剩余时间显示为'--'
        remain_time = '--'
        this.setData({
          'applianceStatus.remain_time': remain_time,
        })
      }
    },
    stopTimer() {
      clearInterval(this.data.renderRemainTimeId)
      this.data.renderRemainTimeId = null
    },
    stopRenderRunningTimer() {
      clearInterval(this.data.runningAnimationTimerId)
      this.data.runningAnimationTimerId = null
    },
    // 切换上筒
    changeTubeUp() {
      console.log('__changeTubeUp__ : ' + JSON.stringify(this.data.currentTube))
      console.log('\n\n__changeTubeUp__ : ' + JSON.stringify(this.data.tubeList))
      this.changeTube(this.data.tubeList[0])
    },
    // 切换下筒
    changeTubeDown() {
      console.log('__changeTubeDown__ : ' + JSON.stringify(this.data.currentTube))
      console.log('\n\n__changeTubeDown__ : ' + JSON.stringify(this.data.tubeList))
      this.changeTube(this.data.tubeList[1])
    },
    // 切换上下筒
    changeTube(tube) {
      console.log('\n\n\n this currentTube : ' + JSON.stringify(this.data.currentTube))
      if (this.data.currentTube === undefined || tube.location === this.data.currentTube.location) {
        return
      }
      console.log('__changeTube__ :: ' + JSON.stringify(tube) + ' && ' + JSON.stringify(this.data.currentTube))
      if (this.data.applianceStatus.power !== 'on') {
        // 关机状态不可切换上下筒
        wx.showToast({
          title: '请开机后操作',
          icon: 'none',
        })
        return
      }

      if (
        this.data.applianceStatus.running_status == 'start' &&
        (this.data.applianceStatus.baby_lock == 1 || this.data.applianceStatus.baby_lock == 'on')
      ) {
        wx.showToast({
          title: '请先关闭童锁',
          icon: 'none',
        })
        return
      }

      console.log(
        '\n\n__changeTube__ :: ' +
          { bucket: tube.bucket, [tube.bucket + '_position']: 1, [tube.bucket + '_location']: tube.location }
      )
      let reqId = getReqId()
      this.luaControl({ position: tube.bucket, location: tube.location }, reqId).then(() => {
        this.data.currentTube = tube
        // beging 添加字节埋点：切换上下筒
        let param = {}
        param['page_name'] = '首页'
        param['object'] = '上下筒切换'
        param['ex_value'] = this.data.currentTube && this.data.currentTube.location == 2 ? '上桶' : '下桶'
        param['value'] = this.data.currentTube && this.data.currentTube.location == 2 ? '下桶' : '上桶'
        param['req_id'] = reqId
        this.rangersBurialPointClick('plugin_function_click_result', param)
        // end 添加字节埋点：切换上下筒
      })
      this.luaControl(
        { bucket: tube.bucket, [tube.bucket + '_position']: 1, [tube.bucket + '_location']: tube.location },
        reqId
      ).then(() => {
        this.data.currentTube = tube
        // beging 添加字节埋点：切换上下筒
        let param = {}
        param['page_name'] = '首页'
        param['object'] = '上下筒切换'
        param['ex_value'] = this.data.currentTube && this.data.currentTube.location == 2 ? '上桶' : '下桶'
        param['value'] = this.data.currentTube && this.data.currentTube.location == 2 ? '下桶' : '上桶'
        param['req_id'] = reqId
        this.rangersBurialPointClick('plugin_function_click_result', param)
        // end 添加字节埋点：切换上下筒
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
    powerToggle() {
      //切换电源状态
      let self = this
      let power = this.data.applianceStatus.power == 'on' ? 'off' : 'on'
      this.pressedPowOn = power === 'on'
      let reqId = getReqId()
      if (this.data.currentTube === undefined) {
        return
      }
      if (
        power === 'off' &&
        (this.data.applianceStatus.running_status === 'start' ||
          this.data.applianceStatus.running_status === 'pause' ||
          this.data.applianceStatus.running_status === 'delay')
      ) {
        wx.showModal({
          title: '确认提示',
          content: '是否确认关机？',
          success(res) {
            if (res.confirm) {
              self
                .luaControl(
                  {
                    bucket: self.data.currentTube.bucket,
                    [self.data.currentTube.bucket + '_power']: power,
                    [self.data.currentTube.bucket + '_location']: self.data.currentTube.location,
                  },
                  reqId
                )
                .then(() => {
                  // beging 添加字节埋点：电源开关
                  let param = {}
                  param['page_name'] = '首页'
                  param['object'] = '电源开关'
                  param['ex_value'] = self.data.applianceStatus.power == 'on' ? '开' : '关'
                  param['value'] = power == 'on' ? '开' : '关'
                  param['req_id'] = reqId
                  self.rangersBurialPointClick('plugin_function_click_result', param)
                  // end 添加字节埋点：电源开关
                })
            }
          },
        })
        return
      }
      this.luaControl(
        {
          bucket: this.data.currentTube.bucket,
          [this.data.currentTube.bucket + '_power']: power,
          [this.data.currentTube.bucket + '_location']: this.data.currentTube.location,
        },
        reqId
      ).then(() => {
        // beging 添加字节埋点：电源开关
        let param = {}
        param['page_name'] = '首页'
        param['object'] = '电源开关'
        param['ex_value'] = this.data.applianceStatus.power == 'on' ? '开' : '关'
        param['value'] = power == 'on' ? '开' : '关'
        param['req_id'] = reqId
        this.rangersBurialPointClick('plugin_function_click_result', param)
        // end 添加字节埋点：电源开关
      })
    },
    startToggle() {
      //切换启动状态
      let control_status = ''
      if (
        this.data.applianceStatus.running_status == 'idle' ||
        this.data.applianceStatus.running_status == 'standby' ||
        this.data.applianceStatus.running_status == 'pause'
      ) {
        control_status = 'start'
        let reqId = getReqId()
        let exStatus =
          this.data.applianceStatus.running_status == 'idle' || this.data.applianceStatus.running_status == 'standby'
            ? '待机'
            : '暂停'
        this.luaControl(
          {
            bucket: this.data.currentTube.bucket,
            [this.data.currentTube.bucket + '_control_status']: control_status,
            [this.data.currentTube.bucket + '_location']: this.data.currentTube.location,
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

          // this.setData({
          //   // 'applianceStatus.running_status': control_status
          // })
          // this.computeButtons()
        })
      } else {
        return //启动后禁止点击
      }
    },
    pauseToggle() {
      //切换暂停状态
      if (
        this.data.applianceStatus.running_status == 'start' &&
        (this.data.applianceStatus.baby_lock == 1 || this.data.applianceStatus.baby_lock == 'on')
      ) {
        wx.showToast({
          title: '请先关闭童锁',
          icon: 'none',
        })
        return
      }

      let control_status = ''
      if (this.data.applianceStatus.running_status == 'start') {
        control_status = 'pause'
        let reqId = getReqId()
        this.luaControl(
          {
            bucket: this.data.currentTube.bucket,
            [this.data.currentTube.bucket + '_control_status']: control_status,
            [this.data.currentTube.bucket + '_location']: this.data.currentTube.location,
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

          // this.computeButtons()
        })
      } else {
        return //暂停后禁止点击
      }
    },
    // 处理返回数据
    handleData(tube, resData) {
      let self = this
      this.setData({
        isQueryOffLine: false,
        'applianceData.onlineStatus': '1',
      })
      // this.triggerEvent('modeChange', this.getCurrentMode());
      var running_status = resData[tube.bucket + '_running_status']
      var baby_lock = resData[tube.bucket + '_baby_lock']
      if (
        resData[tube.bucket + '_error_code'] &&
        '0' !== resData[tube.bucket + '_error_code'] &&
        'ff' !== resData[tube.bucket + '_error_code'] &&
        'FF' !== resData[tube.bucket + '_error_code']
      ) {
        if (tube.bucket === 'da' && this.data.notShowFault_da.indexOf(parseInt(resData[tube.bucket + '_error_code'])) < 0) {
          running_status = 'fault'
        } else if (tube.bucket === 'db' && this.data.notShowFault_db.indexOf(parseInt(resData[tube.bucket + '_error_code'])) < 0) {
          running_status = 'fault'
        }
      }
      var data
      if (resData[tube.bucket + '_power'] === 'off') {
        data = {
          'applianceStatus.power': resData[tube.bucket + '_power'],
          currentTube: tube,
          currentTubeStatus: resData,
        }
      } else {
        data = {
          'applianceStatus.power': resData[tube.bucket + '_power'],
          'applianceStatus.remain_time': resData[tube.bucket + '_remain_time'],
          'applianceStatus.running_status': running_status,
          currentTube: tube,
          'applianceStatus.baby_lock': baby_lock,
          currentTubeStatus: resData,
        }
      }
      this.setData(data, () => {
        self.checkRunningAnimation()
        self.computeStatus()
      })
      if (this.pressedPowOn && resData[tube.bucket + '_power'] === 'on') {
        this.pressedPowOn = false
      }
    },
    hideLoadingWait(x) {
      setTimeout(() => {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      }, x * 1000)
    },
    luaQuery(manual) {
      return new Promise((resolve, reject) => {
        let reqData = {
          applianceCode: this.data.applianceData.applianceCode,
          command: {
            query: {
              query_type: this.data.tubeList[0].bucket,
              [this.data.tubeList[0].bucket + '_location']: this.data.tubeList[0].location,
            },
          },
          stamp: +new Date(),
          reqId: +new Date(),
        }

        requestService
          .request('luaGet', reqData)
          .then((res) => {
            let resData = res.data.data
            let bucket = resData.bucket
            if (1 === resData[bucket + '_position'] || '1' === resData[bucket + '_position']) {
              // 当前上筒
              this.data.currentTube = this.data.tubeList[0]
              this.handleData(this.data.tubeList[0], resData)
              resolve(resData)
              return
            } else {
              // 继续查询下筒
              let reqData1 = {
                applianceCode: this.data.applianceData.applianceCode,
                command: {
                  query: {
                    query_type: this.data.tubeList[1].bucket,
                    [this.data.tubeList[1].bucket + '_location']: this.data.tubeList[1].location,
                  },
                },
                stamp: +new Date(),
                reqId: +new Date(),
              }

              requestService
                .request('luaGet', reqData1)
                .then((res1) => {
                  let resData1 = res1.data.data
                  this.data.currentTube = this.data.tubeList[1]
                  this.handleData(this.data.tubeList[1], resData1)
                  resolve(resData1)
                })
                .catch((err) => {
                  if (err && err.data && err.data.code == 1306 && manual) {
                    // if (this.showErrorToast) {
                    // this.showErrorToast = false
                    // wx.showToast({
                    //   title: '设备未响应，请稍后尝试刷新',
                    //   icon: 'none'
                    // })
                    // }
                  }
                  if (err && err.data && err.data.code == 1307) {
                    //离线,初始化
                    this.setData({
                      isQueryOffLine: true,
                      'applianceData.onlineStatus': '0',
                      needHorse: false,
                    })
                    // this.getActived()
                    // this.initCard()
                    // this.triggerEvent('modeChange', this.getCurrentMode());
                  }
                })
            }
          })
          .catch((err) => {
            console.log('luaQuery error: ' + err)
            console.log('err: ' + JSON.stringify(err))
            if (err && err.data && err.data.code == 1306 && manual) {
              // if (this.showErrorToast) {
              // this.showErrorToast = false
              // wx.showToast({
              //   title: '设备未响应，请稍后尝试刷新',
              //   icon: 'none'
              // })
              // }
            }
            if (err && err.data && err.data.code == 1307) {
              //离线,初始化
              this.setData({
                isQueryOffLine: true,
                'applianceData.onlineStatus': '0',
              })
              // this.getActived()
              // this.initCard()
              // this.triggerEvent('modeChange', this.getCurrentMode());
            }
            // wx.hideNavigationBarLoading()
          })
      })
    },
    luaControl(changeItem, reqId) {
      //发送设备控制lua
      changeItem.merge = 'false'
      console.log('luaControl param: ' + JSON.stringify(changeItem))
      return new Promise((resolve, reject) => {
        wx.showLoading({
          title: '加载中...',
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 2500)
        let reqData = {
          applianceCode: this.data.applianceData.applianceCode,
          command: { control: changeItem },
          stamp: +new Date(),
          reqId: reqId,
        }
        requestService
          .request('luaControl', reqData)
          .then((res) => {
            if (res.data.code == 0) {
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
            // this.init()
          })
      })
    },
    rangersBurialPointClick(eventName, param) {
      if (this.data.applianceData) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '复试洗衣机',
          widget_cate: this.data.applianceData.type,
          sn8: this.data.applianceData.sn8,
          sn: this.data.applianceData.sn,
          a0: this.data.applianceData.modelNumber,
          iot_device_id: this.data.applianceData.applianceCode,
          online_status: this.data.applianceData.onlineStatus,
        }
        paramBurial = Object.assign(paramBase, param)
        rangersBurialPoint(eventName, paramBurial)
      }
    },
    configTubeList() {
      if (this.data.deviceConfig) {
        if (this.data.deviceConfig.tubeList && this.data.deviceConfig.tubeList.length > 0) {
          let tube0 = this.data.deviceConfig.tubeList[0]
          let tube1 = this.data.deviceConfig.tubeList[1]

          if (tube0.bucket && tube0.location && tube1.bucket && tube1.location) {
            this.data.tubeList = [
              { bucket: tube0.bucket, location: tube0.location },
              { bucket: tube1.bucket, location: tube1.location },
            ]
          } else if (tube0 && tube1) {
            this.data.tubeList = [
              { bucket: tube0, location: 1 },
              { bucket: tube1, location: 2 },
            ]
          } else {
            this.data.tubeList = [
              { bucket: 'da', location: 1 },
              { bucket: 'db', location: 2 },
            ]
          }
        } else {
          this.data.tubeList = [
            { bucket: 'da', location: 1 },
            { bucket: 'db', location: 2 },
          ]
        }
      }
      this.init()
    },
    init() {
      this.startTimer()
    },
  },
  attached() {
    // this.init()
  },
})
