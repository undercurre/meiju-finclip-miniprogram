// plugin/T0xAC/moreFun/moreFun.js
const app = getApp()
const requestService = app.getGlobalConfig().requestService
import pluginMixin from 'm-miniCommonSDK/utils/plugin-mixin'
// 最新引入
var baseImgApi = app.getGlobalConfig().baseImgApi;
var imageDoamin = (baseImgApi.url).split('/projects/')[0] + '/projects/sit/meiju-lite-assets/';
import DeviceComDecorator from '../util/ac-service/DeviceComDecorator'
import selfApi from '../api/api'
import { cloudDecrypt } from 'm-utilsdk/index';
import { Btns } from '../util/BtnCfg'

let key = app.globalData?.userData?.key
let appKey = app.getGlobalConfig().appKey
Page({
  behaviors: [pluginMixin],
  /**
   * 页面的初始数据
   */
  data: {
    coldTipsNotShow: false,
    imageDoamin: imageDoamin,
    useLocalImg: false,
    localImg: '../assets/t0ac/img_no_shebei@2x.png',
    moreBtns: [],
    openPicker: false,
    applianceData: {
      type: Object,
      value: function () {
        return {}
      },
    },
    acstatus: {
      mode: 2,
      runStatus: 0,
      tempIn: '--',
      tempSet: 26,
      windSpeed: 102,
      windUpDown: 0,
      windLeftRight: 0,
      downWindLeftRight: 0,
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
      freshAirFanSpeed: 40,
      screenShow: 0,
      nonDirectWindType: 0,
    }, // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
    acNewStatus: {
      voiceBroadcastStatus: 0,
      switchSelfCleaning: 0,
      superCoolingSw: 0,
      switchNonDirectWind: 0,
      switchFreshAir: 0,
      freshAirFanSpeed: 40,
      switchUpDownNonDirectWind: 0,
      degerming:0
    },
    acSwStatus: {
      DeviceSwitch: false,
      RefrigerantCheck: false,
      HotMode: false,
      DryMode: false,
      UpDownSwipeWind: false,
      LeftRightSwipeWind: false,
      ECO: false,
      WindBlowing: false,
      FaWindBlowing: false,
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
      DryNewName: false,
      FilterClean: false,
      Show: false,
      Supercooling: false,
      Voice: false,
      Sound: false,
      FreshAir: false,
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
    },
    /*applianceStatus: {
      power: '',
      mode: 'auto',
      indoor_temperature: '--',
      temperature: 26,
      small_temperature: 0
    },
    applianceStatusNew: {
      no_wind_sense: 0,
      prevent_straight_wind: 0
    },*/
    acStatus: {
      power: '',
      mode: 'auto',
      indoor_temperature: '--',
      temperature: 26,
      small_temperature: 0,
    },
    btnObj: {},
    columns: [1, 2, 3],
    modeMap: [
      {
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
    ],
    freshAirFanSpeedMap: {
      40: '低',
      60: '中',
      80: '高',
      100: '强劲',
    },
    timerOffVal: [0],
    timerSetVal: 0,
    safeModeSwitch: 0,
    checkOnce: 0,
    SoundSwitch: false,
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
        text: '下防直吹',
        selected: false,
        angle: 3,
        value: 3,
      },
    ],
    showUpDownWindBlowing: false,
    fakeShow:true,
    showAutoColdWindPopup:false,
    hasAuto: true,
    isNoTime: true,
    disabled: false,
    dustFullTime: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getUrlparams(options)
    console.log('filter Clean init', options)
    let that = this
    if (options.collect) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
    // if (options.sleepCurve) {
    //   that.setData({
    //     sleepCurve: JSON.parse(options.sleepCurve)
    //   })
    // }
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromCtlPanel', (data) => {
      console.log('onload filter func', data)
      that.setData({
        moreBtns: data.data,
        deviceInfo: data.deviceInfo,
        DeviceComDecorator: data.DeviceComDecorator,
        ctrlType: data.ctrlType,
        event: data.event,
        deviceSnBle: data.deviceSnBle,
        deviceSnFromDeviceInfo: cloudDecrypt(data.deviceInfo.sn, app.globalData.userData.key, appKey),
        connectedDevice: data.connectedDevice,
        isCoolFree: data.isCoolFree,
        hasAuto: data.hasAuto
      })     
      // if (that.data.deviceInfo.sn) {
      //   that.getSleepCurve();
      //   that.getColdWindTipsFlag();
      // }
      // if (that.data.deviceInfo.btMac) {
      //   that.getSafeModeInfo()
      // }
      // that.query();
      if (that.data.ctrlType == 1) {
        that.query()

        that.data.event.on('updateStatus', (data) => {
          console.log(data, 'updateStatus events', data)
          that.data.DeviceComDecorator.AcProcess.parseAcceptPackage(data.data)

          // console.log(that.data.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw, '智控温开关----')          
          that.updateNewProtocolStatus(
            that.data.DeviceComDecorator.AcProcess.parser.newsendingState,
            that.data.DeviceComDecorator.AcProcess.parser.sendingState
          )
         
          // this.getSafeModeInfo();
          that.updateAcStatus(that.data.DeviceComDecorator.AcProcess.parser.sendingState)
        })
      } else if (that.data.ctrlType == '2') {
        console.log('远程控制，更多功能')
        app.globalData.DeviceComDecorator.event.on(
          'receiveMessageLan',
          (data) => {
            console.log('wifi moreFunc', data)   
            if(data.dust_full_time != undefined) {
              this.setData({
                dustFullTime: data.dust_full_time == 1
              })       
            } 
            // // console.log(app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState, "that.data.DeviceComDecorator.AcProcess.parser.newsendingState",app.globalData.DeviceComDecorator.AcProcess.parser.sendingState);
            // that.updateNewProtocolStatus(
            //   app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState,
            //   that.data.DeviceComDecorator.AcProcess.parser.sendingState
            // )
            // that.updateAcStatus(app.globalData.DeviceComDecorator.AcProcess.parser.sendingState)
          },
          'moreFun'
        )
      }
    })
    // this.controlLogic()
    // this.generateAppointmentOffPicker()
    // console.log(this.data.moreBtns, '!!!!', this.data.deviceInfo)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // const picker = this.selectComponent('.picker') //获取组件实例
    // picker.setIndexes([this.data.index]) //setIndexes()中的参数是一个数组
    // this.query();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {    
    let that = this
    console.log(this.data.ctrlType)
    // this.getSleepCurve()
    // this.checkNetwork()
    // this.setData({
    //   fakeShow:true
    // })
    console.log('show this.data', this.data)

    setTimeout(() => {
      if (app.globalData.DeviceComDecorator) {
        that.query()
        // if(this.data.ctrlType == 2) {
        // that.getSafeModeInfo()
        // }       
      }
    }, 200)       
    // if (that.data.deviceInfo.btMac) {
    //   that.getSafeModeInfo();
    // }
    // app.bluetoothConn.event.on("receiveMessagePlugin", (data) => {
    //   console.log(Common.ab2hex(data), ">>>>>>>>>>>>>>>>接收到模组消息 更多功能页");
    //   that.data.DeviceComDecorator.AcProcess.parseAcceptPackage(data);
    //   console.log(that.data.DeviceComDecorator.AcProcess.parser.newsendingState, "that.data.DeviceComDecorator.AcProcess.parser.newsendingState", that.data.DeviceComDecorator.AcProcess.parser.sendingState);

    //   that.updateNewProtocolStatus(that.data.DeviceComDecorator.AcProcess.parser.newsendingState, that.data.DeviceComDecorator.AcProcess.parser.sendingState);
    //   that.updateAcStatus(that.data.DeviceComDecorator.AcProcess.parser.sendingState, that.data.DeviceComDecorator.AcProcess.parser.newsendingState);
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // this.destoriedPlugin()
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

  onChange() {
    // const { picker, value, index } = event.detail
    // Toast(`当前值：${value}, 当前索引：${index}`);
  },

  onConfirm(v) {
    // ['关闭定时', '30分钟', '1小时', '1.5小时', '2小时'],
    console.log('v-detail:', v.detail)
    console.log('v-v', v)
    console.log('this.data', this.data)

    if (v.detail.index === 0) {
      // this.power_off_time_value = 0
      app.globalData.DeviceComDecorator.cancelTimingOff((res) => {
        this.setData({
          applianceStatus: res.status,
        })
        this.computeButtons()
      }, this.data.sleepCurve)
    } else {
      let offTimeValue = v.detail.index / 2
      app.globalData.DeviceComDecorator.timingOffSwitch(offTimeValue, this.data.sleepCurve)
      this.hidePopup()
    }
    this.setData({
      openPicker: false,
    })
  },
  onCancel() {
    this.setData({
      openPicker: false,
    })
  },
  query() {
    console.log('更多页查询');
    if(!this.data.isCoolFree) {
      this.data.DeviceComDecorator._queryStatus(true) // 查询设备状态    
      this.data.DeviceComDecorator._queryStatusNewProtocol('');   
    } else {
      console.log('查询酷风');
      this.data.DeviceComDecorator._queryStatusCoolFree()
    }   
  },
  doReset() {
    if (!this.data.dustFullTime) {
      wx.showToast({
        title: '您的滤网无需复位',
        icon: 'none'
      })
    } else {
      // this.setData({
      //   isNoTime: false
      // })
      app.globalData.DeviceComDecorator.dustFullTimeReset('dust_full_time', this.data.page_path)
    }
  },

  /*  getCurrentMode(){
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
           mode: mode
       }
   }, */
  updateAcStatus: function (status) {
    let that = this
    console.log(status, '<<<<<<<<<<<<<<<<')

    let windSpeed = status.windSpeed
    let _acstatus = {
      mode: status.mode,
      runStatus: status.runStatus,
      tempIn: status.tempIn && status.tempIn.toFixed(1),
      tempSet: status.tempSet2,
      windSpeed: windSpeed == 102 || windSpeed == 101 ? 120 : windSpeed,
      windUpDown: that.data.ctrlType == 1 ? status.leftUpDownWind && status.rightUpDownWind : status.leftUpDownWind,
      windLeftRight: status.leftLeftRightWind,
      downWindLeftRight: status.downWind, // 下左右风
      // controlSwitchNoWindFeel: this.data.acstatus.controlSwitchNoWindFeel,
      newWindFunSw: this.data.acstatus.newWindFunSw,
      ecoFunc: status.ecoFunc,
      CSEco: status.CSEco == '' ? 0 : status.CSEco,
      powerSave: status.powerSave,
      nonDirectWind: this.data.acstatus.nonDirectWind,
      elecHeat: status.elecHeat,
      diyFunc: status.diyFunc,
      voiceBroadcastStatus: status.voiceBroadcastStatus,
      timingOffHour: status.timingOffHour,
      timingOffMinute: status.timingOffMinute, // 30或0，30是0.5小时
      timingOffSwitch: status.timingOffSwitch,
      screenShow: status.screenShow,
      cosySleepMode: status.cosySleepMode,
    }
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风

    this.setData({
      // fakeShow: status.screenShow == 0,
      acstatus: {
        ..._acstatus,
      },
      'sliders.sliderValue': _acstatus.windSpeed, //设置slider风速值
      'acStatus.mode': this.data.modeMap[_acstatus.mode - 1].key,
      windVal: status.windSpeed,
      tempVal: status.tempSet2 == '' || status.tempSet2 == undefined ? 16 : parseFloat(status.tempSet2).toFixed(1),
      timerVal: parseInt(status.timingOffHour / 0.5),
      showHour: status.timingOffHour == '' ? 0 : status.timingOffHour.toFixed(1),
      dustFullTime: status.dustFlow == 1,
    })
    // this.refreshTimerOffIndex(status.timingOffHour)
    this.refreshBtnStatus()
    app.globalData.acstatus = this.data.acstatus
    console.log(this.data.acstatus, '>>>>', this.data.acSwStatus, '>>>>', this.data.dustFullTime)
    // this.calHourStr(this.data.acstatus.timingOffHour, this.data.acstatus.timingOffMinute)
  },
  updateNewProtocolStatus: function (status) {
    console.log('new sendingState', status);
    this.setData({
      acNewStatus: {
        superCoolingSw: status.superCoolingSw == '' ? 0 : status.superCoolingSw,
        voiceBroadcastStatus: status.voiceBroadcastStatus == '' ? 0 : status.voiceBroadcastStatus,
        switchSelfCleaning: status.switchSelfCleaning == '' ? 0 : status.switchSelfCleaning,
        switchNonDirectWind: status.switchNonDirectWind == '' ? 0 : status.switchNonDirectWind,
        switchUpDownNonDirectWind: status.switchNonDirectWind == '' ? 0 : status.switchNonDirectWind,
        switchFreshAir: status.switchFreshAir == '' ? 0 : status.switchFreshAir,
        freshAirFanSpeed: status.freshAirFanSpeed ? status.freshAirFanSpeed : 40,
        controlSwitchNoWindFeel: status.controlSwitchNoWindFeel == '' ? 0 : status.controlSwitchNoWindFeel,
        nonDirectWindType: status.nonDirectWindType,
        faWindFeel: status.faWindFeel,
        automaticAntiColdAir: status.automaticAntiColdAir,
        degerming: status.degerming,
        coolPowerSaving: status.coolPowerSaving,
        aroundWind: status.aroundWind,
        thNoWindSenseLeft: status.thNoWindSenseLeft,
        thNoWindSenseRight: status.thNoWindSenseRight
      },
      'acValueStatus.FreshAir.value': status.freshAirFanSpeed,
      'acValueStatus.FreshAir.text': this.data.freshAirFanSpeedMap[status.freshAirFanSpeed.toString()],
    })
    this.refreshNewProtocalStatus()
    console.log(this.data.acNewStatus, 'acNewStatus moreFunc')
  },
  /**刷新新协议按钮状态 */
  refreshNewProtocalStatus() {
    this.setData({
      'acSwStatus.Voice': this.data.acNewStatus.voiceBroadcastStatus == 3,
      'acSwStatus.Supercooling': this.data.acNewStatus.superCoolingSw == 1 && this.data.acstatus.runStatus == 1,
      'acSwStatus.SelfCleaning': this.data.acNewStatus.switchSelfCleaning == 1 && this.data.acstatus.runStatus != 1,
      'acSwStatus.WindBlowing': this.data.acNewStatus.switchNonDirectWind == 2,
      'acSwStatus.FaWindBlowing': this.data.acNewStatus.switchNonDirectWind == 2,
      'acSwStatus.FreshAir': this.data.acNewStatus.switchFreshAir == 1,
      'acSwStatus.NoWindFeel': this.data.acNewStatus.controlSwitchNoWindFeel == 1,
      'acSwStatus.FaNoWindFeel': this.data.acNewStatus.controlSwitchNoWindFeel == 4,
      'acSwStatus.UpNoWindFeel':
        this.data.acNewStatus.controlSwitchNoWindFeel == 2 || this.data.acNewStatus.controlSwitchNoWindFeel == 1,
      'acSwStatus.DownNoWindFeel':
        this.data.acNewStatus.controlSwitchNoWindFeel == 3 || this.data.acNewStatus.controlSwitchNoWindFeel == 1,
      'UpDownWindBlowingBtn[0].selected': this.data.acNewStatus.nonDirectWindType == 2, // 上防直吹
      'UpDownWindBlowingBtn[1].selected': this.data.acNewStatus.nonDirectWindType == 3, // 下防直吹
      'acSwStatus.softWindFeel': this.data.acNewStatus.faWindFeel == 3,
      'acSwStatus.Degerming': this.data.acNewStatus.degerming == 1,
      'acSwStatus.CoolPowerSaving': this.data.acNewStatus.coolPowerSaving == 1,
      'acSwStatus.AroundWind': this.data.acNewStatus.aroundWind == 1,
      'acSwStatus.ThNowindFeel': this.data.acNewStatus.thNoWindSenseLeft == 2 || this.data.acNewStatus.thNoWindSenseRight == 2
    })
    console.log('acSwStatus-----',this.data.acSwStatus)
  },
  refreshBtnStatus() {
    if (this.data.checkOnce == 0) {
      this.setData({
        checkOnce: 1, // 将这个值设为1，后续再来就不查这个了
      })
      // this.getSafeModeInfo()
      try {
        let value = wx.getStorageSync('Sound')
        console.log('storage', value, wx.getStorageSync('Sound'))
        if (JSON.stringify(value) == 'false' || JSON.stringify(value) == 'true') {
          this.setData({
            SoundSwitch: value,
          })
        } else {
          console.log('没存')
          wx.setStorageSync('Sound', true)
          this.setData({
            SoundSwitch: true,
          })
        }
      } catch (e) {
        // Do something when catch error
      }
    }
    this.setData({
      acSwStatus: {
        DeviceSwitch: this.data.acstatus.runStatus == 0,
        RefrigerantCheck: this.data.acstatus.mode == 2 && this.data.acstatus.runStatus == 1,
        NewRefrigerantCheck: this.data.acstatus.mode == 2 && this.data.acstatus.runStatus == 1,
        HotMode: this.data.acstatus.mode == 4 && this.data.acstatus.runStatus == 1,
        NewHotMode: this.data.acstatus.mode == 4 && this.data.acstatus.runStatus == 1,
        DryMode: this.data.acstatus.mode == 3 && this.data.acstatus.runStatus == 1,
        NewDryMode: this.data.acstatus.mode == 3 && this.data.acstatus.runStatus == 1,
        UpDownSwipeWind: this.data.acstatus.windUpDown == 1,
        LeftRightSwipeWind: this.data.acstatus.windLeftRight == 1,
        ECO: this.data.acstatus.ecoFunc == 1,
        WindBlowing: this.data.acNewStatus.switchNonDirectWind == 2, // 1-关 2-开                
        UpDownWindBlowing: this.data.acNewStatus.switchNonDirectWind == 2,
        SelfCleaning: this.data.acNewStatus.switchSelfCleaning == 1,
        Quietness: this.data.acstatus.powerSave == 1,
        DeviceSwitchAppointment: false,
        ElectricHeat:(this.data.acstatus.runStatus == 1) && this.data.acstatus.elecHeat == 1 && (this.data.acstatus.mode == 4 || this.data.acstatus.mode == 1),
        CSEco: this.data.acstatus.CSEco == '' ? 0 : this.data.acstatus.CSEco == 1,
        AutoMode: this.data.acstatus.mode == 1,
        WindMode: this.data.acstatus.mode == 5,
        UpDownWindAngle: false,
        LeftRightWindAngle: false,
        Dry: this.data.acstatus.diyFunc == 1 && (this.data.acstatus.mode == 2 || this.data.acstatus.mode == 3),
        DryNewName: this.data.acstatus.diyFunc == 1 && (this.data.acstatus.mode == 2 || this.data.acstatus.mode == 3), // 内机防霉
        Show: (this.data.acstatus.screenShow == 0),
        Supercooling: this.data.acNewStatus.superCoolingSw == 1 && this.data.acstatus.runStatus == 1,
        Voice: this.data.acNewStatus.voiceBroadcastStatus == 3,
        AppointmentSwitchOff: this.data.acstatus.timingOffSwitch == 1,
        FreshAir: this.data.acNewStatus.switchFreshAir == 1,
        NoWindFeel: this.data.acNewStatus.controlSwitchNoWindFeel == 1,
        UpNoWindFeel:
          this.data.acNewStatus.controlSwitchNoWindFeel == 1 || this.data.acNewStatus.controlSwitchNoWindFeel == 2,
        DownNoWindFeel:
          this.data.acNewStatus.controlSwitchNoWindFeel == 1 || this.data.acNewStatus.controlSwitchNoWindFeel == 3,
        FaNoWindFeel: this.data.acNewStatus.controlSwitchNoWindFeel == 4, // fa无风感
        F11NoWindFeel: this.data.acNewStatus.faWindFeel == 4, // fa无风感
        FaWindBlowing: this.data.acNewStatus.switchNonDirectWind == 2, // fa防直吹
        softWindFeel: this.data.acNewStatus.faWindFeel == 3, // 柔风感开关
        SafeMode: this.data.safeModeSwitch == 1,
        Sound: this.data.SoundSwitch,
        SleepCurve: this.data.acstatus.cosySleepMode != 0,
        DownSwipeWind: this.data.acstatus.downWindLeftRight == 1,
        UpSwipeWind: this.data.acstatus.windLeftRight == 1,
        AutomaticAntiColdAir: this.data.acNewStatus.automaticAntiColdAir == 1 && (this.data.acNewStatus.faWindFeel != 2 || this.data.acNewStatus.faWindFeel != 3 || this.data.acNewStatus.faWindFeel != 4), //主动防冷风标志为1，且fa的无风感、柔风感、防直吹都不打开，即为1的时候才点亮      
        Degerming: this.data.acNewStatus.degerming == 1,
        CoolPowerSaving: this.data.acNewStatus.coolPowerSaving == 1,
        AroundWind: this.data.acNewStatus.aroundWind == 1,
        ThNowindFeel: this.data.acNewStatus.thNoWindSenseLeft == 2 || this.data.acNewStatus.thNoWindSenseRight == 2
      },
    })
    console.log(this.data.acSwStatus)    
    console.log(this.data.acSwStatus, '========================')
    // app.globalData.acSwStatus = this.data.acSwStatus;
  },
  computeButtons() {
    let applianceStatus = this.data.applianceStatus
    let applianceStatusNew = this.data.applianceStatusNew
    this.setData({
      acSwStatus: {
        LeftRightWindAngle: applianceStatus.wind_swing_lr == 'on' || applianceStatus.wind_swing_lr_under == 'on',
        UpDownWindAngle: applianceStatus.wind_swing_ud == 'on',
        FreshAir: applianceStatusNew.fresh_air == 'on',
        LeftRightSwipeWind: applianceStatus.wind_swing_lr == 'on' || applianceStatus.wind_swing_lr_under == 'on',
        UpDownSwipeWind: applianceStatus.wind_swing_ud == 'on',
        ElectricHeat: applianceStatus.ptc == 'on',
        ECO: applianceStatus.eco == 'on',
        Show: applianceStatus.screen_display_now == 'on',
        Quietness: applianceStatus.power_saving == 'on',
        NoWindFeel: applianceStatusNew.no_wind_sense != 0,
        FaNoWindFeel: applianceStatusNew.no_wind_sense != 0,
        WindBlowing: applianceStatusNew.prevent_straight_wind == 2,
        FaWindBlowing: applianceStatusNew.prevent_straight_wind == 2, // 1-关 2-开
        AppointmentSwitchOff: applianceStatus.power_off_timer == 'on',
        SelfCleaning: applianceStatusNew.self_clean == 'on',
      },
      acStatus: {
        tempVal: (parseFloat(applianceStatus.temperature) + parseFloat(applianceStatus.small_temperature)).toFixed(1),
        fresh_air_fan_speed: applianceStatusNew.fresh_air_fan_speed,
        fresh_air_temp: applianceStatusNew.fresh_air_temp,
        wind_swing_lr_angle: applianceStatusNew.wind_swing_lr_angle,
        wind_swing_ud_angle: applianceStatusNew.wind_swing_ud_angle,
        mode: applianceStatus.mode == 'smart_dry' ? 'dry' : applianceStatus.mode,
        power_off_time_value: applianceStatus.power_off_time_value,
      },
    })
    try {
      let value = wx.getStorageSync('Sound')
      console.log('storage', value, wx.getStorageSync('Sound'))
      if (JSON.stringify(value) == 'false' || JSON.stringify(value) == 'true') {
        this.setData({
          'acSwStatus.Sound': value,
        })
      } else {
        console.log('没存')
        wx.setStorageSync('Sound', true)
        this.setData({
          'acSwStatus.Sound': true,
        })
      }
    } catch (e) {
      // Do something when catch error
    }
    //this.triggerEvent('modeChange', this.getCurrentMode());//向上层通知mode更改
  },
  initCard() {},
  getActived() {},
  init() {
    this.luaQuery()
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    this.computeButtons()
  },
  // controlLogic() {
  //   this.setData({
  //     btnObj: {
  //       ModeControl: {
  //         switchFunc: () => {
  //           console.log('mode')
  //           this.showOrHideModePopup(true)
  //         },
  //       },
  //       UpDownWindAngle: {
  //         switchFunc: () => {
  //           this.setData({
  //             showUpDownPopup: true, //展示底部上下风
  //           })
  //         },
  //         btnSelectFunc: () => {},
  //         switchBtnFunc: (item) => {
  //           console.log('上下', item)
  //           app.globalData.DeviceComDecorator.switchUpDownSwipe(item, this.data.applianceStatus, (res) => {
  //             console.log('上下风', res)
  //             this.setData({
  //               applianceStatus: res.status,
  //               'acSwStatus.UpDownWindAngle': item,
  //             })
  //             this.computeButtons()
  //           })
  //         },
  //       },
  //       LeftRightWindAngle: {
  //         switchFunc: () => {
  //           this.setData({
  //             showLeftPopup: true, //展示底部左右风
  //           })
  //         },
  //         btnSelectFunc: () => {},
  //         switchBtnFunc: (item) => {
  //           console.log('左右', item)

  //           // this.setData({
  //           //     'acSwStatus.LeftRightWindAngle': item
  //           // })
  //           app.globalData.DeviceComDecorator.switchLeftRightSwipe(item, this.data.applianceStatus, (res) => {
  //             console.log('左右', res)
  //             this.setData({
  //               applianceStatus: res.status,
  //               'acSwStatus.LeftRightWindAngle': item,
  //             })
  //             this.computeButtons()
  //           })
  //         },
  //       },
  //       FreshAir: {
  //         switchFunc: () => {
  //           console.log('新风')
  //           // 低 中 高 强劲 关闭
  //           // 40 60 80 100 关闭
  //           let index = 0
  //           let referArr = [40, 60, 80, 100]
  //           let sendDataArr = [
  //             {
  //               power: 1,
  //               fresh_air: 'on',
  //               fresh_air_fan_speed: 40,
  //             },
  //             {
  //               power: 1,
  //               fresh_air: 'on',
  //               fresh_air_fan_speed: 60,
  //             },
  //             {
  //               power: 1,
  //               fresh_air: 'on',
  //               fresh_air_fan_speed: 80,
  //             },
  //             {
  //               power: 1,
  //               fresh_air: 'on',
  //               fresh_air_fan_speed: 100,
  //             },
  //             {
  //               power: 0,
  //               fresh_air: 'off',
  //               fresh_air_fan_speed: 40,
  //             },
  //           ]
  //           let sendData = {
  //             power: 0,
  //             fresh_air_fan_speed: 40,
  //           }
  //           if (this.data.acSwStatus.FreshAir && this.data.acStatus.fresh_air_fan_speed == 100) {
  //             sendData = sendDataArr[4]
  //             index = 4
  //           } else if (!this.data.acSwStatus.FreshAir) {
  //             sendData = sendDataArr[0]
  //             index = 0
  //           } else {
  //             index = referArr.indexOf(this.data.acStatus.fresh_air_fan_speed) + 1
  //             if (index == 5) {
  //               index = 1
  //             }
  //             sendData = sendDataArr[index]
  //           }
  //           console.log('send data', sendData, index)
  //           app.globalData.DeviceComDecorator.freshAirSwitch(
  //             sendData.fresh_air == 'on',
  //             sendData.fresh_air_fan_speed,
  //             (res) => {
  //               let newStatus = Object.assign({}, this.data.applianceStatusNew, res.status)
  //               this.setData({
  //                 applianceStatusNew: newStatus,
  //               })
  //               this.computeButtons()
  //             }
  //           )
  //         },
  //       },
  //       ElectricHeat: {
  //         switchFunc: (key) => {
  //           console.log('ElectricHeat')
  //           if (this.data.acstatus.mode == 4 || this.data.acstatus.mode == 1) {
  //             let sendData = this.data.acSwStatus.ElectricHeat == 1 ? 0 : 1
  //             this.data.acstatus.elecHeat = sendData
  //             this.setData({
  //               'acstatus.elecHeat': sendData,
  //             })
  //             app.globalData.DeviceComDecorator.switchElecHeat(
  //               sendData,
  //               key.widget_id,
  //               this.data.page_path,
  //               this.data.sleepCurve
  //             )
  //           } else {
  //             let text = this.data.hasAuto ?  '电辅热仅在制热或自动模式下开启' : '电辅热仅在制热模式下开启'            
  //             wx.showToast({
  //               title: text,
  //               icon: 'none',
  //             })
  //           }
  //         },
  //       },
  //       ECO: {
  //         switchFunc: (key) => {
  //           console.log('ECO')
  //           if (this.data.acstatus.runStatus == 0) {
  //             wx.showToast({
  //               title: '空调已关，请先开空调',
  //               icon: 'none',
  //             })
  //             return
  //           }
  //           if (this.data.acstatus.mode == 2) {
  //             let sendData = this.data.acSwStatus.ECO == 1 ? 0 : 1            
  //             app.globalData.DeviceComDecorator.switchECO(
  //               sendData,
  //               this.data.acstatus,
  //               key.widget_id,
  //               this.data.page_path
  //             )              
  //           } else {
  //             wx.showToast({
  //               title: 'ECO需要在制冷模式下开启',
  //               icon: 'none',
  //             })
  //           }
  //         },
  //       },
  //       Quietness: {
  //         switchFunc: (key) => {
  //           let Quietness = this.data.acSwStatus.Quietness == 1 ? 0 : 1
  //           if (this.data.acstatus.mode == 2 || this.data.acstatus.mode == 4 || this.data.acstatus.mode == 1) {
  //             this.data.acstatus.powerSave = Quietness
  //             app.globalData.DeviceComDecorator.powerSave(Quietness, key.widget_id, this.data.page_path)
  //             app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
  //           } else {
  //             wx.showToast({
  //               title: '睡眠需在自动、制冷、或制热模式下运行',
  //               icon: 'none',
  //             })
  //           }
  //         },
  //       },
  //       NoWindFeel: {
  //         switchFunc: () => {
  //           if (this.data.acStatus.mode != 'cool') {
  //             wx.showToast({
  //               title: '无风感仅在制冷模式下有效',
  //               icon: 'none',
  //             })
  //             return
  //           }

  //           let sendData = this.data.acSwStatus.NoWindFeel == 1 ? 0 : 1
  //           this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
  //           this.data.DeviceComDecorator.noWindFeelSwitch(sendData, 'click_no_wind_feel', this.data.page_path)
  //         },
  //       },
  //       FaNoWindFeel: {
  //         switchFunc: () => {
  //           console.log('FaNoWindFeel---------------');
  //           if (this.data.acStatus.mode != 'cool') {
  //             wx.showToast({
  //               title: '无风感仅在制冷模式下有效',
  //               icon: 'none',
  //             })
  //             return
  //           }

  //           let sendData = this.data.acSwStatus.FaNoWindFeel == 1 ? 0 : 1
  //           app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
  //           app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.ecoFunc = 0 // 无风感和ECO互斥
  //           app.globalData.DeviceComDecorator.FaNoWindFeelSwitch(sendData)
  //         },
  //       },
  //       F11NoWindFeel: {
  //         switchFunc: () => {
  //           console.log('F11NoWindFeel-------------------');
  //           if (this.data.acStatus.mode != 'cool') {
  //             wx.showToast({
  //               title: '无风感仅在制冷模式下有效',
  //               icon: 'none',
  //             })
  //             return
  //           }

  //           let sendData = this.data.acSwStatus.F11NoWindFeel == 1 ? 0 : 1
  //           app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0            
  //           app.globalData.DeviceComDecorator.FaNoWindFeelSwitch(sendData)
  //         },
  //       },
  //       ThNowindFeel: {
  //         switchFunc: () => {
  //           if (this.data.acStatus.mode != 'cool') {
  //             wx.showToast({
  //               title: '无风感仅在制冷模式下有效',
  //               icon: 'none',
  //             })
  //             return
  //           }

  //           let sendData = this.data.acSwStatus.ThNowindFeel == 1 ? 0 : 1
  //           // this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
  //           this.data.DeviceComDecorator.thNoWindFeelSwitch(sendData, 'click_no_wind_feel', this.data.page_path)
  //         },
  //       },
  //       WindBlowing: {
  //         switchFunc: (key) => {
  //           console.log('防直吹')
  //           if (this.data.acstatus.mode != 1 && this.data.acstatus.mode != 4) {
  //             let sendData = this.data.acSwStatus.WindBlowing == 1 ? 0 : 1
  //             console.log(sendData)
  //             app.globalData.DeviceComDecorator.noWindBlowingSwitch(sendData, key.widget_id, this.data.page_path)              
  //             if (sendData == 1 && (this.data.acstatus.mode == 2 || this.data.acstatus.mode == 5)) {
  //               app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.windSpeed = 1 // 风速设为1
  //             }              
  //             app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.leftUpDownWind = 0
  //             app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.rightUpDownWind = 0
  //             app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0
  //           } else {
  //             let text = this.data.hasAuto ?  '防直吹不能在制热和自动模式运行' : '防直吹不能在制热模式下开启'            
  //             wx.showToast({
  //               title: text,
  //               icon: 'none',
  //             })              
  //           }
  //         },
  //       },
  //       FaWindBlowing: {
  //         switchFunc: (key) => {
  //           console.log('Fa防直吹')
  //           if (this.data.acstatus.mode == 2) {
  //             let sendData = this.data.acSwStatus.FaWindBlowing == 1 ? 0 : 1
  //             console.log(sendData)
  //             app.globalData.DeviceComDecorator.FaNoWindBlowingSwitch(sendData, key.widget_id, this.data.page_path)
  //             app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0 // 防直吹开退出智控温
  //             if (sendData == 1 && (this.data.acstatus.mode == 2 || this.data.acstatus.mode == 5)) {
  //               app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.windSpeed = 102 // 风速设为102
  //             }
  //             app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
  //             app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.leftUpDownWind = 0
  //             app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.rightUpDownWind = 0
  //             app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0
  //           } else {
  //             wx.showToast({
  //               title: '防直吹只能在制冷模式下运行',
  //               icon: 'none',
  //             })
  //           }
  //         },
  //       },
  //       AppointmentSwitchOff: {
  //         switchFunc: () => {
  //           this.setData({
  //             openPicker: true,
  //           })
  //         },
  //       },
  //       Sound: {
  //         switchFunc: (key) => {
  //           let sendData = !this.data.acSwStatus.Sound
  //           this.setData({
  //             'acSwStatus.Sound': sendData,
  //             SoundSwitch: sendData,
  //           })
  //           let burialParam = {
  //             ext_info: sendData ? '开启' : '关闭',
  //           }
  //           burialParam = app.globalData.DeviceComDecorator.matchBurialParamsAdvance(
  //             burialParam,
  //             key.widget_id,
  //             this.data.page_path
  //           )
  //           app.globalData.DeviceComDecorator.sendBurial(burialParam)
  //           try {
  //             wx.setStorageSync('Sound', sendData)
  //           } catch (e) {
  //             console.log(e)
  //           }
  //         },
  //       },
  //       Show: {
  //         switchFunc: (key) => {
  //           this.data.fakeShow = !this.data.fakeShow
  //           let sendData = this.data.acSwStatus.Show == 1 ? 0 : 1
  //           console.log("this.data.fakeShow",this.data.fakeShow);
  //           if (this.data.acstatus.runStatus == 0) {             
  //             // app.globalData.DeviceComDecorator.showSwitch(1, key.widget_id, this.data.page_path)  
  //             app.globalData.DeviceComDecorator.showSwitch(sendData, key.widget_id, this.data.page_path) 
  //             this.data.acSwStatus.Show == 1 ?  (app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.screenShow = 7) : (app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.screenShow = 0)
  //             // this.refreshBtnStatus();
  //             // app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.screenShow = !app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.screenShow
  //           } else {            
  //             app.globalData.DeviceComDecorator.showSwitch(sendData, key.widget_id, this.data.page_path)     
  //           }
                  
  //         },
  //       },
  //       InitWifi: {
  //         switchFunc: () => {
  //           let that = this
  //           if (this.data.ctrlType != 1) {
  //             wx.showModal({
  //               content: '当前空调已开启远程控制',
  //               showCancel: false,
  //               confirmText: '好的',
  //             })
  //             return
  //           }
  //           console.log('go to init wifi', that.data.connectedDevice, that.data.deviceInfo)
  //           let addDeviceInfo = {
  //             adData: that.data.connectedDevice.adData,
  //             deviceName: that.data.deviceInfo.name,
  //             deviceImg: that.data.deviceInfo.deviceImg,
  //             mac: that.data.deviceInfo.btMac,
  //             deviceId: that.data.connectedDevice.deviceId,
  //             type: 'AC',
  //             sn8: that.data.deviceInfo.sn8,
  //             sn: that.data.deviceInfo.sn,
  //             mode: '21',
  //           }
  //           app.addDeviceInfo = addDeviceInfo
  //           console.log('Initwifi', app.addDeviceInfo)
  //           // app.addDeviceInfo.mode = 21;
  //           // app.globalData.addDeviceInfo.type = '';
  //           // app.globalData.addDeviceInfo.sn8 = that.data.deviceInfo.sn8;
  //           app.bluetoothConn.closeBLEConnection()
  //           wx.navigateTo({
  //             url: inputWifiInfo,
  //           })
  //         },
  //       },
  //       AboutDevice: {
  //         switchFunc: () => {
  //           wx.navigateTo({
  //             url:
  //               '../aboutMac/aboutMac?currDeviceInfo=' +
  //               encodeURIComponent(JSON.stringify(this.data.deviceInfo)) +
  //               '&deviceSnBle=' +
  //               this.data.deviceSnBle +
  //               '&ctrlType=' +
  //               this.data.ctrlType,
  //           })
  //         },
  //       },
  //       SelfCleaning: {
  //         switchFunc: () => {
  //           let that = this
  //           console.log('self=======***:', that.data.acNewStatus, that.data.acNewStatus.switchSelfCleaning)
  //           // let sendData = that.data.acNewStatus.selfCleaningSwitch == 1 ? 0 : 1
  //           let sendData = that.data.acNewStatus.switchSelfCleaning == 1 ? 0 : 1
  //           app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.timingOffSwitch = 0
  //           app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.superCoolingSw = 0
  //           // app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.runStatus = 0
  //           app.globalData.DeviceComDecorator.selfCleaningSwitch(sendData, key.widget_id, that.data.page_path)
  //           app.globalData.DeviceComDecorator._queryStatus()
  //           setTimeout(() => {
  //             wx.navigateBack({
  //               delta: 1,
  //             })
  //           }, 1000)
  //         },
  //       },
  //       SafeMode: {
  //         switchFunc: () => {
  //           wx.navigateTo({
  //             url:
  //               '../saveModePage/saveModePage?deviceInfo=' +
  //               encodeURIComponent(JSON.stringify(this.data.deviceInfo)) +
  //               '&deviceSnBle=' +
  //               this.data.deviceSnBle +
  //               '&ctrlType=' +
  //               this.data.ctrlType,
  //           })
  //         },
  //       },
  //       CSEco: {
  //         switchFunc: () => {
  //           console.log('CSEco')
  //           if (this.data.acstatus.mode == 2) {
  //             let sendData = this.data.acSwStatus.CSEco == 1 ? 0 : 1              
  //             app.globalData.DeviceComDecorator.CSEcoSwitch(sendData)              
  //           } else {
  //             wx.showToast({
  //               title: '舒省仅在制冷模式下有效',
  //               icon: 'none',
  //             })
  //           }
  //         },
  //       },
  //       SleepCurve: {
  //         switchFunc: () => {
  //           /*console.log('terence' + JSON.stringify(key));
  //           if (app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.mode == 2 || app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.mode == 4) {
  //             let sendData = this.data.acSwStatus.SleepCurve ? 0 : 1;
  //             app.globalData.DeviceComDecorator.sleepCurveSwitch(sendData, key.widget_id, this.data.page_path);
  //           } else {
  //             wx.showToast({
  //               title: '只有在制冷/制热模式下才可启用睡眠模式',
  //               icon: 'none',
  //             })
  //           }*/
  //           if (this.data.acstatus.mode != 2 && this.data.acstatus.mode != 4) {
  //             wx.showToast({
  //               title: '只有在制冷/制热模式下才可启用睡眠模式',
  //               icon: 'none',
  //             })
  //             return
  //           }
  //           console.log('goto sleepCurve show data =================', JSON.stringify(this.data))
  //           wx.navigateTo({
  //             url:
  //               '../sleepCurve/sleepCurve?' +
  //               'acstatus=' +
  //               JSON.stringify(this.data.acstatus) +
  //               '&ctrlType=' +
  //               this.data.ctrlType +
  //               '&data=' +
  //               encodeURIComponent(JSON.stringify(this.data)),
  //           })
  //         },
  //       },
  //       Supercooling: {
  //         switchFunc: (key) => {
  //           console.log('Supercooling')
  //           if (this.data.acstatus.mode == 2) {
  //             let sendData = this.data.acNewStatus.superCoolingSw == 1 ? 0 : 1
  //             app.globalData.DeviceComDecorator.smartCooling(sendData, key.widget_id, this.data.page_path)
  //             app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.windSpeed = 102
  //             app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.cosySleepMode = 0
  //             if (this.data.acstatus.tempSet < 26) {
  //               app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.tempSet = parseFloat(26.0)
  //               app.globalData.DeviceComDecorator.AcProcess.parser.sendingState.tempSet2 = parseFloat(26.0)
  //             }
  //             // app.globalData.DeviceComDecorator.AcProcess.parser.nwesendingState.switchNonDirectWind = 1;
  //           } else {
  //             wx.showToast({
  //               title: '智控温仅在制冷模式下有效',
  //               icon: 'none',
  //             })
  //           }
  //         },
  //       },
  //       Voice: {
  //         switchFunc: (key) => {
  //           let sendData = this.data.acSwStatus.Voice == 1 ? 0 : 1
  //           app.globalData.DeviceComDecorator.voiceFuncSwitch(sendData, key.widget_id, this.data.page_path)
  //         },
  //       },
  //       UpNoWindFeel: {
  //         switchFunc: () => {
  //           console.log(this.data.acSwStatus.UpNoWindFeel)
  //           if (this.data.acStatus.mode != 'cool') {
  //             wx.showToast({
  //               title: '无风感仅在制冷模式下有效',
  //               icon: 'none',
  //             })
  //             return
  //           }
  //           this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
  //           this.data.DeviceComDecorator.AcProcess.parser.sendingState.leftLeftRightWind = 0
  //           this.data.DeviceComDecorator.upNoWindFeelSwitch(
  //             this.data.acNewStatus.controlSwitchNoWindFeel,
  //             'click_up_nowind_feel',
  //             this.data.page_path
  //           )
  //         },
  //       },
  //       DownNoWindFeel: {
  //         switchFunc: () => {
  //           console.log(this.data.acSwStatus.DownNoWindFeel)
  //           // let sendData = this.data.acSwStatus.DownNoWindFeel ? 0 : 1;
  //           if (this.data.acStatus.mode != 'cool') {
  //             wx.showToast({
  //               title: '无风感仅在制冷模式下有效',
  //               icon: 'none',
  //             })
  //             return
  //           }
  //           this.data.DeviceComDecorator.AcProcess.parser.newsendingState.switchNonDirectWind = 0
  //           this.data.DeviceComDecorator.AcProcess.parser.sendingState.downWind = 0
  //           this.data.DeviceComDecorator.downNoWindFeelSwitch(
  //             this.data.acNewStatus.controlSwitchNoWindFeel,
  //             'click_down_nowind_feel',
  //             this.data.page_path
  //           )
  //         },
  //       },
  //       UpDownWindBlowing: {
  //         switchFunc: () => {
  //           if (this.data.acstatus.mode != 1 && this.data.acstatus.mode != 4) {
  //             this.setData({
  //               showUpDownWindBlowing: true,
  //             })
  //           } else {
  //             wx.showToast({
  //               title: '防直吹不能在制热和自动模式运行',
  //               icon: 'none',
  //             })
  //           }
  //         },
  //       },
  //       UpSwipeWind: {
  //         switchFunc: () => {
  //           let data = !this.data.acSwStatus.UpSwipeWind
  //           if (this.data.acSwStatus.UpNoWindFeel && this.data.acSwStatus.DownNoWindFeel) {
  //             // 上下无风感都打开
  //             this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 3 // 保留下无风感开
  //           } else if (!this.data.acSwStatus.UpNoWindFeel && this.data.acSwStatus.DownNoWindFeel) {
  //             this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 3 // 保留下无风感开
  //           } else {
  //             this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0 // 关闭全部无风感
  //           }
  //           app.globalData.DeviceComDecorator.switchUpLeftRightSwipe(
  //             data,
  //             this.data.acstatus,
  //             'click_up_swipe_wind',
  //             this.data.page_path
  //           )
  //         },
  //       },
  //       DownSwipeWind: {
  //         switchFunc: () => {
  //           let data = !this.data.acSwStatus.DownSwipeWind
  //           if (this.data.acSwStatus.UpNoWindFeel && this.data.acSwStatus.DownNoWindFeel) {
  //             // 上下无风感都打开
  //             this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 2 // 只留上无风感
  //           } else if (this.data.acSwStatus.UpNoWindFeel && !this.data.acSwStatus.DownNoWindFeel) {
  //             this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 2 // 只留上无风感
  //           } else {
  //             this.data.DeviceComDecorator.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0 // 关闭全部无风感
  //           }
  //           app.globalData.DeviceComDecorator.switchDownLeftRightSwipe(
  //             data,
  //             this.data.acstatus,
  //             'click_down_swipe_wind',
  //             this.data.page_path
  //           )
  //         },
  //       },
  //       Dry: {
  //         switchFunc: () => {
  //           let data = !this.data.acSwStatus.Dry
  //           console.log('干燥', data)
  //           if (this.data.acstatus.runStatus == 0 && !this.data.acSwStatus.Dry) {
  //             wx.showToast({
  //               title: '关机下干燥不可开',
  //               icon: 'none',
  //             })
  //             return
  //           }
  //           if (this.data.acStatus.mode != 'cool' && this.data.acStatus.mode != 'dry') {
  //             wx.showToast({
  //               title: '干燥只能在制冷或抽湿模式下开启',
  //               icon: 'none',
  //             })
  //             return
  //           }
  //           app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.switchSelfCleaning = 0
  //           app.globalData.DeviceComDecorator.switchDry(data)
  //         },
  //       },
  //       DryNewName: {
  //         switchFunc: () => {
  //           let data = !this.data.acSwStatus.Dry
  //           console.log('内机防霉', data)
  //           if (this.data.acstatus.runStatus == 0 && !this.data.acSwStatus.Dry) {
  //             wx.showToast({
  //               title: '关机下内机防霉不可开',
  //               icon: 'none',
  //             })
  //             return
  //           }
  //           if (this.data.acStatus.mode != 'cool' && this.data.acStatus.mode != 'dry') {
  //             wx.showToast({
  //               title: '内机防霉只能在制冷或抽湿模式下开启',
  //               icon: 'none',
  //             })
  //             return
  //           }
  //           app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.switchSelfCleaning = 0
  //           app.globalData.DeviceComDecorator.switchDry(data)
  //         },
  //       },
  //       FilterClean: {
  //         switchFunc: () => {
  //           let data = !this.data.acSwStatus.Dry
  //           console.log('滤网清洗和复位', data)
  //           // if (this.data.acstatus.runStatus == 0 && !this.data.acSwStatus.Dry) {
  //           //   wx.showToast({
  //           //     title: '关机下内机防霉不可开',
  //           //     icon: 'none',
  //           //   })
  //           //   return
  //           // }
  //           // if (this.data.acStatus.mode != 'cool' && this.data.acStatus.mode != 'dry') {
  //           //   wx.showToast({
  //           //     title: '内机防霉只能在制冷或抽湿模式下开启',
  //           //     icon: 'none',
  //           //   })
  //           //   return
  //           // }
  //           // app.globalData.DeviceComDecorator.AcProcess.parser.newsendingState.switchSelfCleaning = 0
  //           // app.globalData.DeviceComDecorator.switchDry(data)
  //         },
  //       },
  //       PowerManager: {
  //         switchFunc: () => {
  //           console.log('电量统计')
  //           wx.navigateTo({
  //             url:
  //               '../electric/electric?' +
  //               'acstatus=' +
  //               JSON.stringify(this.data.acstatus) +
  //               '&ctrlType=' +
  //               this.data.ctrlType +
  //               '&data=' +
  //               encodeURIComponent(JSON.stringify(this.data)),
  //           })
  //         },
  //       },
  //       softWindFeel: {
  //         switchFunc: () => {
  //           console.log('柔风感')   
  //           let data = !this.data.acSwStatus.softWindFeel;            
  //           if (this.data.acStatus.mode != 'cool') {
  //             wx.showToast({
  //               title: '柔风感只能在制冷模式下开启',
  //               icon: 'none',
  //             })
  //             return
  //           }
  //           app.globalData.DeviceComDecorator.softWindFeel(data,"",this.data.page_path);
  //         },
  //       },
  //       AutomaticAntiColdAir: {
  //         // 主动防冷风
  //         switchFunc: () => {                      
  //           if (this.data.acStatus.mode != 'cool') {
  //             wx.showToast({
  //               title: '主动防冷风只能在制冷模式下开启',
  //               icon: 'none',
  //             })
  //             return
  //           }            
  //          this.getColdWindTipsFlag();
  //          let data = !this.data.acSwStatus.AutomaticAntiColdAir;
  //           if (data && !this.data.storageColdTipsNotShow) {
  //             this.setData({
  //               showAutoColdWindPopup:true
  //             }) 
  //           } else {              
  //             app.globalData.DeviceComDecorator.automaticAntiColdAirSwitch(data,"click_auto_prevent_cold_wind",this.data.page_path);              
  //           }           
  //         },
  //       },
  //       Degerming: { // 杀菌          
  //         switchFunc: () => {              
  //           let data = !this.data.acSwStatus.Degerming;
  //           console.log('Degerming----------------',data);
  //           app.globalData.DeviceComDecorator.degermingSwitch(data,"",this.data.page_path);
  //         },
  //       },
  //       CoolPowerSaving: {
  //         switchFunc: () => {              
  //           let data = !this.data.acSwStatus.CoolPowerSaving;
  //           console.log('CoolPowerSaving----------------',data);
  //           app.globalData.DeviceComDecorator.coolPowerSavingSwitch(data,"",this.data.page_path);
  //         },
  //       },
  //       AroundWind: {
  //         switchFunc: () => {              
  //           if (this.data.acStatus.mode == 'dry') {
  //             wx.showToast({
  //               title: '环绕风在抽湿下不可开启',
  //               icon: 'none',
  //             })
  //             return
  //           }
  //           let data = !this.data.acSwStatus.AroundWind;
  //           console.log('HY1AroundWindSwitch----------------',data);
  //           app.globalData.DeviceComDecorator.HY1AroundWindSwitch(data,"",this.data.page_path);
  //         },
  //       }

  //     },
  //   })
  // },
  modalBtnTab(item) {
    console.log(item.currentTarget.dataset.item)
    if (!item.currentTarget.dataset.item.offCan && this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none',
      })
      return
    }

    this.data.btnObj[item.currentTarget.dataset.item.key].switchFunc(item.currentTarget.dataset.item)
  },
  showLoading() {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
  },
  hideLoading() {
    wx.hideNavigationBarLoading()
    wx.hideLoading()
  },
  // generateAppointmentOffPicker() {
  //   let arr = ['关闭定时', '30分钟']
  //   for (let i = 0; i < 47; i++) {
  //     arr.push(1 + i * 0.5 + '小时')
  //   }
  //   this.setData({
  //     columns: arr,
  //   })
  // },
  initDeviceCom() {
    if (!app.globalData.DeviceComDecorator) {
      let DeviceCom = new DeviceComDecorator(this.data.deviceInfo.applianceCode)
      this.setData({
        DeviceComDecorator: DeviceCom,
      })
      this.query()
    }
  },
  // calHourStr(hour, minute) {
  //   let hStr = hour.toString().split('.')[0]
  //   if (hStr == 0) {
  //     this.setData({
  //       showHourAndMin: (minute == 0 ? 1 : minute) + '分钟后关机',
  //     })
  //   } else {
  //     let min = minute == 0 ? '' : minute + '分钟'
  //     this.setData({
  //       showHourAndMin: hStr + '小时' + min + '后关机',
  //     })
  //   }
  // },
  // refreshTimerOffIndex(time) {
  //   // let minute = (time * 60)
  //   let index = Math.ceil(time / 0.5)
  //   if (time == 0) {
  //     index = 0
  //   } else {
  //     index = Math.ceil(time / 0.5)
  //   }

  //   this.setData({
  //     timerOffVal: [index],
  //     timerSetVal: parseFloat([index] / 2),
  //   })

  //   var picker = this.selectComponent('.picker')
  //   picker.setColumnIndex(0, index)
  //   console.log(index)

  //   // wx.showToast({
  //   //   title: index+' '+time + ' ' + this.data.timerOffVal,
  //   // })
  // },
  hidePopup() {
    this.setData({
      openPicker: false,
    })
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
  getSafeModeInfo() {
    let that = this
    let data = {
      mac: this.data.deviceInfo.btMac,
      sn: cloudDecrypt(that.data.deviceInfo.sn, app.globalData.userData.key, appKey),
    }

    requestService
      .request(selfApi.safeModeQuery, data, 'POST')
      .then((res) => {
        console.log('安全模式查询', res.data)
        if (res.data.errCode == 0) {
          // console.log('安全模式查询', res.data.data.result);
          that.setData({
            safeModeSwitch: res.data.result.open == 1,
            'acSwStatus.SafeMode': res.data.result.open == 1
          })
        } else {
          console.log(res.data.errCode)
        }
      })
      .catch((err) => {
        console.log('安全模式查询', err)
      })
  },
  hidePopup() {
    this.setData({
      showUpDownWindBlowing: false,
    })
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
  onChangeUpDownDirect(e) {
    console.log(e.detail)
    app.globalData.DeviceComDecorator.UpDownNoWindBlowingSwitch(
      e.detail,
      this.data.acNewStatus.nonDirectWindType,
      'click_ud_wind_blowing',
      this.data.page_path
    )
  },
  powerOffTips() {
    if (this.data.acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none',
      })
      return
    }
  },
  getSleepCurve() {
    console.log('getSleepCurve---', JSON.stringify(this.data.deviceInfo))
    const that = this
    if (this.data.deviceInfo) {
      let param = {
        sn: cloudDecrypt(this.data.deviceInfo.sn, app.globalData.userData.key, appKey),
      }
      console.log('getSleepCurve---param', param)
      requestService
        .request(selfApi.getSleepCurve, param, 'POST')
        .then((res) => {
          console.log('morefun 睡眠曲线查询', param, JSON.stringify(res))
          if (res.data.result.tempSet) {
            that.setData({
              sleepCurve: res.data.result.tempSet.map((x) => x.temp),
            })
          }
          console.log('sleepCurve', this.data.sleepCurve)
        })
        .catch((err) => {
          console.log('睡眠曲线查询', err)
        })
    }
  },
  closeAutoColdWindPopup() {
    this.setData({
      showAutoColdWindPopup:false
    })
  },
  onColdWindCheckboxCheck(event) {
    this.setData({
      coldTipsNotShow: event.detail
    })
  },
  coldWindFuncConfirm() {
    console.log(this.data.coldTipsNotShow, this.data.deviceSnFromDeviceInfo);
    if (this.data.coldTipsNotShow) {
      wx.setStorageSync('coldTipsNotShow' + app.globalData.currentSn, true)
    }
    let data = !this.data.acSwStatus.AutomaticAntiColdAir;
    console.log('智慧防冷风')   
    if (this.data.acStatus.mode != 'cool') {
      wx.showToast({
      title: '主动防冷风只能在制冷模式下开启',
      icon: 'none',
      })
      return
    }
    app.globalData.DeviceComDecorator.automaticAntiColdAirSwitch(data,"click_auto_prevent_cold_wind",this.data.page_path);   
    this.closeAutoColdWindPopup();         
  },
  getColdWindTipsFlag() {
    let flag = wx.getStorageSync('coldTipsNotShow' + app.globalData.currentSn);
    this.setData({
      storageColdTipsNotShow: flag
    })
    console.log(flag,'getColdWindTipsFlag');
  }
})
