import { requestService } from '../../../../utils/requestService'


// 全功能组件参数
const functionData = {
  'alwaysFell': {
    title: '全天温感', key: 'alwaysFell',
    desc: '舒适洗浴，全天呵护',
    icon: './assets/image/colmo/alwaysFell@2x.png',
  },
  'appointLeave': {
    title: '出门提醒', key: 'appointLeave',
    desc: '设置出门提醒',
  },
  'autoPowerOff': {
    title: '自动关机', key: 'autoPowerOff',
    desc: '保温90分钟后，无用水自动关机',
  },
  'bathCurve': {
    title: '沐浴曲线', key: 'bathCurve',
    desc: '个性化定制不同场景的温度曲线',
  },
  'bathReport': {
    title: '沐浴报告', key: 'bathReport',
    desc: '查看近期用水用电情况',
    icon: './assets/image/colmo/bathReport.png', // 仅colmo生效
  },
  'bathtubWater': {
    title: '浴缸用水', key: 'bathtubWater',
    desc: '一键设定合适的泡澡温度',
  },
  'changeRate2': {
    title: '变频速热', key: 'changeRate2',
    desc: '变频加热，快速提供热水',
    icon: './assets/image/colmo/changeRate@2x.png', // 仅colmo生效
    iconfont: 'changeRate',
  },
  'changeRate3': {
    title: '变频速热', key: 'changeRate3',
    desc: '变频加热，快速提供热水',
    iconfont: 'changeRate',
  },
  'changeRate32': {
    title: '变频速热', key: 'changeRate32',
    desc: '变频加热，快速提供热水',
    iconfont: 'changeRate',
  },
  'cloudHome3': {
    title: '云管家', key: 'cloudHome3',
    desc: '智能控温，省电省心',
    iconfont: 'cloudHome',
  },
  'cloudHome4': {
    title: '云管家', key: 'cloudHome4',
    desc: '智能控温，省电省心',
    iconfont: 'cloudHome',
  },
  'customBath': {
    title: '定制沐浴', key: 'customBath',
    desc: '模式多样，沐浴更舒适',
    iconfont: 'waterMode',
  },
  'eCapacity': {
    title: 'E+增容', key: 'eCapacity',
    desc: '加热至最高温度，提供更多热水',
  },
  'filterLife': {
    title: '滤芯寿命', key: 'filterLife',
    desc: '添加滤芯，实时提醒',
    icon: './assets/image/colmo/filterLife@2x.png', // 仅colmo生效
  },
  'healthyBath': {
    title: '健康沐浴', key: 'healthyBath',
    desc: '实时监控水质、耗材和肤质情况',
  },
  'highTempSterilize': {
    title: '高温抑菌', key: 'highTempSterilize',
    desc: '突破最高温度，持续80℃抑菌',
  },
  'intelligentVoice': {
    title: '智能语音', key: 'intelligentVoice',
    desc: '开启小美，与热水器对话',
  },
  'mbLife': {
    title: '镁棒寿命', key: 'mbLife',
    desc: '查看镁棒使用情况',
    icon: './assets/image/colmo/mbLife@2x.png', // 仅colmo生效
  },
  'morningNightBath': {
    title: '晨晚浴', key: 'morningNightBath',
    desc: '快捷预约早晚用水',
  },
  'nightElectricity': {
    title: '峰谷夜电', key: 'nightElectricity',
    desc: '电费便宜时，自动加热',
  },
  'nightElectricityCloud': {
    title: '峰谷夜电', key: 'nightElectricityCloud',
    desc: '电费便宜时，自动加热',
    iconfont: 'nightElectricity',
  },
  'outWater': {
    title: '出水断电', key: 'outWater',
    desc: '出水即断电，沐浴更安心',
    icon: './assets/image/colmo/outWater@2x.png', // 仅colmo生效
  },
  'saveMode': {
    title: '节能模式', key: 'saveMode',
    desc: '全天45°C保温，满足零星用水',
    iconfont: 'saveMode', // 设定默认值
  },
  'securitGuard': {
    title: '安全卫士', key: 'securitGuard',
    desc: '今天得分--',
  },
  'showerWater': {
    title: '淋浴用水', key: 'showerWater',
    desc: '一键设定合适的淋浴温度',
  },
  'smartHome': {
    title: '智能管家', key: 'smartHome',
    icon:'./assets/image/colmo/AIHome@2x.png', // 仅colmo生效
    desc: '智能调温，省电省心',
  },
  'smartSavingCloud': {
    title: '智能省电', key: 'smartSavingCloud',
    desc: '智能调温，省电省心',
    iconfont: 'aiEco',
  },
  'smartSleep': {
    title: '智能休眠', key: 'smartSleep',
    desc: '根据使用习惯，智能开/关机',
  },
  'smartSterilize': {
    title: '智能杀菌', key: 'smartSterilize',
    desc: '智能开启高温杀菌',
    iconfont: 'highTempSterilize',
  },
  'smartSterilizeCloud': {
    title: '智能杀菌', key: 'smartSterilizeCloud',
    desc: '智能开启高温杀菌',
    iconfont: 'highTempSterilize',
  },
  'sosScene': {
    title: '浴室一键呼救', key: 'sosScene',
    desc: '浴室发生危险，一键通知家人',
  },
  'speedWash': {
    title: '极速洗', key: 'speedWash',
    desc: '启动涡旋快热，满足单次洗浴',
  },
  'summerMode': {
    title: '夏季模式', key: 'summerMode',
    desc: '设定适合夏天的洗浴温度',
  },
  'superWater': {
    title: '超大水量', key: 'superWater',
    desc: '设置高温度，满足多人洗浴',
    icon:'./assets/image/colmo/MAXWater@2x.png', // 仅colmo生效
  },
  'tankLife': {
    title: '内胆保养', key: 'tankLife',
    desc: '查看内胆使用情况',
    icon: './assets/image/colmo/tankLife@2x.png', // 仅colmo生效
  },
  'tankReset': {
    title: '净胆复位', key: 'tankReset',
    desc: '清洗内胆后，恢复内胆初始状态',
    icon:'./assets/image/colmo/tankLife@2x.png', // 仅colmo生效
    iconfont: 'tankLife',
  },
  'tHeat': {
    title: 'T+瞬热', key: 'tHeat',
    desc: '启动涡旋快热，满足单次洗浴',
    icon:'./assets/image/colmo/tHeat@2x.png', // 仅colmo生效
  },
  'uvSterilize': {
    title: 'UV抑菌', key: 'uvSterilize',
    desc: '镜柜UV抑菌倒计时30分钟',
  },
  'washWater': {
    title: '洗漱模式', key: 'washWater',
    desc: '一键设定合适的洗漱温度',
    icon:'./assets/image/colmo/washWater@2x.png', // 仅colmo生效
  },
  'waterMode': {
    title: '用水模式', key: 'waterMode',
    desc: '模式多样，用水更舒适',
  },
  'waterQuality': {
    title: '水质检测', key: 'waterQuality',
    desc: '水质较差时，建议开启高温杀菌',
  },
  'waterQualityLocal': {
    title: '水质检测', key: 'waterQualityLocal',
    desc: '水质较差时，建议开启高温杀菌',
    iconfont: 'waterQuality',
  },
  'winterMode': {
    title: '冬季模式', key: 'winterMode',
    desc: '设定适合冬天的洗浴温度',
  },
  'intelligentScene': {
    title: '智能场景', key: 'intelligentScene',
    desc: '开启您的智能场景',
    iconfont: 'smartHome'
  },
  'singTankCygnet': {
    title: '快热魔方', key: 'singTankCygnet',
    desc: '启动单胆速热，快速提供热水',
    iconfont: 'halfTank'
  },
  'temperatureSetting': {
    title: '设置温度', key: 'temperatureSetting',
    iconfont: 'temperature',
    icon:'./assets/image/colmo/temSet@2x.png', // 仅colmo生效
  },
  'bathTemp': {
    title: '沐浴温度', key: 'temperatureSetting',
  },
}

