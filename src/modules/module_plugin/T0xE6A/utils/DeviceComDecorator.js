const app = getApp();
const requestService = app.getGlobalConfig().requestService
const pluginEventTrack = app.getGlobalConfig().pluginEventTrack
import MeijuService from '../api/MeijuService';
import Event from './event';
// ../util/device-funcs-match/SnProcess
const meijuService = new MeijuService();
export default class DeviceComDecorator {
  constructor(applianceCode, deviceSn, deviceSn8) {
    // this.deviceId = deviceId;
    // this.serviceId = serviceId;
    // this.characteristicId = characteristicId;
    this.applianceCode = applianceCode;
    this.deviceSn = deviceSn;
    this.deviceSn8 = deviceSn8;

    this.timer = null;
    this.event = new Event();
    this.status = {}
  }

  /********************************* 业务函数 *********************************/
  /**
   * 查询设备状态
   * @param {是否使用loading} useLoading 
   */
  _queryStatus(useLoading) {
    console.log('查询设备状态');
    this.writeData({
      attr: {
        query_type: ''
      }
    }, useLoading, '加载中...');
  }


  /**
   * 设备开关机
   * @param {*} flag 
   */
  switchDevice(flag) {
    let luaAttrs = {
      power: flag ? "on" : "off",      
    }
    if (!flag) {
      luaAttrs.winter_mode = "off"
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...');
  }

  /**
   * 全屋采暖
   * @param {*} flag 
   */
  winterMode(flag) {
    let luaAttrs = {
      winter_mode: flag ? "on" : "off"
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...');
  }

  /**
   * 设置采暖温度
   *  current_heat_set_temperature
   */
  currentHeatSetTemperature(val, status, exitHeatMode = true, cb) {
    let luaAttrs = {
      current_heat_set_temperature: parseInt(val),
      // heat_mode: 0,
    }
    let tipsArr = ["智能外出","智能居家","智能睡眠"]
    if (!exitHeatMode) {
      delete luaAttrs.heat_mode
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...',"",()=>{
      if (status.heat_mode != 0 && exitHeatMode) {
        wx.showToast({
          title: '已退出' + tipsArr[parseInt(status.heat_mode) - 1],
          icon: 'none'
        })
      }
      cb && cb()
    });
  }


  /**
   * 设置卫浴温度
   *  current_heat_set_temperature
   */
  currentBathSetTemperature(val, status) {
    let luaAttrs = {
      current_bath_set_temperature: parseInt(val),
      current_bath_set_temperature_small: 0
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...',"",()=>{
      // if (status.bath_mode == 10) {
      //   wx.showToast({
      //     title: '已退出智温感',
      //     icon: 'none'
      //   })
      // }
    });
  }

