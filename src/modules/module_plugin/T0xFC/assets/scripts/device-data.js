export const DeviceData = {
  baseImageUrl: 'http://ce-cdn.oss-cn-hangzhou.aliyuncs.com/ccs/icon',
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
  functionsType: {
    power: 'power', // 电源
    mode: 'mode', // 模式
    gear: 'gear', // 风速
    detectOnOff: 'detectOnOff', // 检测
    timing: 'timing', // 定时
    brightLed: 'brightLed', // 亮度
    voiceOnOff: 'voiceOnOff', // 声音
    childLock: 'childLock', // 童锁
    anion: 'anion', // 负离子
    hostingOnOff: 'hostingOnOff', // 智能托管
    waterions: 'waterions', //净离子
    lightColor: 'light_bind', //氛围灯
    lightEnable: 'lightEnable', //氛围灯
    humidify: 'humidify', //湿度,
    doubleEffectSterilize: 'doubleEffectSterilize', // 双效杀菌
  },
  secondFunctionsControlMap: {
    waterions: { iconName: 'waterions', controlValue: 'waterions' },
    childLock: { iconName: 'lock', controlValue: 'lock' },
    voiceOnOff: { iconName: 'voice', controlValue: 'buzzer' },
    anion: { iconName: 'anion', controlValue: 'anion' },
  },
  secondFunctionsNameMap: {
    waterions: '净离子',
    childLock: '童锁',
    voiceOnOff: '声音',
    anion: '负离子',
  },
  powerValue: {
    power: {
      on: 'on',
      off: 'off',
    },
    powerOnTimer: {
      on: 'on',
      off: 'off',
    },
    powerOffTimer: {
      on: 'on',
      off: 'off',
    },
    anion: {
      on: 'on',
      off: 'off',
    },
    childLock: {
      on: 'on',
      off: 'off',
    },
    hostingOnOff: {
      on: 'on',
      off: 'off',
    },
    waterions: {
      on: 'on',
      off: 'off',
    },
    voiceOnOff: {
      on: 'on',
      off: 'off',
    },
    uvEnable: {
      on: 'on',
      off: 'off',
    },
    sterilizeEnable: {
      on: 'on',
      off: 'off',
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
