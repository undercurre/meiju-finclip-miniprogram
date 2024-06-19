export class Dict{
    static requestParam = {
        bigVer: 5
    }
    // 功能编码
    static functions={
        code: {
            power: 0,                   // 开关
            childLock: 1,               // 童锁
            mode: 2,                    // 模式
            temperature: 3,             // 设置温度
            gear: 4,                    // 档位
            timeout: 5,                 // 定时
            screenDisplay: 8,           // 屏显
            sound: 9,                   // 声音
            statistics: 11,             // 数据统计
            advancedFunctions: 12,      // 高级功能
            flameControl: 15,           // 火焰调节
            aiScene: 16,                // 智能场景
        },
        key: {
            power: 'power',                   // 开关
            childLock: 'lock',               // 童锁
            mode: 'mode',                    // 模式
            temperature: 'temp',             // 设置温度
            gear: 'gear',                    // 档位
            timeout: 'timing',                 // 定时
            screenDisplay: 'displayOnOff',           // 屏显
            sound: 'voice',                   // 声音
            statistics: 'showStatistics',             // 数据统计
            advancedFunctions: 'enableAdvanced',      // 高级功能
            flameControl: 'fireLight',           // 火焰调节
            aiScene: 'scene',                // 智能场景
        }
    }
    // 在线状态
    static onlineStatus = {
        online: 1,
        offline: 0
    }
}
