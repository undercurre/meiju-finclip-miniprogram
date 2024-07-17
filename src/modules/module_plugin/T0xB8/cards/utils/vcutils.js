// import { imgBaseUrl, imageApi } from '../../../../api.js'
let app = getApp()
const environment = app.getGlobalConfig().environment
const IMAGE_SERVER = environment == 'prod' ? 'https://www.smartmidea.net/projects/meiju-lite-assets' : 'https://www.smartmidea.net/projects/sit/meiju-lite-assets'
//历史
//const VC_IMAGE_ROOT_URL = imageApi.getImagePath.url + '/0xB8/'
const VC_IMAGE_ROOT_URL = IMAGE_SERVER + '/plugin/0xB8/'
//const VC_IMAGE_ROOT_URL = "http://127.0.0.1:5500/";
var VC_WORK_STATE = {
    /**回充中 */
    workstate_recharging: 'charge',
    workstate_recharging_w11: 'charging',
    /**工作中 */
    workstate_work: 'work',
    workstate_work_w11: 'map_searching',
    /**停止 */
    workstate_standby: 'stop',
    /**充电中（回充座） */
    workstate_charging: 'charging_on_dock',
    /**预约任务完成 */
    workstate_orderFinish: 'reserve_task_finished',
    /**充电完成 */
    workstate_chargingComplete: 'charge_finish',
    /**直流充电中(接线) */
    workstate_chargewithline: 'charging_with_wire',
    /** 暂停 */
    workstate_pause: 'pause',
    workstate_pause_w11: 'clean_pause',
    /** 休眠 */
    workstate_sleep: 'sleep',
    /**暂时未用到 重定位中 */
    workstate_relocate: 'relocate',
    /**暂时未用到 等待制作电解水 */
    workstate_waitingWaterMaking: 'waiting_water_making',
    /** 集尘中 */
    workstate_dusting: 'dusting',
    /**暂时未用到 回去集尘中 */
    workstate_reDusting: 're_dusting',
    /** 故障 */
    work_error: 'error',
    //w11
    /** 返回清洁抹布中 */ 
    workstate_back_cleanMop_w11: 'back_cleanMop',
    /** 返回清洁抹布暂停 */ 
    workstate_cleanMop_pause_w11: 'cleanMop_pause',
    /** 手动控制 */ 
    workstate_manual_control_w11: 'manual_control',
    /** 在站上 */ 
    workstate_on_base_w11: 'on_base',
    /** 在站上子状态 */
    // 注水
    workstate_inject_water: 'inject_water',
    // 抹布清洁
    workstate_mop_clear: 'mop_clear',
    // 抹布风干
    workstate_mop_drying: 'mop_drying',
    // 抹布烘干
    workstate_mop_hot_drying: 'mop_hot_drying',
    // 充电中
    workstate_charging_w11: 'charging',
    // 充电完成
    workstate_charge_finish: 'charge_finish',
    // 水站异常
    workstate_station_error: 'station_error',
}
var VC_WROK_MODE = {
    workmode_zigzag: 'arc',
    workmode_edge: 'edge',
    workmode_area: 'area',
    workmode_auto: 'auto', //全屋清扫\自动清扫
    workmode_zone_rect: 'zone_rect', //选区-添加区域清扫
    workmode_zone_index: 'zone_index' //分房间清扫
}

