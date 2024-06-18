/* eslint-disable no-unused-vars */
// pages/T0xDB/card.js
import { CARD_MODE_OPTION } from '../../../pages/common/js/cardMode'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { judgeWayToMiniProgram } from '../../../utils/util'
import { requestService, rangersBurialPoint } from '../../../utils/requestService'
import { imageApi, environment } from '../../../api'
import { openSubscribeModal } from '../../../globalCommon/js/deviceSubscribe.js'
import { modelIds, templateIds } from '../../../globalCommon/js/templateIds.js'
import statusToLua from '../db_status_to_lua'
import luaToStatus from '../db_lua_to_status'
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
    categoryArray: [],
    categoryModes: { 0: []},
    pickerCategoryNamesArray: [],
    pickerModeNamesArray: [],
    pickerCategoryModeIndex: [0, 0],
    selectedMode: {},
    applianceStatus: {
      power: '',
    },
    styles: {
      tempBtnColor: '#5D75F6',
    },
    powerImg: {
      on: imageApi.getImagePath.url + '/0xDB/icon_switch_on01@3x.png',
      off: imageApi.getImagePath.url + '/0xDB/icon_switch_off01@3x.png',
    },
    // startImg: {
    //   on: imageApi.getImagePath.url + '/0xDB/icon_start_on01@3x.png',
    //   off: imageApi.getImagePath.url + '/0xDB/icon_start_off01@3x.png',
    // },
    startImg: {
      on: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_start.png',
      off: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_start_disable.png',
    },
    // pauseImg: {
    //   on: imageApi.getImagePath.url + '/0xDB/icon_pause_on01@3x.png',
    //   off: imageApi.getImagePath.url + '/0xDB/icon_pause_off01@3x.png',
    // },
    pauseImg: {
      on: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_pause.png',
      off: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_pause_disable.png',
    },
    circleImg: {
      on: imageApi.getImagePath.url + '/0xDB/img_wash_machine_circle01@3x.png',
      off: imageApi.getImagePath.url + '/0xDB/img_wash_machine_circle04@3x.png',
    },
    modeImg: {
      on: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_modeSelect.png',
      off: 'http://ismart.zhinengxiyifang.cn/midea_json_new/activity/meiju_lite_modeSelect_disable.png',
    },
    modeDesc: {
      idle: '大约需要',
      standby: '大约需要',
      start: '运行中',
      pause: '已暂停',
      end: '运行结束',
      fault: '错误状态',
      delay: '预约中',
    },
    noPW: false,
    isAutoInput: false,
    power: {
      mainImg: imageApi.getImagePath.url + '/0xDB/icon_switch_off01@3x.png',
      desc: '关机',
    },
    circleSrc: imageApi.getImagePath.url + '/0xDB/img_wash_machine_circle04@3x.png',
    headerIcon: imageApi.getImagePath.url + '/0xDB/img_wash-machine@3x.png',
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
    configActivitysAll: {},
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
    project_no: 0,
    notShowFault: [0x31, 0x34, 0x35, 0x36, 0x70, 0xEA, 0xEE, 0xEF],
    fixedDeviceSoftwareVersion: 0,
    configs: {},
    statistics: {},
    retryStatisticsCount: 0,
    deviceA0Sn8: ''
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
      var targetUrl = this.data.statistics.url;
      if (targetUrl) {
        targetUrl += `?&env=${urlEnv}&applianceId=${this.data.applianceData.applianceCode}&deviceType=DB&deviceSubType=${this.data.project_no}&userId=${app.globalData.userData.iotUserId}&deviceSn8=${this.data.applianceData.sn8}&deviceSoftwareVersion=${this.data.fixedDeviceSoftwareVersion}&loginState=true`;
        let encodeLink = encodeURIComponent(targetUrl)
        let currUrl = `../../../pages/webView/webView?webViewUrl=${encodeLink}`
        wx.navigateTo({
          url: currUrl,
        })
      }
    },
    getCategoryNames() {
      let arr = ['常用程序'];
      if (this.data.categoryArray && this.data.categoryArray.length > 0) {
        arr = [];
        for (let i in this.data.categoryArray) {
          let category = this.data.categoryArray[i];
          arr.push(category.title);
        }
      }
      return arr;
    },
    getModesInCategory(index = 0, onlyNamesArr = false) {
      if (this.data.categoryModes && this.data.categoryModes[index]) {
        let tempArrModes = this.data.categoryModes[index];
        if (onlyNamesArr) {
          let names = [];
          for (let i in tempArrModes) {
            let mode = tempArrModes[i];
            names.push(mode.modeName);
          }
          return names;
        }
        return tempArrModes;
      }
      return [];
    },
    refreshCategoryModeIndex(modeValue) {
      this.data.pickerModeNamesArray = this.getModesInCategory(0, true);
      if (modeValue >= 0 && this.data.categoryModes) {
        for (let i in Object.keys(this.data.categoryModes)) {
          let modesArr = this.getModesInCategory(i);
          for (let j in modesArr) {
            let tempMode = modesArr[j];
            if (tempMode && tempMode.value === modeValue) {
              if (this.data.pickerCategoryModeIndex && parseInt(this.data.pickerCategoryModeIndex[0]) !== i) {
                this.data.pickerModeNamesArray = this.getModesInCategory(i, true);
              }
              this.data.pickerCategoryModeIndex = [i, j];
              this.setData({
                pickerCategoryModeIndex: this.data.pickerCategoryModeIndex,
                pickerModeNamesArray: this.data.pickerModeNamesArray
              })
              return;
            }
          }
        }
      } else {
        this.setData({
          pickerCategoryModeIndex: [0, 0],
          pickerModeNamesArray: this.data.pickerModeNamesArray
        })
      }
      return;
    },
    getPickerSelectedModeInfo() {
      let modeInfo = {};
      if (this.data.pickerCategoryModeIndex && this.data.pickerCategoryModeIndex[0] >= 0 && this.data.pickerCategoryModeIndex[1] >= 0) {
        let categoryIndex = this.data.pickerCategoryModeIndex[0];
        let modeIndex = this.data.pickerCategoryModeIndex[1];
        let modesArr = this.getModesInCategory(categoryIndex);
        if (modesArr && modeIndex < modesArr.length) {
          modeInfo = modesArr[modeIndex];
        }
      }
      return modeInfo;
    },
    initCard() {
      let self = this
      //初始化卡片页
      if (!this.data.isInit) {
        this.setData({
          isInit: true,
        })
        this.init()

        this.data.project_no = parseInt(this.data.applianceData.modelNumber) > 0 ? parseInt(this.data.applianceData.modelNumber) : 0;

        this.getActivityConfig()
          .then((res) => {
            this.data.configActivitysAll = res.data;
            this.data.configActivitys = res.data.activityList
            this.setData({
              configActivitys: res.data.activityList,
            })
            this.getSaveWaterImage()
          })
          .catch((err) => {})

        this.getConfigs().then((res) => {
          this.data.configs = res.data;
          this.setData({
            configs: res.data
          });
          if (this.data.project_no) {
            this.loadJsonConfig()
            .then((res) => {
              self.initDeviceJson(res)
            })
            .catch((err) => {})
          }
        })
        .catch((err) => {
          if (this.data.project_no) {
            this.loadJsonConfig()
            .then((res) => {
              self.initDeviceJson(res)
            })
            .catch((err) => {})
          }
        })
      }
    },
    initDeviceJson(res) {
      if (res && res.data) {
        this.data.deviceConfig = res.data;
        this.data.modes = [];
        this.data.modeNames = [];
        this.data.categoryModes = {};
        this.data.categoryArray = [];
        this.data.pickerCategoryNamesArray = [];
        this.data.pickerModeNamesArray = [];
        let arrCycles = res.data.paramData;
        if (res.data.cycleShop) {
          arrCycles = [...arrCycles, ...res.data.cycleShop];
        }
        for (var i in arrCycles) {
          let mode = arrCycles[i]
          if (mode && mode.modeName && mode.isCloudCycle !== true && mode.isCopyed !== true) {
            this.data.modes.push(mode)
            this.data.modeNames.push(mode.modeName)
            let modeCateIndex = 0;
            if (mode.categoryCode && parseInt(mode.categoryCode) >= 0) {
              modeCateIndex = parseInt(mode.categoryCode);
            }
            let cycleArray = [];
            if (this.data.categoryModes[modeCateIndex] && this.data.categoryModes[modeCateIndex].length) {
              cycleArray = this.data.categoryModes[modeCateIndex];
            }
            cycleArray.push(mode);
            this.data.categoryModes[modeCateIndex] = cycleArray;
            if (!this.data.isAutoInput) {
              for (var j in mode.paramArray) {
                let param = mode.paramArray[j]
                if (param && (param.commandName === 'detergent' || param.commandName === 'softener')) {
                  this.data.isAutoInput = true
                  this.setData({
                    'applianceData.isAutoInput': true,
                  })
                }
              }
            }
          }
        }
        this.data.pickerModeNamesArray = this.getModesInCategory(0, true);
        if (this.data.deviceConfig && this.data.deviceConfig.cycleCategory) {
          for (let code in this.data.deviceConfig.cycleCategory) {
            let category = this.data.deviceConfig.cycleCategory[code];
            if (this.data.categoryModes[code] && this.data.categoryModes[code].length > 0) {
              this.data.categoryArray.push(category);
            }
          }
        } else {
          this.data.categoryArray = [{
            "categoryCode": "0",
            "title": "常用程序"
          }];
        }
        this.data.pickerCategoryNamesArray = this.getCategoryNames();
        this.setData({
          deviceConfig: res.data,
          categoryArray: this.data.categoryArray,
          categoryModes: this.data.categoryModes,
          modesArrayInCategory: this.data.modesArrayInCategory,
          modes: this.data.modes,
          modeNames: this.data.modeNames,
          pickerModeNamesArray: this.data.pickerModeNamesArray,
          pickerCategoryNamesArray: this.data.pickerCategoryNamesArray
        })
        if (this.checkNotShowMode()) {
          this.setData({
            notShowMode: true
          })
        }
        if (res.data.noElectricityWater) {
          this.data.noPW = true
          this.setData({
            noPW: true
          })
        } else {
          let strType = 'electricityWater';
          if (this.data.deviceConfig.supportEnergyUsage) {
            strType = 'energyUseage';
          } else if (this.data.deviceConfig.useElectricWater2) {
            strType = 'electricityWater';
          } else if (this.data.deviceConfig.useDryRecord) {
            strType = 'dryRecord';
          }
          if (strType !== '') {
            this.getStatisticsInfo(strType);
          }
        }
      }
    },
    checkNotShowMode() {
      var result = false
      var notShowList = [
        '28020',
        '12337',
        '13618',
        '13619',
        '13620',
        '13621',
        '13364',
        '26675',
        '26931',
        '26932',
        '29749',
      ]
      if (this.data.project_no && notShowList.indexOf(this.data.project_no) > -1) {
        result = true
      }
      return result
    },
    getDestoried() {
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      this.stopRenderRemainTime()
      this.stopRenderRunningTimer()
    },
    getActivityConfig() {
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
      this.data.deviceA0Sn8 = this.getDeviceA0Sn8FileName();
      let version = '';
      if (this.data.fixedDeviceSoftwareVersion !== 0 && this.data.fixedDeviceSoftwareVersion !== 76 && this.data.fixedDeviceSoftwareVersion !== 255) {
        version = '.' + this.data.fixedDeviceSoftwareVersion;
      }
      let baseURL = 'https://ismart.zhinengxiyifang.cn/midea_json_new/';
      if (environment === 'sit' || environment === 'dev') {
        baseURL = 'https://ismart.zhinengxiyifang.cn/midea_json_new_sit/';
      }
      let jsonFileUrl = baseURL + 'DB/0000.db.' + this.data.project_no + this.data.deviceA0Sn8 + version + '.json?time=' + Date.parse(new Date());
      console.log('__loadJsonConfig 0000__ : ' + jsonFileUrl);
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
    getConfigs() {
      let configFileUrl =
        'https://ismart.zhinengxiyifang.cn/midea_json_new/config5.0.json' +
        '?time=' +
        Date.parse(new Date())
      if (environment === 'sit' || environment === 'dev') {
        configFileUrl =
          'https://ismart.zhinengxiyifang.cn/midea_json_new_sit/config5.0.json' +
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
    getStatisticsInfo(type) {
      if (this.data.configActivitysAll && this.data.configActivitysAll[type]) {
        this.data.statistics = this.data.configActivitysAll[type];
        this.setData({
          statistics: this.data.statistics
        })
        return
      } else {
        this.data.retryStatisticsCount++;
        if (this.data.retryStatisticsCount > 2) {
          return;
        }
        setTimeout(() => {
          this.getStatisticsInfo(type);
        }, 2000)
      }
    },
    async getSaveWaterImage() {
      let saveWater = this.data.configActivitys.find((item) => {
        return item.type === 'saveWater'
      })
      console.log('save water', saveWater);
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
      let res = this.data.configActivitys.find(item=> {
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
      if (this.data.applianceStatus && this.data.deviceConfig) {
        let result = luaToStatus(this.data.applianceStatus)
        let currentMode = this.data.modes.find((mode) => {
          return mode.value === result.wash_mode;
        })
        if (currentMode) {
          this.data.selectedMode = currentMode;
          this.setData({
            selectedMode: currentMode,
            modeNameShown: currentMode.modeName
          })
        } else {
          this.data.selectedMode = { value: -1, name: '云程序'}
          if (this.data.modeNameShown !== '云程序') {
            this.data.modeNameShown = '云程序'
            this.setData({
              selectedMode: this.data.selectedMode,
              modeNameShown: '云程序',
            })
          }
        }
      }
    },
    modeToggle() {
      let applianceStatus = this.data.applianceStatus;
      if (this.data.selectedMode && this.data.selectedMode.value >= 0) {
        this.refreshCategoryModeIndex(this.data.selectedMode.value);
      } else {
        this.refreshCategoryModeIndex(-1);
      }
      if (
        applianceStatus.power == 'on' &&
        applianceStatus.running_status !== 'start' &&
        applianceStatus.running_status !== 'pause' &&
        applianceStatus.running_status !== 'fault' &&
        applianceStatus.running_status !== 'delay' &&
        applianceStatus.running_status !== 'end' &&
        applianceStatus.lock !== 'on'
      ) {
        this.data.isShowModePicker = true
        this.setData({
          isShowModePicker: true,
        })
      } else {
        if (
          applianceStatus.power == 'on' &&
          ((this.data.deviceConfig.canChangeCycleOnPause && applianceStatus.running_status === 'pause') || 
          (this.data.deviceConfig.supportChangeCycleAfterFinish && applianceStatus.running_status === 'end')) &&
          applianceStatus.lock !== 'on'
        ) {
          this.data.isShowModePicker = true
          this.setData({
            isShowModePicker: true,
          })
        } else {
          //showHint
        }
      }
    },
    closeModePop() {
      this.setData({
        isShowModePicker: false
      }, ()=> {
        this.data.isShowModePicker = false;
      })
    },
    confirmModePop() {
      this.closeModePop();
      let modeInfo = this.getPickerSelectedModeInfo();
      if (modeInfo && modeInfo.value >= 0) {
        setTimeout(() => {
          this.changeMode(modeInfo);
        }, 500);
      }
    },
    pickerChange(e) {
      if (e.detail.value && e.detail.value[0] >= 0) {
        let indexCategory = e.detail.value[0];
        if (parseInt(this.data.pickerCategoryModeIndex[0]) !== indexCategory) {
          this.data.pickerModeNamesArray = this.getModesInCategory(indexCategory, true);
          this.data.pickerCategoryModeIndex = [indexCategory, 0];
          this.setData({
            pickerCategoryModeIndex: this.data.pickerCategoryModeIndex,
            pickerModeNamesArray: this.data.pickerModeNamesArray
          })
        } else {
          this.data.pickerCategoryModeIndex = e.detail.value;
        }
      }
    },
    changeMode(mode) {
      if (mode && mode.modeName) {
        let luaAttrs = statusToLua(
          {
            wash_mode: mode.value,
            merge: 'false',
          },
          this.data.deviceConfig,
          this.data.applianceStatus
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
      if (applianceStatus.power == 'on' && applianceStatus.running_status == 'start') {
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
        applianceStatus.lock !== 'on'
      ) {
        running_status3 = {
          mainImg: this.data.modeImg.on,
          desc: '设置模式',
        }
      } else {
        if (
          applianceStatus.power == 'on' &&
          ((this.data.deviceConfig.canChangeCycleOnPause && applianceStatus.running_status === 'pause') || 
          (this.data.deviceConfig.supportChangeCycleAfterFinish && applianceStatus.running_status === 'end')) &&
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
      if (this.data.applianceStatus.error_code != 0 && this.data.notShowFault.indexOf(this.data.applianceStatus.error_code) < 0) {
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
      if (this.data.applianceStatus.running_status == 'start') {
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
      let power = p === "on" ? 1 : 0;
      let remain_time = '--'
      let reqId = getReqId()

      let luaAttrs = statusToLua(
        {
          switch: power
        },
        this.data.deviceConfig,
        this.data.applianceStatus
      )
    
      this.luaControl(
        luaAttrs,
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
        setTimeout(
          function () {
            this.luaQuery(true)
              .then((res) => {
                let result = res.data.data
                if (result.remain_time === 65535) {
                  remain_time = '--'
                } else {
                  remain_time = result.remain_time
                }
                result.remain_time = remain_time
                this.setData(
                  {
                    applianceStatus: result,
                  },
                  () => {
                    self.checkRunningAnimation()
                    self.computeStatus()
                    self.renderRemainTime()
                    self.computeButtons()
                  }
                )
              })
              .catch((err) => {})
          }.bind(this),
          1000
        )
      })
    },
    powerToggle() {
      //切换电源状态
      openSubscribeModal(
        modelIds[2],
        this.data.applianceData.name,
        this.data.applianceData.sn,
        [templateIds[3][0], templateIds[4][0], templateIds[5][0]],
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
          this.data.applianceStatus.running_status === 'delay' || 
          this.data.applianceStatus.running_status === 'fault')
      ) {
        wx.showModal({
          title: '确认提示',
          content: '设备正在运行，是否确定关机？',
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
        modelIds[2],
        this.data.applianceData.name,
        this.data.applianceData.sn,
        [templateIds[5][0], templateIds[32][0]],
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

        let luaAttrs = statusToLua(
          {
            wash: 1
          },
          this.data.deviceConfig,
          this.data.applianceStatus
        )
        this.luaControl(
          luaAttrs,
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
          setTimeout(
            function () {
              this.luaQuery(true)
                .then((res) => {
                  let result = res.data.data
                  if (result.remain_time === 65535) {
                    remain_time = '--'
                  } else {
                    remain_time = result.remain_time
                  }
                  result.remain_time = remain_time
                  this.setData(
                    {
                      applianceStatus: result,
                    },
                    () => {
                      self.checkRunningAnimation()
                      self.computeStatus()
                      self.renderRemainTime()
                      self.computeButtons()
                    }
                  )
                })
                .catch((err) => {})
            }.bind(this),
            1000
          )
        })
      } else {
        return //启动后禁止点击
      }
    },
    pauseToggle() {
      if (this.data.applianceStatus.running_status === 'start' && this.data.applianceStatus.lock === 'on') {
        wx.showToast({
          title: '童锁已开启',
          icon: 'none',
        })
        return
      }

      //切换暂停状态
      openSubscribeModal(
        modelIds[2],
        this.data.applianceData.name,
        this.data.applianceData.sn,
        [templateIds[5][0], templateIds[32][0]],
        this.data.applianceData.sn8,
        this.data.applianceData.type,
        this.data.applianceData.applianceCode
      )
      let self = this
      let control_status = ''
      let remain_time = ''
      //this.renderRemainTime()
      if (this.data.applianceStatus.running_status == 'start' && this.data.applianceStatus.lock !== 'on') {
        control_status = 'pause'
        let reqId = getReqId()

        let luaAttrs = statusToLua(
          {
            wash: 0
          },
          this.data.deviceConfig,
          this.data.applianceStatus
        )
        this.luaControl(
          luaAttrs,
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
          setTimeout(
            function () {
              this.luaQuery(true)
                .then((res) => {
                  let result = res.data.data
                  if (result.remain_time === 65535) {
                    remain_time = '--'
                  } else {
                    remain_time = result.remain_time
                  }
                  result.remain_time = remain_time
                  this.setData(
                    {
                      applianceStatus: result,
                    },
                    () => {
                      self.checkRunningAnimation()
                      self.computeStatus()
                      self.renderRemainTime()
                      self.computeButtons()
                    }
                  )
                })
                .catch((err) => {})
            }.bind(this),
            1000
          )
        })
      } else {
        return //暂停后禁止点击
      }
    },
    getFixedDeviceSoftWareVersion(v) {
      let version = 0;
      if (this.data.configs && this.data.configs.deviceSoftwareVersion) {
        version = 76;
        let keyName = 'db.' + this.data.applianceData.modelNumber;
        if (this.data.deviceA0Sn8 != '') {
          keyName += this.data.deviceA0Sn8; 
        }
        if (this.data.configs.deviceSoftwareVersion[keyName]) {
          let versionArray = this.data.configs.deviceSoftwareVersion[keyName];
          for (var i in versionArray) {
            if (v >= versionArray[i]) {
              version = versionArray[i];
            }
          }
        }
      }
      return version;
    },
    getDeviceA0Sn8FileName() {
      let name = '';
      if (this.data.configs?.deviceA0Sn8) {
        let arrSN8 = this.data.configs.deviceA0Sn8['db.' + this.data.applianceData.modelNumber];
        if (arrSN8 && arrSN8.indexOf(this.data.applianceData.sn8) >= 0) {
          name = '.' + this.data.applianceData.sn8;
        }
      }
      return name;
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
            let reloadJson = false;
            if (this.data.fixedDeviceSoftwareVersion === 0 && res.data.data.device_software_version != undefined && res.data.data.device_software_version != 76 && res.data.data.device_software_version != 0 && res.data.data.device_software_version != 255) {
              this.data.fixedDeviceSoftwareVersion = this.getFixedDeviceSoftWareVersion(res.data.data.device_software_version);
              reloadJson = true;
            }
            if (this.data.project_no <= 0 && parseInt(res.data.data.project_no) > 0) {
              this.data.project_no = parseInt(res.data.data.project_no);
              reloadJson = true;
            }
            if (reloadJson) {
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
              }
            )
            resolve(res)
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
          apptype_name: '滚筒洗衣机',
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