// 共用组件，具有不同名称、图片或描述的功能
const functionMapper = {
  'freshSterilize': { // 用于Colmo
    title: '鲜活杀菌', key: 'smartSterilize', 
    icon:'./assets/image/colmo/freshSterilize@2x.png',
  },
  'freshSterilizeCloud': { // 用于Colmo
    title: '鲜活杀菌', key: 'smartSterilizeCloud', 
    icon:'./assets/image/colmo/freshSterilize@2x.png',
  },
  'highTempSterilizeCloud': { // 高温杀菌升级的云端智能杀菌（电控为高温杀菌，针对旧品升级）
    title: '智能杀菌', key: 'smartSterilizeCloud',
    iconfont: 'highTempSterilize',
  },
  'purifySkin': { // 用于Colmo
    title: '净肤浴', key: 'smartSterilize', 
    iconfont: 'cleanSkin'
  },
  'uhtSterilize': { // 用于小天鹅
    title: 'UHT杀菌', key: 'smartSterilize',
    iconfont: 'highTempSterilize',
  },
  'aiSterilize': { // 用于Colmo
    title: 'AI净滤', key: 'smartSterilize', 
    icon:'./assets/image/colmo/aiSterilize.png',
  },
  'speedSingTank': {
    title: '极速浴', key: 'singTankCygnet',
    desc: '启动单胆速热，快速提供热水',
    iconfont: 'speedWash'
  },
  'cleanSkin': {
    title: '净肤洗', key: 'eCapacity',
    desc: '设置高温度，杀菌净肤',
    icon:'./assets/image/colmo/cleanSkin@2x.png', // 仅colmo生效
    iconfont: 'cleanSkin',
  },
  'bigWater': {
    title: '大水量', key: 'eCapacity',
    iconfont: 'bigWater',
  },
  'bigWaterPart': {
    title: '大水量', key: 'eCapacity',
    iconfont: 'bigWater',
    isPart: true, // 新的分段小指令（2021.05）
  },
  'speedWashPart': {
    title: '极速洗', key: 'speedWash',
    isPart: true, // 新的分段小指令（2021.05）
  },
  'morePeople': {
    title: '多人洗', key: 'eCapacity',
    iconfont: 'threePerson',
  },
  'maxWater': { // 用于Colmo
    title: 'MAX水量', key: 'superWater',
    icon:'./assets/image/colmo/MAXWater@2x.png',
  },
  'bathtub': { 
    title: '浴缸洗', key: 'superWater',
    icon:'./assets/image/colmo/MAXWater@2x.png',
    iconfont: 'bathtubWater',
  },
  'aiHome': { // 用于Colmo
    title: 'AI管家', key: 'smartSavingCloud',
    icon:'./assets/image/colmo/AIHome@2x.png',
  },
  'aiHomePart': {
    title: 'AI管家', key: 'smartSavingCloud',
    icon:'./assets/image/colmo/AIHome@2x.png',
    isPart: true, // 新的分段小指令（2021.05）
  },
  'aiHomeLocal': { // 5100GQ43专用，不带蚂蚁森林的智能管家，试产机器外流
    title: 'AI管家', key: 'smartSaving',
    icon:'./assets/image/colmo/AIHome@2x.png',
  },
  'smartSaving': {
    title: '智能省电', key: 'smartHome',
    iconfont: 'smartSaving',
  },
  'aiEco': {
    title: 'AI节能', key: 'smartHome',
    icon:'./assets/image/E2_new/aiEco.png',
  },
  'seasonFell': {
    title: '四季随温', key: 'alwaysFell',
    iconfont: 'saveMode',
    desc: '根据季节智能设定合适温度',
  },
  'saveModePart': {
    title: '节能模式', key: 'saveMode',
    isPart: true, // 新的分段小指令（2021.05）
  },
  'lowEnergy': {
    title: '低耗保温', key: 'saveMode',
    desc: '设置中等温度，持续保温',
    iconfont: 'lowEnergy',
  },
  'mediumTemp': {
    title: '中温保温', key: 'saveMode',
    desc: '中温洗浴，热量不浪费',
  },
  'anytimeWash': { 
    // 低耗保温、中温保温功能的升级版，夏天保温在45°C，冬天保温在50°C，用户用水的时候立即启动涡旋速热功能，是做在电控端的
    title: '随时浴', key: 'saveMode',
    desc: '随时洗浴，热量不浪费',
    iconfont: 'anytimeWash',
  },
  'lowEnergySave': {
    title: '低耗节能', key: 'saveMode',
  },
  'lowEnergySavePart': {
    title: '低耗节能', key: 'saveMode',
    isPart: true, // 新的分段小指令（2021.05）
  },
  'ECO': { // 仅一款F6030-V3(HE)在用
    title: 'ECO', key: 'saveMode',
    desc: '设置合适温度，热量不浪费',
  },
  'highTempSterilize2': {
    title: '高温杀菌', key: 'highTempSterilize',
    desc: '突破最高温度，持续80℃杀菌',
  },
  'sterilizeWash': {
    title: '抑菌洗', key: 'highTempSterilize',
  },
  'electrolessWash': {
    title: '无电洗', key: 'outWater',
  },
  'singleHeat': {
    title: '单人瞬热', key: 'tHeat',
  },
  'aiSmartCurve': {
    title: 'AI智慧浴', key: 'bathCurve',
    icon:'./assets/image/bathCurve/bathCurveColmo.png', // 仅colmo生效
    // iconfont: 'aiSmartCurve',
  },
  'aiHealthCurve': {
    title: 'AI健康浴', key: 'bathCurve',
  },
};

