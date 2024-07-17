// import getEnv from '../../../../utils/getEnv'
// const IMAGE_SERVER = getEnv() === 'SIT' ? 'https://www.smartmidea.net/projects/sit/colmo-assets/plugin/0xB8/' : 'https://www.smartmidea.net/projects/colmo-assets/plugin/0xB8/'; //图片地址
let app = getApp()
const environment = app.getGlobalConfig().environment
const IMAGE_SERVER = environment == 'prod' ? 'https://www.smartmidea.net/projects/meiju-lite-assets/plugin/0xB8/' : 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0xB8/'

export default {
  /**
   * 状态显示
   */
    modeList:[//模式
      {
        key: "sweep_and_mop",
        value: 0,
        title: "扫拖一体",
        icon: `${IMAGE_SERVER}sweep_and_mopping.svg`,
        selectIcon:`${IMAGE_SERVER}sweep_and_mopping_select.svg`,
      },
      {
        key: "sweep_then_mop",
        value: 3,
        title: "先扫后拖",
        icon: `${IMAGE_SERVER}sweep_then_mopping.svg`,
        selectIcon:`${IMAGE_SERVER}sweep_then_mopping_select.svg`,
      },
      {
        key: "sweep",
        value: 1,
        title: "仅扫地",
        icon: `${IMAGE_SERVER}only_sweep.svg`,
        selectIcon:`${IMAGE_SERVER}only_sweep_select.svg`,
      },
      {
        key: "mop",
        value: 2,
        title: "仅拖地",
        icon: `${IMAGE_SERVER}only_mopping.svg`,
        selectIcon:`${IMAGE_SERVER}only_mopping_select.svg`,
      },
    ],
    suctionList:[//吸力
      {
        key: "soft",
        value: "轻柔",
        title: "轻柔",
        icon: `${IMAGE_SERVER}suction_soft.svg`,
        selectIcon:`${IMAGE_SERVER}suction_soft_select.svg`,
        type: "吸力"
        
      },
      {
        key: "normal",
        value: "标准",
        title: "标准",
        icon: `${IMAGE_SERVER}suction_normal.svg`,
        selectIcon:`${IMAGE_SERVER}suction_normal_select.svg`,
        type: "吸力"
      },
      {
        key: "high",
        value: "强力",
        title: "强力",
        icon: `${IMAGE_SERVER}suction_high.svg`,
        selectIcon:`${IMAGE_SERVER}suction_high_select.svg`,
        type: "吸力"
      },
      {
        key: "super",
        value: "超强",
        title: "超强",
        icon: `${IMAGE_SERVER}suction_super.svg`,
        selectIcon:`${IMAGE_SERVER}suction_super_select.svg`,
        type: "吸力"
      },
    ],
    waterList:[//水量
      {
        key: "low",
        value: "低水量",
        title: "低水量",
        icon: `${IMAGE_SERVER}water_low.svg`,
        selectIcon:`${IMAGE_SERVER}water_low_select.svg`,
        type: "水量"

      },
      {
        key: "normal",
        value: "标准",
        title: "标准",
        icon: `${IMAGE_SERVER}water_normal.svg`,
        selectIcon:`${IMAGE_SERVER}water_normal_select.svg`,
        type: "水量"

      },
      {
        key: "high",
        value: "高水量",
        title: "高水量",
        icon: `${IMAGE_SERVER}water_high.svg`,
        selectIcon:`${IMAGE_SERVER}water_high_select.svg`,
        type: "水量"

      },
  
    ],
    mopModePreferenceList:[//抹布清洗速度
      {
        key: "fast",
        value: "快速",
        title: "快速",
        icon: `${IMAGE_SERVER}mop_fast.svg`,
        selectIcon:`${IMAGE_SERVER}mop_fast_select.svg`,
        type: "回洗频率"

      },
      {
        key: "normal",
        value: "日常",
        title: "日常",
        icon: `${IMAGE_SERVER}mop_normal.svg`,
        selectIcon: `${IMAGE_SERVER}mop_normal_select.svg`,
        type: "回洗频率"
      },
      {
        key: "deep",
        value: "深度",
        title: "深度",
        icon: `${IMAGE_SERVER}mop_deep.svg`,
        selectIcon:`${IMAGE_SERVER}mop_deep_select.svg`,
        type: "回洗频率"
      },
    ],

    dustTimesList:[//集尘频次
      {
        key: "1",
        value: "一次",
        title: "一次",
        icon: `${IMAGE_SERVER}dust_once.svg`,
        selectIcon:`${IMAGE_SERVER}dust_once_select.svg`,
        type: "集尘频率"
      },
      {
        key: "3",
        value: "三次",
        title: "三次",
        icon: `${IMAGE_SERVER}dust_three.svg`,
        selectIcon:`${IMAGE_SERVER}dust_three_select.svg`,
        type: "集尘频率"

      },
      {
        key: "5",
        value: "五次",
        title: "五次",
        icon: `${IMAGE_SERVER}dust_five.svg`,
        selectIcon:`${IMAGE_SERVER}dust_five_select.svg`,
        type: "集尘频率"

      },
      {
        key: "0",
        value: "永不",
        title: "永不",
        icon: `${IMAGE_SERVER}dust_never.svg`,
        selectIcon:`${IMAGE_SERVER}dust_never_select.svg`,
        type: "集尘频率"

      },
    ],
    
    mainWorkState: {//设备状态对应的中文
      "charging": "回充中",
      "charging_on_dock": "充电中",
      "charge_pause": "暂停回充",
      "charge_finish": "充电完成",
      "work": "工作中",
      "clean_pause": "清扫暂停",
      "stop": "待机中",
      "updating": "连接中",//升级
      "error": "故障中",
      "sleep": "休眠中",// 休眠中 
      "relocate": "定位中",
      "map_searching": "环境探索中",
      "map_searching_pause": "环境探索暂停",
      "clean_mop": "清洗拖布中",
      "clean_mop_pause": "暂停返回清洗拖布",
      "back_clean_mop": "返回清洁拖布中",
      "manual_control": "手动控制",
      "on_base": "在站中",//在站中
      "video_cruise": "巡航中",
      "video_cruise_pause": "巡航暂停",
    },

    stationWorkState: {//基站 子状态
      "free": "待机中",//水站空闲
      "charging": "充电中",
      "inject_water": "注水中",
      "clean_mop": "清洗拖布中",
      "dry_mop": "烘干中",//抹布风干（配合0x03_0x94协议确定是否开启热风）
      "hot_dry_mop": "烘干中",//抹布热风干
      "water_station_error": "故障中",//水站异常
      "charge_finish": "充电完成",
      "erp_mode": "休眠中",//充电中休眠
      "auto_clean": "基站自清洁中",
      "dust_collect": "集尘中",
      "cut_hair": "毛发切割中",
    },
    sleepWorkState: {//休眠子状态
      "default_sleeping": "休眠中",//默认休眠
      "pause_sleeping": "休眠中",//暂停休眠
      "standing_sleeping": "休眠中",//待机休眠
      "charge_pause_sleeping": "休眠中",//暂停回充休眠
      "return_station_pause_sleeping": "休眠中",//暂停回站休眠
      "cruise_pause_sleeping": "休眠中"//巡航暂停休眠
    },

   

    /**
     * 设备控制
     */
    //根据当前状态获取能够下一步操作的指令集，并通过当前下发的指令操作设备（小程序目前不支持视频巡航相关）
    // 对于小程而言 目前就只有4个控制 开始回充,暂停回充,自动清扫，暂停清扫,所以下面指令集根据这些指令映射 回充的key:charge, 清扫的key:auto_clean
    // 
    stateMatrix: {
      "charging": {//当前是回充中状态，可以操作 回充暂停 回充暂停  
        "charge": "charge_pause",//回充暂停
        "auto_clean": "auto_clean",//自动清扫
        "stop": "stop",//停止      
      },
      "charging_on_dock": {//当前是在充电座上充电 可以操作  自动清扫
        "auto_clean": "auto_clean",//自动清扫
      },
      "charge_pause": {//当前是暂停回充 可以操作  自动清扫  回充继续
        "auto_clean": "auto_clean",//自动清扫
        "charge": "charge_continue",//回充继续
        "stop": "stop",//停止
      },
      "charge_finish": {//当前是充电完成 可以操作 自动清扫
        "auto_clean": "auto_clean",//自动清扫
      },
      "work": {//当前是工作中 可以操作 回充 清扫暂停
        "charge": "charge",//回充
        "auto_clean": "auto_clean_pause",//清扫暂停
        "stop": "stop"//停止
      },
      "clean_pause": {//当前是清扫暂停 可以操作 回充 继续工作
        "charge": "charge",//回充
        "auto_clean": "auto_clean_continue",//继续工作
        "stop": "stop"//停止
      },
      "stop": {//当前是停止 可以操作 回充 自动清扫
        "charge": "charge",//回充
        "auto_clean": "auto_clean",//自动清扫
      },
      "error": {//当前是故障 可以操作 回充 自动清扫
        "charge": "charge",//回充
        "auto_clean": "auto_clean",//自动清扫
        "stop": "stop"//停止
      },
      "sleep": {//当前是休眠 可以操作 回充 自动清扫
        "charge": "charge",//回充
        "auto_clean": "auto_clean",//自动清扫
        "stop": "stop"//停止
      },
      "map_searching": {//当前是环境探索 可以操作 回充 暂停清扫
        "charge": "charge",//回充
        "auto_clean": "auto_clean_pause"// 暂停清扫
      },
      "map_searching_pause": {//当前是环境探索暂停 可以操作 回充 继续工作
        "charge": "charge",//回充
        "auto_clean": "auto_clean_continue",// 继续工作
        "stop": "stop"//停止
      },
      // todo 不确定回洗抹布的时候下发回充，待确认
      "back_clean_mop": {//当前是返回清扫拖布 可以操作 回充 自动清扫 暂停清扫
        "charge": "charge",//回充
        "auto_clean": "auto_clean",//自动清扫
        "pause_clean": "auto_clean_pause",// 暂停清扫
        "stop": "stop"//停止
      },
      // "clean_mop": {//当前是清扫拖布中 可以操作 回充 自动清扫 暂停清扫
      //   "stop": "stop"//停止
      // },
      "clean_mop_pause": {//当前是返回清洁拖布暂停  可以操作 回充 继续工作
        "charge": "charge",//回充
        "auto_clean": "auto_clean_continue",// 继续工作
        "stop": "stop"//停止
      },
      "manual_control": {//当前是手动控制 可以操作 回充 自动清扫
        "charge": "charge",//回充
        "auto_clean": "auto_clean",//自动清扫
      },
      "video_cruise": {//当前是视频巡航 可以操作 回充 自动清扫
        "charge": "charge",//回充
        "auto_clean": "auto_clean",//自动清扫
        "stop": "stop"//停止
      },
      "video_cruise_pause": {//当前是视频巡航暂停 可以操作 回充 自动清扫
        "charge": "charge",//回充
        "auto_clean": "auto_clean",//自动清扫
        "stop": "stop"//停止
      },

      // 在站中的状态 需要看子状态
      "dry_mop": {//当前子状态 是抹布风干 可以操作  自动清扫
        "auto_clean": "auto_clean",//自动清扫
        "stop": "stop"//停止
      },
      "hot_dry_mop": {//当前子状态 是抹布风干 可以操作  自动清扫
        "auto_clean": "auto_clean",//自动清扫
        "stop": "stop"//停止
      },
      "auto_clean": {//当前子状态 是基站自清洁 可以操作 回充 自动清扫
        "auto_clean": "auto_clean",//自动清扫
        "stop": "stop"//停止
      },
      "erp_mode": {
        "auto_clean": "auto_clean",//自动清扫
        "stop": "stop"//停止
      }
    }
  
}