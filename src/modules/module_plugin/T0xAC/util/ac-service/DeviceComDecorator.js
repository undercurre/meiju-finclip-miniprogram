const app = getApp();
const requestService = app.getGlobalConfig().requestService
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack
import SendOrder from '../SendOrder.js'
import Helper from '../Helper.js';
import MeijuService from './../MeijuService'
// ../util/device-funcs-match/SnProcess
import SnProcess from '../../util/device-funcs-match/SnProcess'
import {
  CMD,
  STATUS
} from "../Data";
import Common from '../common';
import Event from '../event'
import {
  LuaMap
} from '../selfconfig/lua-map.js'

import {
  LuaMapCoolFree
} from '../selfconfig/lua-map-coolfree.js'

import {
  LuaMapTh 
} from '../selfconfig/lua-map-th.js'

import {
  LuaMapNorthWarm
} from '../selfconfig/lua-map-northwarm.js'

import {
  LuaMapCfKitchen
} from '../selfconfig/lua-map-cf-kitchen.js'

import {
  BurialMapList
} from '../burialMap'

import {
  FuncType,
  FuncOrder,
  FuncMetaType
} from '../sn-process/FuncType'

let meijuService = new MeijuService();
const modeArray = ['自动', '制冷', '制热', '送风', '抽湿'];
const freshAirFanSpeed = {
  '40': '(低)',
  '60': '(中)',
  '80': '(高)',
  '100': '(强劲)'
}

const freshAirFanSpeedTH = {
  '40': '(1档)',
  '60': '(2档)',
  '80': '(3档)',
  '100': '(4档)'
}


const angleMap = {
  "1": 1,
  "25": 3,
  "50": 5,
  "75": 7,
  "100": 9
}
export default class DeviceComDecorator {
  constructor(bluetoothConn, applianceCode, ctrlType, deviceSn, deviceSn8) {
    // this.deviceId = deviceId;
    // this.serviceId = serviceId;
    // this.characteristicId = characteristicId;
    this.bluetoothConn = bluetoothConn;
    this.useRemote = false;
    this.applianceCode = applianceCode;
    this.ctrlType = ctrlType; // 1：蓝牙 2：wifi 3：虚拟
    this.deviceSn = deviceSn;
    this.deviceSn8 = deviceSn8;
    this.subType = this.getAcSubType();
    console.log("找到设备subType",this.subType);
    this.isCoolFree = this.subType && (this.subType == 'COOLFREE' || this.subType.indexOf('COOLFREE') >= 0)
    this.useTH = this.checkUseWhat('useTH');
    this.isTH = this.useTH || (this.subType && (this.subType == 'XF1_1_BLE' || this.subType == 'T5_35_BLE' || this.subType == 'T3_35_BLE' || this.subType == 'T5_72_BLE' || this.subType == 'K2_1_BLE' || this.subType == 'JP1_1' || this.subType == 'JH1_1' || this.subType == 'FA1_1' || this.subType == 'FA1_1_51_72')) // 使用th协议的
    this.useTHFreshAir = this.subType && (this.subType == 'T5_35_BLE' || this.subType == 'T3_35_BLE' || this.subType == 'T5_72_BLE' || this.subType == 'T3_OFFLINE_VOICE_BLE')
    this.useNorthWarm = this.checkUseWhat('useNorthWarm');
    this.useCfKitchen = this.checkUseWhat('useCoolFreeKitchen');

    this.AcProcess = new SendOrder();

    this.timer = null;

    console.log(this.useCfKitchen, 'this.useCfKitchen');

    this.event = new Event();

    this.oldtime = ''    
    
    this.status = {}
  }

  /********************************* 业务函数 *********************************/
  _queryStatus(useLoading) {
    console.log('查询设备状态');
    this.writeData({
      hex: this.AcProcess.makeQueryPackage(),
      attr: {
        query_type: ''
      }
    }, useLoading, '加载中...');
    // this.luaQuery();
  }


  _queryStatusCoolFree() {
    this.writeData({
      hex: this.AcProcess.makeCoolFreeQueryPackage(),
      attr: {
        query_type: ''
      }
    }, false, '加载中...');    
  }

  // 查询酷风温度
  _queryStatusCoolFreeRunstatus() {
    this.writeData({
      hex: this.AcProcess.makeCoolFreeQueryPackage(),
      attr: {
        query_type: 'run_status'
      }
    }, false, '加载中...');    
  }

  _queryStatusSetting() {
    this.writeData({
      hex: "",
      attr: {
        query_type: 'nil'
      }
    }, false, '加载中...', '', (data)=>{
      console.log("_queryStatusSetting", data);
      if (data.single_control == 1) {
        this._queryStatusCoolFreeKitchen();
      } 
    });    
  }
  // 查询X空间厨房空调信息
  _queryStatusCoolFreeKitchen() {
        
    this.writeData({
      hex: "",
      attr: {
        query_type: 'c002_query'
      }
    }, false, '加载中...');    

    this._queryXAreaRunstatus();
  }

  // 查询x空间上的滤网清洁之类的
  _queryXAreaRunstatus() {
    this.writeData({
      hex: "",
      attr: {
        query_type: 'run_status'
      }
    }, false, '加载中...');    
  }


  // 查新协议
  _queryStatusNewProtocol(useloading = true,queryType) {
    let attribuite = this.getDeviceFunc();
    this.newProtocolCMD = attribuite.uniqueCmds
    // this.newProtocolCMD[CMD.Supercooling] = "";
    console.log('查新协议',attribuite.luaKeysStr,attribuite.uniqueCmds, this.newProtocolCMD.length);
    let order = this.AcProcess.makeQueryPackage(this.newProtocolCMD);    
    this.writeData({
      hex: order,
      attr: {
        query_type:  this.isTH ? 'total_query' : attribuite.luaKeysStr
      }
    }, useloading, '加载中...');
  }

  querySelfClean(queryType) {    
    this.newProtocolCMD = [CMD.CONTROLSELFCLEANING];    
    let order = this.AcProcess.makeQueryPackage(this.newProtocolCMD);
    this.writeData({
      hex: order,
      attr: {
        query_type: queryType
      }
    }, true, '加载中...');
  }


  // 查询北方采暖
  // {'query_type':'query_all,app_page_display'}
  _queryStatusNorthWarm() {
    this.writeData({
      hex: '',
      attr: {
        query_type: 'query_all,app_page_display'
      }
    }, false, '加载中...');    
  }

  // 查询北方采暖器定时
  _queryTimerStatusNorthWarm() {
    this.writeData({
      hex: '',
      attr: {
        query_type: 'water_module_timer'
      }
    }, false, '加载中...');    
  }


  /*
   * 经典协议
   * */
  /*开关机*/
  switchDevice(isOn, modeIndex, memoryChoice, acstatus, isKitchen, callback) {    
    let burzzer = wx.getStorageSync('Sound')
    let memoryMode = memoryChoice ? memoryChoice.mode : acstatus.mode;    
    let thAttrs = {};
    let attrs = {
      runStatus: isOn ? 1 : 0,
      tempSet: memoryChoice ? (memoryChoice.tempSet > acstatus.tempSet ? acstatus.tempSet : memoryChoice.tempSet) : acstatus.tempSet,
      mode: memoryMode,
      tempSet2: memoryChoice ? (memoryChoice.tempSet > acstatus.tempSet ? acstatus.tempSet : memoryChoice.tempSet) : acstatus.tempSet,
      windSpeed: memoryChoice ? (memoryChoice.windSpeed > 102 ? 102 : memoryChoice.windSpeed) : 102,
      // leftUpDownWind: memoryChoice ? memoryChoice.windUpDown : 0,
      // rightUpDownWind: memoryChoice ? memoryChoice.windUpDown : 0,
      // leftLeftRightWind: memoryChoice ? memoryChoice.windLeftRight : 0,
      // rightLeftRightWind: memoryChoice ? memoryChoice.windLeftRight : 0,
      timingOffSwitch: 0, // 定时关机是否开启，0-关闭，1-开启
      timingOnSwitch: 0,
      timingOffHour: 0,
      timingIsValid: 0, // 定时时间-小时
      timingOffMinute: 0,
      elecHeat: (memoryMode === 1 ? 1 : 0) || (memoryMode === 4 ? 1 : 0), // 制热、自动打开电辅热
      cosySleepMode: 0, //开关机将睡眠曲线关闭
      btnSound: burzzer ? 1 : 0
    };
    if (!isKitchen) {  // 厨房空调不传摆风参数
      attrs.leftUpDownWind = memoryChoice ? memoryChoice.windUpDown : 0;
      attrs.rightUpDownWind = memoryChoice ? memoryChoice.windUpDown : 0;
      attrs.leftLeftRightWind = memoryChoice ? memoryChoice.windLeftRight : 0;
      attrs.rightLeftRightWind = memoryChoice ? memoryChoice.windLeftRight : 0;
    }
    console.log('开关机', burzzer, attrs);
   
    let luaTempSet = memoryChoice ? (memoryChoice.tempSet > acstatus.tempSet ? acstatus.tempSet : memoryChoice.tempSet) : acstatus.tempSet;
    let _is = parseInt(luaTempSet) > 30 ? 30 : parseInt(luaTempSet) < 16 ? 16 : parseInt(luaTempSet);
    let _is5 = ((luaTempSet - parseInt(luaTempSet)) * 10) === 0 ? 0 : 0.5;
    let modeOptions = ["auto", "cool", "dry", "heat", "fan"]

    this.AcProcess.parser.newsendingState.coolPowerSaving = 0; // 酷省电  


    /*leftUpDownWind: memoryChoice ? memoryChoice.windUpDown : 0,
      rightUpDownWind: memoryChoice ? memoryChoice.windUpDown : 0,
      leftLeftRightWind: memoryChoice ? memoryChoice.windLeftRight : 0,
      rightLeftRightWind: memoryChoice ? memoryChoice.windLeftRight : 0,*/


    let luaAttrs = {
      power: isOn ? "on" : "off",
      temperature: _is,
      small_temperature: _is5,
      mode: modeOptions[memoryMode - 1],
      // wind_swing_lr: memoryChoice ? (memoryChoice.windLeftRight ? "on" : "off") : "off",
      // wind_swing_lr_under: memoryChoice ? (memoryChoice.windLeftRight ? "on" : "off") : "off",
      // wind_swing_ud: memoryChoice ? (memoryChoice.windUpDown ? "on" : "off") : "off",
      wind_speed: memoryChoice ? (memoryChoice.windSpeed > 102 ? 102 : memoryChoice.windSpeed) : 102,
      ptc: (memoryMode === 1 || memoryMode === 4) ? "on":"off",
      ptc_force: (memoryMode === 1 || memoryMode === 4) ? "on":"off",
      buzzer: burzzer ? "on" : "off"
    }
    if (!isKitchen) {  // 厨房空调不传摆风参数
      luaAttrs.wind_swing_lr = memoryChoice ? (memoryChoice.windLeftRight ? "on" : "off") : "off";
      luaAttrs.wind_swing_lr_under = memoryChoice ? (memoryChoice.windLeftRight ? "on" : "off") : "off";
      luaAttrs.wind_swing_ud = memoryChoice ? (memoryChoice.windUpDown ? "on" : "off") : "off";
    }

    if(this.subType == 'F1_1_26_35_BLE') {
      delete luaAttrs.wind_speed;
      delete attrs.windSpeed; 
    }

    // 
    if(this.isTH) { // TH的关机特殊处理，开机时正常发power on
      if(isOn) {
        thAttrs[CMD.THPOWER] = [1];      
        if (this.subType == 'T1_OFFLINE_VOICE_BLE' || this.subType == 'T5_35_BLE' || this.subType == 'T3_35_BLE') {          
          luaAttrs = {
            total_status_switch: "1",
            buzzer: burzzer ? "on" : "off"
          }
        } else {
          luaAttrs = {
            power: "on",
            buzzer: burzzer ? "on" : "off"
          }
        }        
      } else { // 关机时 total_status_switch 发 0
        thAttrs[CMD.THPOWER] = [0]
        thAttrs[CMD.FRESHAIR] = [0]        
        luaAttrs = {
          total_status_switch: "0",
          buzzer: burzzer ? "on" : "off"
        }
      }     
    }


    let hex = ""
    if(this.isTH) {
      hex = this.AcProcess.makeNewProtocolPackage(thAttrs, burzzer)
    }  else {
      hex = this.AcProcess.makeStandardProtocolPackage(attrs);
    }
    this.writeData({
      hex: hex,
      attr: luaAttrs
    }, true, '加载中...', "switchDevice", ()=>{    
      this.selfShowToast(isOn ? '设备已开机' : '设备已关机')
    });

    let burialParam = {
      page_name: "遥控面板",
      object: "电源开关",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: "{\"temperature\":\"" + acstatus.tempSet + "°C\",\"speed\":\"" + acstatus.windSpeed + "\"}",
      order_status: 1
    };  
    
    this.delayQueryNewAndOld();
    console.log(JSON.stringify(burialParam))
    this.sendBurial(burialParam);    
  }

