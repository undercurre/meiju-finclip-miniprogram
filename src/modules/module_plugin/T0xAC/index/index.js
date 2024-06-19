// T0xAC//index/index.js
const app = getApp()
const requestService = app.getGlobalConfig().requestService
import pluginMixin from 'm-miniCommonSDK/utils/plugin-mixin'
import {
  cloudDecrypt
} from 'm-utilsdk/index';

import selfApi from '../api/api'
import {
  PreventCoolSn8
} from '../util/selfconfig/PreventCoolSn8'
const inputWifiInfo = app.getGlobalConfig().paths.inputWifiInfo
let bluetoothOpen = false
let rssiMap = {}
let rssiCheckSize = 10
let key = app.globalData?.userData?.key
let appKey = app.getGlobalConfig().appKey

function compare(a, b) {
  if (a.RSSI < b.RSSI) {
    return 1
  }
  if (a.RSSI > b.RSSI) {
    return -1
  }
  return 0
}
// 最新引入
import SnProcess from '../util/device-funcs-match/SnProcess'
import FuncMatchBase from '../util/device-funcs-match/SNProcess/FuncMatchBase'
import Common from '../util/common'
import BleCommon from '../bluetooth/common'

import BluetoothConn from '../bluetooth/bluetooth-conn.js'
import Event from '../bluetooth/event'

var baseImgApi = app.getGlobalConfig().baseImgApi;
var imageDoamin = (baseImgApi.url).split('/projects/')[0] + '/projects/sit/meiju-lite-assets/';
console.log(imageDoamin, 'imageDoamin')


const timerArr = ["30分钟", "1小时", "1.5小时", "2小时", "2.5小时", "3小时", "3.5小时", "4小时", "4.5小时", "5小时", "5.5小时", "6小时",
  "6.5小时", "7小时", "7.5小时", "8小时", "8.5小时", "9小时", "9.5小时", "10小时", "10.5小时", "11小时", "11.5小时", "12小时", "12.5小时",
  "13小时", "13.5小时", "14小时", "14.5小时", "15小时", "15.5小时", "16小时", "16.5小时", "17小时", "17.5小时", "18小时", "18.5小时", "19小时",
  "19.5小时", "20小时", "20.5小时", "21小时", "21.5小时", "22小时", "22.5小时", "23小时", "23.5小时", "24小时"
]


const AC_TYPE_PRODUCT = {
  '移动空调': 'mobile',
  '天花机': 'topfloor',
  '柜机窄风口': 'guiji_narrow',
  '柜机宽风口': 'guiji_width',
  '挂机': 'guaji',
  '风管机': 'windpie',
  '热风机': 'hotwind',
  "厨房空调": 'kitchen',
  'T1T3': 'T1T3'
}

import {
  FuncType,
  FuncOrder,
  FuncMetaType
} from '../util/sn-process/FuncType'
import {
  Btns
} from '../util/BtnCfg'

import {
  SNFuncMatch,
  FuncDefault,
  FuncCoolFreeDefault
} from '../util/sn-process/SnFuncMap'
import DeviceComDecorator from '../util/ac-service/DeviceComDecorator'
// import {
//   openSubscribeModal
// } from '../../../globalCommon/js/deviceSubscribe'

const openSubscribeModal = app.getGlobalConfig().openSubscribeModal;
const templateIds = app.getGlobalConfig().templateIds;
const modelIds = app.getGlobalConfig().modelIds;

// import {
//   judgeWayToMiniProgram
// } from '../../../utils/util'

import judgeWayToMiniProgram from 'm-miniCommonSDK/index'

import Helper from '../util/Helper'
const wahinMixin = require('../util/wahinMixin')