var VC_Button_tag = {
    /**有顺序 */
    clean_tag: '1_clean_button_tag',
    mode_tag: '2_modeswitch_button_tag',
    recharge_tag: '3_recharge_button_tag',
    mode_zigzag_tag: '4_mode_zigzag_tag',
    mode_edge_tag: '5_mode_edge_tag',
    mode_area_tag: '6_mode_area_tag'
}
var VC_CLEAN_ICON_MAP = {
    "4_mode_zigzag_tag": {
        img:"vc-mode-zigzag.png",
        title:"模式|弓形"
    },
    "5_mode_edge_tag": {
        img:"vc-mode-edge.png",
        title:"模式|区域"
    },
    "6_mode_area_tag":{
        img: "vc-mode-area.png",
        title:"模式|沿边"
    },
    "arc": {
        img:"vc-mode-zigzag.png",
        title:"模式|弓形",
        tag:"4_mode_zigzag_tag"
    },
    "edge": {
        img:"vc-mode-edge.png",
        title:"模式|区域",
        tag:"5_mode_edge_tag"
    },
    "area":{
        img: "vc-mode-area.png",
        title:"模式|沿边",
        tag:"6_mode_area_tag"
    },
}
const suction_base_data=[
    {
        imgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level1.png",
        selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level1-selected.png",
        value: "low"
    }, {
        imgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level2.png",
        selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level2-selected.png",
        value: "soft"
    }, {
        imgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level3.png",
        selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level3-selected.png",
        value: "normal"
    }, {
        imgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level4.png",
        selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level4-selected.png",
        value: "high"
    },
    {
        imgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level1.png",
        selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level1-selected.png",
        value: "off"
    },
    {
      imgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level1.png",
      selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level1-selected.png",
      value: "soft"
  },
    {
      imgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level2.png",
      selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level2-selected.png",
      value: "normal"
    },
    {
      imgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level3.png",
      selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level3-selected.png",
      value: "high"
    },
    {
      imgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level4.png",
      selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-suction-level4-selected.png",
      value: "super"
  },
]
const water_base_data=[
    {
        imgUrl: VC_IMAGE_ROOT_URL + "vc-water-level1.png",
        selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-water-level1-selected.png",
        value: "off"
    }, {
        imgUrl: VC_IMAGE_ROOT_URL + "vc-water-level2.png",
        selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-water-level2-selected.png",
        value: "low"
    }, {
        imgUrl: VC_IMAGE_ROOT_URL + "vc-water-level3.png",
        selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-water-level3-selected.png",
        value: "normal"
    }, {
        imgUrl: VC_IMAGE_ROOT_URL + "vc-water-level4.png",
        selectedImgUrl: VC_IMAGE_ROOT_URL + "vc-water-level4-selected.png",
        value: "high"
    }
]
const VC_SN8_MAP = {
    '75000461':"m6",
    '7500046P':"m6",
    '7500046Q':"m6",
    '7500046N':"m6",
    '7500046Y':"m6",
    '75000468':"m6",
    '7500046V':"m6",
    '7500047M':'w11',
    '7500049G':'w11',
    '75000491':'w11',

}
var VC_SUCTION_CONFIG = {
    m6:[suction_base_data[0],suction_base_data[1],suction_base_data[2]],
    m6_above :[suction_base_data[0],suction_base_data[1],suction_base_data[2],suction_base_data[3]],
    planned:[suction_base_data[0],suction_base_data[2],suction_base_data[3]],
    w11:[suction_base_data[1],suction_base_data[2],suction_base_data[3]],
}
var VC_WATER_CONFIG = {
    planned:[water_base_data[1],water_base_data[2],water_base_data[3]],
    w11:[water_base_data[1],water_base_data[2],water_base_data[3]],
}
const ControlButtonType = 1000;
const ControlButtonState = 2000;
const ControlButtonModeState = 3000;

