import config from "../../../../config";
const environment = config.environment
const IMAGE_SERVER = environment == 'prod' ? 'https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0xB8/' : 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0xB8/'

const luaBehaviors = require('../common/js/luaBehaviors')
import configs from "../common/configs/index"
let {deviceConfig,luaErrorCode, buttonConfig}=configs

Component({
  options: {
    styleIsolation: 'page-shared',//设置为share后，该组件的wxss文件可以影响到mui组件的样式
  },
  behaviors: [luaBehaviors],
  /**
   * 组件的属性列表
   */
  properties: {
    applianceData: {
      type: Object,
      value: function () {
          return {
          }
      },
  }
  },

  /**
   * 组件的初始数据
   */
  data: {
    deviceState: {},
    reChargeIcon: `${IMAGE_SERVER}charge.svg`,//回充icon
    startIcon: `${IMAGE_SERVER}start.svg`,//开始icon
    controlBackIcon: `${IMAGE_SERVER}control_back.svg`,//模式切换背景
    menuIcon: `${IMAGE_SERVER}menu.svg`,//模式切换菜单icon
    deviceIcon: `${IMAGE_SERVER}device_icon.svg`,//设备图
    reChargeGrayIcon: `${IMAGE_SERVER}charge_gray.svg`,//回充不可点击
    controlBackGrayIcon: `${IMAGE_SERVER}control_back_gray.svg`,//模式切换背景不可点击
    startGrayIcon: `${IMAGE_SERVER}start_gray.svg`,//开始icon不可点击
    pauseGrayIcon: `${IMAGE_SERVER}pause_gray.svg`,//暂停不可点击
    menuGrayIcon: `${IMAGE_SERVER}menu_gray.svg`,//模式切换菜单icon
    backImage: `${IMAGE_SERVER}background.svg`,//背景图
    noticeIcon: `${IMAGE_SERVER}notice_icon.svg`,
    boxHeight: 920,//弹出层高度
    showPopup: false,//是否显示弹出框
    isModeSetting: true,//是不是模式设置
    popupTitle: "请选择模式",//蒙层标题
    currentDeviceState: "连接中",//当前机器状态文案
    currentDeviceStateCode: "connect",// 当前主状态码
    currentDeviceSubstateCode: "connect",//当前子状态码
    modeList: deviceConfig.modeList,//扫地机模式
    suctionList: deviceConfig.suctionList,//吸力模式
    waterList: deviceConfig.waterList,//水量
    mopModePreferenceList: deviceConfig.mopModePreferenceList,//抹布清洗速度
    dustTimesList: deviceConfig.dustTimesList,//集尘频次
    currentMode: deviceConfig.modeList[0],//当前模式
    currentSuction: deviceConfig.suctionList[0],//当前吸力
    currentWater: deviceConfig.waterList[0],//当前水量
    currentMopModePreference: deviceConfig.mopModePreferenceList[0],//当前抹布清洗速度
    currentDustTimes: deviceConfig.dustTimesList[0],//当前集尘频次
    testIndex: 0,//测试
    deviceState: {},//设备基础状态信息
    workMode: "sweep_and_mop",//当前的清洗模式
    cleanFrequency: "",//当前拖布清洗速度
    luaQueryInterval: undefined,//主动查询定时器
    batteryPercent: "--",//电池电量
    plannerStatus: 0,//1有任务 0没任务
    chargeBtnCanUse: true,//充电按钮是否可用
    modeBtnCanUse: true,//模式切换按钮是否可用
    workBtnCanUse: true,//工作按钮是否可用
    errorText:"",//故障文案
    showNotify:false,//展示故障通知栏
    floorCleanerStatus: true,//地板清洁液状态 true表示正常，false表示异常
    dustBagStatus: true,//集尘袋状态  true表示正常，false表示异常
    dustBagInstallStatus: true,//集尘袋安装 true表示按照 false表示未安装
    sureBtnText: "启动",
  },

  lifetimes: {
    attached() {
      if(this.properties.applianceData.onlineStatus == 1) {
        wx.showLoading({title: "加载中"})
        this.queryCmds()
        let timer = setInterval(() => {
          this.queryCmds()
        }, 5000);
        const deviceIcon = `${IMAGE_SERVER}device_icon_${this.properties.applianceData.sn8}.svg`
        this.setData({
          luaQueryInterval: timer,
          deviceIcon
        })
      }
    },
    detached() {
      if(this.data.luaQueryInterval != null) {
        clearInterval(this.data.luaQueryInterval)
      }
    }
  },

 
  /**
   * 组件的方法列表
   */
  methods: {
  // 触发微信消息推送
  weixinMessagePush() {
    this.triggerEvent('subWeixinNews')
  },
    // 回充/暂停回充
    reChargeAction() {
      this.weixinMessagePush()
      if(this.judegeDeviceState()) {
                //如果按钮是置灰的，直接toast提示
        if(!this.data.chargeBtnCanUse) {
          wx.showToast({
            title: buttonConfig.tipsText(this.data.currentDeviceStateCode, this.data.currentDeviceSubstateCode),
            icon: 'none',
            duration: 3000
          })
          return
        }
        //清扫暂停和清扫中 弹框提示是否结束清扫
        console.log("当前的状态:",this.data.currentDeviceStateCode);
        console.log(this.data.plannerStatus);
        if(["work","clean_pause","back_clean_mop","video_cruise","video_cruise_pause"].indexOf(this.data.currentDeviceStateCode) > -1 || ["pause_sleeping","return_station_pause_sleeping","cruise_pause_sleeping"].indexOf(this.data.currentDeviceSubstateCode) > -1) {
          wx.showModal({
            content: '是否结束当前任务进行回充？',
            confirmColor: "#29C3FF",
            complete: (res) => {
              if (res.confirm) {
                this.judegeCanChagre()
              }
            }
          })
          return
        }
        this.judegeCanChagre()
      }  
    },
        //判断是否可以回充
    judegeCanChagre() {
          let param = {}
          if(deviceConfig.stateMatrix.hasOwnProperty(this.data.currentDeviceStateCode) && 
          deviceConfig.stateMatrix[this.data.currentDeviceStateCode].hasOwnProperty("charge")) {//先判断一级状态有没有
            param.work_status = deviceConfig.stateMatrix[this.data.currentDeviceStateCode]["charge"]
          }else {
            if(deviceConfig.stateMatrix.hasOwnProperty(this.data.currentDeviceSubstateCode) && 
            deviceConfig.stateMatrix[this.data.currentDeviceSubstateCode].hasOwnProperty("charge")) {//在判断二级状态有没有
              param.work_status = deviceConfig.stateMatrix[this.data.currentDeviceSubstateCode]["charge"]
            }else {//一二级状态都没有，就不放行
              wx.showToast({
                title: "机器人工作中，请稍后",
                icon: 'none',
                duration: 3000
              })
              return
            }
          }
          this.deviceControlCmd(param)
    },
  //点击启停
  startAction() {
    this.weixinMessagePush()
    if(this.judegeDeviceState()) {
      //如果按钮是置灰的，直接toast提示
      if(!this.data.workBtnCanUse) {
        wx.showToast({
          title: buttonConfig.tipsText(this.data.currentDeviceStateCode, this.data.currentDeviceSubstateCode),
          icon: 'none',
          duration: 3000
        })
        return
      }
      //如果电量低于15%，提示机器人电量低，请稍后重试，并且不响应
      if(this.data.batteryPercent < 15) {
        wx.showToast({
          title: "机器人电量低，请稍后重试",
          icon: 'none',
          duration: 3000
        })
        return
      }
      console.log(99888888888);
        //回充和回充暂停 弹框提示是否结束回充
      if(["charging","charge_pause"].indexOf(this.data.currentDeviceStateCode) > -1 || ["charge_pause_sleeping","return_station_pause_sleeping"].indexOf(this.data.currentDeviceSubstateCode) > -1) {
          wx.showModal({
            content: '是否结束当前任务开始清扫？',
            confirmColor: "#29C3FF",
            complete: (res) => {
              if (res.confirm) {
                this.judegeCanStart()
              }
            }
          })
          return
        }
      this.judegeCanStart()
    }
  },
  //判断是否可以启动/停止
  judegeCanStart() {
    let param = {}
    if(deviceConfig.stateMatrix.hasOwnProperty(this.data.currentDeviceStateCode) && 
    deviceConfig.stateMatrix[this.data.currentDeviceStateCode].hasOwnProperty("auto_clean")) {//先判断一级状态有没有
      param.work_status = deviceConfig.stateMatrix[this.data.currentDeviceStateCode]["auto_clean"]
    }else {
      if(deviceConfig.stateMatrix.hasOwnProperty(this.data.currentDeviceSubstateCode) && 
      deviceConfig.stateMatrix[this.data.currentDeviceSubstateCode].hasOwnProperty("auto_clean")) {//在判断二级状态有没有
        param.work_status = deviceConfig.stateMatrix[this.data.currentDeviceSubstateCode]["auto_clean"]
      }else {//一二级状态都没有，就不放行
        wx.showToast({
          title: "机器人工作中，请稍后",
          icon: 'none',
          duration: 3000
        })
        return
      }
    }
    this.deviceControlCmd(param)
  },

    // 切换模式
    changeMode(e) {
      console.log("切换模式:",e);
      if(e.currentTarget.dataset.item.key == this.data.currentMode.key) {
        return
      }
      if(this.judegeDeviceState()) {
        this.setData({
          currentMode: e.currentTarget.dataset.item,
          isModeSetting: true
        })
        let param = {
          "work_mode_setting": {
            "work_mode": e.currentTarget.dataset.item.key
          }
        }
        this.deviceControlCmd(param)
      }
    },
    // 切换吸力
    changeSuction(e) {
      if(this.judegeDeviceState()) {
        this.setData({
          currentSuction: e.detail
        })
        let param = {
          "fan_setting": {
            "level": e.detail.key
          }
        }
        console.log("当前吸力传入的参数",param);
        this.deviceControlCmd(param)
      }
    },
    // 切换水量
    changeWater(e) {
      if(this.judegeDeviceState()) {
        this.setData({
          currentWater: e.detail
        })
        let param = {
          "water_tank_setting": {
            "level": e.detail.key
          }
        }
        console.log("当前水量传入的参数",param);
        this.deviceControlCmd(param)
      }  
    },
    // 切换拖布清洗模式
    changeMopModePreference(e) {
      if(this.judegeDeviceState()) {
        this.setData({
          currentMopModePreference: e.detail
        })
        let param = {
          "mop_clean_setting": {
            "mode_type": "common",//小程序目前只能设置通用模式
            "clean_level": e.detail.key
          }
        }
        console.log("当前拖布传入的参数",param);
        this.deviceControlCmd(param)
      }  
    },
    // 切换集尘频率
    changeDustTimes(e) {
      if(this.judegeDeviceState()) {
        this.setData({
          currentDustTimes: e.detail
        })
        console.log(e.detail);
        let param = {
          "dust_collection_setting": {
            "mode_type": "count",
            "value": e.detail.key
          }
        }
        console.log("当前集尘频率传入的参数",param);
        this.deviceControlCmd(param)
      }
    },
    // 确定按钮点击事件
    sureAction() {
      this.startAction()
      this.setData({
        showPopup: false
      })
    },
    // 卡片点击事件
    onCardClicked() {
      if(this.judegeDeviceState()) {
        this.setData({
          showPopup: true,
          popupTitle: "清洁模式",
          isModeSetting: false,
        })
        this.popupHeightByCurrentMode()

      }
    },
    // 模式选择弹框出现
    cleanModePopupShow() {
      if(this.judegeDeviceState()) {
        if(!this.data.modeBtnCanUse) {
          wx.showToast({
            title: "机器人工作中，请稍后",
            icon: 'none',
            duration: 3000
          })
          return
        }
        if(buttonConfig.isWorkState(this.data.currentDeviceStateCode,this.data.currentDeviceSubstateCode)) {
          wx.showModal({
            content: '工作中无法切换清洁模式，是否结束当前清洁任务？',
            confirmColor: "#29C3FF",
            complete: (res) => {
              if (res.confirm) {
                let param = {}
                param.work_status = "stop"
                this.deviceControlCmd(param, true)
              }
            }
          })
          return
        }
        this.setData({
          showPopup: true,
          popupTitle: "请选择模式",
          isModeSetting: true,
          boxHeight: 920,
        })
      }
    },
    // 弹出层消失
    onClose() {
      this.setData({
        showPopup: false
      })
    },
    // 地板清洁描述
    showCleanerDesc() {
      wx.showModal({
        title: '提示',
        confirmColor: "#29C3FF",
        content: '小天鹅专用地板清洁液，清新柠檬香，高效去污、温和无刺激，更添加抑菌因子，杀菌率达99%。适用于瓷砖、地板等硬质地面。',
        showCancel: false,
        complete: (res) => {
          if (res.confirm) {
            
          }
        }
      })
 
    },
    // 集尘袋描述
    showDustBagDesc() {
      wx.showModal({
        title: '提示',
        confirmColor: "#29C3FF",
        content: '集尘袋用于收集尘盒内垃圾，采用抗菌材质，能锁住99%花粉、尘螨及霉菌，超大容量，建议60天更换一次。',
        showCancel: false,
        complete: (res) => {
          if (res.confirm) {
            
          }
        }
      })
 
    },

      // 根据当前模式计算弹框高度
    popupHeightByCurrentMode() {
      console.log("当前的模式设置：",this.data.isModeSetting);
        let tempHeight = 920
        if(!this.data.isModeSetting) {
          if(this.data.currentMode.key == 'sweep') {
            tempHeight = 600
          }else if(this.data.currentMode.key == 'mop') {
            tempHeight = 792
          }else {
            tempHeight = 984
          }
        }
          this.setData({
            boxHeight: tempHeight
          })
        
      },
    //控制指令先判断是否在线 或者 定位中
    judegeDeviceState() {
      if(this.data.currentDeviceState == '连接中') {
        wx.showToast({
          title: '机器人连接中，请稍后',
          icon: 'none',
          duration: 3000
        })
        return false;
      }
      if(this.data.currentDeviceStateCode == 'relocate') {
        wx.showToast({
          title: '机器人工作中，请稍后',
          icon: 'none',
          duration: 3000
        })
        return false;
      }
      return true
    },
    
      // 获取当前模式水量 吸力 回洗频率 集成频率
    getCurrentItem(currentState, list) {
      if(currentState) {
        let currentItem = list.find(item => {
          return currentState == item.key
        })
        return currentItem ? currentItem : { key: currentState, value: 0,title: "--"}
      }
    },
    //状态展示
    deviceStateShow(deviceState) {
      console.log("当前的设备状态信息:",deviceState);
      let tempState = "连接中"
      if(deviceState.work_status == "on_base"){//如果设备在站上，有不同的子状态需要显示
        tempState = deviceConfig.stationWorkState.hasOwnProperty(deviceState.sub_work_status) ? deviceConfig.stationWorkState[deviceState.sub_work_status] : "连接中"
      }else {
        tempState = deviceConfig.mainWorkState.hasOwnProperty(deviceState.work_status) ? deviceConfig.mainWorkState[deviceState.work_status] : "连接中"
      }
      // 工作中时，根据扫拖模式来显示文
      if(deviceState.work_status == 'work') {
        console.log("当前的工作模式是:",this.data.currentMode);
        if(this.data.currentMode.key == 'sweep') {
          tempState = '扫地中'
        }else if(this.data.currentMode.key == 'mop') {
          tempState = '拖地中'
        }else if(this.data.currentMode.key == 'sweep_and_mop') {
          tempState = '扫拖中'
        }else if (this.data.currentMode.key == 'sweep_then_mop') {//TODO 需要等lua更新后确定是在扫地还是在拖地
         if(deviceState.sweep_then_mop_mode_progress == 1) {
          tempState = "扫地中"
         }else if(deviceState.sweep_then_mop_mode_progress == 2) {
           tempState = "拖地中"
         }else {
          tempState = '工作中'
         }
        }else {
          tempState = '工作中'
        }
      }
      // 如果是休眠状态和停止状态，如果switch_status的bit5(从右往左第6位)是true,就是基站自清洁
      if(deviceState.switch_status && deviceState.switch_status.length > 6) {
        let newStr = deviceState.switch_status.split("").reverse().join("")
        console.log(deviceState.switch_status,newStr);
        let bit5 = newStr.charAt(5)
        if(bit5 == 1 && (deviceState.work_status == 'stop' || deviceState.work_status == 'sleep')) {
          tempState = "基站自清洁中"
        }
      }
      // water_station_status返回的是一组7位的2进制数据，bit3表示强力液（1有，0不足）  bit4表示尘袋（1满，0未满） bit5(1尘袋已安装 0尘袋未安装)
      if(deviceState.water_station_status && deviceState.water_station_status.length > 4) {
        let newStr = deviceState.water_station_status.split("").reverse().join("")
        let bit3 = newStr.charAt(3)
        let bit4 = newStr.charAt(4)
        let bit5 = newStr.charAt(5)
        this.setData({
            floorCleanerStatus: bit3 == 1 ? true : false,
            dustBagStatus: bit4 == 1 ? false : true,
            dustBagInstallStatus: bit5 == 1 ? true : false
        })
      }

      this.setData({
        currentDeviceState: tempState,
        currentDeviceStateCode: deviceState.work_status,//主状态
        currentDeviceSubstateCode: deviceState.sub_work_status ? deviceState.sub_work_status : ""
      })
      this.buttonShowState()
    },

     // 判断当前状态可以下发那些指令 不能下发对应指令时，对应按钮置灰
     buttonShowState() {
      if(buttonConfig.chargeButtonState(this.data.currentDeviceStateCode, this.data.currentDeviceSubstateCode)) {//回充按钮置灰
        this.setData({
          chargeBtnCanUse: true
        })
      }else {
        this.setData({
          chargeBtnCanUse: false
        })
      }

      if(buttonConfig.modeButtonState(this.data.currentDeviceStateCode, this.data.currentDeviceSubstateCode)) {//模式切换按钮置灰
        this.setData({
          modeBtnCanUse: true
        })
      }else {
        this.setData({
          modeBtnCanUse: false
        })
      }

      if(buttonConfig.workButtonState(this.data.currentDeviceStateCode, this.data.currentDeviceSubstateCode)) {//启停按钮置灰
        this.setData({
          workBtnCanUse: true
        })
      }else {
        this.setData({
          workBtnCanUse: false
        })
      }
      this.buttonShowImage()
    },
     // 按钮当前展示的图片
     buttonShowImage() {
      //回充按钮图片
      if(this.data.currentDeviceStateCode == "charging") {
        this.setData({
          reChargeIcon: `${IMAGE_SERVER}charge_pause.svg`
        })
      }else {
        this.setData({
          reChargeIcon: `${IMAGE_SERVER}charge.svg`
        })
      }
      // 清扫启停按钮图片
      if(this.data.currentDeviceStateCode == "map_searching" || this.data.currentDeviceStateCode == "work") {
        this.setData({
          startIcon: `${IMAGE_SERVER}start_pause.svg`,
          sureBtnText: "暂停"
        })
      }else {
        this.setData({
          startIcon: `${IMAGE_SERVER}start.svg`,
          sureBtnText: "启动"
        })
      }
    },

     // 主动查询的指令
   queryCmds() {
    this.queryDeviceState()
    this.queryDeviceMode()
    this.queryMopCount()
   },

    // 查询设备信息
    queryDeviceState() {
      let param = {
        "query_type": "work"
      }
      this.luaQuery(this.properties.applianceData.applianceCode, param).then(res => {
        // console.log("查询指令：",res);
        if(res && JSON.stringify(res) != "{}" && res != undefined) {
          this.setData({
            deviceState: res,
            batteryPercent: res.battery_percent,
            plannerStatus: res.planner_status,
            currentSuction: this.getCurrentItem(res.fan_level, deviceConfig.suctionList),
            currentWater: this.getCurrentItem(res.water_level, deviceConfig.waterList),
            currentDustTimes: this.getCurrentItem(res.dust_count, deviceConfig.dustTimesList),
            errorText: res.error_type != 'no' ? luaErrorCode[res.error_desc] : "",
            showNotify: res.error_type != 'no' ? true : false,
       
          })
          this.deviceStateShow(res)
          wx.hideLoading({
            noConflict: true
          })
        }
      }, err => {
        wx.hideLoading({
          noConflict: true
        })
        console.log('获取设备的状态错误:', err);
      })
    },
    /**
     * 03查询指令
     */
    // 查询扫拖模式
    queryDeviceMode() {
      let param = {
        "query_type":"work_mode"
       }
       this.luaQuery(this.properties.applianceData.applianceCode, param).then(res => {
        if(res && JSON.stringify(res) != "{}" && res != undefined) {
          this.setData({
            currentMode: this.getCurrentItem(res.work_mode, deviceConfig.modeList),
          })
          this.popupHeightByCurrentMode()
         }
       }, err => {
        console.log('获取扫拖模式错误:', err);
       })
    },

    // 查询拖布清洗频率
    queryMopCount() {
      let param = {
        "query_type":"mop_clean_setting"
       }
       this.luaQuery(this.properties.applianceData.applianceCode, param).then(res => {
        console.log('查询拖布清洗速度:',res);
        if(res && JSON.stringify(res) != "{}" && res != undefined) {
         this.setData({
          currentMopModePreference: this.getCurrentItem(res.clean_level, deviceConfig.mopModePreferenceList),
         })
        }
       }, err => {
        console.log('查询拖布清洗速度错误:', err);
       })
    },

    /**
     * 
     *  02控制指令
     */
       // 设备下发控制指令 isStop是不是停止指令
    deviceControlCmd(param, isStop=false) {
      wx.showLoading({title: "加载中"})
      this.luaControl(this.properties.applianceData.applianceCode,param).then(res => {
            // wx.hideLoading()
            if(isStop) {//如果是停止指令，说明是切换模式的弹框事件，成功就弹出模式切换弹框
              this.setData({
                showPopup: true,
                popupTitle: "请选择模式",
                isModeSetting: true,
                boxHeight: 920,
              })
            }
            this.queryCmds()
          }, err => {
            wx.hideLoading({
              noConflict: true
            })
        })
      },
  
  }
})