Page({
  behaviors: [pluginMixin, wahinMixin],
  /**
   * 页面的初始数据
   */
  data: {
    windFeelMxPanelWidth:0,
    windFeelItemsWidth:0,
    noImg:false,
    animation_img: {
      freshair: '', //新风动态图
      dry: '', //抽湿动态图
      nowindfeel: '', //无风感动态图
      fan: '', //送风动态图
      cool: '', //制冷动态图
      heat: '', //制热动态图
      auto: '', //自动动态图
    },
    onWindImg: imageDoamin + 'plugin/0xAC/' + 'cool-wind.png',
    // onDeviceImg: imageDoamin + 'plugin/0xAC/' + 'default220-on.png',
    // offDeviceImg: imageDoamin + 'plugin/0xAC/' + 'default220-off.png',
    onDeviceImg: '',
    offDeviceImg: '',
    lockImg: imageDoamin + 'plugin/0xAC/' + 'lock@2x.png',
    wifiImg: imageDoamin + 'plugin/0xAC/' + 'wifi@2x.png',

    uproundPopupCell: imageDoamin + 'plugin/0xAC/' + 'up-round-wind.png',
    downRoundPopupCell: imageDoamin + 'plugin/0xAC/' + 'down-round-wind.png',

    // 改版使用    
    windSpeedScaleText: [{title:'自动', offset:""}, {title:'1%', offset:"15"}, {title:'20%', offset:"15"}, {title:'40%', offset:"15"}, {title:'60%', offset:"15"}, {title:'80%', offset:"15"}, {title:'100%', offset:"0"}],
    windSpeedScaleTextKitchen: [{title:'自动', offset:"0"}, {title:'低', offset:"0"}, {title:'中', offset:"0"}, {title:'高', offset:"0"},  {title:'强劲', offset:"0"}],
    
    value4: 0,
    lrDirectArr: [],
    udDirectArr: [],
    windFeelBtn: [],
    otherBtn: [],
    cellArr: [],
    singleDirectArr: [],

    tempDebounceTimer: 0,
    modePopupMode: "cool", // 记录modePopup的选项

    showCleanPopup: false,
    useLocalImg: false,
    deviceSnBle: '',
    modeText: '自动',
    startupImg: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-off@2x.png',
    localImg: '../assets/t0ac/img_no_shebei@2x.png',
    imageDoamin: imageDoamin,
    basicBtn: [],
    btnObj: [],
    bleSpecialBtn: [],
    kitchenSpecialBtn: [],
    precision: 0, // 0：0.5 1：1为精度
    tempValCfg: {
      min: 16,
      max: 30,
    },
    sliderConfig: {
      default: {},
      heat: {},
      cool: {},
    },
    // page_path: '',
    acstatus: {
      mode: 2,
      runStatus: 0,
      tempIn: '',
      tempSet: 26.0,
      windSpeed: 102,
      windUpDown: 0,
      windLeftRight: 0,
      controlSwitchNoWindFeel: 0,
      newWindFunSw: 0,
      ecoFunc: 0,
      powerSave: 0,
      nonDirectWind: 0,
      diyFunc: 0,
      voiceBroadcastStatus: 0, // 0关 3开
      timingOffHour: 0,
      timingOffMinute: 0, // 30或0，30是0.5小时
      timingOffSwitch: 0,
      timingOnSwitch: 0, // 定时开 开关flag
      timingOnHour: 0, // 定时开 小时
      timingOnMinute: 0, // 定时开 分钟
      freshAirFanSpeed: 40,
      CSEco: 0,
      smartDryFunc: false,
      manualDryFunc: false,
      northWarmEffluentTemperature: 5,
      current_water_temperature: 0,
    }, // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
    acNewStatus: {
      voiceBroadcastStatus: 0,
      switchSelfCleaning: 0,
      superCoolingSw: 0,
      switchNonDirectWind: 0,
      switchFreshAir: 0,
      freshAirFanSpeed: 40,
      upDownAngle: 0,
      leftRightAngle: 0,
      aroundWind: 0,
      softWindFeel: 0,
      rewarmingDry:0,
      windSwingLrLeft: 0,
      windSwingLrRight: 0,
    },
    acSwStatus: {
      ModeWithNoAuto: true,
      ModeControl: true,
      DeviceSwitch: false,
      RefrigerantCheck: false,
      HotMode: false,
      DryMode: false,
      UpDownSwipeWind: false,
      LeftRightSwipeWind: false,
      ECO: false,
      WindBlowing: false,
      SelfCleaning: false,
      Quietness: false,
      DeviceSwitchAppointment: false,
      ElectricHeat: false,
      CSEco: false,
      AutoMode: false,
      WindMode: false,
      UpDownWindAngle: false,
      LeftRightWindAngle: false,
      Dry: false,
      FreshAir: false,
      UpDownAroundWind: false,
      DryNewName: false,
      FilterClean: false,
      Show: false,
      Supercooling: false,
      Voice: false,
      Sound: false,
      NoWindFeel: false,
      FaNoWindFeel: false,
      SleepCurve: false,
      UpNoWindFeel: false,
      DownNoWindFeel: false,
      UpDownWindBlowing: false,
      softWindFeel: false,
      Degerming: false,
      AroundWind: false,
      ThNowindFeel: false,
      AutomaticAntiColdAir: false,
      WaterFallWind: false,
      ThSoftWindFeel: false,
      QuickCoolHeat: false,
      DownSwipeWind00Ae: false,
      LeftRightSwipeWindPopup: false,
      UpDownSwipeWindPopup: false,
      DownSwipeWind: false
    },
    acValueStatus: {
      FreshAir: {
        value: '',
        text: '',
      },
    },
    applianceStatusNew: {},
    acStatus: {
      comfort_power_save: 'off',
      comfort_sleep: 'off',
      dry: 'off',
      dust_full_time: 0,
      eco: 'off',
      error_code: 0,
      indoor_temperature: 26,
      kick_quilt: 'off',
      mode: 'auto',
      natural_wind: 'off',
      outdoor_temperature: 26,
      pmv: -3.5,
      power: 'off',
      power_off_time_value: 0,
      power_off_timer: 'off',
      power_on_time_value: 0,
      power_on_timer: 'off',
      power_saving: 'off',
      prevent_cold: 'off',
      ptc: 'off',
      purifier: 'off',
      screen_display_now: 'on',
      small_temperature: 0,
      strong_wind: 'off',
      temperature: 26,
      version: 83,
      wind_speed: 101,
      wind_swing_lr: 'off',
      wind_swing_lr_under: 'off',
      wind_swing_ud: 'off',
    },
    powerImg: {
      on: imageDoamin + 'plugin/0xAC/' + 'switch-blue.png',
      heatOn: imageDoamin + 'plugin/0xAC/' + 'switch-yellow.png',
      off: imageDoamin + 'plugin/0xAC/' + 'switch-hui.png',
    },
    powerTit: {
      on: '已开机',
      off: '已关机',
    },
    circleData: {
      value: 1,
    },
    gradientColor: {
      offColor: {
        '0%': '#F9F9F9',
        '100%': '#F9F9F9',
      },
      heat: {
        '0%': '#FF8225',
        '100%': '#FFC155',
      },
      cool: {
        '0%': '#2679FF',
        '100%': '#4BAFFF',
      },
      dry: {
        '0%': '#2679FF',
        '100%': '#4BAFFF',
      },
      auto: {
        '0%': '#2679FF',
        '100%': '#4BAFFF',
      },
      fan: {
        '0%': '#2679FF',
        '100%': '#4BAFFF',
      },
    },
    freshAirFanSpeedMap: {
      40: '低',
      60: '中',
      80: '高',
      100: '强劲',
    },
    freshAirThSpeedMap: {
      40: '1档',
      60: '2档',
      80: '3档',
      100: '4档',
    },
    startupBtn: {
      //开关机模式
      shutDown: {
        //关机模式
        title: '已关机',
        img: imageDoamin + 'plugin/0xAC/' + 'switch-hui.png',
        addOrReduce: {
          //加减按钮
          addImg: imageDoamin + 'plugin/0xAC/' + 'shutDown-add.png',
          reduceImg: imageDoamin + 'plugin/0xAC/' + 'shutDown-reduce.png',
        },
      },
      open: {
        //开机模式
        openRef: {
          //开启制冷
          title: '已开启',
          img: imageDoamin + 'plugin/0xAC/' + 'switch-blue.png',
        },
        openHot: {
          //开启制热
          title: '已开启',
          img: imageDoamin + 'plugin/0xAC/' + 'switch-yellow.png',
        },
        addOrReduce: {
          //加减按钮
          addImg: imageDoamin + 'plugin/0xAC/' + 'open-add.png',
          reduceImg: imageDoamin + 'plugin/0xAC/' + 'open-reduce.png',
        },
      },
    },
    btnMapByMode: {
      on: [{
          id: 1,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-on@2x.png',
        },
        {
          id: 2,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-on@2x.png',
        },
        {
          id: 3,
          img: imageDoamin + 'plugin/0xAC/' +
            'bottom-switch-on@2x.png',
        },
        {
          id: 4,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-on-heat@2x.png',
        },
        {
          id: 5,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-on@2x.png',
        },
        {
          id: 6,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-on@2x.png',
        },        
        {
          id: 7,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-on@2x.png',
        }
      ],
      off: {
        img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-off@2x.png',

      },
      off: [{
          id: 1,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-off@2x.png',
        },
        {
          id: 2,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-off@2x.png',
        },
        {
          id: 3,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-off@2x.png',
        },
        {
          id: 4,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-off-heat.png',
        },
        {
          id: 5,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-off@2x.png',
        },
        {
          id: 6,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-off@2x.png',
        },
        {
          id: 7,
          img: imageDoamin + 'plugin/0xAC/' + 'bottom-switch-off@2x.png',
        },
      ],
    },
    // 模式
    modeShowObj: {},
    modeBtnObj: {
      textCool: '制冷',
      textHeat: '制热',
      shatdownImg: imageDoamin + 'plugin/0xAC/' + 'bottom-selfmo.png', //关机状态
      openRefImg: imageDoamin + 'plugin/0xAC/' + 'openRef.png', //制冷
      openHotImg: imageDoamin + 'plugin/0xAC/' + 'openHot.png', //制热
      type: 'mode',
    },

    // 底部弹窗-模式
    bottomModeBtn: [{
        id: 'auto',
        img: imageDoamin + 'plugin/0xAC/' + 'mode-popup-auto-unselected.png',
        clickImg: imageDoamin + 'plugin/0xAC/' + 'mode-popup-auto-selected.png',
        text: '自动',
        explain: '空调自动制冷或制热及调节风速 (风速不可调)'
      },
      {
        id: 'cool',
        img: imageDoamin + 'plugin/0xAC/' + 'mode-popup-cool-unselected.png',
        clickImg: imageDoamin + 'plugin/0xAC/' + 'mode-popup-cool-selected.png',
        text: '制冷',
        explain: '空调根据设定温度、风速来制冷与吹风'
      },
      {
        id: 'dry',
        img: imageDoamin + 'plugin/0xAC/' + 'mode-popup-dry-unselected.png',
        clickImg: imageDoamin + 'plugin/0xAC/' + 'mode-popup-dry-selected.png',
        text: '抽湿',
        explain: '空调带走室内空气水分，降低湿度'
      },
      {
        id: 'heat',
        img: imageDoamin + 'plugin/0xAC/' + 'mode-popup-heat-unselected.png',
        clickImg: imageDoamin + 'plugin/0xAC/' + 'mode-popup-heat-selected.png',
        text: '制热',
        explain: '空调根据设定温度、风速来制热与吹风'
      },
      {
        id: 'fan',
        img: imageDoamin + 'plugin/0xAC/' + 'mode-popup-fan-unselected.png',
        clickImg: imageDoamin + 'plugin/0xAC/' + 'mode-popup-fan-selected.png',
        text: '送风',
        explain: '空调只吹风，不制冷不制热 (温度不可调)'
      }
    ],

    // 底部弹窗-模式不带自动模式 TH专用
    bottomModeBtnNoAuto: [{
        id: 'cool',
        img: imageDoamin + 'plugin/0xAC/' + 'mode-popup-cool-unselected.png',
        clickImg: imageDoamin + 'plugin/0xAC/' + 'mode-popup-cool-selected.png',
        text: '制冷',
        explain: '空调根据设定温度、风速来制冷与吹风'
      },
      {
        id: 'dry',
        img: imageDoamin + 'plugin/0xAC/' + 'mode-popup-dry-unselected.png',
        clickImg: imageDoamin + 'plugin/0xAC/' + 'mode-popup-dry-selected.png',
        text: '抽湿',
        explain: '空调带走室内空气水分，降低湿度'
      },
      {
        id: 'heat',
        img: imageDoamin + 'plugin/0xAC/' + 'mode-popup-heat-unselected.png',
        clickImg: imageDoamin + 'plugin/0xAC/' + 'mode-popup-heat-selected.png',
        text: '制热',
        explain: '空调根据设定温度、风速来制热与吹风'
      },
      {
        id: 'fan',
        img: imageDoamin + 'plugin/0xAC/' + 'mode-popup-fan-unselected.png',
        clickImg: imageDoamin + 'plugin/0xAC/' + 'mode-popup-fan-selected.png',
        text: '送风',
        explain: '空调只吹风，不制冷不制热 (温度不可调)'
      }
    ],
    // 底部弹窗-左右风
    leftWindBtn: [{
        img: imageDoamin + 'plugin/0xAC/' + 'closeLeftWindy1-close.png',
        clickImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy1-heat.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy1-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy1-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy1-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy1-cool.png',
        },
        angle: 1,
      },
      {
        img: imageDoamin + 'plugin/0xAC/' + 'closeLeftWindy2-close.png',
        clickImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy2-heat.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy2-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy2-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy2-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy2-cool.png',
        },
        angle: 25,
      },
      {
        img: imageDoamin + 'plugin/0xAC/' + 'closeLeftWindy3-close.png',
        clickImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy3-heat.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy3-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy3-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy3-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy3-cool.png',
        },
        angle: 50,
      },
      {
        img: imageDoamin + 'plugin/0xAC/' + 'closeLeftWindy4-close.png',
        clickImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy4-heat.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy4-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy4-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy4-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy4-cool.png',
        },
        angle: 75,
      },
      {
        img: imageDoamin + 'plugin/0xAC/' + 'closeLeftWindy5-close.png',
        clickImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy5-heat.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy5-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy5-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy5-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'openLeftWindy5-cool.png',
        },
        angle: 100,
      },
    ],
    // 底部弹窗-上下风
    upDownWindBtn: [{
        img: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy1-close.png',
        kitchenCloseImg: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy1-close-kitchen.png',
        clickImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'openUdWindy1-heat.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'openUdWindy1-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'openUdWindy1-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'openUdWindy1-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'openUdWindy1-cool.png',
        },
        kitchenImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy1-close-kitchen-cool.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy1-close-kitchen-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy1-close-kitchen-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy1-close-kitchen-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy1-close-kitchen-cool.png',
        },
        angle: 1,
      },
      {
        img: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy2-close.png',
        kitchenCloseImg: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy2-close-kitchen.png',
        clickImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'openUdWindy2-heat.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'openUdWindy2-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'openUdWindy2-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'openUdWindy2-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'openUdWindy2-cool.png',
        },
        kitchenImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy2-close-kitchen-cool.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy2-close-kitchen-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy2-close-kitchen-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy2-close-kitchen-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy2-close-kitchen-cool.png',
        },
        angle: 25,
      },
      {
        img: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy3-close.png',
        kitchenCloseImg: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy3-close-kitchen.png',
        clickImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'openUdWindy3-heat.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'openUdWindy3-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'openUdWindy3-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'openUdWindy3-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'openUdWindy3-cool.png',
        },
        kitchenImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy3-close-kitchen-cool.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy3-close-kitchen-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy3-close-kitchen-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy3-close-kitchen-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy3-close-kitchen-cool.png',
        },
        angle: 50,
      },
      {
        img: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy4-close.png',
        kitchenCloseImg: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy4-close-kitchen.png',
        clickImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'openUdWindy4-heat.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'openUdWindy4-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'openUdWindy4-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'openUdWindy4-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'openUdWindy4-cool.png',
        },
        kitchenImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy4-close-kitchen-cool.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy4-close-kitchen-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy4-close-kitchen-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy4-close-kitchen-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy4-close-kitchen-cool.png',
        },
        angle: 75,
      },
      {
        img: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy5-close.png',
        kitchenCloseImg: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy5-close-kitchen.png',
        clickImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'openUdWindy5-heat.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'openUdWindy5-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'openUdWindy5-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'openUdWindy5-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'openUdWindy5-cool.png',
        },
        kitchenImg: {
          heat: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy5-close-kitchen-cool.png',
          cool: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy5-close-kitchen-cool.png',
          fan: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy5-close-kitchen-cool.png',
          dry: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy5-close-kitchen-cool.png',
          auto: imageDoamin + 'plugin/0xAC/' + 'closeUdWindy5-close-kitchen-cool.png',
        },
        angle: 100,
      },
    ],
    UpDownWindBlowingBtn: [
      // 底部弹窗-上下防直吹
      {
        img: Btns['UpDownWindBlowing'].normalImg.unselected,
        clickImg: {
          heat: Btns['UpDownWindBlowing'].normalImg.heat,
          cool: Btns['UpDownWindBlowing'].normalImg.cool,
          auto: Btns['UpDownWindBlowing'].normalImg.auto,
          dry: Btns['UpDownWindBlowing'].normalImg.dry,
          fan: Btns['UpDownWindBlowing'].normalImg.fan,
        },
        cellImg: imageDoamin + 'plugin/0xAC/' + 'un-wind-blowing.png',
        text: '上防直吹',
        selected: false,
        angle: 2,
        value: 2,
      },
      {
        img: Btns['UpDownWindBlowing'].normalImgUp.unselected,
        clickImg: {
          heat: Btns['UpDownWindBlowing'].normalImgUp.heat,
          cool: Btns['UpDownWindBlowing'].normalImgUp.cool,
          auto: Btns['UpDownWindBlowing'].normalImgUp.auto,
          dry: Btns['UpDownWindBlowing'].normalImgUp.dry,
          fan: Btns['UpDownWindBlowing'].normalImgUp.fan,
        },
        cellImg: imageDoamin + 'plugin/0xAC/' + 'down-wind-blowing.png',
        text: '下防直吹',
        selected: false,
        angle: 3,
        value: 3,
      },
    ],
    showUpDownWindBlowing: false,
    // 底部弹窗-上下环绕风
    udAroundWindBtn: [{
        img: Btns['UpDownAroundWind'].normalImg.unselected,
        clickImg: {
          heat: Btns['UpDownAroundWind'].normalImg.heat,
          cool: Btns['UpDownAroundWind'].normalImg.cool,
          auto: Btns['UpDownAroundWind'].normalImg.auto,
          dry: Btns['UpDownAroundWind'].normalImg.dry,
          fan: Btns['UpDownAroundWind'].normalImg.fan,
        },
        cellImg: imageDoamin + 'plugin/0xAC/' + 'up-round-wind.png',
        text: '上环绕风',
        selected: false,
        angle: 1,
      },
      {
        img: Btns['UpDownAroundWind'].normalImgUp.unselected,
        clickImg: {
          heat: Btns['UpDownAroundWind'].normalImgUp.heat,
          cool: Btns['UpDownAroundWind'].normalImgUp.cool,
          auto: Btns['UpDownAroundWind'].normalImgUp.auto,
          dry: Btns['UpDownAroundWind'].normalImgUp.dry,
          fan: Btns['UpDownAroundWind'].normalImgUp.fan,
        },
        cellImg: imageDoamin + 'plugin/0xAC/' + 'down-round-wind.png',
        text: '下环绕风',
        selected: false,
        angle: 2,
      },
    ],
    newSoundBtn: [{
      text: "当声音关闭时，仅在小程序控制空调时无声音",
      selected: false,
      desc: ""
    }, {
      text: "当声音关闭时，所有方式控制空调时无声音",
      selected: false,
      desc: "请注意，遥控器成功控制设备后无声音提醒，并非故障"
    }],
    northWarmModeArr:[
      {        
        cellImg: imageDoamin + 'plugin/0xAC/jiazhong/' + 'north-warm-cool@2x.png',
        text: '制冷',     
        val:1,
        key: "cool"
      },{        
        cellImg: imageDoamin + 'plugin/0xAC/jiazhong/' + 'north-warm-heat@2x.png',
        text: '制热',
        selected: false,
        val:2,
        key: "heat"
      },{        
        cellImg: imageDoamin + 'plugin/0xAC/jiazhong/' + 'north-warm-ai@2x.png',
        text: '智能',
        selected: false,
        val:3,
        key: "smart_mode"
      },
    ],
    leftRightSwipePopupBtn: [{
        img: Btns['LeftRightSwipeWindPopup'].normalImg.unselected,
        clickImg: {
          heat: Btns['LeftRightSwipeWindPopup'].normalImg.heat,
          cool: Btns['LeftRightSwipeWindPopup'].normalImg.cool,
          auto: Btns['LeftRightSwipeWindPopup'].normalImg.auto,
          dry: Btns['LeftRightSwipeWindPopup'].normalImg.dry,
          fan: Btns['LeftRightSwipeWindPopup'].normalImg.fan,
        },
        cellImg: imageDoamin + 'plugin/0xAC/' + 'up-round-wind.png',
        unselectIcon: imageDoamin + 'plugin/0xAC/' + 'left-airduct-swipe-unselect.png',
        selectIcon: imageDoamin + 'plugin/0xAC/' + 'left-airduct-swipe-select.png',
        text: '左风道',
        selected: false,
        angle: 1,
        modeBg:{
          auto: "left-right-swipe-item-select",
          cool: "left-right-swipe-item-select",
          fan: "left-right-swipe-item-select",
          dry: "left-right-swipe-item-select",
          heat: "left-right-swipe-item-select-heat",  
        }
      },
      {
        img: Btns['UpDownAroundWind'].normalImgUp.unselected,
        clickImg: {
          heat: Btns['UpDownAroundWind'].normalImgUp.heat,
          cool: Btns['UpDownAroundWind'].normalImgUp.cool,
          auto: Btns['UpDownAroundWind'].normalImgUp.auto,
          dry: Btns['UpDownAroundWind'].normalImgUp.dry,
          fan: Btns['UpDownAroundWind'].normalImgUp.fan,
        },
        cellImg: imageDoamin + 'plugin/0xAC/' + 'down-round-wind.png',
        unselectIcon: imageDoamin + 'plugin/0xAC/' + 'right-air-duct-swipe-unselect.png',
        selectIcon: imageDoamin + 'plugin/0xAC/' + 'right-airduct-swipe-select.png',
        text: '右风道',
        selected: false,
        angle: 2,
        modeBg:{
          auto: "left-right-swipe-item-select",
          cool: "left-right-swipe-item-select",
          fan: "left-right-swipe-item-select",
          dry: "left-right-swipe-item-select",
          heat: "left-right-swipe-item-select-heat",          
        }
      },
    ],
    upDownSwipePopupBtn: [{
        img: Btns['UpDownAroundWind'].normalImg.unselected,
        clickImg: {
          heat: Btns['UpDownAroundWind'].normalImg.heat,
          cool: Btns['UpDownAroundWind'].normalImg.cool,
          auto: Btns['UpDownAroundWind'].normalImg.auto,
          dry: Btns['UpDownAroundWind'].normalImg.dry,
          fan: Btns['UpDownAroundWind'].normalImg.fan,
        },
        cellImg: imageDoamin + 'plugin/0xAC/' + 'up-round-wind.png',
        text: '左风道上下摆风',
        selected: false,
        angle: 1,
      },
      {
        img: Btns['UpDownAroundWind'].normalImgUp.unselected,
        clickImg: {
          heat: Btns['UpDownAroundWind'].normalImgUp.heat,
          cool: Btns['UpDownAroundWind'].normalImgUp.cool,
          auto: Btns['UpDownAroundWind'].normalImgUp.auto,
          dry: Btns['UpDownAroundWind'].normalImgUp.dry,
          fan: Btns['UpDownAroundWind'].normalImgUp.fan,
        },
        cellImg: imageDoamin + 'plugin/0xAC/' + 'down-round-wind.png',
        text: '右风道上下摆风 ',
        selected: false,
        angle: 2,
      },
    ],
    UpWindBlowingBtn: [
      // 底部弹窗-上防直吹
      {              
        text: '适用于较小空间开启',
        detail: '避免冷风回弹吹人，建议空调所在墙壁到对面墙壁的距离小于4米选择',
        selected: false,     
        type: 0,   
      },
      {
        text: '适用于较大空间开启',
        detail: '避免冷风回弹吹人，建议空调所在墙壁到对面墙壁的距离大于4米选择',
        selected: false,     
        type: 1, 
      },
    ],
    sliders: {
      //风速
      img: {
        offImg: imageDoamin + 'plugin/0xAC/' + 'shotDowm-speed.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'open-speed.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'open-speed.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'open-speed.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'open-speed.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'open-speed.png',
      },
      sliderColor: {
        offColor: '#9ca3b2',
        heat: '#ee8225',
        auto: '#267aff',
        cool: '#267aff',
        dry: '#267aff',
        fan: '#267aff',
        smart_mode: "#267aff"
      },
      offImg: imageDoamin + 'plugin/0xAC/' + 'shotDowm-speed.png',
      openImg: imageDoamin + 'plugin/0xAC/' + 'open-speed.png',
      sliderValue: -20,
      sliderNum: ['1', '20', '40', '60', '80', '100'],
      kitchenSliderNum: ['自动', '低', '中', '高', '强'],
      sliderText: '自动',
    },
    showModePopup: false, //展示底部模式
    showLeftPopup: false, //展示底部左右风
    showUpDownPopup: false, //展示底部上下风
    SwitchLeftChecked: false, //是否开启左右风    
    showUdRoundWindPopup: false,
    showUpLrDwonLrPopup: false, //展示底部上左右风向、下左右风向
    showNorthWarmPopup: false, //展示北方采暖的模式选择弹窗
    showTargetTempSwitchPop: false, //展示北方采暖开关提示弹窗
    showLeftRightSwipePopup: false, // 展示左右风道的左右摆风
    showUpDownSwipePopup: false,
    showUpDownAngleLrPopup: false,
    showLeftRightAngleLrPopup: false,
    showUpWindBlowingPopup: false,
    showCircleFanPopup: false,
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
    modeMap: [{
        text: '自动',
        key: 'auto',
        id: 1,
      },
      {
        text: '制冷',
        key: 'cool',
        id: 2,
      },
      {
        text: '抽湿',
        key: 'dry',
        id: 3,
      },
      {
        text: '制热',
        key: 'heat',
        id: 4,
      },
      {
        text: '送风',
        key: 'fan',
        id: 5,
      },      
      {
        text: '舒适抽湿',
        key: 'dry',
        id: 6,
      },
      {
        text: '智能',
        key: 'smart_mode',
        id: 7,
      }
    ],
    validDevices: [],
    nearbyDevices: {},
    curDevice: {},
    prevPage: '',
    ctrlType: 1, // 1蓝牙 2远程,
    system: 'android',
    hasFuncObj: {},
    safeModeAuthStatus: false, // 安全模式权限，为true代表用户有权进行蓝牙连接
    safeModeSwStatus: false, // 密码锁开关状态，为true代表密码锁功能开启
    safeModeFlag: false,
    showPswSet: false,
    password: '',
    overTimer: 0,
    connectedDevice: {},
    hasJumpPage: false,
    hasFound: false, // 标记是否已找到设备,
    sleepCurve: [26, 27, 28, 28, 28, 28, 28, 28],
    deviceSn8: '',
    connectSuccess: false,
    hasPoint5: true,
    has16: true,
    columns: [1, 2, 3],
    timerOffVal: [0],
    timerSetVal: 0,
    isCoolFree: false, // 标记是否酷风,
    isTH: false, // 标记th类型
    hasAuto: false, // 标记模式是否带自动 TH不带自动模式
    sliderText: '自动',
    kitStatus: {
      prepare_food: false,
      quick_fry: false,
    },
    kitchenList: [{
        key: 'prepare_food',
        name: '备菜',
        info: '24°C 自动风 记忆摆风状态',
        status: false,
      },
      {
        key: 'quick_fry',
        name: '爆炒',
        info: '18°C强劲风',
        status: false,
      }
    ],
    showQuickFryWindPop: false,
    prepareFood: false,
    prepareFoodTemp: 26,
    prepareFoodFanSpeed: 102,
    quickFry: 0,
    quickFryAngle: 15,
    quickFryCenterPoint: 100,
    quickFryFanSpeed: 102,
    quickFryTemp: 50,
    quickFryValue: 100,
    showDryNewNamePop: false,
    isSelectDryTip: false,
    localHideDryTips: false,
    dustFullTime: false,
    isKitchenFG100: false,
    isKitchenXD200: false,
    isKitchen: false,
    isNorthWarm: false,
    hasAutoPrentColdWindMenory: false, // 支持主动防冷风记忆
    showTargetTemp: false, // 北方采暖器，目标室温
    targetTempMark: ['16°C', '30°C'],
    northWarmTargetTempText:"",    

    timerColumns: [], // 定时picker的数组
    openTimerPicker: false, // 定时picker的展示,
    showSelfCleanConfirmPopup: false,
    SoundSwitch: true,

    SelfCleanContent: [{
        title: "自动关机",
        content: "智清洁运行中，空调其他功能将无法使用，空调设备上显示\"CL\"字样; 清洁完成后，会自动关机;"
      },
      {
        title: "持续时间",
        content: "智清洁开启后，运行时间约为20-130分钟；清晰过程中调节空调其他功能，将会中断智清洁的运行影响清洁效果；"
      },
      {
        title: "远离出风口",
        content: "智清洁运行中，会有冷风/热风吹出，建议远离出风口；"
      },
      {
        title: "异响现象",
        content: "智清洁运行中，室内机可能会发出异响，此为正常现象"
      }
    ],
  
    TempSetTipsContent: [{
        title: "方案一、手动水温+目标室温开：",
        content: ["a.设置目标室温后，用户需要根据所设置的室温来自主调节合适的水温。","b.水温未达到但室温超温时，机组会停机节能；","c.水温因超温停机，但室温未达到且舒适度未满足时，用户需手动调高水温。"]
      },
      {
        title: "方案二、手动水温+目标室温关：",
        content: ["a.用户自主设置水温，机组根据设定水温稳定运行。"]
      },
      {
        title: "方案三、自动水温+目标室温开：",
        content: ["a.设置目标室温后，机组根据室内温度变化自动调节水温稳定运行。"]
      },
      {
        title: "方案四、自动水温+目标室温关：",
        content: ["a.用户不用设置室温，机组根据室外环境温度变化自动调节水温稳定运行。"]
      }
    ],
    showHeaderbg: true,
    showFreshAirPop: false,
    showKeepWetPopup: false,
    showPurify: false,
    showTempSetTips: false,
    showSoundPop: false,
    circleFanItem: [{
        title: '关',        
        selected: true,
        param: {          
          circle_fan: 'off',
          circle_fan_mode: 1,
        }
      },
      {
        title: '1档\n循环扇',       
        selected: false,
        param: {
          circle_fan: 'on',
          circle_fan_mode: 1,
        }
      },
      {
        title: '2档\n微微凉',       
        selected: false,
        param: {
          circle_fan: 'on',
          circle_fan_mode: 2,
        }
      },
      {
        title: '3档\n微凉',       
        selected: false,
        param: {
          circle_fan: 'on',
          circle_fan_mode: 3,
        }
      },
      {
        title: '4档\n清凉',       
        selected: false,
        param: {
          circle_fan: 'on',
          circle_fan_mode: 4,
        }
      },
      {
        title: '5档\n劲凉',       
        selected: false,
        param: {
          circle_fan: 'on',
          circle_fan_mode: 5,
        }
      }
    ],  
    freshAirItem: [{
        title: '关',
        t5Title: '关',
        selected: true,
        param: {
          power: 0,
          fresh_air: 'off',
          fresh_air_fan_speed: 40,
        }
      },
      {
        title: '低',
        t5Title: '1档',
        selected: false,
        param: {
          power: 1,
          fresh_air: 'on',
          fresh_air_fan_speed: 40,
        }
      },
      {
        title: '中',
        t5Title: '2档',
        selected: false,
        param: {
          power: 1,
          fresh_air: 'on',
          fresh_air_fan_speed: 60,
        }
      },
      {
        title: '高',
        t5Title: '3档',
        selected: false,
        param: {
          power: 1,
          fresh_air: 'on',
          fresh_air_fan_speed: 80,
        }
      },
      {
        title: '强劲',
        t5Title: '4档',
        selected: false,
        param: {
          power: 1,
          fresh_air: 'on',
          fresh_air_fan_speed: 100,
        }
      }
    ],
    purifyItem: [{
      title: '关',
      t5Title: '关',
      selected: true,
      param: {
        power: 0,
        inner_purifier: 'off',
        inner_purifier_fan_speed: 40,
      }
    },
    {
      title: '低',
      t5Title: '1档',
      selected: false,
      param: {
        power: 1,
        inner_purifier: 'on',
        inner_purifier_fan_speed: 40,
      }
    },
    {
      title: '中',
      t5Title: '2档',
      selected: false,
      param: {
        power: 1,
        inner_purifier: 'on',
        inner_purifier_fan_speed: 60,
      }
    },
    {
      title: '高',
      t5Title: '3档',
      selected: false,
      param: {
        power: 1,
        inner_purifier: 'on',
        inner_purifier_fan_speed: 80,
      }
    },
    {
      title: '强劲',
      t5Title: '4档',
      selected: false,
      param: {
        power: 1,
        inner_purifier: 'on',
        inner_purifier_fan_speed: 100,
      }
    }
    ],
    moisturizingItem: [{
      title: '关',
      t5Title: '关',
      selected: true,
      param: {
        power: 0,
        moisturizing: 0,
        moisturizing_fan_speed: 40,
      }
    },
    {
      title: '低',
      t5Title: '1档',
      selected: false,
      param: {
        power: 1,
        moisturizing: 1,
        moisturizing_fan_speed: 40,
      }
    },
    {
      title: '中',
      t5Title: '2档',
      selected: false,
      param: {
        power: 1,
        moisturizing: 1,
        moisturizing_fan_speed: 60,
      }
    },
    {
      title: '高',
      t5Title: '3档',
      selected: false,
      param: {
        power: 1,
        moisturizing: 1,
        moisturizing_fan_speed: 80,
      }
    },
    {
      title: '强劲',
      t5Title: '4档',
      selected: false,
      param: {
        power: 1,
        moisturizing: 1,
        moisturizing_fan_speed: 100,
      }
    }
    ],
    
    
    
    isWideWind: false, // 标记宽风口机型



    // 加载页
    title: '加载页 loading-page',
    loading: false,
    // 自定义提示内容
    loadingText: '加载中',
    // 自定义图片
    image: '',
    // 自定义加载动画模式
    loadingMode: '',
    // 自定义背景色
    bgColor: '#ffffff',


    acBtnDisabled: {
      WindSpeed: {
        disabled: false
      },
      ModeWithNoAuto: {
        disabled: false
      },
      ModeControl: {
        disabled: false
      },
      DeviceSwitch: {
        disabled: false
      },
      RefrigerantCheck: {
        disabled: false
      },
      HotMode: {
        disabled: false
      },
      DryMode: {
        disabled: false
      },
      UpDownSwipeWind: {
        disabled: false
      },
      LeftRightSwipeWind: {
        disabled: false
      },
      ECO: {
        disabled: false
      },
      WindBlowing: {
        disabled: false
      },
      SelfCleaning: {
        disabled: false
      },
      Quietness: {
        disabled: false
      },
      DeviceSwitchAppointment: {
        disabled: false
      },
      ElectricHeat: {
        disabled: false
      },
      CSEco: {
        disabled: false
      },
      AutoMode: {
        disabled: false
      },
      WindMode: {
        disabled: false
      },
      UpDownWindAngle: {
        disabled: false
      },
      LeftRightWindAngle: {
        disabled: false
      },
      Dry: {
        disabled: false
      },
      Show: {
        disabled: false
      },
      Supercooling: {
        disabled: false
      },
      Voice: {
        disabled: false
      },
      Sound: {
        disabled: false
      },
      FreshAir: {
        disabled: false
      },
      UpDownAroundWind: {
        disabled: false
      },
      DryNewName: {
        disabled: false
      },
      DryNewNameKitchen: {
        disabled: false
      },
      FilterClean: {
        disabled: false
      },
      Show: {
        disabled: false
      },
      Supercooling: {
        disabled: false
      },
      Voice: {
        disabled: false
      },
      Sound: {
        disabled: false
      },
      NoWindFeel: {
        disabled: false
      },
      FaNoWindFeel: {
        disabled: false
      },
      SleepCurve: {
        disabled: false
      },
      UpNoWindFeel: {
        disabled: false
      },
      DownNoWindFeel: {
        disabled: false
      },
      UpDownWindBlowing: {
        disabled: false
      },
      softWindFeel: {
        disabled: false
      },
      Degerming: {
        disabled: false
      },
      AroundWind: {
        disabled: false
      },
      ThNowindFeel: {
        disabled: false
      },
      DryNewNameKitchen: {
        disabled: false
      },
      CoolPowerSaving: {
        disabled: false
      },
      ThSoftWindFeel: {
        disabled: false
      },
      TargetIndoorTemp: {
        disabled: false
      },
      QuickCoolHeat: {
        disabled: false
      },
      ThUpNoWindFeel: {
        disabled: false
      },
      ThDownNoWindFeel: {
        disabled: false
      } 
    },
    quickSwipeMark: ['最下', '最上'],
    coldTipsNotShow: false,

    dryContent: [{
        title: "内机防霉功能可吹出内部的湿冷空气，以防霉菌滋生"
      },
      {
        title: "仅支持在制冷、抽湿模式下开启和运行"
      },
      {
        title: "开启后，将在每次空调关机后运行，约十分钟完成工作，并自动关机"
      }
    ],

    coldPreventWindContent: [{
        title: "开启后，雷达检测到人体进入识别区域内，空调将主动开启无风感，防止冷风直吹"
      },
      {
        title: "雷达只能检测移动的目标，可能会出现误判和检测不到人的情况:"
      }
    ],

    placeholder: '../assets/t0ac/img_no_shebei@2x.png',
    showVacation: false,
    synchronizeAngle: "", // 分左风道右风道时，需要使用这个角度来决定显示那个椒图的图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // this.BluetoothConn = await require.async('../../../distribution-network/addDevice/pages/wahinProtocol/bluetooth/bluetooth-conn.js') //分包异步加载


    console.log('onload=========', options)
    this.openLoadingPage();
    let that = this
    console.log(app.globalData.userData, 'userData======================')
    // //暂时【
    if (options && options.templateId && options.templateId == templateIds[20][0]) {
      this.setData({
        showCleanPopup: true
      });
    }
    let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))
    this.setData({
      deviceInfo
    })
    console.log('大家啊房间看见', this.data.deviceInfo.sn, key)
    app.globalData.currentSn = cloudDecrypt(this.data.deviceInfo.sn, app.globalData.userData.key, appKey);
    console.log('看看 hahahha', cloudDecrypt(this.data.deviceInfo.sn, app.globalData.userData.key, appKey));
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.system, '<<<<<<<<<')
        if (res.system.toLowerCase().indexOf('ios') >= 0) {
          that.setData({
            system: 'ios',
          })
        }
      },
    })
    console.log('options', options)
    if (options.collect) {
      // wx.relaunch({
      //     url: '/pages/index/index',
      // })
      wx.navigateBack({
        delta: 1,
      })
    }
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],
    })
    this.setData({
      event: new Event(),
    })
    if (options.backTo) {
      this.getUrlparams(options)
      console.log('this.getUrlparams(options)')
    } else {
      var pages = getCurrentPages()
      if (pages) {
        // var curPages = pages[pages.length - 1].route
        var prevPage = pages[pages.length - 2].route
        // this.getUrlparams(options)
        this.getDeviceInfo(options)
        this.generateFuncs(this.data.deviceInfo.sn8)
      } else {
        this.getUrlparams(options)

        console.log('else')
      }
    }
    this.generateAppointmentOffPicker();
    // this.getWindFeelDomWidth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},


  onPageScroll: function () {
    console.log("scroll");
    // Do something when page scroll
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages = getCurrentPages();
    // 数组中索引最大的页面--当前页面
    let currentPage = pages[pages.length - 1];
    if (!this.data.deviceInfo) {
      this.getDeviceInfo(currentPage.options);
    }
    console.log(this.data.deviceInfo, '/////// onshow /////////', currentPage.options)
    app.addDeviceInfo.mode = ''
    this.wahinLogin() //华凌登录
    let openId6 = wx.getStorageSync('openId6')
    // console.log('看看 openid6', openId6, cloudDecrypt(this.data.deviceInfo.sn, app.globalData.userData.key, appKey))    
    this.setTitle()
    this.checkNetwork()

    let that = this
    if (this.data.deviceInfo.sn8) {
      // 直连配网完成后this.data.deviceInfo.sn8是undefined的，所以加此判断，如果有值就使用deviceInfo.sn8，否则使用从sn中解析出来的值
      this.generateFuncs(this.data.deviceInfo.sn8)
      let sn3 = this.data.deviceInfo.sn8.slice(0, 3);
      this.setData({
        onDeviceImg: `${imageDoamin}plugin/0xAC/default${sn3}-on.png`,
        offDeviceImg: `${imageDoamin}plugin/0xAC/default${sn3}-off.png`,
        sn3: sn3
      })
    } else {
      let sn = cloudDecrypt(this.data.deviceInfo.sn, app.globalData.userData.key, appKey)
      let sn8 = sn.slice(9, 17)
      this.generateFuncs(sn8)
    }

    this.setData({
      fromApp: false,
      openId6: openId6,
    })
    this.judgeCtrlType(() => {
      // 判断进入什么控制，蓝牙还是WiFi
      this.controlLogic()
      setTimeout(() => {
        if (this.data.DeviceComDecorator) {
          if (this.data.ctrlType == 1) {
            this.queryManager();
            this.getSafeModeInfo().then((data) => {
              console.log(data, "=============");
              this.setData({
                safeModeFlag: data
              })
            })
          }
        }
      }, 200);
      var pages = getCurrentPages()
      console.log('pages----', pages[0].route, this.data.ctrlType, pages)
      this.setData({
        prevPage: pages[0].route,
      })
      // src/modules/module_plugin/T0xAC/index/index

      // ((this.data.ctrlType == 1 && pages[0].route == 'plugin/T0xAC/index/index' && !this.data
      //     .hasJumpPage) || (this.data.ctrlType == 1 && pages[0].route == 'pages/index/index' && !this.data
      //     .hasJumpPage)
      if ((this.data.ctrlType == 1 && pages[0].route == 'src/modules/module_plugin/T0xAC/index/index' && !this.data
      .hasJumpPage) || (this.data.ctrlType == 1 && pages[0].route == 'pages/index/index' && !this.data
      .hasJumpPage) || (this.data.ctrlType == 1 && pages[0].route == 'plugin/T0xAC/index/index' && !this.data
      .hasJumpPage)) {
        console.log('onshow走蓝牙')
        that.setData({
          hasJumpPage: true,
        })
        setTimeout(() => {
          Promise.all([this.getSafeModeAuth(), this.getSafeModeInfo()]).then((res) => {
            console.log('promise里面安全模式权限和安全模式设置', res)
            that.setData({
              safeModeAuthStatus: res[0],
              safeModeSwStatus: res[1],
              safeModeFlag: res[1],
            })
            if (!that.data.safeModeSwStatus) {
              // 安全模式没开
              console.log('安全模式没开，直接连接===')
              this.openBluetoothAdapter()
            } else {
              // 安全模式已开
              if (that.data.safeModeAuthStatus) {
                // 输入过密码，有权限，可以连接
                console.log('输入过密码，有权限，可以连接===')
                this.openBluetoothAdapter()
              } else {
                console.log('安全模式打开，没有权限，需要输入密码===')
                that.setData({
                  showPswSet: true,
                })
              }
            }
          })
        }, 1000);


        // console.log()
        // this.initDeviceCom(app.bluetoothConn, () => {
        //   this.query()
        //   app.bluetoothConn.event.on('disconnect', () => {
        //     app.bluetoothConn.closeBLEConnection(() => {

        //     })
        //   })
        // })
        if (app.bluetoothConn) {
          app.bluetoothConn.event.on('receiveMessagePlugin', (data) => {
            console.log(Common.ab2hex(data), '>>>>>>>>>>>>>>>>接收到模组消息1')
            that.data.event.dispatch('updateStatus', {
              data: data,
            })

            if (Common.ab2hex(data).slice(0, 12) == '303030303030') {
              let snAsiiArr = Common.fromHexString(Common.ab2hex(data))
              let sn = Common.asiiCode2Str(snAsiiArr)
              app.globalData.deviceSn = sn
              that.setData({
                deviceSnBle: sn,
              })
            }
            that.unpackManager(data);
            // that.data.DeviceComDecorator.AcProcess.parseAcceptPackage(data)
            console.log(
              that.data.DeviceComDecorator.AcProcess.parser.newsendingState,
              'that.data.DeviceComDecorator.AcProcess.parser.newsendingState',
              that.data.DeviceComDecorator.AcProcess.parser.sendingState
            )

            that.updateAcStatus(
              that.data.DeviceComDecorator.AcProcess.parser.sendingState,
              that.data.DeviceComDecorator.AcProcess.parser.newsendingState
            )

            // that.checkSoundSwitch();
          })
        }
        wx.onAppHide((res) => {
          console.log('监听apphide onshow里的', res)
          let pages = getCurrentPages()
          let length = pages.length
          console.log(pages[length - 1].route)

          // app.bluetoothConn.closeBLEConnection(() => {
          //     wx.navigateBack({
          //         delta: 5,
          //     });
          // });
        })
      } else if (this.data.ctrlType == 2 || this.data.deviceInfo.onlineStatus == '1') {
        this.initDeviceCom(app.bluetoothConn, () => {
          this.queryManager()
          this.getSafeModeInfo().then((data) => {
            console.log(data, "=============");
            this.setData({
              safeModeFlag: data
            })
          })
        })
        let str =
          'aa32ac00000000000803bb2800ffff11018000000002526632000000003200012800000004523266000400000000000093c217'

        // Helper.fromHexString(str)
        let decimalArr = Common.fromHexString(str);
        let hexArr = Helper.decimalArrayToHexArray(decimalArr)
        // console.log('走WiFi', this.data.ctrlType, this.data.deviceInfo.onlineStatus, Common.fromHexString(str),hexArr);

        // this.data.DeviceComDecorator.AcProcess.parseCoolFreeAcceptPackage(hexArr);
        // console.log('wifi----------000----:', this.data)
        app.globalData.DeviceComDecorator.event.on(
          'receiveMessageLan',
          (data) => {
            console.log('wifi 回来的数据首页->>>', data)
            that.refreshSendingStateStatus();
          },
          'index'
        )
      }
      if (that.data.deviceInfoSn) {
        // this.getSleepCurve(); // 睡眠曲线功能下架，不再请求
      }
    })    

  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(this.data.overTimer)
    // app.bluetoothConn.closeBLEConnection();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.data.overTimer)
    if (app.addDeviceInfo.mode == '21') {
      // 判断mode是21，就不断开连接，给配网重试使用
      return
    }
    if (this.data.ctrlType == 1) {
      console.log('遥控器页面关闭，断开蓝牙连接')
      wx.closeBluetoothAdapter({})
      if (app.bluetoothConn || this.data.connectSuccess) {
        app.bluetoothConn.closeBLEConnection()
        try {
          if (app?.globalData?.DeviceComDecorator?.event) {
            app.globalData.DeviceComDecorator.event.off('receiveMessageLan', (data) => {})
            app.globalData.DeviceComDecorator.event.off('disconnect', (data) => {})
            app.globalData.DeviceComDecorator.event.off('fail', (data) => {})
            app.globalData.DeviceComDecorator.event.off('receiveMessagePlugin', (data) => {})
          }
        } catch (error) {
          
        }
        
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  close() {
    this.setData({
      showCleanPopup: false
    })
  },
  goToMiniPrograme() {
    let appId = 'wx255b67a1403adbc2'
    let path = 'page/web_view_promote/web_view_promote?id=4646'
    let extra = {}
    judgeWayToMiniProgram(appId, path, extra)
    this.close()
  },
  getModeText(key) {
    if(this.data.acstatus.smartDryFunc) {
      return "舒适抽湿"
    } else if(this.data.acstatus.manualDryFunc) {
      return "个性抽湿"
    } else {
      return this.data.modeMap.filter((i) => i.key == key)[0].text
    }      
    
  },
  getStartupObject(mode, runStatus) {
    if (this.data.useLocalImg) {
      return this.data.startupImg
    }
    if (runStatus == 1) {
      return this.data.btnMapByMode.on.filter((i) => i.id == mode)[0].img
    } else {
      return this.data.btnMapByMode.off.filter((i) => i.id == mode)[0].img
    }
  },
  moreFun() {
    let that = this
    let currDeviceInfo = JSON.stringify(this.data.deviceInfo)
    // console.log('mmmmmmmm++++++++++===',currDeviceInfo)
    // wx.navigateTo({
    //   url: '../electric/electric',
    // })

    if (!this.data.connectSuccess && this.data.hasFuncObj.home.noneControlFunc.hasBleControl && this.data.deviceInfo
      .onlineStatus != 1) {
      wx.showToast({
        title: '蓝牙连接未成功，请返回列表页重新连接进入',
        icon: 'none',
      })
      return
    }

    // if (this.data.acstatus.runStatus == 0) {
    //   wx.showToast({
    //     title: '空调已关，请先开空调',
    //     icon: 'none',
    //   })
    //   return
    // }
    const url = this.data.isKitchen ? '../moreFun/moreFun?deviceInfo=' + encodeURIComponent(currDeviceInfo) +
      '&isKitchen=1' : '../moreFun/moreFun?deviceInfo=' + encodeURIComponent(currDeviceInfo)

    wx.navigateTo({
      url,
      events: {
        acceptDataFromCtlPanel: function (data) {
          console.log(data)
        },
      },
      success: function (res) {
        console.log('进入moreFun前', that.data.connectedDevice)
        res.eventChannel.emit('acceptDataFromCtlPanel', {
          data: that.data.modalBtn,
          allBtn: that.data.allBtn,
          deviceInfo: that.data.deviceInfo,
          DeviceComDecorator: that.data.DeviceComDecorator,
          ctrlType: that.data.ctrlType,
          event: that.data.event,
          deviceSnBle: that.data.deviceInfoSn,
          connectedDevice: that.data.connectedDevice,
          isCoolFree: that.data.isCoolFree,
          isTH: that.data.isTH,
          hasAuto: that.data.hasAuto,
        })
      },
    })
  },
  modeSelectConfirm() {
    this.hidePopup();
  },
  // 底部弹窗事件--模式
  bottomModeBtn(e) {
    console.log(e)
    let mode = null
    if (e.currentTarget.dataset.item.id === 'cool') {
      mode = 'cool'
      console.log('in')
    } else if (e.currentTarget.dataset.item.id === 'auto') {
      mode = 'auto'
    } else if (e.currentTarget.dataset.item.id === 'heat') {
      mode = 'heat'
    } else if (e.currentTarget.dataset.item.id === 'fan') {
      mode = 'fan'
    } else if (e.currentTarget.dataset.item.id === 'dry') {
      mode = 'dry'
    }
    // 此部分为普通空调逻辑
    this.setData({
      modePopupMode: mode
    })

    if (mode != 'cool') {
      // 非制冷模式下，要对新协议的防直吹、无风感进行假关
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 1
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0
      // 非制冷模式下，关闭智控温
      // this.data.acNewStatus.superCoolingSw = 0
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
    }
    let modeIndex = this.data.modeMap.filter((i) => i.key == mode)[0].id
    console.log('this.data.applianceStatus', this.data.applianceStatus)



    // 先不发码
    if (mode != this.data.acStatus.mode) {
      if (this.data.isCoolFree) {
        this.data.DeviceComDecorator.coolFreeControlModeToggle(modeIndex, this.data.acstatus, '', '')
      } else {
        this.data.DeviceComDecorator.controlModeToggle(modeIndex, this.data.acstatus, '', '')
        this.data.DeviceComDecorator.AcProcess.parser.newsendingState.leftRightAngle = 0 // 调模式摆风角度置0
        this.data.DeviceComDecorator.AcProcess.parser.newsendingState.upDownAngle = 0 // 调模式摆风角度置0
        this.data.DeviceComDecorator.AcProcess.parser.newsendingState.udAroundWindSwitch = 0 // 环绕风关闭
      }
    }
  },  
  // 底部弹窗事件--左右风
  bottomLeftWind(e) {
    console.log(e)
    let angle = e.currentTarget.dataset.item.angle
    // status.leftLeftRightWind
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftLeftRightWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.rightLeftRightWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.downWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.udAroundWindSwitch = 0 // 环绕风关闭
    this.setData({
      // UpDownSwipeWind: this.data.acstatus.windUpDown == 1,
      'acSwStatus.LeftRightSwipeWind': false,
    })
    this.data.DeviceComDecorator.windSwingLrAngle(
      angle,
      'click_lr_angle',
      this.data.page_path,
      this.data.acNewStatus,
      () => {}
    )
  },
  // 左风道左右出风方向
  leftBottomLeftWind(e) {
    console.log(e)
    let angle = e.currentTarget.dataset.item.angle
    // status.leftLeftRightWind
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftLeftRightWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.rightLeftRightWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.downWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.udAroundWindSwitch = 0 // 环绕风关闭
    this.setData({
      // UpDownSwipeWind: this.data.acstatus.windUpDown == 1,
      'acSwStatus.LeftRightSwipeWind': false,
    })
    this.data.DeviceComDecorator.leftWindSwingLrAngle(
      angle,
      'click_lr_angle',
      this.data.page_path,
      this.data.acNewStatus,
      () => {}
    )
  },
  // 右风道左右出风方向
  rightBottomLeftWind(e) {
    console.log(e)
    let angle = e.currentTarget.dataset.item.angle
    // status.leftLeftRightWind
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftLeftRightWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.rightLeftRightWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.downWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.udAroundWindSwitch = 0 // 环绕风关闭
    this.setData({
      // UpDownSwipeWind: this.data.acstatus.windUpDown == 1,
      'acSwStatus.LeftRightSwipeWind': false,
    })
    this.data.DeviceComDecorator.rightWindSwingLrAngle(
      angle,
      'click_lr_angle',
      this.data.page_path,
      this.data.acNewStatus,
      () => {}
    )
  },
  downBottomLeftWind(e) {
    console.log(e)
    let angle = e.currentTarget.dataset.item.angle
    // status.leftLeftRightWind
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftLeftRightWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.rightLeftRightWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.downWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.udAroundWindSwitch = 0 // 环绕风关闭
    this.setData({
      // UpDownSwipeWind: this.data.acstatus.windUpDown == 1,
      'acSwStatus.LeftRightSwipeWind': false,
    })
    this.data.DeviceComDecorator.downWindSwingLrAngle(
      angle,
      'click_lr_angle',
      this.data.page_path,
      this.data.acNewStatus,
      () => {
        // windUpDown: 0,
        // windLeftRight: 0,
        // this.data.DeviceComDecorator._queryStatus();
      }
    )
  },
  // 底部弹窗事件--上下风
  bottomUpdownWind(e) {
    console.log(e)
    let angle = e.currentTarget.dataset.item.angle
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftUpDownWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.rightUpDownWind = 0
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.udAroundWindSwitch = 0
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 1 // 防直吹假关

    this.setData({
      'acSwStatus.UpDownSwipeWind': false,
    })
    this.data.DeviceComDecorator.windSwingUdAngle(angle, 'click_ud_angle', this.data.page_path, this.data
      .acNewStatus)
  },
  // 左右风 switch控制按钮
  onChangeLeftRight(e) {
    console.log('左右风开关点击', e.detail)
    this.data.btnObj.LeftRightWindAngle.switchBtnFunc(e.detail)
  },
  onChangeUpDown(e) {
    console.log('上下风开关点击', e.detail)
    this.data.btnObj.UpDownWindAngle.switchBtnFunc(e.detail)
  },
  // 底部弹窗事件--上下环绕风
  bottomUdAround(e) {
    console.log(e)
    let angle = e.currentTarget.dataset.item.angle
    console.log(angle)
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 1
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.upDownAngle = 0 // 开上下风按钮，摆风角度置0
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftUpDownWind = 0 // 环绕风和上下风互斥，上下风置0
    this.data.DeviceComDecorator.aroundWindSwitch(true, angle, 'click_ud_around_wind', this.data.page_path)
  },
  // 底部弹窗事件--双风道左右风
  bottomLeftRightLrWind(e) {
    console.log(e)
    let angle = e.currentTarget.dataset.item.angle
    if (angle == 1) { // 左
      let flag = e.currentTarget.dataset.item.selected ? false : true;
      this.data.DeviceComDecorator.leftRightSwipeLrSwitch(flag, this.data.leftRightSwipePopupBtn[1].selected, 'left',this.data.acstatus)
    } else if(angle == 2) {
      let flag = e.currentTarget.dataset.item.selected ? false : true;
      this.data.DeviceComDecorator.leftRightSwipeLrSwitch(this.data.leftRightSwipePopupBtn[0].selected,flag, 'right',this.data.acstatus)
    }
  },
  // 底部弹窗时间--双风道上下风
  bottomUpDownLrWind(e) {
    console.log(e)
    let angle = e.currentTarget.dataset.item.angle
    if (angle == 1) { // 左
      let flag = e.currentTarget.dataset.item.selected ? false : true;
      this.data.DeviceComDecorator.leftRightUpDownSwipeLrSwitch(flag, this.data.upDownSwipePopupBtn[1].selected, this.data.acstatus)
    } else if(angle == 2) {
      let flag = e.currentTarget.dataset.item.selected ? false : true;
      this.data.DeviceComDecorator.leftRightUpDownSwipeLrSwitch(this.data.upDownSwipePopupBtn[0].selected, flag,this.data.acstatus)
    }
  },
  bottomUpDirect(e) {
    console.log(e);
    let type = e.currentTarget.dataset.item.type;
  
    this.data.DeviceComDecorator.switchUpWindBlowingDistance(e.detail ,type);
  },
  onChangeUpDownAround(e) {
    console.log(e.detail)
    this.data.btnObj.UpDownAroundWind.switchBtnFunc()
  },
  onChangeLrSwipeWindPopup() {
    if (this.data.acSwStatus.LeftRightSwipeWindPopup) {
      this.data.DeviceComDecorator.leftRightSwipeLrSwitch(false,false,'', this.data.acstatus)  
    } else {
      this.data.DeviceComDecorator.leftRightSwipeLrSwitch(true,true, '',this.data.acstatus)  
    }
  },
  onChangeUdSwipeWindPopup() {
    if (this.data.acSwStatus.UpDownSwipeWindPopup) {
      this.data.DeviceComDecorator.leftRightUpDownSwipeLrSwitch(false,false, this.data.acstatus)  
    } else {
      this.data.DeviceComDecorator.leftRightUpDownSwipeLrSwitch(true,true, this.data.acstatus)  
    }
  },
  // 温度加
  addTemp(e) {
    if (this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none',
      })
    } else {
      if (this.data.acStatus.mode == 'fan') {
        wx.showToast({
          title: '送风模式下不可调节温度',
          icon: 'none',
        })
        return
      }
      var temp = parseFloat(e.currentTarget.dataset.temp)
      console.log(temp)
      let precision = this.data.hasPoint5 ? 0.5 : 1
      temp = temp + precision
      temp = temp.toFixed(1)
      var temperature = this.calculateTemp(temp)._is
      var small_temperature = this.calculateTemp(temp)._is5
      if (temp > 30) {
        wx.showToast({
          title: '已经是最大温度',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0 // 调温退出智控温
      this.data.DeviceComDecorator.controlTemp(temperature + small_temperature, this.data.acstatus, () => {
        // this.setData({
        //     applianceStatus: res.status
        // })
        // this.computeButtons();
      })
    }
  },
  // 温度减
  minusTemp(e) {
    if (this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none',
      })
    } else {
      if (this.data.acStatus.mode == 'fan') {
        wx.showToast({
          title: '送风模式下不可调节温度',
          icon: 'none',
        })
        return
      }
      var temp = parseFloat(e.currentTarget.dataset.temp)
      console.log(temp)
      let precision = this.data.hasPoint5 ? 0.5 : 1
      temp = temp - precision
      temp = temp.toFixed(1)
      console.log(temp, '/////', this.calculateTemp(temp))
      var temperature = this.calculateTemp(temp)._is
      var small_temperature = this.calculateTemp(temp)._is5
      let minimum_temp = this.data.has16 ? 16 : 17;
      if (temp < minimum_temp) {
        wx.showToast({
          title: '已经是最小温度',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0 // 调温退出智控温
      this.data.DeviceComDecorator.controlTemp(temperature + small_temperature, this.data.acstatus)
    }
  },
  onWindDrag(e) {
    // console.log(e.detail.value, 'touchmove')
    // if (e.detail.value > 110) {
    //   this.setData({
    //     'sliders.sliderValue': -20,
    //   })
    //   // windSpeed = 102;
    // } else if (e.detail.value >= 100 && e.detail.value <= 110) {
    //   this.setData({
    //     'sliders.sliderValue': 100,
    //   })
    // } else if (e.detail.value <= 0) {
    //   // this.setData({
    //   //   'sliders.sliderValue': 1,
    //   // })
    //   // windSpeed = 1;
    // } else {
    //   this.setData({
    //     'sliders.sliderValue': e.detail.value,
    //   })
    //   // windSpeed = e.detail;
    // }
    // if (this.data.isKitchen) {
    //   this.setSliderText()
    // }

    let windVal = 0;
    if (e.detail.value > -10 && e.detail.value <= 1) {
      windVal = 1
    } else {
      windVal = e.detail.value
    }
    this.setData({
      'sliders.sliderValue': windVal,
    })
    if (this.data.isKitchen) { // 非厨房空调
      this.setSliderText();
    }
  },
  onChange(e) {
    console.log(e)
    let windSpeed = e.detail
    if (this.data.isKitchen) { // 厨房空调风速特殊处理
      if (windSpeed <= 13) {
        windSpeed = 102
      } else if (windSpeed > 13 && windSpeed <= 37) {
        windSpeed = 40
      } else if (windSpeed > 37 && windSpeed <= 62) {
        windSpeed = 60
      } else if (windSpeed > 62 && windSpeed <= 87) {
        windSpeed = 80
      } else if (windSpeed > 87) {
        windSpeed = 100
      }
      // if (windSpeed <= 1) {
      //   windSpeed = 102
      // } else if (windSpeed > 1 && windSpeed <= 25) {
      //   windSpeed = 40
      // } else if (windSpeed > 25 && windSpeed <= 50) {
      //   windSpeed = 60
      // } else if (windSpeed > 50 && windSpeed <= 75) {
      //   windSpeed = 80
      // } else if (windSpeed > 75 && windSpeed <= 100) {
      //   windSpeed = 100
      // }
      this.setSliderText()
    } else {
      if (windSpeed <= -10) {
        windSpeed = 102
      } else if (windSpeed > -10 && windSpeed <= 1) {
        windSpeed = 1
      } else if (windSpeed >= 100 && windSpeed <= 110) {
        windSpeed = 100
      } else {
        windSpeed = e.detail
      }
      // if (windSpeed < 1) {
      //   windSpeed = 102
      // } else if (windSpeed >= 100 && windSpeed <= 110) {
      //   windSpeed = 100
      // } else {
      //   // this.setData({
      //   //     'sliders.sliderValue': e.detail
      //   // })
      //   windSpeed = e.detail
      // }
    }
    console.log('----------wind data---------', this.data, windSpeed)
    this.data.DeviceComDecorator.controlWindSpeed(windSpeed, this.data.acstatus, '', this.data.sleepCurve)
  },
  setSliderText() {
    let sliderText = '自动'
    if (this.data.sliders.sliderValue <= 1) {
      sliderText = '自动'
    } else if (this.data.sliders.sliderValue > 1 && this.data.sliders.sliderValue <= 25) {
      sliderText = '低'
    } else if (this.data.sliders.sliderValue > 25 && this.data.sliders.sliderValue <= 50) {
      sliderText = '中'
    } else if (this.data.sliders.sliderValue > 50 && this.data.sliders.sliderValue <= 75) {
      sliderText = '高'
    } else if (this.data.sliders.sliderValue > 75 && this.data.sliders.sliderValue <= 100) {
      sliderText = '强劲'
    }
    this.setData({
      'sliders.sliderText': sliderText,
    })
  },
  initSliderKitchen(v) {
    console.log("!!!!!initSliderKitchen", v);
    if (v <= 0) {
      return 0
    } else if (v <= 40) {
      return 25
    } else if (v > 40 && v <= 60) {
      return 50
    } else if (v > 60 && v <= 80) {
      return 75
    } else if (v > 80 && v <= 100) {
      return 100
    }
  },
  onDragQuickFry(e) {
    this.setData({
      quickFryValue: e.detail.value,
    })
  },
  onChangeQuickFry(e) {
    let point = e.detail
    this.setData({
      quickFryValue: e.detail.value,
    })
    this.data.DeviceComDecorator.changeQuickFryCenterPoint(point, this.data.acstatus,
      'silder_quick_fry_center_point', this.data
      .page_path)
  },
  powerToggle() {
    this.initSubscribeModal(this.data.deviceInfo)
    let isOn = this.data.acstatus.runStatus == 1 ? 0 : 1
    if (this.data.DeviceComDecorator) {
      if (!this.data.isKitchen) {
        this.data.DeviceComDecorator.AcProcess.parser.newsendingState.leftRightAngle = 0 // 开左右风按钮，摆风角度置0
        this.data.DeviceComDecorator.AcProcess.parser.newsendingState.upDownAngle = 0 // 开上下风按钮，摆风角度置0
      }
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchFreshAir = 0 // 新风假关
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 1 // 防直吹假关
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchSelfCleaning = 0 // 智清洁假关
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0 // 智控温假关
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.udAroundWindSwitch = 0 // 环绕风关闭
      this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0 // 无风感假关        

      if (this.data.isCoolFree) {
        this.data.DeviceComDecorator.coolFreeSwitchDevice(isOn, '', false, this.data.acstatus, () => {})
      } else if(this.data.isNorthWarm) {
        this.data.DeviceComDecorator.northWarmSwitchDevice(isOn, '', false, this.data.acstatus, () => {});
      }      
      else {
        if (this.data.deviceSubType == 'T5_35_BLE' || this.data.deviceSubType == 'T1_OFFLINE_VOICE_BLE' || this.data.deviceSubType == 'T5_72_BLE' || this.data.deviceSubType == 'T3_35_BLE') {
          // 新风开时，需要发全关
          if(this.data.acSwStatus.FreshAir) {
            this.data.DeviceComDecorator.switchDevice(false, '', false, this.data.acstatus, this.data.isKitchen,
            () => {})
          } else {
            this.data.DeviceComDecorator.switchDevice(isOn, '', false, this.data.acstatus, this.data.isKitchen,
          () => {})
          }  
        } else {
          this.data.DeviceComDecorator.switchDevice(isOn, '', false, this.data.acstatus, this.data.isKitchen,
          () => {})
        }       
      }

      
    }
  },

  initSubscribeModal(deviceInfo) {
    let templates = PreventCoolSn8.includes(deviceInfo.sn8) ? [templateIds[19][0], templateIds[20][0], templateIds[
      21][0]] : [templateIds[20][0], templateIds[21][0]]
    openSubscribeModal(
      modelIds[11],
      deviceInfo.name,
      deviceInfo.sn,
      templates,
      deviceInfo.sn8,
      deviceInfo.type,
      deviceInfo.applianceCode);
  },

  computeButtons() {
   
  },
  updateAcStatus: function (status, newSendingStatus) {
    console.log('++++++++++++++++++++++++', status, status.dustFlow)
    let that = this
    // console.log(status, '<<<<<<<<updateAcStatus<<<<<<<<', newSendingStatus, status.dustFlow)

    let windSpeed = status.windSpeed
    let tempIN = 26;
    // status.tempIn = 0;    
    console.log('111111++++++++++++++++++++++++')
    console.log(status.tempIn, "status.tempIn");
    let _acstatus = {
      runStatus: status.runStatus,
      mode: status.mode,
      tempIn: (status.tempIn !== "" && status.tempIn != undefined) ? status.tempIn.toFixed(1) : "",
      // tempIn:  tempIN != "" ? tempIN.toFixed(1): "",
      tempSet: status.tempSet2,
      windSpeed: windSpeed == 102 || windSpeed == 101 ? -20 : windSpeed,
      windUpDown: that.data.ctrlType == 1 ? status.leftUpDownWind && status.rightUpDownWind : status
        .leftUpDownWind,
      windLeftRight: status.leftLeftRightWind,
      downWindLeftRight: status.downLeftRightWindTh || status.downWind, // 下左右风
      newWindFunSw: this.data.acstatus.newWindFunSw,
      ecoFunc: status.ecoFunc,
      powerSave: status.powerSave,
      nonDirectWind: this.data.acstatus.nonDirectWind,
      elecHeat: status.elecHeat,
      diyFunc: status.diyFunc,
      voiceBroadcastStatus: status.voiceBroadcastStatus,
      timingOffHour: status.timingOffHour,
      timingOffMinute: status.timingOffMinute, // 30或0，30是0.5小时
      timingOffSwitch: status.timingOffSwitch,
      timingOnSwitch: status.timingOnSwitch, // 定时开 开关flag
      timingOnHour: status.timingOnHour, // 定时开 小时
      timingOnMinute: status.timingOnMinute, // 定时开 分钟
      coolFreeDryClean: status.coolFreeDryClean,
      screenShow: status.screenShow,
      cosySleepMode: status.cosySleepMode,
      CSEco: status.CSEco == '' ? 0 : status.CSEco,
      smartDryFunc: status.smartDryFunc === "smart_dry" && status.smartDryValue == 101,
      manualDryFunc: status.smartDryFunc === "smart_dry" && status.smartDryValue != 101,
      // 北方采暖参数
      northWarmEffluentTemperature: parseFloat(status.northWarmEffluentTemperature),
      northWarmTargetTemp: status.northWarmTargetTemp && parseFloat(status.northWarmTargetTemp),
      outMode: status.outMode,
      muteVoice: status.muteVoice,
      waterModelAuto: status.waterModelAuto,
      northWarmEco: status.northWarmEco,
      northWarmTempCtrlSwitch: status.northWarmTempCtrlSwitch,
      holidayMode: status.holidayMode,     
      holidayModeMcuSwitch: status.holidayModeMcuSwitch,
      current_water_temperature: status.current_water_temperature,
      northWarmpowerOnTimer: status.northWarmpowerOnTimer,
      northWarmpowerOffTimer: status.northWarmpowerOffTimer
    }
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
    console.log('22222222++++++++++++++++++++++++', _acstatus)
    this.setData({
      acstatus: {
        ..._acstatus,
        tempSetWithDot: parseFloat(_acstatus.tempSet),        
      },
      acNewStatus: {
        ...this.data.acNewStatus,
        ...newSendingStatus,
      }, //新协议
      'sliders.sliderValue': this.data.isKitchen ? this.initSliderKitchen(_acstatus.windSpeed) : _acstatus
        .windSpeed, //设置slider风速值
      // 'sliders.sliderValue': _acstatus.windSpeed, //设置slider风速值
      'acStatus.mode': this.data.modeMap[_acstatus.mode - 1].key ? this.data.modeMap[_acstatus.mode - 1].key :
        'auto',
      windVal: status.windSpeed,
      tempVal: status.tempSet2 == '' || status.tempSet2 == undefined ? 16 : parseFloat(status.tempSet2)
        .toFixed(1),
      timerVal: parseInt(status.timingOffHour / 0.5),
      showHour: status.timingOffHour == '' ? 0 : status.timingOffHour.toFixed(1),
      modeText: this.getModeText(this.data.modeMap[_acstatus.mode - 1].key),
      startupImg: this.getStartupObject(_acstatus.mode, _acstatus.runStatus),
      dustFullTime: status.dustFlow == 1,
      modePopupMode: this.getModePopupMode(_acstatus),
    })
    console.log('333333++++++++++++++++++++++++', this.data)
    this.setSliderText()
    this.calCircleVal(this.data.acstatus.tempSetWithDot)    
    this.checkSoundSwitch();
    this.refreshBtnStatus();
    this.judgeBtnDisabled(this.data.acStatus);
    if (status.runStatus == 1) {
      this.refreshTimerOffIndex(status.timingOffHour); // 开机时渲染定时关的数据
    } else {
      this.refreshTimerOffIndex(status.timingOnHour); // 开机时渲染定时关的数据
    }

    app.globalData.acstatus = this.data.acstatus
    console.log(this.data.acstatus, '>>>>', this.data.acSwStatus)
    this.calHourStr(this.data.acstatus.timingOffHour, this.data.acstatus.timingOffMinute);
    this.calOnHourStr(this.data.acstatus.timingOnHour, this.data.acstatus.timingOnMinute);    

    if (this.data.isNorthWarm) {
      this.modifyCellArrExtraText("TargetIndoorTemp")
      this.judgeNorthWarmVacationDate(status);
      this.setData({
        northWarmTargetTempText: status.northWarmTargetTemp && status.northWarmTargetTemp.toFixed(1)
      })
    }

  },
  updateNewProtocolStatus: function (status) {
    this.setData({
      acNewStatus: {
        superCoolingSw: status.superCoolingSw == '' ? 0 : status.superCoolingSw,
        voiceBroadcastStatus: status.voiceBroadcastStatus == '' ? 0 : status.voiceBroadcastStatus,
        switchSelfCleaning: status.switchSelfCleaning == '' ? 0 : status.switchSelfCleaning,
        switchNonDirectWind: status.switchNonDirectWind == '' ? 1 : status.switchNonDirectWind,
        switchFreshAir: status.switchFreshAir == '' ? 0 : status.switchFreshAir,
        freshAirFanSpeed: status.freshAirFanSpeed ? status.freshAirFanSpeed : 40,
        upDownAngle: status.upDownAngle == '' ? 0 : status.upDownAngle,
        leftRightAngle: status.leftRightAngle == '' ? 0 : status.leftRightAngle,
        udAroundWindSwitch: status.udAroundWindSwitch == '' ? 0 : status.udAroundWindSwitch, // 环绕风开关
        udAroundWindDirect: status.udAroundWindDirect, // 环绕风上还是下,
        controlSwitchNoWindFeel: status.controlSwitchNoWindFeel == '' ? 0 : status.controlSwitchNoWindFeel,
        nonDirectWindType: status.nonDirectWindType,
        coolPowerSaving: status.coolPowerSaving == 1,
        thNoWindSenseLeft: status.thNoWindSenseLeft,
        thNoWindSenseRight: status.thNoWindSenseRight,
        thSoftWindStatus: status.thSoftWindStatus,
        upNoWindSense: status.upNoWindSense,
        downNoWindSense: status.downNoWindSense,
        downLeftRightAngle: status.downLeftRightAngle,
        aroundWind: status.aroundWind,
        quickCoolHeat: status.quickCoolHeat,
        softWindFeel: status.faWindFeel,
        windSwingLrLeft: status.windSwingLrLeft,
        windSwingLrRight: status.windSwingLrRight,
        windSwingUdLeft: status.windSwingUdLeft,
        windSwingUdRight: status.windSwingUdRight,
        rightLrWindAngle: status.rightLrWindAngle, // th右左右摆风角度
        rewarmingDry: status.rewarmingDry, // 回温除湿
        innerPurifier: status.innerPurifier, // 净化开关
        innerPurifierFanSpeed: status.innerPurifierFanSpeed, // 净化风速
        moisturizing: status.moisturizing, // 保湿开关
        moisturizingFanSpeed: status.moisturizingFanSpeed, // 保湿风速
        thLight: status.thLight,
        nonDirectWindDistance: status.nonDirectWindDistance,
        circleFan: status.circleFan,
        circleFanMode: status.circleFanMode,
        newSoundSwitch: status.newSoundSwitch,
        newSoundType: status.newSoundType,
        preventCoolWindMenory: status.preventCoolWindMenory,
        downLeftRightWindTh: status.downLeftRightWindTh
      },
      // 'acValueStatus.FreshAir.value': status.freshAirFanSpeed,
      // 'acValueStatus.FreshAir.text': this.data.isTH ? this.data.freshAirThSpeedMap[status.freshAirFanSpeed.toString()]:this.data.freshAirFanSpeedMap[status.freshAirFanSpeed.toString()],
      prepareFood: status.prepareFood == 1,
      prepareFoodFanSpeed: status.prepareFoodFanSpeed,
      prepareFoodTemp: status.prepareFoodTemp,
      quickFry: status.quickFry == 1,
      quickFryAngle: status.quickFryAngle,
      quickFryCenterPoint: status.quickFryCenterPoint,
      quickFryValue: status.quickFryCenterPoint,
      quickFryFanSpeed: status.quickFryFanSpeed,
      quickFryTemp: status.quickFryTemp,
      'kitStatus.prepare_food': status.prepareFood == 1,
      'kitStatus.quick_fry': status.quickFry == 1,
      // dustFullTime: status.dust_full_time == 1,
    })
    if (typeof status.freshAirFanSpeed == 'number') {
      this.setData({
        'acValueStatus.FreshAir.value': status.freshAirFanSpeed,
        'acValueStatus.FreshAir.text': this.data.useThFreshAir ? this.data.freshAirThSpeedMap[status.freshAirFanSpeed
          .toString()] : this.data.freshAirFanSpeedMap[status.freshAirFanSpeed.toString()]
      })
    }
    this.refreshNewProtocalStatus();
    this.updateFreshAirItemSelect();
    this.updateMoisturizingItemSelect();
    this.updatePurifyItemSelect();    
    this.updateCircleFanItemSelect();
    console.log('this.data.isTH', this.data.isTH);
    console.log(this.data.acNewStatus, 'acNewStatus----------------acNewStatus', status.controlSwitchNoWindFeel)
  },
  /**刷新新协议按钮状态 */
  refreshNewProtocalStatus() {
    this.setData({
      'acSwStatus.Voice': this.data.acNewStatus.voiceBroadcastStatus == 3,
      'acSwStatus.Supercooling': this.data.acNewStatus.superCoolingSw == 1,
      'acSwStatus.SelfCleaning': this.data.acNewStatus.switchSelfCleaning == 1,
      'acSwStatus.WindBlowing': this.data.acNewStatus.switchNonDirectWind == 2,
      'acSwStatus.FreshAir': this.data.acNewStatus.switchFreshAir == 1,
      'udAroundWindBtn[0].selected': this.data.acNewStatus.udAroundWindDirect == 1, // 上环绕风
      'udAroundWindBtn[1].selected': this.data.acNewStatus.udAroundWindDirect == 2, // 下环绕风
      'acSwStatus.UpDownAroundWind': this.data.acNewStatus.udAroundWindSwitch == 1, // 摆风开关     
      'acSwStatus.FaNoWindFeel': this.data.acNewStatus.controlSwitchNoWindFeel == 1,
      'acSwStatus.softWindFeel': this.data.acNewStatus.softWindFeel == 3,
      'acSwStatus.UpNoWindFeel':
        this.data.acNewStatus.controlSwitchNoWindFeel == 2 || this.data.acNewStatus.controlSwitchNoWindFeel == 1,
      'acSwStatus.ThUpNoWindFeel': this.data.acNewStatus.upNoWindSense == 2,
      'acSwStatus.ThDownNoWindFeel': this.data.acNewStatus.downNoWindSense == 2,
      'acSwStatus.DownNoWindFeel': this.data.acNewStatus.controlSwitchNoWindFeel == 3 || this.data.acNewStatus
        .controlSwitchNoWindFeel == 1,
      'UpDownWindBlowingBtn[0].selected': this.data.acNewStatus.nonDirectWindType == 2, // 上防直吹
      'UpDownWindBlowingBtn[1].selected': this.data.acNewStatus.nonDirectWindType == 3, // 下防直吹,
      'freshAirItem[0].selected': this.data.acNewStatus.switchFreshAir != 1,
      'acSwStatus.CoolPowerSaving': this.data.acNewStatus.coolPowerSaving == 1,
      'acSwStatus.CoolPowerSavingNewName': this.data.acNewStatus.coolPowerSaving == 1,
      'acSwStatus.AroundWind': this.data.acNewStatus.aroundWind == 1,
      'acSwStatus.WaterFallWind': this.data.acNewStatus.aroundWind == 1,
      'acSwStatus.QuickCoolHeat': this.data.acNewStatus.quickCoolHeat == 1,
      'acSwStatus.ThNowindFeel': this.data.acNewStatus.thNoWindSenseLeft == 2 || this.data.acNewStatus
        .thNoWindSenseRight == 2,
      'acSwStatus.ThNowindFeelLeft': this.data.acNewStatus.thNoWindSenseLeft == 2,
      'acSwStatus.ThNowindFeelRight': this.data.acNewStatus.thNoWindSenseRight == 2,
      'acSwStatus.ThSoftWindFeel': app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState
        .thSoftWindStatus == 1,
      'acSwStatus.DownSwipeWind00Ae': this.data.acNewStatus.downLeftRightWindTh == 1,
      'acSwstatus.DownSwipeWind': this.data.acstatus.downWindLeftRight == 1,
      'leftRightSwipePopupBtn[0].selected': this.data.acNewStatus.windSwingLrLeft == 1,
      'leftRightSwipePopupBtn[1].selected': this.data.acNewStatus.windSwingLrRight == 1,
      'acSwStatus.LeftRightSwipeWindPopup': this.data.acNewStatus.windSwingLrLeft == 1 || this.data.acNewStatus.windSwingLrRight == 1,
      'acSwStatus.UpDownSwipeWindPopup': this.data.acNewStatus.windSwingUdLeft == 1 || this.data.acNewStatus.windSwingUdRight == 1,
      'upDownSwipePopupBtn[0].selected': this.data.acNewStatus.windSwingUdLeft == 1,
      'upDownSwipePopupBtn[1].selected': this.data.acNewStatus.windSwingUdRight == 1,
      'acSwStatus.CleanFunc': this.data.acNewStatus.innerPurifier == 1,
      'acSwStatus.BackWarmRemoveWet': this.data.acNewStatus.rewarmingDry == 1,
      'acSwStatus.KeepWet': this.data.acNewStatus.moisturizing == 1,
      'acSwStatus.rewarmingDry': this.data.acNewStatus.rewarmingDry == 1, // 回温除湿
      'acSwStatus.LeftRightWindAngleLeftRight': this.data.acNewStatus.rightLrWindAngle != 0 || this.data.acNewStatus.leftRightAngle != 0,
      'acSwStatus.ThLight' : this.data.acNewStatus.thLight != 0,
      'UpWindBlowingBtn[0].selected': this.data.acNewStatus.nonDirectWindDistance == 0 && this.data.acNewStatus.switchNonDirectWind == 2 && this.data.acNewStatus.nonDirectWindType == 2,
      'UpWindBlowingBtn[1].selected': this.data.acNewStatus.nonDirectWindDistance == 1 && this.data.acNewStatus.switchNonDirectWind == 2 && this.data.acNewStatus.nonDirectWindType == 2,
      'acSwStatus.UpWindBlowing': this.data.acNewStatus.switchNonDirectWind == 2 && this.data.acNewStatus.nonDirectWindType == 2,
      'acSwStatus.DownWindBlowing': this.data.acNewStatus.switchNonDirectWind == 2 && this.data.acNewStatus.nonDirectWindType == 3,
      'acSwStatus.LoopFan': this.data.acNewStatus.circleFan,
      'acSwStatus.NewSound': this.data.acNewStatus.newSoundSwitch == 1, // 电控蜂鸣器开关,
      'newSoundBtn[0].selected': this.data.acNewStatus.newSoundType == 1,
      'newSoundBtn[1].selected': this.data.acNewStatus.newSoundType == 0,

    })
    console.log('无风感', this.data.acSwStatus, this.data.UpDownWindBlowingBtn)

  },
  luaControl(changeItem, isNew) {
    //发送设备控制lua
    return new Promise((resolve, reject) => {
      // this.showLoading()
      let reqData = {
        applianceCode: this.data.deviceInfo.applianceCode,
        command: {
          control: changeItem,
        },
        stamp: +new Date(),
        reqId: +new Date(),
      }
      console.log(reqData)
      requestService
        .request('luaControl', reqData)
        .then((res) => {
          console.log('res', res)
          if (res.data.code == 0) {
            if (isNew) {
              this.setData({
                applianceStatusNew: res.data.data.status,
              })
            } else {
              this.setData({
                applianceStatus: res.data.data.status,
              })
            }
            resolve(res)
          } else {
            this.showToast('网络异常, 控制失败')
            reject(res)
          }
        })
        .catch(() => {})
    })
  },
  modalBtnTab(item) {
    console.log(item, item.currentTarget.dataset.item)
    if (item, item.currentTarget.dataset.item.key != "SelfCleaning") {
      this.data.btnObj[item.currentTarget.dataset.item.key].switchFunc(item.currentTarget.dataset.item)
    }

  },
  refreshBtnStatus() {
    this.setData({
      acSwStatus: {
        DeviceSwitch: this.data.acstatus.runStatus == 0,
        RefrigerantCheck: this.data.acstatus.mode == 2 && this.data.acstatus.runStatus == 1,
        NewRefrigerantCheck: this.data.acstatus.mode == 2 && this.data.acstatus.runStatus == 1,
        HotMode: this.data.acstatus.mode == 4 && this.data.acstatus.runStatus == 1,
        NewHotMode: this.data.acstatus.mode == 4 && this.data.acstatus.runStatus == 1,
        DryMode: this.data.acstatus.mode == 3 && this.data.acstatus.runStatus == 1,
        NewDryMode: this.data.acstatus.mode == 3 && this.data.acstatus.runStatus == 1,
        UpDownSwipeWind: this.data.acstatus.windUpDown == 1 && this.data.acNewStatus.upDownAngle == 0,
        LeftRightSwipeWind: this.data.acstatus.windLeftRight == 1 && this.data.acNewStatus.leftRightAngle == 0,
        ECO: this.data.acstatus.ecoFunc == 1,
        WindBlowing: this.data.acNewStatus.switchNonDirectWind == 2, // 1-关 2-开
        UpDownWindBlowing: this.data.acNewStatus.switchNonDirectWind == 2,
        SelfCleaning: this.data.acNewStatus.switchSelfCleaning == 1,
        Quietness: this.data.acstatus.powerSave == 1,
        DeviceSwitchAppointment: false,
        ElectricHeat: (this.data.acstatus.runStatus == 1) && this.data.acstatus.elecHeat == 1 && (this.data
          .acstatus.mode == 4 || this.data.acstatus.mode == 1),
        CSEco: this.data.acstatus.CSEco == '' ? 0 : this.data.acstatus.CSEco == 1,
        AutoMode: this.data.acstatus.mode == 1,
        WindMode: this.data.acstatus.mode == 5,
        UpDownWindAngle: (this.data.acNewStatus.upDownAngle != 0) && this
          .data.acstatus.runStatus == 1,
        LeftRightWindAngle: (this.data.acNewStatus.leftRightAngle !=
          0) && this.data.acstatus.runStatus == 1,
        Dry: this.data.acstatus.diyFunc == 1 && (this.data.acstatus.mode == 2 || this.data.acstatus.mode == 3),
        DryNewName: this.data.acstatus.diyFunc == 1 && (this.data.acstatus.mode == 2 || this.data.acstatus
          .mode == 3), // 内机防霉
        DryNewNameKitchen: this.data.acstatus.diyFunc == 1 && (this.data.acstatus.mode == 2 || this.data
          .acstatus
          .mode == 3), // 内机防霉
        Show: this.data.acstatus.screenShow == 0,
        Supercooling: this.data.acNewStatus.superCoolingSw == 1,
        Voice: this.data.acNewStatus.voiceBroadcastStatus == 3,
        AppointmentSwitchOff: this.data.acstatus.timingOffSwitch == 1,
        FreshAir: this.data.acNewStatus.switchFreshAir == 1,
        UpDownAroundWind: this.data.acNewStatus.udAroundWindSwitch == 1,
        NoWindFeel: this.data.acNewStatus.controlSwitchNoWindFeel == 1,
        UpNoWindFeel: this.data.acNewStatus.controlSwitchNoWindFeel == 1 || this.data.acNewStatus
          .controlSwitchNoWindFeel == 2,
        ThUpNoWindFeel: this.data.acNewStatus.upNoWindSense == 2,
        DownNoWindFeel: this.data.acNewStatus.controlSwitchNoWindFeel == 1 || this.data.acNewStatus
          .controlSwitchNoWindFeel == 3,
        ThDownNoWindFeel: this.data.acNewStatus.downNoWindSense == 2,
        FaNoWindFeel: this.data.acNewStatus.controlSwitchNoWindFeel == 1,
        softWindFeel: this.data.acNewStatus.faWindFeel == 3, // 柔风感开关,    
        SafeMode: this.data.safeModeSwitch == 1,
        Sound: this.data.SoundSwitch,
        SleepCurve: this.data.acstatus.cosySleepMode != 0,
        DownSwipeWind: this.data.acstatus.downWindLeftRight == 1,
        UpSwipeWind: this.data.acstatus.windLeftRight == 1,

        CoolFreeDry: (this.data.acstatus.coolFreeDryClean == 1 && this.data.acstatus.mode == 2) || (this.data
          .acstatus.coolFreeDryClean == 1 && this.data.acstatus.mode == 3),
        CoolPowerSaving: this.data.acNewStatus.coolPowerSaving == 1 && this.data.acstatus.runStatus == 1,
        CoolPowerSavingNewName: this.data.acNewStatus.coolPowerSaving == 1 && this.data.acstatus.runStatus == 1,
        AutomaticAntiColdAir: this.data.acNewStatus.automaticAntiColdAir == 1 && (this.data.acNewStatus
          .faWindFeel != 2 || this.data.acNewStatus.faWindFeel != 3 || this.data.acNewStatus.faWindFeel != 4
        ), //主动防冷风标志为1，且fa的无风感、柔风感、防直吹都不打开，即为1的时候才点亮  
        Degerming: this.data.acNewStatus.degerming == 1,
        AroundWind: this.data.acNewStatus.aroundWind == 1,
        WaterFallWind: this.data.acNewStatus.aroundWind == 1,
        QuickCoolHeat: this.data.acNewStatus.quickCoolHeat == 1,
        ThNowindFeel: this.data.acNewStatus.thNoWindSenseLeft == 2 || this.data.acNewStatus
          .thNoWindSenseRight == 2,
        ThSoftWindFeel: this.data.acNewStatus.thSoftWindStatus == 1,
        DownSwipeWind00Ae: this.data.acNewStatus.downLeftRightWindTh == 1,
        UpLeftRightDownLeftRightWindAngle: (this.data.acNewStatus.leftRightAngle != 0 || this.data.acNewStatus.downLeftRightAngle != 0) && this.data.acstatus.runStatus == 1,
        FaWindBlowing: this.data.acNewStatus.switchNonDirectWind == 2,
        F11NoWindFeel: this.data.acNewStatus.faWindFeel == 4, // fa无风感
        ThNowindFeelLeft: this.data.acNewStatus.thNoWindSenseLeft == 2,
        ThNowindFeelRight: this.data.acNewStatus.thNoWindSenseRight == 2,
        LeftRightSwipeWindPopup: this.data.acNewStatus.windSwingLrLeft == 1 || this.data.acNewStatus.windSwingLrRight == 1,
        UpDownSwipeWindPopup: this.data.acNewStatus.windSwingUdLeft == 1 || this.data.acNewStatus.windSwingUdRight == 1,
        CleanFunc: this.data.acNewStatus.innerPurifier == 1,        
        KeepWet: this.data.acNewStatus.moisturizing == 1,
        BackWarmRemoveWet: this.data.acNewStatus.rewarmingDry == 1,
        LeftRightWindAngleLeftRight: this.data.acNewStatus.rightLrWindAngle != 0 || this.data.acNewStatus.leftRightAngle != 0,
        ThLight: this.data.acNewStatus.thLight != 0,
        UpWindBlowing: this.data.acNewStatus.switchNonDirectWind == 2 && this.data.acNewStatus.nonDirectWindType == 2,
        DownWindBlowing: this.data.acNewStatus.switchNonDirectWind == 2 && this.data.acNewStatus.nonDirectWindType == 3,
        LoopFan: this.data.acNewStatus.circleFan,
        NewSound: this.data.acNewStatus.newSoundSwitch == 1, // 电控蜂鸣器开关

        // 北方采暖器
        NorthWarmGoOut: this.data.acstatus.outMode == 1,
        NorthWarmQuiet: this.data.acstatus.muteVoice == 1,
        NorthWarmAuto: this.data.acstatus.waterModelAuto == 1 && this.data.acstatus.runStatus == 1,
        NorthWarmSaveEnergy: this.data.acstatus.northWarmEco == 1,
        TargetIndoorTemp: this.data.acstatus.northWarmTempCtrlSwitch == 1 && this.data.acstatus.runStatus == 1,
        
      },
    })    
    console.log(this.data.acSwStatus, '========================')
    app.globalData.acSwStatus = this.data.acSwStatus
  },
  onTimerChange() {
    // const { picker, value, index } = event.detail
    // Toast(`当前值：${value}, 当前索引：${index}`);
  },
  refreshTimerOffIndex(time) {
    // let minute = (time * 60)
    console.log('refreshTimerOffIndex', time);
    let index = Math.ceil(time / 0.5)
    if (time == 0) {
      index = 0
    } else {
      index = Math.ceil(time / 0.5) - 1
    }

    this.setData({
      timerOffVal: index,
      timerSetVal: parseFloat([index] / 2),
    })

    this.setPickerIndex(this.data.acstatus);
  },
  onConfirm(v) {
    // ['关闭定时', '30分钟', '1小时', '1.5小时', '2小时'],
    console.log('v-detail:', v.detail)
    console.log('v-v', v)
    console.log('this.data', this.data)

    if (v.detail.index === 0) {
      if (this.data.isCoolFree) { // 酷风空调取消定时
        app.globalData.DeviceComDecorator.coolFreeCancelTimingOff((res) => {
          this.setData({
            applianceStatus: res.status,
          })
          this.computeButtons()
        }, this.data.sleepCurve)
      } else {
        app.globalData.DeviceComDecorator.cancelTimingOff((res) => {
          this.setData({
            applianceStatus: res.status,
          })
          this.computeButtons()
        }, this.data.sleepCurve)
      }
    } else {
      if (this.data.isCoolFree) { // 酷风空调设置定时
        let offTimeValue = v.detail.index / 2
        app.globalData.DeviceComDecorator.coolFreeTimingOffSwitch(offTimeValue, this.data.sleepCurve)
      } else {
        let offTimeValue = v.detail.index / 2
        app.globalData.DeviceComDecorator.timingOffSwitch(offTimeValue, this.data.sleepCurve)
      }
    }
    this.hidePopup();
  },
  onCancel() {
    this.setData({
      openTimerPicker: false,
    })
  },
  controlLogic() {
    this.generateAppointmentOffPicker()
    this.setData({
      btnObj: {
        ModeControl: {
          switchFunc: () => {
            console.log('mode')
            this.showOrHideModePopup(true)
          },
        },
        ModeWithNoAuto: {
          switchFunc: () => {
            console.log('mode')
            this.showOrHideModePopup(true)
          },
        },
        UpDownWindAngle: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            this.setData({
              showUpDownPopup: true, //展示底部上下风
            })
          },
          btnSelectFunc: () => {},
          switchBtnFunc: () => {
            let isOn = this.data.acstatus.windUpDown == 0 ? 1 : 0
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 1
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.udAroundWindSwitch = 0
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.upDownAngle = 0 // 开上下风按钮，摆风角度置0
            this.data.DeviceComDecorator.switchUpDownSwipe(isOn, this.data.acstatus, '', '', this.data
              .isKitchen ? '' : this.data.sleepCurve, this.data.isKitchen)
          },
        },
        UpDownWindAngleLeftRight: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            this.setData({
              showUpDownAngleLrPopup: true, //展示底部上下风
            })
          },
          btnSelectFunc: () => {},
          switchBtnFunc: () => {
            
          },
        },
        LeftRightWindAngle: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            this.setData({
              showLeftPopup: true, //展示底部左右风
            })
          },
          btnSelectFunc: () => {},
          switchBtnFunc: () => {
            let isOn = this.data.acstatus.windLeftRight == 0 ? 1 : 0
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.leftRightAngle = 0 // 开左右风按钮，摆风角度置0
            this.data.DeviceComDecorator.switchLeftRightSwipe(isOn, this.data.acstatus, '', '', this.data
              .isKitchen ? '' : this.data.sleepCurve, this.data.isKitchen)
          },
        },
        LeftRightWindAngleLeftRight: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            this.setData({
              showLeftRightAngleLrPopup: true, //展示底部左右风道左右出风角度
            })
          },
          btnSelectFunc: () => {},
          switchBtnFunc: () => {
            
          },
        },
        LeftRightSwipeWind: {
          switchFunc: () => {
            // let sendData = (this.data.applianceStatus.wind_swing_lr == "on" || this.data.applianceStatus.wind_swing_lr_under == "on") ? false : true
            let isOn = this.data.acstatus.windLeftRight == 0 ? 1 : 0
            this.data.DeviceComDecorator.switchLeftRightSwipe(isOn, this.data.acstatus, '', '', this.data
              .isKitchen ? '' : this.data.sleepCurve, this.data.isKitchen)
          },
        },
        LeftRightSwipeWindPopup: {
          switchFunc: () => {
            this.setData({
              showLeftRightSwipePopup: true
            })
          },
        },
        UpDownSwipeWindPopup: {
          switchFunc: () => {
            this.setData({
              showUpDownSwipePopup: true
            })
          },
        },
        UpDownSwipeWind: {
          switchFunc: () => {
            // let sendData = (this.data.applianceStatus.wind_swing_ud == "on") ? false : true
            let isOn = this.data.acstatus.windUpDown == 0 ? 1 : 0
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 1
            this.data.DeviceComDecorator.switchUpDownSwipe(isOn, this.data.acstatus, '', '', this.data
              .isKitchen ? '' : this.data.sleepCurve, this.data.isKitchen)
          },
        },
        FreshAir: {
          switchFunc: () => {
            this.setData({
              showFreshAirPop: true
            });
          },
        },
        ElectricHeat: {
          switchFunc: (key) => {
            console.log('ElectricHeat')
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acstatus.mode == 4 || this.data.acstatus.mode == 1) {
              let sendData = this.data.acSwStatus.ElectricHeat == 1 ? 0 : 1
              this.data.acstatus.elecHeat = sendData
              this.setData({
                'acstatus.elecHeat': sendData,
              })
              if (this.data.isCoolFree) {
                this.data.DeviceComDecorator.coolFreeSwitchElecHeat(sendData, "", "");
              } else {
                this.data.DeviceComDecorator.switchElecHeat(sendData, key.widget_id, this.data.page_path)
              }

            } else {
              let text = this.data.hasAuto ? '电辅热不能在制冷、抽湿、送风模式下开启' : '电辅热仅在制热模式下开启'
              wx.showToast({
                title: text,
                icon: 'none',
              })
            }
          },
        },
        CoolFreeECO: {
          switchFunc: (key) => {
            console.log('ECO')
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acstatus.mode == 2) {
              let sendData = this.data.acSwStatus.ECO == 1 ? 0 : 1
              this.data.DeviceComDecorator.switchCoolFreeECO(sendData, this.data.acstatus, key.widget_id, this
                .data
                .page_path)
            } else {
              wx.showToast({
                title: 'ECO不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
            }
          },
        },
        ECO: {
          switchFunc: (key) => {
            console.log('ECO')
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acstatus.mode == 2) {
              let sendData = this.data.acSwStatus.ECO == 1 ? 0 : 1
              this.data.DeviceComDecorator.switchECO(sendData, this.data.acstatus, key.widget_id, this.data
                .page_path)
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0
            } else {
              let text = this.data.isTH ? 'ECO不能在抽湿、制热、送风模式下开启' : 'ECO不能在自动、抽湿、制热、送风模式下开启'
              wx.showToast({
                title: text,
                icon: 'none',
              })
            }
          },
        },

        Quietness: {
          switchFunc: (key) => {
            let Quietness = this.data.acSwStatus.Quietness == 1 ? 0 : 1
            if (this.data.acstatus.mode == 2 || this.data.acstatus.mode == 4 || this.data.acstatus.mode ==
              1) {
              this.data.acstatus.powerSave = Quietness
              app.globalData.DeviceComDecorator.powerSave(Quietness, key.widget_id, this.data.page_path)
              app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
            } else {
              wx.showToast({
                title: '睡眠需在自动、制冷、或制热模式下运行',
                icon: 'none',
              })
            }
          },
        },
        NoWindFeel: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              this.showWxToast('空调已关，请先开空调');
              return;
            }
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }

            let sendData = this.data.acSwStatus.NoWindFeel == 1 ? 0 : 1
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
            this.data.DeviceComDecorator.AcProcess.parser.sendingState.CSEco = 0
            this.data.DeviceComDecorator.noWindFeelSwitch(sendData, 'click_no_wind_feel', this.data.page_path)
          },
        },
        FaNoWindFeel: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              this.showWxToast('空调已关，请先开空调');
              return;
            }
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }

            let sendData = this.data.acSwStatus.FaNoWindFeel == 1 ? 0 : 1
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
            this.data.DeviceComDecorator.AcProcess.parser.sendingState.ecoFunc = 0 // 无风感和ECO互斥
            this.data.DeviceComDecorator.noWindFeelSwitch(sendData, 'click_no_wind_feel', this.data.page_path)
          },
        },
        F11NoWindFeel: {
          switchFunc: () => {
            console.log('F11NoWindFeel-------------------');
            if (this.data.acstatus.runStatus == 0) {
              this.showWxToast('空调已关，请先开空调');
              return;
            }
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }

            let sendData = this.data.acSwStatus.F11NoWindFeel == 1 ? 0 : 1
            app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
            app.globalData.DeviceComDecorator.FaNoWindFeelSwitch(sendData)
          },
        },
        ThNowindFeel: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              this.showWxToast('空调已关，请先开空调');
              return;
            }
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }

            let sendData = this.data.acSwStatus.ThNowindFeel == 1 ? 0 : 1
            // this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
            this.data.DeviceComDecorator.thNoWindFeelSwitch(sendData, 'click_no_wind_feel', this.data
              .page_path)
          },
        },
        ThNowindFeelLeft: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              this.showWxToast('空调已关，请先开空调');
              return;
            }
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感不能在抽湿、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }

            let sendData = this.data.acSwStatus.ThNowindFeelLeft == 1 ? "off" : "on"
            // this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
            this.data.DeviceComDecorator.thNoWindFeelSwitchSingle(sendData, 'notSet', 'click_no_wind_feel', this.data
              .page_path)
          },
        },
        ThNowindFeelRight: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              this.showWxToast('空调已关，请先开空调');
              return;
            }
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感不能在抽湿、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }

            let sendData = this.data.acSwStatus.ThNowindFeelRight == 1 ? 'off' : 'on'
            // this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
            this.data.DeviceComDecorator.thNoWindFeelSwitchSingle('notSet', sendData, 'click_no_wind_feel', this.data
              .page_path)
          },
        },
        WindBlowing: {
          switchFunc: (key) => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return;
            }
            console.log('防直吹')
            let flag = this.data.isTH && this.data.deviceSubType != 'KS1_1_P_35_BLE' &&  this.data.deviceSubType != 'PD1_1' ? (this.data.acstatus.mode == 2) : (this.data.acstatus.mode != 1 && this
              .data.acstatus.mode != 4)
            if (flag) {
              let sendData = this.data.acSwStatus.WindBlowing == 1 ? 0 : 1
              console.log(sendData)
              this.data.DeviceComDecorator.noWindBlowingSwitch(
                sendData,
                key.widget_id,
                this.data.page_path,
                key.widget_id,
                this.data.page_path
              )
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0 // 防直吹开退出智控温
              if (sendData == 1 && (this.data.acstatus.mode == 2 || this.data.acstatus.mode == 5)) {
                this.data.DeviceComDecorator.AcProcess.parser.sendingState.windSpeed = 1 // 风速设为1
              }
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
              this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftUpDownWind = 0
              this.data.DeviceComDecorator.AcProcess.parser.sendingState.rightUpDownWind = 0
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.upDownAngle = 0 // 开上下风按钮，摆风角度置0
            } else {
              let text = this.data.hasAuto ? '防直吹不能在自动、制热模式下开启' : '防直吹不能在制热模式下开启'
              if (this.data.isTH && this.data.deviceSubType != 'KS1_1_P_35_BLE' && this.data.deviceSubType != 'PD1_1') {
                text = '防直吹只在制冷模式下有效'
              }
              wx.showToast({
                title: text,
                icon: 'none',
              })
            }
          },
        },
        FaWindBlowing: {
          switchFunc: (key) => {
            console.log('Fa防直吹')
            if (this.data.acstatus.mode == 2) {
              let sendData = this.data.acSwStatus.FaWindBlowing == 1 ? 0 : 1
              console.log(sendData)
              this.data.DeviceComDecorator.FaNoWindBlowingSwitch(
                sendData,
                key.widget_id,
                this.data.page_path,
                key.widget_id,
                this.data.page_path
              )
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0 // 防直吹开退出智控温
              if (sendData == 1 && (this.data.acstatus.mode == 2 || this.data.acstatus.mode == 5)) {
                this.data.DeviceComDecorator.AcProcess.parser.sendingState.windSpeed = 102 // 风速设为102
              }
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
              this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftUpDownWind = 0
              this.data.DeviceComDecorator.AcProcess.parser.sendingState.rightUpDownWind = 0
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0
            } else {
              wx.showToast({
                title: '防直吹不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
            }
          },
        },        
        AppointmentSwitchOff: {
          switchFunc: () => {
            // 定时开和定时关都需要
            // if (this.data.acstatus.runStatus == 0) {
            //   wx.showToast({
            //     title: '关机下定时关不可用',
            //     icon: 'none'
            //   })
            //   return;
            // }
            // console.log(this.data.acStatus.timingOffHour, "打开定时关picker");
            // this.refreshTimerOffIndex(this.data.acstatus.timingOffHour)
            this.setData({
              openTimerPicker: true,
            })
            // this.setPickerDefaultIndex();
            this.setPickerIndex(this.data.acstatus);
          },
        },
        Sound: {
          switchFunc: (key) => {
            let sendData = !this.data.acSwStatus.Sound
            this.setData({
              'acSwStatus.Sound': sendData,
              SoundSwitch: sendData,
            })
            let burialParam = {
              ext_info: sendData ? '开启' : '关闭',
            }
            burialParam = app.globalData.DeviceComDecorator.matchBurialParamsAdvance(
              burialParam,
              key.widget_id,
              this.data.page_path
            )
            app.globalData.DeviceComDecorator.sendBurial(burialParam)
            try {
              wx.setStorageSync('Sound', sendData)
            } catch (e) {
              console.log(e)
            }
          },
        },
        NewSound: {
          switchFunc: (key) => {
            console.log("新声音");
            this.setData({
              showSoundPop: true
            })
          }
        },
        Show: {
          switchFunc: (key) => {
            this.data.fakeShow = !this.data.fakeShow
            let sendData = this.data.acSwStatus.Show == 1 ? 0 : 1
            console.log("this.data.fakeShow", this.data.fakeShow);
            if (this.data.acstatus.runStatus == 0) {
              // app.globalData.DeviceComDecorator.showSwitch(1, key.widget_id, this.data.page_path)  
              console.log(key.widget_id, this.data.page_path);
              app.globalData.DeviceComDecorator.showSwitch(sendData, key.widget_id, '')
              this.data.acSwStatus.Show == 1 ? (app.globalData.DeviceComDecorator.AcProcess.parser
                .sendingState.screenShow = 7) : (app.globalData.DeviceComDecorator.AcProcess.parser
                .sendingState.screenShow = 0)
              // this.refreshBtnStatus();
              // app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.screenShow = !app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.screenShow
            } else {
              app.globalData.DeviceComDecorator.showSwitch(sendData, key.widget_id, this.data.page_path)
            }
          },
        },
        InitWifi: {
          switchFunc: () => {
            let that = this
            console.log(this.data.deviceInfo.onlineStatus);
            if (this.data.ctrlType != 1 && this.data.deviceInfo.onlineStatus == 1) {
              wx.showModal({
                content: '当前空调已开启远程控制',
                showCancel: false,
                confirmText: '好的',
              })
              return
            }
            console.log('go to init wifi', that.data.connectedDevice, that.data.deviceInfo)
            let addDeviceInfo = {
              adData: that.data.connectedDevice.adData,
              deviceName: that.data.deviceInfo.name,
              deviceImg: that.data.deviceInfo.deviceImg,
              mac: that.data.deviceInfo.btMac,
              deviceId: that.data.connectedDevice.deviceId,
              type: 'AC',
              sn8: that.data.deviceInfo.sn8,
              sn: that.data.deviceInfo.sn,
              mode: '21',
            }
            app.addDeviceInfo = addDeviceInfo
            console.log('Initwifi', app.addDeviceInfo)
            // app.addDeviceInfo.mode = 21;
            // app.globalData.addDeviceInfo.type = '';
            // app.globalData.addDeviceInfo.sn8 = that.data.deviceInfo.sn8;
            app.bluetoothConn.closeBLEConnection()
            wx.navigateTo({
              url: inputWifiInfo,
            })
          },
        },
        AboutDevice: {
          switchFunc: () => {
            wx.navigateTo({
              url: '../aboutMac/aboutMac?currDeviceInfo=' +
                encodeURIComponent(JSON.stringify(this.data.deviceInfo)) +
                '&deviceSnBle=' +
                this.data.deviceSnBle +
                '&ctrlType=' +
                this.data.ctrlType,
            })
          },
        },
        SelfCleaning: {
          switchFunc: () => {
            let that = this
            console.log('self=======***:', that.data.acNewStatus, that.data.acNewStatus.switchSelfCleaning)
            // let sendData = that.data.acNewStatus.selfCleaningSwitch == 1 ? 0 : 1
            let sendData = that.data.acNewStatus.switchSelfCleaning == 1 ? 0 : 1
            app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.timingOffSwitch = 0
            app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
            app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.runStatus = 0
            app.globalData.DeviceComDecorator.selfCleaningSwitch(sendData, key.widget_id, that.data.page_path)
            // app.globalData.DeviceComDecorator._queryStatus()
            // setTimeout(() => {
            //   wx.navigateBack({
            //     delta: 1,
            //   })
            // }, 1000)
          },
        },
        SafeMode: {
          switchFunc: () => {
            wx.navigateTo({
              url: '../saveModePage/saveModePage?deviceInfo=' +
                encodeURIComponent(JSON.stringify(this.data.deviceInfo)) +
                '&deviceSnBle=' +
                this.data.deviceSnBle +
                '&ctrlType=' +
                this.data.ctrlType,
            })
          },
        },
        CSEco: {
          switchFunc: () => {
            console.log('CSEco')
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return;
            }
            if (this.data.acstatus.mode == 2) {
              let sendData = this.data.acSwStatus.CSEco == 1 ? 0 : 1
              this.data.DeviceComDecorator.CSEcoSwitch(sendData, this.data.page_path)
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
            } else {
              wx.showToast({
                title: '舒省不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
            }
          },
        },
        UpDownAroundWind: {
          switchFunc: () => {
            console.log('UpDownAroundWind')
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            } else if (this.data.acstatus.mode != 5 && this.data.acstatus.mode != 2) {
              wx.showToast({
                title: '环绕风不能在自动、抽湿、制热模式下开启',
                icon: 'none',
              })
              return
            }
            this.setData({
              showUdRoundWindPopup: true,
            })
          },
          switchBtnFunc: () => {
            let sendData = this.data.acSwStatus.UpDownAroundWind == 1 ? 0 : 1
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 1
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.upDownAngle = 0 // 开上下风按钮，摆风角度置0
            this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftUpDownWind = 0 // 环绕风和上下风互斥，上下风置0
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.leftRightAngle = 0 // 开左右风按钮，摆风角度置0
            this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftLeftRightWind = 0
            this.data.DeviceComDecorator.AcProcess.parser.sendingState.rightLeftRightWind = 0

            console.log(sendData, 'UpDownAroundWind')
            this.data.DeviceComDecorator.aroundWindSwitch(
              sendData,
              this.data.acNewStatus.udAroundWindDirect,
              'click_ud_around_wind',
              this.data.page_path
            )
          },
        },
        CoolFreeDry: {
          switchFunc: () => {
            let data = !this.data.acSwStatus.CoolFreeDry
            console.log('干燥', data)
            if (this.data.acstatus.runStatus == 0 && !this.data.acSwStatus.CoolFreeDry) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acStatus.mode != 'cool' && this.data.acStatus.mode != 'dry') {
              wx.showToast({
                title: '干燥不能在自动、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }
            app.globalData.DeviceComDecorator.coolFreeSwitchDry(data)
          },
        },
        CoolPowerSaving: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acstatus.mode == 2) {
              let data = !this.data.acSwStatus.CoolPowerSaving;
              console.log('CoolPowerSaving----------------', data);
              app.globalData.DeviceComDecorator.coolPowerSavingSwitch(data, "", this.data.page_path);
            } else {
              wx.showToast({
                title: '酷省电仅在制冷模式下有效',
                icon: 'none',
              })
            }
          },
        },
        CoolPowerSavingNewName: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acstatus.mode == 2) {
              let data = !this.data.acSwStatus.CoolPowerSaving;
              console.log('CoolPowerSaving----------------', data);
              app.globalData.DeviceComDecorator.coolPowerSavingSwitch(data, "", this.data.page_path);
            } else {
              wx.showToast({
                title: '省电仅在制冷模式下有效',
                icon: 'none',
              })
            }
          },
        },
        DryNewName: {
          switchFunc: () => {
            let data = !this.data.acSwStatus.Dry
            console.log('内机防霉', data)
            if (this.data.acstatus.runStatus == 0 && !this.data.acSwStatus.Dry) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acStatus.mode != 'cool' && this.data.acStatus.mode != 'dry') {
              let title = '内机防霉不能在自动、送风模式下开启';
              if (this.data.isTH && !this.data.hasAuto) {
                title = '内机防霉不能在制热、送风模式下开启';
              } else {
                title = '内机防霉不能在自动、制热、送风模式下开启';
              }  
              wx.showToast({
                title: title,
                icon: 'none',
              })         
              return
            }
            let dryTips = wx.getStorageSync(`drytips_${this.data.deviceInfo.applianceCode}`)
            if (!this.data.acSwStatus.Dry && this.data.isKitchen) {
              this.setData({
                showDryNewNamePop: true
              })
            } else {
              this.doDryNewNameSwitch()
            }
          },
        },
        DryNewNameKitchen: {
          switchFunc: () => {
            let data = !this.data.acSwStatus.Dry
            console.log('内机防霉', data)
            if (this.data.acstatus.runStatus == 0 && !this.data.acSwStatus.Dry) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acStatus.mode != 'cool' && this.data.acStatus.mode != 'dry') {
              wx.showToast({
                title: '内机防霉不能在自动、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }
            let dryTips = wx.getStorageSync(`drytips_${this.data.deviceInfo.applianceCode}`)
            if (!this.data.acSwStatus.Dry && this.data.isKitchen && !dryTips) {
              this.setData({
                showDryNewNamePop: true
              })
            } else {
              this.doDryNewNameSwitch()
            }
          },
        },
        SleepCurve: {
          switchFunc: () => {
            /*console.log('terence' + JSON.stringify(key));
            if (app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.mode == 2 || app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.mode == 4) {
              let sendData = this.data.acSwStatus.SleepCurve ? 0 : 1;
              app.globalData.DeviceComDecorator.sleepCurveSwitch(sendData, key.widget_id, this.data.page_path);
            } else {
              wx.showToast({
                title: '只有在制冷/制热模式下才可启用睡眠模式',
                icon: 'none',
              })
            }*/
            if (this.data.acstatus.mode != 2 && this.data.acstatus.mode != 4) {
              wx.showToast({
                title: '只有在制冷/制热模式下才可启用睡眠模式',
                icon: 'none',
              })
              return
            }
            console.log('goto sleepCurve show data =================', JSON.stringify(this.data))
            wx.navigateTo({
              url: '../sleepCurve/sleepCurve?' +
                'acstatus=' +
                JSON.stringify(this.data.acstatus) +
                '&ctrlType=' +
                this.data.ctrlType +
                '&data=' +
                encodeURIComponent(JSON.stringify(this.data)),
            })
          },
        },
        Supercooling: {
          switchFunc: (key) => {
            console.log('Supercooling')
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return;
            }
            if (this.data.acstatus.mode == 2) {
              let sendData = this.data.acNewStatus.superCoolingSw == 1 ? 0 : 1
              app.globalData.DeviceComDecorator.smartCooling(sendData, key.widget_id, this.data.page_path)
              app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.windSpeed = 102
              app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.cosySleepMode = 0
              if (this.data.acstatus.tempSet < 26) {
                app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.tempSet = parseFloat(26.0)
                app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.tempSet2 = parseFloat(26.0)
              }
              // app.globalData.DeviceComDecorator.AcProcess.parser.nwesendingState.switchNonDirectWind = 1;
            } else {
              let text = this.data.hasAuto ? '智控温不能在自动、抽湿、制热、送风模式下开启' : '智控温不能在抽湿、制热、送风模式下开启'
              wx.showToast({
                title: text,
                icon: 'none',
              })
            }
          },
        },
        Voice: {
          switchFunc: (key) => {
            let sendData = this.data.acSwStatus.Voice == 1 ? 0 : 1
            app.globalData.DeviceComDecorator.voiceFuncSwitch(sendData, key.widget_id, this.data.page_path)
          },
        },
        UpNoWindFeel: {
          switchFunc: () => {
            console.log(this.data.acSwStatus.UpNoWindFeel)
            if (this.data.acstatus.runStatus == 0) {
              this.showWxToast('空调已关，请先开空调');
              return;
            }
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
            this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftLeftRightWind = 0
            this.data.DeviceComDecorator.upNoWindFeelSwitch(
              this.data.acNewStatus.controlSwitchNoWindFeel,
              'click_up_nowind_feel',
              this.data.page_path,
              this.data.acSwStatus.UpNoWindFeel
            )
          },
        },
        DownNoWindFeel: {
          switchFunc: () => {
            console.log(this.data.acSwStatus.DownNoWindFeel)
            // let sendData = this.data.acSwStatus.DownNoWindFeel ? 0 : 1;
            if (this.data.acstatus.runStatus == 0) {
              this.showWxToast('空调已关，请先开空调');
              return;
            }
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }
            this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
            this.data.DeviceComDecorator.AcProcess.parser.sendingState.downWind = 0
            this.data.DeviceComDecorator.downNoWindFeelSwitch(
              this.data.acNewStatus.controlSwitchNoWindFeel,
              'click_down_nowind_feel',
              this.data.page_path,
              this.data.acSwStatus.DownNoWindFeel
            )
          },
        },
        UpDownWindBlowing: {
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acstatus.mode != 1 && this.data.acstatus.mode != 4) {
              this.setData({
                showUpDownWindBlowing: true,
              })
            } else {
              wx.showToast({
                title: '防直吹不能在自动、制热模式下开启',
                icon: 'none',
              })
            }
          },
        },
        UpSwipeWind: {
          switchFunc: () => {
            let data = !this.data.acSwStatus.UpSwipeWind
            if (this.data.acSwStatus.UpNoWindFeel && this.data.acSwStatus.DownNoWindFeel) {
              // 上下无风感都打开
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel =
                3 // 保留下无风感开
            } else if (!this.data.acSwStatus.UpNoWindFeel && this.data.acSwStatus.DownNoWindFeel) {
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel =
                3 // 保留下无风感开
            } else {
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel =
                0 // 关闭全部无风感
            }
            app.globalData.DeviceComDecorator.switchUpLeftRightSwipe(
              data,
              this.data.acstatus,
              'click_up_swipe_wind',
              this.data.page_path
            )
          },
        },
        DownSwipeWind: {
          switchFunc: () => {
            let data = !this.data.acSwStatus.DownSwipeWind
            if (this.data.acSwStatus.UpNoWindFeel && this.data.acSwStatus.DownNoWindFeel) {
              // 上下无风感都打开
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel =
                2 // 只留上无风感
            } else if (this.data.acSwStatus.UpNoWindFeel && !this.data.acSwStatus.DownNoWindFeel) {
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel =
                2 // 只留上无风感
            } else {
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel =
                0 // 关闭全部无风感
            }
            app.globalData.DeviceComDecorator.switchDownLeftRightSwipe(
              data,
              this.data.acstatus,
              'click_down_swipe_wind',
              this.data.page_path
            )
          },
        },
        Dry: {
          switchFunc: () => {
            let data = !this.data.acSwStatus.Dry
            console.log('干燥', data)
            if (this.data.acstatus.runStatus == 0 && !this.data.acSwStatus.Dry) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acStatus.mode != 'cool' && this.data.acStatus.mode != 'dry') {
              wx.showToast({
                title: '干燥不能在自动、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }
            // app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.switchSelfCleaning = 0
            app.globalData.DeviceComDecorator.switchDry(data)
          },
        },
        FilterClean: {
          switchFunc: () => {
            this.goToFilterClean()
          },
        },
        PowerManager: {
          switchFunc: () => {
            console.log('电量统计')
            wx.navigateTo({
              url: '../electric/electric?' +
                'acstatus=' +
                JSON.stringify(this.data.acstatus) +
                '&ctrlType=' +
                this.data.ctrlType +
                '&data=' +
                encodeURIComponent(JSON.stringify(this.data)),
            })
          },
        },
        softWindFeel: {
          switchFunc: () => {
            console.log('柔风感')
            let data = !this.data.acSwStatus.softWindFeel;
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '柔风感不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }
            app.globalData.DeviceComDecorator.softWindFeel(data, "", this.data.page_path);
          },
        },
        AutomaticAntiColdAir: {
          // 主动防冷风
          switchFunc: () => {
            if (this.data.acstatus.runStatus == 0) {
              this.showWxToast('空调已关，请先开空调');
              return;
            }
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '主动防冷风不能在自动、抽湿、制热、送风模式下开启',
                icon: 'none',
              })
              return
            }
            let data = !this.data.acSwStatus.AutomaticAntiColdAir;
            this.setData({
              showAutoColdWindPopup: true
            })
            // if (data) {
            //   this.setData({
            //     showAutoColdWindPopup: true
            //   })
            // } else {
            //   app.globalData.DeviceComDecorator.automaticAntiColdAirSwitch(data,
            //     "click_auto_prevent_cold_wind", this.data.page_path);
            // }
          },
        },
        Degerming: { // 杀菌          
          switchFunc: () => {
            let data = !this.data.acSwStatus.Degerming;
            console.log('Degerming----------------', data);
            app.globalData.DeviceComDecorator.degermingSwitch(data, "", this.data.page_path);
          },
        },        
        AroundWind: {
          switchFunc: () => {
            if (this.data.acStatus.mode == 'dry') {
              wx.showToast({
                title: '环绕风在抽湿下不可开启',
                icon: 'none',
              })
              return
            }
            let data = !this.data.acSwStatus.AroundWind;
            console.log('HY1AroundWindSwitch----------------', data);
            app.globalData.DeviceComDecorator.HY1AroundWindSwitch(data, "", this.data.page_path);
          },
        },
        WaterFallWind: {
          switchFunc: () => {
            if (this.data.acStatus.mode == 'dry') {
              wx.showToast({
                title: '巨瀑风在抽湿下不可开启',
                icon: 'none',
              })
              return
            }
            let data = !this.data.acSwStatus.AroundWind;
            app.globalData.DeviceComDecorator.HY1AroundWindSwitch(data, "", this.data.page_path);
          },
        },
        ThSoftWindFeel: {
          switchFunc: () => {
            console.log('TH柔风感')
            let data = !this.data.acSwStatus.ThSoftWindFeel;
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '柔风感只能在制冷模式下开启',
                icon: 'none',
              })
              return
            }
            app.globalData.DeviceComDecorator.thSoftWindFeelSwitch(data, "", this.data.page_path);
          },
        },
        QuickCoolHeat: {
          switchFunc: () => {              
            if (this.data.acStatus.mode != 'heat' && this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '速冷热在抽湿、送风、自动下不可开启',
                icon: 'none',
              })
              return
            }
            let data = !this.data.acSwStatus.QuickCoolHeat;
            app.globalData.DeviceComDecorator.switchQuickCoolHeat(data,"",this.data.page_path);
          },
        },
        DownSwipeWind00Ae: {
          switchFunc: () => {
            let data = !this.data.acSwStatus.DownSwipeWind00Ae
            if (this.data.acSwStatus.UpNoWindFeel && this.data.acSwStatus.DownNoWindFeel) {
              // 上下无风感都打开
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 2 // 只留上无风感
            } else if (this.data.acSwStatus.UpNoWindFeel && !this.data.acSwStatus.DownNoWindFeel) {
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 2 // 只留上无风感
            } else {
              this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0 // 关闭全部无风感
            }
            app.globalData.DeviceComDecorator.switchDownLeftRightSwipe_00ae(
              data,
              this.data.acstatus,
              'click_down_swipe_wind',
              this.data.page_path
            )
          },
        },
        ThUpNoWindFeel: {
          switchFunc: () => {
            console.log(this.data.acSwStatus.UpNoWindFeel)
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '设备已关，请先开机',
                icon: 'none',
              })
              return
            }   
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感仅在制冷模式下有效',
                icon: 'none',
              })
              return
            }           
            this.data.DeviceComDecorator.upNoWindFeelSwitch(
              this.data.acNewStatus.controlSwitchNoWindFeel,
              'click_up_nowind_feel',
              this.data.page_path,
              this.data.acSwStatus.ThUpNoWindFeel
            )
          },
        },
        ThDownNoWindFeel: {
          switchFunc: () => {
            console.log(this.data.acSwStatus.DownNoWindFeel)
            // let sendData = this.data.acSwStatus.DownNoWindFeel ? 0 : 1;
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '设备已关，请先开机',
                icon: 'none',
              })
              return
            }   
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感仅在制冷模式下有效',
                icon: 'none',
              })
              return
            }  
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '无风感仅在制冷模式下有效',
                icon: 'none',
              })
              return
            }           
            this.data.DeviceComDecorator.downNoWindFeelSwitch(
              this.data.acNewStatus.controlSwitchNoWindFeel,
              'click_down_nowind_feel',
              this.data.page_path,
              this.data.acSwStatus.ThDownNoWindFeel
            )
          },
        },
        UpLeftRightDownLeftRightWindAngle: {
          switchFunc: () => {
            console.log('UpLeftRightDownLeftRightWindAngle');
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            this.setData({
              showUpLrDwonLrPopup: true, //展示底部左右风
            })
          },
          btnSelectFunc: () => {},
          switchBtnFunc: () => {
            
          },
        },
        CleanFunc: { // 净化功能
          switchFunc: (key) => {
            console.log('净化功能')
            this.setData({
              showPurify: true
            })
          },
        },
        KeepWet: { // 保湿功能
          switchFunc: (key) => {
            console.log('保湿功能')      
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return
            }
            if (this.data.acStatus.mode != 'cool') {
              wx.showToast({
                title: '保湿不能在制热、抽湿、送风模式下调节',
                icon: 'none',
              })
              return
            }
            this.setData({
              showKeepWetPopup: true
            })      
          },
        },
        BackWarmRemoveWet: { // 回温除湿功能
          switchFunc: (key) => {
            if (this.data.acStatus.mode != 'dry') {
              wx.showToast({
                title: '回温除湿只在抽湿模式下有效',
                icon: 'none',
              })
              return;
            }
            let flag = !this.data.acSwStatus.BackWarmRemoveWet;
            app.globalData.DeviceComDecorator.BackWarmRemoveWetSwitch(flag);
            console.log('回温除湿功能')
          },
        },
        TargetIndoorTemp: { // 目标室温
          switchFunc: (key) => {
            console.log('目标室温')
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '设备已关，请先开机',
                icon: 'none',
              })
              return
            }           
            this.setData({
              showTargetTemp: true
            })            
          },
        },
        NorthWarmAppointment: {
          switchFunc: (key) => {
            wx.navigateTo({
              url: '../timerSet/timerSet?' + 'ctrlType=' +
              this.data.ctrlType,
            })
          },
        },
        NorthWarmMode: {
          switchFunc: (key) => {            
            this.setData({
              showNorthWarmPopup: true
            })
          },
        },
        NorthWarmAuto: {
          switchFunc: (key) => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '设备已关，请先开机',
                icon: 'none',
              })
              return
            }
            if (this.data.acStatus.mode == 'smart_mode') {
              wx.showToast({
                title: '智能模式下不可设置自动水温',
                icon: 'none',
              })
              return
            }
            let data = !this.data.acSwStatus.NorthWarmAuto
            this.data.DeviceComDecorator.northWarmAutoTemp(data, this.data.acstatus, '', '')
            // "water_model_temperature_auto":"off"
          },
        },
        NorthWarmGoOut: {
          switchFunc: (key) => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '设备已关，请先开机',
                icon: 'none',
              })
              return
            }
            let data = !this.data.acSwStatus.NorthWarmGoOut
            this.data.DeviceComDecorator.northWarmGoOut(data, this.data.acstatus, '', '')           
          },
        },
        NorthWarmQuiet: {
          switchFunc: (key) => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '设备已关，请先开机',
                icon: 'none',
              })
              return
            }
            let data = !this.data.acSwStatus.NorthWarmQuiet
            this.data.DeviceComDecorator.northWarmQuiet(data, this.data.acstatus, '', '')           
          },
        }, 
        NorthWarmSaveEnergy: {
          switchFunc: (key) => {
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '设备已关，请先开机',
                icon: 'none',
              })
              return
            }
            let data = !this.data.acSwStatus.NorthWarmSaveEnergy
            this.data.DeviceComDecorator.northWarmECO(data, this.data.acstatus, '', '')           
          },
        }, 
        ThLight: {
          switchFunc: (key) => {
            console.log("灯光");
            let flag = !this.data.acSwStatus.ThLight;
            app.globalData.DeviceComDecorator.ThLightSwitch(flag);
          }
        },
        UpWindBlowing: {
          switchFunc: (key) => {
            console.log("上防直吹");   
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return;
            }
            if (this.data.acstatus.mode == 1 || this
              .data.acstatus.mode == 4) {
                wx.showToast({
                  title: '上防直吹不能在自动、制热模式下开启',
                  icon: 'none',
                })
                return;
            }
            this.setData({
              showUpWindBlowingPopup: true
            })        
          }
        },
        DownWindBlowing: {
          switchFunc: (key) => {            
            if (this.data.acstatus.runStatus == 0) {
              wx.showToast({
                title: '空调已关，请先开空调',
                icon: 'none',
              })
              return;
            }
            if (this.data.acstatus.mode == 1 || this
              .data.acstatus.mode == 4) {
                wx.showToast({
                  title: '下防直吹不能在自动、制热模式下开启',
                  icon: 'none',
                })
                return;
            }
            let flag = !this.data.acSwStatus.DownWindBlowing;
            app.globalData.DeviceComDecorator.UpDownNoWindBlowingSwitch(flag,3);               
          }
        },
        LoopFan: {
          switchFunc: (key) => {
            console.log("循环扇");   
            if(this.data.acstatus.mode != 2) {
              wx.showToast({
                title: '调温循环扇只在制冷模式下可用',
                icon: 'none',
              })
              return;
            }
            this.setData({
              showCircleFanPopup: true
            })        
          }
        },
      },
    })
  },
  toOpenDryNewName() {
    this.hidePopup()
    this.doDryNewNameSwitch()
    if (this.data.isSelectDryTip) {
      this.setLocalDryNewName()
    }
  },
  setLocalDryNewName() {
    wx.setStorageSync(`drytips_${this.data.deviceInfo.applianceCode}`, '1')
  },
  doDryNewNameSwitch() {
    let data = !this.data.acSwStatus.Dry
    // console.log('内机防霉', data)
    // if (this.data.acstatus.runStatus == 0 && !this.data.acSwStatus.Dry) {
    //   wx.showToast({
    //     title: '关机下内机防霉不可开',
    //     icon: 'none',
    //   })
    //   return
    // }
    // if (this.data.acStatus.mode != 'cool' && this.data.acStatus.mode != 'dry') {
    //   wx.showToast({
    //     title: '内机防霉只能在制冷或抽湿模式下开启',
    //     icon: 'none',
    //   })
    //   return
    // }
    // app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.switchSelfCleaning = 0
    app.globalData.DeviceComDecorator.switchDry(data)
  },
  catchSliderTouchStart() {},

  showOrHideModePopup(show) {
    if (this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none',
      })
      return
    }
    this.setData({
      showModePopup: show,
      // modePopupMode: this.data.acStatus.mode
    })
  },
  hidePopup() {
    this.setData({
      showModePopup: false,
      showLeftPopup: false,
      showUpDownPopup: false,
      showUdRoundWindPopup: false,
      openTimerPicker: false,
      showQuickFryWindPop: false,
      showDryNewNamePop: false,
      showUpDownWindBlowing: false,
      showSelfCleanConfirmPopup: false,
      showFreshAirPop: false,
      showUpLrDwonLrPopup: false,
      showKeepWetPopup: false,
      showPurify: false,
      showTargetTemp: false,
      showNorthWarmPopup: false,
      showTargetTempSwitchPop: false,
      showTempSetTips: false,
      showLeftRightSwipePopup: false,
      showUpDownSwipePopup: false,
      showUpDownAngleLrPopup: false,
      showLeftRightAngleLrPopup: false,
      showUpWindBlowingPopup: false,
      showCircleFanPopup: false, 
      showSoundPop: false,
    })
  },
  queryManager() {
    // 区分使用何种协议查询状态
    if (this.data.isCoolFree) {
      // 查询新酷风
      this.coolFreeQuery();
    } else if(this.data.isNorthWarm) {
      // 查询北方采暖
      this.northWarmQuery();
    } else {
      // 其他查询
      this.query();
    }
  },
  unpackManager(data) {
    if (this.data.isCoolFree) {
      if (data[9] == 0x03 && data[10] == 0xbb && data[15] == 0x11 || data[9] == 0x02 && data[10] == 0xbb && data[
          15] == 0x20) {
        console.log('过滤上报，只响应查询和返回')
        this.data.DeviceComDecorator.AcProcess.parseCoolFreeAcceptPackage(data)
        this.refreshSendingStateStatus();
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {},
          })
        }, 1000);
      }
    } else {
      // 其他经典组包      
      this.data.DeviceComDecorator.AcProcess.parseAcceptPackage(data)
      this.refreshSendingStateStatus();
    }
  },
  query() {
    this.data.DeviceComDecorator._queryStatus(true) // 查询设备状态
    this.data.DeviceComDecorator._queryStatusNewProtocol('');
  },
  coolFreeQuery() {
    console.log('酷风查询');
    this.data.DeviceComDecorator._queryStatusCoolFree();
    this.data.DeviceComDecorator._queryStatusCoolFreeRunstatus();
  },
  northWarmQuery() {
    this.data.DeviceComDecorator._queryStatusNorthWarm();
    this.data.DeviceComDecorator._queryTimerStatusNorthWarm();
  },
  /*.........................................机型功能匹配......最新引入................................*/
  generateFuncs(sn8) {
    this.setData({
      deviceSn8: sn8,
    })
    this.getProductImg(sn8)
    console.log(sn8, 'sn8888888888888888888888')
    // 00000021122012185091802902930000
    FuncMatchBase.SNFuncMatch = SNFuncMatch
    FuncMatchBase.FuncDefault = FuncDefault
    FuncMatchBase.FuncOrder = FuncOrder
    FuncMatchBase.FuncMetaType = FuncMetaType
    FuncMatchBase.FuncType = FuncType
    // let sn5 = sn8.slice(3);

    let sn = '000000211' + sn8 + '091802902930000'
    // 
    // let sn = '000000211' + '220Z1487' + '091802902930000'
    let deviceSubType = SnProcess.getAcSubType(sn) ? SnProcess.getAcSubType(sn) : '';    
    console.log(deviceSubType, "deviceSubType--------------");

    // if(this.data.isCoolFree || deviceSubType == 'COOLFREE') {
    //   FuncMatchBase.FuncDefault = FuncCoolFreeDefault
    // } else {
    //   FuncMatchBase.FuncDefault = FuncDefault
    // }
    // sn = "00000021122070017091802902930000"

    console.log('生成sn', sn)
    let obj = SnProcess.getAcFunc(sn, true)
    console.log(obj, ">>>>>>", obj.home.noneControlFunc.hasuseTH);
    this.setData({
      hasFuncObj: obj,
      hasPoint5: obj.home.noneControlFunc.hasDot5Support,
      has16: obj.home.noneControlFunc.has_16Support,      
      isCoolFree: deviceSubType.indexOf("COOLFREE") >= 0 || obj.home.noneControlFunc.hasisCoolFree,
      isKitchenFG100: deviceSubType == '_FG100',
      isKitchenXD200: deviceSubType == '_XD200',
      isKitchen: deviceSubType == '_FG100' || deviceSubType == '_XD200',
      isTH: obj.home.noneControlFunc.hasuseTH || (deviceSubType == 'T5_35_BLE' || deviceSubType == 'T3_35_BLE' || deviceSubType == 'T5_72_BLE' ||
        deviceSubType == 'JP1_1' || deviceSubType == 'FA1_1' || deviceSubType == 'FA1_1_51_72' || deviceSubType == 'offline_voice_SN1_QJ201_MZA1'),
      deviceSubType: deviceSubType ? deviceSubType : '',
      isNorthWarm: obj.home.noneControlFunc.hasuseNorthWarm,   
      hasAutoPrentColdWindMenory: obj.home.noneControlFunc.hashasAutoPreventColdWindMemory
    })
    this.setData({
      useThFreshAir: deviceSubType == 'T5_35_BLE' || deviceSubType == 'T3_35_BLE' || deviceSubType == 'T5_72_BLE' 
    })
    app.globalData.hasFuncs = obj;
    console.log('objobjobjobj', obj, '0.5度支持' + obj.home.noneControlFunc.hasDot5Support, '16度支持' + obj.home
      .noneControlFunc.has_16Support , )
    // let allBtn = obj.home.controlFunc.concat(obj.more.controlFunc)

    let allBtn = SnProcess.getSnOrder(sn, false)
    let defaultSwitch = ['DeviceSwitch'];
    let modeBtn = this.data.bottomModeBtn;
    if (this.data.isKitchen || this.data.isNorthWarm) { // 过滤厨房空调不展示的button, 过滤北方采暖器
      allBtn = allBtn.filter(x => ((x !=
        'ElectricHeat') && (x != 'Sound') && (x != 'Show')))
      if (this.data.isNorthWarm) {
        allBtn = allBtn.filter(x => ((x !=
          'AppointmentSwitchOff')))
      }
      modeBtn = modeBtn.filter(x => (x.id != 'heat'))
    }

    if (obj.more.controlFunc.hasNewSound) { // 过滤掉使用新的声音的机型的旧声音功能
      allBtn = allBtn.filter(x => (x != 'Sound'))
    }

    allBtn = defaultSwitch.concat(allBtn);
    this.setData({
      allBtn: allBtn,
      bottomModeBtn: modeBtn
    })


    // 获取ALL btn之后组出 风向、风感、其他、远程 + 密码锁、剩下的其他功能
    this.generateEachPartBtn(allBtn);
    // this.generateMoreFuncs(allBtn)
    // this.generateHomeFuncs(allBtn)
    this.setData({
      hasAuto: allBtn.indexOf('ModeControl') > -1, // 标记模式选择中是否带自动模式
    })

    console.log(allBtn, "首页看allbtn")
  },
  // 组出各个模块的功能
  generateEachPartBtn(allBtn) {
    // let func = allBtn.slice(1);
    let funcType = FuncMatchBase.FuncType;
    let udDirectArr = [];
    let lrDirectArr = [];
    let windFeelBtn = [];
    let otherBtn = [];
    let cellArr = [];
    let basicBtn = [];
    let bleSpecialBtn = [];
    let kitchenSpecialBtn = [];
    let singleDirectArr = [];

    allBtn.forEach(element => {
      if (funcType[element].btnType && funcType[element].btnType == 'lrSwipeDirect') { // 筛选风向和摆风
        lrDirectArr.push(Btns[element]);
      }

      if (funcType[element].btnType && funcType[element].btnType == 'udSwipeDirect') {
        udDirectArr.push(Btns[element]);
      }

      if (udDirectArr.length > 0) {
        singleDirectArr = udDirectArr
      } else if (lrDirectArr.length > 0) {
        singleDirectArr = lrDirectArr
      }

      if (funcType[element].btnType && funcType[element].btnType == 'windFeel') {
        windFeelBtn.push(Btns[element])
      }

      if (funcType[element].btnType && funcType[element].btnType == 'other') {
        otherBtn.push(Btns[element])
      }

      if (funcType[element].btnType && funcType[element].btnType == 'cell') {
        cellArr.push(Btns[element])
      }

      if (funcType[element].btnType && funcType[element].btnType == 'bottom-fixed') {
        basicBtn.push(Btns[element])
      }

      if (funcType[element].btnType && funcType[element].btnType == 'ble') {
        bleSpecialBtn.push(Btns[element])
      }

      if (funcType[element].btnType && funcType[element].btnType == 'kitchen') {
        kitchenSpecialBtn.push(Btns[element])
      }





    });

    this.setData({
      lrDirectArr,
      udDirectArr,
      singleDirectArr,
      windFeelBtn,
      otherBtn,
      cellArr,
      basicBtn,
      bleSpecialBtn,
      kitchenSpecialBtn
    })
    console.log("generateEachPartBtn", FuncMatchBase.FuncType, windFeelBtn, basicBtn);
  },

  // generateWindFeelBtn(allBtn) {
  //   let windFeelBtn = [];
  //   allBtn
  // },
  generateHomeFuncs(allBtn) {
    let func = allBtn.slice(0, 4)
    let funcArr = []
    for (let i = 0; i < func.length; i++) {
      funcArr.push(Btns[func[i]])
    }
    this.setData({
      basicBtn: funcArr,
    })
    console.log(funcArr, 'funcArr======')
  },
  generateMoreFuncs(allBtn) {
    console.log(allBtn, 'allBtn======')

    let func = allBtn.slice(4, allBtn.length)
    let funcArr = []
    for (let i = 0; i < func.length; i++) {
      funcArr.push(Btns[func[i]])
    }
    this.setData({
      modalBtn: funcArr,
    })
    console.log(this.data.modalBtn, 'modalBtn')
  },
  calculateTemp(temp) {
    let _is = parseInt(temp) > 30 ? 30 : parseInt(temp) < 16 ? 16 : parseInt(temp)
    let _is5 = (temp - parseInt(temp)) * 10 === 0 ? 0 : 0.5
    return {
      _is: _is,
      _is5: _is5,
    }
  },
  calCircleVal(temp) {
    //1%-100%
    //1-75度
    let range = (this.data.tempValCfg.max - this.data.tempValCfg.min) / 0.5
    let nowRange = (temp - this.data.tempValCfg.min) / 0.5

    let deg = (nowRange * 75) / range
    this.setData({
      'circleData.value': deg == 0 ? 1 : deg,
    })
    console.log(deg, 'calCircleVal', this.data.circleData.value)
  },
  initDeviceCom(bluetoothConn, callback) {
    let that = this
    // if (!that.data.DeviceComDecorator) {    
    app.globalData.DeviceComDecorator = new DeviceComDecorator(
      bluetoothConn,
      that.data.deviceInfo.applianceCode,
      this.data.ctrlType,
      app.globalData.currentSn,
      this.data.deviceSn8,
    )
    // let DeviceCom = new DeviceComDecorator(this.data.deviceInfo.applianceCode, app.bluetoothConn);
    console.log(app.globalData.DeviceComDecorator, 'app.globalData.DeviceComDecorator')
    that.setData({
      DeviceComDecorator: app.globalData.DeviceComDecorator,
    })
    console.log('init devicecom')
    callback && callback()
    // } else {
    //     console.log('init devicecom else');
    //     callback && callback();
    // }
  },
  calHourStr(hour, minute) {
    console.log("calHourStr", hour, minute)
    let prefix = ""
    let endFix = "后关机"
    let hStr = hour.toString().split('.')[0]
    if (hStr == 0) {
      this.setData({
        showHourAndMin: (minute == 0 ? 1 : minute) + '分' + endFix,
        showHourAndMinCell: this.data.acstatus.timingOffSwitch ? ((minute == 0 ? 1 : minute) + '分' + '后') : "",
      })
    } else {
      // hStr = hStr < 10 ? ("0" + hStr) : hStr
      let min = minute == 0 ? '' : minute
      this.setData({
        showHourAndMin: prefix + hStr + '小时' + min + (min == 0 ? '' : '分') + endFix,
        showHourAndMinCell: this.data.acstatus.timingOffSwitch ? (prefix + hStr + '小时' + min + (min == 0 ? '' : '分') + '后') : "",
      })
    }
  },
  calOnHourStr(hour, minute) {
    console.log("calOnHourStr", hour, minute)
    let prefix = ""
    let endFix = "后开机"
    let hStr = hour.toString().split('.')[0]
    if (hStr == 0) {
      this.setData({
        showHourAndMinOn: (minute == 0 ? 1 : minute) + '分' + endFix,
        showHourAndMinOnCell: this.data.acstatus.timingOnSwitch ? ((minute == 0 ? 1 : minute) + '分' + '后') : '',
      })
    } else {
      // hStr = hStr < 10 ? ("0" + hStr) : hStr
      let min = minute == 0 ? '' : minute
      this.setData({
        showHourAndMinOn: prefix + hStr + '小时' + min + (min == 0 ? '' : '分') + endFix,
        showHourAndMinOnCell: this.data.acstatus.timingOnSwitch ? (prefix + hStr + '小时' + min + (min == 0 ? '' : '分') + '后') : '',
      })
    }
  },
  /**  end*************************************/ ////

  /*******连接部分 */
  async openBluetoothAdapter() {
    let that = this
    console.log("openBluetoothAdapter------");
    // wx.closeBluetoothAdapter({})

    wx.openBluetoothAdapter({
      success: function () {
        console.log('openBluetoothAdapter success')
        bluetoothOpen = true
        //搜索已连接的设备是否能被发现，能被发现则显示蓝色蓝牙图标，不能则显示灰色蓝牙图标
        that.startDiscovery()
      },
      fail: function (res) {
        console.log('openBluetoothAdapter fail', res, bluetoothOpen)
        if (res.errCode == '10001') {
          wx.showModal({
            title: '提示',
            content: '当前蓝牙不可用请检查手机蓝牙开关',
            showCancel: false,

            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                // wx.reLaunch({
                //     url: '/pages/index/index',
                // })
                wx.navigateBack({
                  delta: 1,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            },
          })
        } else if(res.errno == '103') {
          wx.showModal({
            title: '提示',
            content: '微信小程序蓝牙使用权限未打开，点击小程序右上角 "..."， 在设置中打开蓝牙权限',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')                
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            },
          })
        }
      },
    })
  },
  async startDiscovery() {
    var that = this
    var infoRes = wx.getSystemInfoSync()
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: infoRes.platform == 'android' ? true : false,
      powerLevel: 'high',
    })

    let tempArray = []
    wx.showLoading({
      title: '连接中...',
      mask: true
    })
    let timer = setTimeout(() => {
      wx.stopBluetoothDevicesDiscovery({
        success() {
          // wx.showToast({
          //     title: '连接超时...',
          //     icon: 'none'
          // });
          if (!that.data.connectSuccess) {
            wx.hideLoading({
              success: () => {},
            })
            let pages = getCurrentPages() //获取加载的页面
            let currentPage = pages[pages.length - 1];
            if (currentPage.route != "plugin/T0xAC/index/index" && currentPage.route !=
              "plugin/T0xAC/moreFun/moreFun" && currentPage.route != 'src/modules/module_plugin/T0xAC/index/index') {
              return;
            }
            wx.showModal({
              content: '连接超时，设备被他人连接中或设备不在您的附近，请返回小程序首页重新连接',
              showCancel: false,
              confirmText: '好的',
              success(res) {
                wx.closeBluetoothAdapter({})
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                } else {
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              },
            })
          }
          console.log('停止搜索curDevice', that.data.curDevice)
        },
      })
    }, 15000)
    that.setData({
      overTimer: timer,
    })
    //监听发现设备
    wx.onBluetoothDeviceFound(function (res) {
      // wx.showLoading({
      //     title: '连接中...',
      // })
      console.log('发现新设备:', res.devices.length, res.devices[0].deviceId.split(":").join("").toLowerCase(), res
        .devices[0].deviceId, res.devices[0].advertisData)



      for (let i = 0; i < res.devices.length; i++) {
        if (!res.devices[i].advertisData || res.devices[i].advertisData.byteLength < 27) {
          continue
        }
        res.devices[i].advertisData = res.devices[i].advertisData.slice(0, 27);
        let cid = Common.ab2hex(new Uint8Array(res.devices[i].advertisData.slice(0, 2)));
        if (cid != 'a806') { // 标识为空调
          continue;
        }
        //console.log(Common.ab2hex(res.devices[i].advertisData))
        // if (res.devices[i].advertisServiceUUIDs && res.devices[i].advertisServiceUUIDs.length > 0) {
        //if (res.devices[i].advertisServiceUUIDs[0].substring(4, 8) == 'FFB1') {
        //console.log('发现设备:', res.devices[i])
        //res.devices[i].advertisData = Common.ab2hex(res.devices[i].advertisData);//
        // if (res.devices[i].RSSI < -80) {
        //     continue;
        // }

        app.scanDeviceMap['device_' + res.devices[i].deviceId] = res.devices[i]
        if (!rssiMap[res.devices[i].deviceId]) {
          rssiMap[res.devices[i].deviceId] = []
        }
        rssiMap[res.devices[i].deviceId].push(res.devices[i].RSSI)
        if (rssiMap[res.devices[i].deviceId].length > rssiCheckSize) {
          rssiMap[res.devices[i].deviceId].shift()
        }

        let neard = that.data.nearbyDevices
        neard[res.devices[i].deviceId] = true
        that.setData({
          nearbyDevices: neard,
        })

        // let index = tempArray.findIndex((x) => x.deviceId == res.devices[i].deviceId)
        // here you can check specific property for an object whether it exist in your array or not
        let sn3 = BleCommon.uintArray2String(res.devices[i].advertisData.slice(3, 6))
        if (sn3 != 220 && sn3 != 222 && sn3 != 223 && sn3 != 240 && sn3 != 129) {
          continue
        }
        console.log('发现设备广播包：', res.devices[i].deviceId, BleCommon.ab2hex(res.devices[i].advertisData), res
          .devices[i])
        let mac = new Uint8Array(res.devices[i].advertisData.slice(21, 27)).reverse()
        res.devices[i].mac = BleCommon.ab2hex(mac)
        res.devices[i].sn3 = sn3
        res.devices[i].adData = BleCommon.ab2hex(res.devices[i].advertisData)

        tempArray.push(res.devices[i])
        tempArray.sort(compare)
        console.log('tempArray-------', tempArray)
        for (let ti = 0; ti < tempArray.length; ti++) {
          tempArray[ti].name = '华凌空调'
          if (tempArray[ti].mac == that.data.deviceInfo.btMac.toLowerCase()) {
            console.log(tempArray[ti].mac, that.data.deviceInfo.btMac.toLowerCase(), '比对两个mac')
            wx.stopBluetoothDevicesDiscovery({
              success() {
                console.log('找到对应的设备啦，停止搜索')
              },
            })
            that.setData({
              connectedDevice: tempArray[ti],
            })
            console.log('保存连接的设备：', that.data.connectedDevice)
            break
          }
        }
        console.log('看看break出来的找到的设备是啥', that.data.connectedDevice)
        if (!that.data.hasFound && that.data.connectedDevice.mac == that.data.deviceInfo.btMac
          .toLowerCase()) {
          that.setData({
            hasFound: true, // 设置成true，下次即使再找到设备也不进入
          })
          console.log('进来准备连接的地方', that.data.connectedDevice.mac, that.data.deviceInfo.btMac.toLowerCase())
          setTimeout(() => {
            that.connectFunc(that.data.connectedDevice)
          }, 1000)
        }
        // 安全模式
        // wx.request({
        //     url: 'https://smartrac.midea.com/bluetooth/control/safeMode/query',
        //     method: 'POST',
        //     data: {
        //         mac: Common.ab2hex(mac)
        //     },
        //     success(res) {
        //         app.secureModeMap[Common.ab2hex(mac)] = res.data.result.open;
        //     }
        // })
        // }
      }
    })
  },
  connectDevice(_device, callback) {
    // await this.wahinLogin() //华凌登录

    var _deviceId = _device.deviceId
    // var rssi = event.currentTarget.dataset.rssi;
    let device = app.scanDeviceMap['device_' + _deviceId]
    console.log(device, 'device_' + _deviceId, 'connectDevice--------------')
    let sessionKeyCreateTime = device.sessionKeyCreateTime
    if (new Date().getTime() - sessionKeyCreateTime <= 7 * 24 * 3600 * 1000) {
      device.sessionKey = Common.fromHexString(device.sessionKey)
    } else {
      device.sessionKey = null
    }
    if (device.advertisData.byteLength == 27) {
      let category = device.advertisData.slice(11, 13)
      console.log('=============', category)
      device.category = Common.uintArray2String(new Uint8Array(category))
      console.log(Common.uintArray2String(new Uint8Array(category)))
      category = Common.fromHexString(Common.uintArray2String(category))
      //category = Common.fromHexString('AC');
      let sn8 = device.advertisData.slice(3, 11)
      device.sn8 = Common.uintArray2String(sn8)
      device.sn3 = device.sn8.substring(0, 3)
      let mac = new Uint8Array(device.advertisData.slice(21, 27)).reverse()
      device.mac = Common.ab2hex(mac)
      device.advertisData = Common.concatUint8Array([category, sn8, mac])
    }

    let that = this
    console.log({
      device,
      openId6: wx.getStorageSync('openId6'),
      deviceId: device.deviceId,
      sessionKey: device.sessionKey,
      // sessionKey: "",
      advertisData: device.advertisData,
    })

    app.bluetoothConn = new BluetoothConn({
      device,
      openId6: app.openId6,
      deviceId: device.deviceId,
      sessionKey: device.sessionKey,
      // sessionKey: "",
      advertisData: device.advertisData,
      success: (res) => {
        console.log(app.bluetoothConn, '看看bluetoothConn实例')
        that.setData({
          connectSuccess: true,
        })
        clearTimeout(that.data.overTimer)
        console.log('connect success')
        callback && callback(res, app.bluetoothConn)
      },
    })
    app.bluetoothConn.event.on('fail', (res) => {
      console.log('fail fail fail')
    })

    app.bluetoothConn.event.on('newSessionKey', (device) => {
      device.source = app.platform
    })
  },
  /**封装整个连接方法 */
  connectFunc(curDevice) {
    let that = this
    console.log('curDevice----------，打出来开链接时的设备信息', curDevice)
    that.connectDevice(curDevice, (res, bluetoothConn) => {
      app.bluetoothConn = bluetoothConn
      console.log(res, 'success callback', bluetoothConn, that.data.connectSuccess);
      that.initDeviceCom(bluetoothConn, () => {
        that.queryManager()
        app.bluetoothConn.event.on('disconnect', () => {
          //TODO 收到微信api的断开后，不需要手动再断一次 app.bluetoothConn.closeBLEConnection(() => {}) 
        })
      })
      bluetoothConn.event.on('receiveMessagePlugin', (data) => {
        console.log(Common.ab2hex(data), '>>>>>>>>>>>>>>>>接收到模组消息2')
        that.data.event.dispatch('updateStatus', {
          data: data,
        })
        if (Common.ab2hex(data).slice(0, 12) == '303030303030') {
          let snAsiiArr = Common.fromHexString(Common.ab2hex(data))
          let sn = Common.asiiCode2Str(snAsiiArr)
          app.globalData.deviceSn = sn
          that.setData({
            deviceSnBle: sn,
          })
          console.log('获取到sn', sn)
        }
        that.unpackManager(data);
        console.log(
          that.data.DeviceComDecorator.AcProcess.parser.newsendingState,
          'that.data.DeviceComDecorator.AcProcess.parser.newsendingState',
          that.data.DeviceComDecorator.AcProcess.parser.sendingState
        )
      })
    })
  },
  /*** 连接部分 end*/
  judgeCtrlType(callback) {
    let ctrlType = 2
    if (this.data.deviceInfo.onlineStatus == 1) {
      ctrlType = 2
      console.log('设备在线，走WiFi')
    } else if (
      (this.data.deviceInfo.onlineStatus == 0 || !this.data.deviceInfo.onlineStatus) &&
      this.data.hasFuncObj.home.noneControlFunc.hasBleControl
    ) {
      console.log('设备离线且设备支持蓝牙，走蓝牙')
      ctrlType = 1
    } else {
      console.log(
        'judgeCtrlType else',
        this.data.deviceInfo.onlineStatus,
        this.data.hasFuncObj.home.noneControlFunc.hasBleControl
      )
      console.log(cloudDecrypt(this.data.deviceInfo.sn, app.globalData.userData.key, appKey))
      ctrlType = 2
    }
    this.setData({
      ctrlType: ctrlType,
    })
    callback && callback()
  },
  getDeviceInfo(options) {
    let deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo))
    console.log(app.globalData.userData, "getDeviceInfo globalData.userData--------------")
    this.setData({
      deviceInfo: deviceInfo,
      deviceInfoSn: cloudDecrypt(deviceInfo.sn, app.globalData.userData.key, appKey),
      sn3: deviceInfo.sn8.substring(0, 3),
    })
    console.log('deviceInfo getDeviceInfo', this.data.deviceInfo, this.data.deviceInfoSn)
  },
  /**
   * 点击收藏页面
   */
  onAddToFavorites: function () {
    return {
      title: '美的美居lite',
      // imageUrl: '自定义收藏图片',
      query: 'collect=ture', //	当前页面的query
    }
  },
  setTitle: function () {
    console.log('开始设title名字啦', this.data.deviceInfo.applianceName, this.data.deviceInfo);
    wx.setNavigationBarTitle({
      title: this.data.deviceInfo?.applianceName ? this.data.deviceInfo?.applianceName : this.data.deviceInfo
        .name,
    })
  },
  gotoMeijuDownload() {
    wx.navigateTo({
      url: '/pages/download/download',
    })
  },
  checkNetwork() {
    let self = this
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType == 'none' || networkType == 'unknown') {
          self.setData({
            useLocalImg: true,
          })
        }
        console.log(networkType, 'network----------------------')
      },
    })
  },
  /*****查询安全模式设置 */
  getSafeModeInfo() {
    return new Promise((resolve, reject) => {
      let that = this
      console.log("getSafeModeInfo++++++++", that.data.deviceInfo.sn, cloudDecrypt(that.data.deviceInfo.sn, app
        .globalData.userData.key, appKey))
      let data = {
        mac: this.data.deviceInfo.btMac,
        sn: cloudDecrypt(that.data.deviceInfo.sn, app.globalData.userData.key, appKey),
      }
      requestService
        .request(selfApi.safeModeQuery, data, 'POST')
        .then((res) => {
          console.log('安全模式查询', res.data)
          if (res.data.errCode == 0) {
            resolve(res.data.result.open == 1)
          } else {
            resolve(false)
            reject()
          }
        })
        .catch((err) => {
          console.log('安全模式查询', err)
          reject()
        })
    })
  },
  /**查询安全模式权限 */
  getSafeModeAuth() {
    let that = this
    return new Promise((resolve, reject) => {
      let openId6 = wx.getStorageSync('openId6')
      console.log("getSafeModeAuth++++++++", that.data.deviceInfo.sn, cloudDecrypt(that.data.deviceInfo.sn, app
        .globalData.userData.key, appKey))
      let data = {
        mac: that.data.deviceInfo.btMac,
        openId6: openId6,
        sn: cloudDecrypt(that.data.deviceInfo.sn, app.globalData.userData.key, appKey),
      }
      requestService
        .request(selfApi.safeModeAuthQuery, data, 'POST')
        .then((res) => {
          console.log('查询安全模式权限', res.data)
          if (res.data.errCode == 0) {
            console.log('查询安全模式权限result', res.data.result)
            resolve(res.data.result)
          } else {
            resolve(false)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  /**安全模式密码检查 */
  confirmPsw(success, error) {
    let that = this
    let openId6 = wx.getStorageSync('openId6')
    let sn = cloudDecrypt(that.data.deviceInfo.sn, app.globalData.userData.key, appKey)
    let data = {
      mac: this.data.deviceInfo.btMac,
      sn: cloudDecrypt(that.data.deviceInfo.sn, app.globalData.userData.key, appKey),
      passwd: this.data.password,
      openId6: openId6,
      snLast4: sn.slice(24,28)
    }
    if ((data.password == '' || that.data.password.length < 6)) {
      wx.showToast({
        title: '请输入六位密码',
        icon: 'none',
      })
      return
    }
    console.log('密码校验', JSON.stringify(data))
    requestService
      .request(selfApi.passwdCheck, data)
      .then((res) => {
        console.log(res.data, '密码检查')
        if (res.data.errCode == 0 && res.data.result) {
          that.setData({
            password: '',
            showPswSet: false,
          })
          that.openBluetoothAdapter()
          success && success(res.data)
        } else {
          wx.showToast({
            title: '密码输入错误，请重试',
            icon: 'none',
          })
          error && error(res.data.errCode)
        }
      })
      .catch((err) => {
        console.log("密码校验", err);
        error && error(err)
      })
    console.log(this.data.password)
  },
  /**重置密码锁密码扫码 */
  goScanQr() {
    let that = this
    wx.scanCode({
      complete(res) {
        console.log(res)
        if (res.errMsg == 'scanCode:fail cancel') {
          wx.showToast({
            icon: 'none',
            title: '您已取消扫码',
            duration: 3000,
          })
          return
        }
        let validCode = false
        if (res.result && res.result.indexOf('sn=') > -1) {
          let sn = res.result.substring(res.result.indexOf('sn=') + 3)
          let selfSn = ''
          if (that.data.deviceSnBle != '') {
            // 先看蓝牙获取到sn没有
            selfSn = that.data.deviceSnBle
          } else {
            selfSn = cloudDecrypt(that.data.deviceInfo.sn, app.globalData.userData.key, appKey)
          }
          let sn_28 = selfSn.slice(0, 28);
          console.log(sn, selfSn)

          if (sn.length == 28 && sn_28 == sn) {
            validCode = true
            // 有效的sn就进行clear操作
            let openId6 = wx.getStorageSync('openId6')
            let param = {
              sn: selfSn,
              mac: that.data.deviceInfo.btMac,
              openId6: openId6,
              uid: app.globalData.userData.uid,
              homegroupId: that.data.deviceInfo.homegroupId,
              roomId: that.data.deviceInfo.roomId,
            }
            console.log('安全模式清除', JSON.stringify(param))
            requestService
              .request(selfApi.safeModeClear, param, 'POST')
              .then((res) => {
                console.log('安全模式清除', res.data)
                if (res.data.errCode == 0) {
                  let btMac = that.data.deviceInfo.btMac ? that.data.deviceInfo.btMac.replace(/:/g, '') : ''
                  let remoteDeviceList = wx.getStorageSync('remoteDeviceList') ?
                    wx.getStorageSync('remoteDeviceList') : []
                  remoteDeviceList = remoteDeviceList.filter((item) => item.btMac != btMac)
                  wx.setStorageSync('remoteDeviceList', remoteDeviceList)
                  app.addDeviceInfo.mode = '' //置空模式
                  wx.showModal({
                    title: '提示',
                    content: that.data.ctrlType == 1 ? '密码已解除，请重新搜索连接空调' : '密码已解除，请及时点击上方开关重设密码',
                    confirmText: '好的',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        if (that.data.ctrlType) {
                          wx.reLaunch({
                            url: '/pages/index/index', // 清除设备之后relaunch设备列表页
                          })
                        }
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    },
                  })
                } else {
                  console.log(res.data.errCode)
                }
                that.getSafeModeInfo()
              })
              .catch((err) => {
                console.log(err)
              })
          } else if (selfSn != sn) {
            validCode = true
            wx.showToast({
              icon: 'none',
              title: '非本机二维码，请重新扫码',
              duration: 3000,
            })
          }
        }
        if (!validCode) {
          wx.showToast({
            icon: 'none',
            title: '二维码无效',
            duration: 3000,
          })
        }
      },
    })
  },
  getSleepCurve() {
    let param = {
      sn: this.data.deviceInfoSn,
    }
    requestService
      .request(selfApi.getSleepCurve, param, 'POST')
      .then((res) => {
        console.log('睡眠曲线查询', res, param)
        let sleepCurve = []
        if (res.data.result && res.data.errCode == '0') {
          for (let i = 0; i < res.data.result.tempSet.length; i++) {
            sleepCurve.push(res.data.result.tempSet[i].temp)
          }
          console.log()
          this.setData({
            sleepCurve: sleepCurve,
          })
        }
        if (this.data.DeviceComDecorator) {
          this.setCacheSleepCurve(this.data.sleepCurve)
        }
      })
      .catch((err) => {
        console.log('睡眠曲线查询', err)
      })
  },
  onChangeKitchenFun(e) {
    console.log(e, e.detail)
    if (e.currentTarget.dataset.item.key == 'PrepareFood') {
      this.prepareFoodChange(e.detail)
    }
    if (e.currentTarget.dataset.item.key == 'QuickFry') {
      console.log('爆炒');
      this.quickFryChange(e.detail)
    }
  },
  onClickKitchenFun(e) {
    console.log('onClickKitchenFun', e.currentTarget.dataset.item.key)
    if (e.currentTarget.dataset.item.key == 'QuickFry') {
      // if (this.data.acStatus.mode != 'cool') {
      //   wx.showToast({
      //     title: '爆炒不能在自动、抽湿、送风模式下开启',
      //     icon: 'none',
      //   })
      //   return false
      // }
      this.setData({
        showQuickFryWindPop: true,
      })
    }
  },
  prepareFoodChange(value) {
    // if (this.data.acstatus.mode == 2 || this.data.acstatus.runStatus == 0) {
      let sendData = {
        prepare_food: value ? 1 : 0,
        prepare_food_temp: this.data.prepareFoodTemp,
        prepare_food_fan_speed: this.data.prepareFoodFanSpeed,
      }
      this.data.DeviceComDecorator.switchPrepareFood(sendData, this.data.acstatus, 'switch_prepare_food', this.data
        .page_path)
    // } else {
    //   wx.showToast({
    //     title: '备菜不能在自动、抽湿、送风模式下开启',
    //     icon: 'none',
    //   })
    // }
  },
  quickFryChange(value) {
    // if (this.data.acstatus.mode == 2 || this.data.acstatus.runStatus == 0) {
      let sendData = {
        quick_fry: value ? 1 : 0,
        quick_fry_temp: this.data.quickFryTemp,
        quick_fry_fan_speed: this.data.quickFryFanSpeed,
      }
      this.data.DeviceComDecorator.switchQuickFry(sendData, this.data.acstatus, 'switch_quick_fry', this.data
        .page_path)
    // } else {
    //   wx.showToast({
    //     title: '爆炒不能在自动、抽湿、送风模式下开启',
    //     icon: 'none',
    //   })
    // }
  },
  toCheckDry() {
    this.setData({
      isSelectDryTip: !this.data.isSelectDryTip
    })
  },
  goToFilterClean() {
    let that = this
    let currDeviceInfo = JSON.stringify(this.data.deviceInfo)
    wx.navigateTo({
      url: '../filterClean/filterClean?deviceInfo=' + encodeURIComponent(currDeviceInfo),
      events: {
        acceptDataFromCtlPanel: function (data) {
          console.log(data)
        },
      },
      success: function (res) {
        console.log('进入filterClean前', that.data.connectedDevice)
        res.eventChannel.emit('acceptDataFromCtlPanel', {
          data: that.data.modalBtn,
          allBtn: that.data.allBtn,
          deviceInfo: that.data.deviceInfo,
          DeviceComDecorator: that.data.DeviceComDecorator,
          ctrlType: that.data.ctrlType,
          event: that.data.event,
          deviceSnBle: that.data.deviceInfoSn,
          connectedDevice: that.data.connectedDevice,
          isCoolFree: that.data.isCoolFree,
          isTH: that.data.isTH,
          hasAuto: that.data.hasAuto,
        })
      },
    })
  },
  setCacheSleepCurve(sleepCurve) {
    console.log('设置缓存睡眠曲线', sleepCurve)
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.firstHourTemp = sleepCurve[0] // 第一小时舒睡温度(17.0-30.0℃)
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.secondHourTemp = sleepCurve[1] // 第二小时舒睡温度
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.thirdHourTemp = sleepCurve[2] // 第三小时舒睡温度
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.fourthHourTemp = sleepCurve[3] // 第四小时舒睡温度
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.fifthHourTemp = sleepCurve[4] // 第五小时舒睡温度
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.sixthHourTemp = sleepCurve[5] // 第六小时舒睡温度
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.seventhHourTemp = sleepCurve[6] // 第七小时舒睡温度
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.eighthHourTemp = sleepCurve[7] // 第八小时舒睡温度
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.ninethHourTemp = sleepCurve[7] // 第九小时舒睡温度
    this.data.DeviceComDecorator.AcProcess.parser.sendingState.tenthHourTemp = sleepCurve[7] // 第十小时舒睡温度
  },
  refreshSendingStateStatus() {
    console.log('0000000000000000', app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState, this.data
      .DeviceComDecorator.AcProcess.parser.sendingState)
    let that = this;
    that.updateNewProtocolStatus(
      app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState,
      that.data.DeviceComDecorator.AcProcess.parser.sendingState
    )
    that.updateAcStatus(
      that.data.DeviceComDecorator.AcProcess.parser.sendingState,
      that.data.DeviceComDecorator.AcProcess.parser.newsendingState
    )
  },
  onClickLeft() {
    console.log("wx.navigateBack();")
    // 获取页面栈信息
    const pages = getCurrentPages()

    // 遍历页面栈，输出每个页面的路径和参数
    pages.forEach((page, index) => {
      console.log(`Page ${index}: ${page.route}, Params:`, page.options)
    })

    if (pages[0].route != 'pages/index/index') {
      console.log("redirectTo")
      wx.reLaunch({
        url: '/pages/index/index',
      })
      console.log("redirectTo after")
    } else {
      wx.navigateBack();
    }
  },
  onChangeValue4(e) {
    console.log(e.detail);
    this.setData({
      value4: e.detail,
    })
  },
  hideModePopup() {
    this.setData({
      showModePopup: false, //展示底部模式
    })
  },
  modeSelect(item) {
    console.log(item.currentTarget.dataset.item);
  },
  onTempDrag(item) {
    console.log(item, "onTempDrag")
  },
  onOverlitmitNorthWarm(e) {
    console.log(e, "overlimit");
    if (this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none',
      })
      return;
    }
    if (this.data.acStatus.mode == 'smart_mode') {
      wx.showToast({
        title: '温度不能在智能模式下调节',
        icon: 'none'
      })
      return;
    }
    if (e.detail == 'minus') {
      wx.showToast({
        title: '已调到最小温度',
        icon: 'none'
      })
    } else if (e.detail == 'plus') {
      wx.showToast({
        title: '已调到最高温度',
        icon: 'none'
      })
    }
  },
  onOverlitmit(e) {
    console.log(e, "overlimit");
    if (this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none',
      })
      return;
    }
    if (this.data.acStatus.mode == 'fan') {
      wx.showToast({
        title: '温度不能在送风模式下调节',
        icon: 'none'
      })
      return;
    }
    if(this.data.acNewStatus.circleFan === 1) {
      wx.showToast({
        title: '温度不能在循环扇开启时调节',
        icon: 'none'
      })
      return;
    }
    if (e.detail == 'minus') {
      wx.showToast({
        title: '已调到最小温度',
        icon: 'none'
      })
    } else if (e.detail == 'plus') {
      wx.showToast({
        title: '已调到最高温度',
        icon: 'none'
      })
    }
  },
  onTempChangeNorthWarm(item) {
    console.log(item);
    console.log("onTempChange test");
    let that = this;
    clearTimeout(this.data.tempDebounceTimer);
    let timer = setTimeout(function () {
      //需要执行的事件
      console.log(item.detail, "onTempChange")     
      if (that.data.acstatus.runStatus == 0) {
        wx.showToast({
          title: '空调已关，请先开空调',
          icon: 'none',
        })
      } else {
        if (that.data.acStatus.mode == 'smart_mode') {
          wx.showToast({
            title: '智能模式下不可调节温度',
            icon: 'none',
          })
          return
        }

        that.data.DeviceComDecorator.northWarmControlTemp(item.detail, that.data.acstatus, () => {});
      }
    }, 500);
    this.setData({
      tempDebounceTimer: timer
    })    
    

  },
  onTempChangeNorthWarmSlide(event) {
    console.log(event.detail);   
    this.data.DeviceComDecorator.northWarmControlTemp(event.detail, this.data.acstatus, () => {});
  },
  onDragNorthWarm(event) {
    console.log('onDragNorthWarm', event);
    this.setData({
      'acstatus.northWarmEffluentTemperature': event.detail.value,
      'acSwStatus.NorthWarmAuto': false,
    });    
  },
  onDragNorthWarmDisabled() {
    if(this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '设备已关机，请先开机',
        icon:'none'                 
      })
      return;
    }    
    if (this.data.acStatus.mode == 'smart_mode' || this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '温度不能在智能模式下调节',
        icon: 'none'
      })      
    }
  },
  test() {
    console.log("!!!!");
  },
  onTempChange(item) {
    console.log("onTempChange test");
    let that = this;
    clearTimeout(this.data.tempDebounceTimer);
    let timer = setTimeout(function () {
      //需要执行的事件
      console.log(item.detail, "onTempChange")
      let min = that.data.has16 ? 16 : 17;
      let step = that.data.hasPoint5 ? 0.5 : 1;


      if (that.data.acstatus.runStatus == 0) {
        wx.showToast({
          title: '空调已关，请先开空调',
          icon: 'none',
        })
      } else {
        if (that.data.acStatus.mode == 'fan') {
          wx.showToast({
            title: '送风模式下不可调节温度',
            icon: 'none',
          })
          return
        }

        var temp = parseFloat(item.detail);
        // let precision = that.data.hasPoint5 ? 0.5 : 1
        // temp = temp + precision
        // temp = temp.toFixed(1)
        var temperature = that.calculateTemp(temp)._is
        var small_temperature = that.calculateTemp(temp)._is5
        console.log(temp);
        // if (temp > 30) {
        //   wx.showToast({
        //     title: '已经是最大温度',
        //     icon: 'none',
        //     duration: 2000,
        //   })
        //   return
        // } else if(temp <= 16) {
        //   wx.showToast({
        //     title: '已经是最小温度',
        //     icon: 'none',
        //     duration: 2000,
        //   })
        //   return
        // }
        that.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0 // 调温退出智控温        
        that.data.DeviceComDecorator.controlTemp(temperature + small_temperature, that.data.acstatus, () => {});
      }

    }, 500);
    this.setData({
      tempDebounceTimer: timer
    })
  },
  generateAppointmentOffPicker() {
    // let arr = ['30分钟']
    let column1 = {
      values: ['无定时', this.data.acstatus.runStatus == 1 ? '定时关机' : '定时开机'],
      className: 'column1',
      defaultIndex: 1,
      selectDescription: ''
    }
    // for (let i = 0; i < 47; i++) {
    //   arr.push(1 + i * 0.5 + '小时')
    // } 


    let column2 = {
      values: timerArr,
      className: 'column1',
      defaultIndex: 0,
      selectDescription: ''
    }

    this.setData({
      timerColumns: [column1, column2],
    })
    
  },
  timerConfirm() {
    let pickerIndex = this.selectComponent('#timePicker').getIndexes();
    console.log(this.data.acstatus.runStatus, pickerIndex);
    let timerOnOffIndex = pickerIndex[0];
    let timerValIndex = pickerIndex[1];
    let timeVal = (pickerIndex[1] + 1) * 0.5;
    console.log(timeVal);

    if (timerOnOffIndex == 0) { // 选择无定时，取消定时
      if (this.data.isCoolFree) {
        app.globalData.DeviceComDecorator.coolFreeCancelTimingOff((res) => {
          this.setData({
            applianceStatus: res.status,
          })
          this.computeButtons()
        }, this.data.sleepCurve)
      } else {
        app.globalData.DeviceComDecorator.cancelTimingOff((res) => {
          this.setData({
            applianceStatus: res.status,
          })
          this.computeButtons()
        }, this.data.sleepCurve)
      }
    } else {
      if (this.data.acstatus.runStatus == 1) { // 开机状态，发定时关  
        if (this.data.isCoolFree) {
          app.globalData.DeviceComDecorator.coolFreeTimingOffSwitch(timeVal, this.data.sleepCurve)
        } else {
          app.globalData.DeviceComDecorator.timingOffSwitch(timeVal, this.data.sleepCurve)
        }
      } else { // 关机状态，发定时开
        if (this.data.isCoolFree) {
          app.globalData.DeviceComDecorator.coolFreeTimingOnSwitch(timeVal, this.data.sleepCurve)
        } else {          
          app.globalData.DeviceComDecorator.timingOnSwitch(timeVal, this.data.sleepCurve)          
        }
      }
    }

    this.timerClose();


  },
  setPickerIndex(acstatus) {
    console.log(this.data.acstatus);
    this.setData({
      'timerColumns[0].values': ['无定时', acstatus.runStatus == 1 ? '定时关机' : '定时开机']
    });


    this.selectComponent('#timePicker').setIndexes([1, this.data.timerOffVal])


    // let pickerIndex = this.selectComponent('#timePicker').getIndexes();
    // if(pickerIndex[0] == 0) {
    //   this.selectComponent('#timePicker').setColumnValues(1, []);
    // } else {
    //   this.selectComponent('#timePicker').setColumnValues(1, timerArr);
    // }   





  },
  timerChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail
    let ColumnIndex = picker.getColumnIndex(index)
    console.log('第' + index + '列', '第' + ColumnIndex + '个')
    console.log({
      picker,
      value,
      index
    });

    let arr = ['30分钟']
    for (let i = 0; i < 47; i++) {
      arr.push(1 + i * 0.5 + '小时')
    }
    if (index == 0) { // 滑动第一列
      if (ColumnIndex == 0) {
        picker.setColumnValues(index + 1, []);
      } else {
        picker.setColumnValues(index + 1, timerArr);
      }
    } else {
      // picker.setColumnValues(index, []);
    }
  },
  timerCancel() {
    this.timerClose();
  },
  timerClose() {
    this.setData({
      openTimerPicker: false
    })
  },
  scroll(e) {
    // console.log(e.detail.scrollTop);
    // if (e.detail.scrollTop <= 10) {
    //   this.setData({
    //     showHeaderbg: true
    //   })
    // } else {
    //   this.setData({
    //     showHeaderbg: false
    //   })
    // }

    if (e.detail.scrollTop > 20) {
      this.setData({
        showHeaderbg: false,
      })
    } else {
      this.setData({
        showHeaderbg: true,
      })
    }
  },
  onChangeUpDownDirect(e) {
    console.log(e.detail)
    app.globalData.DeviceComDecorator.UpDownNoWindBlowingSwitch(
      e.detail,
      this.data.acNewStatus.nonDirectWindType,
      'click_ud_wind_blowing',
      this.data.page_path
    )
  },
  bottomUdWindDirect(e) {
    let value = e.currentTarget.dataset.item.value
    console.log(value)
    app.globalData.DeviceComDecorator.UpDownNoWindBlowingSwitch(
      true,
      value,
      'click_ud_wind_blowing',
      this.data.page_path
    )
  },
  onCellSwitchChange(e) {
    console.log(e);
    if (e.currentTarget.dataset.item.key == 'SelfCleaning') {
      if (this.data.acSwStatus.SelfCleaning) {
        this.data.btnObj[e.currentTarget.dataset.item.key].switchFunc(e.currentTarget.dataset.item)
      } else {
        this.setData({
          showSelfCleanConfirmPopup: true
        })
      }
    } else if(e.currentTarget.dataset.item.key == 'TargetIndoorTemp') {      
      if(this.data.acstatus.runStatus == 0) {
        wx.showToast({
          title: '设备已关机，请先开机',
          icon:'none'                 
        })
        return;
      }      
      let flag = !this.data.acSwStatus.TargetIndoorTemp;    
      if (!flag) { // 关，直接关
        console.log("!!!!!!", flag);
        app.globalData.DeviceComDecorator.northWarmTargetTemp(flag, this.data.acstatus,"","");
      } else {
        console.log("!!!!!!", flag);
        this.setData({
          showTargetTempSwitchPop: true
        })  
      }  
    } else {
      this.data.btnObj[e.currentTarget.dataset.item.key].switchFunc(e.currentTarget.dataset.item)
    }
  },
  switchSelfCleaning() {
    this.data.btnObj['SelfCleaning'].switchFunc()
    this.hidePopup();
  },
  switchTargetTemp() {
    console.log("TargetIndoorTemp",this.data.acSwStatus.TargetIndoorTemp)
    let flag = !this.data.acSwStatus.TargetIndoorTemp;    
    app.globalData.DeviceComDecorator.northWarmTargetTemp(flag, this.data.acstatus,"","");
    this.setData({
      showTargetTempSwitchPop: false
    })  
  },
  freshAirChange(item) {
    let sendData = item.currentTarget.dataset.item.param;
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchSelfCleaning = 0; // 智清洁假关
    this.data.DeviceComDecorator.freshAirSwitch(
      sendData.fresh_air == 'on',
      sendData.fresh_air_fan_speed,
      (res) => {})    
  },
  circleFanChange(item) {
    let sendData = item.currentTarget.dataset.item.param;  
    this.data.DeviceComDecorator.circleFanSwitch(
      sendData.circle_fan == 'on',
      sendData.circle_fan_mode,
      (res) => {})    
  },
  purifyChange(item) {
    let sendData = item.currentTarget.dataset.item.param;
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchSelfCleaning = 0; // 智清洁假关
    this.data.DeviceComDecorator.puriFySwitch(
      sendData.inner_purifier == 'on',
      sendData.inner_purifier_fan_speed,
      (res) => {})    
  },
  keepWetChange(item) {
    let sendData = item.currentTarget.dataset.item.param;
    this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchSelfCleaning = 0; // 智清洁假关
    this.data.DeviceComDecorator.keepWetSwitch(
      sendData.moisturizing == 1,
      sendData.moisturizing_fan_speed,
      (res) => {})       
  },
  updateCircleFanItemSelect() {   
    if (this.data.acSwStatus.LoopFan) {
      this.data.circleFanItem.forEach((item, index) => {
        item.selected = false;
        if (item.param.circle_fan != 'off' && (item.param.circle_fan_mode == this.data.acNewStatus.circleFanMode)) {
          item.selected = true
        }
      })
    } else {
      this.data.circleFanItem.forEach((item, index) => {
        item.selected = false;
      })
      this.data.circleFanItem[0].selected = true;
    }

    console.log(this.data.circleFanItem, "circleFanItem")
    this.setData({
      circleFanItem: this.data.circleFanItem,
    })
  },
  updateFreshAirItemSelect() {
    console.log("freshAirFanSpeed", this.data.acNewStatus.freshAirFanSpeed, this.data.acValueStatus.FreshAir.value);

    if (this.data.acSwStatus.FreshAir) {
      this.data.freshAirItem.forEach((item, index) => {
        item.selected = false;
        if (item.param.fresh_air != 'off' && (item.param.fresh_air_fan_speed == this.data.acNewStatus.freshAirFanSpeed)) {
          item.selected = true
        }
      })
    } else {
      this.data.freshAirItem.forEach((item, index) => {
        item.selected = false;
      })
      this.data.freshAirItem[0].selected = true;
    }


    console.log(this.data.freshAirItem, "freshAirItem")
    this.setData({
      freshAirItem: this.data.freshAirItem,
    })
  },
  updatePurifyItemSelect() {  
    if (this.data.hasFuncObj.home.controlFunc.hasCleanFunc) {    
      console.log("有净化功能，刷新净化的风速状态", this.data.acNewStatus.innerPurifierFanSpeed);
      if (this.data.acSwStatus.CleanFunc) {
        this.data.purifyItem.forEach((item, index) => {
        item.selected = false;
          if (item.param.inner_purifier != 'off' && (item.param.inner_purifier_fan_speed == this.data.acNewStatus.innerPurifierFanSpeed)) {
            item.selected = true
          }
        })
      } else {
        this.data.purifyItem.forEach((item, index) => {
          item.selected = false;
        })
        this.data.purifyItem[0].selected = true;
      }


      console.log(this.data.purifyItem, "purifyItem")
      this.setData({
        purifyItem: this.data.purifyItem,
      })
    }
  },
  updateMoisturizingItemSelect() {   
    if (this.data.hasFuncObj.home.controlFunc.hasKeepWet) {
      console.log("有保湿功能，刷新保湿的风速状态", this.data.acNewStatus.moisturizingFanSpeed);
      if (this.data.acSwStatus.KeepWet) {
        this.data.moisturizingItem.forEach((item, index) => {
          item.selected = false;
          if (item.param.moisturizing != 0 && (item.param.moisturizing_fan_speed == this.data.acNewStatus.moisturizingFanSpeed)) {
            item.selected = true
          }
        })
      } else {
        this.data.moisturizingItem.forEach((item, index) => {
          item.selected = false;
        })
        this.data.moisturizingItem[0].selected = true;
      }
  
  
      console.log(this.data.moisturizingItem, "moisturizingItem")
      this.setData({
        moisturizingItem: this.data.moisturizingItem,
      })
    }  
  },
  
  getProductImg(sn8) {
    let that = this;
    let KW200 = ['22251209', '22251211', '222Z1421', '22251321', '222Z1460', '22251501', '222Z1542', '22251503',
      '222Z1541'
    ]
    this.data.isWideWind = KW200.includes(sn8) //当前只有一款是宽风口的
    // let hasThisProductImgLocally = false
    let _sn8 = this.data.isWideWind ? '22251209' : sn8
    let ac_type = this.getAcType(sn8);


    requestService.request(selfApi.getProductImgBySn8, {
      sn8,
      ac_type
    }, 'POSt').then((res) => {
      let data = res.data;
      if (data.errCode == '0' || data.errCode == 0 && data.result) {
        if (data.result.close && data.result.open) {
          // 有开关机图
          this.setData({
            onDeviceImg: data.result.open,
            offDeviceImg: data.result.close,
            noImg: false
          })
          // this.animation_img = 

        } else {
          // s使用默认图
          let sn3 = _sn8.slice(0, 3);
          this.setData({
            onDeviceImg: `${imageDoamin}plugin/0xAC/default${sn3}-on.png`,
            offDeviceImg: `${imageDoamin}plugin/0xAC/default${sn3}-off.png`,
            noImg: sn3 != '220' && sn3 != '222' && sn3 != '223'
          })
        }
        this.setData({
          animation_img: {
            freshair: data.result.freshair, //新风动态图
            dry: data.result.dehum, //抽湿动态图
            nowindfeel: data.result.nowindfeel, //无风感动态图
            fan: data.result.windsend, //送风动态图
            cool: data.result.cool, //制冷动态图
            heat: data.result.heat, //制热动态图
            auto: data.result.cool, //自动动态图
          }
        })
      }

      // 尝试下载开关机图到本地
      console.log("下周图片路径", that.data.onDeviceImg)
      // wx.downloadFile({
      //   url: that.data.onDeviceImg,
      //   success: function (res) {          
      //     if (res.statusCode === 200) {
      //       // 获取文件系统管理器
      //       const fs = wx.getFileSystemManager();
      //       // 将图片保存到本地
      //       fs.writeFile({
      //         filePath: wx.env.USER_DATA_PATH + `/plugin/0xAC/default${sn3}-on.png`,
      //         data: res.tempFilePath,
      //         success: function () {
      //           console.log('图片缓存成功');
      //         }
      //       });
      //     }
      //   },
      //   fail: function(e) {
      //     console.log('缓存图片',e)
      //   }
      // });
      console.log(res, "getProductImgBySn8", this.data.animation_img);
    }).catch((e) => {
      console.log(e, 'getProductImgBySn8')
    })
  },
  getAcType(sn8) {
    let KW200 = ['22251209', '22251211', '222Z1421', '22251321', '222Z1460', '22251501', '222Z1542', '22251503',
      '222Z1541'
    ]
    let T1T3 = ['22251663', '222Z1635', '22251661']
    if (KW200.includes(sn8)) return AC_TYPE_PRODUCT['柜机宽风口']

    if (T1T3.includes(sn8)) {
      return AC_TYPE_PRODUCT['T1T3']
    }
    let type = sn8.length > 3 ? sn8.substr(0, 3) : ''; //初步判断类型
    if (type == '230' || type == '223') return AC_TYPE_PRODUCT['风管机']
    if (type == '000') return type = this.tempFitForTribleZero(sn8) ? AC_TYPE_PRODUCT['挂机'] : AC_TYPE_PRODUCT[
      '柜机窄风口']
    if (type == '225') return AC_TYPE_PRODUCT['天花机']
    if (type == '206') return AC_TYPE_PRODUCT['移动空调']
    if (type == '222') return AC_TYPE_PRODUCT['柜机窄风口']
    if (type == '226') return AC_TYPE_PRODUCT['热风机']
    if (type == '240') return AC_TYPE_PRODUCT['厨房空调']
    return AC_TYPE_PRODUCT['挂机']
  },
  tempFitForTribleZero(sn8) {
    let flg = parseInt(sn8[3]) < 5 //小于5是挂机 
    return flg
  },
  //通过sn8判断用什么动态效果图
  getMatchAnimation(_sn8, mode) {
    let _mode = 'cool'
    switch (mode) {
      case 'cool':
        _mode = 'cool'
        break
      case 'heat':
        _mode = 'heat'
        break
      case 'fan':
        _mode = 'windsend'
        break
      case 'dry':
        _mode = 'dehum'
        break
      case 'manual_dry':
        _mode = 'dry'
        break
      case 'smart_dry':
        _mode = 'dry'
        break
      default:
        _mode = 'cool'
    }
    return this.data.animation_img[_mode]
    // return "aaa"
    // let sn8 = _sn8 || ''
    // let type = sn8.length > 3 ? sn8.substr(0, 3) : '';
    // if (type == '220') {
    //   return `v-ac-animation-${_mode}`
    // } else if (type == '225') {
    //   //天花机
    //   return `topfloor-${_mode}`
    // } else if (type == '230' || type == '223') {
    //   //风管机
    //   return `windpie-${_mode}`
    // } else if (type == '206') {
    //   //移动空调
    //   return `mobile-${_mode}`
    // }

    // else if (type == '222') {
    //   if (this.isWideWind)
    //     return `thick-h-ac-animation-${_mode}`
    //   else
    //     return `h-ac-animation-${_mode}`
    // }
    // else if (type == '000') {
    //   return this.tempFitForTribleZero(_sn8) ? `v-ac-animation-${_mode}` : `h-ac-animation-${_mode}`
    // }
  },
  //根据柜机和挂机区分新风动画
  getMatchNewWind(_sn8) {
    return this.animation_img.freshair
    // let sn8 = _sn8 || ''
    // let type = sn8.length > 3 ? sn8.substr(0, 3) : '';
    // if (type == '220') {
    //   //挂机
    //   return `v-ac-animation-freshAir`
    // } else if (type == '225') {
    //   //天花机
    //   return 'topfloor-fresh-air'
    // } else if (type == '230' || type == '223') {
    //   //风管机
    //   return 'windpie-fresh-air'
    // } else if (type == '206') {
    //   //移动空调
    //   return 'mobile-fresh-air'
    // } else if (type == '222') {
    //   return `h-ac-animation-freshAir`
    // } else if (type == '000') {
    //   return this.tempFitForTribleZero(_sn8) ? `v-ac-animation-${_mode}` : `h-ac-animation-${_mode}`
    // }
  },

  //区分柜/挂机区分无风感动画
  getMatchNoWindFeel(_sn8) {
    return this.animation_img.nowindfeel;
    // let sn8 = _sn8 || ''
    // let type = sn8.length > 3 ? sn8.substr(0, 3) : '';
    // if (type == '220') {
    //   //挂机
    //   return `v-ac-animation-nowindfeel`
    // } else if (type == '230' || type == '223') {
    //   //风管机
    //   return 'windpie-nowindfeel'
    // } else if (type == '225') {
    //   //天花机
    //   return 'topfloor-nowindfeel'
    // }
    // else if (type == '206') {
    //   //移动空调
    //   return 'mobile-nowindfeel'
    // }
    // else if (type == '222') {
    //   //柜机
    //   if (this.isWideWind) return 'thick-h-ac-animation-nowindfeel'
    //   return `h-ac-animation-nowindfeel`
    // } else if (type == '000') {
    //   return this.tempFitForTribleZero(_sn8) ? `v-ac-animation-nowindfeel` : `h-ac-animation-nowindfeel`
    // }
  },

  // 判断是否柜机
  getMatchTypeIsV() {
    let sn8 = this.data.deviceSn8 || '';
    let type = sn8.length > 3 ? sn8.substr(0, 3) : '';
    // nativeService.alert(type);
    return type == '220';
  },

  preventTouchMove(e) {
    e.preventDefault()
    // e.stopPropagation();
  },

  openLoadingPage() {
    this.setData({
      loadingText: '',
      image: imageDoamin + 'plugin/0xAC/' + 'loading.png',
      iconSize: 120,
      color: '#C8C8C8',
      bgColor: '#fff',
      loadingColor: '#C8C8C8',
      loadingMode: 'circular',
      loading: true,
    })
    let that = this
    setTimeout(() => {
      that.setData({
        image: '',
        loading: false,
      })
    }, 2000)
  },

  judgeBtnDisabled(acStatus) {
    console.log("judgeBtnDisabled", acStatus);
    if (acStatus.mode != 'heat' && acStatus.mode != 'auto') {
      this.setData({
        'acBtnDisabled.ElectricHeat.disabled': true
      })
    } else {
      this.setData({
        'acBtnDisabled.ElectricHeat.disabled': false
      })
    }

    if (acStatus.mode == 'heat' || acStatus.mode == 'auto') {
      this.setData({
        'acBtnDisabled.WindBlowing.disabled': true,
        'acBtnDisabled.UpDownWindBlowing.disabled': true,       
        'acBtnDisabled.UpWindBlowing.disabled': true,
        'acBtnDisabled.DownWindBlowing.disabled': true,        
      })
    } else {
      this.setData({
        'acBtnDisabled.WindBlowing.disabled': false,
        'acBtnDisabled.UpDownWindBlowing.disabled': false,     
        'acBtnDisabled.UpWindBlowing.disabled': false,
        'acBtnDisabled.DownWindBlowing.disabled': false,        
      })
    }

    if (this.data.isTH || this.data.deviceSubType == 'F1_1_26_35_BLE') {
      if (this.data.deviceSubType == 'KS1_1_P_35_BLE' || this.data.deviceSubType == 'PD1_1') {
        if (acStatus.mode == 'heat' || acStatus.mode == 'auto') {          
          this.setData({
            'acBtnDisabled.WindBlowing.disabled': true,
          })
        } else {         
          this.setData({
            'acBtnDisabled.WindBlowing.disabled': false,
          })
        }
      } else {
        if (acStatus.mode != 'cool') {
          this.setData({
            'acBtnDisabled.WindBlowing.disabled': true,
            'acBtnDisabled.FaWindBlowing.disabled': true,
            'acBtnDisabled.KeepWet.disabled': true,
            'acBtnDisabled.ThNowindFeelLeft.disabled': true,
            'acBtnDisabled.ThNowindFeelRight.disabled': true,
            'acBtnDisabled.ThDownNoWindFeel.disabled': true,
            'acBtnDisabled.ThUpNoWindFeel.disabled': true,
          })
        } else {
          this.setData({
            'acBtnDisabled.WindBlowing.disabled': false,
            'acBtnDisabled.FaWindBlowing.disabled': false,
            'acBtnDisabled.KeepWet.disabled': false,
            'acBtnDisabled.ThNowindFeelLeft.disabled': false,
            'acBtnDisabled.ThNowindFeelRight.disabled': false,
            'acBtnDisabled.ThDownNoWindFeel.disabled': false,
            'acBtnDisabled.ThUpNoWindFeel.disabled': false,
          })
        } 
      }      
    } else {
      if (acStatus.mode == 'heat' || acStatus.mode == 'auto') {
        console.log("!!!!!!++++++")
        this.setData({
          'acBtnDisabled.WindBlowing.disabled': true,
          'acBtnDisabled.UpWindBlowing.disabled': true,
          'acBtnDisabled.DownWindBlowing.disabled': true,
        })
      } else {
        console.log("!!!!!!------")
        this.setData({
          'acBtnDisabled.WindBlowing.disabled': false,
          'acBtnDisabled.UpWindBlowing.disabled': false,
          'acBtnDisabled.DownWindBlowing.disabled': false,
        })
      }
    }

    if (acStatus.mode == 'heat' || acStatus.mode == 'auto' || acStatus.mode == 'fan') {
      this.setData({
        'acBtnDisabled.Dry.disabled': true,
        'acBtnDisabled.CoolFreeDry.disabled': true,
        'acBtnDisabled.DryNewName.disabled': true,
        'acBtnDisabled.DryNewNameKitchen.disabled': true,
      })
    } else {
      this.setData({
        'acBtnDisabled.Dry.disabled': false,
        'acBtnDisabled.CoolFreeDry.disabled': false,
        'acBtnDisabled.DryNewName.disabled': false,
        'acBtnDisabled.DryNewNameKitchen.disabled': false,
      })
    }


    if (acStatus.mode != 'cool') {
      this.setData({
        'acBtnDisabled.ECO.disabled': true,
        'acBtnDisabled.Supercooling.disabled': true,
        'acBtnDisabled.CSEco.disabled': true,
        'acBtnDisabled.UpNoWindFeel.disabled': true,
        'acBtnDisabled.FaNoWindFeel.disabled': true,
        'acBtnDisabled.NoWindFeel.disabled': true,
        'acBtnDisabled.DownNoWindFeel.disabled': true,
        'acBtnDisabled.AutomaticAntiColdAir.disabled': true,
        'acBtnDisabled.CoolPowerSaving.disabled': true,
        'acBtnDisabled.CoolPowerSavingNewName.disabled': true,
        'acBtnDisabled.F11NoWindFeel.disabled': true,
        'acBtnDisabled.softWindFeel.disabled': true,
        'acBtnDisabled.ThSoftWindFeel.disabled': true,        
        'acBtnDisabled.LoopFan.disabled': true,      
      })
    } else {
      this.setData({
        'acBtnDisabled.WindBlowing.disabled': false,
        'acBtnDisabled.ECO.disabled': false,
        'acBtnDisabled.Supercooling.disabled': false,
        'acBtnDisabled.CSEco.disabled': false,
        'acBtnDisabled.UpNoWindFeel.disabled': false,
        'acBtnDisabled.FaNoWindFeel.disabled': false,
        'acBtnDisabled.NoWindFeel.disabled': false,
        'acBtnDisabled.DownNoWindFeel.disabled': false,
        'acBtnDisabled.AutomaticAntiColdAir.disabled': false,
        'acBtnDisabled.CoolPowerSaving.disabled': false,
        'acBtnDisabled.CoolPowerSavingNewName.disabled': false,
        'acBtnDisabled.F11NoWindFeel.disabled': false,
        'acBtnDisabled.softWindFeel.disabled': false,
        'acBtnDisabled.ThSoftWindFeel.disabled': false,        
        'acBtnDisabled.LoopFan.disabled': false,
      })
    }

    if(acStatus.mode == 'dry') {
      this.setData({
        'acBtnDisabled.AroundWind.disabled': true,
        'acBtnDisabled.BackWarmRemoveWet.disabled': false
      })
    } else {
      this.setData({
        'acBtnDisabled.AroundWind.disabled': false,
        'acBtnDisabled.BackWarmRemoveWet.disabled': true
      })
    }

    if (acStatus.mode != 'cool' && acStatus.mode != 'fan') {
      this.setData({
        'acBtnDisabled.UpDownAroundWind.disabled': true,
      })
    } else {
      this.setData({
        'acBtnDisabled.UpDownAroundWind.disabled': false,
      })
    }

    // 处理风速限制
    if(this.data.deviceSubType == 'MXC1_2_BLE' || this.data.deviceSubType == 'MXC1_2_BLE_46') {
      // 此机型风速在抽湿下可以控制
      if(acStatus.mode == 'auto') {
        this.setData({
          'acBtnDisabled.WindSpeed.disabled': true,
        })
      } else {
        this.setData({
          'acBtnDisabled.WindSpeed.disabled': false,
        })
      }
    } else {
      if(acStatus.mode == 'auto' || acStatus.mode == 'dry') {
        this.setData({
          'acBtnDisabled.WindSpeed.disabled': true,
        })
      } else {
        this.setData({
          'acBtnDisabled.WindSpeed.disabled': false,
        })
      }
    }

    console.log(this.data.acBtnDisabled, "judgeBtnDisabled");

    if (acStatus.mode != 'heat' && acStatus.mode != 'cool') {
      this.setData({
        'acBtnDisabled.QuickCoolHeat.disabled': true,
      })
    } else {
      this.setData({
        'acBtnDisabled.QuickCoolHeat.disabled': false,
      })
    }


    if (this.data.acstatus.runStatus != 1) { // 关机情况
      this.setData({
        'acBtnDisabled.TargetIndoorTemp.disabled': true,
      })
    } else {
      this.setData({
        'acBtnDisabled.TargetIndoorTemp.disabled': false,
      })
    }

    if (acStatus.mode == "smart_mode") { // 北方采暖智能模式下
      this.setData({
        'acBtnDisabled.NorthWarmAuto.disabled': true,
      })
    } else {
      this.setData({
        'acBtnDisabled.NorthWarmAuto.disabled': false,
      })
    }


  },

  windSliderDisabledClick() {
    // 防抖
    this.throttle(this.showWindToast(), 1000);
  },
  showWindToast() {
    if (this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none',
      })
      return;
    }
    wx.showToast({
      title: '风速不能在自动、抽湿模式下调节',
      icon: 'none'
    })
  },
  // 防抖
  throttle(func, delay) {
    let lastTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      if (currentTime - lastTime >= delay) {
        func.apply(this, args);
        lastTime = currentTime;
      }
    }
  },

  checkSoundSwitch() {
    try {
      let value = wx.getStorageSync('Sound')
      console.log('storage==============sound=======', value == false, value == 'false', wx.getStorageSync('Sound'))
      if (value == false || value == true) {
        this.setData({
          'acSwStatus.Sound': value,
          SoundSwitch: value
        })
      } else {
        console.log('没存')
        wx.setStorageSync('Sound', true)
        this.setData({
          'acSwStatus.Sound': true,
          SoundSwitch: true,
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  getColdWindTipsFlag() {
    let flag = wx.getStorageSync('coldTipsNotShow' + app.globalData.currentSn);
    this.setData({
      storageColdTipsNotShow: flag
    })
    console.log(flag, 'getColdWindTipsFlag');
  },
  closeAutoColdWindPopup() {
    this.setData({
      showAutoColdWindPopup: false
    })
  },
  onColdWindCheckboxCheck(event) {
    console.log(event, 'onColdWindCheckboxCheck')
    let tmpFlag = !this.data.coldTipsNotShow;
    this.setData({
      coldTipsNotShow: tmpFlag
    })
  },
  coldWindFuncConfirm() {
    console.log(this.data.coldTipsNotShow, this.data.deviceSnFromDeviceInfo);
    let data = !this.data.acSwStatus.AutomaticAntiColdAir;
    if (this.data.acStatus.mode != 'cool') {
      wx.showToast({
        title: '主动防冷风只能在制冷模式下开启',
        icon: 'none',
      })
      return
    }
    app.globalData.DeviceComDecorator.automaticAntiColdAirSwitch(data, "click_auto_prevent_cold_wind", this.data
      .page_path);
  },

  showWxToast(text) {
    wx.showToast({
      title: text,
      icon: 'none'
    })
  },  

  getWindFeelDomWidth() {
    let that = this;
    try {
      wx.createSelectorQuery().select('#wind-feel-mx-panel').boundingClientRect(function(rect_1){
        console.log('元素宽度为：', rect_1?.width)
        that.setData({
          windFeelMxPanelWidth: rect_1?.width
        })
  
        wx.createSelectorQuery().select('#wind-select-items').boundingClientRect(function(rect){
          that.setData({
            windFeelItemsWidth: rect?.width
          })
          console.log('wind-select-items元素宽度为：', rect?.width)      
        }).exec()    
      }).exec()
    } catch (error) {
      
    }   
  },

  modifyCellArrExtraText(keyStr) {
    let index = Helper.findIndexByKey(this.data.cellArr, keyStr)
    let temp = this.data.acstatus.northWarmTargetTemp > 30 ? 30 : this.data.acstatus.northWarmTargetTemp;
    let finalText = temp.toFixed(1) + '℃' + " | 设置参数 >";
    this.data.cellArr[index].extraText1 = finalText;
    console.log(index, "modifyCellArrExtraText", this.data.cellArr[index].extraText1);
    this.setData({
      cellArr: this.data.cellArr
    })
  },

  northWarmModeToggle(e) {
    console.log(e);
    let item = e.currentTarget.dataset.item;
    this.data.DeviceComDecorator.northWarmModeToggle(item, this.data.acstatus, '', '');
  },

  voidFunc() {

  },
  // acstatus.northWarmTargetTemp
  targetTempChange(e) {
    let targetTemp = e.detail;
    app.globalData.DeviceComDecorator.northWarmTargetTempSet(targetTemp, this.data.acstatus, "", "");
  },
  onTempTargetDrag(e) {    
    this.setData({      
      northWarmTargetTempText: parseFloat(e.detail.value).toFixed(1)
    })
  },
  getModePopupMode(acstatus) {
    // if(this.data.acstatus.smartDryFunc) {
    //   return "smart_dry";
    // } else if(this.data.acstatus.manualDryFunc) {
    //   return "manual_dry";
    // } else {
    return this.data.modeMap[acstatus.mode - 1].key ? this.data.modeMap[acstatus.mode - 1].key :
      'auto';
    // }
  },
  showQuestionTips(item) {
    console.log(item);
    if (item.currentTarget.dataset.item == 'TargetIndoorTemp') {
      this.setData({
        showTempSetTips: true
      })
    }
  },
  judgeNorthWarmVacationDate(status) {
    let enrtyTime = app.globalData.DeviceComDecorator.formatDate(status.vacation_entry_time_byte0, status.vacation_entry_time_byte1, status.vacation_entry_time_byte2, status.vacation_entry_time_byte3);

    let exitTIme = app.globalData.DeviceComDecorator.formatDate(status.vacation_exit_time_byte0, status.vacation_exit_time_byte1, status.vacation_exit_time_byte2, status.vacation_exit_time_byte3);

    let now = app.globalData.DeviceComDecorator.getNowNorthWarmDate()    

    let nowLargerThanEntry = app.globalData.DeviceComDecorator.compareNorthWarmDates(enrtyTime);

    let exitLargerThanNow = app.globalData.DeviceComDecorator.compareNorthWarmDates(exitTIme);

    if (status.holidayModeMcuSwitch == 1 && status.holidayMode == 1) {
      this.setData({
        showVacation: true
      })
    } else {
      this.setData({
        showVacation: false
      })
    }

    console.log(enrtyTime, '-judgeNorthWarmVacationDate', exitTIme, now, nowLargerThanEntry, exitLargerThanNow, status.holidayModeMcuSwitch, status.holidayMode);
    // if (nowLargerThanEntry <= 0 && exitLargerThanNow >= 0 && this.data.acstatus.holidayMode == 1) {
    //   console.log("展示");
    //   this.setData({
    //     showVacation: true
    //   })
    // } else {
    //   console.log("不展示");
    //   this.setData({
    //     showVacation: false
    //   })
    // }
  },

  SynchronizLeftRightLrWindAngle() {
    let tempAngle = 0
    if (this.data.acNewStatus.leftRightAngle != 0) {
      tempAngle = this.data.acNewStatus.leftRightAngle
    }

    if (this.data.acNewStatus.rightLrWindAngle != 0) {
      tempAngle = this.data.acNewStatus.rightLrWindAngle
    }
  },

  switchNewSound(e) {
    console.log(e);
    app.globalData.DeviceComDecorator.newSoundSwitch(e.detail);
  },

  bottomSoundPopup(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index; // 0 是仅在app控制无声响 1 是所有设备控制无声响
    let type = index === 0 ? 1 : 0
    app.globalData.DeviceComDecorator.newSoundTypeSwitch(type);

  },

  preventWindMemory() {
    let flag = this.data.acNewStatus.preventCoolWindMenory == 1 ? 0 : 1
    app.globalData.DeviceComDecorator.preventColdWindMemorySwitch(flag);
  }
})
