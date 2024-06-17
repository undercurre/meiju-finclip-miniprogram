/**
 * 设备运行状态模块
 */
import consoleFunction from '../../../utils/console/console'
import platformOptions from '../../../platform/wechat/platformOptions'
const console = consoleFunction(platformOptions.platform)
import { DEVICE_STATUS, TIPS_STATUS } from '../utils/const'
import getErrors from './errors' //故障模块

export default {
  options: {
    module: 'status',
  },
  states: {
    statusNum: -1, //状态标志位，用于判断
    statusTxt: '', //状态文描，用于显示
    errorsTxt: '', //故障文描
    tipsStatusNum: -1, //顶部提示类状态标志位，用于判断
    tipsStatusTxt: '', //顶部提示类状态文描，用于显示
    inTDS: 0, //进水tds
    outTDS: 0, //出水tds
    hasInTDS: null, //有进水tds
    hasOutTDS: null, //有出水tds
    tdsTips: '', //制水时显示的tips
    isMachineBrewing: false, //冲泡机冲泡状态
  },
  watch: {
    deviceStatus: function (nVal, oVal) {
      if (nVal.hasOwnProperty('offline') && !nVal.offline && oVal.offline) {
        this.getDeviceSetting(this.deviceSetting)
      }
      this.updateStatus(nVal)
    },
    // deviceSetting: function () {
    //   this.updateStatus(this.deviceStatus)
    // },
    destroyAllTimer: function (nVal) {
      if (nVal && nVal == 1) {
        //离开插件后恢复初始状态
        this.deviceStatus = {}
        this.getDeviceSetting(null)
      }
    },
  },
  methods: {
    updateStatus(data) {
      if (this.deviceSetting && this.deviceInfo && data.version) {
        //处理tds显示-----------------------------------------------------------
        if (this.deviceSetting.addOutTds) {
          //后期升级加了tds但是再后来换比亚迪芯片又把tds去掉了，现通过版本加复位，这里特殊判断
          if (['63202082', '632A2082'].includes(this.deviceInfo.sn8) && data.e_version && data.e_version == 150) {
            this.hasOutTDS = false
          } else {
            this.hasOutTDS = data.e_version ? true : false
          }
        } else {
          this.hasOutTDS = this.deviceSetting.hasOutTDS ? true : false
        }
        if (this.deviceSetting.addInTds) {
          this.hasInTDS = data.e_version ? true : false
        } else {
          this.hasInTDS = this.deviceSetting.hasInTDS ? true : false
        }
        if (this.deviceSetting.deviceKind == 1 || this.deviceSetting.deviceKind == 4) {
          this.outTDS = data.out_tds ? data.out_tds : 0
          this.inTDS = data.in_tds ? data.in_tds : 0
          if (this.deviceInfo.sn8 == '0001686A') {
            //0001686A这款产品电控上报的TDS高低位是反的，需要处理一下。
            let num = parseInt(data.out_tds)
            let remainder = num % 256
            this.outTDS = (num - remainder) / 256 + remainder * 256
          }
          if (this.deviceInfo.sn8 == '000A1890' && data.out_tds != 65535) {
            //禅意净水机新版本无TDS
            this.hasOutTDS = true
          }
          if (data.out_tds < 0) {
            this.outTDS = 15 //针对有时候出水TDS数据错乱出现负数的情况,当出现负数时给插件一个固定值，暂定15；
          }
          if (this.hasOutTDS && this.hasInTDS && data.filter === 'on' && this.outTDS < this.inTDS / 2) {
            this.tdsTips = '水质正常，请放心饮用'
          } else {
            this.tdsTips = ''
          }
        }

        //处理全局统一状态-----------------------------------------------------------
        if (data.offline) {
          //离线
          this.statusNum = 0
        } else if (getErrors(this.deviceSetting, this.deviceInfo.sn8, data)) {
          //故障
          this.errorsTxt = getErrors(this.deviceSetting, this.deviceInfo.sn8, data)
          if (this.errorsTxt == '强制待机(机器制水时间过长)' || this.errorsTxt == '出水时间过长，请重新上电') {
            this.statusNum = 2
          } else {
            this.statusNum = 1
          }
        } else if (
          this.deviceSetting.isCloudBrew &&
          data.brew_status &&
          data.lack_water !== 'on' &&
          data.brew_status !== 6
        ) {
          //冲泡机状态
          let isWashTea = data.set_tea_washing === 2
          if (data.brew_status === 0 && isWashTea) {
            this.statusNum = 20
          } else if (data.brew_status === 1) {
            this.statusNum = 16
          } else if (data.brew_status === 2) {
            this.statusNum = 29
          } else if (data.brew_status === 3) {
            this.statusNum = 30
          } else if (data.brew_status === 4) {
            this.statusNum = isWashTea ? 17 : 18
          } else if (data.brew_status === 5 && !isWashTea) {
            this.statusNum = 19
          } else if (data.brew_status === 6 && !isWashTea) {
            this.statusNum = 21
          } else if (data.brew_status === 7) {
            this.statusNum = 22
          } else if (data.brew_status === 8) {
            this.statusNum = 23
          } else if (data.brew_status === 9) {
            this.statusNum = 24
          } else if (data.brew_status === 10) {
            this.statusNum = 25
          } else if (data.brew_status === 11) {
            this.statusNum = 26
          } else if (data.brew_status === 12) {
            this.statusNum = 27
          } else if (data.brew_status === 13) {
            this.statusNum = 28
          } else {
            this.statusNum = -1
          }
        } else if (
          ((data.heat_status && data.heat_status == 'on') || (data.heat_start && data.heat_start == 1)) &&
          !['63001908'].includes(this.deviceInfo.sn8) && //63001908借用加热状态做为功能 不显示加热状态
          !(['6300906A', '63200970'].includes(this.deviceInfo.sn8) && data.water_kind == 6) && // 6300906A 63200970出常温水不显示加热状态
          !(['63200984', '6320095S'].includes(this.deviceInfo.sn8) && data.heat == 'off') //电控问题，电控在初次上电强制制水期间上报了加热，实际没加热
        ) {
          //加热中
          this.statusNum = 3
        } else if (this.deviceSetting.deviceKind < 5 && data.wash && data.wash === 'on') {
          //滤芯冲洗中
          this.statusNum = 4
        } else if (data.germicidal && data.germicidal === 'on') {
          //灭菌中
          this.statusNum = 5
        } else if (data.filter && data.filter === 'on') {
          //制水中
          this.statusNum = 6
          if (data.leaking_protect_status && data.leaking_protect_status === 'on') {
            //制水保护中
            this.statusNum = 7
          }
        } else if (data.out_water && data.out_water === 'on') {
          //出水中
          this.statusNum = 8
        } else if (data.ice_gall_status && [1, 3].includes(data.ice_gall_status)) {
          //制冷状态
          this.statusNum = data.ice_gall_status == 3 ? 9 : 10
        } else if (data.uv_sterilize && data.uv_sterilize === 'on') {
          //UV杀菌中
          this.statusNum = 11
        } else if (
          this.deviceSetting.deviceKind < 5 &&
          data.heat &&
          data.heat === 'on' &&
          this.deviceInfo.sn8 !== '632A0A63'
        ) {
          //保温中
          this.statusNum = 12
        } else if (data.regeneration && data.regeneration === 'on') {
          //再生中
          this.statusNum = 13
        } else if (data.clean && data.clean === 'on') {
          //清洗中
          this.statusNum = 14
        } else if (this.deviceSetting.deviceKind == 9 || this.deviceSetting.deviceKind == 10) {
          //软水和中央净  制水中/待机中
          if (data.velocity) {
            this.statusNum = 6
          } else {
            this.statusNum = 15
          }
        } else {
          this.statusNum = -1
        }

        if (this.statusNum > -1) {
          if (this.statusNum == 3 && this.deviceSetting.currentTemShow) {
            //部分型号显示加热茶类
            this.statusTxt = `${this.deviceSetting.teaList[data.heat_tea]}加热中`
          } else {
            this.statusTxt = DEVICE_STATUS[this.statusNum]
          }
        } else {
          this.statusTxt = ''
          this.errorsTxt = ''
        }

        //处理顶部提示类状态-----------------------------------------------------------
        if (data.offline) {
          //离线则恢复初始
          this.tipsStatusNum = -1
        } else if (this.statusNum === 2) {
          //制水时间过长
          this.tipsStatusNum = 0
        } else if (data.lack_water && data.lack_water === 'on' && this.deviceInfo.sn8 !== '63301903') {
          // 缺水中
          this.tipsStatusNum = 1
        } else if (this.deviceSetting.saltHintCount && data.left_salt < this.deviceSetting.saltHintCount) {
          // 软水机 剩余盐量提示
          this.tipsStatusNum = 2
        } else if (data.leaking_protect_status && data.leaking_protect_status === 'on') {
          // 出水保护中
          this.tipsStatusNum = 4
        } else if (this.deviceSetting.deviceKind == 9 && data.leak_water && data.leak_water === 'on') {
          // 软水机 漏水提醒
          this.tipsStatusNum = 5
        } else {
          this.tipsStatusNum = -1
        }

        if (this.tipsStatusNum > -1) {
          if (this.tipsStatusNum === 0) {
            this.tipsStatusTxt = this.errorsTxt
          } else {
            this.tipsStatusTxt = TIPS_STATUS[this.tipsStatusNum]
          }
        } else {
          this.tipsStatusTxt = ''
        }

        //处理冲泡机的冲泡状态-----------------------------------------------------------
        if (data.brew_status) {
          this.isMachineBrewing = parseInt(data.brew_status, 10) !== 6
        } else {
          this.isMachineBrewing = false
        }
      } else {
        if (data.offline) {
          this.statusNum = 0
          this.statusTxt = DEVICE_STATUS[this.statusNum]
        } else {
          //离开插件后恢复初始状态
          this.statusNum = -1
          this.statusTxt = ''
          this.errorsTxt = ''
          this.tipsStatusNum = -1
          this.tipsStatusTxt = ''
          this.inTDS = 0
          this.outTDS = 0
          this.hasInTDS = null
          this.hasOutTDS = null
          this.tdsTips = ''
          this.isMachineBrewing = false
        }
      }

      console('updateStatus', this.statusNum, this.statusTxt)
    },
  },
}
