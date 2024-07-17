import {  VC_IMAGE_ROOT_URL, VC_FAN_LEVEL, VC_WATER_LEVEL, suction_base_data, water_base_data } from '../utils/vcutils'
import configs from "../common/configs/index"
const luaBehaviors = require('../common/js/luaBehaviors')
let {luaErrorCode, deviceConfig, buttonConfig}=configs
const localImag = VC_IMAGE_ROOT_URL;
Component({
  options: {
    styleIsolation: 'page-shared',//设置为share后，该组件的wxss文件可以影响到mui组件的样式
  },
  behaviors: [luaBehaviors],
  properties: {
    applianceData: {
      type: Object,
      value: function () {
          return {
          }
      },
    },
    pageHeight: {
      type: Number ,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    luaQueryInterval: undefined,//主动查询定时器
    deviceState: {},//设备基础状态
    errorText:"",//故障文案
    showNotify:false,//展示故障通知栏
    chargeBody: localImag + 'vc-battery-body.png',//电池外壳
    closeCleanUrl: localImag + 'vc-close-clean-info.png',
    isCharge: false,//是否充电
    quantityWidth: 0,//电池电量
    quantityColor: "#fff",//电池颜色
    battery: 0,//电池电量
    deviceImage: localImag + 'vc-state-standby.png',//机器人图片
    deviceImageBack: '',//背景图
    deviceWidth: '85vw',
    deviceHeight: '85vw',
    cleanStateText: '已完成清洁',//是否已经完成清洁
    cleanTime: 0,//清洁时长
    cleanArea: 0,//清洁面积
    showClose: true,
    currentMode: deviceConfig.modeList[0],//当前模式
    currentDeviceState: "连接中",//当前机器状态文案
    currentDeviceStateCode: "connect",// 当前主状态码
    currentDeviceSubstateCode: "connect",//当前子状态码
    showCleanInfo: '',
    fanLevel: VC_FAN_LEVEL.FL_NORMAL,
    waterLevel: VC_WATER_LEVEL.WL_LOW,
    showPopup: false,//是否显示弹出框
    boxHeight: 420,//弹出层高度
    currentPopupType: 'fan',//弹出框类型
    suctionBtnList: [],//吸力大小数组
    waterBtnList: [],//水量大小数组
    popupDataList: [],
    suctionDataMap: {
      low: "轻柔",
      soft: "标准",
      normal: "强力",
      high: "超强",
    },
    waterDataMap: {
        low: "低水量",
        normal: "标准",
        high: "高水量",
    },
    controlList: [
      {icon: localImag + 'vc-recharge-normal.png', title: '开始回充', style: "color:#000000;opacity:1;font-size:12px",disable: false,tag: "charge"},
      {icon: localImag + 'vc-start-normal.png', title: '开始清洁', style: "color:#000000;opacity:1;font-size:12px",disable: false, tag: "clean"},
    ],//控制按钮
    chargeBtnCanUse: true,//充电按钮是否可用
    workBtnCanUse: true,//工作按钮是否可用
    V12List: ['750004AT','750004B3','750004BZ','750004CA'],//V12系列
    deviceImageSquare: ['750004AT','750004B3','750004BZ','750004CA','750004C6','750004CE','750004CF','750004D8'],//方形的机器
    fanHaveForGear: ['750004C6','750004CE','750004CF','750004D8','750004CD','750004DA','750004D2'],//吸力有四档 
  },

  lifetimes: {
    attached() {
      if(this.properties.applianceData.onlineStatus == 1) {
        wx.showLoading({title: "加载中"})
        this.queryCmds()
        let timer = setInterval(() => {
          this.queryCmds()
        }, 5000);
        this.setData({
          luaQueryInterval: timer,
        })
      }
      if(this.data.fanHaveForGear.indexOf(this.properties.applianceData.sn8) > -1) {//四档吸力
        let fan1 = [suction_base_data[0],suction_base_data[1],suction_base_data[2],suction_base_data[3]]
        let fan2 = [suction_base_data[5],suction_base_data[6],suction_base_data[7],suction_base_data[8]]
        let fanMap1 = {
          low: "轻柔",
          soft: "标准",
          normal: "强力",
          high: "超强",
        }
        let fanMap2 = {
          soft: "轻柔",
          normal: "标准",
          high: "强力",
          super: "超强",
        }
        this.setData({
          suctionBtnList: this.properties.applianceData.sn8 == '750004CD' ? fan1 : fan2,//V13和W20的四档不一样
          waterBtnList: [water_base_data[1],water_base_data[2],water_base_data[3]],
          suctionDataMap: this.properties.applianceData.sn8 == '750004CD' ? fanMap1 : fanMap2,
        })
      
      }else {
        this.setData({
          suctionBtnList: [suction_base_data[1],suction_base_data[2],suction_base_data[3]]
        })
        if(this.data.V12List.indexOf(this.properties.applianceData.sn8) > -1) {//V12系列
          this.setData({
            waterBtnList: [],
            suctionDataMap: {
              soft: "轻柔",
              normal: "标准",
              high: "强力",
            },
          })
        }else {
          this.setData({
            waterBtnList: [water_base_data[1],water_base_data[2],water_base_data[3]]
          })
        }
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
    // 设置电池状态
    setBatteryState(deviceState) {
      let rateVal = 0.2;
      console.log("电池信息：",deviceState);
      if(deviceState.sub_work_status == "charging" || deviceState.sub_work_status == "charge_finish") {
        console.log(1111);
        this.setData({
          chargeBody: localImag + 'vc-battery-body1.png',
          isCharge: true,
          quantityWidth: 0,
          quantityColor: "#fff",
          battery: deviceState.battery_percent
        })
      }else {
        let batteryColor = '#fff'
        let battery = deviceState.battery_percent
        if(battery >= 0 && battery <= 15) {
          batteryColor = '#FD6057'
        }else {
          batteryColor = '#22BE3C'
        }
        this.setData({
          chargeBody: localImag + 'vc-battery-body.png',
          isCharge: false,
          quantityWidth: rateVal * (battery <= 100 ? battery : 100),
          quantityColor: batteryColor,
          battery: deviceState.battery_percent
        })
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
      if(deviceState.work_status == 'clean_pause') {//主要是把清扫暂停改为清洁暂停
        tempState = '清洁暂停'
      }
      // 工作中时，根据扫拖模式来显示文
      if(deviceState.work_status == 'work') {
        console.log("当前的工作模式是:",this.data.currentMode);
        tempState = '清洁中'
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
      if(['work','clean_pause'].indexOf(deviceState.work_status) > -1) {
        this.setData({
          showClose: false,
          lastCleanTitle: "已清洁"
        })
      }else {
        this.setData({
          showClose: true,
          lastCleanTitle: "已完成清洁"
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
  
        if(buttonConfig.workButtonState(this.data.currentDeviceStateCode, this.data.currentDeviceSubstateCode)) {//启停按钮置灰
          this.setData({
            workBtnCanUse: true
          })
        }else {
          this.setData({
            workBtnCanUse: false
          })
        }
        this.controlStyleByDeviceStatus()
      },
    // 底部控制按钮样式及文案
    controlStyleByDeviceStatus() {
      let tempList = []
      let chargeItem = this.data.controlList[0]
      let startItem = this.data.controlList[1]
      chargeItem.disable = !this.data.chargeBtnCanUse
      startItem.disable = !this.data.workBtnCanUse
      if(this.data.deviceState.work_status == 'charging') {
        chargeItem.title = '暂停回充'
        chargeItem.icon = localImag + 'vc-recharge-pause.png'
        chargeItem.style = "color:#000000;opacity:1;font-size:12px"
      }else {
        chargeItem.title = '开始回充',
        chargeItem.icon = localImag + 'vc-recharge-normal.png'
        chargeItem.style = "color:#000000;opacity:1;font-size:12px"
      }
      if(this.data.deviceState.work_status == 'work' || this.data.deviceState.work_status == 'map_searching' ) {
        startItem.title = '暂停清洁'
        startItem.icon = localImag + 'vc-pause.png'
        startItem.style = "color:#000000;opacity:1;font-size:12px"
  
      }else {
        startItem.title = '开始清洁'
        startItem.icon = localImag + 'vc-start-normal.png'
        startItem.style = "color:#000000;opacity:1;font-size:12px"

      }
      if(!this.data.chargeBtnCanUse) {
        chargeItem.icon = localImag + 'vc-recharge-disable.png'
        chargeItem.style = "color:#000000;opacity:0.3;font-size:12px"
      }
      if(!this.data.workBtnCanUse) {
        startItem.icon = localImag + 'vc-start-disable.png'
        startItem.style = "color:#000000;opacity:0.3;font-size:12px"
      }
      if((this.data.deviceState.work_status == 'clean_mop_pause' || this.data.deviceState.work_status == 'back_clean_mop') && ['750004CD'].indexOf(this.properties.applianceData.sn8) > -1) {//v13清洗抹布和清洗抹布暂停时，不可点击
        chargeItem.disable = true
        chargeItem.icon = localImag + 'vc-recharge-disable.png'
        chargeItem.style = "color:#000000;opacity:0.3;font-size:12px"
      }
      tempList.push(chargeItem)
      tempList.push(startItem)
      this.setData({
        controlList: tempList
      })
      
    },

    // 设备图片样式展示
    deviceImageShow(deviceState) {
      if(this.data.deviceImageSquare.indexOf(this.properties.applianceData.sn8) > -1) {//方形机器
        if(deviceState.work_status == 'work' ||deviceState.work_status == 'map_searching' ) {
          this.setData({
            deviceImage: localImag + 'device-square.png',
            deviceHeight: '55vw',
            deviceWidth: '55vw',
            deviceImageBack: localImag + 'device-work-back.png',
          })
        }else {
          this.setData({
            deviceImage: localImag + 'device-square.png',
            deviceHeight: '55vw',
            deviceWidth: '55vw',
            deviceImageBack: '',
          })
        }
      }else {
        if(deviceState.work_status == 'work' ||deviceState.work_status == 'map_searching' ) {
          this.setData({
            deviceImage: localImag + 'vc-state-working.png',
            deviceHeight: '85vw',
            deviceWidth: '85vw',
          })
        }else {
          this.setData({
            deviceImage: localImag + 'vc-state-standby.png',
            deviceHeight: '85vw',
            deviceWidth: '85vw',
          })
        }
      }
    },

  // 获取当前模式水量
    getCurrentItem(currentState, list) {
      if(currentState) {
        let currentItem = list.find(item => {
          return currentState == item.key
        })
        return currentItem ? currentItem : { key: currentState, value: 0,title: "--"}
      }
    },

    // 关闭清洁信息
    closeCleanInfo() {
      this.setData({
        showCleanInfo: 'opacity0'
    })
    },
    // 点击弹出清洁偏好弹出层
    openPanel(e) {
      if(this.data.currentDeviceState == '连接中') {
        wx.showToast({
          title: '机器人连接中，请稍后',
          icon: 'none',
          duration: 3000
        })
        return false;
      }
      console.log("点击了cell", e);
      this.weixinMessagePush()
      this.setData({
        showPopup: true,
        popupDataList: e.detail.type == 'water' ? this.data.waterBtnList : this.data.suctionBtnList,
        currentPopupType: e.detail.type
      })
    },
    // 弹出层消失
    onClose() {
      this.setData({
        showPopup: false
      })
    },
    // 选择清洁偏好
    selectCleanPreference(e) {
      if(this.data.currentDeviceState == '连接中') {
        wx.showToast({
          title: '机器人连接中，请稍后',
          icon: 'none',
          duration: 3000
        })
        return false;
      }
      console.log("清洁偏好数据:", e);
      let parms = {}
      if(this.data.currentPopupType == 'fan') {
        parms = {
          "fan_setting": {
            "level": e.currentTarget.dataset.value
          }
        }
      }else if(this.data.currentPopupType == 'water') {
        parms = {
          "water_tank_setting": {
            "level": e.currentTarget.dataset.value
          }
        }
      }
      this.deviceControlCmd(parms)
    },

    // 控制指令
    clickItem(e) {
      if(e.detail.index == 'clean') {//点击清洁按钮
        this.judegeCanStart()
      }else {//点击回充按钮
        this.judegeCanChagre()
      }
    },
         //判断是否可以回充
    judegeCanChagre() {
      if(this.data.currentDeviceState == '连接中') {
        wx.showToast({
          title: '机器人连接中，请稍后',
          icon: 'none',
          duration: 3000
        })
        return false;
      }
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

    //判断是否可以启动/停止
  judegeCanStart() {
      if(this.data.currentDeviceState == '连接中') {
        wx.showToast({
          title: '机器人连接中，请稍后',
          icon: 'none',
          duration: 3000
        })
        return false;
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
    if(param.work_status == 'auto_clean' && param.planner_status == 1) {
      param.work_status = 'auto_clean_continue'
    }
    this.deviceControlCmd(param)
  },
  // 主动查询的指令
    queryCmds() {
      this.queryDeviceState(),
      this.queryDeviceMode()
    },
    // 查询设备信息
    queryDeviceState() {
        let param = {
          "query_type": "work"
        }
        this.luaQuery(this.properties.applianceData.applianceCode, param).then(res => {
          console.log("查询指令：",res);
          if(res && JSON.stringify(res) != "{}" && res != undefined) {
            let errText = ''
            let showErr = false
            if((res.error_desc != 'no' || res.station_error_desc != 'no')) {
              showErr = true
              if(res.error_desc && res.error_desc != 'no') {
                errText = luaErrorCode[res.error_desc]
              }else if(res.station_error_desc && res.station_error_desc != 'no') {
                errText = luaErrorCode[res.station_error_desc]
              }
            }
            if(['750004C6','750004CE','750004CF','750004D8'].indexOf(this.properties.applianceData.sn8) > -1) {//W20有些故障不需要显示
              if(['warn_dust_box_full', 'warn_cleaning_liquid_lack', 'warn_comm_disconnect'].indexOf(res.error_desc) > -1 || ['warn_dust_box_full', 'warn_cleaning_liquid_lack', 'warn_comm_disconnect'].indexOf(res.station_error_desc) > -1 ) {
                showErr = false
              }
            }
            let tempDeviceState = res
            tempDeviceState.sub_work_status = tempDeviceState.sub_work_status ? tempDeviceState.sub_work_status : tempDeviceState.work_sub_type
            this.setData({
              deviceState: tempDeviceState,
              errorText: errText,
              showNotify: showErr,
              cleanTime: res.work_time,
              cleanArea: res.area
            })
            wx.hideLoading({
              noConflict: true
            })
            res.battery = 14
            this.deviceStateShow(res)
            this.setBatteryState(res)
            this.deviceImageShow(res)

          }
        }, err => {
          wx.hideLoading({
            noConflict: true
          })
          console.log('获取设备的状态错误:', err);
        })
    },
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
           }
         }, err => {
          console.log('获取扫拖模式错误:', err);
         })
    },
     /**
     * 
     *  02控制指令
     */
    deviceControlCmd(param) {
      wx.showLoading({title: "加载中"})
      console.log("控制指令数据是：", param);
      this.luaControl(this.properties.applianceData.applianceCode,param).then(res => {
        this.queryDeviceState(),
        wx.hideLoading({
          noConflict: true
        })
      }, err => {
        wx.hideLoading({
          noConflict: true
        })
        })
      },
  }
})