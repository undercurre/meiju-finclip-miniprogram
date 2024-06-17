const STORAGE_KEY = {
  DEVICE_INFO: '__device_info__', // 设备信息
  DEVICE_CONFIG_TOTAL: '__device_config_total__', // 复式机整机配置
  DEVICE_CONFIG: '__device_config__', // 设备配置
  GLOBAL_CONFIG: '__global_config__', // 全局配置
  CURRENT_TUBE: '__current_tube__', // 当前筒
  DEVICE_STATUS: '__device_status__', // 设备状态
  USER_INFO: '__user_info__', // 用户信息
  BLE_CONNECT_INFO: '__ble_connect_info__', // 蓝牙是否已连接

  SHOW_LIQUID_LACK: '__show_liquid_lack__', // 缺液提醒
  SHOW_DETERGENT_LACK: '__show_detergent_lack__', // 洗涤剂缺液提醒
  SHOW_SOFTENER_LACK: '__show_softener_lack__', // 洗涤剂缺液提醒
  SHOW_FRAGRANCE_REMIND: '__show_fragrance_remind__', // 香薰使用提醒
  SHOW_CYCLE_SYNC_DESC: '__show_cycle_sync_desc__', // 一键同步功能说明
  SHOW_CYCLE_PROJECTION_DESC: '__show_cycle_projection_desc__', // 云程序投屏功能说明
  SHOW_OPEN_TUBE_CLEAN: '__show_open_tube_clean__', // 显示筒自洁打开提醒
  SHOW_OPEN_CYCLE_MEMORY: '__show_open_cycle_memroy__', // 显示程序记忆打开提醒
  SHOW_MASK_ACTIVITY: '__show_mask_activity__', // 显示mask活动弹框

  IS_LOCATION_SET: '__is_location_set__', // 已设置位置
  CITY_WEATHER_INFO: '__city_weather_info', // 城市、天气信息
  PAGE_INFO: '__page_info__', // 页面信息
  TUBE_LOCATION: '__tube_location__', // 筒位置

  SHOW_CYCLE_MEMORY_NEW: '__show_cycle_memory_new__', // 程序记忆new标志

  MY_CYCLE: '__my_cycle__', // 我的程序
  MY_CYCLE_TOTAL: '__my_cycle_total__', // 我的程序
  CURRENT_DIY_INFO: '__current_diy_info_', // 当前选择的DIY程序信息
  CURRENT_DIY_INFO_TOTAL: '__current_diy_info_total__',
  FAKE_DISINFECT_WASH_INFO: '__fake_disinfect_wash_info__', // 假消毒洗信息相关
  RESERVE_INFO: '__reserveInfo__', // 当前设备的预约信息，避免1分钟跳变
  RESERVE_INFO_TOTAL: '__reserveInfo_total__', // 当前设备的预约信息，避免1分钟跳变
  SPECIAL_NOTICE_CYCLE_LIST: '__special_notice_cycle_list__', // 已经弹出特殊提示框的cycle列表
  SPECIAL_NOTICE_CYCLE_LIST_TOTAL: '__special_notice_cycle_list_total__', // 已经弹出特殊提示框的cycle列表
  COLLECT_CYCLE: '__collect_cycle__', // 收藏程序
  COLLECT_CYCLE_TOTAL: '__collect_cycle_total__', // 收藏程序
  POWER_SAVE_INFO: '__power_save_info__', // 错峰省电
  USER_POSITION_INFO: '__user_position_info__', // 位置信息
  DIY_CYCLE: '__diy_cycle__', // DIY程序
  DIY_CYCLE_TOTAL: '__diy_cycle_total__' // DIY程序
};

const FOOTER_BUTTONS = {
  POWER_OFF: 1, // 关机
  POWER_ON: 2, // 开机
  START: 3, // 启动
  PAUSE: 4, // 暂停
  PAUSE_DISABLE: 13, // 暂停灰化
  RESERVE: 5, // 预约
  OFFLINE: 6, // 离线
  CANCEL_RESERVE: 7, //取消预约
  CANCEL_RESERVE_DISABLE: 8, // 取消预约灰化
  CYCLE_SYNC: 9, // 一键同步
  CANCEL_SYNC: 10, // 取消同步
  START_ON_PAUSE: 11, // 启动（已运行程序）
  RESERVE_DISABLE: 12, // 预约灰化（ai开启）
  CYCLE_PROJECTION: 14 // 程序投屏
};

