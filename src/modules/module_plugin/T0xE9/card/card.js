const app = getApp() //获取应用实例
const requestService = app.getGlobalConfig().requestService
const rangersBurialPoint = app.getGlobalConfig().rangersBurialPoint
const environment = app.getGlobalConfig().environment
import { getStamp } from 'm-utilsdk/index'

import { PluginConfig } from './js/plugin-config.js'
import { DeviceData } from '../assets/scripts/device-data'
import MideaToast from '../component/midea-toast/toast'
import { Format } from '../assets/scripts/format'
import { imageDomain, commonApi } from '../assets/scripts/api'
import { parseComponentModel } from '../assets/scripts/common'
import { UI } from '../assets/scripts/ui'
import { workTimeJson } from '../assets/scripts/workTime.js'

let deviceStatusTimer = null
let isDeviceInterval = true
let showingSettingModalTimer = null
let isShowingSettingModal = false
const THEME_COLOR = '#FFAA10'
const DO_WHILE_RETURN = false

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
  },
  data: {
    // region 2021.12.01 ao
    bgImage: {
      url1: imageDomain + '/0xFB/bg.png',
      url2: imageDomain + '/0xFB/bg-running.png',
      url3: imageDomain + '/0xFB/bg-running-move.png',
    },
    configList: [],
    quickDevJson: undefined,
    deviceInfo: {
      isOnline: false,
      isRunning: false,
      isWorking: false,
      workStatus: {},
      workStatusMap: {},
      bgImage: imageDomain + '/0xFB/bg.png',
    },
    pageProductConfig: {
      isShowIngredient: {
        isShow: false,
        hasConfig: false,
      },
      weightLevel: {
        isShow: false,
        hasConfig: false,
      },
      burnColorLevel: {
        isShow: false,
        hasConfig: false,
      },
      feedingType: {
        isShow: false,
        hasConfig: false,
      },
      workTime: {
        isShow: false,
        hasConfig: false,
      },
      appoint: {
        isShow: false,
        hasConfig: false,
      },
    },
    isBottomFixed: false,
    limitRateData: {
      rate: 0.35,
      extraHeight: 0,
    },
    isInit: false,
    selectedFunction: {},
    settingModal: {
      isShow: false,
      params: {
        weightLevel: {
          value: undefined,
          label: undefined,
        },
        burnColorLevel: {
          value: undefined,
          label: undefined,
        },
        appoint: {
          value: undefined,
          label: undefined,
        },
        feedingType: {
          value: undefined,
          label: undefined,
        },
        workTime: {
          value: undefined,
          label: undefined,
        },
      },
    },
    workTimeData: {
      value: [0, 0, 0, 0],
      hours: [0, 1, 2, 3, 4, 5],
      minutes: [0, 1, 2, 3, 4, 5],
      result: {},
    },
    scheduleData: {
      value: [0, 0, 0, 0],
      day: [],
      hours: [],
      minutes: [],
      result: undefined,
      resultLabel: undefined,
      isConfirming: false,
    },
    scheduleModal: {
      isShow: false,
    },
    switchFeedingType: parseComponentModel({
      color: THEME_COLOR,
      selected: false,
    }),
    // switchSchedule: {
    //   color: THEME_COLOR,
    //   selected: false
    // },
    switchSchedule: parseComponentModel({
      color: THEME_COLOR,
      selected: false,
    }),
    switchLight: parseComponentModel({
      isActive: true,
      color: THEME_COLOR,
      selected: false,
    }),
    optionsWrapper: {
      translateX: 0,
      height: undefined,
      activeIndex: 0,
      disableIndex: -1,
    },
    iconUrl: {
      weight: imageDomain + '/0xE9/icon-weight.png',
      burnColor: imageDomain + '/0xE9/icon-burn-color.png',
      feedingType: imageDomain + '/0xE9/icon-feeding-type.png',
      pause: {
        url1: imageDomain + '/0xE7/icon-pause.png',
      },
      continue: {
        url1: imageDomain + '/0xE7/icon-continue.png',
      },
      power: {
        url1: imageDomain + '/0xFB/icon-switch.png',
      },
      clock: imageDomain + '/0xF1/icon-yuyue.png',
      workTime: {
        url1: imageDomain + '/0xF1/icon-shijian.png',
      },
      mouthfeel: {
        url1: imageDomain + '/0xF1/icon-kougan.png',
      },
      temperature: {
        url1: imageDomain + '/0xF1/icon-baowen.png',
      },
      test: {
        url1: imageDomain + '/0xFB/icon_zhire2.png',
        url2: imageDomain + '/0xFB/icon_zhire.png',
        url3: 'https://ce-cdn.midea.com/quick_dev/function/1e13781d-c5ab-41d4-b04d-cc43b72fbd93.png',
        url4: 'https://ce-cdn.midea.com/quick_dev/function/7239b481-7e19-4267-bfaa-65aec566e3e1.png',
      },
      backImgBase: imageDomain + '/0xFC/icon_youjiantou.png',
    },
    // endregion
    // region 2021.12.01 之前代码
    _applianceData: {
      name: '',
      roomName: '',
      onlineStatus: 0,
    },
    _applianceDataStatus: {
      work_status: undefined,
      function_no: '0',
      time_surplus_hr: '0',
      time_surplus_min: '0',
    },
    // endregion
  },
  methods: {
    // 更新页面样式
    updatePageStyle() {
      let configList = this.data.configList
      let deviceInfo = this.data.deviceInfo
      let iconUrl = this.data.iconUrl
      configList.forEach((configItem) => {
        let functions = configItem.functions
        functions.forEach((item) => {
          let activeIcon = item.appletsIconUrl2 || item.iconUrl3 || item.iconUrl2 || item.iconUrl1 || iconUrl.test.url4
          let unActiveIcon =
            item.appletsIconUrl1 || item.iconUrl3 || item.iconUrl2 || item.iconUrl1 || iconUrl.test.url3
          item.imageIconUrl = deviceInfo.isOnline ? activeIcon : unActiveIcon
        })
      })
      this.setData({ configList })
    },
    // region 2021.12.01 - ao
    // region 跳转到美居下载页
    goToDownLoad() {
      wx.navigateTo({
        url: '/pages/download/download',
      })
    },
    // endregion
    // region 获取产品配置
    getProductConfig() {
      return new Promise((resolve) => {
        let data = this.data
        let deviceInfo = data.deviceInfo
        if (deviceInfo.onlineStatus == DeviceData.onlineStatus.online) {
          deviceInfo.isOnline = true
          deviceInfo.bgImage = this.data.bgImage.url2
        } else {
          deviceInfo.isOnline = false
          deviceInfo.bgImage = this.data.bgImage.url1
          MideaToast('设备已离线，请检查网络状态')
        }
        deviceInfo.functionEnabled = deviceInfo.isOnline
        this.setData({ deviceInfo })
        let productModelNumber = deviceInfo.modelNumber != 0 ? DeviceData.getAO(deviceInfo.modelNumber) : deviceInfo.sn8
        let method = 'GET'
        let sendParams = {
          applianceId: deviceInfo.applianceCode,
          productTypeCode: deviceInfo.type,
          userId: data.uid,
          productModelNumber: deviceInfo.sn8 || productModelNumber,
          bigVer: DeviceData.bigVer,
        }
        let isDebug = environment == 'sit'
        isDebug = false
        if (!isDebug) {
          sendParams = {
            serviceName: 'quick-development-service',
            uri: 'frontend/productConfig' + Format.jsonToParam(sendParams),
            method: 'GET',
            contentType: 'application/json',
          }
          method = 'POST'
        }
        requestService
          .request(commonApi.sdaTransmit, sendParams, method)
          .then((res) => {
            console.log('获取产品配置')
            console.log(res)
            // 设置页面功能
            let resData = null
            if (isDebug) {
              res = res.data
              resData = res.data
            } else {
              res = JSON.parse(res.data.result.returnData)
              resData = res.data
            }
            do {
              if (res.resCode == 50300 || res.code == 1001) {
                // 无资源重定向
                PluginConfig.redirectUnSupportDevice(this.properties.applianceData)
                break
                // resData = JSON.parse('{\"version\":\"6.4\",\"productName\":\"MM-MB15W3-001XM\",\"productModelNumber\":\"62100164\",\"productImageUrl\":\"\",\"productTypeCode\":\"0xE9\",\"productTypeName\":\"面包机\",\"protocolVersionCode\":1,\"supportRtc\":false,\"capacity\":null,\"published\":true,\"errorCodes\":{\"1\":\"传感器开路\",\"13\":\"干烧\",\"2\":\"传感器短路\",\"3\":\"过零故障\",\"4\":\"传感器开路\",\"28\":\"过零故障\",\"29\":\"高温报警故障\",\"8\":\"设备温度过低\",\"71\":\"高温保护\",\"75\":\"低温报警故障\"},\"properties\":[{\"settings\":[{\"apiKey\":\"instruction\",\"codeName\":\"instruction\",\"properties\":{\"link\":\"http://cmms.midea.com/s/eManualMobile/?model=MM-TSZ2032\",\"title\":\"\",\"isExist\":true}}]},{\"settings\":[{\"apiKey\":\"diyType\",\"codeName\":\"customPicker\",\"properties\":{\"unit\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"面包DIY\",\"value\":\"0\"},{\"text\":\"其他DIY\",\"value\":\"1\"}],\"title\":\"diy类型\"}}]},{\"settings\":[{\"apiKey\":\"workStatue\",\"codeName\":\"workingStatus_controlPage\",\"properties\":{\"options\":[{\"text_cook_time_left\":\"\",\"code\":\"standby\",\"color\":\"\",\"text_cook_end_at\":\"\",\"button_group_icon\":\"\",\"text\":\"待机中\",\"value\":\"standby\",\"desc\":\"\"},{\"text_cook_time_left\":\"\",\"code\":\"working\",\"color\":\"\",\"text_cook_end_at\":\"\",\"button_group_icon\":\"\",\"text\":\"工作中\",\"value\":\"cooking\",\"desc\":\"\"},{\"text_cook_time_left\":\"\",\"code\":\"pause\",\"color\":\"\",\"text_cook_end_at\":\"\",\"button_group_icon\":\"\",\"text\":\"暂停中\",\"value\":\"pause\",\"desc\":\"\"},{\"text_cook_time_left\":\"\",\"code\":\"appoint\",\"color\":\"\",\"text_cook_end_at\":\"\",\"button_group_icon\":\"\",\"text\":\"预约中\",\"value\":\"schedule\",\"desc\":\"\"},{\"text_cook_time_left\":\"\",\"code\":\"keepWarm\",\"color\":\"\",\"text_cook_end_at\":\"\",\"button_group_icon\":\"\",\"text\":\"保温中\",\"value\":\"keep_warm\",\"desc\":\"\"},{\"text_cook_time_left\":\"\",\"code\":\"finished\",\"color\":\"\",\"text_cook_end_at\":\"\",\"button_group_icon\":\"\",\"text\":\"烹饪完成\",\"value\":\"5\",\"desc\":\"\"}]}}]},{\"settings\":[{\"apiKey\":\"controller4_shortcut\",\"codeName\":\"controller4_shortcut\",\"properties\":{\"list\":[{\"img\":\"http://ce-cdn.midea.com/quick_dev/function/65964169-7133-4cfb-abbb-eac4422ac926.png\",\"title\":\"云食谱\",\"type\":\"recipe\"},{\"img\":\"http://ce-cdn.midea.com/quick_dev/function/428fe59b-4eb3-42f5-8fbf-7a70727aff16.png\",\"title\":\"DIY\",\"type\":\"diy\"}]}}]}],\"functions\":[{\"name\":\"低GI面包\",\"code\":43,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/3f0bb8bd-0687-46e5-ac5e-88eb4a4ca458.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/259fc243-0ac8-422e-8e6e-b2cf20d22c35.png\",\"iconUrl3\":\"https://ce-cdn.midea.com/quick_dev/function/8432871f-3668-4686-9338-a816943a5df8.png\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"isShowIngredient\",\"codeName\":\"DIYSpecial\",\"properties\":{\"hasValue\":true}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"190\",\"max\":\"780\",\"defaultValue\":\"250\",\"title\":\"预约时间\"}}]},{\"name\":\"主食面包\",\"code\":4,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/b9e5b2ac-055b-4706-9c74-247773123a7a.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/7570a4cc-5947-44da-8c27-657d4beeeca1.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/9403dd58-5d0a-4370-ac0b-a27e5fd11778.png\",\"appletsIconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/c8a2a70d-cc52-4cd4-baf2-cbc86f94711e.png\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":false}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"190\",\"max\":\"780\",\"defaultValue\":\"250\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"甜味面包\",\"code\":5,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/f656c719-3383-43eb-9295-e3ba2caaa9b7.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/ae1ab647-8d4b-416f-a3e1-53855b8cc306.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":true}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"180\",\"max\":\"780\",\"defaultValue\":\"240\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"咸味面包\",\"code\":37,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/6eba3ffd-b6af-4dea-b0b1-cb510787a8c1.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/98675e58-1fef-444d-9536-3594afcebd50.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":true}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"180\",\"max\":\"780\",\"defaultValue\":\"240\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"低糖面包\",\"code\":6,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/9d3c1c17-b468-496e-b3c7-de1922d611eb.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/d24fac1e-8e67-428f-8f84-be69ef15cf7c.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"750g\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"1000g\",\"time\":\"\",\"value\":\"2\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":false}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"190\",\"max\":\"780\",\"defaultValue\":\"250\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"无油面包\",\"code\":13,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/c30af56a-8f42-45bf-b331-9a70606b9a06.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/4c50f854-626e-44bd-b0f0-5f7510f07554.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":true}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"180\",\"max\":\"780\",\"defaultValue\":\"240\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"米饭面包\",\"code\":39,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/e7327c4c-1520-4329-90b3-4ffed3bb6462.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/1f7b2fd7-e388-431b-b127-8d5a986293a9.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":false}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"190\",\"max\":\"780\",\"defaultValue\":\"250\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"杂粮面包\",\"code\":8,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/820c2a20-c576-4e3d-ad3d-b65725b2706e.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/fd98a402-cad8-4623-8d9d-838332596e51.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":false}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"180\",\"max\":\"780\",\"defaultValue\":\"240\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"全麦面包\",\"code\":7,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/28ad190c-2f5b-4e0a-a7d6-97038418210d.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/6b5d2990-8ca0-4094-ab74-f1df133de259.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":false}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"185\",\"max\":\"780\",\"defaultValue\":\"245\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"果蔬面包\",\"code\":12,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/92cf240c-bbd6-4bf9-970c-7f66795a989f.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/1107c7e2-d3f7-4e6d-a95b-d3773657748c.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":true}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"180\",\"max\":\"780\",\"defaultValue\":\"240\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"豆浆面包\",\"code\":33,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/0a06d07c-934b-4657-86d0-b3a74e1aa1c1.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/2f6ba7e1-2412-463e-9812-f0293769cda3.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":true}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"180\",\"max\":\"780\",\"defaultValue\":\"240\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"酸奶面包\",\"code\":34,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/bfe93351-0752-45d3-b7ee-e5a0aa116ae7.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/c74f574f-1a20-4878-b926-de047eedd136.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":true}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"180\",\"max\":\"780\",\"defaultValue\":\"240\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"儿童面包\",\"code\":23,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/bee88920-77ef-44fb-aeff-ba2532738f45.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/a9203feb-26f7-4c3f-a062-602a73a7b9ab.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"weightLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"g\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"img\":\"\",\"text\":\"500g\",\"time\":\"\",\"value\":\"1\",\"desc\":\"\"},{\"img\":\"\",\"text\":\"750g\",\"time\":\"\",\"value\":\"2\",\"desc\":\"\"}],\"describe\":\"\",\"title\":\"面包重量\",\"type\":\"\"}},{\"apiKey\":\"burnColorLevel\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"\",\"ifCanAdjust\":true,\"unitOffset\":\"\",\"defaultValue\":\"1\",\"options\":[{\"text\":\"浅色\",\"time\":\"\",\"value\":\"1\"},{\"text\":\"中色\",\"time\":\"\",\"value\":\"2\"},{\"text\":\"深色\",\"time\":\"\",\"value\":\"3\"}],\"describe\":\"\",\"title\":\"烤色\",\"type\":\"\"}},{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":false}},{\"apiKey\":\"appointTime\",\"codeName\":\"appointmentPicker\",\"properties\":{\"min\":\"180\",\"max\":\"780\",\"defaultValue\":\"240\",\"title\":\"预约时间\"}},{\"apiKey\":\"setKeepWarmTime\",\"codeName\":\"popupPicker\",\"properties\":{\"unit\":\"分钟\",\"ifCanAdjust\":false,\"unitOffset\":\"\",\"defaultValue\":\"60\",\"options\":[{\"text\":\"1\",\"time\":\"\",\"value\":\"60\"}],\"describe\":\"\",\"title\":\"保温时间\",\"type\":\"\"}}]},{\"name\":\"蛋糕制作\",\"code\":30,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/6a7aebcf-7490-4658-a0a5-e3bc71f6a846.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/f4b86f1f-fb12-43bd-abd9-dfc57e724f5c.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[]},{\"name\":\"糯米年糕\",\"code\":10,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/6092989f-7cf6-4080-8c97-f4d9a6b5c72c.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/3fb33338-572e-46fd-9337-f8564d963141.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[]},{\"name\":\"果酱制作\",\"code\":31,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/43ef27f0-784a-4aff-9efc-01aea1c6f196.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/39695f92-b618-44fb-986f-73c41cdde066.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[]},{\"name\":\"自制肉松\",\"code\":36,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/a106d01a-b376-4335-8407-8c030f7aa1da.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/63702bae-e9eb-4aa2-8b02-9a6900a79c70.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[]},{\"name\":\"糖渍水果\",\"code\":21,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/254d1caa-8534-400e-858f-a2e348bccac1.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/1002db86-2e83-4ba6-b6c1-584cae4ee0ee.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"workTime\",\"codeName\":\"hourMinutePicker\",\"properties\":{\"unit\":\"分钟\",\"hide\":false,\"min\":\"50\",\"max\":\"110\",\"defaultValue\":\"60\",\"unitList\":[{\"unit\":\"小时\"},{\"unit\":\"分钟\"}],\"show\":true,\"title\":\"工作时间\",\"sub15\":false,\"maxExpress\":\"\"}}]},{\"name\":\"浓情可可\",\"code\":26,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/92e588d6-7bb1-43e4-8a81-685ce715a11d.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/7855c56e-f755-48b5-b4a1-d9d9ceb387b7.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"workTime\",\"codeName\":\"hourMinutePicker\",\"properties\":{\"unit\":\"分钟\",\"hide\":false,\"min\":\"40\",\"max\":\"60\",\"defaultValue\":\"50\",\"unitList\":[{\"unit\":\"小时\"},{\"unit\":\"分钟\"}],\"show\":true,\"title\":\"工作时间\",\"sub15\":false,\"maxExpress\":\"\"}}]},{\"name\":\"酸奶制作\",\"code\":14,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/76d80260-070d-4f17-88f6-6a885a2ad05e.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/727d9ad7-8769-428c-a8c6-98276d3950c6.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"workTime\",\"codeName\":\"hourMinutePicker\",\"properties\":{\"unit\":\"分钟\",\"hide\":false,\"min\":\"360\",\"max\":\"720\",\"defaultValue\":\"480\",\"unitList\":[{\"unit\":\"小时\"},{\"unit\":\"分钟\"}],\"show\":true,\"title\":\"工作时间\",\"sub15\":false,\"maxExpress\":\"\"}}]},{\"name\":\"自助和面\",\"code\":16,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/5bbefad7-70ad-4bcd-91ae-e7f4dc286c20.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/0594d365-4610-45e7-b8f6-bc3d0d9bc905.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"workTime\",\"codeName\":\"hourMinutePicker\",\"properties\":{\"unit\":\"分钟\",\"hide\":false,\"min\":\"18\",\"max\":\"60\",\"defaultValue\":\"18\",\"unitList\":[{\"unit\":\"小时\"},{\"unit\":\"分钟\"}],\"show\":true,\"title\":\"工作时间\",\"sub15\":false,\"maxExpress\":\"\"}}]},{\"name\":\"发面面团\",\"code\":18,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/6a94a5ba-6188-4b80-a39e-170a6867077f.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/e72703dc-6bdd-4e8a-ba76-0d1e356cb49a.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"feedingType\",\"codeName\":\"switch\",\"properties\":{\"subTitle\":\"\",\"optionalExist\":false,\"optionalList\":[],\"optionalTitle\":\"\",\"optionalUnit\":\"\",\"title\":\"投料\",\"optionalNum\":\"\",\"swithDisplay\":true,\"optionalKeys\":[],\"switch\":false}}]},{\"name\":\"自助发酵\",\"code\":32,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/d1bc6d79-c201-4e1c-8d0b-53c05fa30ea5.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/42456981-85f1-47c7-b35b-4fe2f230081d.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"workTime\",\"codeName\":\"hourMinutePicker\",\"properties\":{\"unit\":\"分钟\",\"hide\":false,\"min\":\"90\",\"max\":\"120\",\"defaultValue\":\"90\",\"unitList\":[{\"unit\":\"小时\"},{\"unit\":\"分钟\"}],\"show\":true,\"title\":\"工作时间\",\"sub15\":false,\"maxExpress\":\"\"}}]},{\"name\":\"自助烘烤\",\"code\":19,\"iconUrl1\":\"https://ce-cdn.midea.com/quick_dev/function/bb76905d-da9f-4a06-9be8-203c1b1f3bae.png\",\"iconUrl2\":\"https://ce-cdn.midea.com/quick_dev/function/23a26b4a-6ef2-41ea-8147-9736865ed17a.png\",\"iconUrl3\":\"\",\"ovIconUrl1\":\"\",\"ovIconUrl2\":\"\",\"appletsIconUrl1\":\"\",\"appletsIconUrl2\":\"\",\"harmonyIconUrl1\":\"\",\"harmonyIconUrl2\":\"\",\"toshibaIconUrl1\":\"\",\"toshibaIconUrl2\":\"\",\"settings\":[{\"apiKey\":\"workTime\",\"codeName\":\"hourMinutePicker\",\"properties\":{\"unit\":\"分钟\",\"hide\":false,\"min\":\"10\",\"max\":\"60\",\"defaultValue\":\"10\",\"unitList\":[{\"unit\":\"小时\"},{\"unit\":\"分钟\"}],\"show\":true,\"title\":\"工作时间\",\"sub15\":false,\"maxExpress\":\"\"}}]}],\"errorCodeMap\":{\"1\":{\"code\":1,\"name\":\"传感器开路\",\"cause\":null,\"solution\":null},\"13\":{\"code\":13,\"name\":\"干烧\",\"cause\":null,\"solution\":null},\"2\":{\"code\":2,\"name\":\"传感器短路\",\"cause\":null,\"solution\":null},\"3\":{\"code\":3,\"name\":\"过零故障\",\"cause\":null,\"solution\":null},\"4\":{\"code\":4,\"name\":\"传感器开路\",\"cause\":null,\"solution\":null},\"28\":{\"code\":28,\"name\":\"过零故障\",\"cause\":null,\"solution\":null},\"29\":{\"code\":29,\"name\":\"高温报警故障\",\"cause\":null,\"solution\":null},\"8\":{\"code\":8,\"name\":\"设备温度过低\",\"cause\":null,\"solution\":null},\"71\":{\"code\":71,\"name\":\"高温保护\",\"cause\":null,\"solution\":null},\"75\":{\"code\":75,\"name\":\"低温报警故障\",\"cause\":null,\"solution\":null}},\"language\":{}}')
              }
              if (res.code != 0) {
                let msg = PluginConfig.handleErrorMsg(res.code)
                MideaToast(msg)
                break
              }
              let quickDevJson = PluginConfig.quickDevJson2Local(resData)
              console.log('解析后参数')
              console.log(quickDevJson)
              let configList = [
                {
                  functions: [],
                  layoutClass: '',
                  name: '烤篮模式',
                },
              ]
              // 配置SN8
              PluginConfig.sn8 = deviceInfo.sn8
              // 是否支持暂停
              deviceInfo.isSupportPause = false
              if (quickDevJson.properties['setPauseStatus']) {
                deviceInfo.isSupportPause = quickDevJson.properties.setPauseStatus.defaultValue
              }
              // 功能选项
              let iconUrl = this.data.iconUrl
              configList[0].functions = []
              quickDevJson.functions.forEach((item) => {
                do {
                  if (item.code === 38) {
                    break
                  }
                  let activeIcon =
                    item.appletsIconUrl2 || item.iconUrl3 || item.iconUrl2 || item.iconUrl1 || iconUrl.test.url4
                  let unActiveIcon =
                    item.appletsIconUrl1 || item.iconUrl3 || item.iconUrl2 || item.iconUrl1 || iconUrl.test.url3
                  item.imageIconUrl = deviceInfo.isOnline ? activeIcon : unActiveIcon
                  if (item.code === 22) {
                    configList[1] = {
                      functions: [],
                      layoutClass: '',
                      name: '烤盘模式',
                    }
                    configList[1].functions = []
                    configList[1].functions.push(item)
                    break
                  }
                  configList[0].functions.push(item)
                } while (DO_WHILE_RETURN)
              })
              configList.forEach((optionsItem) => {
                do {
                  let functionLength = optionsItem.functions.length
                  if (functionLength === 7) {
                    optionsItem['layoutClass'] = 'grid-layout grid-layout-fourth'
                    break
                  }
                  if (functionLength === 2) {
                    optionsItem['layoutClass'] = 'grid-layout grid-layout-double'
                    break
                  }
                  if (functionLength === 1) {
                    optionsItem['singleClass'] = 'single-row'
                    break
                  }
                  if (functionLength % 6 === 0) {
                    optionsItem['layoutClass'] = 'grid-layout grid-layout-third'
                    break
                  }
                  if (functionLength % 2 === 0) {
                    optionsItem['layoutClass'] = 'grid-layout grid-layout-fourth'
                    break
                  }
                  optionsItem['layoutClass'] = 'grid-layout grid-layout-third'
                } while (DO_WHILE_RETURN)
              })
              console.log('页面配置')
              console.log(configList)
              this.setData({ configList, deviceInfo, quickDevJson })
              if (configList[0].functions.length === 1) {
                this.functionConfigInit(configList[0].functions[0])
              }
            } while (DO_WHILE_RETURN)
            resolve(res)
          })
          .catch((err) => {
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              do {
                if (res.resCode == 50300 || res.code == 1001) {
                  // 无资源重定向
                  PluginConfig.redirectUnSupportDevice(this.properties.applianceData)
                  break
                }
                if (res.code != 0) {
                  let msg = PluginConfig.handleErrorMsg(res.code)
                  MideaToast(msg)
                  break
                }
                MideaToast('未知错误-配置')
              } while (DO_WHILE_RETURN)
            }
            resolve()
          })
      })
    },
    // endregion
    // region 数据初始化
    dataInit(newDeviceStatus) {
      let data = this.data
      let deviceInfo = data.deviceInfo
      let configList = data.configList
      let quickDevJson = data.quickDevJson
      let switchLight = parseComponentModel(data.switchLight)
      let optionsWrapper = data.optionsWrapper
      let limitRateData = data.limitRateData
      console.log('数据初始化')
      console.log(newDeviceStatus)
      if (newDeviceStatus) {
        Object.assign(deviceInfo, newDeviceStatus)
        // 工作状态赋值
        if (quickDevJson) {
          let workStatusOptions = quickDevJson.properties[PluginConfig.apiKey.workStatue].options
          if (workStatusOptions && workStatusOptions.length > 0) {
            for (let i = 0; i < workStatusOptions.length; i++) {
              let workStatusOptionItem = workStatusOptions[i]
              deviceInfo.workStatus[workStatusOptionItem.code] = workStatusOptionItem.value
              if (workStatusOptionItem.value === newDeviceStatus.work_status) {
                deviceInfo.workStatusName = workStatusOptionItem.desc || workStatusOptionItem.text
                if (deviceInfo.workStatusName.indexOf('工作中') > -1) {
                  deviceInfo.workStatusName = deviceInfo.workStatusName.replace('工作中', '烹饪中')
                }
              }
            }
          }
        }
        // 工作状态
        switch (newDeviceStatus.work_status) {
          case deviceInfo.workStatus[PluginConfig.workStatus.appoint]:
          case deviceInfo.workStatus[PluginConfig.workStatus.working]:
            // 工作、预约
            deviceInfo.isOnline = true
            deviceInfo.isRunning = true
            deviceInfo.isWorking = true
            break
          case deviceInfo.workStatus[PluginConfig.workStatus.pause]:
            // 暂停
            deviceInfo.isOnline = true
            deviceInfo.isRunning = true
            deviceInfo.isWorking = false
            break
          case deviceInfo.workStatus[PluginConfig.workStatus.error]:
            // 错误
            deviceInfo.isOnline = false
            deviceInfo.isRunning = false
            deviceInfo.isWorking = false
            break
          default:
            deviceInfo.isOnline = true
            deviceInfo.isRunning = false
            deviceInfo.isWorking = false
            break
        }
        if (deviceInfo.isRunning) {
          limitRateData.rate = 0.12
        } else {
          limitRateData.rate = 0.35
        }
        this.fixOptionsWrapperHeightByOptions(optionsWrapper.activeIndex)
        // 工作模式
        let workMode = (deviceInfo.work_mode = Number(newDeviceStatus.work_mode))
        let currentFunction = {}
        if (workMode !== 0) {
          if (configList && configList.length > 0) {
            let isSearched = false
            for (let j = 0; j < configList.length; j++) {
              if (isSearched) {
                break
              }
              let functions = configList[j].functions
              if (functions && functions.length > 0) {
                for (let k = 0; k < functions.length; k++) {
                  let functionItem = functions[k]
                  if (functionItem.code === workMode) {
                    currentFunction = functionItem
                    isSearched = true
                    break
                  }
                }
              }
            }
          }
        }
        deviceInfo.currentFunction = currentFunction
        console.log('当前功能')
        console.log(currentFunction)
        // 重量
        deviceInfo.weightLabel = undefined
        if (
          deviceInfo.currentFunction &&
          deviceInfo.currentFunction.settingsData &&
          currentFunction.settingsData[PluginConfig.apiKey.weightLevel]
        ) {
          let weightLevelSetting = deviceInfo.currentFunction.settingsData[PluginConfig.apiKey.weightLevel]
          if (weightLevelSetting) {
            let properties = weightLevelSetting.properties
            if (properties.options && properties.options.length > 0) {
              properties.options.forEach((optionItem) => {
                if (optionItem.value === newDeviceStatus.weight) {
                  deviceInfo.weightLabel = optionItem.text
                }
              })
            }
          }
        }
        // 剩余时间
        let raminWorkTimeSec = Number(newDeviceStatus.remain_work_time_sec)
        deviceInfo.currentTime = Format.formatSeconds(raminWorkTimeSec)
        if (deviceInfo.currentTime.seconds < 60 && deviceInfo.currentTime.seconds > 0) {
          deviceInfo.currentTime.minutes++
        }
        if (deviceInfo.currentTime.minutes >= 60) {
          deviceInfo.currentTime.minutes = 0
          deviceInfo.currentTime.hours++
        }
        deviceInfo.currentTimeLabel = {
          hour: Format.getTime(deviceInfo.currentTime.hours),
          minute: Format.getTime(deviceInfo.currentTime.minutes),
          second: Format.getTime(deviceInfo.currentTime.seconds),
        }
        // 工作时间
        let setWorkTimeSec = Number(newDeviceStatus.set_work_time_sec)
        deviceInfo.setWorkTime = Math.ceil(setWorkTimeSec / 60)
        // 预约时间
        let setAppointTimeSec = Number(newDeviceStatus.remain_appoint_time_sec)
        let nowDate = new Date()
        let today = nowDate.getDate()
        let nowDateStamp = nowDate.getTime()
        let targetDateStamp = nowDateStamp + setAppointTimeSec * 1000
        let targetDate = new Date(targetDateStamp)
        let targetDay = targetDate.getDate()
        let scheduleFinishLabel = '等待启动'
        if (today === targetDay) {
          // 今天
          scheduleFinishLabel = '今天'
        } else {
          // 明天
          scheduleFinishLabel = '明天'
        }
        let finishTime = Format.dateFormat('HH:MM', targetDate)
        scheduleFinishLabel += finishTime
        deviceInfo.finishTime = scheduleFinishLabel
      }
      console.log(deviceInfo)
      this.setData({ deviceInfo, optionsWrapper })
    },
    // endregion
    // region 轮询获取设备状态
    deviceStatusInterval(interval) {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
      if (!interval) {
        interval = 6000
      }
      if (isDeviceInterval) {
        deviceStatusTimer = setInterval(() => {
          this.updateStatus()
        }, interval)
      }
      // this.updateStatus();
    },
    clearDeviceStatusInterval() {
      if (deviceStatusTimer) {
        clearInterval(deviceStatusTimer)
      }
    },
    // endregion

    // region 开始烹饪
    startWork() {
      do {
        let data = this.data
        let deviceInfo = data.deviceInfo
        let pageProductConfig = data.pageProductConfig
        let settingModal = data.settingModal
        let scheduleData = data.scheduleData
        let selectedFunction = data.selectedFunction
        if (!deviceInfo.isOnline) {
          MideaToast('设备离线，请稍后继续操作')
          break
        }
        let controlParams = {
          work_mode: selectedFunction.code,
          work_switch: 'work',
        }
        // 面包重量
        if (pageProductConfig.weightLevel.hasConfig && pageProductConfig.weightLevel.isShow) {
          controlParams['weight'] = settingModal.params.weightLevel.value
        }
        // 烤色
        if (pageProductConfig.burnColorLevel.hasConfig && pageProductConfig.burnColorLevel.isShow) {
          controlParams['burn_color'] = settingModal.params.burnColorLevel.value
        }
        // 投料
        if (pageProductConfig.feedingType.hasConfig && pageProductConfig.feedingType.isShow) {
          controlParams['feeding'] = settingModal.params.feedingType.value ? '2' : '0'
        }
        // 工作时间
        if (pageProductConfig.workTime.hasConfig && pageProductConfig.workTime.isShow) {
          controlParams['set_work_time_sec'] = settingModal.params.workTime.value
        }
        // 预约完成时间
        if (pageProductConfig.appoint.hasConfig && pageProductConfig.appoint.isShow) {
          if (scheduleData.result) {
            controlParams['work_switch'] = 'schedule'
            controlParams['set_appoint_time_sec'] = Math.round(scheduleData.result) * 60
          }
        }
        console.log('开始烹饪')
        console.log(controlParams)
        console.log(deviceInfo)
        // break;
        this.closeSettingModal()
        this.onClickControl(controlParams)
        wx.pageScrollTo({
          scrollTop: 0,
        })
        // console.log(controlParams);
      } while (DO_WHILE_RETURN)
    },
    // endregion

    // 控制设备状态
    onClickControlStatus(event) {
      let index = event.currentTarget.dataset.index
      let deviceInfo = this.data.deviceInfo
      do {
        if (!index) {
          console.warn(index)
          break
        }
        let controlParams = {}
        let title = '美味仍未完成\n是否结束设备工作'
        switch (index) {
          case 'stop':
            controlParams['work_switch'] = 'cancel'
            if (deviceInfo.work_status === deviceInfo.workStatus['appoint']) {
              title = '是否结束当前预约'
            }
            wx.showModal({
              title: title,
              success: (res) => {
                if (res.confirm) {
                  this.onClickControl(controlParams)
                }
              },
            })
            break
          case 'toggleWork':
            controlParams['work_switch'] = deviceInfo.isWorking ? 'pause' : 'keep_working'
            this.onClickControl(controlParams)
            break
        }
      } while (DO_WHILE_RETURN)
    },

    // region 启动功能
    onClickControl(controlParams) {
      return new Promise((resolve) => {
        UI.showLoading()
        this.clearDeviceStatusInterval()
        // let deviceInfo = this.data.deviceInfo;
        // if(deviceInfo.currentFunction){
        //   controlParams.work_mode = deviceInfo.currentFunction.code;
        // }
        controlParams.control_src = '1'
        controlParams.sub_cmd = '1'
        this.requestControl({
          control: controlParams,
        })
          .then((res) => {
            UI.hideLoading()
            this.dataInit(res.data.data.status)
            this.deviceStatusInterval()
            resolve()
          })
          .catch((err) => {
            console.log(err)
            let res = err
            do {
              UI.hideLoading()
              if (res.data.code != 0) {
                let msg = PluginConfig.handleErrorMsg(res.data.code)
                MideaToast(msg)
                break
              }
              this.dataInit(res.data.data.status)
              this.deviceStatusInterval()
            } while (DO_WHILE_RETURN)
          })
      })
    },
    // endregion

    // region 选择功能类型
    selectOptionsIndex(event) {
      do {
        let index = 0
        if (typeof event === 'number') {
          index = event
        } else {
          index = event.currentTarget.dataset.index
        }
        let configList = this.data.configList
        let optionsWrapperWidth = 686
        let translateX = -index * optionsWrapperWidth
        let optionsWrapper = this.data.optionsWrapper
        optionsWrapper.translateX = translateX
        optionsWrapper.activeIndex = index
        if (configList[index].functions.length === 1) {
          this.functionConfigInit(configList[index].functions[0])
        }
        this.fixOptionsWrapperHeightByOptions(index)
        this.setData({ optionsWrapper })
      } while (DO_WHILE_RETURN)
    },
    // endregion

    // region 根据内容区域高度设置区域高度
    fixOptionsWrapperHeightByOptions(index) {
      let className = '.options-' + index
      let windowHeight = wx.getSystemInfoSync().windowHeight
      let limitRateData = this.data.limitRateData
      wx.createSelectorQuery()
        .in(this)
        .select(className)
        .fields(
          {
            dataset: true,
            size: true,
            scrollOffset: true,
            properties: ['scrollX', 'scrollY'],
            computedStyle: ['margin', 'backgroundColor'],
            context: true,
          },
          (res) => {
            console.log(windowHeight, res)
            let optionsWrapper = this.data.optionsWrapper
            optionsWrapper.height = res.height
            // 设置样式
            optionsWrapper.customStyle =
              'transform: translateX(' +
              optionsWrapper.translateX +
              'rpx);' +
              (optionsWrapper.height ? 'height:' + optionsWrapper.height + 'px;' : '')
            this.setData({ optionsWrapper })
            // 判断功能区域高度
            let limitRate = (res.height + limitRateData.extraHeight) / windowHeight
            console.log(limitRate, limitRateData.rate)
            if (limitRate > limitRateData.rate) {
              this.setData({
                isBottomFixed: false,
              })
            } else {
              this.setData({
                isBottomFixed: true,
              })
            }
          }
        )
        .exec()
    },
    // endregion

    // region 点击功能项
    onClickFunction(event) {
      do {
        let deviceInfo = this.data.deviceInfo
        let optionsWrapper = this.data.optionsWrapper
        if (!deviceInfo.isOnline) {
          MideaToast('设备已离线，请检查设备状态')
          break
        }
        if (deviceInfo.isRunning) {
          MideaToast('设备工作中，请稍后再试')
          break
        }
        let selectedFunction = event.currentTarget.dataset.item
        console.log('选中的功能项')
        console.log(selectedFunction)
        this.setData({ selectedFunction })
        this.functionConfigInit(selectedFunction)
        let pageProductConfig = this.data.pageProductConfig
        let hasOptions = false
        for (let key in pageProductConfig) {
          if (pageProductConfig[key].hasConfig) {
            hasOptions = true
          }
        }
        if (hasOptions) {
          this.showSettingModal()
        } else {
          wx.showModal({
            title: selectedFunction.name,
            content: '是否开始烹饪？',
            // confirmText: '启动',
            success: (res) => {
              if (res.confirm) {
                this.startWork()
              }
            },
          })
        }
      } while (DO_WHILE_RETURN)
    },
    // endregion

    // region 设置弹框点击事件
    onClickSettingEvent(event) {
      do {
        let index = event.currentTarget.dataset.index
        let value = event.currentTarget.dataset.value
        let item = event.currentTarget.dataset.item
        if (!index) {
          MideaToast('invalid index')
          break
        }
        console.log(item)
        let settingModal = this.data.settingModal
        let pageProductConfig = this.data.pageProductConfig
        let workTimeData = this.data.workTimeData
        let valueArray = []
        let settingModalParams = {}
        switch (index) {
          case 'weightLevel':
          case 'burnColorLevel':
            if (!item) {
              MideaToast('缺少item')
              break
            }
            if (!value) {
              MideaToast('缺少value')
              break
            }
            valueArray = pageProductConfig.weightLevel.valueArray
            settingModalParams = settingModal.params.weightLevel
            if (index === 'burnColorLevel') {
              valueArray = pageProductConfig.burnColorLevel.valueArray
              settingModalParams = settingModal.params.burnColorLevel
            }
            valueArray.forEach((item) => {
              if (item.value === value) {
                item.classActive = 'active'
              } else {
                item.classActive = ''
              }
            })
            settingModalParams.value = value
            break
        }
        this.setData({ settingModal, pageProductConfig })
      } while (DO_WHILE_RETURN)
    },
    // endregion

    // 所选功能参数初始化
    functionConfigInit(selectedFunction) {
      this.pageProductConfigInit()
      if (selectedFunction.settings && selectedFunction.settings.length > 0) {
        let pageProductConfig = this.data.pageProductConfig
        let settingModal = this.data.settingModal
        let appointProperties = {}
        selectedFunction.settings.forEach((settingItem) => {
          let properties = settingItem.properties
          let valueArr = []
          let defaultValue = {
            value: settingItem.properties.defaultValue,
            label: undefined,
          }
          switch (settingItem.apiKey) {
            case PluginConfig.apiKey.isShowIngredient:
              // 食材详情
              pageProductConfig.isShowIngredient.show = true
              pageProductConfig.isShowIngredient.hasConfig = true
              break
            case PluginConfig.apiKey.weightLevel:
              // 面粉重量
              pageProductConfig.weightLevel.hasConfig = true
              pageProductConfig.weightLevel.isShow = true
              if (properties.options && properties.options.length > 0) {
                properties.options.forEach((optionItem) => {
                  valueArr.push({
                    classActive: optionItem.value === properties.defaultValue ? 'active' : '',
                    value: optionItem.value,
                    label: optionItem.text,
                    temp: optionItem.temp,
                    time: optionItem.time,
                  })
                })
              }
              pageProductConfig.weightLevel.valueArray = valueArr
              settingModal.params.weightLevel.value = properties.defaultValue
              break
            case PluginConfig.apiKey.burnColorLevel:
              // 烤色
              pageProductConfig.burnColorLevel.hasConfig = true
              pageProductConfig.burnColorLevel.isShow = true
              if (properties.options && properties.options.length > 0) {
                properties.options.forEach((optionItem) => {
                  valueArr.push({
                    classActive: optionItem.value === properties.defaultValue ? 'active' : '',
                    value: optionItem.value,
                    label: optionItem.text,
                    temp: optionItem.temp,
                    time: optionItem.time,
                  })
                })
              }
              pageProductConfig.burnColorLevel.valueArray = valueArr
              settingModal.params.burnColorLevel.value = properties.defaultValue
              break
            case PluginConfig.apiKey.setWorkTime:
              // 工作时间
              pageProductConfig.workTime.hasConfig = true
              pageProductConfig.workTime.isShow = true
              this.workTimeDataInit({
                appointTime: settingItem,
              })
              break
            case PluginConfig.apiKey.feedingType:
              // 投料
              pageProductConfig.feedingType.hasConfig = true
              pageProductConfig.feedingType.isShow = true
              break
            case PluginConfig.apiKey.appointTime:
              // 预约
              pageProductConfig.appoint.hasConfig = true
              pageProductConfig.appoint.isShow = true
              appointProperties = properties
              break
          }
        })
        if (appointProperties) {
          this.scheduleDataInit(appointProperties)
        }
        this.setData({ settingModal, pageProductConfig })
        console.log('页面功能配置')
        console.log(pageProductConfig)
      }
    },

    // region 页面配置初始化
    pageProductConfigInit() {
      let pageProductConfig = this.data.pageProductConfig
      for (let key in pageProductConfig) {
        pageProductConfig[key] = {
          isShow: false,
          hasConfig: false,
        }
      }
      // pageProductConfig = {
      //   weightLevel: {
      //     isShow: false,
      //     hasConfig: false,
      //   },
      //   burnColorLevel: {
      //     isShow: false,
      //     hasConfig: false,
      //   },
      //   appoint: {
      //     isShow: false,
      //     hasConfig: false,
      //   },
      //   feedingType: {
      //     isShow: false,
      //     hasConfig: false,
      //   },
      //   workTime: {
      //     isShow: false,
      //     hasConfig: false,
      //   },
      // }
      this.setData({ pageProductConfig })
    },
    // endregion

    // region 炉灯开关
    switchLightChange(event) {
      let model = event.detail
      do {
        let deviceInfo = this.data.deviceInfo
        if (!deviceInfo.isRunning) {
          MideaToast('待机状态无法设置炉灯')
          model.selected = false
          break
        }
        this.onClickControl({
          work_switch: 'modifyParam',
          flag_modify_light_enable: 1,
          flag_light_enable: model.selected ? 1 : 0,
        })
      } while (DO_WHILE_RETURN)
      this.setData({
        switchLight: parseComponentModel(model),
      })
    },
    // endregion

    // region 工作时间参数初始化
    workTimeDataInit({ appointTime }) {
      let appointTimeData = appointTime.properties
      let appointTimeDataMin = Number(appointTimeData.min)
      let defaultValueMin = Number(appointTimeData?.defaultValue ?? 0)
      let defaultValueTime = Format.formatSeconds(defaultValueMin * 60)
      let workTimeData = this.data.workTimeData
      let settingModal = this.data.settingModal
      let hours = []
      let minutes = []
      let minHours = Math.floor(appointTimeDataMin / 60)
      let maxHours = Math.floor(appointTimeData.max / 60)
      let minMinutes = appointTimeDataMin % 60
      let maxMinutes = appointTimeData.max % 60
      // 设置小时数据
      for (let i = minHours; i <= maxHours; i++) {
        hours.push(i)
        if (i === defaultValueTime.hours) {
          workTimeData.value[1] = hours.length - 1
        }
      }
      // 设置分钟数据
      let startMinutes = minMinutes
      if (workTimeData.value[1] !== 0) {
        startMinutes = 0
      }
      for (let i = startMinutes; i < 60; i++) {
        minutes.push(i)
        if (i === defaultValueTime.minutes) {
          workTimeData.value[2] = minutes.length - 1
        }
      }
      workTimeData.minHours = minHours
      workTimeData.minMinutes = minMinutes
      workTimeData.maxHours = maxHours
      workTimeData.maxMinutes = maxMinutes
      workTimeData.hours = hours
      workTimeData.minutes = minutes
      workTimeData.result = defaultValueTime
      settingModal.params.workTime.value = defaultValueMin * 60
      workTimeData.resultLabel =
        (workTimeData.result.hours > 0 ? workTimeData.result.hours + '小时' : '') +
        (workTimeData.result.minutes > 0 ? workTimeData.result.minutes + '分钟' : '')
      this.setData({ workTimeData })
    },
    // endregion

    // 开关切换
    switchFeedingTypeChange(event) {
      let model = event.detail
      let settingModal = this.data.settingModal
      settingModal.params.feedingType.value = model.selected
      this.setData({
        settingModal,
        switchFeedingType: parseComponentModel(model),
      })
    },

    // region 烹饪时间选择
    workTimePickerOnChange(e) {
      // 数据联动修改
      let val = e.detail.value
      let hoursIndex = val[1]
      let workTimeData = this.data.workTimeData
      let settingModal = this.data.settingModal
      // let minHours = workTimeData.minHours
      let minMinutes = workTimeData.minMinutes
      // let maxHours = workTimeData.maxHours
      let maxMinutes = workTimeData.maxMinutes
      let minutes = []
      if (hoursIndex === 0) {
        // 筛选最小分钟
        for (let i = minMinutes; i < 60; i++) {
          minutes.push(i)
        }
      } else if (hoursIndex === workTimeData.hours.length - 1) {
        // 筛选最大分钟
        for (let i = 0; i <= maxMinutes; i++) {
          minutes.push(i)
        }
      } else {
        for (let i = 0; i < 60; i++) {
          minutes.push(i)
        }
      }
      workTimeData.value = val
      workTimeData.minutes = minutes
      let workTimeHours = workTimeData.hours[val[1]]
      let workTimeMinutes = workTimeData.minutes[val[2]]
      let workTimeSeconds = workTimeHours * 60 * 60 + workTimeMinutes * 60
      let workTimeResult = Format.formatSeconds(workTimeSeconds)
      if (workTimeResult.minutes === 60) {
        workTimeResult.hours += 1
        workTimeResult.minutes = 0
      }
      workTimeData.result = workTimeResult
      settingModal.params.workTime.value = workTimeSeconds
      workTimeData.resultLabel =
        (workTimeData.result.hours > 0 ? workTimeData.result.hours + '小时' : '') +
        (workTimeData.result.minutes > 0 ? workTimeData.result.minutes + '分钟' : '')
      this.setData({ workTimeData, settingModal })
    },
    // endregion

    // 预约开关切换
    switchScheduleChange(event) {
      let model = event.detail
      let scheduleData = this.data.scheduleData
      let settingModal = this.data.settingModal
      if (model.selected) {
        this.showScheduleModal()
        this.scheduleDataOnChange({
          detail: {
            value: this.data.scheduleData.value,
          },
        })
      } else {
        scheduleData.result = undefined
        scheduleData.resultLabel = undefined
      }
      settingModal.params.appoint.value = model.value
      this.setData({
        scheduleData,
        settingModal,
        switchSchedule: parseComponentModel(model),
      })
    },

    // 确认预约时间
    confirmSchedule() {
      let scheduleData = this.data.scheduleData
      if (!scheduleData.isConfirming) {
        this.setData({ scheduleData })
        let value = scheduleData.value
        let deviceInfo = this.data.deviceInfo
        let day = value[1]
        let hour = parseInt(scheduleData.hours[value[2]])
        let minute = parseInt(scheduleData.minutes[value[3]])
        let nowDate = new Date()
        // 判断RTC类型，计算完成时间
        if (deviceInfo.isSupportRtc) {
          // 时钟类型,不作处理
        } else {
          // 非时钟类型，计算间隔时间
          if (day === 0) {
            let interval = hour * 60 + minute - (nowDate.getHours() * 60 + nowDate.getMinutes())
            hour = Math.floor(interval / 60)
            minute = interval % 60
          } else {
            let nowTimestamp = nowDate.getTime()
            // 获取明天的时间
            let tomorrowTimestamp = nowTimestamp + 86400000
            let tomorrowDate = new Date(tomorrowTimestamp)
            // 获取明天的年月日
            let targetYear = tomorrowDate.getFullYear() + ''
            let targetMonth = tomorrowDate.getMonth() + 1 + ''
            let targetDate = tomorrowDate.getDate() + ''
            let targetString =
              targetYear +
              '/' +
              targetMonth +
              '/' +
              targetDate +
              ' ' +
              Format.getTime(hour) +
              ':' +
              Format.getTime(minute)
            // 获取目标时间的时间戳
            let targetTimestamp = new Date(targetString).getTime()
            let targetInterval = targetTimestamp - nowTimestamp
            hour = Math.floor(targetInterval / 1000 / 60 / 60)
            minute = (targetInterval / 1000 / 60) % 60
          }
        }
        scheduleData.result = hour * 60 + minute
        let today = nowDate.getDate()
        let nowDateStamp = nowDate.getTime()
        let targetDateStamp = nowDateStamp + scheduleData.result * 60 * 1000
        let targetDate = new Date(targetDateStamp)
        let targetDay = targetDate.getDate()
        let scheduleFinishLabel = '等待启动'
        if (today === targetDay) {
          // 今天
          scheduleFinishLabel = '今天'
        } else {
          // 明天
          scheduleFinishLabel = '明天'
        }
        let finishTime = Format.dateFormat('HH:MM', targetDate)
        scheduleFinishLabel += finishTime
        scheduleData.resultLabel = scheduleFinishLabel
        scheduleData.isConfirming = false
        this.setData({ scheduleData })
        this.closeScheduleModal()
      }
    },

    //
    scheduleDataOnStart(e) {
      let scheduleData = this.data.scheduleData
      scheduleData.isConfirming = true
      this.setData({ scheduleData })
    },
    scheduleDataOnEnd() {
      let scheduleData = this.data.scheduleData
      scheduleData.isConfirming = false
      this.setData({ scheduleData })
    },
    // 预约时间选择
    scheduleDataOnChange(e) {
      // 数据联动修改
      let val = e.detail.value
      if (val && val.length > 0) {
        let day = val[1]
        let hour = val[2]
        // let min = val[3]
        let nowDate = new Date()
        // let nowDate = this.data.nowDate
        let nowHour = nowDate.getHours()
        let nowMin = nowDate.getMinutes()
        let scheduleData = this.data.scheduleData
        let minHours = scheduleData.minHours
        let minMinutes = scheduleData.minMinutes
        let maxHours = scheduleData.maxHours
        let maxMinutes = scheduleData.maxMinutes
        let hours = []
        let minutes = []
        let startMin = nowMin + minMinutes
        // 监听天数
        if (day === 0) {
          // 选择了今天
          // 设置小时数据
          let initMaxHours = 24
          if (nowHour + maxHours < 24) {
            initMaxHours = nowHour + maxHours + 1
          }
          for (let i = nowHour + minHours; i < initMaxHours; i++) {
            hours.push(Format.getTime(i))
          }
          // 设置分钟数据
          if (startMin >= 60) {
            startMin = nowMin + minMinutes - 60
          }
          if (hour !== 0) {
            startMin = 0
          }
          let initEndMin = hour === hours.length - 1 && scheduleData.day.length === 1 ? maxMinutes : 59
          for (let i = startMin; i <= initEndMin; i++) {
            minutes.push(Format.getTime(i))
          }
        } else {
          // 选择了明天
          // 设置小时数据
          for (let i = 0; i < nowHour + maxHours - 23; i++) {
            hours.push(Format.getTime(i))
          }
          // 设置分钟数据
          for (let i = 0; i < 60; i++) {
            minutes.push(Format.getTime(i))
          }
          // 选择了最大小时
          if (hour === hours.length - 1) {
            minutes = []
            for (let i = 0; i <= maxMinutes; i++) {
              minutes.push(Format.getTime(i))
            }
          }
        }
        scheduleData.hours = hours
        scheduleData.minutes = minutes
        scheduleData.value = val
        this.setData({ scheduleData })
      }
    },

    // region 预约时间初始化
    scheduleDataInit(selectedOptionsData) {
      let scheduleData = this.data.scheduleData
      let deviceInfo = this.data.deviceInfo
      let selectedFunction = this.data.selectedFunction
      let settingModal = this.data.settingModal
      let hours = []
      let minutes = []
      let temp = `weight_${settingModal.params.weightLevel.value}_burn_${settingModal.params.burnColorLevel.value}`
      const product = workTimeJson[`modelNo_${deviceInfo.sn8}`]
      if (product) {
        const menu = product[`id_${selectedFunction.code}`]
        if (menu) {
          selectedOptionsData.min = selectedOptionsData.defaultValue = menu[temp]
        }
        console.log('预约时间: ', selectedOptionsData.min, temp, product, menu)
      }
      let minHours = Math.floor(selectedOptionsData.min / 60)
      let minMinutes = selectedOptionsData.min % 60
      let maxHours = Math.floor(selectedOptionsData.max / 60)
      let maxMinutes = selectedOptionsData.max % 60
      // 获取当前时间
      let nowDate = new Date()
      // 设置小时数据
      let nowHour = nowDate.getHours()
      let nowMin = nowDate.getMinutes()
      let startMin = nowMin + minMinutes
      if (nowMin + maxMinutes >= 60) {
        maxHours++
        maxMinutes = Math.abs(nowMin - 60 + maxMinutes)
      } else {
        maxMinutes = nowMin + maxMinutes
      }
      if (nowHour + maxHours < 24) {
        // 预约时间不足明天
        scheduleData.day = ['今天']
      } else {
        scheduleData.day = ['今天', '明天']
      }
      if (startMin > 60) {
        minHours++
        startMin = nowMin + minMinutes - 60
      }
      for (let i = nowHour + minHours; i < 24; i++) {
        hours.push(Format.getTime(i))
      }
      // 设置分钟数据
      for (let i = startMin; i <= 60; i++) {
        if (i === 60) {
          if (minutes[minutes.length - 1] !== 59) {
            minutes.push(Format.getTime(0))
          }
        } else {
          minutes.push(Format.getTime(i))
        }
      }
      scheduleData.hours = hours
      scheduleData.minutes = minutes
      scheduleData.minHours = minHours
      scheduleData.minMinutes = minMinutes
      scheduleData.maxHours = maxHours
      scheduleData.maxMinutes = maxMinutes
      scheduleData.value = [0, 0, 0, 0]
      scheduleData.result = undefined
      scheduleData.resultLabel = undefined
      let switchSchedule = parseComponentModel(this.data.switchSchedule)
      switchSchedule.selected = false
      switchSchedule = parseComponentModel(switchSchedule)
      this.setData({ scheduleData, nowDate, switchSchedule })
    },
    // endregion

    // region 显示预约对话框
    showScheduleModal() {
      let scheduleModal = this.data.scheduleModal
      scheduleModal.isShow = true
      this.setData({ scheduleModal })
    },
    closeScheduleModal() {
      let scheduleModal = this.data.scheduleModal
      let scheduleData = this.data.scheduleData
      let switchSchedule = parseComponentModel(this.data.switchSchedule)
      if (!scheduleData.result) {
        switchSchedule.selected = false
      }
      scheduleModal.isShow = false
      switchSchedule = parseComponentModel(switchSchedule)
      this.setData({ scheduleModal, switchSchedule })
    },
    // endregion

    // region 显示参数设置对话框
    showSettingModal() {
      // 防止用户多次点击选项，事件重复执行
      if (!isShowingSettingModal) {
        isShowingSettingModal = true
        let settingModal = this.data.settingModal
        settingModal.isShow = true
        this.setData({ settingModal })
        if (showingSettingModalTimer) {
          clearTimeout(showingSettingModalTimer)
        }
        showingSettingModalTimer = setTimeout(() => {
          isShowingSettingModal = false
        }, 1000)
      }
    },
    closeSettingModal() {
      if (!isShowingSettingModal) {
        let settingModal = this.data.settingModal
        settingModal.isShow = false
        // 烹饪时间初始化
        this.setData({ settingModal })
        setTimeout(() => {
          let workTimeData = this.data.workTimeData
          workTimeData.value = [0, 0, 0, 0]
          this.setData({ workTimeData })
        }, 300)
      }
    },
    // endregion

    // endregion
    // region 2021.12.01 之前代码
    requestControl(command) {
      // wx.showNavigationBarLoading()
      // wx.showLoading({mask: true})
      // 埋点
      let params = {
        control_params: JSON.stringify(command),
      }
      this.rangersBurialPointClick('plugin_button_click', params)
      return requestService.request('luaControl', {
        applianceCode: this.properties.applianceData.applianceCode,
        command: command,
        reqId: getStamp().toString(),
        stamp: getStamp(),
      })
    },
    updateStatus() {
      return new Promise((resolve) => {
        let deviceInfo = this.data.deviceInfo
        requestService
          .request('luaGet', {
            applianceCode: this.properties.applianceData.applianceCode,
            command: {},
            reqId: getStamp().toString(),
            stamp: getStamp(),
          })
          .then((res) => {
            do {
              console.log('获取设备状态')
              console.log(res)
              if (res.data.code != 0) {
                deviceInfo.isOnline = false
                deviceInfo.functionEnabled = deviceInfo.isOnline
                this.setData({ deviceInfo })
                this.updatePageStyle()
                let msg = PluginConfig.handleErrorMsg(res.data.code)
                MideaToast(msg)
                resolve(res)
                break
              }
              try {
                deviceInfo.isOnline = true
                deviceInfo.functionEnabled = deviceInfo.isOnline
                this.dataInit(res.data.data)
              } catch (e) {
                console.error(e)
              }
              resolve(res)
            } while (DO_WHILE_RETURN)

            this.setData({
              deviceInfo,
              _applianceData: {
                onlineStatus: 1,
                offlineFlag: false,
              },
            })

            wx.setStorage({
              key: 'offlineFlag',
              data: false,
            })
          })
          .catch((err) => {
            let res = err.data
            if (res) {
              if (res.result && res.result.returnData) {
                res = JSON.parse(res.result.returnData)
              }
              do {
                if (res.code != 0) {
                  if (res.code == 1307) {
                    deviceInfo.isOnline = false
                    deviceInfo.functionEnabled = deviceInfo.isOnline
                    this.setData({ deviceInfo })
                    this.updatePageStyle()
                    break
                  }
                  let msg = PluginConfig.handleErrorMsg(res.code)
                  MideaToast(msg)
                  break
                }
                MideaToast('未知错误-状态')
              } while (DO_WHILE_RETURN)
            }
            resolve()
            if (err && err.data && (err.data.code == 1307 || err.data.code == 40670)) {
              this.setData({
                _applianceData: {
                  onlineStatus: 0,
                  offlineFlag: true,
                },
              })
              wx.setStorage({
                key: 'offlineFlag',
                data: true,
              })
            }
            // this.triggerEvent('modeChange', this.getCurrentMode());//向上层通知mode更改
          })
      })
    },
    getDestoried() {
      //执行当前页面前后插件的业务逻辑，主要用于一些清除工作
      try {
        let intervalKey = wx.getStorageSync('ECInterval' + this.properties.applianceData.applianceCode)
        if (intervalKey) {
          clearInterval(intervalKey)
        }
        this.clearDeviceStatusInterval()
        if (showingSettingModalTimer) {
          clearTimeout(showingSettingModalTimer)
        }
        showingSettingModalTimer = null
        isShowingSettingModal = false
      } catch (e) {
        console.error(e)
      }
    },
    noop() {},
    // 埋点
    rangersBurialPointClick(eventName, param) {
      let deviceInfo = this.data.deviceInfo
      if (deviceInfo) {
        let paramBurial = {}
        let paramBase = {
          module: '插件',
          apptype_name: '面包机',
          deviceInfo: {
            widget_cate: deviceInfo.type,
            sn8: deviceInfo.sn8,
            a0: deviceInfo.modelNumber,
            iot_device_id: deviceInfo.applianceCode,
          },
        }
        paramBurial = Object.assign(paramBase, param)
        rangersBurialPoint(eventName, paramBurial)
      }
    },
    // endregion
  },

  attached() {
    const app = getApp()
    let deviceInfo = this.data.deviceInfo
    wx.nextTick(() => {
      Object.assign(deviceInfo, this.properties.applianceData)
      this.setData({
        uid: app.globalData.userData.uid,
        _applianceData: this.properties.applianceData,
        deviceInfo: deviceInfo,
      })
      let param = {}
      param['page_name'] = '首页'
      param['object'] = '进入插件页'
      this.rangersBurialPointClick('plugin_page_view', param)
      this.getProductConfig().then(() => {
        this.updateStatus().then(() => {
          switch (deviceInfo.device_mode) {
            case 1:
              this.selectOptionsIndex(0)
              break
            case 2:
              this.selectOptionsIndex(1)
              break
          }
          this.deviceStatusInterval()
          this.setData({
            isInit: true,
          })
        })
        // 获取功能区域高度
        let windowHeight = wx.getSystemInfoSync().windowHeight
        let limitRateData = this.data.limitRateData
        wx.createSelectorQuery()
          .in(this)
          .select('.controller-wrapper')
          .fields(
            {
              size: true,
            },
            (res) => {
              console.log(windowHeight, res)
              if (res) {
                let limitRate = (res.height + limitRateData.extraHeight) / windowHeight
                if (limitRate > limitRateData.rate) {
                  this.setData({
                    isBottomFixed: false,
                  })
                } else {
                  this.setData({
                    isBottomFixed: true,
                  })
                }
              }
            }
          )
          .exec()
      })
    })
  },
})
