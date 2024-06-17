import btnConfig from './btnConfiguration.js'
import modeConfig from './modeConfiguration.js'

let confObj = {
  lockBtn: false, // 包含童锁
  lockLimit: false, // 是否限制童锁在功能运行时才有效
  modeList: [], // 模式列表key:{name:"", key:"", text:"", time:"", desc:"", temperature:"", imgSrc:"", activeImgSrc:""}
  DIYBtn: false, // 包含DIY拓展功能
  _modeList: [], //拓展模式列表{name:"", key:"", text:"", time:"", desc:"", temperature:"", imgSrc:"", activeImgSrc:""}
  powerBtn: true, //电源键
  orderBtn: false, // 预约键
  pauseBtn: false, // 暂停键
  showWarning: false, //是否包含安全提示文本
  specialDoor: false, //特殊门控逻辑：多柜共用一个门控
  showLeftTimeOfPreheat: false, // 升降温状态时间固定，显示倒计时（一般情况显示“分析中”）
  isShowMaxTemp: false, // 只显示最高温度
  hideTemperature: false, // 上柜隐藏温度显示
  hideTemperature2: false, // 下柜隐藏温度显示
  //......         各版本的UI差异，例如界面、按钮等
}

export default {
  getConfigBySN: function (sn) {
    if (!sn) {
      return false
    }
    confObj.lockBtn = this.isBtnExist(sn, 'lock')
    confObj.lockLimit = this.isBtnExist(sn, 'limitLock')
    confObj.modeList = this.getModeObj(sn, 1)
    confObj.DIYBtn = !this.isBtnExist(sn, 'diy') // 取反
    confObj._modeList = this.getModeObj(sn, 0)
    confObj.powerBtn = !this.isBtnExist(sn, 'power') // 取反
    confObj.orderBtn = this.isBtnExist(sn, 'order')
    confObj.pauseBtn = this.isBtnExist(sn, 'pause')
    confObj.hideTemperature = this.isBtnExist(sn, 'hideTemperature')
    confObj.hideTemperature2 = this.isBtnExist(sn, 'hideTemperature2')
    confObj.showWarning = this.isBtnExist(sn, 'showWarning')
    confObj.specialDoor = this.isBtnExist(sn, 'specialDoor')
    confObj.showLeftTimeOfPreheat = this.isBtnExist(sn, 'showLeftTimeOfPreheat')
    confObj.isShowMaxTemp = this.isBtnExist(sn, 'isShowMaxTemp')
    confObj.oneSwitchStart = this.isBtnExist(sn, 'oneSwitchStart')
    confObj.nfcMainView = this.isBtnExist(sn, 'nfcMainView')

    // 当机型未适配时，赋默认值(上柜快速杀菌和烘干)
    if (confObj.modeList.length == 0 && confObj._modeList.length == 0) {
      confObj.modeList = [
        [
          {
            name: 'rapid_disinfection',
            key: '6',
            text: '快速除菌',
            time: '28',
            desc: '短时快速消毒餐具',
            temperature: '50°C',
            imgSrc: './assets/image/img/KSXD.png',
            activeImgSrc: './assets/image/img/KSXD_actived.png',
            isDiy: false,
          },
        ],
      ]
      confObj._modeList = [
        [
          {
            name: 'drying',
            key: '2',
            text: '烘干',
            time: '60',
            desc: '光波发热烘干餐具',
            temperature: '125°C',
            imgSrc: './assets/image/img/DIY_CJHG.png',
            activeImgSrc: './assets/image/img/DIY_CJHG_actived.png',
            isDiy: true,
          },
        ],
      ]
      confObj.powerBtn = true
    }
    return confObj
  },
  isBtnExist: function (sn, key) {
    let list = btnConfig[key]
    if (list && list.indexOf(sn) > -1) {
      return true
    }
    return false
  },
  // key=1 为整机功能 key=0为DIY功能
  getModeObj: function (sn, key) {
    if (key) {
      return modeConfig.getModeObj(sn)
    } else {
      return modeConfig._getModeObj(sn)
    }
  },
  getWarnWords: function (sn) {
    return modeConfig.getWarnWords(sn)
  },
}