const POWER = {
  ON: 1,
  OFF: 0
};

const STATUS = {
  READY: 1, // 准备就绪
  WEIGHING: 2, // 称重中
  PRE_WASH: 3, // 预洗中
  WASHING: 4, // 洗涤中
  RINSING: 5, // 漂洗中
  RESERVED: 6, // 已预约
  DEHYDRATING: 7, // 脱水中
  FINISH_WASH: 8, // 完成洗衣
  POWER_OFF: 9, // 已关机
  SOAKING: 10, // 浸泡中
  AIR_DRYING: 11, // 风干中
  DRYING: 12, // 烘干中
  HIGH_SPEED_DEHYDRATING: 13, // 高速脱水中
  HEATING: 14, // 加热中
  IRONING: 15, // 熨烫中
  COLD_WINDING: 16, // 吹冷风中
  TESTING_WATER_HARDNESS: 17, // 水硬度检测中
  IDENTIFYING_MATERIAL: 18, // 织物感知中
  AUTO_PUTTING: 19, // 自动投放中
  COOLING: 20, // 冷却中
  STERILIZING: 21, // 除菌中
  STEAMING: 22, // 蒸汽中
  NURSING: 23, // 护理中
  DETERGENT_PUTTING: 24, // 洗涤剂自动投放中
  SOFTENER_PUTTING: 25, // 柔顺剂自动投放中
  PRE_WASH_DETERGENT_PUTTING: 26, // 预洗-洗涤剂自动投放中
  PRE_WASH_SOFTENER_PUTTING: 27, // 预洗-柔顺剂自动投放中
  FRESHING: 28, // 清新中
  END_PREVENT_WRINKLE: 29, // 干衣机干衣完成除皱中
  CLEANING: 60, // 清洁中（用于筒自洁）

  FINISH_DRY: 90, // 干衣完成
  RESERVING: 91, // 预约中
  RESERVE_PAUSED: 92, // 预约暂停
  PAUSED: 98, // 已暂停
  DEVICE_FAULT: 99 // 设备出现故障
};

