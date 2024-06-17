export default {
    out_water_tem: 0,                    // 出水温度  
    temperature: 0,                      // 温度  
    water_volume: 0,                     // 水流量  
    bathtub_water_level: 0,              // 浴缸模式设置水量  
    zero_cold_tem: 0,                    // 零冷水功能设置温度  
    bath_out_volume: 0,                  // 浴缸已放出水量  
    return_water_tem: 0,                 // 回水温度  
    change_litre: 0,                     // 智能变升升数  
    power_level: 0,                      // 当前比例阀开度档数  
    type_machine: 0,                     // 机型升数  
    person_tem_one: 0,                   // 专属水温1  
    person_tem_two: 0,                   // 专属水温2  
    person_tem_three: 0,                 // 专属水温3 
    in_water_tem: 0,                     // 进水温度  
    gas_lift: 0,                         // 燃气升数  
    zoro_cold_percent: 0,                // 零冷水百分比  
    gas_lift_precent: 0,                 // 燃气百分比/用气量  
    gesture_function_type: 0,            // 手势类型
    capacity: 1,                         // 变升类型
    cold_hold_duration: 0,               // 零冷水半管保温时间
    cold_conservation_duration: 0,       // 零冷水半管节能时间


    zero_single: 0,                      // 零冷水启动(单次循环)  
    zero_timing: 0,                      // 零冷水启动(定时循环)
    zero_dot: 0,                         // 零冷水启动(点动循环)

    error_code: 'none',                       // 故障识别

    power: 'off',                        // 开关机
    feedback: 'off',                         // 火焰情况
    change_litre_switch: 'off',          // 智能变升功能
    cold_water_master: 'off',            // 零冷水功能(总功能)
    cold_water: 'off',                    // 零冷水功能(单次循环)
    cold_water_dot: 'off',               // 零冷水功能(点动循环)
    cold_water_ai: 'off',               // 零冷水功能(AI循环)
    cold_water_pressure: 'off',               // 零冷水功能(增压循环)
    cold_water_conservation: 'off',               //零冷水半管节能模式
    bathtub: 'off',                      // 浴缸洗
    person_mode_one: 'off',              // 专属水温一
    person_mode_two: 'off',              // 专属水温二
    person_mode_three: 'off',            // 专属水温二
    gesture_function: 'off',             // 手势功能
    safe: 'off',                         // 安全防护
    appoint_master_switch: 'off',                // 24小时预约总开关
    appoint_mode: 'off',                      //预约方式， off(0)为24组预约；on(1)为4组预约

    mode: 'shower',                      // 模式--沐浴
    bubble: 0,                               //气泡水模式
    sterilization: 0,                               //UV杀菌模式


    appoint_one: '[0,0,0,0,0,0,0]',          // 预约一
    appoint_two: '[0,0,0,0,0,0,0]',          // 预约二
    appoint_three: '[0,0,0,0,0,0,0]',        // 预约三
    appoint_four: '[0,0,0,0,0,0,0]',         // 预约四
    appoint_morning: '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',         // 上午预约
    appoint_afternoon: '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',         // 下午预约

    /*-------------------系统参数---------------------------------*/
    key_ca: 0,   //
    key_fd: 0,
    key_pl: 0,
    key_he: 0,
    key_fc: 0,
    key_hb: 0,
    key_lf: 0,
    key_fa: 0,
    key_ph: 0,
    key_ne: 0,
    key_ua: 0,
    key_hu: 0,
    key_ub: 0,
    key_fp: 0,
    key_hs: 0,
    key_fl: 0,
    key_hl: 0,
    key_dh: 0,
    key_ch: 0,
    key_fh: 0,
    key_ff: 0,

}