  switchTHDevice(isOn, modeIndex, memoryChoice, acstatus, callback) {      
    let memoryMode = memoryChoice ? memoryChoice.mode : acstatus.mode;    
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    // console.log('开关机', burzzer, attrs);

    let luaTempSet = memoryChoice ? (memoryChoice.tempSet > acstatus.tempSet ? acstatus.tempSet : memoryChoice.tempSet) : acstatus.tempSet;
    let _is = parseInt(luaTempSet) > 30 ? 30 : parseInt(luaTempSet) < 16 ? 16 : parseInt(luaTempSet);
    let _is5 = ((luaTempSet - parseInt(luaTempSet)) * 10) === 0 ? 0 : 0.5;
    let modeOptions = ["auto", "cool", "dry", "heat", "fan"]

    this.AcProcess.parser.newsendingState.coolPowerSaving = 0; // 酷省电  

    if(isOn) {
      attrs = {
        runStatus: isOn ? 1 : 0,
        tempSet: memoryChoice ? (memoryChoice.tempSet > acstatus.tempSet ? acstatus.tempSet : memoryChoice.tempSet) : acstatus.tempSet,
        mode: memoryMode,
        tempSet2: memoryChoice ? (memoryChoice.tempSet > acstatus.tempSet ? acstatus.tempSet : memoryChoice.tempSet) : acstatus.tempSet,
        windSpeed: memoryChoice ? (memoryChoice.windSpeed > 102 ? 102 : memoryChoice.windSpeed) : 102,
        leftUpDownWind: memoryChoice ? memoryChoice.windUpDown : 0,
        rightUpDownWind: memoryChoice ? memoryChoice.windUpDown : 0,
        leftLeftRightWind: memoryChoice ? memoryChoice.windLeftRight : 0,
        rightLeftRightWind: memoryChoice ? memoryChoice.windLeftRight : 0,
        timingOffSwitch: 0, // 定时关机是否开启，0-关闭，1-开启
        timingOnSwitch: 0,
        timingOffHour: 0,
        timingIsValid: 0, // 定时时间-小时
        timingOffMinute: 0,
        elecHeat: (memoryMode === 1 ? 1 : 0) || (memoryMode === 4 ? 1 : 0), // 制热、自动打开电辅热
        cosySleepMode: 0, //开关机将睡眠曲线关闭
        btnSound: burzzer ? 1 : 0
      };

      luaAttrs = {
        power: "on",
        temperature: _is,
        small_temperature: _is5,
        mode: modeOptions[memoryMode - 1],
        wind_swing_lr: memoryChoice ? (memoryChoice.windLeftRight ? "on" : "off") : "off",
        wind_swing_lr_under: memoryChoice ? (memoryChoice.windLeftRight ? "on" : "off") : "off",
        wind_swing_ud: memoryChoice ? (memoryChoice.windUpDown ? "on" : "off") : "off",
        wind_speed: memoryChoice ? (memoryChoice.windSpeed > 102 ? 102 : memoryChoice.windSpeed) : 102,
        ptc: (memoryMode === 1 || memoryMode === 4) ? "on":"off",
        ptc_force: (memoryMode === 1 || memoryMode === 4) ? "on":"off",
        buzzer: burzzer ? "on" : "off"
      }
    } else { // 关机时 total_status_switch 发 0
      attrs[CMD.THPOWER] = [0]; // 
      luaAttrs = {
          total_status_switch: "0",
          buzzer: burzzer ? "on" : "off"
      }
    }     

    this.writeData({
      hex: isOn ? this.AcProcess.makeStandardProtocolPackage(attrs) : this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    }, true, '加载中...');

    let burialParam = {
      page_name: "遥控面板",
      object: "电源开关",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: "{\"temperature\":\"" + acstatus.tempSet + "°C\",\"speed\":\"" + acstatus.windSpeed + "\"}",
      order_status: 1
    };

    this.sendBurial(burialParam);
    this.delayQueryNewAndOld();
  }

  /*温度控制*/
  controlTemp(value, acstatus, callback, page_path) {
    //todo mutex in view    
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      tempSet: value,
      tempSet2: value,
      cosySleepMode: 0, //调温将睡眠曲线关闭
      btnSound: burzzer ? 1 : 0
    };

    let _is = parseInt(value) > 30 ? 30 : parseInt(value) < 16 ? 16 : parseInt(value);
    let _is5 = ((value - parseInt(value)) * 10) === 0 ? 0 : 0.5;
    let luaAttrs = {
      temperature: _is,
      small_temperature: _is5,
      comfort_sleep: 'off',
      pmv: -3.5,
      buzzer: burzzer ? "on" : "off"
    }
    if(this.isTH) {
      luaAttrs = {
        temperature: _is,
        small_temperature: _is5,        
        buzzer: burzzer ? "on" : "off"
      }
    }
    let hexData = this.returnHexData(attrs);
    this.writeData({
      hex: hexData,
      attr: luaAttrs
    }, true, '', 'TempControl', () => {
      callback && callback();
    });