const STATUS_INFO = {
  DB: [
    {
      value: STATUS.READY,
      title: '准备就绪'
    },
    {
      value: STATUS.WEIGHING,
      title: '称重中'
    },
    {
      value: STATUS.PRE_WASH,
      title: '预洗中'
    },
    {
      value: STATUS.WASHING,
      title: '洗涤中'
    },
    {
      value: STATUS.RINSING,
      title: '漂洗中'
    },
    {
      value: STATUS.RESERVED,
      title: '已预约'
    },
    {
      value: STATUS.DEHYDRATING,
      title: '脱水中'
    },
    {
      value: STATUS.FINISH_WASH,
      title: '完成洗衣'
    },
    {
      value: STATUS.POWER_OFF,
      title: '已关机'
    },
    {
      value: STATUS.SOAKING,
      title: '浸泡中'
    },
    {
      value: STATUS.AIR_DRYING,
      title: '风干中'
    },
    {
      value: STATUS.DRYING,
      title: '烘干中'
    },
    {
      value: STATUS.HIGH_SPEED_DEHYDRATING,
      title: '高速脱水中'
    },
    {
      value: STATUS.HEATING,
      title: '加热中'
    },
    {
      value: STATUS.IRONING,
      title: '熨烫中'
    },
    {
      value: STATUS.COLD_WINDING,
      title: '吹冷风中'
    },
    {
      value: STATUS.TESTING_WATER_HARDNESS,
      title: '水硬度检测中'
    },
    {
      value: STATUS.IDENTIFYING_MATERIAL,
      title: '织物感知中'
    },
    {
      value: STATUS.AUTO_PUTTING,
      title: '自动投放中'
    },
    {
      value: STATUS.COOLING,
      title: '冷却中'
    },
    {
      value: STATUS.STERILIZING,
      title: '除菌中'
    },
    {
      value: STATUS.STEAMING,
      title: '蒸汽中'
    },
    {
      value: STATUS.NURSING,
      title: '护理中'
    },
    {
      value: STATUS.FRESHING,
      title: '清新中'
    },
    {
      value: STATUS.DETERGENT_PUTTING,
      title: '洗涤剂自动投放中'
    },
    {
      value: STATUS.SOFTENER_PUTTING,
      title: '柔顺剂自动投放中'
    },
    {
      value: STATUS.PRE_WASH_DETERGENT_PUTTING,
      title: '洗涤剂自动投放中'
    },
    {
      value: STATUS.PRE_WASH_SOFTENER_PUTTING,
      title: '柔顺剂自动投放中'
    },
    {
      value: STATUS.FINISH_DRY,
      title: '干衣完成'
    },
    {
      value: STATUS.RESERVING,
      title: '预约中'
    },
    {
      value: STATUS.RESERVE_PAUSED,
      title: '预约暂停'
    },
    {
      value: STATUS.PAUSED,
      title: '已暂停'
    },
    {
      value: STATUS.DEVICE_FAULT,
      title: '设备出现故障'
    },
    {
      value: STATUS.CLEANING,
      title: '清洁中'
    }
  ],
  DC: [
    {
      value: STATUS.READY,
      title: '准备就绪'
    },
    {
      value: STATUS.WEIGHING,
      title: '称重中'
    },
    {
      value: STATUS.PRE_WASH,
      title: '预洗中'
    },
    {
      value: STATUS.WASHING,
      title: '洗涤中'
    },
    {
      value: STATUS.RINSING,
      title: '漂洗中'
    },
    {
      value: STATUS.RESERVED,
      title: '已预约'
    },
    {
      value: STATUS.DEHYDRATING,
      title: '脱水中'
    },
    {
      value: STATUS.FINISH_WASH,
      title: '干衣完成'
    },
    {
      value: STATUS.POWER_OFF,
      title: '已关机'
    },
    {
      value: STATUS.SOAKING,
      title: '浸泡中'
    },
    {
      value: STATUS.AIR_DRYING,
      title: '风干中'
    },
    {
      value: STATUS.DRYING,
      title: '烘干中'
    },
    {
      value: STATUS.HIGH_SPEED_DEHYDRATING,
      title: '高速脱水中'
    },
    {
      value: STATUS.HEATING,
      title: '烘干中'
    },
    {
      value: STATUS.IRONING,
      title: '熨烫中'
    },
    {
      value: STATUS.COLD_WINDING,
      title: '吹冷风中'
    },
    {
      value: STATUS.TESTING_WATER_HARDNESS,
      title: '水硬度检测中'
    },
    {
      value: STATUS.IDENTIFYING_MATERIAL,
      title: '织物感知中'
    },
    {
      value: STATUS.AUTO_PUTTING,
      title: '自动投放中'
    },
    {
      value: STATUS.END_PREVENT_WRINKLE,
      title: '除皱中'
    },
    {
      value: STATUS.STERILIZING,
      title: '除菌中'
    },
    {
      value: STATUS.STEAMING,
      title: '蒸汽中'
    },
    {
      value: STATUS.NURSING,
      title: '护理中'
    },
    {
      value: STATUS.FRESHING,
      title: '清新中'
    },
    {
      value: STATUS.DETERGENT_PUTTING,
      title: '洗涤剂自动投放中'
    },
    {
      value: STATUS.SOFTENER_PUTTING,
      title: '柔顺剂自动投放中'
    },
    {
      value: STATUS.PRE_WASH_DETERGENT_PUTTING,
      title: '洗涤剂自动投放中'
    },
    {
      value: STATUS.PRE_WASH_SOFTENER_PUTTING,
      title: '柔顺剂自动投放中'
    },
    {
      value: STATUS.FINISH_DRY,
      title: '干衣完成'
    },
    {
      value: STATUS.RESERVING,
      title: '预约中'
    },
    {
      value: STATUS.RESERVE_PAUSED,
      title: '预约暂停'
    },
    {
      value: STATUS.PAUSED,
      title: '已暂停'
    },
    {
      value: STATUS.DEVICE_FAULT,
      title: '设备出现故障'
    }
  ],
  DA: [
    {
      value: STATUS.READY,
      title: '准备就绪'
    },
    {
      value: STATUS.WEIGHING,
      title: '称重中'
    },
    {
      value: STATUS.PRE_WASH,
      title: '预洗中'
    },
    {
      value: STATUS.WASHING,
      title: '洗涤中'
    },
    {
      value: STATUS.RINSING,
      title: '漂洗中'
    },
    {
      value: STATUS.RESERVED,
      title: '已预约'
    },
    {
      value: STATUS.DEHYDRATING,
      title: '脱水中'
    },
    {
      value: STATUS.FINISH_WASH,
      title: '完成洗衣'
    },
    {
      value: STATUS.POWER_OFF,
      title: '已关机'
    },
    {
      value: STATUS.SOAKING,
      title: '浸泡中'
    },
    {
      value: STATUS.AIR_DRYING,
      title: '风干中'
    },
    {
      value: STATUS.DRYING,
      title: '烘干中'
    },
    {
      value: STATUS.HIGH_SPEED_DEHYDRATING,
      title: '高速脱水中'
    },
    {
      value: STATUS.HEATING,
      title: '加热中'
    },
    {
      value: STATUS.IRONING,
      title: '熨烫中'
    },
    {
      value: STATUS.COLD_WINDING,
      title: '吹冷风中'
    },
    {
      value: STATUS.TESTING_WATER_HARDNESS,
      title: '水硬度检测中'
    },
    {
      value: STATUS.IDENTIFYING_MATERIAL,
      title: '织物感知中'
    },
    {
      value: STATUS.AUTO_PUTTING,
      title: '自动投放中'
    },
    {
      value: STATUS.COOLING,
      title: '冷却中'
    },
    {
      value: STATUS.STERILIZING,
      title: '除菌中'
    },
    {
      value: STATUS.STEAMING,
      title: '蒸汽中'
    },
    {
      value: STATUS.NURSING,
      title: '护理中'
    },
    {
      value: STATUS.FRESHING,
      title: '清新中'
    },
    {
      value: STATUS.DETERGENT_PUTTING,
      title: '洗涤剂自动投放中'
    },
    {
      value: STATUS.SOFTENER_PUTTING,
      title: '柔顺剂自动投放中'
    },
    {
      value: STATUS.PRE_WASH_DETERGENT_PUTTING,
      title: '洗涤剂自动投放中'
    },
    {
      value: STATUS.PRE_WASH_SOFTENER_PUTTING,
      title: '柔顺剂自动投放中'
    },
    {
      value: STATUS.FINISH_DRY,
      title: '干衣完成'
    },
    {
      value: STATUS.RESERVING,
      title: '预约中'
    },
    {
      value: STATUS.RESERVE_PAUSED,
      title: '预约暂停'
    },
    {
      value: STATUS.PAUSED,
      title: '已暂停'
    },
    {
      value: STATUS.DEVICE_FAULT,
      title: '设备出现故障'
    },
    {
      value: STATUS.CLEANING,
      title: '清洁中'
    }
  ]
};

