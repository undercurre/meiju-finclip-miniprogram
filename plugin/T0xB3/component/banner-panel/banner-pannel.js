import computedBehavior, { codePointAt, concat, substring } from '../../../../utils/miniprogram-computed'
import lottie from '../../card/assets/js/lottie-miniprogram/index'
import animateData from '../../card/assets/js/animateData'
import Language from '../../card/assets/js/Language'
import configuration from '../../card/assets/js/configuration'
import service from '../../card/assets/js/service'
import icon from '../../assets/img'
import { requestService } from '../../../../utils/requestService'
import { getReqId, getStamp } from 'm-utilsdk/index'
import { pluginEventTrack } from '../../../../track/pluginTrack'
import rs from '../../assets/img'

const DIFF_ALL_MODE_SN = [
  '7310031J',
  '731100C1',
  '0000XC83',
  '731150C1',
  '0000XC81',
  '00110B01',
  '7310XC82',
  '731110E1',
  '0090Q15S',
  '7310XC80',
  '731XC80B',
  '73150T01',
  '731120BX',
  '73110Q15',
  '73110Q33',
  '731XC81B',
  '73190Q15',
  '73190H07',
  '73110YQ1',
  '73100315',
  '73100316',
  '73100317',
  '7310008U',
  '7310031F',
  '7310031B',
  '7310031C',
  '7310031G',
  '7310031D',
  '7310031K',
  '7310000A',
  '73100289',
  '7310031N',
  '7310031Q',
  '73100323',
  '73100321',
]

const multiVersion = [
  '0000XC83',
  '731150C1',
  '00110B01',
  '73150T01',
  '731120BX',
  '73110Q15',
  '73100315',
  '73100316',
  '0090Q15S',
  '7310XC80',
  '731XC80B',
  '731XC81B',
  '73190Q15',
]

const ERRORDESCS = {
  sensor: {
    title: '传感器故障',
    code: {
      title: '',
      value: '',
    },
    desc: '传感器异常，请关闭电源，联系售后处理~',
    show: true,
    advice: {
      title: '维修建议',
      list: ['温度传感器发生故障，设备不能正常监测腔内温度，继续使用存在安全风险;请断开设备电源，联系售后更换传感器。'],
    },
    src: '',
  },
  heater: {
    title: '发热管故障',
    code: {
      title: '',
      value: '',
    },
    desc: '发热管异常，请关闭电源，联系售后处理~',
    show: true,
    advice: {
      title: '维修建议',
      list: ['请关闭电源，联系售后处理.'],
    },
    src: '',
  },
  controller: {
    title: '温控器故障',
    code: {
      title: '',
      value: '',
    },
    desc: '温控器异常，请关闭电源，联系售后处理~',
    show: true,
    advice: {
      title: '维修建议',
      list: ['请关闭电源，联系售后处理.'],
    },
    src: '',
  },
  door: {
    title: '柜门开,请关柜门',
    code: {
      title: '',
      value: '',
    },
    desc: '柜门已打开，请先关闭柜门后操作~',
    show: true,
    advice: {
      title: '维修建议',
      list: ['1.若已关闭柜门，请确认柜门是否关紧；', '2.若柜门关紧后依然报警，请联系售后处理。'],
    },
    src: '',
  },
}
const INFODESCS = {
  clean: {
    title: '安全提醒',
    code: {
      title: '',
      value: '',
    },
    desc: '消毒柜需要清洗，建议您进行清洁~',
    show: true,
    advice: {
      title: '消息详情',
      list: [
        '时间:',
        '消毒柜使用一段时间后需要进行清洁，以保持消毒柜内部干净卫生，为您和您的家人健康考虑，建议您进行清洗~',
      ],
    },
  },
}

const downStair = ['73100289', '73100321', '00110B01_1', '00110B01_2', '73110Q15_1', '7310031N'] // 单柜使用下柜上报的数据

