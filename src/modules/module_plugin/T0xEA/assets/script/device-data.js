export class DeviceData{
    static isDebug = false;
    static bigVer = 5;
    static onlineStatus = {
        online: 1,
        offline: 0
    }
    static themeColor = {
        excellent: '#00CBB8',
        good: '#29C3FF',
        bad: '#FF6A4C',
        wait: '#7C879B',
        bgColor: {
            excellent: 'rgba(0,203,184,0.1)',
            good: 'rgba(41,195,255,0.1)',
            bad: 'rgba(255,106,76,0.1)',
            wait: 'rgba(124,135,155,0.1)',
        }
    }
    static functionsType = {
        power: 'power',             // 电源
        mode: 'mode',               // 模式
        gear: 'gear',               // 风速
        detectOnOff: 'detectOnOff', // 检测
        timing: 'timing',           // 定时
        brightLed: 'brightLed',     // 亮度
        voiceOnOff: 'voiceOnOff',   // 声音
        childLock: 'childLock',     // 童锁
        anion: 'anion',             // 负离子
    }
    static powerValue = {
        power: {
            on: 'on',
            off: 'off'
        },
        powerOnTimer: {
            on: 'on',
            off: 'off'
        },
        powerOffTimer: {
            on: 'on',
            off: 'off'
        },
        anion: {
            on: 'on',
            off: 'off'
        },
        childLock: {
            on: 'on',
            off: 'off'
        }
    }

    // 补全AO
    static getAO(modelNumber){
        let rtn = modelNumber;
        if(modelNumber){
            for(let i=rtn.length;i<8;i++){
                rtn = '0'+rtn;
            }
        }
        return rtn;
    }

    static profileConvertData = {
      "mouthfeel": [
        {
          "string": "soft",
          "number": 1
        },
        {
          "string": "middle",
          "number": 2
        },
        {
          "string": "hard",
          "number": 3
        },
        {
          "string": "q_elastic",
          "number": 4
        },
        {
          "string": "crispy",
          "number": 5
        },
        {
          "string": "none",
          "number": 0
        }
      ],
    }
}
