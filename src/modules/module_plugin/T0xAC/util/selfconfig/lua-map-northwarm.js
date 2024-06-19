const LuaMapNorthWarm = {
  'power': { // 开关机
    isStandardProto: true,
    value: 'runStatus',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "mode":{ // 模式
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
    isStandardProto: true,
    value: 'mode',
    key: {
      "auto":1,
      "cool":2,
      "dry":3,
      "heat":4,
      "fan":5,
      "smart_mode":7
    }
  },
  "indoor_temperature":{ // 室内温度
    isStandardProto: true,
    value: 'tempIn',    
    key: {}
  },
  "effluent_temperature": { 
    isStandardProto: true,
    value: 'northWarmEffluentTemperature',    
    key: {}
  },
  "temperature":{ // 温度
    isStandardProto: true,    
    value: 'northWarmTargetTemp',
    key: {}
  },
  "out_mode": {
    isStandardProto: true,    
    value: 'outMode',
    key: {}
  },
  "mute_voice": {
    isStandardProto: true,    
    value: 'muteVoice',
    key: {}
  },
  "water_model_temperature_auto": {
    isStandardProto: true,    
    value: 'waterModelAuto',
    key: {
      "on":1,
      "off":0
    }
  },
  "eco":{ // eco
    isStandardProto: true,
    value: 'northWarmEco',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "temperature_control_switch": {
    isStandardProto: true,
    value: 'northWarmTempCtrlSwitch',
    key: {}
  },
  "holiday_mode": {
    isStandardProto: true,
    value: 'holidayMode',
    key: {}
  },
  // holidayModeMcuSwitch
  "holiday_mode_mcu_switch": {
    isStandardProto: true,
    value: 'holidayModeMcuSwitch',
    key: {}
  },
  "power_on_timer": {
    isStandardProto: true,
    value: 'northWarmpowerOnTimer',
    key: {}
  },
  "power_off_timer": {
    isStandardProto: true,
    value: 'northWarmpowerOffTimer',
    key: {}
  },
  "vacation_entry_time_byte0": {
    isStandardProto: true,
    value: 'vacation_entry_time_byte0',
    key: {}
  },
  "vacation_entry_time_byte1": {
    isStandardProto: true,
    value: 'vacation_entry_time_byte1',
    key: {}
  },
  "vacation_entry_time_byte2": {
    isStandardProto: true,
    value: 'vacation_entry_time_byte2',
    key: {}
  },
  "vacation_entry_time_byte3": {
    isStandardProto: true,
    value: 'vacation_entry_time_byte3',
    key: {}
  },
  "vacation_exit_time_byte0": {
    isStandardProto: true,
    value: 'vacation_exit_time_byte0',
    key: {}
  },
  "vacation_exit_time_byte1": {
    isStandardProto: true,
    value: 'vacation_exit_time_byte1',
    key: {}
  },
  "vacation_exit_time_byte2": {
    isStandardProto: true,
    value: 'vacation_exit_time_byte2',
    key: {}
  },
  "vacation_exit_time_byte3": {
    isStandardProto: true,
    value: 'vacation_exit_time_byte3',
    key: {}
  },
  "current_water_temperature": {
    isStandardProto: true,
    value: 'current_water_temperature',
    key: {}
  },  
  // "screen_display_now":{ // 屏显
  //   isStandardProto: true,
  //   value: 'screenShow',
  //   key: {
  //     'on': 0,
  //     'off': 7
  //   }
  // },
  // "temperature":{ // 温度
  //   isStandardProto: true,
  //   combinate: "small_temperature",
  //   value: 'tempSet2',
  //   key: {}
  // },
  // "wind_swing_ud":{ // 上下风
  //   isStandardProto: true,
  //   value: 'leftUpDownWind',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },
  // "wind_swing_lr":{ // 左右风
  //   isStandardProto: true,
  //   value: 'leftLeftRightWind',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },  
  // "wind_speed":{ // 风速
  //   isStandardProto: true,
  //   value: 'windSpeed',
  //   key: {}
  // },    
  // "power_saving":{ // 睡眠
  //   isStandardProto: true,
  //   value: 'powerSave',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },
  // "ptc":{ // 电辅热
  //   isStandardProto: true,
  //   value: 'elecHeat',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },
  // "comfort_power_save":{ // 舒省
  //   isStandardProto: true,
  //   value: 'CSEco',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },
  // "power_off_time_value":{ // 定时关数值位
  //   isStandardProto: true,
  //   reduce: {
  //     'timingOffHour' : (v)=> { return parseFloat(v/60) },
  //     'timingOffMinute' : (v) => { return v%60 }
  //   }, 
  //   key: {}
  // },
  // "power_off_timer":{ // 定时关开关位
  //   isStandardProto: true,
  //   value: 'timingOffSwitch',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },
  // "power_on_time_value":{ // 定时开数值位
  //   isStandardProto: true,
  //   reduce: {
  //     'timingOnHour' : (v)=> { return parseFloat(v/60) },
  //     'timingOnMinute' : (v) => { return v%60 }
  //   }, 
  //   key: {}
  // },
  // "power_on_timer":{ // 定时开开关位
  //   isStandardProto: true,
  //   value: 'timingOnSwitch',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },
  // "check_value":{ // 校验码
  //   isStandardProto: true,
  //   value: 'checkCode',    
  //   key: {}
  // }, 
  // "prevent_straight_wind":{ // 防直吹
  //   isStandardProto: false,
  //   value: 'switchNonDirectWind',
  //   key: {}
  // },
  // "self_clean":{ // 智清洁
  //   isStandardProto: false,
  //   value: 'switchSelfCleaning',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },
  // "prevent_super_cool":{ // 智控温
  //   isStandardProto: false,
  //   value: 'superCoolingSw',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },
  // "voice_control_new":{ // 语音
  //   isStandardProto: false,
  //   value: 'voiceBroadcastStatus',
  //   key: {
  //     'on': 3,
  //     'off': 0
  //   }
  // },
  // "fresh_air":{ //新风
  //   isStandardProto: false,
  //   value: 'switchFreshAir',
  //   key:{
  //     'on':1,
  //     'off':0
  //   }
  // },
  // "fresh_air_fan_speed":{
  //   isStandardProto: false,
  //   value: 'freshAirFanSpeed',
  //   key:{}
  // },
  // "new_mode_power":{
  //   isStandardProto: false,
  //   value: 'newModePower',
  //   key:{}
  // },
  // "new_mode":{
  //   // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
  //   // let modeOptions = ["auto", "cool", "dry", "heat", "fan"]
  //   isStandardProto: false,
  //   value: 'newMode',
  //   key:{
  //     'auto':1,
  //     'cool':2,
  //     'dry':3,
  //     'heat':4,
  //     'fan':5
  //   }
  // },
  // "wind_swing_lr_angle":{
  //   isStandardProto: false,
  //   value: 'leftRightAngle',
  //   key:{}
  // },
  // "wind_swing_ud_angle":{
  //   isStandardProto: false,
  //   value: 'upDownAngle',
  //   key:{}
  // },
  // "no_wind_sense":{
  //   isStandardProto: false,
  //   value: 'controlSwitchNoWindFeel',
  //   key:{}
  // },
  // "wind_around": {
  //   isStandardProto: false,
  //   value: 'udAroundWindSwitch',
  //   key:{
  //     'on':1,
  //     'off':0
  //   }
  // },
  // "wind_around_ud": {
  //   isStandardProto: false,
  //   value: 'udAroundWindDirect',
  //   key:{}
  // },
  // "degerming": {
  //   isStandardProto: false,
  //   value: 'degerming',
  //   key:{
  //     'on':1,
  //     'off':0
  //   }
  // },
  // "comfort_sleep": {
  //   isStandardProto: true,
  //   value: 'cosySleepMode',
  //   key: {
  //     'on': 3,
  //     'off': 0
  //   }    
  // },

  // "purifier": {//净化
  //   isStandardProto: true,
  //   value: 'cleanFunSw',
  //   key: {
  //     'on': 3,
  //     'off': 0
  //   }    
  // },

  // "indoor_humidity": {//湿度
  //   isStandardProto: true,
  //   value: 'requestHumidityValue',
  //   key: {
  //     'on': 3,
  //     'off': 0
  //   }    
  // },

  // "intelligent_wind": {//智慧风
  //   isStandardProto: false,
  //   value: 'controlWisdomWind',
  //   key: {
  //     'on': 3,
  //     'off': 0
  //   }    
  // },

  // "child_prevent_cold_wind": {//儿童防冷风
  //   isStandardProto: false,
  //   value: 'controlPreventCool',
  //   key: {
  //     'on': 3,
  //     'off': 0
  //   }    
  // },

  // "pm25_value": {//pm2.5
  //   isStandardProto: false,
  //   value: 'controlPM25Display',
  //   key: {
  //     'on': 3,
  //     'off': 0
  //   }    
  // },

  // "gentle_wind_sense": {//柔风感
  //   isStandardProto: false,
  //   value: 'controlSoftWindStatus',
  //   key: {
  //     'on': 3,
  //     'off': 0
  //   }    
  // },
  // "prevent_straight_wind_lr":{ // 防直吹类型
  //   isStandardProto: false,
  //   value: 'nonDirectWindType',
  //   key: {}
  // },
  // "wind_swing_lr_under": {
  //   isStandardProto: true,
  //   value: 'downWind',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }  
  // },
  // "dry":{
  //   isStandardProto: true,
  //   value: 'diyFunc',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },
  // "wind_sense_mini": {
  //   isStandardProto: false,
  //   value: 'faWindFeel',
  //   key: {}
  // },
  // "auto_prevent_cold_wind": {
  //   isStandardProto: false,
  //   value: 'automaticAntiColdAir',
  //   key: {}
  // },
  // "cool_power_saving":{ // 酷省电
  //   isStandardProto: false,
  //   value: 'coolPowerSaving',
  //   key: {}
  // },
  // "jet_cool":{ // 环游风
  //   isStandardProto: false,
  //   value: 'aroundWind',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }
  // },
  // "prepare_food":{ // 备菜
  //   isStandardProto: false,
  //   value: 'prepareFood',
  //   key: {}
  // },
  // "prepare_food_fan_speed":{ // 备菜风速
  //   isStandardProto: false,
  //   value: 'prepareFoodFanSpeed',
  //   key: {}
  // },
  // "prepare_food_temp":{ // 备菜温度
  //   isStandardProto: false,
  //   value: 'prepareFoodTemp',
  //   key: {}
  // },
  // "quick_fry":{ // 爆炒
  //   isStandardProto: false,
  //   value: 'quickFry',
  //   key: {}
  // },
  // "quick_fry_angle":{ // 爆炒角度
  //   isStandardProto: false,
  //   value: 'quickFryAngle',
  //   key: {}
  // },
  // "quick_fry_center_point":{ // 爆炒摆角
  //   isStandardProto: false,
  //   value: 'quickFryCenterPoint',
  //   key: {}
  // },
  // "quick_fry_fan_speed":{ // 爆炒风速
  //   isStandardProto: false,
  //   value: 'quickFryFanSpeed',
  //   key: {}
  // },
  // "quick_fry_temp":{ // 爆炒温度
  //   isStandardProto: false,
  //   value: 'quickFryTemp',
  //   key: {}
  // },
  // "dust_full_time":{ // 滤网
  //   isStandardProto: true,
  //   value: 'dustFlow',
  //   key: {}
  // },
};


export {
  LuaMapNorthWarm
};