  /**
   * 模式切换
   * @param {*} mode 
   */
  heatModeSwitch(mode) {
    let luaAttrs = {
      heat_mode: parseInt(mode)
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...');
  }

  /**
   * 点动零冷水
   * @param {*} isOn 
   */
  coldWaterDot(isOn) {
    let luaAttrs = {
      cold_water_dot: isOn ? "on" : "off"
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...');
  }

  /**
   * 智温感
   * 普通模式
    "control":{"bath_mode":"0"}
    智温感
    "control":{"bath_mode":"10"}
   */
  bathMode(isOn) {
    let luaAttrs = {
      bath_mode: isOn ? "10" : "0"
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...');
  }

  /**
   * 增压模式开启、关闭
   * @param {*} isOn 
   */
  pressureSwitch(isOn) {
    let luaAttrs = {
      pressure: isOn ? "on" : "off"
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...');
  }

  /**
   * 单次零冷水
   */
  singleZeroWater(isOn) {
    let luaAttrs = {
      cold_water_single: isOn ? "on" : "off"
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...');
  }


  /**
   * 自动水温
   * @param {*} isOn 
   */
  autoWaterTemp(isOn) {
    let luaAttrs = {
      auto_water_temperature: isOn ? 1 : 0
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...');
  }


  /**
   * cold_water_appoint_master on/off
   * @param {*} isOn 
   */
  coldWaterAppointMaster(isOn) {
    let luaAttrs = {
      cold_water_appoint_master: isOn ? "on" : "off"
    }
    this.writeData({
      attr: luaAttrs
    }, true, '控制中...');
  }




  writeData(data, useLoading, toast, funcType, callback) {
    let useLoad = useLoading == undefined ? true : useLoading;
    let toastText = toast == undefined || toast == '' ? '加载中...' : toast
    let attr = data.attr;
    let requestMethod = attr.query_type !== undefined ? meijuService.luaQuery : meijuService.luaControl;
    if (attr.query_type === '') {
      delete attr.query_type;
    }
    this.sendLuaLogic(data, requestMethod, toastText, useLoad, () => {
      callback && callback();
    });
  }

  sendLuaLogic(_data, requestMethod, toastText, useLoad, callback) {
    // _data.attr
    if (useLoad) {
      wx.showLoading({
        title: toastText,
        mask: true,
      });
    }
    // console.log('query wifiwifi', JSON.stringify(_data.attr))
    requestMethod(this.applianceCode, {
      ..._data.attr
    }, this.status).then((data) => {
      this.status = {
        ...this.status,
        ...data
      };
      console.log(JSON.stringify(data))

      this.event.dispatch("receiveMessageLan", data)
      setTimeout(() => {
        wx.hideLoading({
          success: (res) => {
            console.log('hide loading 2222');
            callback && callback()
          },
        })
      }, 200);
    }).catch(err => {
      console.log(JSON.stringify(err));
      wx.hideLoading({
        success: (res) => {
          console.log('hide loading 33333');
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

  heatState() {
    let showState = false;
    if (!this.isOnline && this.acStatus.error_code == 0 && this.acStatus.power) {
      if (this.isHeating) {
        if (this.acStatus.flame_feedback && this.acStatus.tee_valve_output == "heat_side") {
          this.textHeatWHF = "加热中";
        } else {
          if (condition) {
            
          }
          this.textHeatWHF = "保温中";
        }
        showState = true;
      }
      if (!this.isHeating) {
        if (this.acStatus.flame_feedback && this.acStatus.tee_valve_output == "bath_side") {
          if (this.acStatus.cold_water_master) {
            this.textHeatWHF = "零冷水 · 加热中";
          } else {
            this.textHeatWHF = "加热中"
          }

        } else {
          this.textHeatWHF = "保温中";
        }
        showState = true;
      }
    }
    return showState;
  }


}


/**
 * 采暖：
普通模式
"control":{"heat_mode":"0","buzzing_switch":"buzzing"}
智能外出
"control":{"heat_mode":"1","buzzing_switch":"buzzing"}
智能居家
"control":{"heat_mode":"2","buzzing_switch":"buzzing"}
智能睡眠
"control":{"heat_mode":"3","buzzing_switch":"buzzing"}
全屋采暖
"control":{"winter_mode":"off"}
"control":{"winter_mode":"on"}
采暖温度设置
"control":{"current_heat_set_temperature":73,"buzzing_switch":"buzzing"}
是否退出当前采暖模式：是
"control":{"heat_mode":"0","buzzing_switch":"no_buzzing"}

卫浴：
普通模式
"control":{"bath_mode":"0"}
智温感
"control":{"bath_mode":"10"}
增压
"control":{"pressure":"on"}
点动零冷水
"control":{"cold_water_dot":"off"}
单次零冷水
"control":{"cold_water_master":"on"}
卫浴设置温度
"control":{"current_bath_set_temperature":38}

卫浴设置温度最大值    21  bath_set_temperature_max
卫浴设置温度最小值    22  bath_set_temperature_min

auto_water_temperature 自动水温
 */
