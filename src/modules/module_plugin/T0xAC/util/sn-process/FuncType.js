import {
    CMD,
    STATUS
  } from "../Data";
const FuncMetaType = {
    HardDriver: 0, //电控功能
    Server: 1, //服务器功能
    Other: 2 //其他
};

const ProtocolVersion = {
    standard: 0, //经典协议
    attribute: 1 //新协议
};

/* btnType 区分按钮的类型，用于区分首页展示的功能区块 
windDirect 风向相关
windFeel 风感相关
other 除风向、风感的其他
ble 蓝牙特有功能 远程控制和密码锁
cell 展示在cell中的功能
fixed 固定功能 模式、风速、温度等
bottom-fixed: 底部固定功能
panel 以panel形式展示
kitchen 厨房空调特殊功能，备菜和快炒
*/ 
const FuncType = {
    DeviceSwitch: {
        name: "开关机",
        value: -1,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "power",    
        btnType: "bottom-fixed"    
    },
    ModeControl: {
        name: "模式控制",
        value: -2,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "mode",
        btnType: "bottom-fixed"
    },   
    WindSpeed: {
        name: "风速",
        value: -3,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "wind_speed",
        btnType: "fixed"
    },
    Temperature:{
        name: "温度",
        value: -4,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "temperature",
        btnType: "fixed"
    },
    SmallTemperature:{
        name: "设定温度小数位",
        value: -5,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "small_temperature",
        btnType: "fixed"
    },
    ModeWithNoAuto: {
      name: "模式控制", // 无制热
      value: -6,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "mode",
      btnType: "bottom-fixed"
    },
    RefrigerantCheck: {
        name: "制冷模式",
        value: 0,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "fixed"
    },
    HotMode: {
        name: "制热模式",
        value: 1,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "fixed"
    },
    WindMode: {
        name: "送风模式",
        value: 2,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "fixed"
    },
    AutoMode: {
        name: "自动模式",
        value: 3,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "fixed"
    },
    DryMode: {
        name: "抽湿模式",
        value: 4,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "fixed"
    },
    SmartRemoveWet: {
        name: "智能抽湿",
        value: 5,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "fixed"
    },
    ManualRemoveWet: {
        name: "手动抽湿",
        value: 6,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "fixed"
    },
    Dot5Support: {
        name: "0.5度支持",
        value: 7,
        metaType: FuncMetaType.Other,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "fixed"
    },
    NoPolar: {
        name: "无极调速",
        value: 8,
        metaType: FuncMetaType.Other,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "fixed"
    },
    OuterDoorDisplay: {
        name: "",
        value: 9,
        metaType: FuncMetaType.Other,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "fixed"
    },
    HumidityDisplay: {
        name: "湿度显示",
        value: 10,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "indoor_humidity",
        CMD: CMD.REQUESTHUMIDITYVALUE,
        btnType: "fixed"
    },
    UpSwipeWind: {
        name: "上摆风",
        value: 11,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "wind_swing_lr",
        btnType: "lrSwipeDirect"
    },
    DownSwipeWind: {
        name: "下摆风",
        value: 12,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "wind_swing_lr_under",
        btnType: "lrSwipeDirect"
    },
    UpDownSwipeWind: {
        name: "上下摆风",
        value: 13,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "wind_swing_ud",
        btnType:"udSwipeDirect"
    },
    LeftRightSwipeWind: {
        name: "左右摆风",
        value: 14,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "wind_swing_lr",
        btnType:"lrSwipeDirect"
    },    
    SwipeWind: {
        name: "摆风",
        value: 15,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "wind_swing_lr_under",
        btnType: "windDirect"
    },
    ECO: {
        name: "ECO 节能",
        value: 16,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "eco",
        btnType: "other"
    },
    Dry: {
        name: "干燥",
        value: 17,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "dry",
        btnType: "other"
    },
    ElectricHeat: {
        name: "电辅热",
        value: 18,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "ptc",
        btnType: "other"
    },
    Purify: {
        name: "净化",
        value: 19,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "purifier",
        btnType: "other"
    },
    NatureWind: {
        name: "自然风",
        value: 20,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "natural_wind",
        btnType: "windFeel"
    },
    ChildrenPreventCold: {
        name: "小天使",
        value: 21,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "prevent_cold",
        btnType: "other"
    },
    ReadyColdOrHot: {
        name: "",
        value: 22,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "pre_cool_hot",
        CMD:'',
        btnType: "other"
    },
    NoWindFeel: {
        name: "无风感",
        value: 23,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "no_wind_sense",
        CMD: CMD.CONTROLSWITCHNOWINDFEEL,
        btnType: "windFeel"
    },
    PMV: {
        name: "PMV",
        value: 24,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "pmv",
        btnType: "other"
    },
    SavingPower: {
        name: "省电",
        value: 25,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "power_saving",
        btnType: "other"
    },
    PurifyCheck: {
        name: "PM2.5检测",
        value: 26,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    SleepCurve: {
        name: "睡眠曲线",
        value: 27,
        metaType: [FuncMetaType.HardDriver, FuncMetaType.Server],
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    XiaoMiSmartCurve: {
        name: "小米曲线",
        value: 28,
        metaType: FuncMetaType.Other,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    MyXiaoMiBracelet: {
        name: "小米手环",
        value: 29,
        metaType: FuncMetaType.Other,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    BlueToothUpgrade: {
        name: "蓝牙在线升级",
        value: 30,
        metaType: FuncMetaType.Other,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "ble"
    },
    LadderControl: {
        name: "健康降温",
        value: 31,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    SelfLearn: {
        name: "自学习",
        value: 32,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    DeviceExamination: {
        name: "体检",
        value: 33,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    StrainerClean: {
        name: "滤网检测 - 强力防霉",
        value: 34,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    PowerManager: {
        name: "电量统计",
        value: 35,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "cell"
    },
    SafeInvade: {
        name: "安防",
        value: 39,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "security",
        CMD: '',
        btnType: "other",        
    },
    IntelControl: {
        name: "智能控制",
        value: 40,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "intelligent_control,nobody_energy_save,wind_straight,yb_wind_avoid,gesture_recognition_sen,gesture_recognition",
        CMD: '',
        btnType: "other",
    },
    GestureRecognize: {
        name: "手势识别",
        value: 41,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "gesture_recognition",
        CMD: '',
        btnType: "other",
    },
    SelfCleaning: {
        name: "自清洁",
        value: 42,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "self_clean",
        CMD: CMD.CONTROLSELFCLEANING,
        btnType: "cell",
    },
    ColdHot: {
        name: "冷热感",
        value: 43,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other",
    },
    Voice: {
        name: "语音功能",
        value: 44,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "voice_control_new",
        CMD: CMD.REQUESTINITCOLDEHOTSTATUS,
        btnType: "other",
    },
    YuyinVersion: {
        name: "语音版本升级",
        value: 45,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        CMD: '',
        btnType: "other",
    },
    PreventStraightLineWind: {
        name: "防直吹",
        value: 46,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "wind_avoid",
        CMD: '',
        btnType: "windFeel",
    },
    ChildrenPreventWind: {
        name: "儿童防冷风",
        value: 47,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "child_prevent_cold_wind",
        CMD: '',
        btnType: "windFeel",
    },
    UpDownNoWindFeel: {
        name: "",
        value: 48,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "windFeel",
    },
    Show: {
        name: "屏显",
        value: 49,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "screen_display",
        btnType: "other",
    },
    KeepWarm: {
        name: "保温功能",
        value: 50,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other",
    },
    ChangesTemperature: {
        name: "知冷暖",
        value: 51,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "cool_hot_sense",
        CMD: '',
        btnType: "other",
    },
    VideoDescription: {
        name: "视频说明书",
        value: 53,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other",
    },
    FreshAir: {
        name: "新风",
        value: 54,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "fresh_air",
        CMD: CMD.FRESHAIR,
        btnType: "bottom-fixed"
    },
    WaterWashing: {
        name: "水洗控制",
        value: 55,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "water_washing,water_pump,water_washing_manual,water_washing_time,water_washing_stage",
        CMD: '',
        btnType: "other"
    },
    PurifyPM: {
        name: "PM2.5数据显示",
        value: 56,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "pm25_value",
        CMD: CMD.CONTROLPM25DISPLAY,
        btnType: "other"
    },
    ExtremeWind: {
        name: "超远风",
        value: 60,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "extreme_wind,extreme_wind_level",
        CMD: '',
        btnType: "windFeel"
    },
    PromiseNoWind: {
        name: "远近无风感",
        value: 61,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "no_wind_sense",
        CMD: '',
        btnType: "windFeel"
    },
    SingleTuyere: {
        name: "单风口",
        value: 62,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "single_tuyere",
        CMD: '',
        btnType: "windFeel"
    },
    EvenWind: {
        name: "均匀风",
        value: 63,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "even_wind",
        CMD: '',
        btnType: "windFeel"
    },
    ParentalControl: {
        name: "家长控制",
        value: 64,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "parent_control,parent_control_temp_up,parent_control_temp_down",
        CMD: '',
        btnType: "other"
    },
    _16Support: {
        name: "支持16度",
        value: 66,
        metaType: FuncMetaType.Other,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    UpDownWindAngle: {
        name: "上下摆风角度",
        value: 68,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "wind_swing_ud_angle",
        CMD: CMD.UPDOWNANGLE,
        btnType:"udSwipeDirect"
    },
    LeftRightWindAngle: {
        name: "左右摆风角度",
        value: 69,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "wind_swing_lr_angle",
        CMD: CMD.LEFTRIGHTANGLE,
        btnType:"lrSwipeDirect"
    },
    AkeyControl: {
        name: "",
        value: 70,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    Volume: {
        name: "",
        value: 71,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    Time1TO1: {
        name: "",
        value: 72,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    FilterScreen: {
        name: "滤网脏堵",
        value: 74,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "filter_level,filter_value",
        CMD: '',
        btnType: "other"
    },
    IntelligentVoice: {
        name: "智能语音控制",
        value: 75,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "voice_control_new",
        CMD: '',
        btnType: "other"
    },
    Supercooling: {
        name: "智控温",
        value: 76,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "prevent_super_cool",
        CMD: CMD.Supercooling,
        btnType: "other"
    },
    MeComfort: {
        name: "",
        value: 78,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    ExclusiveMode: {
        name: "专属模式",
        value: 80,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "exclusive_mode",
        CMD: '',
        btnType: "other"
    },
    SwitchStrong: {
        name: "强劲",
        value: 81,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    AIIntelligentVoice: {
        name: "AI语音",
        value: 83,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "voice_control_new",
        CMD: '',
        btnType: "other"
    },
    RemoveBroadcast: {
        name: "播报开关",
        value: 84,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "voice_control_new",
        CMD: '',
        btnType: "other"
    },
    DeviceSwitchAppointment:{
        name:"预约开机/关机",
        value: 85,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "cell"
    },
    SmartWind:{
        name:"智能风感",
        value: 87,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "windFeel"
    },
    DistanceWindFree:{
        name:"远近无风感",
        value:88,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "no_wind_sense",
        CMD: CMD.CONTROLSWITCHNOWINDFEEL,
        btnType: "windFeel"
    },
    UpNoWindFeel: {
        name: "上无风感",
        value: 89,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "no_wind_sense",
        CMD: CMD.CONTROLSWITCHNOWINDFEEL,
        btnType: "windFeel"
    },
    DownNoWindFeel: {
        name: "下无风感",
        value: 90,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "no_wind_sense",
        CMD: CMD.CONTROLSWITCHNOWINDFEEL,
        btnType: "windFeel"
    },
    LeftNoWindFeel: {
        name: "左无风感",
        value: 91,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "windFeel"
    },
    RightNoWindFeel: {
        name: "右无风感",
        value: 92,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "windFeel"
    },
    Humidity: {
        name: "加湿",
        value: 93,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    Sound:{
        name: "声音",
        value: 94,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    TemperatureZone:{
        name: "温区控制",
        value: 95,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    NoPersonECO:{
        name: "无人节能",
        value: 96,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "nobody_energy_save",
        CMD: '',
        btnType: "other"
    },
    CSEco:{
        name: "舒省",
        value: 97,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "comfort_power_save",
        btnType: "other"
    },
    VoiceAuth:{
        name: "语音授权",
        value: 98,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    SafeInvadeSet:{
        name: "安防设置",
        value: 99,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    newFilterScreen:{
        name: "滤网检测与保养",
        value: 100,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    distanceNoWindFeel:{
        name: "远近无风感",
        value: 101,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "windFeel"
    },
    softWindFeel:{
        name: "柔风感",
        value: 102,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "gentle_wind_sense",
        CMD: CMD.FAWINDFEEL,
        btnType: "windFeel"
    },
    preventGetCold:{
        name: "儿童防着凉",
        value: 103,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "child_prevent_cold_wind",
        btnType: "windFeel"
    },
    WindBlowing:{
        name: "防直吹",
        value: 104,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "prevent_straight_wind",
        CMD: CMD.NONDIRECTWIND,
        btnType: "windFeel"
    },
    WindStraight:{
        name: "风吹人",
        value: 105,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "wind_straight",
        CMD: '',
        btnType: "windFeel"
    },
    familyNumber:{
        name: "",
        value: 106,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "face_register",
        CMD: '',
        btnType: "other"
    },
    VideoInvade:{
        name: "视频监控",
        value: 107,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "",
        CMD: '',
        btnType: "other"
    },
    YB100WindAvoid:{
        name: "风避人",
        value: 111,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "wind_avoid",
        CMD: '',
        btnType: "windFeel"
    },
    WisdomWind:{
        name: "智慧风",
        value: 112,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "intelligent_wind",
        CMD: '',
        btnType: "windFeel"
    },
    VolumeEC: {
        name: "音量功能",
        value: 113,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "volume_control",
        CMD: '',
        btnType: "other"
    },
    ChoosePronunciation:{
        name: "发音人功能",
        value: 114,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        CMD: '',
        btnType: "other"
    },
    LeftRightWindBlowing:{
        name: "左右防直吹",
        value: 115,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "prevent_straight_wind,prevent_straight_wind_lr",
        CMD: CMD.NONDIRECTWINDTYPE,
        btnType: "windFeel"
    },
    UpDownLeftRightWindAngle: {
        name: "上下摆风角度",
        value: 116,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "wind_swing_ud_angle,wind_swing_lr_angle",
        CMD: '',
        btnType: "windDirect"
    },
    MyAkeyControl:{
        name: "我的开关设置",
        value: 117,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    MusicAuth:{
        name: "酷狗音乐授权",
        value: 118,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    AutoManualFreshAir: {
        name: "新风",
        value: 119,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "fresh_air,fresh_air_mode,fresh_air_fan_speed",
        CMD: '',
        btnType: "bottom-fixed"
    },
    AirQualityReport:{
        name: "空气质量报告",
        value: 120,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    WindBlowingDA400:{
        name: "防直吹",//此防直吹不限制模式开启
        value: 121,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "prevent_straight_wind",
        CMD: '',
        btnType: "windFeel"
    },
    ChildrenPreventWindAuto:{
        name: "主动防冷风",
        value: 122,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "child_prevent_cold_wind",
        CMD: '',
        btnType: "windFeel"
    },
    CryGuardian: {
        name: "啼哭监护",
        value: 123,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    Degerming:{
        name: "除菌",
        value: 124,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "degerming",
        CMD: CMD.DEGERMING,
        btnType: "other"
    },
    Localism:{
        name: "方言",
        value: 125,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    WisdomCleaning: {
        name: "智清洁",
        value: 126,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "self_clean",
        CMD: CMD.CONTROLSELFCLEANING,
        btnType: "cell"
    },
    MessageRemind: {
        name: "消息提醒",
        value: 127,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "",
        CMD: '',
        btnType: "other"
    },
    SleepCurveServer: {
        name: "睡眠曲线",
        value: 128,
        metaType: [FuncMetaType.HardDriver, FuncMetaType.Server],
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        CMD: '',
        btnType: "other"
    },
    UpDownWindBlowing:{
        name: "上下防直吹",
        value: 129,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "prevent_straight_wind,prevent_straight_wind_lr",
        CMD: CMD.NONDIRECTWINDTYPE,
        btnType: "windFeel"
    },
    UpDownAroundWind:{
        name: "上下环绕风",
        value: 130,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "wind_around,wind_around_ud",
        CMD: CMD.UDAROUNDWIND,
        btnType: "windFeel"
    },
    WindTop:{
        name: "顶出风",
        value: 131,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "wind_top",
        CMD: '',
        btnType: "windFeel"
    },
    WindBlowingCool:{
        name: "防直吹",
        value: 132,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "prevent_straight_wind",
        CMD: '',
        btnType: "windFeel"
    },
    MonthHealthReport: {
        name: "每月健康报告",
        value: 133,
        metaType: FuncMetaType.Server,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "",
        CMD: '',
        btnType: "other"
    },
    AtmosphereLamp: {
        name: "灯光",
        value: 134,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "light",
        CMD: '',
        btnType: "other"
    },
    Quietness:{
        name: "静眠",
        value: 135,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "power_saving",
        btnType: "other"
    },
    ChildLock:{
        name: "童锁",
        value: 136,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "child_lock",
        CMD: '',
        btnType: "other"
    },
    NaturalTalk:{
        name: "自然对话模式",
        value: 137,
        metaType: [FuncMetaType.HardDriver, FuncMetaType.Server],
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    ScreenRemind:{
        name: "滤网",
        value: 137,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    WaterFullFault:{
        name: "水满",
        value: 138,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "other"
    },
    Anion: {
        name: "负离子",
        value: 139,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "purifier",
        btnType: "other"
    },
    BuzzerAll:{
        name: "声音",
        value: 140,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "buzzer_all",
        CMD: '',
        btnType: "other"
    },
    IotPowerSave: {
        name: "空调节能",
        value: 150,
        metaType: [FuncMetaType.HardDriver, FuncMetaType.Server],
        protocolVersion: ProtocolVersion.standard,
        luaKey: "iot_power_save",
        btnType: "other"
    },
    MultiWakeup: {
        name: "唯一唤醒",
        value: 151,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "multi_wakeup",
        btnType: "other"
    },
    HotAsepticSelfCleaning: {
        name: "热除菌",
        value: 152,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "high_temp_remove_odor_alone",
        CMD: '',
        btnType: "other"
    },
    HotWisdomCleaning:{
        name: "智清洁",
        value: 153,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "self_clean",
        CMD: '',
        btnType: "cell"
    },
    AppointmentSwitchOn:{
        name: "定时开",
        value: 154,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "appointment_switch_on",
        btnType: "cell"
    },
    AppointmentSwitchOff:{
        name: "定时关",
        value: 155,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "appointment_switch_off",
        btnType: "cell"
    },
    InitWifi:{
        name: "WIFI", // 起热点
        value: 156,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "init_wifi",
        btnType: "ble"
    },
    AboutDevice:{
        name: "AboutDevice", // 更多
        value: 157,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "about_device",
        btnType: "cell"
    },
    Advice:{
        name: "Advice", // 更多
        value: 158,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "advice",
        btnType: "cell"
    },
    OldPeopleMode:{
        name: "OldPeopleMode", // 老人模式
        value: 159,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "OldPeopleMode",
        btnType: "other"
    },
    NewRefrigerantCheck:{
        name: "NewRefrigerantCheck", // 可单独关的制冷
        value: 160,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "NewRefrigerantCheck",
        CMD: '',
        btnType: "other"
    },
    NewDryMode:{
        name: "NewDryMode", // 可单独关的抽湿
        value: 161,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "NewDryMode",
        CMD: '',
        btnType: "other"
    },
    NewHotMode:{
        name: "NewHotMode", // 可单独关的制热
        value: 162,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "NewHotMode",
        CMD: '',
        btnType: "other"
    },    
    SafeMode:{
        name: "SafeMode", // 密码锁
        value: 163,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "SafeMode",
        btnType: "ble"
    },
    NewWindMode:{
        name: "NewWindMode", // 可单独关的送风
        value: 164,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "NewWindMode",
        CMD: '',
        btnType: "other"
    },
    Fragrance:{
        name: "FragranceMode", // 香氛
        value: 165,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "arom",
        CMD: '',
        btnType: "other"
    },
    FaNoWindFeel:{
        name: "无风感", // FA 无风感
        value: 166,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "wind_sense_mini",
        CMD: CMD.FAWINDFEEL,
        btnType: "windFeel"
    },
    FaWindBlowing:{
        name: "防直吹", // FA 防直吹
        value: 167,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "wind_sense_mini",
        CMD: CMD.FAWINDFEEL,
        btnType: "windFeel"
    },
    BleControl: {
        name: "蓝牙控制",
        value: 168,
        metaType: FuncMetaType.Other,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "",
        btnType: "ble"
    },
    // UpDownAroundWind:{
    //     name: "上下环绕风",
    //     value: 169,
    //     metaType: FuncMetaType.HardDriver,
    //     protocolVersion: ProtocolVersion.attribute,
    //     luaKey: "wind_around,wind_around_ud",
    //     CMD: CMD.UDAROUNDWIND        
    // },
    // Degerming: { //普通空调
    //     name: "除菌",
    //     value: 170,
    //     metaType: FuncMetaType.HardDriver,
    //     protocolVersion: ProtocolVersion.attribute,
    //     luaKey: "degerming"
    // },
    // auto_prevent_cold_wind
    AutomaticAntiColdAir: {
        name: "主动防冷风",
        value: 171,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "auto_prevent_cold_wind",
        CMD: CMD.AUTOMATICANTICOLDAIR,
        btnType: "windFeel"
    },
    F11NoWindFeel: {
        name: "无风感",
        value: 172,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "wind_sense_mini",
        CMD: CMD.FAWINDFEEL,
        btnType: "windFeel"
    },
    CoolFreeAppointmentSwitchOff:{
        name: "定时关", // 酷风定时关
        value: 173,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "appointment_switch_off",
        btnType: "cell"
    },    
    CoolFreeECO: {
        name: "ECO 节能",
        value: 174,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "eco",
        btnType: "other"
    },
    CoolFreeDry: {
        name: "干燥",
        value: 175,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "dry",
        btnType: "other"
    },
    CoolPowerSaving: {
        name: "酷省",
        value: 176,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "cool_power_saving",
        CMD: CMD.COOLPOWERSAVING,
        btnType: "other"
    },
    CoolPowerSavingNewName: {
        name: "酷省",
        value: 10176,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.attribute,
        luaKey: "cool_power_saving",
        CMD: CMD.COOLPOWERSAVING,
        btnType: "other"
    },
    AroundWind:{
      name: "环游风",
      value: 185,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "jet_cool",
      CMD: CMD.AROUNDWIND,
      btnType: "windFeel"
    },
    DryNewName: { // 干燥改为叫内机防霉
      name: "内机防霉",
      value: 186,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "dry",
      btnType: "other"
    },
    ThNowindFeel: {
      name: "无风感", // th的无风感
      value: 187,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "no_wind_sense_right,no_wind_sense_left",
      CMD: CMD.THGUINOWINDSENSE,
      btnType: "windFeel"
    },
    PrepareFood:{
      name: "备菜",
      value: 183,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "prepare_food",
      CMD: CMD.PREPAREFOOD,
      btnType: "kitchen"
    },
    QuickFry:{
      name: "爆炒",
      value: 184,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "quick_fry",
      CMD: CMD.QUICKFRY,
      btnType: "kitchen"
    },
    UpDownSwipeWindKit: {
      name: "上下摆风中心角度DIY",
      value: 188,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "quick_fry_center_point",
      CMD: CMD.QUICKFRYCENTERPOINT,
      btnType: "windDirect"
    },
    FilterClean: {
      name: "滤网清洗和复位",
      value: 189,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.standard,
      // luaKey: "filter_clean"
      btnType: "cell"
    },
    DryNewNameKitchen: { // 干燥改为叫内机防霉
      name: "内机防霉",
      value: 190,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "dry",
      btnType: "cell"
    },
    WaterFallWind: {
      name: "巨瀑风",
      value: 191,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "jet_cool",
      CMD: CMD.AROUNDWIND,
      btnType: "windFeel"
    },
    ThSoftWindFeel: { // TH柔风感
      name: "柔风感",
      value: 192,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "gentle_wind_sense",
      CMD: CMD.TH_SOFTWIND,
      btnType:"windFeel"
    },
    QuickCoolHeat: {
      name: "速冷热",
      value: 193,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "quick_cool_heat",
      CMD: CMD.QUICKCOOLHEAT,
      btnType:"windFeel"
    },
    ThDownNoWindFeel: {
      name: "下无风感",
      value: 194,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "wind_swing_lr_under",
      CMD: CMD.UPDOWNNOWINDSENSE,
      btnType:"windFeel"   
    },
    ThUpNoWindFeel: {
      name: "上无风感",
      value: 195,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "wind_swing_lr_under",
      CMD: CMD.UPDOWNNOWINDSENSE,
      btnType:"windFeel"
    },
    UpDownUpLrDownLrWindAngle: {
      name: "上下左右摆风角度",
      value: 196,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "swing_lr_under_angle,wind_swing_ud_angle,wind_swing_lr_angle",
      CMD: CMD.DOWNLEFTRIGHTANGLE,
      // btnType:"lrSwipeDirect"   
    },  
    UpLeftRightDownLeftRightWindAngle: {
      name: "上左右、下左右摆风",
      value: 196,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "swing_lr_under_angle,wind_swing_ud_angle,wind_swing_lr_angle",
      CMD: CMD.DOWNLEFTRIGHTANGLE,
      btnType:"lrSwipeDirect"
    },
    DownSwipeWind00Ae: {
      name: "下左右风",
      value: 197,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "wind_swing_lr_under",
      CMD: CMD.DOWNLEFTRIGHTWIND,
      btnType:"lrSwipeDirect"   
    },
    CleanFunc: {
      name: "净化",
      value: 198,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "",
      CMD: CMD.CLEANFUNC,
      btnType:"other"   
    },
    KeepWet: {
      name: "保湿",
      value: 199,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "",
      CMD: CMD.KEEPWET,
      btnType:"other"   
    },
    BackWarmRemoveWet: {
      name: "回温除湿",
      value: 200,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "",
      CMD: CMD.BACKWARMREMOVEWET,
      btnType:"other"   
    },
    ThNowindFeelLeft: {
      name: "左无风感", // th的无风感
      value: 201,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "no_wind_sense_right,no_wind_sense_left",
      CMD: CMD.THGUINOWINDSENSE,
      btnType: "windFeel"
    },
    ThNowindFeelRight: {
      name: "右无风感", // th的无风感
      value: 202,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "no_wind_sense_right,no_wind_sense_left",
      CMD: CMD.THGUINOWINDSENSE,
      btnType: "windFeel"
    },
    LeftRightSwipeWindPopup: {
      name: "左右分区摆风", // t1\t3 这种双风道柜机有
      value: 203,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "wind_swing_lr,wind_swing_lr_left, wind_swing_lr_right",
      btnType:"lrSwipeDirect"
    },
    UpDownSwipeWindPopup: {
      name: "左右分区上下摆风", // t1\t3 这种双风道柜机有
      value: 204,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "wind_swing_ud,wind_swing_ud_left, wind_swing_ud_right",
      btnType:"udSwipeDirect"
    },
    UpDownWindAngleLeftRight: { // 左右风道 上下摆风角度
      name: "左右风道上下摆风角度", 
      value: 205,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "wind_swing_ud_angle,right_ud_wind_angle,left_ud_wind_angle",
      CMD: CMD.UPDOWNANGLE,
      btnType:"udSwipeDirect"
    },
    LeftRightWindAngleLeftRight: { // 左右风道 左右摆风角度
      name: "左右风道上下摆风角度", 
      value: 206,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "right_lr_wind_angle,left_lr_wind_angle",
      CMD: CMD.LEFTRIGHTANGLE,
      btnType:"lrSwipeDirect"
    },
    ElecHeatType: {
      name: "ElecheatType", // 电辅热默认规则开关
      value: 207,
      metaType: FuncMetaType.Other,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: ""
    },
    ThLight: { // 灯光
      name: "ThLight",
      value: 208,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "light",
      CMD: CMD.THLIGHT,
      btnType:"other"
    },
    UpWindBlowing:{
      name: "上防直吹",
      value: 209,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "prevent_straight_wind,prevent_straight_wind_lr,prevent_straight_wind_distance",
      CMD: CMD.NONDIRECTWINDDISTANCE,
      btnType: "windFeel"
    },
    DownWindBlowing:{
      name: "下防直吹",
      value: 210,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "prevent_straight_wind,prevent_straight_wind_lr",
      CMD: CMD.NONDIRECTWINDTYPE,
      btnType: "windFeel"
    },    
    LoopFan: {
      name: "循环扇",
      value: 211,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "circle_fan, circle_fan_mode",
      CMD: CMD.CIRCLEFAN,
      btnType:"other"   
    },
    useTH: {
      name: "使用th协议",
      value: 999,
      metaType: FuncMetaType.Other,
      protocolVersion: ProtocolVersion.standard,
      luaKey: ""
    },
    isCoolFree: {
      name: "酷风协议",
      value: 1000,
      metaType: FuncMetaType.Other,
      protocolVersion: ProtocolVersion.standard,
      luaKey: ""
    },    
    useNorthWarm: {
      name: "北方采暖",
      value: 1002,
      metaType: FuncMetaType.Other,
      protocolVersion: ProtocolVersion.standard,
      luaKey: ""
    },
    TargetIndoorTemp: {
      name: "目标室温",
      value: 1003,
      metaType: FuncMetaType.Server,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "",
      btnType: "cell"
    },
    Holiday: {
      name: "度假",
      value: 1004,
      metaType: FuncMetaType.Server,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "",
      btnType: "cell"
    },
    NorthWarmAuto: {
      name: "自动",
      value: 1005,
      metaType: FuncMetaType.Server,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "",
      btnType: "cell"
    },
    NorthWarmGoOut: {
      name: "外出",
      value: 1006,
      metaType: FuncMetaType.Server,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "",
      btnType: "cell"
    },
    NorthWarmQuiet: {
      name: "静音",
      value: 1007,
      metaType: FuncMetaType.Server,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "",
      btnType: "cell"
    },
    NorthWarmSaveEnergy: {
      name: "节能",
      value: 1008,
      metaType: FuncMetaType.Server,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "",
      btnType: "cell"
    },
    NorthWarmAppointment: {
      name: "定时", // 北方采暖定时
      value: 1009,
      metaType: FuncMetaType.Server,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "",
      btnType: "cell"
    },
    NorthWarmMode: {
      name: "模式控制", // 北方采暖模式
        value: 1010,
        metaType: FuncMetaType.HardDriver,
        protocolVersion: ProtocolVersion.standard,
        luaKey: "mode",
        btnType: "cell"
    },    
    NewSound:{
      name: "电控控制声音",
      value: 1011,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "buzzer_all", // 0/1
      CMD: CMD.SOUNDSWITCH,
      btnType: "other"
    },
    hasAutoPreventColdWindMemory: {
      name: "支持防冷风记忆",
      value: 1012,
      metaType: FuncMetaType.Other,
      protocolVersion: ProtocolVersion.standard,
      luaKey: "",
      btnType: "fixed"
    },
    AcDegerming:{
      name: "空调",
      value: 1013,
      metaType: FuncMetaType.HardDriver,
      protocolVersion: ProtocolVersion.attribute,
      luaKey: "air_remove_odor",
      CMD: CMD.ACDEGERMING,
      btnType: "cell"
  },
  useCoolFreeKitchen: {
    name: "x空间",
    value: 1014,
    metaType: FuncMetaType.Other,
    protocolVersion: ProtocolVersion.standard,
    luaKey: ""
  },
  coolFreeKitchenWindDirect: {
    name: "x空间风向",
    value: 1015,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "cell",
  },
  CoolFreeSleep: {
    name: "酷风睡眠",
    value: 1016,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "other",
  },
  CoolFreeStrong: {
    name: "酷风强劲",
    value: 1017,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "other",
  }
    
};

const FuncOrder = {
    home: {
        controlFunc: [   
            FuncType.RefrigerantCheck,
            FuncType.NewRefrigerantCheck,
            FuncType.HotMode,     
            FuncType.NewHotMode, 
            FuncType.NewDryMode,
            FuncType.WindMode,
            FuncType.NewWindMode,                                                
            FuncType.UpSwipeWind,
            FuncType.DownSwipeWind,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWindPopup,
            FuncType.UpDownSwipeWindPopup,
            FuncType.SwipeWind,                       
            FuncType.Purify,
            FuncType.NatureWind,
            FuncType.ChildrenPreventCold,            
            FuncType.PMV,
            FuncType.SavingPower,            
            FuncType.WisdomCleaning,
            FuncType.ColdHot,
            FuncType.PreventStraightLineWind,
            FuncType.ChildrenPreventWind,
            FuncType.UpDownNoWindFeel,            
            FuncType.KeepWarm,
            FuncType.ChangesTemperature,
            FuncType.FreshAir,
            FuncType.CleanFunc,
            FuncType.KeepWet,
            FuncType.ThLight,
            FuncType.UpWindBlowing,
            FuncType.DownWindBlowing,
            FuncType.LoopFan,
            FuncType.BackWarmRemoveWet,
            FuncType.WaterWashing,
            FuncType.ExtremeWind,
            FuncType.PromiseNoWind,
            FuncType.SingleTuyere,
            FuncType.EvenWind,
            FuncType.UpDownWindAngle,
            FuncType.UpDownWindAngleLeftRight,
            FuncType.LeftRightWindAngleLeftRight,            
            FuncType.LeftRightWindAngle,
            FuncType.AkeyControl,            
            FuncType.SafeInvade,
            FuncType.SwitchStrong,
            FuncType.distanceNoWindFeel,
            FuncType.softWindFeel,
            FuncType.preventGetCold,            
            FuncType.WindBlowingCool,
            FuncType.WindStraight,            
            FuncType.VideoInvade,
            FuncType.YB100WindAvoid,
            FuncType.NoPersonECO,
            FuncType.WisdomWind,
            FuncType.UpNoWindFeel,
            FuncType.DownNoWindFeel,
            FuncType.familyNumber,
            FuncType.PurifyPM,
            FuncType.LeftRightWindBlowing,            
            FuncType.UpDownLeftRightWindAngle,
            FuncType.MyAkeyControl,
            FuncType.AIIntelligentVoice,
            FuncType.IntelligentVoice,
            FuncType.ExclusiveMode,
            FuncType.MusicAuth,
            FuncType.AutoManualFreshAir,
            FuncType.ChildrenPreventWindAuto,
            FuncType.AirQualityReport,
            FuncType.WindBlowingDA400,
            FuncType.Degerming,
            FuncType.AcDegerming,
            FuncType.CoolPowerSaving,
            FuncType.CoolPowerSavingNewName,
            FuncType.MessageRemind,
            FuncType.SleepCurveServer,
            FuncType.UpDownWindBlowing,
            FuncType.UpDownAroundWind,
            FuncType.WindTop,
            FuncType.AtmosphereLamp,
            FuncType.ChildLock,
            FuncType.IotPowerSave,
            FuncType.Anion,
            FuncType.BuzzerAll,
            FuncType.HotAsepticSelfCleaning,
            FuncType.HotWisdomCleaning,   
            FuncType.PrepareFood,
            FuncType.QuickFry,   
            FuncType.DryNewName,      
            FuncType.DryNewNameKitchen  
        ],
        noneControlFunc: [        
            FuncType.useNorthWarm,
            FuncType.useCoolFreeKitchen,
            FuncType.useTH,    
            FuncType.isCoolFree,     
            FuncType.Dot5Support,
            FuncType.hasAutoPreventColdWindMemory,
            FuncType.NoPolar,
            FuncType.BleControl,
            FuncType.OuterDoorDisplay,
            FuncType.PurifyCheck,
            FuncType._16Support,
            FuncType.Time1TO1,
            FuncType.DeviceSwitch,
            FuncType.ModeControl,     
            FuncType.ModeWithNoAuto,       
            FuncType.WindSpeed,
            FuncType.Temperature,
            FuncType.SmallTemperature,
            FuncType.SmartRemoveWet,
            FuncType.ManualRemoveWet,
            // FuncType.WindMode,
            FuncType.AutoMode,
            FuncType.NoWindFeel,
            FuncType.ThNowindFeel,
            FuncType.HumidityDisplay,
            FuncType.ElecHeatType
        ]
    },
    more: {
        controlFunc: [   
            FuncType.DryMode,  
            FuncType.WindBlowing,   
            FuncType.Show,                                
            FuncType.SleepCurve,
            FuncType.SafeMode,
            FuncType.FaNoWindFeel,            
            FuncType.FaWindBlowing,
            FuncType.F11NoWindFeel, 
            FuncType.Degerming,
            FuncType.AcDegerming,
            FuncType.AutomaticAntiColdAir,
            FuncType.XiaoMiSmartCurve,
            FuncType.MyXiaoMiBracelet,
            FuncType.BlueToothUpgrade,
            FuncType.LadderControl,
            FuncType.SelfLearn,            
            FuncType.DeviceExamination,
            FuncType.StrainerClean,
            FuncType.PowerManager,
            FuncType.IntelControl,
            FuncType.GestureRecognize,            
            FuncType.YuyinVersion,
            FuncType.ParentalControl,
            FuncType.Volume,
            FuncType.FilterScreen,
            FuncType.RemoveBroadcast,
            FuncType.newFilterScreen,
            FuncType.MonthHealthReport,            
            FuncType.VoiceAuth,
            // FuncType.YBWindStraight,
            // FuncType.YBWindAvoid,
            // FuncType.GestureRecognitionSen,
            FuncType.TemperatureZone,
            FuncType.VolumeEC,
            FuncType.ChoosePronunciation,
            FuncType.CryGuardian,
            FuncType.Localism,
            FuncType.NaturalTalk,
            FuncType.MultiWakeup,
            FuncType.ScreenRemind,
            FuncType.WaterFullFault,            
            FuncType.AppointmentSwitchOn,                        
            FuncType.Quietness,
            FuncType.ECO,
            FuncType.CoolFreeECO,
            FuncType.CoolFreeDry,
            FuncType.CSEco,
            FuncType.Supercooling,              
            FuncType.ElectricHeat,                                           
            FuncType.Dry,
            FuncType.DryNewName,
            FuncType.Voice,
            FuncType.Sound,        
            FuncType.NewSound,
            FuncType.AppointmentSwitchOff,                                   
            FuncType.SelfCleaning,             
            FuncType.CoolFreeAppointmentSwitchOff,                                  
            FuncType.InitWifi,  
            FuncType.AboutDevice,
            FuncType.Advice,
            FuncType.OldPeopleMode,
            FuncType.Fragrance,
            FuncType.FilterClean,
            FuncType.ThSoftWindFeel
        ],
        noneControlFunc: [
            FuncType.VideoDescription,
        ]
    }
};

export  {FuncType, FuncOrder, FuncMetaType, ProtocolVersion};