const PAGE = {
  MAIN_PAGE: {
    PATH: 'device-pages/mainpage.js',
    VIEW_TAG: 'mainpage'
  },
  STANDBY: {
    PATH: 'device-pages/device-standby.js',
    VIEW_TAG: 'device-standby'
  },
  CYCLE_CENTER: {
    PATH: 'device-pages/device-cycle-center.js',
    VIEW_TAG: 'device-cycle-center'
  },
  CYCLE_SYNC: {
    PATH: 'device-pages/device-cycle-sync.js',
    VIEW_TAG: 'device-cycle-sync'
  },
  ELECTRICITY_WATER: {
    PATH: 'device-pages/device-electricity-water.js',
    VIEW_TAG: 'device-electricity-water'
  },
  FEATURE: {
    PATH: 'device-pages/device-feature.js',
    VIEW_TAG: 'device-feature'
  },
  INTELLIGENT_PUT: {
    PATH: 'device-pages/device-intelligent-put.js',
    VIEW_TAG: 'device-intelligent-put'
  },
  WASH_DRY_LINK: {
    PATH: 'device-pages/device-wash-dry-link.js',
    VIEW_TAG: 'device-wash-dry-link'
  },
  WASH_DRY_LINK_DESC: {
    PATH: 'device-pages/device-wash-dry-link-desc.js',
    VIEW_TAG: 'device-wash-dry-link-desc'
  },
  MORE_ITEMS: {
    PATH: 'device-pages/moreMenuItems.js',
    VIEW_TAG: 'moreMenuItems'
  },
  DIY_CYCLE_LIST: {
    PATH: 'device-pages/device-diy-cycle-list.js',
    VIEW_TAG: 'device-diy-cycle-list.js'
  },
  DIY_CYCLE_DETAIL: {
    PATH: 'device-pages/device-diy-cycle-detail.js',
    VIEW_TAG: 'device-diy-cycle-detail'
  },
  LOCATION_INFO: {
    PATH: 'device-pages/device-location-info.js',
    VIEW_TAG: 'device-location-info'
  },
  PHOTO_RECOGNITION: {
    PATH: 'device-pages/photo-recognition.js',
    VIEW_TAG: 'photo-recognition'
  },
  HEALTH_CHECK: {
    PATH: 'device-pages/device-health-check.js',
    VIEW_TAG: 'device-health-check'
  },
  HEALTH_CHECK_MATERIAL: {
    PATH: 'device-pages/device-health-material.js',
    VIEW_TAG: 'device-health-material'
  },
  HEALTH_CHECK_CLEANER: {
    PATH: 'device-pages/device-health-cleaner.js',
    VIEW_TAG: 'device-health-cleaner'
  }
};

