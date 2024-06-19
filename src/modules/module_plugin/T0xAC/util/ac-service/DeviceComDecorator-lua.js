import SendOrder from '../SendOrder.js'
import {
  requestService
} from '../../../../utils/requestService'
import {
  formatTime,
  getTimeStamp,
  getReqId,
  getUID,
  getStamp,
  RndNum,
  getSign,
  cheakVersion
} from '../../../../utils/util'

import Common from '../../../../distribution-network/addDevice/pages/wahinProtocol/bluetooth/common.js';
import Event from '../../../../distribution-network/addDevice/pages/wahinProtocol/bluetooth/event.js'

export default class DeviceComDecorator {
  constructor(applianceCode, bluetoothConn) {
    console.log('init', applianceCode)
    this.applianceCode = applianceCode;
    this.bluetoothConn = bluetoothConn;
    this.AcProcess = new SendOrder();

    this.timer = null;

    this.event = new Event();
  }

  _queryStatus(callback, newCallback, fail, newFail) {
    this.writeData({
      hex: this.AcProcess.makeQueryPackage(),
      attr: {
        query_type: ''
      },
    }, (res) => {
      console.log(res, '来自writedata');
      callback && callback(res);
    })

    this.writeData({
      hex: '',
      attr: {
        query_type: 'wind_swing_ud_angle,wind_swing_lr_angle,fresh_air,no_wind_sense,prevent_straight_wind,self_clean'
      },
    }, (res) => {
      console.log(res, '来自writedata');
      newCallback && newCallback(res);
    })
  }

  _queryOld(callback) {
    this.writeData({
      hex: this.AcProcess.makeQueryPackage(),
      attr: {
        query_type: ''
      },
    }, (res) => {
      console.log(res, '来自writedata');
      callback && callback(res);
    })
  }

  /**
   * 开关机
   */
  switchDevice(isOn, callback) {
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    let luaAttrs = {
      power: isOn,
      buzzer: burzzer ? 'on' : 'off'
    }
    this.writeData({
      hex: '',
      attr: luaAttrs
    }, (res) => {
      console.log('switch device', res);
      callback && callback(res);
    });
  }