var VC_ControlButton_type = {
    /**只有选中，未选中，disable三种状态 */
    control_button_type_normal: 1000 + 0,
    /**模式选择，除了以上三种状态，还有模式状态 */
    control_button_type_mode: 1000 + 1,
}
var VC_ControlButton_state = {
    /**普通模式 未选中 */
    control_button_state_normal: ControlButtonState + 0,
    control_button_state_select: ControlButtonState + 1,
    control_button_state_disable: ControlButtonState + 2,
}
var VC_ControlButton_modestate = {
    control_button_modestate_mode1: ControlButtonModeState + 0,
    control_button_modestate_mode2: ControlButtonModeState + 1,
    control_button_modestate_mode3: ControlButtonModeState + 2,
    control_button_modestate_mode4: ControlButtonModeState + 3,
}
var VC_FAN_LEVEL = {
    FL_OFF: 'off',
    FL_LOW: 'low',
    FL_SOFT: 'soft',
    FL_NORMAL: 'normal',
    FL_HIGH: 'high'
}
var VC_WATER_LEVEL = {
    WL_OFF: 'off',
    WL_LOW: 'low',
    WL_NORMAL: 'normal',
    WL_HIGH: 'high'
}
var VC_PLANNED_ROBOT_ERROR = {
    fix_dust: {
        name: "尘盒未安装",
        type: 2
    },
    fix_wheel_hang: {
        name: "机器人悬空",
        type: 2
    },
    fix_wheel_overload: {
        name: "驱动轮被卡住",
        type: 2
    },
    fix_side_brush_overload: {
        name: "边刷被卡住",
        type: 2
    },
    fix_roll_brush_overload: {
        name: "滚刷被卡住",
        type: 2
    },
    fix_dust_engine: {
        name: "吸尘电机异常",
        type: 2
    },
    fix_front_panel: {
        name: "碰撞板被卡住",
        type: 2
    },
    fix_radar_mask: {
        name: "雷达罩故障",
        type: 2
    },
    fix_drop_sensor: {
        name: "跌落传感器故障",
        type: 2
    },
    fix_low_battery: {
        name: "电池电量过低",
        type: 1
    },
    fix_abnormal_posture: {
        name: "启动时太过倾斜",
        type: 2
    },
    fix_laser_sensor: {
        name: "激光传感器被挡",
        type: 2
    },
    fix_edge_sensor: {
        name: "沿边传感器被挡",
        type: 2
    },
    fix_start_in_forbid_area: {
        name: "在禁区或虚拟墙上启动",
        type: 1
    },
    fix_start_in_strong_magnetic: {
        name: "在强磁场中启动",
        type: 2
    },
    fix_laser_sensor_blocked: {
        name: "激光传感器被卡住",
        type: 2
    },
    fix_mopping_board_dropped: {
        name: "拖地板掉落",
        type: 2
    },
    fix_slipping_and_jamming: {
        name: "打滑卡住故障",
        type: 2
    },
    fix_multiple_recharge_attempts: {
        name: "尝试多次回充对接失败",
        type: 1
    },
    fix_vibration_drag_overload: {
        name: "震动拖过载故障",
        type: 2
    },
    fix_electrolytic_water: {
        name: "电解水故障",
        type: 2
    },
    //重启类
    reboot_laser_comm_fail: {
        name: "激光传感器通讯异常",
        type: 2
    },
    reboot_robot_comm_fail: {
        name: "蓝牙连接状态异常",
        type: 2
    },
    reboot_inner_fail: {
        name: "机器内部错误（风机故障）",
        type: 2
    },
    //警告类
    reboot_inner_fail: {
        name: "地图重定位失败",
        type: 1
    },
    reboot_inner_fail: {
        name: "电量不足自动回充",
        type: 1
    },
    reboot_inner_fail: {
        name: "尘满提示",
        type: 2
    },
    reboot_inner_fail: {
        name: "缺水提示",
        type: 1
    },
    reboot_inner_fail: {
        name: "尝试多次回充对接失败",
        type: 1
    },
    warn_down_sensor_blocked: {
        name: "下视传感器有遮挡",
        type: 2
    },
    warn_abnormal_battery_temperature: {
        name: "电池温度异常",
        type: 1
    },
    warn_rag_lifting: {
        name: "抹布升降未到位提示",
        type: 1
    },
    warn_dust_collection_interrupt: {
        name: "集尘被中断",
        type: 1
    },
    warn_station_dust_blockage: {
        name: "站体集尘故障（尘堵）",
        type: 2
    },
    warn_station_upper_cover_open: {
        name: "站体集尘故障（上盖开启)",
        type: 2
    },
    warn_station_dust_bag_not_installed: {
        name: "站体集尘故障（未安装尘袋）",
        type: 2
    },
    //w11
    warn_reach_location_fail: {
        name: "无法到达目标点",
        type: 2,
    },
    warn_cache_fail: {
        name: "缓冲或下视触发",
        type: 2
    },
    warn_start_mop_in_carpet: {
        name: "地毯上启动拖地模式",
        type: 2
    },
    warn_start_in_virtual_wall: {
        name: "虚拟墙上启动",
        type: 2
    },
    warn_start_in_forbid_area: {
        name: "禁入禁区内启动",
        type: 2
    },
    warn_start_in_forbid_water_area: {
        name: "禁水禁区内启动",
        type: 2
    },
    //基站故障
    warn_comm_disconnect: {
        name: "蓝牙连接状态异常",
        type: 2,
        is_base:1
    },
    warn_machine_miss: {
        name: "无法清洗抹布）",
        type: 2,
        is_base:1
    },
    warn_vacuum_water_inject_fail: {
        name: "内部错误，请尝试重启基站或联系客服",
        type: 2,
        is_base:1
    },
    warn_sewage_box_full: {
        name: "污水箱已满",
        type: 2,
        is_base:1
    },
    warn_sewage_box_miss: {
        name: "污水箱安装不当",
        type: 2,
        is_base:1
    },
    warn_water_box_miss: {
        name: "拖布清洗槽安装不当",
        type: 2,
        is_base:1
    },
    warn_lack_of_water: {
        name: "清水箱缺水",
        type: 2,
        is_base:1
    },
    warn_close_power_fail: {
        name: "无法清洗抹布",
        type: 2,
        is_base:1
    },
    // warn_heat_module_fail: {
    //     name: "基站故障（加热烘干模块不工作）",
    //     type: 2,
    //     is_base:1
    // },
    warn_fan_fail: {
        name: "烘干电机异常",
        type: 2,
        is_base:1
    },
    warn_station_water_inject_fail: {
        name: "水站注水上升无法到位",
        type: 2,
        is_base:1
    },
    warn_station_water_box_full: {
        name: "水槽水满",
        type: 2,
        is_base:1
    },
    warn_vacuum_water_box_full: {
        name: "机器人水箱已满",
        type: 2,
        is_base:1
    },
    warn_vacuum_water_box_miss: {
        name: "机器人水箱未安装",
        type: 2,
        is_base:1
    },
    warn_vacuum_mop_miss: {
        name: "拖地圆盘安装不当",
        type: 2,
        is_base:1
    },
}

export {
    VC_SN8_MAP,
    VC_SUCTION_CONFIG,
    VC_WATER_CONFIG,
    VC_CLEAN_ICON_MAP,
    VC_IMAGE_ROOT_URL,
    VC_PLANNED_ROBOT_ERROR,
    VC_WORK_STATE,
    VC_WROK_MODE,

    VC_ControlButton_type,
    VC_ControlButton_state,
    VC_ControlButton_modestate,
    VC_Button_tag,
    VC_FAN_LEVEL,
    VC_WATER_LEVEL,
    suction_base_data,
    water_base_data
};