// 拼装function对象
const getFunctionData = function (key) {
  let mapperItem = functionMapper[key] || { key: key } // 无匹配则使用默认参数
  return {
    ...functionData[mapperItem.key],
    ...mapperItem,
    originKey: key
  }
}

// 获取实际功能所对应的组件名, 当名称、图片、描述不同但功能相同时可直接在此配置
// title: 功能名称, 
// key: 实际功能对应的组件名,
// desc: 功能描述,
// icon: 功能图标,
// **与默认组件一致的参数可不填**
export const getFuncList = function(list = []) {
  // ------------版本特殊处理-------------
  // if (list.indexOf('cloudHome4') > -1 && !util.compareVersion('6.7.0')) {
  //   // 版本小于6.7.0无法使用云管家4.0，需要替换为云管家3.0
  //   list.splice(list.indexOf('cloudHome4'), 1, 'cloudHome3')
  // }
  // if (list.indexOf('sosScene') > -1 && !util.compareVersion('7.9.0')) {
  //   // 版本小于7.9.0无法使用一键呼救场景
  //   list.splice(list.indexOf('sosScene'), 1)
  // }
  // ------------批量功能处理-------------
  // 健康沐浴拓展所有杀菌型号
  let healthyBath= ['smartSterilizeCloud','highTempSterilize','highTempSterilize2','sterilizeWash','smartSterilize']
  if(healthyBath.some(i=> list.indexOf(i) > -1)){
    list.push('healthyBath')
  }
  // 云端峰谷夜电拓展
  if(list.indexOf('nightElectricity') < 0 && list.indexOf('nightElectricityCloud') < 0){
    list.push('nightElectricityCloud')
  }
  //智能杀菌处理（高温杀菌，高温抑菌，抑菌洗直接升级云端智能杀菌）
  let sterilizeList = ['highTempSterilize','sterilizeWash','highTempSterilize2']
  let sterilizeIndex = list.findIndex(i => sterilizeList.includes(i))
  if(list.indexOf('smartSterilizeCloud') < 0 && sterilizeIndex > -1){
    list[sterilizeIndex] = 'highTempSterilizeCloud'
  }
  return list.map(key => getFunctionData(key))
}