    let burialParam = {
      page_name: "遥控面板",
      object: "温度",
      ex_value: acstatus.tempSet,
      value: value,
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: value
    }

    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_temperature_change', page_path);
    this.sendBurial(burialParam);
  }

  /*风速控制*/
  controlWindSpeed(windSpeedValue, acstatus, page_path, sleepCurveData) {
    //todo mutex in view
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      windSpeed: windSpeedValue,
      powerSave: 0,
      btnSound: burzzer ? 1 : 0
    };
    console.log('风======', attrs)

    let _value = windSpeedValue > 100 ? 102 : windSpeedValue < 1 ? 1 : windSpeedValue;
    let luaAttrs = {};
    

    if (this.useTH) {
      luaAttrs.wind_speed = _value;
    } else {
      luaAttrs.strong_wind = 'off';
      luaAttrs.wind_speed = _value;
      luaAttrs.power_saving = 'off'      
      let luaSendStr = [...sleepCurveData, sleepCurveData[7], sleepCurveData[7]].join(',')
      luaAttrs.comfort_sleep_curve = luaSendStr    
    }
    luaAttrs.buzzer = burzzer ? "on" : "off"

    if (this.subType == 'MXC1_2_BLE') {
      let thAttrs = {}
      thAttrs[CMD.THWINDSPEED] = [
        _value
      ]
      this.writeData({
        hex: this.AcProcess.makeNewProtocolPackage(thAttrs, burzzer),
        attr: luaAttrs
      }, true, '加载中...');
    } else {
      this.writeData({
        hex: this.returnHexData(attrs),
        attr: luaAttrs
      }, true, '加载中...');
    }
    

    let burialParam = {
      page_name: "遥控面板",
      object: "风速",
      ex_value: acstatus.windSpeed,
      value: windSpeedValue,
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: windSpeedValue,
    }

    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_wind_speed', page_path);
    console.log('burialParam========**********:', burialParam)
    this.sendBurial(burialParam);    
  }

  /*模式控制*/
  controlModeToggle(modeIndex, acstatus, widget_id, page_path) {
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
    // '自动', '制冷', '制热', '送风', '抽湿'];
    // let modeIndex = this.AcProcess.parser.acceptingState.mode + 1;
    if (acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none'
      })
      return;
    }
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      mode: modeIndex,
      elecHeat: (modeIndex === 1 ? 1 : 0) || (modeIndex === 4 ? 1 : 0), // 制热、自动打开电辅热
      windSpeed: 102,
      cosySleepMode: 0, //省电关睡眠曲线
      powerSave: 0,      
      btnSound: burzzer ? 1 : 0,      
    };

    let modeOptions = ["auto", "cool", "dry", "heat", "fan"]
    let modeOptionsMap = {"auto":"自动", "cool":"制冷", "dry":"抽湿", "heat":"制热", "fan":"送风"}
    let luaAttrs = {
      mode: modeOptions[modeIndex - 1],
      ptc: modeOptions[modeIndex - 1] == "heat" || modeOptions[modeIndex - 1] == "auto" ? "on" : "off",
      wind_speed: 102,
      power_saving: "off",
      comfort_power_save: 'off',
      comfort_sleep: "off",
      buzzer: burzzer ? "on" : "off"
    }

    let hex = this.AcProcess.makeStandardProtocolPackage(attrs);
    if(this.isTH) {       

      let thAttrs = {}
      thAttrs[CMD.TH_MODE] = [
        modeIndex,
      ]

      hex = this.AcProcess.makeNewProtocolPackage(thAttrs, burzzer);

      // attrs = {
      //   mode: modeIndex,
      //   // elecHeat: (modeIndex === 1 ? 1 : 0) || (modeIndex === 4 ? 1 : 0), // 制热、自动打开电辅热        
      //   // cosySleepMode: 0, //省电关睡眠曲线
      //   // powerSave: 0,      
      //   btnSound: burzzer ? 1 : 0,      
      // };  
         
      luaAttrs = {
        mode: modeOptions[modeIndex - 1],
        // ptc: modeOptions[modeIndex - 1] == "heat" || modeOptions[modeIndex - 1] == "auto" ? "on" : "off",        
        // power_saving: "off",
        // comfort_power_save: 'off',        
        buzzer: burzzer ? "on" : "off"
      }
      console.log("th转模式",luaAttrs);
      this.writeData({
        hex: hex,
        attr: luaAttrs
      },true, '控制中...', 'controlModeToggle', ()=>{
        this.selfShowToast(`已切换为${modeOptionsMap[modeOptions[modeIndex - 1]]}模式`);
      });
    } else {
      this.writeData({
        hex: hex,
        attr: luaAttrs
      },true, '控制中...', 'controlModeToggle', ()=>{
        this.selfShowToast(`已切换为${modeOptionsMap[modeOptions[modeIndex - 1]]}模式`);
      });
    }
    

    let burialParam = {
      page_name: "遥控面板",
      object: "模式",
      ex_value: modeArray[acstatus.mode - 1],
      value: modeArray[modeIndex - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: '开启'
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path, 1);
    this.sendBurial(burialParam);
    this.delayQueryNewAndOld();
  }



  /*新协议带新风模式控制*/
  newControlModeToggle(modeIndex, run, acstatus, widget_id, page_path) {
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风         
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {};
    let power = 1;
    if (modeIndex == acstatus.mode) {
      power = acstatus.runStatus == 1 ? 0 : 1; ///
    } else if (modeIndex != acstatus.mode) {
      power = 1;
    }

    // let power = (modeIndex == acstatus.mode && acstatus.runStatus == 1) ? 0 : 1
    attrs[CMD.NEWMODE] = [
      power,
      modeIndex,
      acstatus.tempSet * 2,
      102,

    ];
    let modeOptions = ["auto", "cool", "dry", "heat", "fan"]
    let luaAttrs = {
      new_mode_power: power,
      new_mode: modeOptions[modeIndex - 1],
      new_wind_speed: 102,
      new_temperature: acstatus.tempSet,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    }, true, '', 'newControlModeToggle', () => {
      this._queryStatus(false);
    });


    let burialParam = {
      page_name: "遥控面板",
      object: "模式",
      ex_value: modeArray[acstatus.mode - 1],
      value: modeArray[modeIndex - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: power == 1 ? '开启' : '关闭'
    }

    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path, 1);

    this.sendBurial(burialParam);
  }


  /*上下摆风*/
  switchUpDownSwipe(isOn, acstatus, widget_id, page_path, sleepCurveData, isKitchen) {
    if (acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none'
      })
      return;
    }
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      leftUpDownWind: isOn ? 1 : 0,
      rightUpDownWind: isOn ? 1 : 0,
      // swingWindButton: 2,
      btnSound: burzzer ? 1 : 0,
    };
    if (isKitchen) {
      attrs.swingWindButton = 2
      wx.setStorageSync('swingWindButton', '1')
    }

    console.log('发送的参数==', attrs)

    let luaAttrs = {
      wind_swing_ud: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }
    if (isKitchen) {
      luaAttrs.wind_swing_param = 1
      luaAttrs.swing_ud_button = 1
    }

    if(this.subType == 'T5_72_BLE') {
      luaAttrs = {
        wind_swing_ud: isOn ? "on" : "off",
        wind_swing_ud_right: isOn ? "on" : "off",
        buzzer: burzzer ? "on" : "off"
      }
    }
    if (sleepCurveData && !this.isTH) {
      let luaSendStr = [...sleepCurveData, sleepCurveData[7], sleepCurveData[7]].join(',')
      luaAttrs.comfort_sleep_curve = luaSendStr
    }
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });


    let burialParam = {
      page_name: "遥控面板",
      object: "上下风",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: isOn ? '开启' : '关闭'
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam);    
    // this.delayQuery();   
    this.delayQueryNewAndOld();  
  }

  /*左右摆风*/
  switchLeftRightSwipe(isOn, acstatus, widget_id, page_path, sleepCurveData, isKitchen) {
    console.log(isOn, acstatus, widget_id, page_path, sleepCurveData, isKitchen,">>>>>>>>>>>>>>>");
    if (acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none'
      })
      return;
    }
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      leftLeftRightWind: isOn ? 1 : 0,
      rightLeftRightWind: isOn ? 1 : 0,
      downWind: isOn ? 1: 0,
      // swingWindButton: 1,
      btnSound: burzzer ? 1 : 0,
    };

    if (isKitchen) {
      attrs.swingWindButton = 1
      wx.setStorageSync('swingWindButton', '1')
    }

    console.log('发送的参数==', attrs)    

    let luaAttrs = {
      wind_swing_lr: isOn ? "on" : "off",
      wind_swing_lr_under: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }
    if (isKitchen) {
      luaAttrs.swing_lr_button = 1
    }

    if(this.subType == 'T5_72_BLE') {
      luaAttrs = {
        wind_swing_lr: isOn ? "on" : "off",
        wind_swing_lr_right: isOn ? "on" : "off",
        buzzer: burzzer ? "on" : "off"
      }
    }
    if (sleepCurveData && !this.isTH) {
      let luaSendStr = [...sleepCurveData, sleepCurveData[7], sleepCurveData[7]].join(',')
      luaAttrs.comfort_sleep_curve = luaSendStr
    }
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });

    let burialParam = {
      page_name: "遥控面板",
      object: "左右风",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: isOn ? '开启' : '关闭'
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)

    this.sendBurial(burialParam);    
    // this.delayQuery();
    this.delayQueryNewAndOld();  
  }

  /*上左右单独控制摆风*/
  switchUpLeftRightSwipe(isOn, acstatus, widget_id, page_path) {
    if (acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none'
      })
      return;
    }
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      leftLeftRightWind: isOn ? 1 : 0,
      rightLeftRightWind: isOn ? 1 : 0,
      btnSound: burzzer ? 1 : 0
    };

    let luaAttrs = {
      wind_swing_lr: isOn ? "on" : "off",      
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });

    let burialParam = {
      page_name: "遥控面板",
      object: "上左右风",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: isOn ? '开启' : '关闭'
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)

    this.sendBurial(burialParam);
    this.delayQuery()
  }

  /**
   * 0x00AE 属性的下摆风
   * @param {*} isOn 
   * @param {*} acstatus 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  switchDownLeftRightSwipe_00ae(isOn, acstatus, widget_id, page_path) {
    if (acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none'
      })
      return;
    }
    let burzzer = wx.getStorageSync('Sound')
    // let attrs = {    
    //   downSwipeWindFunc: 1,  
    //   downWind:isOn ? 1 : 0,
    //   btnSound: burzzer ? 1 : 0
    // };

    let attrs = {}
    attrs[CMD.DOWNLEFTRIGHTWIND] = [
      isOn ? 1 : 0
    ]

    let luaAttrs = {
      wind_swing_lr_under: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });

    let burialParam = {
      page_name: "遥控面板",
      object: "下左右风",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: isOn ? '开启' : '关闭'
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)

    this.sendBurial(burialParam);
  }
  /*下左右单独控制摆风*/
  switchDownLeftRightSwipe(isOn, acstatus, widget_id, page_path) {
    if (acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none'
      })
      return;
    }
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {    
      downSwipeWindFunc: 1,  
      downWind:isOn ? 1 : 0,
      btnSound: burzzer ? 1 : 0
    };

    let luaAttrs = {
      wind_swing_lr_under: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });

    let burialParam = {
      page_name: "遥控面板",
      object: "下左右风",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: isOn ? '开启' : '关闭'
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)

    this.sendBurial(burialParam);
  }

  /**
   * 左左右风 右左右风的控制, 左右风道
   */
  leftRightSwipeLrSwitch(left,right,direction,acstatus) {
    if (acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none'
      })
      return;
    }
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {};
    let luaAttrs = {};

    if (direction == "left") {
      attrs[CMD.WINDSWINGLRLEFT] = [
        left ? 1 : 0
      ]
      luaAttrs = {
        wind_swing_lr_left: left ? "on" : "off",        
        buzzer: burzzer ? "on" : "off"
      }
    } else if(direction == 'right'){
      attrs[CMD.WINDSWINGLRRIGHT] = [
        right ? 1 : 0
      ]  
      luaAttrs = {        
        wind_swing_lr_right: right ? "on" : "off",
        buzzer: burzzer ? "on" : "off"
      }
    } else { // 两边同时控制
      attrs[CMD.WINDSWINGLRLEFT] = [
        left ? 1 : 0
      ]
      attrs[CMD.WINDSWINGLRRIGHT] = [
        right ? 1 : 0
      ] 
      luaAttrs = {    
        wind_swing_lr_left: left ? "on" : "off",    
        wind_swing_lr_right: right ? "on" : "off",
        buzzer: burzzer ? "on" : "off"
      }
    }
    
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });   
  }

  /**
   * 左右风道，上下风控制
   */
  leftRightUpDownSwipeLrSwitch(left,right,acstatus) {
    if (acstatus.runStatus == 0) {
      wx.showToast({
        title: '空调已关，请先开空调',
        icon: 'none'
      })
      return;
    }
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {};

    attrs[CMD.WINDSWINGUDLEFT] = [
      left ? 1 : 0
    ]

    attrs[CMD.WINDSWINGUDRIGHT] = [
      right ? 1 : 0
    ]

    let luaAttrs = {
      wind_swing_ud_left: left ? "on" : "off",
      wind_swing_ud_right: right ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });   
  }

  /**省电、睡眠 */
  powerSave(isOn, widget_id, page_path) {
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      powerSave: isOn ? 1 : 0,
      CSEco: 0,
      ecoFunc: 0,
      windSpeed: 102,
      cosySleepMode: 0, //省电关睡眠曲线
      btnSound: burzzer ? 1 : 0
    };

    let luaAttrs = {
      power_saving: isOn ? "on" : "off",
      comfort_power_save: 'off',
      wind_speed: 102,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs),
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQuery();
  }
  /*ECO控制*/
  switchECO(isOn, acstatus, widget_id, page_path) {
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      ecoFunc: isOn ? 1 : 0,
      powerSave: 0,
      CSEco: 0,
      cosySleepMode: 0, //ECO关睡眠曲线
      btnSound: burzzer ? 1 : 0
    };    
    this.AcProcess.parser.newsendingState.superCoolingSw = 0
    this.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0

    let paramsF = {};
    if(this.isTH) {
      if (isOn) {
        paramsF.eco = 'on';
        // paramsF.comfort_power_save = 'off';
        // paramsF.pmv = -3.5;
        // paramsF.natural_wind = 'off';
        // paramsF.temperature = 26;
        // paramsF.small_temperature = 0;
        // paramsF.wind_speed = 102;
      } else {
        paramsF.eco = 'off';
      }
    } else {
      if (isOn) {
        paramsF.eco = 'on';
        paramsF.comfort_power_save = 'off';
        paramsF.pmv = -3.5;
        paramsF.natural_wind = 'off';
        paramsF.temperature = 26;
        paramsF.small_temperature = 0;
        paramsF.wind_speed = 102;
        paramsF.comfort_sleep = 'off';
      } else {
        paramsF.eco = 'off';
      }
    }
    
    paramsF.buzzer = burzzer ? "on" : "off";
    console.log("ECO param", paramsF);

    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: paramsF
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(attrs)
    }
    
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam);    
    this.delayQueryNewAndOld();    
  }

  /*干燥*/
  switchDry(isOn) {
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      diyFunc: isOn ? 1 : 0,
      btnSound: burzzer ? 1 : 0,
      buzzer: burzzer ? "on" : "off"
    };

    let luaAttrs = {
      dry: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }

    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });
    // this.delayQuery();
  }

  /**电辅热 */
  switchElecHeat(isOn, widget_id, page_path, sleepCurveData) {
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      elecHeat: isOn ? 1 : 0,
      elecHeatForced: 1,
      btnSound: burzzer ? 1 : 0
    };
    let _ptc = isOn ? "on" : "off";
    let luaAttrs = {
      ptc: _ptc,
      ptc_force: "on",
      buzzer: burzzer ? "on" : "off"
    };
    if (sleepCurveData) {
      let luaSendStr = [...sleepCurveData, sleepCurveData[7], sleepCurveData[7]].join(',')
      luaAttrs.comfort_sleep_curve = luaSendStr
    }
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(attrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
  }

  /**定时关机 打开*/
  timingOffSwitch(time, sleepCurveData, page_path) {
    let burzzer = wx.getStorageSync('Sound')
    // 定时关机信息
    // timingOffSwitch: "",   // 定时关机是否开启，0-关闭，1-开启
    // timingOffHour: "",     // 定时时间-小时
    // timingOffMinute: "",   // 定时时间-分钟
    
    let attrs = {
      timingOffSwitch: 1, // 定时关机是否开启，0-关闭，1-开启
      timingOnSwitch: 0,
      // timingOffHour: parseFloat(time), 
      timingIsValid: 1, // 定时时间-小时
      timingOffMinute: time * 60,
      btnSound: burzzer ? 1 : 0
    }    

    let luaAttrs = {
      power_off_time_value: time * 60,
      power_off_timer: "on",
      buzzer: burzzer ? "on" : "off"
    }
    if (sleepCurveData) {
      let luaSendStr = [...sleepCurveData, sleepCurveData[7], sleepCurveData[7]].join(',')
      luaAttrs.comfort_sleep_curve = luaSendStr
    }
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    },true, '控制中...', 'TimerOn', ()=>{
      this.selfShowToast('已设置定时关机');
    });
    let burialParam = {
      object_name: `${time}小时`,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_appointment_shutdown', page_path || '')
    this.sendBurial(burialParam)

    this.delayQueryNewAndOld();
  }

   /**定时开机 打开*/
   timingOnSwitch(time, sleepCurveData, page_path) {
    let burzzer = wx.getStorageSync('Sound')
    // 定时关机信息
    // timingOffSwitch: "",   // 定时关机是否开启，0-关闭，1-开启
    // timingOffHour: "",     // 定时时间-小时
    // timingOffMinute: "",   // 定时时间-分钟
    
    let attrs = {
      timingOffSwitch: 0, // 定时关机是否开启，0-关闭，1-开启
      timingOnSwitch: 1,
      // timingOffHour: parseFloat(time), 
      timingIsValid: 1, // 定时时间-小时
      timingOnMinute: time * 60,
      btnSound: burzzer ? 1 : 0
    }    

    let luaAttrs = {
      power_on_time_value: time * 60,
      power_on_timer: "on",
      buzzer: burzzer ? "on" : "off"
    }
    if (sleepCurveData) {
      let luaSendStr = [...sleepCurveData, sleepCurveData[7], sleepCurveData[7]].join(',')
      luaAttrs.comfort_sleep_curve = luaSendStr
    }
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    },true, '控制中...', 'TimerOn', ()=>{
      this.selfShowToast('已设置定时开机');
    });
    let burialParam = {
      object_name: `${time}小时`,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_appointment_switchon', page_path || '')
    this.sendBurial(burialParam)

    this.delayQueryNewAndOld();
  }

  /**关闭定时 */
  cancelTimingOff(page_path, sleepCurveData) {
    console.log('time-off', page_path, sleepCurveData)
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      timingOffSwitch: 0, // 定时关机是否开启，0-关闭，1-开启
      timingOnSwitch: 0,
      timingIsValid: 1, // 定时总开关：为1时才能正常开关定时
      timingOffMinute: 0,
      timingOffHour: 0,
      timingOnMinute: 0,
      timingOnHour:0,
      btnSound: burzzer ? 1 : 0
    }    

    let luaAttrs = {
      power_off_time_value: 0,
      power_off_timer: "off",
      power_on_time_value: 0,
      power_on_timer: "off",
      buzzer: burzzer ? "on" : "off"
    }
    if (sleepCurveData) {
      let luaSendStr = [...sleepCurveData, sleepCurveData[7], sleepCurveData[7]].join(',')
      luaAttrs.comfort_sleep_curve = luaSendStr
    }

    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    },true, '控制中...', 'TimerOnOffSwitchOff', ()=>{
      this.selfShowToast('已取消定时');
    });

    let burialParam = {
      object_name: '取消定时',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_appointment_shutdown', page_path || '')
    this.sendBurial(burialParam);

    this.delayQueryNewAndOld();
  }


  /** 起热点命令*/
  setWifi() {
    this.bluetoothConn.sendBizMsg({
      type: 0x64,
      body: new Uint8Array([0x00]),
      success: () => {
        console.log('起热点指令发送成功');
      }
    })
  }

  /**屏显 */
  showSwitch(isOn, widget_id, page_path) {    
    let burzzer = wx.getStorageSync('Sound')
    let randomArr = this.getTwoDistinctNumbers();
    let arr = [0xaa, 0x23, 0xac, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x41, 0xc1, 0x00, 0xff, 0x02, 0xff, 0x02, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0e, 0x34, 0xe6];
    
    let pointer = 10;
    arr[pointer + 23] = randomArr[0];
    arr[pointer + 24] = this.AcProcess.parser.crc8_854(arr.slice(10,34), 24)
    arr[pointer + 25] = this.AcProcess.parser.makeSum(arr.slice(1),34)


    // [0x41, 0xc1, 0x00, 0xff, 0x02, 0xff, 0x02, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0e, 0x34, 0xe6]

    let arr2 = [0xaa, 0x17, 0xac, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x41, 0x61, 0x00, 0xff, 0x02, 0xff, 0x02, 0x02, 0x00, 0x00, 0x00, randomArr[1]];

    // [0x41, 0x61, 0x00, 0xff, 0x02, 0xff, 0x02, 0x02, 0x00, 0x00, 0x00, 0x0f, 0x24, 0x61]

    // arr2[pointer + 21] = randomArr[1];
    arr2[pointer + 12] = this.AcProcess.parser.crc8_854(arr2.slice(10,22), 12)
    arr2[pointer + 13] = this.AcProcess.parser.makeSum(arr2.slice(1),22)

    console.log(arr, "arr2, 关闭屏显指令", arr2)

    let arrOffSound = [0xaa, 0x23, 0xac, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x41, 0x81, 0x00, 0xff, 0x02, 0xff, 0x02, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x49, 0x1e, 0x01];
    // let arrOffSound2 = [];


    let luaAttrs = {
      screen_display: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }

    if(this.isTH) {
      luaAttrs = {
        screen_display: isOn ? "100" : "0",
        buzzer: burzzer ? "on" : "off"
      }
    }

    if (burzzer) {
      this.writeData({
        hex: isOn ? arr : arr2,
        attr: luaAttrs
      });
    } else {
      this.writeData({
        hex: arrOffSound,
        attr: luaAttrs
      });
    }
    
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
  }

  /**舒省开关 */
  CSEcoSwitch(isOn,pagePath) {
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      CSEco: isOn ? 1 : 0,
      powerSave: 0,
      ecoFunc: 0,
      btnSound: burzzer ? 1 : 0
    };
    
    this.AcProcess.parser.newsendingState.superCoolingSw = 0
    let luaAttrs = {
      comfort_power_save: isOn ? "on" : "off",
      eco: "off",
      power_saving: "off",
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, "click_cseco", pagePath)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }
  /**请求设备sn */
  querySN() {
    this.bluetoothConn.sendBizMsg({
      type: 0x07,
      body: new Uint8Array([0]),
      success: () => {
        console.log('发获取sn指令成功');
      }
    })
  }

  /** 发ssid和密码*/
  bindDeviceTest(hex, page_path) {    
    var enDataBuf = Common.fromHexString(hex);
    this.bluetoothConn.sendBizMsg({
      type: 0x69,
      body: enDataBuf,
      success: () => {
        console.log('起热点指令发送成功');
      }
    })
  }

  /**
   * 电控睡眠曲线开关
   * @param {*} isOn 
   */
  sleepCurveSwitch(tempSet, sleepCurve, sleepCurveData, isOn, widget_id, page_path, callback) {
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      cosySleepMode: isOn ? 3 : 0,
      firstHourTemp: sleepCurveData[0], // 第一小时舒睡温度(17.0-30.0℃)
      secondHourTemp: sleepCurveData[1], // 第二小时舒睡温度
      thirdHourTemp: sleepCurveData[2], // 第三小时舒睡温度
      fourthHourTemp: sleepCurveData[3], // 第四小时舒睡温度
      fifthHourTemp: sleepCurveData[4], // 第五小时舒睡温度
      sixthHourTemp: sleepCurveData[5], // 第六小时舒睡温度
      seventhHourTemp: sleepCurveData[6], // 第七小时舒睡温度
      eighthHourTemp: sleepCurveData[7], // 第八小时舒睡温度
      ninethHourTemp: sleepCurveData[7], // 第九小时舒睡温度
      tenthHourTemp: sleepCurveData[7], // 第十小时舒睡温度
      ComfortSleepTime: 10,
      CSEco: 0,
      ecoFunc: 0,
      windSpeed: 102,
      powerSave: 0,
      btnSound: burzzer ? 1 : 0,
      tempSet2: tempSet,
      tempSet: tempSet
    };
    let luaSendArr = [sleepCurveData[0], sleepCurveData[1], sleepCurveData[2], sleepCurveData[3], sleepCurveData[4], sleepCurveData[5], sleepCurveData[6], sleepCurveData[7], sleepCurveData[7], sleepCurveData[7]]
    let luaSendStr = luaSendArr.toString();
    console.log("sleepCurveSwitch、sleepCurveSwitch、sleepCurveSwitch ble", JSON.stringify(attrs));


    let _is = parseInt(tempSet) > 30 ? 30 : parseInt(tempSet) < 16 ? 16 : parseInt(tempSet);
    let _is5 = ((tempSet - parseInt(tempSet)) * 10) === 0 ? 0 : 0.5;
    let luaAttrs = {
      comfort_sleep: isOn ? "on" : "off",
      comfort_sleep_curve: luaSendStr,
      power_saving: "off",
      eco: 'off',
      comfort_power_save: 'off',
      wind_speed: 102,
      buzzer: burzzer ? "on" : "off",
      temperature: _is,
      small_temperature: 0,
    }
    console.log("sleepCurveSwitch、sleepCurveSwitch、sleepCurveSwitch", JSON.stringify(luaAttrs));
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs),
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
  }

  //净化

  //

  /*****************旧协议*****end***************/


  /*****************新协议********************/
  /**智清洁 */
  selfCleaningSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.CONTROLSELFCLEANING] = isOn ? [1] : [0];
    // attrs[CMD.CONTROLNEWVERBEEP] = 1;
    console.log(attrs);

    let _self_clean = isOn ? "on" : "off";
    let luaAttrs = {
      self_clean: _self_clean,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', 'SelfCleaning', ()=>{
      this.selfShowToast(isOn ? '已开启智清洁' : '已关闭智清洁');
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }

  /**智控温 */
  smartCooling(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    // attrs[CMD.SoundNew] = burzzer ? [1]:[0]; // 蜂鸣器位置
    attrs[CMD.Supercooling] = isOn ? [1] : [0];
    attrs[CMD.NONDIRECTWIND] = [1];
    attrs[CMD.FAWINDFEEL] = [1];
    let luaAttrs = {
      prevent_super_cool: isOn ? "on" : "off",
      prevent_straight_wind: 'off',
      buzzer: burzzer ? "on" : "off"
    }

    // this.AcProcess.parser.newsendingState.faWindFeel = 1;
    // 智控温和eco、舒省、省电互斥
    this.AcProcess.parser.sendingState.ecoFunc = 0
    this.AcProcess.parser.sendingState.CSEco = 0
    this.AcProcess.parser.sendingState.powerSave = 0
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    // this.powerSave(false);
    // this.switchECO(false);
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam);   
    this.delayQueryNewAndOld();
  }

  /**防直吹*/
  noWindBlowingSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.NONDIRECTWIND] = isOn ? [2] : [1];
    attrs[CMD.Supercooling] = [0];
    console.log(attrs);

    let luaAttrs = {
      prevent_straight_wind: isOn ? 2 : 1,
      prevent_super_cool: "off",
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.delayQueryNewAndOld();
    this.sendBurial(burialParam)
  }

  /**FA防直吹*/
  FaNoWindBlowingSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.FAWINDFEEL] = isOn ? [2] : [1];
    console.log(attrs);

    let luaAttrs = {
      prevent_straight_wind: isOn ? 2 : 1,
      prevent_super_cool: "off",
      buzzer: burzzer ? "on" : "off"
    };

    this.AcProcess.parser.newsendingState.automaticAntiColdAir = 0;  // 主动防冷风假关

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }

  /**
   * 左右摆风角度
   * @param {}} isOn 摆风角度
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  windSwingLrAngle(angle, widget_id, page_path, acstatus) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    let _angle = parseInt(angle);
    attrs[CMD.LEFTRIGHTANGLE] = [_angle];
    console.log(attrs);

    let luaAttrs = {
      wind_swing_lr_angle: angle,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', 'windSwingLrAngle', ()=>{
      this.selfShowToast('已调整左右风向');
    });

    let burialParam = {
      ext_info: acstatus.leftRightAngle,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();  
  }

   /**
   * 左风道左右摆风角度
   * @param {}} isOn 摆风角度
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  leftWindSwingLrAngle(angle, widget_id, page_path, acstatus) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    let _angle = parseInt(angle);
    attrs[CMD.LEFTLRWINDANGLE] = [_angle];
    console.log(attrs);

    let luaAttrs = {
      left_lr_wind_angle: angle,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', 'windSwingLrAngle', ()=>{
      this.selfShowToast('已调整左右风向');
    });

    let burialParam = {
      ext_info: acstatus.leftRightAngle,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();  
  }


  /**
   * 右风道左右摆风角度
   * @param {}} isOn 摆风角度
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  rightWindSwingLrAngle(angle, widget_id, page_path, acstatus) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    let _angle = parseInt(angle);
    attrs[CMD.RIGHTLRWINDANGLE] = [_angle];
    console.log(attrs);

    let luaAttrs = {
      right_lr_wind_angle: angle,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', 'windSwingLrAngle', ()=>{
      this.selfShowToast('已调整左右风向');
    });

    let burialParam = {
      ext_info: acstatus.leftRightAngle,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();  
  }

  /**
   * 下左右摆风角度
   * @param {}} isOn 摆风角度
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  downWindSwingLrAngle(angle, widget_id, page_path, acstatus) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    let _angle = parseInt(angle);
    attrs[CMD.DOWNLEFTRIGHTANGLE] = [_angle];
    console.log(attrs);

    let luaAttrs = {
      swing_lr_under_angle: angle,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    }, true, '控制中...', 'windSwingLrAngle', ()=>{
      this.selfShowToast('已调整左右风向');
    });


    let burialParam = {
      ext_info: acstatus.leftRightAngle,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();  
  }

  /**
   * 上下摆风角度
   * @param {}} angle 摆风角度
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  windSwingUdAngle(angle, widget_id, page_path, acstatus) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    let _angle = parseInt(angle);
    attrs[CMD.UPDOWNANGLE] = [_angle];
    console.log(attrs);

    let luaAttrs = {
      wind_swing_ud_angle: angle,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', 'windSwingLrAngle', ()=>{
      this.selfShowToast('已调整上下风向');
    });
    let burialParam = {
      ext_info: acstatus.upDownAngle ? acstatus.upDownAngle : 0,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();  
  }

  /**上下环绕风*/
  aroundWindSwitch(isOn, aroundDirect,widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')    
    attrs[CMD.UDAROUNDWIND] = [
      isOn ? 1 : 0,
      aroundDirect
    ];
    console.log(attrs);

    let luaAttrs = {
      wind_around: isOn ? "on" : "off",
      wind_around_ud: aroundDirect,
      buzzer: burzzer ? "on" : "off"
    };

    console.log(luaAttrs,'luaAttrs')

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)

    this.delayQueryNewAndOld();
  }

  /**
   * 语音功能开关方法
   * @param {语音功能开关} isOn 
   */
  voiceFuncSwitch(isOn, widget_id, page_path) {
    // REQUESTINITCOLDEHOTSTATUS
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.REQUESTINITCOLDEHOTSTATUS] = isOn ? [3] : [0];
    // console.log(attrs);

    let luaAttrs = {
      voice_control_new: isOn ? 3 : 0,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
  }

  /**
   * 新风开关方法
   * @param {新风开关} isOn 
   */
  freshAirSwitch(isOn, fanSpeed, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.FRESHAIR] = [
      isOn ? 1 : 0,
      fanSpeed,
      255
    ];
    console.log(attrs);
    let luaAttrs = {    
      fresh_air: isOn ? "on" : "off",
      fresh_air_fan_speed: fanSpeed,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', 'TimerOnOffSwitchOff', ()=>{
     
      if(this.useTHFreshAir) {
        this.selfShowToast(isOn ? `已开启新风${freshAirFanSpeedTH[fanSpeed+'']}` : '已关闭新风');
      } else {
        this.selfShowToast(isOn ? `已开启新风${freshAirFanSpeed[fanSpeed+'']}` : '已关闭新风');
      }
      
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
  }


  /**
   * 新风扩孔开关方法
   * @param {新风开关} isOn 
   */
  strongFreshAirSwitch(isOn) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.STRONGFRESHAIR] = [
      isOn ? 1 : 0,
    ];
    console.log(attrs);
    let luaAttrs = {
      // 待补充新风扩孔的lua
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
  }

  /**
   * 无风感
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  noWindFeelSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.CONTROLSWITCHNOWINDFEEL] = isOn ? [1] : [0];
    
    let luaAttrs = {
      no_wind_sense: isOn ? 1 : 0,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', 'NoWindFeel', ()=>{
      this.selfShowToast(isOn ? '已开启无风感' : '已关闭无风感');
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }


  /**
   * FA无风感
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  FaNoWindFeelSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.FAWINDFEEL] = isOn ? [4] : [1];
    
    let luaAttrs = {
      no_wind_sense: isOn ? 1 : 0,
      buzzer: burzzer ? "on" : "off"
    };
    this.AcProcess.parser.newsendingState.automaticAntiColdAir = 0;  // 主动防冷风假关
    this.AcProcess.parser.newsendingState.superCoolingSw = 0;
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }

  /**
   * FA柔风感
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  softWindFeel(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.FAWINDFEEL] = isOn ? [3] : [1];
    console.log('柔风感',attrs);
    let luaAttrs = {
      gentle_wind_sense: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    };
    this.AcProcess.parser.newsendingState.automaticAntiColdAir = 0;  // 主动防冷风假关
    this.AcProcess.parser.newsendingState.superCoolingSw = 0;
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }

  /**
   * TH柔风感
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  thSoftWindFeelSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.TH_SOFTWIND] = isOn ? [1] : [0];
    console.log('柔风感',attrs);
    let luaAttrs = {
      gentle_wind_sense: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    };
    this.AcProcess.parser.newsendingState.automaticAntiColdAir = 0;  // 主动防冷风假关
    this.AcProcess.parser.newsendingState.superCoolingSw = 0;
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }

  /**
   * 智慧防冷风
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  automaticAntiColdAirSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.AUTOMATICANTICOLDAIR] = isOn ? [1] : [0];
    
    let luaAttrs = {
      auto_prevent_cold_wind: isOn ? "1" : "0",
      buzzer: burzzer ? "on" : "off"
    };

    this.AcProcess.parser.newsendingState.superCoolingSw = 0;    
    this.AcProcess.parser.newsendingState.faWindFeel = 1;
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }


  /**
   * 杀菌
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  degermingSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.DEGERMING] = isOn ? [1] : [0];
    attrs[CMD.CONTROLSELFCLEANING] = [0]; // 除菌会开机，需要把智清洁关闭
    
    let luaAttrs = {
      degerming: isOn ? "on" : "off",
      self_clean: "off",
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', 'degermingSwitch', ()=>{
      this.selfShowToast(isOn ? '已开启除菌' : '已关闭除菌');
    });
    this.delayQueryNewAndOld();
    // let burialParam = {
    //   ext_info: isOn ? '开启' : '关闭',
    //   setting_params: JSON.stringify(luaAttrs)
    // }
    // burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    // this.sendBurial(burialParam)
  }

  /**
   * 
   */
  acDegermingSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.ACDEGERMING] = isOn ? [1] : [0];
    // attrs[CMD.CONTROLSELFCLEANING] = [0]; // 除菌会开机，需要把智清洁关闭
    
    let luaAttrs = {
      air_remove_odor: isOn ? 1 : 0,
      self_clean: "off",
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', 'degermingSwitch', ()=>{
      this.selfShowToast(isOn ? '已开启除菌' : '已关闭除菌');
    });
    this.delayQueryNewAndOld();
  }  


  /**
   * 上无风感打开
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  upNoWindFeelSwitch(isOn, widget_id, page_path, swStatus) {
    console.log('upNoWindFeelSwitch',isOn)
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    let flag = 0;
    if(isOn == 0) { // 上下无风感都关时
      attrs[CMD.CONTROLSWITCHNOWINDFEEL] = [2]; // 开上无风感
      flag = 2
    } else if(isOn == 2) { // 上无风感开时
      attrs[CMD.CONTROLSWITCHNOWINDFEEL] = [0]; // 关无风感
      flag = 0
    } else if(isOn == 3) { // 下无风感开时
      attrs[CMD.CONTROLSWITCHNOWINDFEEL] = [1]; // 开全无风感
      flag = 1
    } else {
      attrs[CMD.CONTROLSWITCHNOWINDFEEL] = [3]; // 关无风感
      flag = 3
    }    
    
    let luaAttrs = {
      no_wind_sense: flag,
      buzzer: burzzer ? "on" : "off"
    };
    if (this.isTH) {
      let _thFlag = !swStatus ? 2 : 1 
      luaAttrs = {
        no_wind_sense_up: _thFlag, // 上无风感原来一个属性的时候是发3，th拆分成了两个key，2 是开 1是关
        buzzer: burzzer ? "on" : "off"
      };
    }

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }

  /**
   * 下无风感打开
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  downNoWindFeelSwitch(isOn, widget_id, page_path, swStatus) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    let flag = 0;
    if(isOn == 0) { // 上下无风感都关时
      attrs[CMD.CONTROLSWITCHNOWINDFEEL] = [3]; // 开下无风感
      flag = 3
    } else if(isOn == 3) { // 下无风感开时
      attrs[CMD.CONTROLSWITCHNOWINDFEEL] = [0]; // 关无风感
      flag = 0
    } else if(isOn == 2) { // 上无风感开时
      attrs[CMD.CONTROLSWITCHNOWINDFEEL] = [1]; // 开全无风感
      flag = 1
    } else {
      attrs[CMD.CONTROLSWITCHNOWINDFEEL] = [2]; // 关无风感
      flag = 2
    }
    // attrs[CMD.CONTROLSWITCHNOWINDFEEL] = isOn ? [2] : [0];
    
    let luaAttrs = {
      no_wind_sense: flag,
      buzzer: burzzer ? "on" : "off"
    };
    if (this.isTH) {
      let _thFlag = !swStatus ? 2 : 1
      luaAttrs = {
        no_wind_sense_down: _thFlag, // 下无风感原来一个属性的时候是发3，th拆分成了两个key，2 是开 1是关
        buzzer: burzzer ? "on" : "off"
      };
    }

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }

  // 柔风感
  softWind(isOn){
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.CONTROLSOFTWINDSTATUS]=isOn?'on':'off'

    let luaAttrs = {
      gentle_wind_sense: isOn?'on':'off',
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    })
  }

  // 主动防冷风
  autoPreventCool(isOn){
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.CONTROLPREVENTCOOL]=isOn?'on':'off'

    let luaAttrs = {
      child_prevent_cold_wind: isOn?'on':'off',
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    })
    this.delayQueryNewAndOld();
  }

  // 儿童防冷风
  childPreventCool(isOn){
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.CONTROL_PREVENT_COOL_WIND]=isOn?'on':'off'

    let luaAttrs = {
      child_prevent_cold_wind: isOn?'on':'off',
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    })
  }

  // 智慧风
  widsomWind(isOn){
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.CONTROLWISDOMWIND]=isOn?'on':'off'

    let luaAttrs = {
      intelligent_wind: isOn?'on':'off',
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    })
  }


  /**
   * 酷省
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  coolPowerSavingSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.COOLPOWERSAVING] = isOn ? [1] : [0];
    
    let luaAttrs = {
      cool_power_saving: isOn ? 1 : 0,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });

    this.delayQueryNewAndOld();
  }


  /**
   * 环游风
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  HY1AroundWindSwitch(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.AROUNDWIND] = isOn ? [1] : [0];
    
    let luaAttrs = {
      jet_cool: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });

    this.delayQueryNewAndOld();
  }

  /**
   * 速冷热
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  switchQuickCoolHeat(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.QUICKCOOLHEAT] = isOn ? [1] : [0];
    
    let luaAttrs = {
      quick_cool_heat: isOn ? "1" : "0",
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });

    this.delayQueryNewAndOld();
  }


  /**
   * 防直吹距离
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  switchUpWindBlowingDistance(isOn,type, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.NONDIRECTWIND] = isOn ? [2] : [1];
    attrs[CMD.NONDIRECTWINDDISTANCE] = [type];
    attrs[CMD.NONDIRECTWINDTYPE] = [2];    
    
    let luaAttrs = {      
      prevent_straight_wind: isOn ? 2 : 1,
      prevent_straight_wind_distance: type,
      prevent_straight_wind_lr: 2, //  防直吹类型 0：左防直吹 1：右防直吹 2：上防直吹 3：下防直吹
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
  }

  /**
   * 新风开关方法
   * @param {新风开关} isOn 
   */
  circleFanSwitch(isOn, gear, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.CIRCLEFAN] = [
      isOn ? 1 : 0,
      gear // 1-5
    ];
    console.log(attrs);
    let luaAttrs = {    
      circle_fan: isOn ? 1 : 0,
      circle_fan_mode: gear,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', 'TimerOnOffSwitchOff', ()=>{
                 
    });    
  }

  /**
   * 电控蜂鸣器开关
   * @param {电控蜂鸣器开关} isOn 
   */
  newSoundSwitch(isOn) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.SOUNDSWITCH] = [
      isOn ? 1 : 0,
    ];
    console.log(attrs);
    let luaAttrs = {
      buzzer_all: isOn ? 1 : 0,
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
  }

  /**
   * 电控蜂鸣器开关
   * @param {电控蜂鸣器开关} isOn 
   */
  newSoundTypeSwitch(type) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.SOUNDTYPE] = [
      type,
    ];
    console.log(attrs);
    let luaAttrs = {
      buzzer_off_status: type,
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
  }

   /**
   * 电控蜂鸣器开关
   * @param {电控蜂鸣器开关} isOn 
   */
  preventColdWindMemorySwitch(isOn) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.PREVENTCOOLWINDMEMORY] = [
      isOn ? 1 : 0,
    ];    
    let luaAttrs = {
      auto_prevent_cold_wind_memory: isOn ? 1 : 0,
      buzzer: isOn ? 1 : 0,
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
  }

  /**************** 酷风业务函数 ******************** */
  /*
   * 经典协议
   * */
  /*开关机*/
  coolFreeSwitchDevice(isOn, modeIndex, memoryChoice, acstatus, callback) {    
    let burzzer = wx.getStorageSync('Sound')
    let memoryMode = acstatus.mode;
    
    // let mode = this.coolFreeModeMap(memoryMode)
    let attrs = {
      runStatus: isOn ? 1 : 0,
      tempSet: memoryChoice ? (memoryChoice.tempSet > acstatus.tempSet ? acstatus.tempSet : memoryChoice.tempSet) : acstatus.tempSet,
      mode: memoryMode,      
      tempSet2: memoryChoice ? (memoryChoice.tempSet > acstatus.tempSet ? acstatus.tempSet : memoryChoice.tempSet) : acstatus.tempSet,
      coolFreeTimingUsable: 0,
      windSpeed: memoryChoice ? (memoryChoice.windSpeed > 102 ? 102 : memoryChoice.windSpeed) : 102,
      btnSound: burzzer ? 1 : 0,
      elecHeatWithT4: 0,
      timingOnValue:0,
      timingOffValue:0,
      elecHeat: (memoryMode === 1 ? 1 : 0) || (memoryMode === 4 ? 1 : 0), // 制热、自动打开电辅热
    };
    console.log('开关机', burzzer, attrs);

    let luaTempSet = memoryChoice ? (memoryChoice.tempSet > acstatus.tempSet ? acstatus.tempSet : memoryChoice.tempSet) : acstatus.tempSet;
    let _is = parseInt(luaTempSet) > 30 ? 30 : parseInt(luaTempSet) < 16 ? 16 : parseInt(luaTempSet);
    let _is5 = ((luaTempSet - parseInt(luaTempSet)) * 10) === 0 ? 0 : 0.5;
    let modeOptions = ["auto", "cool", "dry", "heat", "fan"]

    let luaAttrs = {
      power: isOn ? "on" : "off",
      temperature: _is,
      small_temperature: _is5,
      mode: modeOptions[memoryMode - 1],
      wind_swing_lr: memoryChoice ? (memoryChoice.windLeftRight ? "on" : "off") : "off",
      wind_swing_lr_under: memoryChoice ? (memoryChoice.windLeftRight ? "on" : "off") : "off",
      wind_swing_ud: memoryChoice ? (memoryChoice.windUpDown ? "on" : "off") : "off",
      wind_speed: memoryChoice ? (memoryChoice.windSpeed > 102 ? 102 : memoryChoice.windSpeed) : 102,
      ptc: (memoryMode === 1 || memoryMode === 4) ? "on":"off",
      ptc_force: (memoryMode === 1 || memoryMode === 4) ? "on":"off",
      buzzer: burzzer ? "on" : "off"
    }
    // let showLoading = 
    this.writeData({
      hex: this.AcProcess.makeCoolFreeStandardProtocolPackage(attrs),
      attr: luaAttrs
    }, true, '加载中...');


    let burialParam = {
      page_name: "遥控面板",
      object: "电源开关",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: "{\"temperature\":\"" + acstatus.tempSet + "°C\",\"speed\":\"" + acstatus.windSpeed + "\"}",
      order_status: 1
    };

    this.sendBurial(burialParam);
  }
  /**
   * 酷风ECO
   * @param {*} isOn 
   * @param {*} acstatus 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  switchCoolFreeECO(isOn, acstatus, widget_id, page_path) {
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      ecoFunc: isOn ? 1 : 0,
      temperature: 26,
      small_temperature: 0,    
      btnSound: burzzer ? 1 : 0
    };
    console.log(attrs, "switcheco");
    this.AcProcess.parser.newsendingState.superCoolingSw = 0
    this.AcProcess.parser.newsendingState.controlSwitchNoWindFeel = 0

    let paramsF = {};
    if (isOn) {
      paramsF.eco = '1';      
      paramsF.temperature = 26;
      paramsF.small_temperature = 0;
      paramsF.wind_speed = 102;     
    } else {
      paramsF.eco = '0';
    }
    paramsF.buzzer = burzzer ? "on" : "off";

    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: paramsF
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(attrs)
    }
    console.log('burial', widget_id)
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam);
    this.delayQueryNewAndOld();
  }
  /**酷风智控温 */
  coolFreeSmartCooling(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    // attrs[CMD.SoundNew] = burzzer ? [1]:[0]; // 蜂鸣器位置
    attrs[CMD.Supercooling] = isOn ? [1] : [0];
    attrs[CMD.NONDIRECTWIND] = [1];
    attrs[CMD.FAWINDFEEL] = [1];
    let luaAttrs = {
      prevent_super_cool: isOn ? "1" : "0",      
      buzzer: burzzer ? "on" : "off"
    }

    // this.AcProcess.parser.newsendingState.faWindFeel = 1;
    // 智控温和eco、舒省、省电互斥
    this.AcProcess.parser.sendingState.ecoFunc = 0
    this.AcProcess.parser.sendingState.CSEco = 0
    this.AcProcess.parser.sendingState.powerSave = 0
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    // this.powerSave(false);
    // this.switchECO(false);
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam);   
    this.delayQueryNewAndOld();
  }
  coolFreeTimingOffSwitch(time, sleepCurveData, page_path) {
    let burzzer = wx.getStorageSync('Sound')
    // 定时关机信息
    // timingOffSwitch: "",   // 定时关机是否开启，0-关闭，1-开启
    // timingOffHour: "",     // 定时时间-小时
    // timingOffMinute: "",   // 定时时间-分钟    
    let attrs = {
      timingOffSwitch: 1, // 定时关机是否开启，0-关闭，1-开启
      timingOnSwitch: 0,      
      coolFreeTimingUsable: 1, // 为1定时才能开     
      timingOffValue:  time * 60,    
      timingOffMinute: 0,
      timingOffHour: 0,
      btnSound: burzzer ? 1 : 0
    }
    console.log(attrs.timingOffValue,"--------------------设置定时关，看下时间下发对不对");

    let luaAttrs = {
      sn8_string:"00000001",
      power_off_time_value: time * 60,
      power_off_timer: "on",
      timer_enable: 1,
      buzzer: burzzer ? "on" : "off"
    }    
    this.writeData({
      hex: this.returnHexData(attrs),
      attr: luaAttrs
    }, true, '控制中...', 'TimerOn', ()=>{
      this.selfShowToast('已设置定时关机');
    });
    let burialParam = {
      object_name: `${time}小时`,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_appointment_shutdown', page_path || '')
    this.sendBurial(burialParam)
  }


  /**
   * 酷风定时开
   * @param {*} time 
   * @param {*} sleepCurveData 
   * @param {*} page_path 
   */
  coolFreeTimingOnSwitch(time, sleepCurveData, page_path) {
    let burzzer = wx.getStorageSync('Sound')
    // 定时关机信息
    // timingOffSwitch: "",   // 定时关机是否开启，0-关闭，1-开启
    // timingOffHour: "",     // 定时时间-小时
    // timingOffMinute: "",   // 定时时间-分钟    
    let attrs = {
      timingOffSwitch: 0, // 定时关机是否开启，0-关闭，1-开启
      timingOnSwitch: 1,      
      coolFreeTimingUsable: 1, // 为1定时才能开     
      timingOnValue:  time * 60,    
      timingOnMinute: 0,
      btnSound: burzzer ? 1 : 0
    }
    console.log(attrs.timingOffValue,"--------------------设置定时关，看下时间下发对不对");

    let luaAttrs = {
      sn8_string:"00000001",
      power_on_time_value: time * 60,
      power_on_timer: "on",
      timer_enable: 1,
      buzzer: burzzer ? "on" : "off"
    }    
    this.writeData({
      hex: this.returnHexData(attrs),
      attr: luaAttrs
    }, true, '控制中...', 'TimerOn', ()=>{
      this.selfShowToast('已设置定时开机');
    });
    let burialParam = {
      object_name: `${time}小时`,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_appointment_shutdown', page_path || '')
    this.sendBurial(burialParam)
  }

  /**关闭定时 */
  coolFreeCancelTimingOff(page_path, sleepCurveData) {
    console.log('time-off', page_path, sleepCurveData)
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      timingOffSwitch: 0, // 定时关机是否开启，0-关闭，1-开启
      timingOnSwitch: 0,
      coolFreeTimingUsable: 1, // 为1定时才能开     
      timingOnValue: 0,
      timingOnMinute: 0, 
      timingOffMinute: 0,
      timingOffHour: 0,
      btnSound: burzzer ? 1 : 0
    }
    console.log(attrs);

    let luaAttrs = {      
      sn8_string:"00000001",
      power_off_time_value: 0,
      power_off_timer: "off",
      power_on_time_value: 0,
      power_on_timer: "off",
      timer_enable: 1,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: this.returnHexData(attrs),
      attr: luaAttrs
    }, true, '控制中...', 'TimerOnOffSwitchOff', ()=>{
      this.selfShowToast('已取消定时');
    });

    let burialParam = {
      object_name: '取消定时',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_appointment_shutdown', page_path || '')
    this.sendBurial(burialParam);
  }

  /*酷风模式控制*/
  coolFreeControlModeToggle(modeIndex, acstatus, widget_id, page_path) { 
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风 参数是这个，需要转成酷风的
    // 0-制冷；1-抽湿；2-自动；3-制热；4-送风；5-待机；6-除湿再热；7-自动除湿；
    // 对于这个蓝牙直接发送指令的情况，需要转一次
  //  let modeIndex = this.coolFreeModeMap(_modeIndex);
    console.log(acstatus, "酷风模式切换")
    let dryLuaAttr = acstatus.coolFreeDryClean == 1 ? true : false;
    // if (acstatus.runStatus == 0) {
    //   wx.showToast({
    //     title: '空调已关，请先开空调',
    //     icon: 'none'
    //   })
    //   return;
    // }
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      mode: modeIndex,
      elecHeat: (modeIndex === 1 ? 1 : 0) || (modeIndex === 4 ? 1 : 0), // 制热、自动打开电辅热
      windSpeed: 102,      
      // todo 除了制冷模式      
      btnSound: burzzer ? 1 : 0,      
    };

    let modeOptions = ["auto", "cool", "dry", "heat", "fan"]
    let modeOptionsMap = {"auto":"自动", "cool":"制冷", "dry":"抽湿", "heat":"制热", "fan":"送风"}
    let luaAttrs = {
      mode: modeOptions[modeIndex - 1],
      ptc: modeOptions[modeIndex - 1] == "heat" || modeOptions[modeIndex - 1] == "auto" ? "on" : "off",
      wind_speed: 102,
      power_saving: "off",      
      comfort_power_save: 'off',
      comfort_sleep: "off",
      buzzer: burzzer ? "on" : "off",      
    }

    console.log(dryLuaAttr,'attrs',attrs, "luaAttrs", luaAttrs);


    this.writeData({
      hex: this.AcProcess.makeCoolFreeStandardProtocolPackage(attrs),
      attr: luaAttrs
    },true, '控制中...', 'controlModeToggle', ()=>{
      this.selfShowToast(`已切换为${modeOptionsMap[modeOptions[modeIndex - 1]]}模式`);
    });

    let burialParam = {
      page_name: "遥控面板",
      object: "模式",
      ex_value: modeArray[acstatus.mode - 1],
      value: modeArray[modeIndex - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: '开启'
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path, 1);
    this.sendBurial(burialParam);
    this.delayQuery();
  }

  /**
   * 酷风电辅热
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   * @param {*} sleepCurveData 
   */
  coolFreeSwitchElecHeat(isOn, widget_id, page_path, sleepCurveData) {
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      elecHeat: isOn ? 1 : 0,
      elecHeatForced: 1,
      btnSound: burzzer ? 1 : 0
    };
    let _ptc = isOn ? "on" : "off";
    let luaAttrs = {
      ptc: _ptc,
      ptc_force: "on",
      buzzer: burzzer ? "on" : "off"
    };  
    this.writeData({
      hex: this.AcProcess.makeCoolFreeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(attrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
  }

  /*干燥*/
  coolFreeSwitchDry(isOn) {
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      coolFreeDryClean: isOn ? 1 : 0,
      btnSound: burzzer ? 1 : 0,      
    };

    let luaAttrs = {
      dry: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }

    this.writeData({
      hex: this.returnHexData(attrs),
      attr: luaAttrs
    });
  }

  /**
   * 酷风智控温
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  coolFreeSmartCooling(isOn, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    // attrs[CMD.SoundNew] = burzzer ? [1]:[0]; // 蜂鸣器位置
    attrs[CMD.Supercooling] = isOn ? [1] : [0];
    attrs[CMD.NONDIRECTWIND] = [1];
    attrs[CMD.FAWINDFEEL] = [1];
    let luaAttrs = {
      prevent_super_cool: isOn ? "on" : "off",    
      buzzer: burzzer ? "on" : "off"
    }
    // this.AcProcess.parser.newsendingState.faWindFeel = 1;
    // 智控温和eco、舒省、省电互斥
    this.AcProcess.parser.sendingState.ecoFunc = 0
    this.AcProcess.parser.sendingState.CSEco = 0
    this.AcProcess.parser.sendingState.powerSave = 0
    this.writeData({
      hex: "",
      attr: luaAttrs
    });
    // this.powerSave(false);
    // this.switchECO(false);
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam);   
    this.delayQueryNewAndOld();
  }


  /**
   * 酷风睡眠
   */
  coolFreeCosySleep(isOn) {
    let burzzer = wx.getStorageSync('Sound')
    let luaAttrs = {
      energy_save: isOn ? "on" : "off",    
      buzzer: burzzer ? "on" : "off"
    }   
    this.writeData({
      hex: "",
      attr: luaAttrs
    });             
    this.delayQueryNewAndOld();
  }


  /**
   * 酷风强劲
   */
  coolFreeStrong(isOn) {
    let burzzer = wx.getStorageSync('Sound')
    // params.wind_speed=100;
    // params.energy_save="off";
    // params.comfort_sleep='off';
    // params.no_wind_sense='off';
    // params.cool_hot_sense="off";
    // params.nobody_energy_save="off";
    // params.wind_straight="off";
    // params.wind_avoid="off";
    // params.prevent_super_cool=0;
    // params.eco=0;
    // params.new_wind_model_mute=0;
    let luaAttrs = {
      strong_wind: isOn ? "on" : "off",   
      wind_speed: 100,
      energy_save: "off",
      comfort_sleep: "off",
      no_wind_sense: "off",
      cool_hot_sense: "off",
      nobody_energy_save: "off",
      wind_straight: "off",
      wind_avoid: "off",
      prevent_super_cool: 0,
      eco: 0,
      new_wind_model_mute: 0,
      buzzer: burzzer ? "on" : "off"
    }   
    this.writeData({
      hex: "",
      attr: luaAttrs
    });           
    this.delayQueryNewAndOld();
  }
  /*****************************北方采暖器逻辑控制**************************************/
  northWarmSwitchDevice(isOn, modeIndex, memoryChoice, acstatus, callback) {    
    let burzzer = wx.getStorageSync('Sound')    

    let luaAttrs = {
      power: isOn ? "on" : "off",      
    }
    // let showLoading = 
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '加载中...');


    let burialParam = {
      page_name: "遥控面板",
      object: "电源开关",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: "{\"temperature\":\"" + acstatus.tempSet + "°C\",\"speed\":\"" + acstatus.windSpeed + "\"}",
      order_status: 1
    };

    this.sendBurial(burialParam);
  }

  /*模式控制*/
  northWarmModeToggle(item, acstatus, widget_id, page_path) {
    
    // if (acstatus.runStatus == 0) {
    //   wx.showToast({
    //     title: '空调已关，请先开空调',
    //     icon: 'none'
    //   })
    //   return;
    // }
    let burzzer = wx.getStorageSync('Sound')            
    let luaAttrs = {
      mode: item.key,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    },true, '控制中...', 'controlModeToggle', ()=>{
      this.selfShowToast(`已切换为${item.text}模式`);
    });  
    
    this.delayQuery();
  }

  /*温度控制*/
  northWarmControlTemp(value, acstatus, callback, page_path) {
    //todo mutex in view    
    let burzzer = wx.getStorageSync('Sound')    

    let luaAttrs = {
      effluent_temperature: parseFloat(value)
    }
    // let hexData = this.returnHexData(attrs);
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '', 'TempControl', () => {
      callback && callback();
    });


    let burialParam = {
      page_name: "遥控面板",
      object: "温度",
      ex_value: acstatus.tempSet,
      value: value,
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: value
    }

    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_temperature_change', page_path);
    this.sendBurial(burialParam);
  }

  /*自动水温控制*/
  northWarmAutoTemp(isOn, acstatus, callback, page_path) {
    //todo mutex in view    
    let burzzer = wx.getStorageSync('Sound')    
    let flag = isOn ? "on" : "off";
    let luaAttrs = {
      "water_model_temperature_auto": flag,
      burzzer: burzzer ? "on" : "off"
    }
    
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '', '', () => {
      callback && callback();
    });

    let burialParam = {
      page_name: "自动水温",
      object: "温度",
      ex_value: acstatus.tempSet,
      value: value,
      link_mode: "",
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: value
    }

    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_auto_water_temp', page_path);
    this.sendBurial(burialParam);
  }
  
  /*外出控制*/
  northWarmGoOut(isOn, acstatus, callback, page_path) {
    //todo mutex in view    
    let burzzer = wx.getStorageSync('Sound')    
    let flag = isOn ? 1 : 0;
    let luaAttrs = {
      "out_mode":flag
    }
    
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '', '', () => {
      callback && callback();
    });

    let burialParam = {
      page_name: "外出",
      object: "温度",
      ex_value: acstatus.tempSet,
      value: value,
      link_mode: "",
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: value
    }

    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_out_mode', page_path);
    this.sendBurial(burialParam);
  }
  
  /*静音控制*/
  northWarmQuiet(isOn, acstatus, callback, page_path) {
    //todo mutex in view    
    let burzzer = wx.getStorageSync('Sound')    
    let flag = isOn ? 1 : 0;
    let luaAttrs = {
      "mute_voice":flag
    }
    
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '', '', () => {
      callback && callback();
    });        
  }

  /*北方采暖ECO控制*/
  northWarmECO(isOn, acstatus, callback, page_path) {
    //todo mutex in view    
    let burzzer = wx.getStorageSync('Sound')    
    let flag = isOn ? "on" : "off";
    let luaAttrs = {
      "eco":flag
    }
    
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '', '', () => {
      callback && callback();
    });        
  }  

  /*北方采暖目标室温控制*/
  northWarmTargetTemp(isOn, acstatus, callback, page_path) {
    //todo mutex in view    
    let burzzer = wx.getStorageSync('Sound')    
    let flag = isOn ? 1 : 0;
    let luaAttrs = {
      "temperature_control_switch":flag
    }
    
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '', '', () => {
      callback && callback();
    });        
  }  

  /*北方采暖室内目标温度设置*/
  northWarmTargetTempSet(value, acstatus, callback, page_path) {
    //todo mutex in view    
    let burzzer = wx.getStorageSync('Sound')        
    let luaAttrs = {
      "temperature":parseFloat(value)
    }
    
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '', '', () => {
      callback && callback();
    });        
  }  

  /**
   * 北方采暖定时开 开关
   */
  northWarmOnSwitchTimer(isOn,acstatus, callback, page_path) {
    //todo mutex in view    
    let burzzer = wx.getStorageSync('Sound')    
    let flag = isOn ? 1 : 0;
    let luaAttrs = {
      "power_on_timer": flag
    }
    
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '', '', () => {
      callback && callback();
    });        
  }  

  /**
   * 北方采暖定时关 开关
   */
  northWarmOffSwitchTimer(isOn,acstatus, callback, page_path) {
    //todo mutex in view    
    let burzzer = wx.getStorageSync('Sound')    
    let flag = isOn ? 1 : 0;
    let luaAttrs = {
      "power_off_timer": flag
    }
    
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '', '', () => {
      callback && callback();
    });        
  }  

  /**testingMode 工程模式*/
  testingMode() {
    "aa24ac00000000000202404356667f7fff30000000000000000000000a80000000000573be"
    let hex = "aa16ac00000000000203416100ff05000000001111ea87";
    var enDataBuf = Common.fromHexString(hex);
    console.log('工程模式', enDataBuf, hex)
    this.bluetoothConn.sendBizMsg({
      type: 0x20,
      body: enDataBuf,
      success: () => {
        console.log('起热点指令发送成功');
      }
    })
  }



  /**防直吹*/
  UpDownNoWindBlowingSwitch(isOn, param,widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.NONDIRECTWIND] = isOn ? [2] : [1];
    if(isOn) { // 打开防直吹的时候才一起下发上下防直吹的参数
      attrs[CMD.NONDIRECTWINDTYPE] = [parseInt(param)]; // 防直吹类型 0：左防直吹 1：右防直吹 2：上防直吹 3：下防直吹
    }   
    console.log(attrs);

    let luaAttrs = {
      prevent_straight_wind: isOn ? 2 : 1,
      prevent_straight_wind_lr: param, // 防直吹类型 0：左防直吹 1：右防直吹 2：上防直吹 3：下防直吹
      prevent_super_cool: "off",
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
    this.delayQueryNewAndOld();
  }


  /**th无风感设定 */
  thNoWindFeelSwitch(isOn, param,widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.THGUINOWINDSENSE] = [
      isOn ? 2 : 1, // 左 0不设置 1关闭 2开启
      isOn ? 2 : 1 // 右 0不设置 1关闭 2开启
    ]
    
    console.log(attrs);

    let luaAttrs = {
      no_wind_sense_right: isOn ? 'on' : 'off',
      no_wind_sense_left: isOn ? 'on' : 'off'
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
  }

  /**th无风感设定单边
   * 第二个参数-1表示不设置
   */
  thNoWindFeelSwitchSingle(left, right, param,widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    let _left = left == 'notSet' ? 0 : (left == 'on' ? 2 : 1); 
    let _right = right == 'notSet' ? 0 : (right == 'on' ? 2 : 1); 
    attrs[CMD.THGUINOWINDSENSE] = [
      _left, // 左 0不设置 1关闭 2开启
      _right // 右 0不设置 1关闭 2开启
    ]
    
    console.log(attrs);

    let luaAttrs = {
      no_wind_sense_right: right,
      no_wind_sense_left: left,
      buzzer: burzzer ? "on" : "off"
    };

    if(left == 'notSet') {
      delete luaAttrs.no_wind_sense_left
    }

    if(right == 'notSet') {
      delete luaAttrs.no_wind_sense_right
    }

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });
    let burialParam = {
      ext_info: JSON.stringify(luaAttrs),
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
  }

  /* 备菜 */
  switchPrepareFood(data, acstatus, widget_id, page_path) {
    // if (acstatus.runStatus == 0) {
    //   wx.showToast({
    //     title: '空调已关，请先开空调',
    //     icon: 'none'
    //   })
    //   return;
    // }
    let isOn = data.prepare_food
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {};
    attrs[CMD.PREPAREFOOD] = [
      data.prepare_food,
      data.prepare_food_temp,
      data.prepare_food_fan_speed
    ];

    let luaAttrs = data
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });


    let burialParam = {
      page_name: "遥控面板",
      object: "备菜",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: isOn ? '开启' : '关闭'
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam);    
    this.delayQueryNewAndOld();   
  }

  /* 爆炒 */
  switchQuickFry(data, acstatus, widget_id, page_path) {
    // if (acstatus.runStatus == 0) {
    //   wx.showToast({
    //     title: '空调已关，请先开空调',
    //     icon: 'none'
    //   })
    //   return;
    // }
    let isOn = data.quick_fry
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {};
    attrs[CMD.QUICKFRY] = [
      data.quick_fry,
      data.quick_fry_temp,
      data.quick_fry_fan_speed
    ];

    let luaAttrs = data
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });


    let burialParam = {
      page_name: "遥控面板",
      object: "爆炒",
      ex_value: isOn ? "关" : "开",
      value: isOn ? "开" : "关",
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: isOn ? '开启' : '关闭'
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam);    
    this.delayQueryNewAndOld();   
  }

  // 爆炒摆风 
  changeQuickFryCenterPoint(data, acstatus, widget_id, page_path) {
    // if (acstatus.runStatus == 0) {
    //   wx.showToast({
    //     title: '空调已关，请先开空调',
    //     icon: 'none'
    //   })
    //   return;
    // }
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {};
    attrs[CMD.QUICKFRYCENTERPOINT] = [
      data,
      15
    ];
    let luaAttrs = {
      quick_fry_center_point: data,
      quick_fry_angle: 15,
    };
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    });


    let burialParam = {
      page_name: "遥控面板",
      object: "爆炒摆风",
      value: data,
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: data
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam);    
    this.delayQuery();   
  }
  // 滤网清洗和复位
  dustFullTimeReset(acstatus, widget_id, page_path) {
    let burzzer = wx.getStorageSync('Sound')
    let attrs = {
      dust_full_time_reset: 1,
    };
    let luaAttrs = {
      dust_full_time_reset: 1,
    };
    this.writeData({
      hex: this.AcProcess.makeStandardProtocolPackage(attrs),
      attr: luaAttrs
    });


    let burialParam = {
      page_name: "遥控面板",
      object: "滤网清洗和复位",
      value: 1,
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: 1
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam);    
    this.delayQuery();   
  }


  /**
   * 净化开关方法th
   * @param {净化开关} isOn 
   */
  puriFySwitch(isOn, fanSpeed, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.CLEANFUNC] = [
      isOn ? 1 : 0,
      fanSpeed,
      1
    ];
    console.log(attrs);
    let luaAttrs = {    
      inner_purifier: isOn ? "on" : "off",
      inner_purifier_fan_speed: fanSpeed,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', '', ()=>{
      this.selfShowToast(isOn ? `已开启净化${freshAirFanSpeedTH[fanSpeed+'']}` : '已关闭净化');      
    });
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
  }

  /**
   * 保湿开关方法th
   * @param {保湿开关} isOn 
   */
  keepWetSwitch(isOn, fanSpeed, widget_id, page_path, useTips) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.KEEPWET] = [
      isOn ? 1 : 0,
      fanSpeed,    
    ];
    console.log(attrs);
    let luaAttrs = {    
      moisturizing: isOn ? 1 : 0,
      moisturizing_fan_speed: fanSpeed,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', '', ()=>{     
      if (useTips) {
        this.selfShowToast(isOn ? `已开启保湿${freshAirFanSpeedTH[fanSpeed+'']}` : '已关闭保湿'); 
      }        
    });

    this.delayQueryNewAndOld();
    let burialParam = {
      ext_info: isOn ? '开启' : '关闭',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, widget_id, page_path)
    this.sendBurial(burialParam)
  }

  /**
   * 回温除湿开关
   * @param {*} isOn 
   */
  BackWarmRemoveWetSwitch(isOn) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.BACKWARMREMOVEWET] = [
      isOn ? 1 : 0,    
    ];
    console.log(attrs);
    let luaAttrs = {    
      rewarming_dry: isOn ? 1 : 0,     
      buzzer: burzzer ? "on" : "off"
    };
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', '', ()=>{     
        
    });
  }

  /**
   * th灯光控制
   */
  ThLightSwitch(isOn) {
    let attrs = {};
    let burzzer = wx.getStorageSync('Sound')
    attrs[CMD.THLIGHT] = [
      isOn ? 100 : 0,    
    ];
    console.log(attrs);
    let luaAttrs = {    
      light: isOn ? 100 : 0,     
      buzzer: burzzer ? "on" : "off"
    };
    this.writeData({
      hex: this.AcProcess.makeNewProtocolPackage(attrs, burzzer),
      attr: luaAttrs
    },true, '控制中...', '', ()=>{     
        
    });
  }
  writeData(data, useLoading, toast, funcType, callback) {
    let hex = data.hex;
    console.log(data,"原始数据");
    //这里使用`TypedArray视图`中`Uint8Array（无符号 8 位整数）`操作   
    if (this.ctrlType == 1) {
      let useLoad = useLoading == undefined ? true : useLoading;
      let toastText = toast == undefined || toast == '' ? '加载中...' : toast
      console.log(Helper.decimalArrayToHexStrArrayFormat(hex));
      let hexStr = Helper.decimalArrayToHexStrArrayFormat(hex).join('');
      console.log(hexStr, 'send data');
      if (this.timer != null) {
        clearTimeout(this.timer);
      }
      if (funcType == 'TempControl') {
        this.timer = setTimeout(() => {
          this.sendDataLogic(useLoad, hex, toastText, () => {
            callback && callback();
          })
        }, 300);
      } else {
        this.sendDataLogic(useLoad, hex, toastText, () => {
          callback && callback();
        });
      }
    } else if (this.ctrlType == 2) {
      console.log('wifi 来控制', this.ctrlType);
      let useLoad = useLoading == undefined ? true : useLoading;
      let toastText = toast == undefined || toast == '' ? '加载中...' : toast
      let attr = data.attr;
      let requestMethod = attr.query_type !== undefined ? meijuService.luaQuery : meijuService.luaControl;
      if (attr.query_type === '') {
        delete attr.query_type;
      }

      this.sendLuaLogic(data, requestMethod, toastText, useLoad, (res) => {
        callback && callback(res);
      });
    } else {
      console.log('虚拟');
    }
    console.log(app.$$Rangers,">>>>>>>>>>>>>>>>>>");
  }
  sendLuaLogic(_data, requestMethod, toastText, useLoad, callback) {
    // _data.attr
    if (useLoad) {
      wx.showLoading({
        title: toastText,
        mask: true,
      });
    }
    console.log('query wifiwifi', JSON.stringify(_data.attr))
    requestMethod(this.applianceCode, {
      ..._data.attr
    },this.status).then((data) => {
      wx.hideLoading({
        success: (res) => {},
      })
      this.status = {...this.status,...data};
      console.log(JSON.stringify(data), "wifiwifiwifiwifi", LuaMap)      
      this.luaDataTransformer(data);      
      this.event.dispatch("receiveMessageLan", 
      data)     
      callback && callback(data);            
    }).catch(err => {
      console.log(JSON.stringify(err));
      wx.hideLoading({
        success: (res) => {
          // callback && callback()
        },
      })     
      if (err?.data?.code) {
        if (err.data.code == 1304) {
           wx.showToast({
                  title: '设备已不属于该用户，请重新配网',
                  icon: 'none',
                  duration: 2000
            }) 
        }
      }         
    });
  }
  sendDataLogic(useLoad, hex, toastText, callback) {
    console.log(hex);
    var enDataBuf = new Uint8Array(hex);
    if (useLoad) {
      wx.showLoading({
        title: toastText,
        mask: true,
      });
    }
    this.bluetoothConn.sendBizMsg({
      type: 0x20,
      body: enDataBuf,
      success: () => {
        console.log('发送指令成功' + toastText);
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {
              console.log('hide loading 1111111');            
              callback && callback(res);
            },
          })
        }, toastText == '加载中...' ? 800 : 500);
      }
    });
  }

  luaDataTransformer(data) {
    let item;
    let state;
    let _map = LuaMap

    if(this.isCoolFree) {
      console.log('采用酷风的转换');
      _map = LuaMapCoolFree
    } else if(this.isTH) {
      console.log('th转换')
      _map = LuaMapTh
    } else if(this.useNorthWarm) {
      console.log('北方采暖转换')
      _map = LuaMapNorthWarm
    } else if(this.useCfKitchen) {
      _map = LuaMapCfKitchen
    }
    console.log(data, "luaMapTransfer")

    for (let key in data) {
      item = _map[key];    
      // console.log(item, key);
      if (item !== undefined) {
        state = item.isStandardProto ? this.AcProcess.parser.sendingState : this.AcProcess.parser.newsendingState;
        if (state[item.value] !== undefined) {
          if (item.key[data[key]] !== undefined) {   
            if(key == 'mode') {
              if(data[key] == 'smart_dry') {
                console.log(data[key], "========luamap")
                state.smartDryFunc = 'smart_dry'
              } else {
                state.smartDryFunc = ''
              }              
            }        
            state[item.value] = item.key[data[key]]       
          } else {
            if (item.combinate !== undefined) {
              let comData = data[item.combinate] !== undefined ? data[item.combinate] : 0
              state[item.value] = data[key] + parseFloat(comData);
            } else {
              state[item.value] = data[key];
            }
          }
        } else if (item.reduce !== undefined) {
          for (let key_ in item.reduce) {
            state[key_] = (item.reduce[key_])(data[key]);
          }
        }
      }
    }

    console.log(state, "sendingstate",)
  };

  /******************网络控制******************/
  luaQuery() {
    return new Promise((resolve, reject) => {      
      let reqData = {
        applianceCode: this.applianceCode,
        command: {},
        stamp: +new Date(),
        reqId: +new Date()
      }
      requestService.request('luaGet', reqData).then((res) => {
        console.log(res, 'lua查询返回');
        resolve(res)
      }).catch(err => {
        // this.showToast('设备网络异常', err) 
        console.log('lua查询错误', JSON.stringify(err));
        // wx.showToast({
        //   title: JSON.stringify(err),
        // })          
      })
    })
  }

  /**控制类埋点数据 */
  sendBurial(burialParam, triggerType) {    
    if (this.deviceSn) {
      burialParam.object_type = this.deviceSn;      
      burialParam.sn = this.deviceSn;      
    }
    if(this.deviceSn8) {
      burialParam.object_id = this.deviceSn8;      
      burialParam.sn8 = this.deviceSn8;
    }
    if (this.applianceCode) {
      burialParam.applianceCode = this.applianceCode
    }

    let _triggerType = triggerType || 'user_behavior_event';
    if (burialParam.ext_info && burialParam.ext_info.sn8) burialParam.ext_info.sn8 = this.deviceSn8
    if (burialParam.ext_info && burialParam.ext_info.is_care_mode) burialParam.ext_info.is_care_mode = wx.getStorage('oldPeopleMode') ? '1' : 0
    console.log('----------------------burialParam', burialParam, 'triggerType', _triggerType, this.deviceSn, this.deviceSn8);

    burialParam.widget_type = '0xAC'
    pluginEventTrack(_triggerType, null, burialParam, burialParam)
    // app.$$Rangers.event(_triggerType, burialParam);
  }

  /**
   * 根据widgetId查出对应的埋点数据
   */
  matchBurialParams(widget_id) {
    let result = BurialMapList.filter(i => i.widget_id == widget_id);
    if (result && result[0]) {
      return result[0];
    } else {
      return {};
    }
  }
  /**
   * 
   * @param {*} burialParams 元数据
   * @param {*} widget_id 组件id
   * @param {*} page_path 路由route
   */
  matchBurialParamsAdvance(burialParams, widget_id, page_path, tempValue) {
    let _burialParams = JSON.parse(JSON.stringify(burialParams));
    let result = BurialMapList.filter(i => i.widget_id == widget_id);
    if (result && result[0]) _burialParams = {
      ..._burialParams,
      ...result[0]
    }
    if (page_path) _burialParams = {
      ..._burialParams,
      page_path
    }
    if (tempValue) _burialParams = {
      ..._burialParams,
      value: _burialParams.widget_name
    }
    return _burialParams;
  }


  /**
   * 获取设备的功能
   */
  getDeviceFunc() {  
    let cmds = [];
    let cmdKeys = [];
    let sn = '000000211' + this.deviceSn8 + '091802902930000'
    // let sn = 
    let obj = SnProcess.getAcFunc(sn, true)
    let allFunc = SnProcess.getSnOrder(sn, false)
    
    let luaKeys = [];
    let uniqueLuaKeys = [];
    let uniqueCmds = []
    let uniqueCmdskeys = [];


    for(let i = 0; i < allFunc.length; i++) {      
      if(FuncType[allFunc[i]].protocolVersion == 1 && FuncType[allFunc[i]].metaType == 0) { // 新协议
        luaKeys.push(FuncType[allFunc[i]].luaKey)

        if(FuncType[allFunc[i]].CMD != '') {          
          cmds.push(FuncType[allFunc[i]].CMD)
          if (FuncType[allFunc[i]].CMD == 0x0058) {
            cmds.push(FuncType.WindBlowing.CMD)
          }

          if (FuncType[allFunc[i]].CMD == 0x0096) { // 下左右风向的，带上上风向，和上左右风向
            cmds.push(FuncType.LeftRightWindAngle.CMD)
            cmds.push(FuncType.UpDownWindAngle.CMD)
          }
          cmdKeys.push(this.getObjectKey(CMD,FuncType[allFunc[i]].CMD))

        }
      }            
    }

    uniqueLuaKeys = luaKeys.filter(function(item,index){
      return luaKeys.indexOf(item) === index;
    })

    uniqueCmds = cmds.filter(function(item,index){
      return cmds.indexOf(item) === index;
    })

    uniqueCmdskeys = cmdKeys.filter(function(item,index){
      return cmdKeys.indexOf(item) === index;
    })
    let luaKeysStr = uniqueLuaKeys.join(',');
    
    console.log('allfunc',allFunc)
    console.log('luaKeysStr',luaKeysStr)
    console.log('uniqueCmds',uniqueCmds)
    console.log('uniqueCmdskeys',uniqueCmdskeys)

    return {
      luaKeysStr,
      uniqueCmds
    }
  }

  getObjectKey(object,value) {
    return Object.keys(object).find(key=>object[key] == value)
  }

  delatQueryOld() {
    setTimeout(() => {
      this._queryStatus(false);
    }, 1000); 
  }

  delayQuery() {
    setTimeout(() => {
      this._queryStatusNewProtocol(false);
    }, 1000);   
  }

  delayQueryNewAndOld() {
    setTimeout(() => {     
      this._queryStatus(false)            
      this._queryStatusNewProtocol(false);
    }, 1000);       
  }

  coolFreeModeMap(_modeIndex) {
    let modeIndex = 2;
    if (_modeIndex == 1) {
      modeIndex = 2
      console.log('自动')
    } else if(_modeIndex == 2) {
      modeIndex = 0
      console.log('制冷')
    } else if(_modeIndex == 3) {
      modeIndex = 1
      console.log('抽湿')
    } else if(_modeIndex == 4) {
      modeIndex = 3
      console.log('制热')
    } else if(_modeIndex == 5) {
      modeIndex = 4
      console.log('送风')
    }
    return modeIndex;
  }

  /**
   * 用来区分组酷风包还是普通包
   * @param {*} attrs 
   */
  returnHexData(attrs) {
    let hexData = this.AcProcess.makeStandardProtocolPackage(attrs);
    if (this.isCoolFree) {
      hexData = this.AcProcess.makeCoolFreeStandardProtocolPackage(attrs);
    }
    return hexData;
  }

  /**
   * 获取设备的型号
   * @param {*} sn8 
   */
  getAcSubType() {
    let sn = '000000211' + this.deviceSn8 + '091802902930000'  
    let subType = SnProcess.getAcSubType(sn, true)    
    return subType;
  }

  getAcFunc() {
    let sn = '000000211' + this.deviceSn8 + '091802902930000' 
    let hasObj = SnProcess.getAcFunc(sn, true)
    return hasObj;
    // console.log(obj, 'getAcFunc');
    // return this.checkHasFunc('useTH', obj.home.noneControlFunc)
  }

  checkIsTH() {
    let sn = '000000211' + this.deviceSn8 + '091802902930000' 
    let obj = SnProcess.getAcFunc(sn, false)    
    console.log(obj, 'getAcFunc');
    return this.checkHasFunc('useTH', obj.home.noneControlFunc)
  }

  checkIsNorthWarm() {
    let sn = '000000211' + this.deviceSn8 + '091802902930000' 
    let obj = SnProcess.getAcFunc(sn, false)    
    console.log(obj, 'getAcFunc');
    return this.checkHasFunc('useNorthWarm', obj.home.noneControlFunc)
  }

  checkUseWhat(data) {
    let sn = '000000211' + this.deviceSn8 + '091802902930000' 
    let obj = SnProcess.getAcFunc(sn, false)    
    return this.checkHasFunc(data, obj.home.noneControlFunc)
  }

  checkHasFunc(funcName, allBtn) {
    return allBtn.indexOf(funcName) >= 0;
  }

  selfShowToast(text) {
    wx.showToast({
      title: text,
      icon: 'none'
    })
  }

  getTwoDistinctNumbers() {
    let num1 = Math.floor(Math.random() * 255);
    let num2 = Math.floor(Math.random() * 255);
    
    while (num1 === num2) {
      num2 = Math.floor(Math.random() * 255);
    }
    
    return [num1, num2];
  }

   formatDate(yearDigit, month, date, hour) {
    // 获取当前年份的四位数表示
    const currentYear = new Date().getFullYear();
    // 将当前年份的个位数替换成传入的年份的个位数    
    const year = parseInt(currentYear.toString().replace(/.$/, yearDigit.toString()));
    // 创建一个新的Date对象，使用传入的参数设置年、月、日、小时
    const d = new Date(year, month - 1, date, hour);
    console.log(d.toString());
    // 使用toISOString方法将日期格式化为YYYY-MM-DDTHH:mm:ss.sssZ的字符串
    // 我们只需要YYYY-MM-DD-HH部分，因此使用substring方法截取前13个字符
    // return d.toISOString().substring(0, 13).replace('T', '-');
    const _year = d.getFullYear();
    const _month = String(d.getMonth() + 1).padStart(2, '0');
    const _day = String(d.getDate()).padStart(2, '0');
    const _hour = String(d.getHours()).padStart(2, '0');
    let formattedDate = `${_year}/${_month}/${_day} ${_hour}:00:00`;
    return formattedDate;


  }

  compareNorthWarmDates(date1) {
    var d1 = new Date(date1);    
    var d2 = this.getNowNorthWarmDate();
    var _d2 = new Date(d2);
    if (d1 < _d2) {
      return -1;
    } else if (d1 > _d2) {
      return 1;
    } else {
      return 0;
    }
  }

  getNowNorthWarmDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var output = year + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + ' ' + (hour < 10 ? '0' : '') + hour + ":00:00";
    return output;
  }

  /****************酷风厨房空调******************/
  coolFreeKitchenSwitchDevice(isOn) {
    let luaAttrs = {
      power: isOn ? "on" : "off",
      power_enable: 1
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '加载中...');
  }

  /**
   * 酷风风速
   */
  coolFreeKitchenWindSpeed(windSpeedValue) {
    let _value = windSpeedValue > 100 ? 102 : windSpeedValue < 1 ? 1 : windSpeedValue;
    let luaAttrs = {
      wind_speed: _value,
      wind_speed_enable: 1
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '加载中...');
  }

  /**
   * 酷风上下摆风
   */
  coolFreeKitchenUdSwing(isOn) {   
    let luaAttrs = {
      wind_swing_ud: isOn ? "on" : "off",
      wind_swing_ud_enable: 1
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '加载中...');
  }

  /**
   * 酷风左右摆风
   */
  coolFreeKitchenLrSwing(isOn) {   
    let luaAttrs = {
      wind_swing_lr: isOn ? "on" : "off",
      wind_swing_lr_enable: 1
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '加载中...');
  }

  /**
   * 酷风上下摆风角度
   */
  coolFreeKitchenUdAngle(angle) {   
    console.log(angle.toString(),"angleMap", angleMap[angle.toString()])
    let luaAttrs = {
      up_down_wind_direction: angleMap[angle.toString()],
      up_down_wind_direction_enable: 1
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '加载中...');
  }

  /**
   * 酷风左右摆风角度
   */
  coolFreeKitchenLrAngle(angle) {   
    
    let luaAttrs = {
      left_right_wind_direction: angleMap[angle.toString()],
      left_right_wind_direction_enable: 1
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '加载中...');
  }

  /**
   * 酷风厨房空调备菜
   */
  coolFreeKitchenPrepareFood(isOn) {
    let luaAttrs = {
      prepare_food: isOn ? 1 : 0,
      prepare_food_enable: 1
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '加载中...');
  }


  /**
   * 爆炒
   */
  coolFreeKitchenQuickFry(isOn) {
    let luaAttrs = {
      quick_fry: isOn ? 1 : 0,
      quick_fry_enable: 1
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '加载中...');
  }

  /*干燥X空间*/
  switchDryXarea(isOn) {
    let burzzer = wx.getStorageSync('Sound')   
    let luaAttrs = {
      dry: isOn ? "on" : "off",
      dry_enable: 1      
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    });
    // this.delayQuery();
  }

  /**
   * X空间系列，定时关下发发码
   * @param {*} time 
   * @param {*} sleepCurveData 
   * @param {*} page_path 
   */
  xAreaTimingOffSwitch(time, sleepCurveData, page_path) {    
    let luaAttrs = {     
      power_off_time_value: time * 60,
      power_off_time_value_enable:1,
      power_off_timer: "on",
      power_off_timer_enable: 1,
    }    
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '控制中...', 'TimerOn', ()=>{
      this.selfShowToast('已设置定时关机');
    });
    let burialParam = {
      object_name: `${time}小时`,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_appointment_shutdown', page_path || '')
    this.sendBurial(burialParam)
  }

   /**
    * x空间系列关闭定时
    * @param {*} page_path 
    * @param {*} sleepCurveData 
    */
   xAreaCancelTimingOff(page_path, sleepCurveData) {    
    let luaAttrs = {          
      power_off_time_value: 0,
      power_off_time_value_enable:1,
      power_off_timer: "off",
      power_off_timer_enable: 1,
      power_on_time_value: 0,
      power_on_time_value_enable: 1,
      power_on_timer: "off",
      power_on_timer_enable: 1,
      timer_enable: 1,      
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '控制中...', 'TimerOnOffSwitchOff', ()=>{
      this.selfShowToast('已取消定时');
    });

    let burialParam = {
      object_name: '取消定时',
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_appointment_shutdown', page_path || '')
    this.sendBurial(burialParam);
  }



  /**
   * x空间系列下发定时开
   * @param {*} time 
   * @param {*} sleepCurveData 
   * @param {*} page_path 
   */
  xAreaTimingOnSwitch(time, sleepCurveData, page_path) {
    let luaAttrs = {     
      power_on_time_value: time * 60,
      power_on_time_value_enable: 1,
      power_on_timer: "on",
      power_on_timer_enable: 1,
      timer_enable: 1,      
    }    
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '控制中...', 'TimerOn', ()=>{
      this.selfShowToast('已设置定时开机');
    });
    let burialParam = {
      object_name: `${time}小时`,
      setting_params: JSON.stringify(luaAttrs)
    }
    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_appointment_shutdown', page_path || '')
    this.sendBurial(burialParam)
  }

  /**
   * x空间智清洁
   * @param {*} isOn 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  xAreaSelfCleaningSwitch(isOn, widget_id, page_path) {    
    let _self_clean = isOn ? "on" : "off";
    let luaAttrs = {
      self_clean: _self_clean,
      self_clean_enable:1
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    },true, '控制中...', 'SelfCleaning', ()=>{
      this.selfShowToast(isOn ? '已开启智清洁' : '已关闭智清洁');
    });
   
  }

  /**
   * 重置滤网时间
   */
  xAreaRefreshFilter() {   
    let luaAttrs = {
      // fresh_filter_time_reset:"on"
      purify_filter_time_reset: "on"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    },true, '控制中...', 'SelfCleaning',()=>{
      setTimeout(() => {
        this._queryXAreaRunstatus();  
      }, 500);      
    });     
   
    
  }

   /*X空间类型的模式切换*/
   xAreaModeChange(modeIndex, acstatus, widget_id, page_path) { 
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风 参数是这个，需要转成酷风的
    // 0-制冷；1-抽湿；2-自动；3-制热；4-送风；5-待机；6-除湿再热；7-自动除湿；
    // 对于这个蓝牙直接发送指令的情况，需要转一次
    //  let modeIndex = this.coolFreeModeMap(_modeIndex);   
    let modeOptions = ["auto", "cool", "dry", "heat", "fan"]
    let modeOptionsMap = {"auto":"自动", "cool":"制冷", "dry":"抽湿", "heat":"制热", "fan":"送风"}
    let luaAttrs = {
      mode: modeOptions[modeIndex - 1],
      mode_enable: 1
    }    
    this.writeData({
      hex: "",
      attr: luaAttrs
    },true, '控制中...', 'controlModeToggle', ()=>{
      this.selfShowToast(`已切换为${modeOptionsMap[modeOptions[modeIndex - 1]]}模式`);
    });
  }

  // 爆炒摆风 
  xAreaQuickFryCenterPoint(data) {      
    let luaAttrs = {
      quick_prepare_food_angle: data,
      quick_prepare_food_angle_enable:1
    };
    this.writeData({
      hex: "",
      attr: luaAttrs
    });
  }

  xAreaControlTemp(value, acstatus, callback, page_path) {
    //todo mutex in view       

    let _is = parseInt(value) > 30 ? 30 : parseInt(value) < 16 ? 16 : parseInt(value);
    let _is5 = ((value - parseInt(value)) * 10) === 0 ? 0 : 0.5;
    let luaAttrs = {
      temperature: _is,
      temperature_enable:1,
      small_temperature: _is5,    
      small_temperature_enable:1
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, true, '', 'TempControl', () => {
      callback && callback();
    });


    let burialParam = {
      page_name: "遥控面板",
      object: "温度",
      ex_value: acstatus.tempSet,
      value: value,
      link_mode: modeArray[acstatus.mode - 1],
      setting_params: JSON.stringify(luaAttrs),
      order_status: 1,
      ext_info: value
    }

    burialParam = this.matchBurialParamsAdvance(burialParam, 'click_temperature_change', page_path);
    this.sendBurial(burialParam);
  }
}