import { requestService } from '../../../../utils/requestService'

// 全功能组件参数
const functionData = {
  temperatureSetting: {
    title: '温度设置',
    key: 'temperatureSetting',
    desc: '',
    icon: './assets/image/E3/settemcolmo.png',
  },
  bathReport: {
    title: '沐浴报告',
    key: 'bathReport',
    desc: '',
    iconfont: 'bathcurve',
    icon: './assets/image/E3/bathCurve.png',
  },
  aiKitchen: {
    title: '定时厨房洗',
    key: 'aiKitchen',
    desc: '预约时段启动厨房洗',
    iconfont: 'aiKitchen',
  },
  aiColdWater: {
    title: '定时零冷水',
    key: 'deviceWaterAppoint',
    desc: '预约时段启动零冷水',
    iconfont: 'deviceWaterAppoint',
  },
  aiColdWaterSwitch: {
    title: 'AI零冷水',
    key: 'aiColdWaterSwitch',
    desc: 'AI零冷水学习中，7天后自动启动',
    iconfont: 'aiColdWater',
    icon: './assets/image/E3/aiColdWaterFirst.png',
  },
  bathCurve: {
    title: '沐浴曲线',
    key: 'bathCurve',
    desc: '多种沐浴温度曲线',
    iconfont: 'bathcurve',
    toshibaIcon: './assets/image/toshiba/bathCurve.png',
    icon: './assets/image/E3/bathCurve.png',
  },
  bathtubCurveSelect: {
    title: 'AI智慧浴',
    key: 'bathtubCurveSelect',
    desc: '个性化定制沐浴曲线',
    iconfont: 'bathcurve',
    icon: './assets/image/E3/bathCurveColmo.png',
  },
  bathtubUpSet: {
    title: '浴缸洗设置',
    key: 'bathtubUpSet',
    desc: '到设定水量后，提示关闭',
    iconfont: 'bathtubWater',
    icon: './assets/image/E3/bathtubWashComl.png',
  },
  bathtubWater: {
    title: '浴缸洗设置',
    key: 'bathtubWater',
    desc: '到设定水量后，提示关闭',
    icon: './assets/image/E3/bathtubWashComl.png',
  },
  bubbleSelect: {
    title: '气泡功能',
    key: 'bubbleSelect',
    desc: '选择气泡类型',
    icon: './assets/image/E3/bubbleSelect.png',
  },
  capacity: {
    title: '变升',
    key: 'capacity',
    desc: '智能调节升数，调整火力',
    icon: './assets/image/E3/capacityComl.png',
  },
  changeLitre: {
    title: '智能变升',
    key: 'changeLitre',
    desc: '智能调节升数，调整火力',
    icon: './assets/image/E3/changeLitreComl.png',
  },
  cloudTem: {
    title: '云感温',
    key: 'cloudTem',
    desc: '智能调节水温，舒适免调',
    icon: './assets/image/E3/cloudTemList.png',
    toshibaIcon: './assets/image/toshiba/cloudTem.png',
  },
  coldWaterDot: {
    title: '点动零冷水',
    key: 'coldWaterDot',
    desc: '5s内开关两次，启动一次',
    iconfont: 'coldWaterDot',
    icon: './assets/image/E3/coldWaterDotComl.png',
    toshibaIcon: './assets/image/toshiba/coldWaterDot.png',
  },
  coldWater: {
    title: '单次循环',
    key: 'coldWater',
    desc: '启动零冷水1次',
    iconfont: 'coldWater',
    toshibaIcon: './assets/image/toshiba/coldWaterFunc.png',
  },
  coldWaterMaster: {
    title: '单次零冷水',
    key: 'coldWaterMaster',
    desc: '启动零冷水1次',
    iconfont: 'coldWater',
    toshibaIcon: './assets/image/toshiba/coldWaterFunc.png',
  },
  coldWaterHighTem: {
    title: '高温全管路杀菌',
    key: 'coldWaterHighTem',
    desc: '在全管道，使用65℃高温水杀菌',
  },
  coldWaterSetting: {
    title: '更多设置',
    key: 'coldWaterSetting',
    desc: '解锁更多零冷水启动方式和设置',
    iconfont: 'coldWaterSetting',
    icon: './assets/image/E3/coldWaterSettingComl.png',
  },
  deviceWaterAppoint: {
    title: '定时零冷水',
    key: 'deviceWaterAppoint',
    desc: '预约时段启动零冷水',
    iconfont: 'deviceWaterAppoint',
    icon: './assets/image/E3/appointcolmo.png',
    toshibaIcon: './assets/image/toshiba/appoint.png',
  },
  deviceWaterAppointRepeat: {
    title: '定时零冷水',
    key: 'deviceWaterAppointRepeat',
    desc: '预约时段启动零冷水',
    iconfont: 'deviceWaterAppoint',
    icon: './assets/image/E3/appointcolmo.png',
  },
  doublePressure: {
    title: '双增压',
    key: 'doublePressure',
    desc: '智能提升水压，加大出水量',
  },
  filterLife: {
    title: '滤芯寿命',
    key: 'filterLife',
    iconfont: 'filterLife',
    icon: './assets/image/E3/filterLife.png',
  },
  gestureFunction: {
    title: '手势功能',
    key: 'gestureFunction',
    iconfont: 'gestureFunction',
    desc: '可以设置手势切换的模式',
  },
  highTempLockSwitch: {
    title: '高温锁',
    key: 'highTempLockSwitch',
    desc: '最高设置50℃，防止烫伤',
    icon: './assets/image/E3/highTempLock.png',
  },
  pressureWash: {
    title: '增压洗',
    key: 'pressureWash',
    desc: '智能提升水压，加大出水量',
    icon: './assets/image/E3/pressurizedWashComl.png',
    toshibaIcon: './assets/image/toshiba/pressureWash.png',
  },
  safeGuard: {
    title: '安全卫士',
    key: 'safeGuard',
    desc: '',
    icon: './assets/image/E3/appointComl.png',
  },
  safeProtect: {
    title: '安全防护',
    key: 'safeProtect',
    desc: '启动保护安全用水',
    toshibaIcon: './assets/image/toshiba/safeProtect.png',
  },
  saveGas: {
    title: '省气统计',
    key: 'saveGas',
    desc: '查看省气情况',
    toshibaIcon: './assets/image/toshiba/saveGas.png',
  },
  serverWaterAppoint: {
    title: '定时零冷水',
    key: 'serverWaterAppoint',
    desc: '预约时段启动零冷水',
    iconfont: 'deviceWaterAppoint',
    icon: './assets/image/E3/appointcolmo.png',
  },
  sterilization: {
    title: 'UV杀菌',
    key: 'sterilization',
    desc: '有效杀灭水中细菌',
    icon: './assets/image/E3/sterilizationColm.png',
  },
  sterilizationSwitch: {
    title: 'UV杀菌',
    key: 'sterilizationSwitch',
    desc: '有效杀灭水中细菌',
    iconfont: 'sterilization',
    icon: './assets/image/E3/sterilizationColm.png',
  },
  spaMode: {
    title: 'SPA',
    key: 'spaMode',
    desc: '匹配SPA曲线，缓解疲劳',
  },
  intelligentVoice: {
    title: '智能语音',
    key: 'intelligentVoice',
    desc: '开启智慧生活',
    iconfont: 'intelligentVoice',
  },
  timingOperation: {
    title: '定时开关机',
    key: 'timingOperation',
    desc: '到设定时间，开关机',
    icon: './assets/image/E3/timingOperation.png',
  },
  keyIntelligence: {
    title: '健康浴',
    key: 'keyIntelligence',
    desc: '自动调温，匹配温度曲线',
    icon: './assets/image/E3/intelligentScene.png',
  },
  thalposis: {
    title: '随温感',
    key: 'thalposis',
    icon: './assets/image/E3/senseTemOn.png',
  },
  intelTemperature: {
    title: '智温感',
    key: 'intel_temperature',
    icon: './assets/image/E3/intelTemOn.png',
  },
  kitchen: {
    title: '厨房洗',
    key: 'kitchen',
    icon: './assets/image/E3/kitchenWashOn.png',
  },
  washBowl: {
    title: '洗碗模式',
    key: 'wash_bowl',
    icon: './assets/image/E3/bowlWashOn.png',
  },
  highTemperature: {
    title: '高温水',
    key: 'highTemperature',
    icon: './assets/image/E3/highTemWaterOn.png',
  },
  baby: {
    title: '婴儿浴',
    key: 'baby',
    icon: './assets/image/E3/babyBathOn.png',
  },
  adult: {
    title: '成人浴',
    key: 'adult',
    icon: './assets/image/E3/adultBathOn.png',
  },
  old: {
    title: '老人浴',
    key: 'old',
    icon: './assets/image/E3/oldBathOn.png',
  },
  petWash: {
    title: '宠物洗',
    key: 'pet_wash',
    icon: './assets/image/E3/petOn.png',
  },
  eco: {
    title: 'ECO',
    key: 'eco',
    icon: './assets/image/E3/eco_s.png',
  },
  personOne: {
    title: '专享温度1',
    key: 'personOne',
    icon: './assets/image/E3/personOne.png',
  },
  personTwo: {
    title: '专享温度2',
    key: 'personTwo',
    icon: './assets/image/E3/personTwo.png',
  },
  personThree: {
    title: '专享温度3',
    key: 'personThree',
    icon: './assets/image/E3/personThree.png',
  },
}

