export const Dict = {
  requestParam: {
    bigVer: 5,
  },
  // 功能编码
  functions: {
    code: {
      power: 0, // 开关
      childLock: 1, // 童锁
      mode: 2, // 模式
      temperature: 3, // 设置温度
      gear: 4, // 档位
      timeout: 5, // 定时
      screenDisplay: 8, // 屏显
      sound: 9, // 声音
      statistics: 11, // 数据统计
      advancedFunctions: 12, // 高级功能
      flameControl: 15, // 火焰调节
      aiScene: 16, // 智能场景
      disinfect: 17, // 杀菌
      coldAndWarm: 18, // 冷暖档位
      shake: 19, // 摇头
    },
    key: {
      power: 'power', // 开关
      childLock: 'lock', // 童锁
      mode: 'mode', // 模式
      temperature: 'temp', // 设置温度
      gear: 'gear', // 档位
      timeout: 'timing', // 定时
      screenDisplay: 'displayOnOff', // 屏显
      sound: 'voice', // 声音,
      fireLight: 'fireLight', // 氛围灯,
      statistics: 'showStatistics', // 数据统计
      advancedFunctions: 'enableAdvanced', // 高级功能
      flameControl: 'fireLight', // 火焰调节
      aiScene: 'scene', // 智能场景
      disinfect: 'disinfect', // 杀菌
      coldAndWarm: 'coldAndWarm', // 冷暖档位
      shake: 'shake', // yaotou
      udShake: 'udShake', // yaotou
      humidify: 'humidify', // 加湿
    },
  },
  // 处理错误信息
  handleErrorMsg: (errCode) => {
    let rtn = '系统提示: ' + errCode
    if (errCode == 1306) {
      rtn = '设备未响应'
    }
    if (errCode == 1307) {
      rtn = '设备已离线，请检查网络状态'
    }
    return rtn
  },
  // 在线状态
  onlineStatus: {
    online: 1,
    offline: 0,
  },
}