const RETRY_COUNT = {
  DIY_CYCLE: 3,
  AI: 5
};

const CHANNEL = {
  BACK_TO_NATIVE: '__back_to_native__',
  DATA_CHANGE: '__data_change__',
  STORE_CHANGE: '__store_change__',
  USER_CONTROL_POWER: '__user_control_power__'
};

const STATUS_STEP_NAME = {
  FRESH: '清新',
  SOAK: '浸泡',
  PRE_WASH: '预洗',
  WASHING: '洗涤',
  RINSING: '漂洗',
  DEHYDRATING: '脱水',
  DRYING: '烘干'
};

const PARAM_ORDER = [
  'wash_time',
  'rinse',
  'spin_time',
  'water_level',
  'wash_waterlevel',
  'temperature',
  'dewatering_speed',
  'stains',
  'dryer',
  'detergent',
  'detergent_density',
  'softener',
  'softener_density',
  'spray_wash',
  'nightly',
  'speedy',
  'easy_ironing',
  'ultraviolet_lamp',
  'dry_time_new',
  'steam_level',
  'sterilize',
  'dry_level',
  'crease_resist',
  'material',
  'texture',
  'soak_wash',
  'strong_wash',
  'steam_wash'
];

const OPEN_TUBE_CLEAN_DESC = {
  DA: '是否开启桶自洁智能提醒功能?\n让洗衣机成为您的智慧管家，到期按时提醒您执行桶自洁，持续维护桶内健康。',
  DB: '是否开启筒自洁智能提醒功能?\n让洗衣机成为您的智慧管家，到期按时提醒您执行筒自洁，持续维护筒内健康。',
  DC: '是否开启筒自洁智能提醒功能?\n让干衣机成为您的智慧管家，到期按时提醒您执行筒自洁，持续维护筒内健康。',
  D9: '是否开启筒自洁智能提醒功能?\n让洗衣机成为您的智慧管家，到期按时提醒您执行筒自洁，持续维护筒内健康。'
};

const TUBE_CLEAN_TITLE = {
  DA: '桶自洁智能提醒',
  DB: '筒自洁智能提醒',
  DC: '筒自洁智能提醒',
  D9: '筒自洁智能提醒'
};

const TUBE_INFO_TEXT_OFF = {
  DA: '开启后，云管家持续监测内桶健康状况。',
  DB: '开启后，云管家持续监测内筒健康状况。',
  DC: '开启后，云管家持续监测内筒健康状况。',
  D9: '开启后，云管家持续监测内筒健康状况。'
};

const TUBE_INFO_TEXT_ON = {
  DA: '内桶健康持续监测中',
  DB: '内筒健康持续监测中',
  DC: '内筒健康持续监测中',
  D9: '内筒健康持续监测中'
};

const TUBE_CLEAN_ERROR_MSG = {
  DA: '桶自洁服务异常，请稍后再试~',
  DB: '筒自洁服务异常，请稍后再试~',
  DC: '筒自洁服务异常，请稍后再试~',
  D9: '筒自洁服务异常，请稍后再试~'
};

