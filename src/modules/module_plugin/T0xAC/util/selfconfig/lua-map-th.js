const LuaMapTh = {
  'power': { // 开关机
    isStandardProto: true,
    value: 'runStatus',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "screen_display_now":{ // 屏显
    isStandardProto: true,
    value: 'screenShow',
    key: {
      'on': 0,
      'off': 7
    }
  },
  "temperature":{ // 温度
    isStandardProto: true,
    combinate: "small_temperature",
    value: 'tempSet2',
    key: {}
  },
  "wind_swing_ud":{ // 上下风
    isStandardProto: true,
    value: 'leftUpDownWind',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "wind_swing_ud_left":{ // 上下风
    isStandardProto: true,
    value: 'leftUpDownWind',
    key: {
      'on': 1,
      'off': 0
    }
  },  
  "wind_swing_ud_right":{ // 上下风
    isStandardProto: true,
    value: 'rightUpDownWind',
    key: {
      'on': 1,
      'off': 0
    }
  },  
  "wind_swing_lr":{ // 左右风
    isStandardProto: true,
    value: 'leftLeftRightWind',
    key: {
      'on': 1,
      'off': 0
    }
  },  
  "wind_swing_lr_left":{ // 左右风
    isStandardProto: true,
    value: 'leftLeftRightWind',
    key: {
      'on': 1,
      'off': 0
    }
  },  
  "wind_swing_lr_right":{ // 左右风
    isStandardProto: true,
    value: 'rightLeftRightWind',
    key: {
      'on': 1,
      'off': 0
    }
  },  
  "wind_speed":{ // 风速
    isStandardProto: true,
    value: 'windSpeed',
    key: {}
  },
  "mode":{ // 模式
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
    isStandardProto: true,
    value: 'mode',
    key: {
      "auto":1,
      "cool":2,
      "dry":3,
      "smart_dry":3,
      "heat":4,
      "fan":5,      
    }
  },
  "eco":{ // eco
    isStandardProto: true,
    value: 'ecoFunc',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "power_saving":{ // 睡眠
    isStandardProto: true,
    value: 'powerSave',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "ptc":{ // 电辅热
    isStandardProto: true,
    value: 'elecHeat',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "comfort_power_save":{ // 舒省
    isStandardProto: true,
    value: 'CSEco',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "power_off_time_value":{ // 定时关数值位
    isStandardProto: true,
    reduce: {
      'timingOffHour' : (v)=> { return parseFloat(v/60) },
      'timingOffMinute' : (v) => { return v%60 }
    }, 
    key: {}
  },
  "power_off_timer":{ // 定时关开关位
    isStandardProto: true,
    value: 'timingOffSwitch',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "power_on_time_value":{ // 定时开数值位
    isStandardProto: true,
    reduce: {
      'timingOnHour' : (v)=> { return parseFloat(v/60) },
      'timingOnMinute' : (v) => { return v%60 }
    }, 
    key: {}
  },
  "power_on_timer":{ // 定时开开关位
    isStandardProto: true,
    value: 'timingOnSwitch',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "check_value":{ // 校验码
    isStandardProto: true,
    value: 'checkCode',    
    key: {}
  },
  "indoor_temperature":{ // 室内温度
    isStandardProto: true,
    value: 'tempIn',    
    key: {}
  },
  "prevent_straight_wind":{ // 防直吹
    isStandardProto: false,
    value: 'switchNonDirectWind',
    key: {}
  },
  "self_clean":{ // 智清洁
    isStandardProto: false,
    value: 'switchSelfCleaning',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "prevent_super_cool":{ // 智控温
    isStandardProto: false,
    value: 'superCoolingSw',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "voice_control_new":{ // 语音
    isStandardProto: false,
    value: 'voiceBroadcastStatus',
    key: {
      'on': 3,
      'off': 0
    }
  },
  "fresh_air":{ //新风
    isStandardProto: false,
    value: 'switchFreshAir',
    key:{
      'on':1,
      'off':0
    }
  },
  "fresh_air_fan_speed":{
    isStandardProto: false,
    value: 'freshAirFanSpeed',
    key:{}
  },
  "new_mode_power":{
    isStandardProto: false,
    value: 'newModePower',
    key:{}
  },
  "new_mode":{
    // 1: 自动，2：制冷 3：抽湿 4：制热 5：送风
    // let modeOptions = ["auto", "cool", "dry", "heat", "fan"]
    isStandardProto: false,
    value: 'newMode',
    key:{
      'auto':1,
      'cool':2,
      'dry':3,
      'heat':4,
      'fan':5
    }
  },
  "wind_swing_lr_angle":{
    isStandardProto: false,
    value: 'leftRightAngle',
    key:{}
  },
  "wind_swing_ud_angle":{
    isStandardProto: false,
    value: 'upDownAngle',
    key:{}
  },
  "no_wind_sense":{
    isStandardProto: false,
    value: 'controlSwitchNoWindFeel',
    key:{}
  },
  "no_wind_sense_up":{
    isStandardProto: false,
    value: 'upNoWindSense',
    key:{}
  },
  "no_wind_sense_down":{
    isStandardProto: false,
    value: 'downNoWindSense',
    key:{}
  },
  "wind_around": {
    isStandardProto: false,
    value: 'udAroundWindSwitch',
    key:{
      'on':1,
      'off':0
    }
  },
  "wind_around_ud": {
    isStandardProto: false,
    value: 'udAroundWindDirect',
    key:{}
  },
  "degerming": {
    isStandardProto: false,
    value: 'degerming',
    key:{
      'on':1,
      'off':0
    }
  },
  "comfort_sleep": {
    isStandardProto: true,
    value: 'cosySleepMode',
    key: {
      'on': 3,
      'off': 0
    }    
  },

  "purifier": {//净化
    isStandardProto: true,
    value: 'cleanFunSw',
    key: {
      'on': 3,
      'off': 0
    }    
  },

  "indoor_humidity": {//湿度
    isStandardProto: true,
    value: 'requestHumidityValue',
    key: {
      'on': 3,
      'off': 0
    }    
  },

  "intelligent_wind": {//智慧风
    isStandardProto: false,
    value: 'controlWisdomWind',
    key: {
      'on': 3,
      'off': 0
    }    
  },

  "child_prevent_cold_wind": {//儿童防冷风
    isStandardProto: false,
    value: 'controlPreventCool',
    key: {
      'on': 3,
      'off': 0
    }    
  },

  "pm25_value": {//pm2.5
    isStandardProto: false,
    value: 'controlPM25Display',
    key: {
      'on': 3,
      'off': 0
    }    
  },

  "gentle_wind_sense": {//柔风感
    isStandardProto: false,
    value: 'controlSoftWindStatus',
    key: {
      'on': 3,
      'off': 0
    }    
  },
  "prevent_straight_wind_lr":{ // 防直吹类型
    isStandardProto: false,
    value: 'nonDirectWindType',
    key: {}
  },
  // "wind_swing_lr_under": {
  //   isStandardProto: true,
  //   value: 'downWind',
  //   key: {
  //     'on': 1,
  //     'off': 0
  //   }  
  // },
  "dry":{
    isStandardProto: true,
    value: 'diyFunc',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "wind_sense_mini": {
    isStandardProto: false,
    value: 'faWindFeel',
    key: {}
  },
  "auto_prevent_cold_wind": {
    isStandardProto: false,
    value: 'automaticAntiColdAir',
    key: {}
  },
  "cool_power_saving":{ // 酷省电
    isStandardProto: false,
    value: 'coolPowerSaving',
    key: {}
  },
  "jet_cool":{ // 环游风
    isStandardProto: false,
    value: 'aroundWind',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "no_wind_sense_right":{ // th无风感右
    isStandardProto: false,
    value: 'thNoWindSenseRight',
    key: {
      'on': 2,
      'off': 1
    }
  },
  "no_wind_sense_left":{ // th无风感左
    isStandardProto: false,
    value: 'thNoWindSenseLeft',
    key: {
      'on': 2,
      'off': 1
    }
  },
  "gentle_wind_sense":{
    isStandardProto: false,
    value: 'thSoftWindStatus',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "swing_lr_under_angle": { // 下左右风向
    isStandardProto: false,
    value: 'downLeftRightAngle',
    key: {}
  },
  "wind_swing_lr_under": { // 下左右风
    isStandardProto: false,
    value: 'downLeftRightWindTh',
    key: {
      'on': 1,
      'off': 0
    }
  },
  "ieco_switch": {
    isStandardProto: false,
    value: 'coolPowerSavingIeco',
    key: {},   
  },
  "quick_cool_heat": { // 下左右风
    isStandardProto: false,
    value: 'quickCoolHeat',
    key: {},    
  },
  "rewarming_dry": { // 回温除湿 0/1
    isStandardProto: false,
    value: 'rewarmingDry',
    key: {},    
  },
  "inner_purifier": { // on off
    isStandardProto: false,
    value: 'innerPurifier',
    key: {
      "on": 1,
      "off": 0
    },    
  },
  "inner_purifier_fan_speed": {
    isStandardProto: false,
    value: 'innerPurifierFanSpeed',
    key: {},  
  },
  "moisturizing": { // 保湿 0/1
    isStandardProto: false,
    value: 'moisturizing',
    key: {},    
  },
  "moisturizing_fan_speed": {
    isStandardProto: false,
    value: 'moisturizingFanSpeed',
    key: {},   
  },
  "wind_swing_lr_left": {
    isStandardProto: false,
    value: 'windSwingLrLeft',
    key: {
      "on": 1,
      "off": 0
    },    
  },
  "wind_swing_lr_right": {
    isStandardProto: false,
    value: 'windSwingLrRight',
    key: {
      "on": 1,
      "off": 0
    },  
  },
  "wind_swing_ud_left": {
    isStandardProto: false,
    value: 'windSwingUdLeft',
    key: {
      "on": 1,
      "off": 0
    },    
  },
  "wind_swing_ud_right": {
    isStandardProto: false,
    value: 'windSwingUdRight',
    key: {
      "on": 1,
      "off": 0
    },  
  },
  "right_lr_wind_angle":{ // 右左右摆风角度
    isStandardProto: false,
    value: 'rightLrWindAngle',
    key:{}
  },
  "light": {
    isStandardProto: false,
    value: 'thLight',
    key:{}
  },
  "smart_dry_value":{
    isStandardProto: true,
    value: 'smartDryValue',
    key: {}
  },
  "quick_cool_heat": {
    isStandardProto: false,
    value: 'quickCoolHeat',
    key: {}
  },
  "prevent_straight_wind_distance": {
    isStandardProto: false,
    value: 'nonDirectWindDistance',
    key: {}
  },
  "circle_fan": {
    isStandardProto: false,
    value: 'circleFan',
    key: {}
  },
  "circle_fan_mode": {
    isStandardProto: false,
    value: 'circleFanMode',
    key: {}
  },
  "buzzer_all": {
    isStandardProto: false,
    value: 'newSoundSwitch',
    key: {}
  },
  "buzzer_off_status": {
    isStandardProto: false,
    value: 'newSoundType',
    key: {}
  },
  "auto_prevent_cold_wind_memory": {
    isStandardProto: false,
    value: 'preventCoolWindMenory',
    key: {}
  },
  "has_auto_prevent_cold_wind_memory": {
    isStandardProto: false,
    value: 'hasPreventCoolWindMenory',
    key: {}
  }
};


export {
  LuaMapTh
};