// ==============批量配置处理=============
const handleSetting = function (setting) {
  let functionList = [...setting.funcList]
  setting.cardList = []
  // 带活水的机型默认增加健康沐浴功能(colmo暂时不上)
  if (setting.ndReport == 1 && setting.type != 'colmo' && !functionList.some(i=>i.key=='healthyBath')) {
    functionList.push(getFunctionData('healthyBath'))
  }
  setting.type != 'colmo' && functionList.push(getFunctionData('intelligentScene')) // 智能场景默认带
  // 根据耗材配置自动添加对应的组件
  if (setting.mbReport) {
    functionList.push(getFunctionData('mbLife'))
  }
  functionList.push(getFunctionData('filterLife')) // 滤芯功能默认带，无阻垢滤芯显示VC滤芯
  if (setting.ndReport) {
    functionList.push(getFunctionData('tankLife'))
  }
  // ------------首页卡片配置处理-------------
  if (setting.type != 'colmo') {

  let cardPool = ['setTemp','bathTemp','healthyBath','cloudHome4','function','activity','bathReport','securitGuard'] // 顺序即为卡片先后顺序
  let showCardList = ['activity']
  functionList = functionList.filter(item => {
    let cardIndex = cardPool.indexOf(item.key)
    cardIndex > -1 && showCardList.push(item.key)
    return cardIndex < 0 // 过滤卡片已显示的功能
  })
  setting.specialConfig != 'noSetTemp' && showCardList.push('setTemp') //添加设置温度卡片
  functionList.length > 0 && showCardList.push('function') // 添加特色功能
  showCardList.sort((a, b) => cardPool.indexOf(a) - cardPool.indexOf(b)) // 按原数组顺序排序
  showCardList.forEach(key => setting.cardList.push(key)) // 添加卡片配置

  } else {
    if (functionList.some(i=>i.key=='cloudHome4')) {
      functionList.unshift(getFunctionData('cloudTempSetting'))
    } else if (setting.specialConfig != 'noSetTemp') {
      functionList.unshift(getFunctionData('temperatureSetting'))
    }
  }

  setting.funcList = functionList
  return setting
}

module.exports = Behavior({
  data: {
    setting: {},
  },
  methods: {
    async getSetting(sn8, a0) {
      let { data: resp } = await requestService.request('common', {
        msg: 'getAppModelConfig',
        params: { protype: 'e2', sn8: sn8 },
      })
      if (resp.retCode == 0 && resp.result) {
        if (resp.result.config) {
          let setting = JSON.parse(resp.result.config)
          console.log('获取到云端配置3',setting)
          this.setData({ 
              setting: handleSetting(setting)
           })
           console.log(this.data.setting)
           this.afterGetSetting()
        }else if(a0!=undefined){
          this.getSetting(`A0${a0}`)
        } else {
          this.getSetting('default')
        }
      } else {
        this.getSetting(sn8, a0)
      }
    }
  }
})