// 共用组件，具有不同名称、图片或描述的功能
const functionMapper = {
  changeLitreFrequency: {
    title: '智能变频',
    key: 'changeLitre',
  },
  pressureWashWater: {
    title: '水量增压',
    key: 'pressureWash',
  },
  pressureWashZY: {
    title: '增压',
    key: 'pressureWash',
  },
  pressureWashZYMY: {
    title: '增压沐浴',
    key: 'pressureWash',
  },
  coldWaterDotOld: {
    title: '点动零冷水',
    key: 'coldWaterDot',
  },
  coldWaterDotDD: {
    title: '点动零冷水',
    key: 'coldWaterDot',
  },
  coldWaterDotYR: {
    title: '点动零冷水',
    key: 'coldWaterDot',
  },
  coldWaterDotNew: {
    title: '点动零冷水',
    key: 'coldWaterDot',
  },
  bubbleSelectNew: {
    title: '超微净泡',
    key: 'bubbleSelect',
  },
}

// 拼装function对象
const getFunctionData = function (key) {
  let mapperItem = functionMapper[key] || { key: key } // 无匹配则使用默认参数
  return {
    ...functionData[mapperItem.key],
    ...mapperItem,
    originKey: key,
  }
}
export const getFuncList = function (list = []) {
  return list.map((key) => getFunctionData(key))
}