  /**
   * 温度控制
   * @param {*} temperature 
   * @param {*} smallTemp 
   * @param {*} callback 
   * @param {*} page_path 
   */
  controlTemp(acstatus, temperature, smallTemp, callback, page_path) {
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound');
    let luaAttrs = {
      temperature: temperature,
      small_temperature: smallTemp,
      comfort_sleep: 'off',
      pmv: -3.5,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }

  /*模式控制*/
  controlModeToggle(mode, acstatus, callback, widget_id, page_path) {
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
    // '自动', '制冷', '制热', '送风', '抽湿'];
    // let modeIndex = this.AcProcess.parser.acceptingState.mode + 1;
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound');
    let modeOptions = ["auto", "cool", "dry", "heat", "fan"]
    let luaAttrs = {
      mode: mode,
      ptc: mode == "heat" || mode == "auto" ? "on" : "off",
      wind_speed: 102,
      power_saving: "off",
      comfort_power_save: 'off',
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }

  /*上下摆风*/
  switchUpDownSwipe(isOn, acstatus, callback, widget_id, page_path) {
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    // let attrs = {
    //   leftUpDownWind: isOn ? 1 : 0,
    //   rightUpDownWind: isOn ? 1 : 0,
    //   btnSound: burzzer ? 1 : 0
    // };

    let luaAttrs = {
      wind_swing_ud: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: '',
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }

  /**
   * 左右风
   * @param {} isOn 
   * @param {*} acstatus 
   * @param {*} callback 
   * @param {*} widget_id 
   * @param {*} page_path 
   */
  switchLeftRightSwipe(isOn, acstatus, callback, widget_id, page_path) {
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    // let attrs = {
    //   leftLeftRightWind: isOn ? 1 : 0,
    //   rightLeftRightWind: isOn ? 1 : 0,
    //   btnSound: burzzer ? 1 : 0
    // };

    let luaAttrs = {
      wind_swing_lr: isOn ? "on" : "off",
      wind_swing_lr_under: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }

  /**
   * 新风开关方法
   * @param {新风开关} isOn 
   */
  freshAirSwitch(isOn, fanSpeed, callback, widget_id, page_path) {
    let attrs = {};
    let burzzer = true
    // attrs[CMD.FRESHAIR] = [
    //   isOn ? 1 : 0,
    //   fanSpeed,
    //   255
    // ];
    let luaAttrs = {
      // prevent_straight_wind: isOn ? 2 : 1,
      // prevent_super_cool:"off",
      fresh_air: isOn ? "on" : "off",
      fresh_air_fan_speed: fanSpeed,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }

  /**电辅热 */
  switchElecHeat(isOn, acstatus, callback, widget_id, page_path) {
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    let attrs = {
      elecHeat: isOn ? 1 : 0,
      elecHeatForced: 1,
      btnSound: burzzer ? 1 : 0
    };
    let _ptc = isOn ? "on" : "off";
    this.writeData({
      hex: "",
      attr: {
        ptc: _ptc,
        ptc_force: "on",
        buzzer: burzzer ? "on" : "off"
      }
    }, (res) => {
      callback && callback(res);
    });
  }

  /*ECO控制*/
  switchECO(isOn, acstatus, callback, widget_id, page_path) {
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let burzzer = 'on'
    let attrs = {
      ecoFunc: isOn ? 1 : 0,
      powerSave: 0,
      CSEco: 0,
      btnSound: burzzer ? 1 : 0
    };
    console.log(attrs, "switcheco");


    let paramsF = {};
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
    paramsF.buzzer = burzzer ? "on" : "off";

    this.writeData({
      hex: "",
      attr: paramsF
    }, (res) => {
      callback && callback(res);
    });
  }

  /**省电、睡眠 */
  powerSave(isOn, acstatus, callback, widget_id, page_path) {
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    let attrs = {
      powerSave: isOn ? 1 : 0,
      CSEco: 0,
      ecoFunc: 0,
      windSpeed: 102,
      btnSound: burzzer ? 1 : 0
    };

    let luaAttrs = {
      power_saving: isOn ? "on" : "off",
      comfort_power_save: 'off',
      wind_speed: 102,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res)
    });
  }


  /**无风感 */
  noWindFeelSwitch(nowind, acstatus, callback, widget_id, page_path) {
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    let luaAttrs = {
      no_wind_sense: nowind,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res)
    });
  }

  /**防直吹*/
  noWindBlowingSwitch(isOn, acstatus, callback, widget_id, page_path) {
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let attrs = {};
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    // attrs[CMD.NONDIRECTWIND] = isOn ? [2] : [1];
    // console.log(attrs);

    let luaAttrs = {
      prevent_straight_wind: isOn ? 2 : 1,
      prevent_super_cool: "off",
      wind_swing_ud_angle: 0,
      buzzer: burzzer ? "on" : "off"
    };

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }

  /**关闭定时 */
  cancelTimingOff(callback, page_path) {
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    // let attrs = {
    //   timingOffSwitch: 0, // 定时关机是否开启，0-关闭，1-开启
    //   timingOnSwitch: 0,
    //   timingIsValid: 1, // 定时总开关：为1时才能正常开关定时
    //   timingOffMinute: 0,
    //   timingOffHour: 0,
    //   btnSound: burzzer ? 1 : 0
    // }

    let luaAttrs = {
      power_off_time_value: 0,
      power_off_timer: "off",
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }

  /**定时关机 打开*/
  timingOffSwitch(time, callback, page_path) {
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    let luaAttrs = {
      power_off_time_value: time * 60,
      power_off_timer: "on",
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }

  /**
   * 屏显
   * @param {*} callback 
   */
  showSwitch(isOn, callback) {
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    let luaAttrs = {
      screen_display: isOn ? "on" : "off",
      buzzer: burzzer ? "on" : "off"
    }

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });

  }

  /*风速控制*/
  controlWindSpeed(windSpeedValue, acstatus, callback, page_path) {
    //todo mutex in view   
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')
    let _value = windSpeedValue > 100 ? 102 : windSpeedValue < 1 ? 1 : windSpeedValue;


    let luaAttrs = {};
    luaAttrs.strong_wind = 'off';
    luaAttrs.wind_speed = _value;
    luaAttrs.power_saving = 'off'
    luaAttrs.buzzer = burzzer ? "on" : "off"


    console.log(JSON.stringify(luaAttrs), "--------------");

    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }

  /**智清洁 */
  selfCleaningSwitch(isOn, callback, widget_id, page_path) {
    let attrs = {};
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')


    let _self_clean = isOn ? "on" : "off";
    let luaAttrs = {
      self_clean: _self_clean,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }


  /**
   * 上下摆风角度控制
   * @param {*} angle 
   * @param {*} callback 
   */
  windSwingUdAngle(angle, acstatus, callback) {
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')

    let luaAttrs = {
      wind_swing_ud_angle: angle,
      prevent_straight_wind: 1,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }


  /**
   * 左右摆风角度控制
   * @param {*} angle 
   * @param {*} callback 
   */
  windSwingLrAngle(angle, acstatus, callback) {
    if (acstatus.power == 'off') {
      this.showToast('空调已关机，请先开机')
      return;
    }
    let burzzer = wx.getStorageSync(this.applianceCode + 'Sound')

    let luaAttrs = {
      wind_swing_lr_angle: angle,
      buzzer: burzzer ? "on" : "off"
    }
    this.writeData({
      hex: "",
      attr: luaAttrs
    }, (res) => {
      callback && callback(res);
    });
  }

  /*******************发码工具函数************************/
  writeData(data, callback) {
    let hex = data.hex;
    console.log('sendOrder', data)
    if (true) {
      console.log('wifi 来控制', data.attr);

      let attr = data.attr;
      let requestMethod = attr.query_type !== undefined ? this.luaQuery : this.luaControl;
      // if (attr.query_type === '') {
      //   delete attr.query_type;
      // }

      if (true) {
        this.sendDataLogic(hex, () => {
          callback && callback();
        });
      } else {
        this.sendLuaLogic(data, requestMethod, (res) => {
          console.log('in control', res);
          callback && callback(res);
        });
      }
    } else {
      console.log('虚拟');
    }
  }
  sendLuaLogic(_data, requestMethod, callback) {
    // _data.attr
    console.log()
    requestMethod(this.applianceCode, {
      ..._data.attr
    }).then((data) => {
      console.log('in send lua logic', data);
      callback && callback(data)
    }).catch(err => {

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
        console.log('发送指令成功');
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {              
              callback && callback();
            },
          })
        }, 500);
      }
    });
  }
  //查询设备状态并更新界面
  luaQuery(applianceCode, param) {
    return new Promise((resolve, reject) => {
      let command = (param.query_type !== undefined && param.query_type !== "") ? {
        "query": param
      } : {};

      let reqData = {
        "reqId": getReqId(),
        "stamp": getStamp(),
        "applianceCode": applianceCode,
        "command": command
      }
      console.log(reqData, 'luaQuery', param);
      requestService.request("luaGet", reqData).then((resp) => {
        console.log(resp.data.data, '///////')
        if (resp.data.code == 0) {
          resolve(resp.data.data || {})
        } else {
          reject(resp)
        }
      }, (error) => {
        wx.hideNavigationBarLoading()
        console.error(error)
        reject(error)
      })
    })
  }
  //查询设备状态并更新界面
  luaControl(applianceCode, param) {
    return new Promise((resolve, reject) => {
      let reqData = {
        "reqId": getReqId(),
        "stamp": getStamp(),
        "applianceCode": applianceCode,
        "command": {
          "control": param
        }
      }
      requestService.request("luaControl", reqData).then((resp) => {
        if (resp.data.code == 0) {
          resolve(resp.data.data || {})
        } else {
          reject(resp)
        }
      }, (error) => {
        wx.showToast({
          title: '设备未响应，请稍后尝试刷新',
          icon: 'none',
          duration: 2000
        })
        console.error(error)
        reject(error)
      })
    })
  }

  showToast(text) {
    wx.showToast({
      title: text,
      icon: 'none'
    })
  }
}