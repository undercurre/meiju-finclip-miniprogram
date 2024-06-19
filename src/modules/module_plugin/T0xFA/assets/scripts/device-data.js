import {FA} from "../../cards/card1/js/FA";

const baseImageUrl = 'https://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon'
export const DeviceData = {
  baseImageUrl,
  isDebug: false,
  bigVer: 1,
  onlineStatus: {
    online: 1,
    offline: 0,
  },
  themeColor: {
    excellent: '#00CBB8',
    good: '#29C3FF',
    bad: '#FF6A4C',
    wait: '#7C879B',
    bgColor: {
      excellent: 'rgba(0,203,184,0.1)',
      good: 'rgba(41,195,255,0.1)',
      bad: 'rgba(255,106,76,0.1)',
      wait: 'rgba(124,135,155,0.1)',
    },
  },
  // 快开与下发指令的映射
  secondFunctionsControlMap: {
    waterions: {
      code: FA.apiCode.waterions,
      name: '净离子',
      icon: baseImageUrl + '/ctrl8/FA/icon_waterions_off.png',
      activeIcon: baseImageUrl + '/ctrl8/FA/icon_waterions_on.png',
      controlValue: 'waterions',
      // 特殊兼容
      special: {
        name: '负离子',
        activeIcon: baseImageUrl+"/ctrl8/FA/icon_anion_on.png",
        icon: baseImageUrl+"/ctrl8/FA/icon_anion_off.png"
      }
    },
    lock: {
      code: FA.apiCode.lock,
      name: '童锁',
      icon: baseImageUrl + '/ctrl8/FA/icon_lock_off.png',
      activeIcon: baseImageUrl + '/ctrl8/FA/icon_lock_on.png',
      controlValue: 'lock',
    },
    voice: {
      code: FA.apiCode.voice,
      name: '声音',
      icon: baseImageUrl + '/ctrl8/FA/icon_voice_close_buzzer.png',
      activeIcon: baseImageUrl + '/ctrl8/FA/icon_voice_open_buzzer.png',
      controlValue: 'voice',
    },
    anion: {
      code: FA.apiCode.anion,
      name: '负离子',
      icon: baseImageUrl + '/ctrl8/FA/icon_anion_off.png',
      activeIcon: baseImageUrl + '/ctrl8/FA/icon_anion_on.png',
      controlValue: 'anion',
    },
    displayOnOff: {
      code: FA.apiCode.displayOnOff,
      name: '屏幕显示',
      icon: baseImageUrl + '/ctrl5/T0xFA/v3/display_on_off_on_new.png',
      activeIcon: baseImageUrl + '/ctrl5/T0xFA/v3/display_on_off_off_new.png',
      controlValue: 'display_on_off',
    },
    humidify: {
      code: FA.apiCode.humidify,
      name: '清凉风',
      icon: baseImageUrl + '/ctrl5/T0xFA/v3/humidify_off.png',
      activeIcon: baseImageUrl + '/ctrl5/T0xFA/v3/humidify_on.png',
      controlValue: 'humidify',
    },
  },
  // 指令参数
  powerValue: {
    power: {
      on: 'on',
      off: 'off',
    },
    waterions: {
      on: 'on',
      off: 'off',
    },
    anion: {
      on: 'on',
      off: 'off',
    },
    voice: {
      on: 'open_buzzer',
      off: 'close_buzzer',
    },
    lock: {
      on: 'on',
      off: 'off',
    },
    display_on_off: {
      on: 'off',
      off: 'on',
    },
    humidify: {
      on: '1',
      off: 'off'
    },
  },

  // 补全AO
  getAO(modelNumber) {
    let rtn = modelNumber
    if (modelNumber) {
      for (let i = rtn.length; i < 8; i++) {
        rtn = '0' + rtn
      }
    }
    return rtn
  },
}

export function getWaterionsName_DEVICE_DATA(sn8){
  let rtn = DeviceData.secondFunctionsControlMap.waterions.name
  switch (sn8) {
    case '5600119Z':
      rtn = '负离子'
      break;
  }
  return rtn
}
export function getWaterionsIsSpecial_DEVICE_DATA(sn8){
  let rtn = false
  if(sn8==='5600119Z'){
    rtn = true
  }
  return rtn
}