Component({
  behaviors: [computedBehavior],
  properties: {
    status: {
      type: Object,
      value: {},
    },
    applianceData: {
      type: Object,
      value: {},
      observer(val) {
        // console.log(val)
      },
    },
    setting: {
      type: Object,
      value: {},
    },
  },
  data: {
    loadImage: '',
    cloudModeList: [],
    testText: '',
    icon,
    hasConfig: false,
    // 记录是否处于异常状态
    is_error: false,
    showPage: {
      workStatus: '消毒中',
      workTime: 0,
      curStatus: 'standby',
      //是否为保温模式
      isPreservation: false,
      //保温温度
      insulationTemperature: 0,
      //是否为保管
      isSafekeeping: false,
      //保管工作时附加显示文本
      keepText: '',
      orderDay: '',
      orderTime: '',
      temperature: 0,
    },
    selectedType: 0,
    confObj: {
      lockBtn: false,
    },
    selectedMode: {},
    dataArray: [],
    tabData: [],
    otaMode: {},
    modeKey: [],
    offline: false,
    sn8: '',
    configVersion: '',
    isAIshow: false,
    power: {
      // false 表示关机状态
      state: false,
    },
    // 单柜，以下柜为主柜
    isSingleOta: true,
    //暖盘选择方式：0-AI 1-自定义
    AIstate: 0,
    cleanInterval: 0,
    warnWords: [],
    modeList: [],
    queryId: -1,
    AIendTime: '',
    tip: {
      // info/warning/warning-i18n/danger
      type: '',
      desc: '',
      btnText: '',
    },
    // 设备是否处于工作状态
    isWorking: false,
    isLock: false,
    // 上中下室故障状态
    errorList: [
      {
        is_error: false,
        errorDesc: '',
      },
      {
        is_error: false,
        errorDesc: '',
      },
      {
        is_error: false,
        errorDesc: '',
      },
    ],
    // 非一键消毒状态
    isOneSwitch: false,
    errorDesc: '',
    Language,
  },
  computed: {
    hour() {
      return Math.floor(this.data.selectedMode.time / 60)
    },
    workTimeHour() {
      return Math.floor(this.data.showPage.workTime / 60)
    },
    srcList() {
      return animateData
    },
    isShowTemp() {
      if (this.data.confObj.hideTemperature && this.data.selectedType == 0) {
        return false
      } else if (this.data.confObj.hideTemperature2 && this.data.selectedType == 1) {
        return false
      } else if (isNaN(this.data.showPage.temperature)) {
        return false
      }
      return true
    },
    statusTitle() {
      if (!this.data.offline && this.data.power.state && !this.data.is_error) {
        if (this.data.showPage.curStatus == 'power_on') {
          return this.data.Language.onStatus
        } else if (this.data.showPage.curStatus == 'order') {
          return this.data.Language.orderStatus
        } else if (this.data.showPage.curStatus == 'working') {
          return this.data.showPage.workStatus
        }
      } else if (!this.data.power.state) {
        return '关机中'
      } else {
        return ''
      }
    },
  },
  observers: {
    async status(val) {
      if (val && JSON.stringify(val) != '{}') {
        this.queryStatus(true)
        await this.updateShowPage()
      }
    },
    'power.state'(val) {
      if (val) {
        wx.setStorage({
          key: 'powerState',
          data: val,
        })
      }
    },
  },
  lifetimes: {
    attached() {
      this.getConfig()
      // this.getOtaModeList().then((res) => {
      //   // let arr = []
      //   // res.forEach((r) => {
      //   //   arr.push(JSON.parse(r))
      //   // })
      //   // console.log(arr)
      // })
    },
  },
  methods: {
    getTempTime() {
      let date = new Date()
      return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds() + ' '
    },
    // loadImages() {
    //   const imageList = [
    //     icon.on_pause_bg,
    //     icon.standby,
    //     icon.off_view_bg,
    //     icon.stop,
    //     icon.start,
    //     icon.turn_on,
    //     icon.turn_off,
    //     icon.pause
    //   ]
    //   console.log(imageList)
    //   // imageList
    //   for(let i = 0; i < imageList.length; i++){
    //     setTimeout(() => {
    //       this.setData({
    //         loadImage: imageList[i]
    //       })
    //     }, i * 100)
    //   }
    // },
    loadWork() {
      icon.on_pause_bg = icon.on_pause_bg + ' '
    },
    loadStandby() {
      icon.standby = icon.standby + ' '
    },
    loadOff() {
      icon.off_view_bg = icon.off_view_bg + ' '
    },
    loadBtnStop() {
      icon.stop = icon.stop + ' '
    },
    loadBtnStart() {
      icon.start = icon.start + ' '
    },
    loadBtnTurnOn() {
      icon.turn_on = icon.turn_on + ' '
    },
    loadBtnTurnOff() {
      icon.turn_off = icon.turn_off + ' '
    },
    loadBtnPause() {
      icon.pause = icon.pause + ' '
    },
    async getModeByKey(key, index) {
      // console.log(index)
      if (key == 35) {
        // AI暖盘模式
        return {
          name: 'AI_warm_tableware',
          key: '35',
          text: this.data.AIstate ? '自定义暖盘' : 'AI 暖盘',
          time: '',
          desc: '餐前自动加热餐具',
          temperature: '',
          imgSrc: '',
          activeImgSrc: '',
          isDiy: false,
        }
      }
      if (key == 39) {
        // AI净味模式
        return {
          name: 'AI_clean',
          key: '39',
          text: 'AI 净味',
          time: '',
          desc: '餐前自动清新腔内空气',
          temperature: '',
          imgSrc: '',
          activeImgSrc: '',
          isDiy: false,
        }
      }
      if (key == 36) {
        // this.getSelectedOta()
        let result = await this.getOtaMode()
        let mode = {}
        let otaMode = {}
        if (result.modeId > -1) {
          otaMode = this.data.cloudModeList.find((item) => {
            return item.id == result.modeId
          })
          mode = this.translate(otaMode)
        }
        //ota模式
        // let mode = this.translate(this.data.otaMode)
        return mode
      }
      let listIndex = this.data.isSingleOta ? 0 : index
      let list1 = this.data.confObj.modeList[listIndex]
      let list2 = this.data.confObj._modeList[listIndex]
      if (list1 == undefined || list2 == undefined) return {}
      for (let i = 0; i < list1.length; i++) {
        if (list1[i].key == key) {
          let temp = this.data.modeKey
          temp[index] = list1[i].key
          this.setData({
            modeKey: temp,
          })
          return list1[i]
        }
      }
      if (list2 && list2.length > 0) {
        for (let i = 0; i < list2.length; i++) {
          if (list2[i].key == key) {
            let temp = this.data.modeKey
            temp[index] = list2[i].key
            this.setData({
              modeKey: temp,
            })
            return list2[i]
          }
        }
      }

      let temp = this.data.modeKey
      temp[index] = list1[0].key
      this.setData({
        modeKey: temp,
      })
      // 若未查到对应mode，赋默认值，防止报错
      return list1[0]
    },
    translate(otaMode) {
      // ota形式转普通模式
      let mode = JSON.parse(JSON.stringify(otaMode))
      mode.key = '36'
      mode.text = otaMode.name
      mode.time = otaMode.duration
      mode.temperature = otaMode.maxTemp + '°C'
      mode.imgSrc = ''
      mode.activeImgSrc = ''
      mode.isDiy = true
      return mode
    },
    // 获取配置表并存入本地 最早进行
    getConfig() {
      let self = this
      let versionInfo
      // let sn = this.properties.applianceData.sn
      this.setData({
        deviceInfo: this.properties.applianceData,
        sn8: this.properties.applianceData.sn8,
        offline: this.properties.applianceData.onlineStatus == '0',
      })
      if (multiVersion.includes(this.data.sn8)) {
        // 这里是有多版本的
        const queryParam = {
          query: {
            query_code: 'version_query',
            query_type: 'version_query',
          },
        }
        this.luaQuery(true, queryParam)
          .then((res) => {
            versionInfo = {
              softVersion: res.soft_version || 0,
              otaVersion: res.ota_version || 0,
            }
            // 110B01 V1版本支持AI暖盘
            wx.setStorageSync('cloudModeList', [])
            if (this.data.sn8 == '00110B01' && versionInfo && versionInfo.softVersion) {
              this.setData({
                isAIshow: true,
              })
              // this.data.otaMode = this.getSelectedOtaMode()
              this.getCloudModeList()
            }
            let configObj = configuration.getConfigBySN(
              versionInfo && versionInfo.softVersion ? this.data.sn8 + '_' + versionInfo.softVersion : this.data.sn8
            )
            this.setData(
              {
                confObj: configObj,
              },
              function () {
                this.getModeList(configObj)
                let isSingleOta = self.data.confObj.modeList.length == 1 || this.data.sn8 == '73100289'
                // ota单腔取下柜状态，特殊处理标志位
                self.setData(
                  {
                    isSingleOta: isSingleOta,
                    selectedType: isSingleOta ? 1 : 0,
                    hasConfig: true,
                  },
                  function () {
                    self.setData(
                      {
                        warnWords: configuration.getWarnWords(self.data.sn8),
                        configVersion:
                          versionInfo && versionInfo.softVersion
                            ? this.data.sn8 + '_' + versionInfo.softVersion
                            : this.data.sn8,
                      },
                      function () {
                        wx.setStorage({
                          key: 'selectedType',
                          data: this.data.selectedType,
                        })
                        wx.setStorage({
                          key: 'isSingleOta',
                          data: this.data.isSingleOta,
                        })
                        wx.setStorage({
                          key: `${this.properties.applianceData.applianceCode}confObj`,
                          data: this.data.confObj,
                        })
                        wx.setStorage({
                          key: 'snver',
                          data:
                            versionInfo && versionInfo.softVersion
                              ? this.data.sn8 + '_' + versionInfo.softVersion
                              : this.data.sn8,
                        })
                      }
                    )
                  }
                )
              }
            )
          })
          .catch((e) => {
            // 获取配置表的时候出现错误 应该有提示 退出小程序后再次进入
          })
      } else {
        let temp = configuration.getConfigBySN(
          versionInfo && versionInfo.softVersion ? this.data.sn8 + '_' + versionInfo.softVersion : this.data.sn8
        )
        this.setData(
          {
            confObj: temp,
          },
          function () {
            this.getModeList(temp)
            let isSingleOta = self.data.confObj.modeList.length == 1 || this.data.sn8 == '73100289'
            // ota单腔取下柜状态，特殊处理标志位
            self.setData(
              {
                isSingleOta: isSingleOta,
                selectedType: isSingleOta ? 1 : 0,
                hasConfig: true,
              },
              function () {
                self.setData(
                  {
                    warnWords: configuration.getWarnWords(self.data.sn8),
                    configVersion:
                      versionInfo && versionInfo.softVersion
                        ? this.data.sn8 + '_' + versionInfo.softVersion
                        : this.data.sn8,
                  },
                  function () {
                    wx.setStorage({
                      key: 'selectedType',
                      data: this.data.selectedType,
                    })
                    wx.setStorage({
                      key: 'isSingleOta',
                      data: this.data.isSingleOta,
                    })
                    wx.setStorage({
                      key: `${this.properties.applianceData.applianceCode}confObj`,
                      data: this.data.confObj,
                    })
                    wx.setStorage({
                      key: 'snver',
                      data: this.data.sn8,
                    })
                  }
                )
              }
            )
          }
        )
      }
      if (this.data.sn8 == '7310031G') {
        this.setData({
          isAIshow: true,
        })
      }
      if (!this.data.confObj.powerBtn) {
        // 当不包含电源键时，默认开机状态
        this.setData({
          'power.state': true,
        })
      }
    },
    luaQuery(loading = true, command = {}) {
      //查询设备状态
      return new Promise((resolve, reject) => {
        if (loading) {
          wx.showLoading({
            title: '加载中',
            mask: true,
          })
        }
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.properties.applianceData.applianceCode,
          command,
        }
        requestService.request('luaGet', reqData).then(
          (resp) => {
            if (loading) {
              wx.hideLoading()
            }
            if (resp.data.code == 0) {
              resolve(resp.data.data || {})
            } else {
              reject(resp)
            }
          },
          (error) => {
            if (loading) {
              wx.hideLoading()
            }
            if (error && error.data) {
              if (error.data.code == 1307) {
                //离线
                this.setData({
                  'applianceData.onlineStatus': '0',
                })
                // this.triggerEvent("modeChange", this.getCurrentMode());
              }
            }
            reject(error)
          }
        )
      })
    },
    // 查询方法
    queryStatus(isInit) {
      const queryParam = {}
      this.postLuaAndAnalysis(queryParam, false, isInit)
    },
    // 调用lua接口并解析
    postLuaAndAnalysis(params, bool, isInit, sFun, fFun) {
      if (isInit) {
        this.analysisFun(this.properties.status, this.getError(this.properties.status))
      } else {
        this.analysisFun(this.properties.status)
      }
    },
    // 数据解析方法np
    async analysisFun(status, callBack) {
      // 设备开关状态
      if (status.upstair_work_status && status.downstair_work_status && status.middlestair_work_status) {
        if (
          status.upstair_work_status != 'power_off' ||
          status.downstair_work_status != 'power_off' ||
          status.middlestair_work_status != 'power_off'
        ) {
          this.setData({
            'power.state': true,
          })
        } else {
          if (!this.data.confObj.powerBtn) {
            this.setData({
              'power.state': true,
            })
          } else {
            this.setData({
              'power.state': false,
            })
          }
        }

        if (
          status.upstair_work_status == 'working' ||
          status.downstair_work_status == 'working' ||
          status.middlestair_work_status == 'working'
        ) {
          this.setData({
            isWorking: true,
          })
        } else {
          this.setData({
            isWorking: false,
          })
        }
      } else if (status.upstair_work_status && status.downstair_work_status) {
        if (status.upstair_work_status != 'power_off' || status.downstair_work_status != 'power_off') {
          this.setData({
            'power.state': true,
          })
        } else {
          if (!this.data.confObj.powerBtn) {
            this.setData({
              'power.state': true,
            })
          } else {
            this.setData({
              'power.state': false,
            })
          }
        }

        if (status.upstair_work_status == 'working' || status.downstair_work_status == 'working') {
          this.setData({
            isWorking: true,
          })
        } else {
          this.setData({
            isWorking: false,
          })
        }
      }
      // 童锁
      if (status.lock && status.lock == 'locked') {
        this.setData({
          isLock: true,
        })
      } else {
        this.setData({
          isLock: false,
        })
      }
      // 首次进入插件页查询故障（03 32）
      // if (callBack) {
      //   if (this.data.sn8 == '0000XC83' || this.data.sn8 == '0000XC83') {
      //     if (status.error_code == 'error') {
      //       this.setData({
      //         'errorList[0].is_error': true,
      //       })
      //       if (status.error_door_state_up == 1 || status.error_door_state_down == 1) {
      //         this.setData({
      //           'errorList[0].errorDesc': ERRORDESCS.door.desc,
      //         })
      //       } else {
      //         this.setData({
      //           'errorList[0].errorDesc': ERRORDESCS.sensor.desc,
      //         })
      //       }
      //     }
      //   } else {
      //     // let isContinue = callBack(status)
      //   }
      // }
    },
    checkStatus() {
      if (!this.data.power.state) {
        wx.showToast({
          title: '关机中，请先开机',
          icon: 'none',
        })
        return false
      }
      if (this.data.is_error) {
        wx.showToast({
          title: '有故障或者门未关严',
          icon: 'none',
        })
        return false
      }
      return true
    },
    // 初次进入界面存在异常调用03 32查询
    getError(status) {
      //异常处理
      if (status.is_error) {
        this.setData({ is_error: true })
        // 查询存在异常时，查0x32指令获取具体故障信息
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.properties.applianceData.applianceCode,
          command: {
            query: { query_type: 'error_query' },
          },
        }
        requestService
          .request('luaGet', reqData)
          .then((data) => {})
          .catch((e) => {})
        return false
      }
      return true
    },
    // 解析故障信息
    getErrorInfo(status) {
      let ErrorList = [
        {
          is_error: false,
          errorDesc: '',
        },
        {
          is_error: false,
          errorDesc: '',
        },
        {
          is_error: false,
          errorDesc: '',
        },
      ]
      // 初始化
      this.setData({
        is_error: false,
        errorDesc: '',
      })
      // OA指令传递故障信息
      if (status.error_door_state_up || status.door_upstair === 'open') {
        ErrorList[0].is_error = true
        ErrorList[0].errorDesc = ERRORDESCS.door.desc
      }
      if (status.error_door_state_middle || status.door_middlestair === 'open') {
        ErrorList[1].is_error = true
        ErrorList[1].errorDesc = ERRORDESCS.door.desc
      }
      if (status.error_door_state_down || status.door_downstair === 'open') {
        ErrorList[2].is_error = true
        ErrorList[2].errorDesc = ERRORDESCS.door.desc
      }
      if (status.error_up_temp_sensor) {
        ErrorList[0].is_error = true
        ErrorList[0].errorDesc = ERRORDESCS.sensor.desc
      }
      if (status.error_middle_temp_sensor) {
        ErrorList[1].is_error = true
        ErrorList[1].errorDesc = ERRORDESCS.sensor.desc
      }
      if (status.error_down_temp_sensor) {
        ErrorList[2].is_error = true
        ErrorList[2].errorDesc = ERRORDESCS.sensor.desc
      }
      if (status.error_up_heater) {
        ErrorList[0].is_error = true
        ErrorList[0].errorDesc = ERRORDESCS.heater.desc
      }
      if (status.error_middle_heater) {
        ErrorList[1].is_error = true
        ErrorList[1].errorDesc = ERRORDESCS.heater.desc
      }
      if (status.error_down_heater) {
        ErrorList[2].is_error = true
        ErrorList[2].errorDesc = ERRORDESCS.heater.desc
      }
      if (status.error_temp_controller) {
        ErrorList[0].is_error = true
        ErrorList[0].errorDesc = ERRORDESCS.controller.desc
        ErrorList[1].is_error = true
        ErrorList[1].errorDesc = ERRORDESCS.controller.desc
        ErrorList[2].is_error = true
        ErrorList[2].errorDesc = ERRORDESCS.controller.desc
      }

      // 门控特殊逻辑
      // 门控状态在上柜传递，传感器在下柜传递，有故障时设备不可操作；传感器故障先于门控，故下柜有故障数据则以下柜为准，无下柜故障数据以上柜为准；
      if (this.data.confObj.specialDoor) {
        if (ErrorList[2].is_error && ErrorList[2].errorDesc != ERRORDESCS.door.desc) {
          ErrorList[0].is_error = ErrorList[2].is_error
          ErrorList[0].errorDesc = ErrorList[2].errorDesc
        } else {
          if (this.data.sn8 !== '7310031G') {
            // 200Q11下柜不同步上柜门控状态
            ErrorList[2].is_error = ErrorList[0].is_error
            ErrorList[2].errorDesc = ErrorList[0].errorDesc
          }
        }
      }
      this.setData({
        errorList: ErrorList,
      })
      // 根据errorList结果判断是否显示故障及埋点上传
      if (this.data.tabData.length == 1) {
        for (let i = 0; i < 3; i++) {
          if (this.data.errorList[i].is_error) {
            this.setData({
              is_error: true,
              errorDesc: this.data.errorList[i].errorDesc,
            })
            break
          }
        }
        if (this.data.errorDesc) {
          let msg = ''
          if (this.data.errorDesc == ERRORDESCS.sensor.desc) {
            msg = ERRORDESCS.sensor.title
          } else if (this.data.errorDesc == ERRORDESCS.heater.desc) {
            msg = ERRORDESCS.heater.title
          } else if (this.data.errorDesc == ERRORDESCS.controller.desc) {
            msg = ERRORDESCS.controller.title
          } else if (this.data.errorDesc == ERRORDESCS.door.desc) {
            msg = ERRORDESCS.door.title
          }
          if (!this.data.errorReported) {
            this.setData({
              errorReported: true,
            })
          }
        } else {
          this.setData({
            errorReported: false,
            is_error: false,
            errorDesc: '',
          })
        }
      } else if (this.data.tabData.length == 2) {
        let index = 0
        if (this.data.selectedType == 0) {
          index = 0
        } else {
          index = 2
        }
        if (this.data.errorList[index].is_error) {
          this.setData({
            is_error: true,
            errorDesc: this.data.errorList[index].errorDesc,
          })
        } else {
          this.setData({
            is_error: false,
            errorDesc: '',
          })
        }
        if (this.data.errorDesc) {
          let msg = ''
          if (this.data.errorDesc == ERRORDESCS.sensor.desc) {
            msg = ERRORDESCS.sensor.title
          } else if (this.data.errorDesc == ERRORDESCS.heater.desc) {
            msg = ERRORDESCS.heater.title
          } else if (this.data.errorDesc == ERRORDESCS.controller.desc) {
            msg = ERRORDESCS.controller.title
          } else if (this.data.errorDesc == ERRORDESCS.door.desc) {
            msg = ERRORDESCS.door.title
          }
          if (!this.data.errorReported) {
            this.setData({
              errorReported: true,
            })
          }
        } else {
          this.setData({
            errorReported: false,
          })
        }
      } else if (this.data.tabData.length == 3) {
        if (this.data.errorList[this.data.selectedType].is_error) {
          this.setData({
            is_error: true,
            errorDesc: this.data.errorList[this.data.selectedType].errorDesc,
          })
        } else {
          this.setData({
            is_error: false,
            errorDesc: '',
          })
        }
        if (this.data.errorDesc) {
          let msg = ''
          if (this.data.errorDesc == ERRORDESCS.sensor.desc) {
            msg = ERRORDESCS.sensor.title
          } else if (this.data.errorDesc == ERRORDESCS.heater.desc) {
            msg = ERRORDESCS.heater.title
          } else if (this.data.errorDesc == ERRORDESCS.controller.desc) {
            msg = ERRORDESCS.controller.title
          } else if (this.data.errorDesc == ERRORDESCS.door.desc) {
            msg = ERRORDESCS.door.title
          }
          if (!this.data.errorReported) {
            this.setData({
              errorReported: true,
            })
          }
        } else {
          this.setData({
            errorReported: false,
          })
        }
      }
    },
    // 初始化柜体数量
    getModeList(obj) {
      let length = obj.modeList.length
      switch (length) {
        case 1:
          this.setData({
            tabData: ['上室'],
            modeKey: [''],
          })
          break
        case 2:
          this.setData({
            tabData: ['上室', '下室'],
            modeKey: ['', ''],
          })
          break
        case 3:
          this.setData({
            tabData: ['上室', '中室', '下室'],
            modeKey: ['', '', ''],
          })
          break
      }
    },
    getSelectedOtaMode() {
      let mode = 0
      let list = this.getOtaModeList()
      let selectedOta = this.getSelectedOta()
      mode = list.find((item) => {
        return selectedOta.modeId == item.id
      })
      return mode
    },
    getOtaModeList() {
      return new Promise((resolve, reject) => {
        service.getOtaModeList((res) => {
          resolve(res)
        })
      })
    },
    async getOtaMode() {
      let req = {
        msg: 'CloudTimingSeqMode',
        params: {
          applianceId: this.properties.applianceData.applianceCode,
          action: 'get',
          modeId: 0,
        },
      }
      let res = await requestService.request('/cfhrs/b3/v1/api', req)
      if (res && res.data && res.data.result) {
        return res.data.result
      } else {
        return { modeId: -1 }
      }
    },
    getSelectedOta() {
      return new Promise((resolve) => {
        service.getSeqMode(function (res) {
          resolve(res)
        })
      })
    },
    // 弹出框确认
    dialogConfirm(tag) {
      let sub = ''
      let params = {}
      sub = this.getStair() + 'stair'
      switch (tag) {
        case 'cancelDialog':
          // 无电源按钮为老产品，取消指令power_off
          params[sub + '_work_status'] = this.data.confObj.powerBtn ? 'power_on' : 'power_off'
          break
        case 'cancelOrderDialog':
          params[sub + '_work_status'] = 'power_on'
          break
        case 'powerOffDialog':
          params = {
            power: 'off',
          }
          break
      }
      const pointMap = {
        cancelDialog: '取消工作',
        cancelOrderDialog: '取消预约',
        powerOffDialog: '关机',
      }
      pluginEventTrack('user_behavior_event', null, {
        page_id: 'page_control',
        page_name: '插件首页',
        widget_id: `click_${tag}`,
        widget_name: pointMap[tag],
        ext_info: (tag == 'powerOffDialog' ? '运行状态下关机' : '') + '弹出' + pointMap[tag] + '对话框后点击确认',
      })
      this.luaControl(params).then(() => {
        this.triggerEvent('clickTab', {})
      })
    },
    // 按钮点击功能
    async btnClick(e) {
      this.setData({ testText: this.getTempTime() })
      let params = {}
      let subString = ''
      let flag = e.currentTarget.dataset.flag
      subString = this.getStair() + 'stair'
      let curModeKey = wx.getStorageSync(`${this.properties.applianceData.applianceCode}modeKey`)
      switch (flag) {
        case 'turn_on': //开机
          params = {
            power: 'on',
          }
          pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_power_on',
            widget_name: '电源键',
            ext_info: '开机',
          })
          break
        case 'turn_off': //关机
          if (this.data.isWorking) {
            // 设备运行时弹框提示
            wx.showModal({
              title: '温馨提示',
              content: Language.powerOffDialogContent,
              cancelText: Language.cancel,
              confirmText: Language.confirm2,
              success: (res) => {
                if (res.confirm) {
                  this.dialogConfirm('powerOffDialog')
                }
              },
            })
            return
          }
          params = {
            power: 'off',
          }
          pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_power_off',
            widget_name: '电源键',
            ext_info: '待机状态下关机',
          })
          break
        case 'start': {
          // 启动
          if (this.data.isLock) {
            // 童锁默认值为false，有童锁功能才会有lock的场景
            wx.showToast({
              title: '设备处于童锁状态，请解锁后操作',
              icon: 'none',
            })
            return
          }
          if (this.data.is_error) {
            // 异常阻止操作
            wx.showToast({
              title: this.data.errorDesc,
              icon: 'none',
            })
            return
          }
          let selMode = await this.getModeByKey(curModeKey, this.data.selectedType)
          params[subString + '_mode'] = selMode.key
          let hour = Math.floor(selMode.time / 60)
          let min = Math.floor(selMode.time % 60)
          pluginEventTrack('user_behavior_event', null, {
            page_id: 'page_control',
            page_name: '插件首页',
            widget_id: 'click_start',
            widget_name: '运行',
            ext_info: '运行模式 ' + selMode.text,
          })
          params[subString + '_hour'] = hour
          params[subString + '_min'] = min
          if (selMode.key == 22) {
            params[subString + '_temp'] = this.data.showPage.insulationTemperature || 40
          }
          break
        }
        case 'cancel': //取消工作
          if (this.data.isLock) {
            //童锁默认值为false，有童锁功能才会有lock的场景
            wx.showToast({
              title: '设备处于童锁状态，请解锁后操作',
              icon: 'none',
            })
            return
          }
          if (this.data.is_error) {
            // 异常阻止操作
            wx.showToast({
              title: '故障中，请关机',
              icon: 'none',
            })
            return
          }
          wx.showModal({
            title: '温馨提示',
            content: Language.cancelDialogContent,
            cancelText: Language.cancel,
            confirmText: Language.confirm2,
            success: (res) => {
              if (res.confirm) {
                this.dialogConfirm('cancelDialog')
              }
            },
          })
          return
      }
      this.luaControl(params)
        .then((res) => {
          this.triggerEvent('clickTab', {})
        })
        .catch((e) => {})
    },
    luaControl(param) {
      //控制设备
      return new Promise((resolve, reject) => {
        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        let reqData = {
          reqId: getReqId(),
          stamp: getStamp(),
          applianceCode: this.properties.applianceData.applianceCode,
          command: {
            control: param,
          },
        }
        requestService.request('luaControl', reqData).then(
          (resp) => {
            wx.hideLoading()
            if (resp.data.code == 0) {
              resolve(resp.data.data || {})
            } else {
              reject(resp)
            }
          },
          (error) => {
            wx.hideLoading()
            wx.showToast({
              title: '请求失败，请稍后重试',
              icon: 'none',
              duration: 2000,
            })
            console.error(error)
            reject(error)
          }
        )
      })
    },
    // 柜体切换
    async tabClicked(obj) {
      let indexNum
      if (typeof obj == 'object') {
        indexNum = obj.detail.index
      } else {
        indexNum = Number(obj) || 0
      }

      // if (this.data.offline || !this.data.power.state) {
      //   return
      // }
      this.setData({
        selectedType: indexNum,
      })
      // this.triggerEvent('clickTab', {indexNum:indexNum})
      wx.setStorage({ key: 'selectedType', data: indexNum })
      this.triggerEvent('clickTab', { indexNum: indexNum })
      // 判断是否显示故障信息
      if (this.data.tabData.length == 1) {
        for (let i = 0; i < 3; i++) {
          if (this.data.errorList[i].is_error) {
            this.setData({
              is_error: true,
              errorDesc: this.data.errorList[i].errorDesc,
            })
            break
          }
        }
        if (this.data.errorDesc) {
          let msg = ''
          if (this.data.errorDesc == ERRORDESCS.sensor.desc) {
            msg = ERRORDESCS.sensor.title
          } else if (this.data.errorDesc == ERRORDESCS.heater.desc) {
            msg = ERRORDESCS.heater.title
          } else if (this.data.errorDesc == ERRORDESCS.controller.desc) {
            msg = ERRORDESCS.controller.title
          } else if (this.data.errorDesc == ERRORDESCS.door.desc) {
            msg = ERRORDESCS.door.title
          }
          if (!this.data.errorReported) {
            this.setData({
              errorReported: true,
            })
          }
        } else {
          this.setData({
            is_error: false,
            errorDesc: '',
            errorReported: false,
          })
        }
      } else if (this.data.tabData.length == 2) {
        let index = 0
        if (this.data.selectedType == 0) {
          index = 0
        } else {
          index = 2
        }
        if (this.data.errorList[index].is_error) {
          this.setData({
            is_error: true,
            errorDesc: this.data.errorList[index].errorDesc,
          })
        } else {
          this.setData({
            is_error: false,
            errorDesc: '',
          })
        }
        if (this.data.errorDesc) {
          let msg = ''
          if (this.data.errorDesc == ERRORDESCS.sensor.desc) {
            msg = ERRORDESCS.sensor.title
          } else if (this.data.errorDesc == ERRORDESCS.heater.desc) {
            msg = ERRORDESCS.heater.title
          } else if (this.data.errorDesc == ERRORDESCS.controller.desc) {
            msg = ERRORDESCS.controller.title
          } else if (this.data.errorDesc == ERRORDESCS.door.desc) {
            msg = ERRORDESCS.door.title
          }
          if (!this.data.errorReported) {
            this.setData({
              errorReported: true,
            })
          }
        } else {
          this.setData({
            errorReported: false,
          })
        }
      } else if (this.data.tabData.length == 3) {
        if (this.data.errorList[this.data.selectedType].is_error) {
          this.setData({
            is_error: true,
            errorDesc: this.data.errorList[this.data.selectedType].errorDesc,
          })
        } else {
          this.setData({
            is_error: false,
            errorDesc: '',
          })
        }
        if (this.data.errorDesc) {
          let msg = ''
          if (this.data.errorDesc == ERRORDESCS.sensor.desc) {
            msg = ERRORDESCS.sensor.title
          } else if (this.data.errorDesc == ERRORDESCS.heater.desc) {
            msg = ERRORDESCS.heater.title
          } else if (this.data.errorDesc == ERRORDESCS.controller.desc) {
            msg = ERRORDESCS.controller.title
          } else if (this.data.errorDesc == ERRORDESCS.door.desc) {
            msg = ERRORDESCS.door.title
          }
          if (!this.data.errorReported) {
            this.setData({
              errorReported: true,
            })
          }
        } else {
          this.setData({
            errorReported: false,
          })
        }
      }
    },

    getStair() {
      let mapper = {
        上室: 'up',
        中室: 'middle',
        下室: 'down',
      }
      let stair = this.data.isSingleOta
        ? downStair.includes(this.data.configVersion)
          ? 'down'
          : 'up'
        : mapper[this.data.tabData[this.data.selectedType]]
      return stair
    },

    async getModeInStatus() {
      let status = this.properties.status
      let stair = this.getStair()
      let mode = await this.getModeByKey(status[`${stair}stair_mode`], this.data.selectedType)
      return { status, stair, mode }
    },

    getDayAndTimeByLeftMin(minLeft) {
      let myDate = new Date() //获取系统当前时间
      let currentHour = myDate.getHours()
      let currentMinute = myDate.getMinutes()
      let startMinLeft = minLeft
      let AllMinutes = currentHour * 60 + currentMinute + startMinLeft
      let hour, minute
      let day, time

      if (AllMinutes - 24 * 60 < 0) {
        day = '今日'
        hour = parseInt(AllMinutes / 60) <= 9 ? '0' + parseInt(AllMinutes / 60) : parseInt(AllMinutes / 60)
        minute = parseInt(AllMinutes % 60) <= 9 ? '0' + parseInt(AllMinutes % 60) : parseInt(AllMinutes % 60)
      } else if (AllMinutes - 48 * 60 < 0) {
        day = '明日'
        hour =
          parseInt((AllMinutes - 24 * 60) / 60) <= 9
            ? '0' + parseInt((AllMinutes - 24 * 60) / 60)
            : parseInt((AllMinutes - 24 * 60) / 60)
        minute =
          parseInt((AllMinutes - 24 * 60) % 60) <= 9
            ? '0' + parseInt((AllMinutes - 24 * 60) % 60)
            : parseInt((AllMinutes - 24 * 60) % 60)
      } else if (AllMinutes - 72 * 60 < 0) {
        day = this.getDateStr(2)
        hour =
          parseInt((AllMinutes - 48 * 60) / 60) <= 9
            ? '0' + parseInt((AllMinutes - 48 * 60) / 60)
            : parseInt((AllMinutes - 48 * 60) / 60)
        minute =
          parseInt((AllMinutes - 48 * 60) % 60) <= 9
            ? '0' + parseInt((AllMinutes - 48 * 60) % 60)
            : parseInt((AllMinutes - 48 * 60) % 60)
      } else {
        day = this.getDateStr(3)
        hour =
          parseInt((AllMinutes - 72 * 60) / 60) <= 9
            ? '0' + parseInt((AllMinutes - 72 * 60) / 60)
            : parseInt((AllMinutes - 72 * 60) / 60)
        minute =
          parseInt((AllMinutes - 72 * 60) % 60) <= 9
            ? '0' + parseInt((AllMinutes - 72 * 60) % 60)
            : parseInt((AllMinutes - 72 * 60) % 60)
      }
      time = hour + ':' + minute
      return [day, time]
    },
    getDateStr: function (AddDayCount) {
      let dd = new Date()
      dd.setDate(dd.getDate() + AddDayCount) //获取AddDayCount天后的日期
      let d = dd.getDate() //获取当前几号，不足10补0
      return d + '日'
    },

    async dealOrderTime(status) {
      let isOldLua = DIFF_ALL_MODE_SN.includes(this.properties.applianceData.sn8)
      let hour = 0
      let min = 0
      let sec = 0
      let result = await this.getModeInStatus()
      let stair = result.stair
      if (!isOldLua) {
        hour = status[`${stair}stair_order_hour`]
        min = status[`${stair}stair_order_min`]
        sec = status[`${stair}stair_order_sec`]
      } else {
        hour = status['order_hour'] || 0
        min = status['order_min']
        sec = status['order_sec']
      }
      let leftMin = 60 * hour + min + (sec ? 1 : 0)
      let orderList = this.getDayAndTimeByLeftMin(leftMin)
      let orderDay = orderList[0]
      let orderTime = orderList[1]
      return { orderDay, orderTime }
    },

    // dealOrderTime(status) {
    //   let hour = status['order_hour']
    //   let min = status['order_min']
    //   let sec = status['order_sec']
    //   let today = new Date()
    //   let endTimeStamp = today.getTime() + hour * 60 * 60 * 1000 + min * 60 * 1000
    //   let endDate = new Date(endTimeStamp)
    //   let orderDay =
    //     endDate.getFullYear() > today.getFullYear()
    //       ? '次日'
    //       : endDate.getMonth() > today.getMonth()
    //         ? '次日'
    //         : endDate.getDate() > today.getDate()
    //           ? '次日'
    //           : '今日'
    //   let formHour = endDate.getHours() < 10 ? '0' + endDate.getHours() : endDate.getHours()
    //   let formMin = endDate.getMinutes() < 10 ? '0' + endDate.getMinutes() : endDate.getMinutes()
    //   let orderTime = formHour + ':' + formMin
    //   return { orderDay, orderTime }
    // },

    // 获取云端模式。暂时只有00110B01的1版本有这个需要
    getCloudModeList() {
      this.getOtaModeList().then((res) => {
        let arr = []
        res.forEach((r) => {
          arr.push({
            id: r.id,
            key: '36',
            name: r.name,
            duration: r.duration,
            maxTemp: r.maxTemp,
            activeImgSrc: `https://midea-video.oss-cn-hangzhou.aliyuncs.com/b3/aidash/${r.iconPrefixName}_active.png`,
            imgSrc: `https://midea-video.oss-cn-hangzhou.aliyuncs.com/b3/aidash/${r.iconPrefixName}_native.png`,
            timeDesc:
              Language.about +
              (r.duration > 60
                ? Math.floor(r.duration / 60) + '时' + (r.duration % 60) + '分 | '
                : r.duration + '分 | ') +
              (r.maxTemp && r.maxTemp != '' ? r.maxTemp + '℃' : '--'),
          })
        })
        this.setData({
          cloudModeList: arr,
        })
        wx.setStorage({ key: 'cloudModeList', data: arr })
      })
    },
    // 更新showPage
    async updateShowPage() {
      // console.log(this.getTempTime() + ' test order update show page start')
      if (!this.data.hasConfig) {
        wx.showLoading({
          title: '加载中',
        })
        // setTimeout(() => {
        //   this.updateShowPage()
        // }, 1000)
        return
      }
      wx.hideLoading()
      let showPage = {}
      let result = await this.getModeInStatus()
      let status = result.status
      let mode = result.mode
      let stair = result.stair
      let min = parseInt(status[`${stair}stair_min`]) || 0
      let hour = parseInt(status[`${stair}stair_hour`]) || 0
      let sec = parseInt(status[`${stair}stair_sec`]) || 0

      let workTime = sec == 0 ? hour * 60 + min : hour * 60 + min + 1
      showPage.workTime = workTime
      showPage.modeText = mode.text
      showPage.workStatus = mode.text + '中'
      showPage.curStatus = status[`${stair}stair_work_status`]
      let dealOrderResult = await this.dealOrderTime(status)
      showPage.orderDay = dealOrderResult.orderDay
      showPage.orderTime = dealOrderResult.orderTime
      showPage.isHeating =
        status[`${stair}stair_ispreheat`] == 'preheat' && status[`${stair}stair_work_status`] == 'working'
      showPage.isCooling =
        status[`${stair}stair_iscooling`] == 'cooling' && status[`${stair}stair_work_status`] == 'working'
      // console.log(this.getTempTime() + 'test order showPage time ' + showPage.workTime)
      let isError = status.is_error
      console.log('checkout error quest ' + isError)
      this.setData({
        showPage: showPage,
        is_error: isError,
      })
    },
  },
})