// 批量配置处理
const handleSetting = function (setting) {
  let functionList = [...setting.funcList]
  setting.cardList = []
  // 首页卡片配置处理
  if (setting.type != 'colmo') {
    setting.cardList.push('setTemp') //温度卡片
    let cardPool = ['function', 'bathReport', 'activity', 'safeGuard']
    let showCardList = ['bathReport', 'activity']
    functionList.push(getFunctionData('filterLife')) // 滤芯功能默认带，无阻垢滤芯显示VC滤芯

    // -------------------------------------------------------------------------------------------
    setting.coldWaterList = functionList
    let coldAllList = [
      'intelligentVoice',
      'coldWaterDot',
      'aiColdWater',
      'aiColdWaterSwitch',
      'serverWaterAppoint',
      'deviceWaterAppoint',
      'coldWaterSetting',
      'deviceWaterAppointRepeat',
    ]
    let exceptColdList = [
      'aiKitchen',
      'intelligentVoice',
      'keyIntelligence',
      'timingOperation',
      'coldWaterDot',
      'bathCurve',
      'bathtubCurveSelect',
      'bathtubUpSet',
      'bathtubWater',
      'bubbleSelect',
      'capacity',
      'changeLitre',
      'cloudTem',
      'coldWater',
      'coldWaterMaster',
      'coldWaterHighTem',
      'doublePressure',
      'filterLife',
      'gestureFunction',
      'highTempLockSwitch',
      'pressureWash',
      'safeGuard',
      'safeProtect',
      'saveGas',
      'spaMode',
      'sterilization',
      'sterilizationSwitch',
    ]
    let exceptVoiceList = [
      'aiKitchen',
      'aiColdWater',
      'aiColdWaterSwitch',
      'serverWaterAppoint',
      'deviceWaterAppoint',
      'coldWaterSetting',
      'deviceWaterAppointRepeat',
      'keyIntelligence',
      'timingOperation',
      'coldWaterDot',
      'bathCurve',
      'bathtubCurveSelect',
      'bathtubUpSet',
      'bathtubWater',
      'bubbleSelect',
      'capacity',
      'changeLitre',
      'cloudTem',
      'coldWater',
      'coldWaterMaster',
      'coldWaterHighTem',
      'doublePressure',
      'filterLife',
      'gestureFunction',
      'highTempLockSwitch',
      'pressureWash',
      'safeGuard',
      'safeProtect',
      'saveGas',
      'spaMode',
      'sterilization',
      'sterilizationSwitch',
    ]

    // 语音卡片
    let voiceCardList = functionList
    let exceptvoiceIndex = -1
    voiceCardList = voiceCardList.filter((item) => {
      exceptvoiceIndex = exceptVoiceList.indexOf(item.key)
      return exceptvoiceIndex < 0 // 过滤卡片已显示的功能
    })
    setting.voiceCardList = voiceCardList
    if (setting.voiceCardList.length > 0) {
      setting.cardList.push('voice')
    }

    // 零冷水卡片
    let coldCardList = functionList
    //-----------新增（有coldWaterDot,配置coldWaterSetting--------------------
    if (coldCardList.some((i) => i.key == 'coldWaterDot')) {
      coldCardList.push(getFunctionData('coldWaterSetting'))
    }
    let exceptcoldIndex = -1
    coldCardList = coldCardList.filter((item) => {
      exceptcoldIndex = exceptColdList.indexOf(item.key)
      return exceptcoldIndex < 0
    })
    if (coldCardList.some((i) => i.key == 'deviceWaterAppoint')) {
      coldCardList.unshift(getFunctionData('aiColdWater'))
    }

    let coldCardFinalList = coldCardList.filter((item) => item.key !== 'deviceWaterAppoint')
    setting.coldCardList = coldCardFinalList

    // 单次循环/零冷水添加到零冷水卡片
    if (setting.controlFunc) {
      if (setting.controlFunc.indexOf('coldWater') > -1) {
        setting.coldCardList.unshift(functionData.coldWater)
      }
      if (setting.controlFunc.indexOf('coldWaterMaster') > -1) {
        setting.coldCardList.unshift(functionData.coldWaterMaster)
      }
    }
    if (setting.coldCardList.length > 0) {
      setting.cardList.push('cold')
    }

    // -------------------------------------------------------------------------------------------
    // 模式卡片
    if (setting.personOne) {
      setting.modeList.push(mode.personOne)
    }
    if (setting.personTwo) {
      setting.modeList.push(mode.personTwo)
    }
    if (setting.personThree) {
      setting.modeList.push(mode.personThree)
    }
    if (setting.modeList.length > 0) {
      setting.cardList.push('mode')
    }

    // -------------------------------------------------------------------------------------------
    // 云管家卡片
    if (setting.cloudHome) {
      setting.cardList.push('cloudHome')
    }
    // -------------------------------------------------------------------------------------------
    // 筛选特色功能卡片
    let coldIndex = -1
    functionList = functionList.filter((item) => {
      let cardIndex = cardPool.indexOf(item.key)
      cardIndex > -1 && showCardList.push(item.key)
      coldIndex = coldAllList.indexOf(item.key)
      return cardIndex < 0 && coldIndex < 0 // 过滤卡片已显示的功能
    })
    // 特色功能添加定时开关机
    // if(util.compareVersion('8.5.0')){
    //   functionList.unshift(getFunctionData('timingOperation'))
    // }
    functionList.length > 0 && showCardList.push('function') // 添加特色功能
    showCardList.sort((a, b) => cardPool.indexOf(a) - cardPool.indexOf(b)) // 按原数组顺序排序
    showCardList.forEach((key) => setting.cardList.push(key)) // 添加卡片配置
  } else {
    // colmo
    functionList.unshift(getFunctionData('bathReport'))
    functionList.unshift(getFunctionData('temperatureSetting'))
  }

  setting.funcList = functionList
  return setting
}

module.exports = Behavior({
  data: {
    setting: {},
  },
  methods: {
    async getSetting(sn8) {
      let { data: resp } = await requestService.request('common', {
        msg: 'getAppModelConfig',
        params: { protype: 'e3', sn8: sn8 },
      })
      if (resp.retCode == 0 && resp.result) {
        if (resp.result.config) {
          let setting = JSON.parse(resp.result.config)
          this.setData({
            setting: handleSetting(setting),
          })
          console.log('设备信息', this.data.setting)
        } else {
          sn8 = 'default'
          this.getSetting(sn8)
        }
      } else {
        this.getSetting(sn8)
      }
    },
  },
})