const TUBE_CLEAN_DESC = {
  DA: '开启该功能，当检测到需要桶自洁时，洗衣机将在洗衣完成后智能推送桶自洁提醒，同时将程序切换至桶自洁程序。运行桶自洁程序前，请取出桶内衣物。\n注:机器面板没有桶自洁程序时仅推送提醒。',
  DB: '开启该功能，当检测到需要筒自洁时，洗衣机将在洗衣完成后智能推送筒自洁提醒，同时将程序切换至筒自洁程序。运行筒自洁程序前，请取出筒内衣物。\n注:机械旋钮机型及面板无筒自洁程序的非机械旋钮机型仅推送提醒。',
  DC: '开启该功能，当检测到需要筒自洁时，干衣机将在干衣完成后智能推送筒自洁提醒，同时将程序切换至筒自洁程序。运行筒自洁程序前，请取出筒内衣物。\n注:机器面板没有筒自洁程序时仅推送提醒。',
  D9: '开启该功能，当检测到需要筒自洁时，干衣机将在干衣完成后智能推送筒自洁提醒，同时将程序切换至筒自洁程序。运行筒自洁程序前，请取出筒内衣物。\n注:机器面板没有筒自洁程序时仅推送提醒。'
};

const TUBE_STATUS_TEXT = {
  DA: [
    {
      min: Number.NEGATIVE_INFINITY,
      max: 0,
      msg: '桶内超干净'
    },
    {
      min: 1,
      max: 20,
      msg: '桶内很干净'
    },
    {
      min: 21,
      max: 40,
      msg: '桶内小脏，最好清洁一下'
    },
    {
      min: 41,
      max: 59,
      msg: '污垢警报！内桶该清洁啦'
    },
    {
      min: 60,
      max: Number.MAX_VALUE,
      msg: '污垢已超警戒线，急需清洁'
    }
  ],
  DB: [
    {
      min: Number.NEGATIVE_INFINITY,
      max: 0,
      msg: '筒内超干净'
    },
    {
      min: 1,
      max: 20,
      msg: '筒内很干净'
    },
    {
      min: 21,
      max: 40,
      msg: '筒内小脏，最好清洁一下'
    },
    {
      min: 41,
      max: 59,
      msg: '污垢警报！内筒该清洁啦'
    },
    {
      min: 60,
      max: Number.MAX_VALUE,
      msg: '污垢已超警戒线，急需清洁'
    }
  ],
  DC: [
    {
      min: Number.NEGATIVE_INFINITY,
      max: 0,
      msg: '筒内超干净'
    },
    {
      min: 1,
      max: 20,
      msg: '筒内很干净'
    },
    {
      min: 21,
      max: 40,
      msg: '筒内小脏，最好清洁一下'
    },
    {
      min: 41,
      max: 59,
      msg: '污垢警报！内筒该清洁啦'
    },
    {
      min: 60,
      max: Number.MAX_VALUE,
      msg: '污垢已超警戒线，急需清洁'
    }
  ],
  D9: [
    {
      min: Number.NEGATIVE_INFINITY,
      max: 0,
      msg: '筒内超干净'
    },
    {
      min: 1,
      max: 20,
      msg: '筒内很干净'
    },
    {
      min: 21,
      max: 40,
      msg: '筒内小脏，最好清洁一下'
    },
    {
      min: 41,
      max: 59,
      msg: '污垢警报！内筒该清洁啦'
    },
    {
      min: 60,
      max: Number.MAX_VALUE,
      msg: '污垢已超警戒线，急需清洁'
    }
  ]
};

// 重复点击时间间隔
const CLICK_INTERVAL = 1000;

export default {
  STORAGE_KEY,
  FOOTER_BUTTONS,
  PAGE,
  RETRY_COUNT,
  STATUS_STEP_NAME,
  CHANNEL,
  STATUS,
  STATUS_INFO,
  POWER,
  PARAM_ORDER,
  OPEN_TUBE_CLEAN_DESC,
  TUBE_CLEAN_TITLE,
  TUBE_INFO_TEXT_OFF,
  TUBE_INFO_TEXT_ON,
  TUBE_CLEAN_ERROR_MSG,
  TUBE_CLEAN_DESC,
  TUBE_STATUS_TEXT,
  CLICK_INTERVAL
};
