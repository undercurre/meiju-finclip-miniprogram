/**
 * Created by liujim on 2017/9/8.
 */

let CMD = {
  AC_COMMAND_TYPE_H: 0,

  /**************************************新协议指令字**************************************/
  CONTROLSWITCHPRECOLDHEAT: 0x0018,     //预冷预热
  CONTROLSWITCHNOWINDFEEL: 0x0018,     //无风感
  REQUESTHUMIDITYVALUE: 0x0015,     //当前室内湿度
  REQUESTSAFEINVADESTATUS: 0x0029,    //安防功能
  CONTROLINTRUSIONSTATUS: 0x002C,     //入侵功能开启
  CONTROLINTRUSIONVIDEOSTATUS: 0x002D,   //入侵录像功能
  CONTROLFACERECOGNITIONSTATUS: 0x002E,     //人脸识别功能
  CONTROLINFRAREDLIGHTSTATUS: 0x002F,     //红外补光
  CONTROLINFRAREDECO: 0x0030,    //无人节能
  REQUESTINTELLIGENTCONTROLSTATUS_1: 0x0031,      //控制智能总开关
  REQUESTINTELLIGENTCONTROLSTATUS_2: 0x0032,    //风吹人
  REQUESTINTELLIGENTCONTROLSTATUS_3: 0x0033,     //风避人
  REQUESTINTELLIGENTCONTROLSTATUS_4: 0x0034,    //智能风速调节
  CONTROLREMOTEVIDEOSTATUS: 0x0035,    //手势识别
  CONTROLSOFTWINDSTATUS:0x0043,    //柔风感
  CONTROLPREVENTCOOL:0x003A,    //主动防冷风(属性代码和儿童防冷风相同)
  CONTROLPM25DISPLAY:0X020B,    //PM2.5显示
  CONTROLWISDOMWIND:0x0053,    //智慧风

  //IQ机型
  REQUESTINITCOLDEHOTSTATUS: 0x0020,     //上电语音播报
  INITCOLDHOTSTATUS: 0x0021,    //冷热感开关
  INITVOLUMESTATUS: 0x0024,    //空气传感语音播报
  INITCOLDEHOTSTATUS: 0x0023,     //天气预报

  //时间设置
  CONTROLSETTIME: 0x0028,   //日期校准

  CONTROLSWITCHPRECOLDHEAT: 0x0201,      //预冷预热控制
  CONTROLNEWVERBEEP: 0x001a,      //新协议蜂鸣器控制命令

  CIRCLEFAN: 0x00b9, // 循环扇
  CONTROLSELFCLEANING: 0x0039,     //自清洁
  NONDIRECTWIND: 0x0042,          //防直吹
  NONDIRECTWINDTYPE: 0x0058, //防直吹的类型
  NONDIRECTWINDDISTANCE: 0x0238, // 防直吹距离
  FAWINDFEEL: 0x0043,          //FA防直吹
  FRESHAIR: 0x004b,         //新风
  STRONGFRESHAIR:0x0250,    //新风扩孔
  NEWMODE: 0x0001,          //搭配新风的模式切换等
  UPDOWNANGLE: 0x0009,      // 上下摆风角度
  LEFTRIGHTANGLE: 0x000A,   // 左右摆风角度
  UDAROUNDWIND: 0x0059,   // 上下环绕风  
  DEGERMING: 0x005a,      // 杀菌
  ACDEGERMING: 0x00bf,    // 空调除菌
  AUTOMATICANTICOLDAIR: 0x0078, // f1-1主动防冷风
  COOLPOWERSAVING: 0x0089, // 酷省电
  AROUNDWIND: 0x0067, // 环游风
  QUICKCOOLHEAT: 0x00b3, // 速冷热
  THPOWER: 0x007f, // TH的关机
  THALL: 0x007e, //TH全量
  WAITCLEAN: 0x0099,
  THGUINOWINDSENSE: 0x0074,
  DOWNLEFTRIGHTANGLE: 0x0096, // 下左右风向
  DOWNLEFTRIGHTWIND: 0x00AE, // 下左右风
  UPDOWNNOWINDSENSE: 0x00AF, // 上下无风感
  KEEPWET: 0x007c, //保湿
  BACKWARMREMOVEWET: 0x0068, // 回温除湿
  CLEANFUNC: 0x0070, // 净化
  WINDSWINGLRLEFT: 0x0080, // 左左右风
  WINDSWINGLRRIGHT: 0x0081, // 右左右风
  WINDSWINGUDLEFT: 0x0082, // 左上下风
  WINDSWINGUDRIGHT: 0x0083, // 右上下风
  ELECHEATTYPE: 0x0211, // 电辅热默认规则开启
  THWINDSPEED: 0x0006, // th设置风速
  RIGHTLRWINDANGLE: 0x00A3, //th右左右出风方向
  LEFTLRWINDANGLE: 0x00A2, //th左左右出风方向
  THLIGHT: 0x005b,
  THTIMINGON: 0x000b,
  THTIMINGOFF: 0x000c,
  PREVENTCOOLWINDMEMORY: 0x00bc,

  SOUNDSWITCH: 0x022c, // 蜂鸣器开关
  SOUNDTYPE: 0x022f, // 全无声音/app控制无声音



  QUERYSTATUS: 0x01,      //命令类型，查询
  SETSTATUS: 0x00,      //命令类型，设置

  //yb201新功能
  CONTROL_PREVENT_COOL_WIND: 0x003A,     //儿童防冷风
  CONTROL_WEATHER_BROADCAST: 0x003B,   //天气播报功能
  CONTROL_WEATHER_BROADCAST_TIMER: 0x003C,     //天气播报功能定时开关
  CONTROL_NO_WIND_FEEL_UPDOWN: 0x0018,    //上下无风感

  // 厨房空调
  PREPAREFOOD: 0x0254,
  QUICKFRY: 0x0255,
  QUICKFRYCENTERPOINT: 0x008B,
  SWINGWINDBUTTON: 188,   // 上下摇摆按键


  /*命令类型*/
  CMDTYPE_INVALID_CMD: 0, // 无效指令

  CMDTYPE_QUERY_COOLFREE: 122,// 表示酷风查询
  CMDTYPE_SET_COOLFREE: 123, // 酷风控制

  //低成本控制指令
  CMDTYPE_QUERY_INFO: 1, // 查询设备当前状态信息    [结构定义见 curInfoQuery_Ex_t，返回结构见 stQueryInfoRes_Ex_t]
  CMDTYPE_QUERY_C1_1: 2,
  CMDTYPE_QUERY_C1_2: 3,
  CMDTYPE_QUERY_ONLINE_STATUS: 2, // 查询当前的设备在线状态  [结构定义见 NULL，返回结构见 stQueryOnlineInfoRes_Ex_t]
  CMDTYPE_SET: 4, // 修改、设置设备运行状态  [结构定义见 stSetInfo_Ex_t，返回结构见 stQueryInfoRes_Ex_t]

  CMDTYPE_QUERY_PAR: 5, //查询各组参数
  CMDTYPE_QUERY_SET: 6, //设置各组参数

  CMDTYPE_GET_TYPEINFO: 24, // 获取家电信息[结构定义见 airConBaseInfoReq_Ex_t，返回结构见 airConBaseInfoAck_Ex_t]

  CMDTYPE_GET_TIME_PARAM: 25, // 获取第0组数据  运行时间参数 [结构定义见 airConNormalReq_Ex_t，返回结构见 stQueryTimeParamAck_Ex_t]
  CMDTYPE_SET_TIME_PARAM: 26, // 设置第0组数据  校准时间     [结构定义见 stSetTimeReq_Ex_t，返回结构见 stQueryTimeParamAck_Ex_t]
  CMDTYPE_GET_BASERUN_INFO: 27,  // 获取第1组数据  运行基本参数 [结构定义见 airConNormalReq_Ex_t，返回结构见 stQueryBaseRunInfoAck_Ex_t]
  CMDTYPE_SET_BASERUN_INFO: 28, // 设置第1组数据  运行基本参数 [结构定义见 stSetBaseRunInfoReq_Ex_t，返回结构见 stQueryBaseRunInfoAck_Ex_t]
  CMDTYPE_GET_INDOORDEV_INFO: 29, // 获取第2组数据  室内运行信息， [结构定义见 airConNormalReq_Ex_t，返回结构见 stQueryIndoorDevAck_Ex_t]
  CMDTYPE_GET_OUTDOORDEV_INFO: 30, // 获取第3组数据  室外运行信息， [结构定义见 airConNormalReq_Ex_t，返回结构见 stQueryOutdoorDevAck_Ex_t]
  CMDTYPE_GET_POWER_INFO: 31,  // 获取第4组数据  电量运行信息， [结构定义见 airConNormalReq_Ex_t，返回结构见 stQueryPowerInfoRes_Ex_t]
  CMDTYPE_SET_POWER_INFO: 32,  // 设置第4组数据  电量运行信息， [结构定义见 stSetPowerInfoReq_Ex_t，返回结构见 stQueryPowerInfoRes_Ex_t]
  CMDTYPE_GET_PARAM5: 33,  // 获取第5组数据   [结构定义见 airConNormalReq_Ex_t，返回结构见 stQueryParam5Res_Ex_t]
  CMDTYPE_GET_PARAM6: 34, // 获取第6组数据   [结构定义见 airConNormalReq_Ex_t，返回结构见 stQueryParam6Res_Ex_t]
  CMDTYPE_GET_PARAM11: 35, // 获取第11组数据  [结构定义见 airConNormalReq_Ex_t，返回结构见 stQueryParam11Res_Ex_t]
  CMDTYPE_SET_PARAM11: 36, // 设置第11组数据  [结构定义见 stSetParam11_Ex_t，返回结构见 stQueryParam11Res_Ex_t]

  CMDTYPE_SET_FILTER: 100, // 开始过滤网检测  [结构定义见 stSetFilter_Ex_t， 返回结构见stSetFilterRes_Ex_t]
  CMDTYPE_GET_FILTER_RESULT: 101,  // 查询检测结果    [结构定义见 stGetFilterResult_Ex_t， 返回结构见stGetFilterResultRes_Ex_t]
  CMDTYPE_RESET_FILTER: 102, // 基准校验	    [结构定义见 stResetFilter_Ex_t， 返回结构见stResetFilterRes_Ex_t]
  CMDTYPE_START_WEATHER_VOICE: 200,  // 开始播报天气  [结构定义见 stStartVoice_Ex_t， 返回结构见stStartVoice_Ex_t]
  CMDTYPE_SET_VOICE: 201,  // 设置语音播报  [结构定义见 stSetVoice_Ex_t， 返回结构见stSetVoice_Ex_t]

  /*模式类别*/
  MODETYPE_AUTO: 1, // 自动模式
  MODETYPE_COOL: 2,  // 制冷模式
  MODETYPE_WET: 3, // 抽湿模式
  MODETYPE_HEAT: 4,  // 制热模式
  MODETYPE_WIND: 5, // 送风模式
  MODETYPE_REMOVE_WET: 6,  // 抽湿模式

  SMART_REMOVE_WET_HUMIDITY: 101,

  /*风速枚举定义*/
  WINDSPEED_LOW: 1,// 1-低风
  WINDSPEED_MID: 2, // 2-中风
  WINDSPEED_HIGH: 3, // 3-高风
  WINDSPEED_STROG: 4, // 4-强劲
  WINDSPEED_MUTE: 5, // 5-静音风
  WINDSPEED_AUTO: 6, // 6-自动风
  WINDSPEED_FIXED: 7, // 7-固定风

  /*舒睡模式*/
  CSM_NON_COSYSLEEP: 0x00, // 无舒睡
  CSM_COSYSLEEP_ONE: 0x01,// 舒睡模式1
  CSM_COSYSLEEP_TWO: 0x02,// 舒睡模式2
  CSM_COSYSLEEP_THREE: 0x03,	// 舒睡模式3
  MAX_BUFLEN: 1024,  // 缓冲/数据 容量

  /*抽湿模式*/
  RemoveWetAuto: 1,
  RemoveWetManual: 0,

  /*EMS空气机*/
  OneKeyControl: 0x226, //一键优化
  LeftControlWind: 0x229,//左摆风
  RightControlWind: 0x22A,//右摆风
  CleanClass: 0x227,//智清洁
  NewFresh: 0x228,//净化滤网
  UpControlWind: 0x22B,//上摆风
  DownControlWind: 0x22C,//下摆风
  RightUpDownControlWind: 0x23A,//右上下摆风
  LeftUpDownControlWind: 0x23B,//左上下摆风
  LeftControlWindFree: 0x22D,//左无风感
  RightControlWindFree: 0x22E,//右无风感
  CleanHeartStatus: 0x22F,//净化滤芯状态
  LightClass: 0x223,//氛围灯
  Sterilize: 0x231,//杀菌
  CleanFun: 0x232,//净化
  NewWind: 0x233,//新风
  WetfilmFun: 0x234,//湿膜
  HumMbrane: 0x235,//加湿
  LeftRightWindClass: 0x236,//左右风机转速
  Acstrainer: 0x238,//空调滤网
  GetWeather: 0x237,//获取天气
  NearSwStatus: 0x239,//接近感应
  OneKeyAC: 0x23C,//空调一键开关
  WaterSupply: 0x23E,//供水状态
  AirCondition:0x23F,//空气状况
  Turbo:0x244,//强劲
  ElectricHeat:0x000F,//电辅热
  DryNew:0x0010,//干燥
  IndoorTemperature:0x0004,//室内温度
  OutdoorTemperature:0x0005,//室外温度
  AirQuality:0x0230,//空气质量
  Waitclean:0x0246,//待机清洁
  ECOstate:0x001E,//Eco
  KeepWarm:0x0022,//
  // CloseScreen:0x0001,//关大屏屏幕
  Supercooling:0x0049, //智控温



   /**小多联控制指令 */
   MULTIAC_CMDTYPE_QUERY_INFO: 201, // 酷风、COLMO小多联

    //2023 TH协议属性 兼容新平台
    TH_MODE: 0x0002,
    TH_SOFTWIND: 0x0086
};

let STATUS = {
  /*************************************************新协议状态结构*************************************************/
  /*  当前信息查询/设置结构   newcurInfoQuery_Ex_t*/
  /*  设备状态修改、设置结构  newstSetInfo_Ex_t*/
  newProtocolStatusSet: {
    controlSwitchNoWindFeel: "",              // 0018 无风感          1个字节
    faWindFeel:"",                            // 0043 fa风感
    requestHumidityValue: "",                 // 0015 当前室内湿度     1个字节
    requestSafeInvadeStatus: "",              // 0029 安防功能        1个字节
    controlIntrusionStatus: "",               // 002c 入侵功能开启     1个字节
    controlIntrusionVideoStatus: "",          // 002d 入侵录像功能     1个字节
    controlFaceRecognitionStatus: "",         // 002e 人脸识别功能     1个字节
    controlInfraredLightStatus: "",           // 002f 红外补光        1个字节

    //controlInfraredEco:"",              // 0030 无人节能        6个字节
    controlInfraredEco_sw: "",            // buf[0]:无人节能功能开关 0：关闭 1：开启
    controlInfraredEco_time: "",          // buf[1]：无人节能功能的时间，连续多长时间没有人进入节能 单位为分钟
    controlInfraredEco_runtime: "",       // buf[2]、buf[3]：无人节能运行的低频时间单位为分钟。0：无此阶段，0xffff:该阶段无时间限制
    controlInfraredEco_autoflag: "",      // buf[4]：无人节能是否自动进入关机
    controlInfraredEco_exitsec: "",       // buf[5]:连续多长时间检测到人自动退出无人节能 单位为秒

    requestIntelligentControlStatus_1: "",    // 0031 控制智能总开关   1个字节
    requestIntelligentControlStatus_2: "",    // 0032 风吹人          1个字节
    requestIntelligentControlStatus_3: "",    // 0033 风避人
    requestIntelligentControlStatusTwo: "",   // 0033 风避人/风吹人:"",0:关闭 1:风吹人 2:风避人 2016-08-09

    requestIntelligentControlStatus_4: "",    // 0034 智能风速调节     1个字节
    handSwOnorOff: "",                        //手势开关机
    handControlWind: "",                      //手势定向送风

    controlRemoteVideoStatus: "",             // 0035 手势识别        1个字节

    requestInitColdeHotStatus: "",            // 0020 上电语音播报    1个字节
    voiceBroadcastStatus: "",                 //语音功能,发0和3
    awakenStatus: "",                         //唤醒词状态 唤醒词的选择0:空调空调:"",1:你好小妹:"",2:预留:"",0xff:无效
    toneStatus: "",                           //播报声调 语音播报语调的选择:"",0:标准播报:"",1:甜美播报:"",2:蜂鸣器:"",oxff:无效
    voiceTimeLength: "",                      //语音识别超时时间长度 长度 0-254s
    initialPowerBroadcastSwitch: "",          //上电播报开关  0：关 1：开 0xff:无效
    friendshipBroadcastSwitch: "",            //友情播报开关  0：关 1：开 0xff:无效
    safetyBroadcastSwitch: "",                //安全播报开关  0：关 1：开 0xff:无效
    weatherBroadcastSwitch: "",               //天气预报播报开关  0：关 1：开 0xff:无效
    informationBroadcast: "",                 //维护信息播报  0：关 1：开 0xff:无效

    initVolumeStatus: "",                     // 0024 空气传感语音播报 1个字节
    volumeControlType: "",                    //音量调节的类型 音量调节的类型 1：自动调节 2：手动调节 3：固定音量
    manualAdjustment: "",                     //手动调节 固定调节的音量 0-100
    minVolume: "",                            // 自动调节的最小音量 自动调节的最小音量
    maximumVolume: "",                        //自动调节的最大音量 自动调节的最大音量

    initColdeHotStatus: "",                   // 0021 天气播报
    coldHotSwitch: "",                        //冷热感开关
    coldHotStall: "",                         //冷热感的档位  0-100档
    coldHotNumber: "",                        //冷热感的人数  （预留）
    PeopleClothes: "",                        //人的穿衣情况  （预留）
    SeasonalState: "",                        //季节状态 （0：春天 1：夏天：2秋天 3：冬天）（预留）
    WeatherCondition: "",                     //天气状态 （0：晴天 1：阵雨 之类的）（预留）
    NightTimeHour: "",                        //夜晚判断绝对时间的时间点小时
    NightTimeMinute: "",                      //夜晚判断绝对时间的时间点分钟

    controlSetTime: "",                       // 0028 日期校准        7个字节 (7位数组)[]

    controlSwitchPreColdHeat: "",             //预冷预热控制

    newSoundSwitch: "",                       //电控蜂鸣器开关
    newSoundType: "",                         //电控蜂鸣器种类选择
    preventCoolWindMenory: "",              //主动防冷风记忆
    hasPreventCoolWindMenory: "",           //是否有主动防冷风记忆
    circleFan: "",                            //循环扇
    circleFanMode: "",                        //循环扇档位
    switchSelfCleaning: "",                   //自清洁
    switchNonDirectWind: "",                  //防直吹
    nonDirectWindType: "",                    //防直吹类型    
    nonDirectWindDistance: "",                //防直吹距离
    switchFreshAir: "",                       //新风
    freshAirFanSpeed:"",                      //新风风速
    strongFreshAir:"",                        //新风扩孔
    newModePower:"",                          //不控制新风的开关机
    newMode:"",                               //带新风的模式     
    newModeTemp:"",                           //新模式切换带的温度
    newModeWindSpeed:"",                      //新模式切换带风速      
    upDownAngle:"",                           //上下摆风角度  
    leftRightAngle:"",                        //左右摆风角度,
    udAroundWindSwitch:"",                    //上下环绕风开关
    udAroundWindDirect:"",                    //上下环绕风方向 
    degerming:"",                             //杀菌
    acDegerming:"",                           //空调除菌
    coolPowerSaving:"",                       //酷省
    aroundWind:"",                            //环游风
    quickCoolHeat:"",                         //速冷热
    runStatus:"",                             //th开关机
    thNoWindSenseLeft:"",                     //th左无风感
    thNoWindSenseRight:"",                    //th右无风感
    thSoftWindStatus:"",                      //th柔风感
    elecHeatType:"",                          //电辅热默认状态  0 （电辅热强制开启） 1 （出厂状态，根据温度条件自动开启）


    // TH机型特殊
    screenShowTh:"",                          //th屏显
    upNoWindSense: "",                        //th上无风感
    downNoWindSense: "",                      //th下无风感
    downLeftRightWindTh:"",                   //th下左右风
    downLeftRightAngle:"",                    //th下左右风角度
    moisturizing: "",                         //保湿
    moisturizingFanSpeed:"",                  //保湿风速
    rewarmingDry: "",                         //回温除湿
    innerPurifier: "",                        //净化    
    innerPurifierFanSpeed: "",             //净化风速

    windSwingLrLeft:"",                       // 左左右风
    windSwingLrRight:"",                      // 右左右风
    windSwingUdLeft:"",                       // 左上下风
    windSwingUdRight:"",                      // 右上下风
    rightLrWindAngle:"",                      // 右左右摆风角度,
    thLight:"",                               // T1/T3 灯光控制


    //yb201机型功能
    controlPreventCoolWind: "",               //儿童防冷风
    controlWeatherBroadcast: "",              //天气播报功能
    controlWeatherBroadcastTimer: "",         //天气播报功能定时开关
    controlWeatherBroadcastTime_1st: "",      //天气播报功能定时-第一组时间 (2位数组)[]
    controlWeatherBroadcastTime_2nd: "",      //天气播报功能定时-第二组时间 (2位数组)[]
    controlWeatherBroadcastTime_3th: "",      //天气播报功能定时-第三组时间 (2位数组)[]
    controlNoWindFeelUpDown: "",              //上下无风感

    //EMS空气机(int)
    oneKeyControlSw: "",                      //一键优化开关
    humidificationSw: "",                     //加湿开关 
    humidificationClass: "",                  //加湿等级 
    humidificationWindClass: "",              //加湿下的风速 
    humidificationWaterStatus: "",            //加湿器水箱状态   
    newWindFun: "",                           //新风相关功能,开关 
    newWindMode: "",                          //新风相关功能,模式 
    newWindClass: "",                         //新风等级  
    purfiyClass: "",                          //净化等级  
    sterilizeFun: "",                         //杀菌,开关 0:没有该属性; 1:关; 2:开
    purfiyFilm: "",                           //BUF[0] :0无此功能，1:净化滤网正常，2:净化滤网脏，3：清除净化滤网计时时间
    purfiyFilmTime: "",                       //BUF[1] :计时时间低位(小时) BUF[2] :计时时间高位(小时)  
    smartCleanSW: "",                         //BUF[0]0无此功能，1:此功能状态为关，2:此功能状态为开 
    smartCleanCurrentStatus: "",              //BUF[1] :当前运行阶段 
    smartCleanCurrentRunTime: "",             //BUF[2] :当前运行时间（min） 
    smartCleanSetTime: "",                    //BUF[3] :预留目标运行时间   
    sterilizeSw: "",                          //BUF[0] :0无此功能，1:此功能状态为关，2:此功能状态为开
    sterilizeWindClass: "",                   //BUF[1]杀菌风速挡位
    sterilizeMode: "",                        //BUF[2]杀菌模式（0：关，1：手动开，2：自动开） 
    sterilizeSetTime: "",                     //BUF[3]杀菌时间设定值低位 
    sterilizeRunTime: "",                     //BUF[5]杀菌实际运行时间值低位
    cleanFunSw: "",                           //BUF[0] :0无此功能，1:此功能状态为关，2:此功能状态为开 
    cleanFunWindClass: "",                    //BUF[1]净化风速挡位 
    cleanFunMode: "",                         //BUF[2]净化模式 
    cleanFunOpenValue: "",                    //BUF[3]自动净化开启时PM2.5目标值
    cleanFunCloseValue: "",                   //BUF[5]自动新风关闭时PM2.5目标值（00表示没有自动关闭功能）
    cleanFunCurrentValue: "",                 //BUF[7]当前室内PM2.5值低位  
    newWindFunSw: "",                         //BUF[0] :0无此功能，1:此功能状态为关，2:此功能状态为开
    newWindFunClass: "",                      //BUF[1]新风挡位
    newWindFunMode: "",                       //BUF[2]新风模式（自动／手动） 
    newWindFunWindMode: "",                   //BUF[3]新风模式（全新风／半新风） 
    newWindFunOpenValue: "",                  //BUF[3]自动新风开启时CO2目标值低位 
    newWindFunCloseValue: "",                 //BUF[5]自动新风关闭时CO2目标值低位（FF表示没有自动关闭功能）
    newWindFunCurrentValue: "",               //BUF[7]当前CO2值低位   
    wetfilmFunState: "",                      //BUF[0] :0无此功能，1:湿膜正常，2:湿膜脏，3：清抽湿膜计时时间
    wetfilmTime: "",                          //BUF[1] :计时时间低位  
    wetfilmTotalTime: "",                      //BUF[1] :计时总时间
    humFunSw: "",                             //BUF[0] :0无此功能，1:此功能状态为关，2:此功能状态为开
    humFunWindClass: "",                      //BUF[1]加湿风速挡位 
    humFunWindMode: "",                       //BUF[2]加湿模式 
    humFunWindOpenValue: "",                  //BUF[3]自动加湿开启时湿度目标值 
    humFunWindCloseValue: "",                 //BUF[4]自动加湿关闭时湿度目标值 
    humFunWindCurrentSetValue: "",            //BUF[5]设置湿度值 
    humFunWindCurrentValue: "",               //BUF[6]当前湿度值  
    leftWindClass: "",                        //BUF[0] :左风机转速，1-100%或102% 
    rightWindClass: "",                       //BUF[1] :右风机转速，1-100%或102%
    getWeatherFlag: "",                       //BUF[0] :0：未获取到天气信息，1：表示已经获取到天气信息
    ourdoorPM25Value: "",                     //BUF[1]天气获取的室外PM2.5值低位
    acstrainerState: "",                      //BUF[0] :0无此功能，1:空调滤网正常，2:空调滤网脏，3：清除空调滤网计时时间 
    acstrainerRunTime: "",                    //BUF[1] :计时时间低位(小时)
    acstrainerTotalRunTime: "",                    //BUF[1] :计时总时间
    nearSwStatus: "",                         //BUF[0] :0无此功能，1:接近感应功能开启，2:接近感应功能关闭
    leftControlWindSw: "",                    //左摆风开关
    leftControlWindDegree: "",                 //左摆风角度
    rightControlWindSw: "",                    //右摆风开关
    rightControlWindDegree: "",                //右摆风角度
    upControlWindSw: "",                       //上摆风开关
    upControlWindDegree: "",                   //上摆风角度
    downControlWindSw: "",                     //下摆风开关
    downControlWindDegree: "",                 //下摆风角度
    rightUpDownControlWindSw: "",              //右上下摆风开关
    rightUpDownControlWindDegree: "",          //右上下摆风角度
    leftUpDownControlWindWindSw: "",           //左上下摆风开关
    leftUpDownControlWindlWindDegree: "",      //左上下摆风角度
    leftControlWindFreeSw: "",                 //左无风感开关
    leftControlWindFreeDegree: "",             //左无风感角度
    rightControlWindFreeSw: "",                //右无风感开关
    rightControlWindFreeDegree: "",            //右无风感角度
    lightClassSw: "",                          //氛围灯开关
    lightClass: "",                            //氛围灯调节
    oneKeyACSw: "",                            //空调开关状态
    oneKeyACMode: "",                          //空调模式
    oneKeyACLeftWind: "",                      //空调左风速
    oneKeyACRghtWind: "",                      //空调右风速
    oneKeyACTemperature: "",                   //空调温度
    oneKeyACID: "",                            //情景ID
    leftWind:"",                               //左风速
    rightWind:"",                              //右风速
    nearNoYes: "",                             //是否有人靠近
    cleanClassSw: "",                          //智清洁开关
    cleanRunningStage: "",                     //智清洁当前运行阶段
    cleanRunningTime: "",                      //智清洁当前运行时间
    cleanTargetRuntime: "",                    //智清洁目标运行时间
    newFreshState: "",                         //0:无此功能，1:净化滤网正常，2:净化滤网脏，3：清除净化滤网
    newFreshTimingTime: "",                    //计时时间
    newFreshTotalTime: "",                     //总时长
    waterSupplyStatus:"",                      //供水状态
    waterLevel:"",                             //水位
    waterTank:"",                               //水箱
    temperatureState:"",                        //温度状态
    humidityCondition:"",                       //湿度状态
    cleanlinessState:"",                        //洁净度状态
    freshnessState:"",                        //新鲜度状态
    turbo:"",                                 //强劲
    electricHeat:"",                         //电辅热
    dryNew:"",                                //干燥
    indoorTemperature:"",                      //室内温度
    indoorDecimal:"",                         //室内温度小数位
    outdoorTemperature:"",                      //室外温度
    airQualitySw:"",                          //空气质量开关
    airQualityLamp:"",                        //灯亮度
    airQuality:"",                           //空气质量档位
    waitcleanSw:"",                      //待机清洁开关
    ecoSw:"",                          //eco开关
    ecos:"",                           //eco秒
    ecomin:"",                         //eco分
    ecoh:"",                           //eco小时
    keepWarmSw:"",                         //舒省开关
    keepWarmSetTemp:"",                   //舒省设定温度
    closeScreenSw:"",
    superCoolingSw:"",                     // 智控温
    startTemperature:"",                   // 智控温初始设定温度
    endTemperature:"",                    // 智控温结束设定温度
    startWindSpeed:"",                    // 智控温开始设定风速
    endWindSpeed:"",                      // 智控温结束设定风速
    controlSoftWindStatus:"",             //柔风感
    controlPreventCool:"",             //主动防冷风
    controlPM25Display:"",             //PM2.5显示
    controlWisdomWind:"",             //智慧风  
    automaticAntiColdAir:"",          //动防冷风

    // 厨房空调
    prepareFood: "",
    prepareFoodFanSpeed: "",
    prepareFoodTemp: "",
    quickFry: "",
    quickFryAngle: "",
    quickFryCenterPoint: "",
    quickFryFanSpeed: "",
    quickFryTemp: "",
  },

  /*************************************************经典协议状态结构*************************************************/
  /*  设备状态修改、设置结构  stSetInfoEx_t*/
  /*  状态查询及控制回复结构  stQueryInfoRes_Ex_t*/
  standardProtocolStatusSet: { //_QUERY_RESPONSE_INFO_RES_EX_T_
    faultFlag: "",         // 故障标记，0-无故障，>0-有故障【高字节表示该故障是否影响运行，0为不影响，1为故障已停机；低字节表示故障代码，0为无故障】
    errCode: "",           // 故障代码
    order: "",             // 帧序号
    quickChkSts: "",       // 快检状态，0 - 关，1 - 开
    timingType: "",        // 0-相对定时，1-绝对定时
    iMode: "",             // i模式恢复，0 - 关，1 - 开
    runStatus: "",         // 开关控制，0-关，1-开
    controlSource: "",     // 控制源，0-遥控器，1-移动终端
    childSleepMode: "",    // 儿童睡眠模式，0-关，1-开

    mode: "",              // 模式控制，见 modeType_Ex_em 定义
    timingIsValid: "",     // 移动终端定时是否有效标记，0-无效，1-有效
    windSpeed: "",         // 风速控制 0-无效，1～100，固定风-101，自动风-102 1静音风:"", 2低风 3中风 4高风 5强劲风 6固定风 7自动风

    // 定时开机信息
    timingOnSwitch: "",    // 定时开机是否开启，0-关闭，1-开启
    timingOnHour: "",      // 定时时间-小时
    timingOnMinute: "",    // 定时时间-分钟

    // 定时关机信息
    timingOffSwitch: "",   // 定时关机是否开启，0-关闭，1-开启
    timingOffHour: "",     // 定时时间-小时
    timingOffMinute: "",   // 定时时间-分钟

    cosyWind: "",          // 舒适风，具体摆风见table定义
    // 广角1, 左广角2, 右广角3, 左定点4, 右定点5,
    // 正面定点6, 环绕立体风7, 跟随-迎风8, 避开-避风9,
    // 正出风上下摆10, 正出风左右摆11, 侧出风左右摆12

    leftUpDownWind: "",     // 左侧上下风，0-关闭，1-开启
    rightUpDownWind: "",    // 右侧上下风，0-关闭，1-开启
    leftLeftRightWind: "",  // 左侧上左右风，0-关闭，1-开启
    rightLeftRightWind: "", // 右侧上左右风，0-关闭，1-开启
    swingWindButton: "", // 厨房空调摆风按键

    upWind: "",             //上摆风使能开关
    upWind_1: "",           //上摆风
    upWind_2: "",           //上摆风
    downWind: "",           //下摆风

    btnSound: "",          // 按键提示音控制，0-无提示，1-有提示
    cosySleepMode: "",     // 舒睡模式，见 CosySleepMode_Ex_em 定义
    almSleep: "",          // 闹铃睡眠，0 - 关，1 - 开
    powerSave: "",         // 省电，0 - 关，1 - 开
    farceWind: "",         // 睿风，0 - 关，1 - 开
    strong: "",            // 强劲，0 - 关，1 - 开
    energySave: "",        // 节能，0 - 关，1 - 开
    bodySense: "",         // 随身感，0 - 关，1 - 开

    childSleepMode: "",    // 儿童舒睡模式，0 - 关，1 - 开
    naturalWind: "",       // 自然风，0 - 关，1 - 开

    wisdomEye: "",         // 智慧眼，0 - 关，1 - 开
    chgOfAir: "",          // 换气，0 - 关，1 - 开
    diyFunc: "",           // 干燥，0 - 关，1 - 开
    elecHeat: "",          // 电辅热，0 - 关，1 - 开
    elecHeatForced: "",    // 电辅热强制开启，0 - 关，1 - 开
    cleanUpFunc: "",       // 净化功能
    chgComfortSleep: "",   // 切换舒睡曲线
    ecoFunc: "",           // ECO功能，0 - 关，1 - 开
    CSEco: "",              // CSEco 0-关，1-开
    cleanUpFunc: "",       // 净化功能，0 - 关，1 - 开
    localBodySense: "",    // 本机随身感，0 - 关，1 - 开
    cosySleepSwitch: "",  // 本机舒睡，0 - 关，1 - 开,
    checkCode: "", // 校验码,
    downSwipeWind: "", // 下左右风,
    downSwipeWindFunc: "", // 下左右风功能位。发码时固定发1，不需要解析


    sleepFuncState: "",    // Sleep功能状态，0-关，1-开
    tubroFuncState: "",    // Tubro功能状态，0-关，1-开
    tempModeSwitch: "",    // 温度模式，0-摄氏，1-华氏
    chgOfAir: "",          // 换气，0 - 关，1 - 开
    nightLight: "",        // 小夜灯，0 - 关，1 - 开
    againstCool: "",       // 防着凉，0 - 关，1 - 开
    pmv: "",               // PMV，0 - 关，1 - 开
    coolWindMode: "",      // 凉风模式，0 - 关，1 - 开

    dustFlow: "",          // 尘满标识
    cleanFanRunTime: "",   // 清除风机运行时间

    ComfortSleepTime: "",  // 舒睡时间(0-10小时)
    peakValleyMode: "",    // 峰谷电模式
    naturalWind: "",       // 自然风
    cosySleepHour: "",     // 舒睡已运行时间-小时
    cosySleepMinute: "",   // 舒睡已运行时间-分
    cosySleepSecond: "",   // 舒睡已运行时间-秒

    humidity: "",          //  0：无设定湿度 1：设定湿度1% 100，设定湿度100%

    isUseDoubleTempCtrl: "",// 是否使用双温控制功能，0 - 非双温控制，1 - 双温控制
    isOpen8DegreeHot: "",   // 是否开启8度制热功能，0 - 关闭，1 - 开启

    tempIn: "",           // 室内温度
    tempOut: "",          // 室外温度
    tempSet: "",          // 设置温度 温度控制，17.0℃-30.0℃
    tempSet2: "",         // 温度控制，13.0℃-35.0℃

    tempRangeUpLimit: "",  // 温度上限值，13.0℃-35.0℃，双温控制时使用，tempSet或tempSet2作为下限值

    energySave: "", // ??
    childKickk: "", // ??
    renaturalWind: "", // ??
    lightClass: "", // ??

    controlSwitchNoWindFeelOld: "",//旧协议无风感返回
    firstHourTemp: "",     // 第一小时舒睡温度(17.0-30.0℃)
    secondHourTemp: "",    // 第二小时舒睡温度
    thirdHourTemp: "",     // 第三小时舒睡温度
    fourthHourTemp: "",    // 第四小时舒睡温度
    fifthHourTemp: "",     // 第五小时舒睡温度
    sixthHourTemp: "",     // 第六小时舒睡温度
    seventhHourTemp: "",   // 第七小时舒睡温度
    eighthHourTemp: "",    // 第八小时舒睡温度
    ninethHourTemp: "",    // 第九小时舒睡温度
    tenthHourTemp: "",     // 第十小时舒睡温度

    isWindowsDevice: "",    //b5上报是否是窗机
    tankFull: "", //水箱满    
    screenShow: "", //屏显
    smartDryFunc:"", // 标记舒适抽湿，个性抽湿
    smartDryValue:"", // 个性抽湿值，等于101时是舒适抽湿，其他表示自动抽湿


    /*********CoolFree***********/
    // 数据0开关机公用
    coolFreeStayClean: "", //酷风待机清洁
    coolFreeMute: "", //静音
    coolFreeNowindFeel: "", // 无风感
    coolFreeDryClean: "", //干燥清洁
    coolFreeManualFreshAir: "", //手动新风
    coolFreeAutoFreshAir: "", //自动新风
    // strong：强劲，与普通空调公用字段

    // 数据1
    coolFreeLeftUdWind: "", // 水平摇摆（左侧上下风）
    coolFreeRightUdWind: "", // 水平摇摆（右侧上下风）
    coolFreeUpLrWind: "", // 垂直摇摆（上侧左右风）
    coolFreeDownLrWind: "", // 垂直摇摆（下侧左右风）
    coolFreeForceCool: "", //强制制冷
    coolFreeForceAuto: "", //强制自动    
    // elecHeat：电辅热，与普通空调公用字段
    elecHeatWithT4: "", // 电辅热判断T4

    // 数据2
    coolFreeCoolWarmFeel: "", //知冷暖
    // againstCool: 防着凉公用字段
    coolFreeWindOnPeople:"", //风吹人
    coolFreeWindOffPeople:"", //风避人
    coolFreeSterilize:"", //杀菌
    coolFreeElecCleanDust:"", //电子除尘
    coolFreeSelfClean:"", //自清洁
    coolFreePowerSaving:"", //省电

    // 数据3
    coolFreeOneKeyOptimise:"", //一键优化
    coolFreeNoPeoplePowerSave: "", //无人节能
    coolFreeAutoClean:"", //自动净化
    coolManualClean:"", //手动净化
    coolFreeNowindFeelMode:"", //无风感模式
    coolFreeTryRunning:"", //试运行
    coolFreeFastCheck:"", //快检

    //数据4
    coolFreeAutoHum:"", // 自动加湿
    coolFreeManualHum:"", //手动加湿
    coolFreeInWindStrength:"", //进风强度
    coolFreeNewWindSwitch:"", //新风机开关
    coolFreeNewWindLinkSwitch:"", //新风联动开关
    coolFreeVacuum:"", //工程抽真空
    // bodySense： 公用字段
    coolFreeOutWindStrength:"", //排风强度

    //数据5
    //公用mode字段 模式
    //数据6 设定温度
    //公用tempSet2字段
    //数据7
    //公用windSpeed字段 风速
    //数据8
    coolFreeSetHum:"", //设定湿度
    //数据9
    coolFreePm25: "", //自动净化/一键优化开启时PM2.5目标值
    //数据10-12不需要解，发码的时候写死
    //数据13
    coolFreeAddHum:"", //加湿
    //数据14，发码时写死
    //数据15
    coolFreeFreshAirMode:"", // 新风机设定模式 0-待机；1-普通模式；2-正压模式；3-负压模式；4-智能模式；5-内循环模式
    //数据16
    coolFreeFreshAirWindSpeed:"", // 新风机设定风速 1~100-1%~100%；101-固定风；102-自动风；103-停风机；
    //数据17
    coolFreeWaterSwitch:"", // 水力模块开关机
    coolFreeWaterSavePower:"", //水力模块节能
    coolFreeWaterClean:"", //水力模块清洗
    coolFreeWaterTW1: "", // 水力模块出水温度自动设定
    coolFreeWaterElecheat:"", // 水力模块电辅热
    coolFreeWaterTryRunning:"", //水力模块试运行
    coolFreeWaterFuncTest:"", //水力模块能力测试
    coolFreeWaterOuter:"", //水力模块外出

    //数据18水力模块设定模式
    coolFreeWaterMode:"", //0x00-制冷模式；0x01-制热模式；0x02-制热水模式；0x03-制热+制热水模式；0x04-制冷+制热水模式
    //数据19
    coolFreeWaterTempSet:"", // 水力模块总出水温度设定 实际温度*2+50，例如：17度则为：34+50=84，17.5度则为：35+50=85；
    // 数据20
    coolFreeConnectBackWindPanel:"" , // 回风面板是否已连接
    coolFreeConnectOutWindPanel:"" , // 出风面板是否已连接
    coolFreeHasLeftRightWind:"", //是否有左右风功能
    coolFreeHasNowindFeel:"", //是否有无风感功能
    coolFreeHasFreshAir:"", //是否有新风机
    coolFreeHasAddHum:"", //是否有加湿器
    coolFreeHasWaterModule:"", //是否有水力模块

    //数据21
    coolFreeOneKeyOptimiseTempSet:"", //一键优化温度设定值 实际温度*2+30，例如：17度则为：34+30=64，17.5度则为：35+30=65；
    //数据22
    coolFreeOneKeyOptimiseHumSet:"", // 一键优化湿度设定值
    //数据23
    coolFreeOneKeyOptimiseWindSpeedSet:"", // 一键优化风速设定值
    //数据24
    coolFreeWaterTankTempSet:"", // 水箱设定水温
    //数据25
    //timingOnSwitch 公用字段
    //timingOffSwitch 公用字段】
    coolFreeTimingUsable: "", // 设置定时有效
    coolFreeStopWarm: "", // 停暖（分水阀）
    coolFreeCosySleep: "", //舒睡
    coolFreeECO: "", //ECO
    coolFreeSuperCooling: "", // 智控温

    //数据26
    //数据26
    timingOnValue: "", //开机时间
    timingOffValue: "", //关机时间

    //数据29 
    coolFreeUpdownDirect: "", //上下风操作
    coolFreeLeftRightDirect: "",//左右风操作

    //数据30
    coolFree1HourCosySleep: "", // 第一个小时的舒睡温度整数（0代表16度）
    coolFree2HourCosySleep: "", // 第二个小时的舒睡温度整数（0代表16度）
    //数据31
    coolFree3HourCosySleep: "", // 第3个小时的舒睡温度整数（0代表16度）
    coolFree4HourCosySleep: "", // 第4个小时的舒睡温度整数（0代表16度）
    //数据32
    coolFree5HourCosySleep: "", // 第5个小时的舒睡温度整数（0代表16度）
    coolFree6HourCosySleep: "", // 第6个小时的舒睡温度整数（0代表16度）
    //数据33
    coolFree7HourCosySleep: "", // 第7个小时的舒睡温度整数（0代表16度）
    coolFree8HourCosySleep: "", // 第8个小时的舒睡温度整数（0代表16度）
    //数据34
    coolFree9HourCosySleep: "", // 第9个小时的舒睡温度整数（0代表16度）
    coolFree10HourCosySleep: "", // 第10个小时的舒睡温度整数（0代表16度）
    //数据35
    coolFree1HourCosySleepDot: "",  // 第1个小时的舒睡温度小数
    coolFree2HourCosySleepDot: "", // 第2个小时的舒睡温度小数
    coolFree3HourCosySleepDot: "", // 第3个小时的舒睡温度小数
    coolFree4HourCosySleepDot: "", // 第4个小时的舒睡温度小数
    coolFree5HourCosySleepDot: "", // 第5个小时的舒睡温度小数
    coolFree6HourCosySleepDot: "", // 第6个小时的舒睡温度小数
    coolFree7HourCosySleepDot: "", // 第7个小时的舒睡温度小数
    coolFree8HourCosySleepDot: "", // 第8个小时的舒睡温度小数
    // 数据36
    coolFreeCosySleepUsableHour:"", // 舒睡时间有效小时数
    coolFree9HourCosySleepDot: "", // 第9个小时的舒睡温度小数
    coolFree10HourCosySleepDot: "", // 第10个小时的舒睡温度小数
    coolFreeSound:"", //新风蜂鸣器
    coolFreeFreshAirSterilize:"", //新风除菌
    //数据37
    coolFreeDehumType:"", //抽湿类型
    coolFreeHasAllTime:"", //当前线控器版本是否支持全时智控
    coolFreeShowAllTime:"", // 当前呈现给用户的控制是一键优化还是全时智控 0-一键优化 1-全时智控
    coolFreeAllTimeSwitch:"", //全时智控开关
    coolFreeDealdehyde:"", //除醛

    // 其他
    coolFreeStrong:"",

    // 厨房空调
    dustFullTime:"", // 滤网


    // 北方采暖器
    northWarmEffluentTemperature:"", // 出水温度
    northWarmTargetTemp:"", // 目标室内温度
    outMode:"",   // 外出模式
    muteVoice:"", // 静音模式,
    waterModelAuto: "", // 自动水温模式
    northWarmEco: "", // eco北方采暖
    // temperature_control_switch
    northWarmTempCtrlSwitch: "", // 目标室温开关
    holidayMode: "", // 北方采暖假期模式
    holidayModeMcuSwitch: "", 
    northWarmpowerOnTimer: "", // 定时开标志
    northWarmpowerOffTimer: "",
    vacation_entry_time_byte0: "",// 假期开始年
    vacation_entry_time_byte1: "", // 度假开始月
    vacation_entry_time_byte2: "", // 度假开始日
    vacation_entry_time_byte3: "", // 度假开始时

    vacation_exit_time_byte0: "", // 度假结束年
    vacation_exit_time_byte1: "", // 度假结束月
    vacation_exit_time_byte2: "", // 度假结束日
    vacation_exit_time_byte3: "", // 度假结束时
    voiceBroadcastStatus:"",
    current_water_temperature:"",
    
  },

  /*************************************************更多状态结构*************************************************/
  /*  当前信息查询/设置结构   */
  curInfoQuery_Ex_t: {
    optCommand: '',	// 操作/控制命令
    /*0x00-同步信息指令
     0x01-随身感温度值
     0x02-特殊功能键值
     0x03-查询状态
     0x04-安装位置检测
     0x05–工程模式
     0x06-制冷制热最大频率限制
     其他-无效指令
     */
    optVal:                   // 操作/控制内容
      {
        bodyTemp: "",     // 随身感温度值, 0~50
        specKey: "",      // 特殊功能键值, 0-无效，1-i模式记忆, 2-数显长按(开启或关闭), 3-查询显示板程序版本
        queryStat: "",    // 查询状态, 0-无效, 1-退出查询, 2-查询室内温度, 3-查询室外温度
        instPos: "",      // 安装位置检测, 0-无效, 255-查询当前安装位置, 1-左2, 2-左1, 3-居中, 4-右1, 5-右2
        testMode: "",     // 工程模式
        maxCoolHeat: "",  // 制冷制热最大频率限制
      },
    sound: "",       // 提示音 0关 1开
    order: "",       // 帧序号
    rev: [],         //(2位数组)
  },
  /*C1主动上传第1组参数-返回*/
  totalStateFirstGroup: {
    purificationFilterDirty:"",
    wetFilmRemind:"",
    equipmentRunningState:"",
    ACrunningRunning:"",
    purificationRunning:"",
    humidificationRunning:"",
    freshRunning:"",
    sterilizationRunning:"",
    smartCleanRunning:"",
    ACmode:"",
    humidifyingMode:"",
    purificationMode:"",
    sterilizationMode:"",
    freshMode:"",
    freshRunningMode:"",
    inTemperature:"",
    evaporatorTemperature:"",
    condenserTemperature:"",
    outTemperature:"",
    TPTemperature:"",
    compressorCurrentFrequency:"",
    inGoalFrequency:"",
    compressorCurrent:"",
    outTotalCurrent:"",
    outAcVoltage:"",
    outMode:"",
    leftSetWindSpeed:"",
    rightSetWindSpeed:"",
    faultE60:"",
    faultE61:"",
    faultE0:"",
    faultE3:"",
    faultE1:"",
    faultEF:"",
    faultEL:"",
    faultEH:"",
    faultF9:"",
    faultPL:"",
    faultEU:"",
    faultFb:"",
    faultFC:"",
    faultFE:"",
    faultE2:"",
    faultE8:"",
    faultE9:"",
    faultP9:"",
    faultP13:"",
    faultE33:"",
    faultPM:"",
    faultCO2:"",
    faultHumidity:"",
    faultAirHumidity:"",
    limitFrequencyLowL0:"",
    limitFrequencyP91:"",
    limitFrequencyL1:"",
    limitFrequencyKeepL1:"",
    limitFrequencyPA:"",
    limitFrequencyHighL0:"",
    limitFrequencyKeep:"",
    limitFrequencyP90:"",
    limitFrequencyTPL2:"",
    limitFrequencyTPKeep:"",
    limitFrequencyTPP6:"",
    limitFrequencyRemote:"",
    limitFrequencyEE:"",
    limitFrequencyEA:"",
    limitFrequencyE31:"",
    limitFrequencyE32:"",
    frost:"",
    electricAuxiliaryHeat:"",
    levelLeft:"",
    levelRight:"",
    verticalLeft:"",
    verticalRight:"",
    indoorFan:"",
    purification:"",
    outdoorEnvironmentTemperature:"",
    remoteControl:"",
    faultE51:"",
    faultE52:"",
    faultE53:"",
    faultE54:"",
    faultE55:"",
    faultP2:"",
    faultE7:"",
    faultP82:"",
    faultP40:"",
    faultP41:"",
    faultP42:"",
    faultP43:"",
    faultP44:"",
    faultP45:"",
    faultP46:"",
    faultP47:"",
    faultP48:"",
    faultP49:"",
    faultP0:"",
    faultP10:"",
    faultP11:"",
    faultP12:"",
    faultP81:"",
    faultLowPressure:"",
    limitFrequencyHighTP:"",
    limitProtectHighTP:"",
  },
  /*第0组参数-返回*/
  stQueryTimeParamAck_Ex_t: {
    powerOnDay: "",     // 总上电时间
    powerOnHour: "",
    powerOnMin: "",
    powerOnSec: "",
    totalWorkedDay: "", // 总工作时间
    totalWorkedHour: "",
    totalWorkedMin: "",
    totalWorkedSec: "",
    curWorkedDay: "",   // 当次工作时间
    curWorkedHour: "",
    curWorkedMin: "",
    curWorkedSec: "",
  },
  totalStateFirstGroup_1:{
   newWindFunWindMode:"",
   smartCleanSW:"",//智清洁设定状态
   sterilizeSw:"",//杀菌设定状态
   newWindFunSw:"",//新风设定状态
   humFunSw:"",// //加湿设定状态
   cleanFunSw:"",//净化设定状态
   runStatus:"",//空调设定状态
   deviceSetRunStatus:"",//设备设定总状态

   wetfilmFunSw:"", //湿膜更换提醒
   purfiyFilm:"", //净化滤网是否脏堵
   acstrainerSw:"",//空调滤网是否脏堵 0无此功能，1:空调滤网正常，2:空调滤网脏，3：清除空调滤网计时时间
   elecHeat:"", //电辅热
   strong:"", //强劲
   diyFunc:"", //干燥
   currentRunMode:"",//实际运行模式

   runCurrentStatus:"",  //空调运行状态
   deviceCurrentRunStatus:"",//设备运行总状态

   t1Temp:"",//T1温度
   t2Temp:"",//T2温度
   t3Temp:"",//T3温度
   t4Temp:"",//T4温度
   tpTemp:"",//TP AD值
   tempIn:"",
   tempOut:"",//室外温度为T4温度

   comRunFrequency :"",              // 压缩机频率
   comTargetFrequency:"",               //压缩机目标频率
   yaSuoJiDianLiu:"",               //压缩机电流
   shiWaiJiZongDianLiu:"",        //室外机总电流 单位0.25A
   shiWaiJiDianYa:"",                 //室外机电压有效值
   shiNeiJiYunZhuanMoshi:"",           // 室内机运转模式
   leftWindClass:"",                    //室内设定风速转速(左风机)
   rightWindClass:"",                   //室内设定风速转速(右风机)

   roomIFaultState1_0:"",// 室温环境传感器故障
   roomIFaultState1_1:"",// 室内管温传感器故障
   roomIFaultState1_2:"",// 室内E方故障
   roomIFaultState1_3:"",// 室内直流风机失速故障
   roomIFaultState1_4:"",// 室内外机通信故障
   roomIFaultState1_5:"",// 智慧眼故障
   roomIFaultState1_6:"",// 显示板E方故障
   roomIFaultState1_7:"",// 射频模块故障


   roomIFaultState2_0:"",// 新平台室内机配老平台室外机F9故障
   roomIFaultState2_1:"",// 冷媒泄露故障PL
   roomIFaultState2_2:"",// 灰尘传感器故障
   roomIFaultState2_3:"",// 电表模块通信故障
   roomIFaultState2_4:"",// 湿度传感器故障
   roomIFaultState2_5:"",// 净化器风机失速E30
   roomIFaultState2_6:"",// 室内过零检测故障（E2）
   roomIFaultState2_7:"",// 模式冲突故障（E8）

    roomIFaultState3_0:"",//开关门故障（E9）
    roomIFaultState3_1:"",//防冷风保护(P9)
    roomIFaultState3_2:"",//外销电压保护(P13-电压匹配错误)
    roomIFaultState3_3:"",//下风机失速故障
    roomIFaultState3_4:"",//PM2.5传感器故障
    roomIFaultState3_5:"",//CO2传感器故障
    roomIFaultState3_6:"",//上湿度传感器故障
    roomIFaultState3_7:"",//新风湿度传感器故障

    roomILimitFreqState1_0:"",// 蒸发器低温限频
    roomILimitFreqState1_1:"",// 蒸发器低温保护
    roomILimitFreqState1_2:"",// 冷凝器高温限频
    roomILimitFreqState1_3:"",// 冷凝器高温保持
    roomILimitFreqState1_4:"",// 冷凝器高温保护(PA)
    roomILimitFreqState1_5:"",// 蒸发器高温限频
    roomILimitFreqState1_6:"",// 蒸发器高温保持
    roomILimitFreqState1_7:"",// 蒸发器高温保护

    roomILimitFreqState2_0:"",//排气高温限频
    roomILimitFreqState2_1:"",//排气高温保持
    roomILimitFreqState2_2:"",// 排气高温保护
    roomILimitFreqState2_3 :"",// 遥控器限制最高运行频率起作用
    roomILimitFreqState2_4:"",// 主控板在快检时检测E方，发现不能写入，显示板显示EE
    roomILimitFreqState2_5:"",// 主控板读取E方数据时，E方硬件正常，但是数据错误，显示板显示EA
    roomILimitFreqState2_6:"",// 室内外置风机电压过低保护
    roomILimitFreqState2_7:"",// 室内外置风机电压过高保护

    roomILoadState1_0:"",//化霜
    roomILoadState1_1:"",//电辅热
    roomILoadState1_2:"",//水平导风条摆风（左）
    roomILoadState1_3:"",//水平导风条摆风（右）
    roomILoadState1_4:"",//垂直导风条摆风（左）
    roomILoadState1_5:"",//垂直导风条摆风（右）
    roomILoadState1_6:"",//室内风机运行/停止
    roomILoadState1_7:"",//净化负载

    outDoorDevState1_0:"",//室外E方故障(E51)
    outDoorDevState1_1:"",//室外T3传感器故障(E52)
    outDoorDevState1_2:"",//室外T4传感器故障(E53)
    outDoorDevState1_3:"",//室外排气传感器故障(E54)
    outDoorDevState1_4:"",//室外回气传感器故障(E55)
    outDoorDevState1_5:"",//压顶传感器温度保护(P2)
    outDoorDevState1_6:"",//室外直流风机故障（内置驱动）(E7)
    outDoorDevState1_7:"",//输入交流电流采样电路故障

    outDoorDevState2_0:"",//主控芯片与驱动芯片通信故障
    outDoorDevState2_1:"",//压机电流采样电路故障
    outDoorDevState2_2:"",//压机启动故障
    outDoorDevState2_3:"",//压机缺相保护
    outDoorDevState2_4:"",//压机零速保护
    outDoorDevState2_5:"",//室外341主芯片驱动同步故障
    outDoorDevState2_6:"",//压机失速保护
    outDoorDevState2_7:"",//压机锁定保护

    outDoorDevState3_0:"",//压机脱调保护
    outDoorDevState3_1:"",//压机过电流故障(P49)
    outDoorDevState3_2:"",//室外IPM模块保护(P0)
    outDoorDevState3_3:"",//电压过低保护(P10)
    outDoorDevState3_4:"",//电压过高保护(P11)
    outDoorDevState3_5:"",//室外直流侧电压保护(P12)
    outDoorDevState3_6:"",//室外电流保护(P81)
    outDoorDevState3_7:"",//压缩机低压故障

    outDoorDevState4_0:"",//压机排气高温限频(L2)
    outDoorDevState4_1:"",//压机排气高温保护(P6)
    outDoorDevState4_2:"",//冷凝器高温限(L1)
    outDoorDevState4_3:"",//冷凝器高温保护(L1)
    outDoorDevState4_4:"",//系统高压(力)限频
    outDoorDevState4_5:"",//系统高压(力)保护
    outDoorDevState4_6:"",//系统低压(力)限频
    outDoorDevState4_7:"",//系统低压(力)保护

    outDoorDevState5_0:"",//电压限频
    outDoorDevState5_1:"",//电流限频
    outDoorDevState5_2:"",//PFC模块开关停机
    outDoorDevState5_3:"",//PFC模块故障限频
    outDoorDevState5_4:"",//341MCE故障
    outDoorDevState5_5:"",//341同步故障
    outDoorDevState5_6:"",//三相电源反相
    outDoorDevState5_7:"",//三相电源缺相


    outDoorDevState6_0:"",//交流风机室外低风
    outDoorDevState6_1:"",//交流风机室外中风
    outDoorDevState6_2:"",//交流风机室外高风
    outDoorDevState6_3:"",//四通阀开关状态
    outDoorDevState6_4:"",//外风机过流（外置驱动）
    outDoorDevState6_5:"",//外风机失速（外置驱动）
    outDoorDevState6_6:"",//外风机缺相（外置驱动）
    outDoorDevState6_7:"",//外风机零速（外置驱动）

    outDoorIFanSpeed:"",//当前室外直流风机转速/8
    outDoorEleSwitch:"",//当前室外电子膨胀阀/8
    outDoorBackTemp:"",//室外回气温度AD值
    outDoorVoltage:"",//室外母线电压AD值
    ipmTemp:"",//IPM模块温度

    dryHeatTimeValue:"",//关机后干燥清洁或吹余热的时间

    newWindFunCurrentValue:"",//co2/tvoc数值
    cleanFunCurrentValue:"",//灰尘浓度(PM2.5)
    humFunWindCurrentValue:"",//主控板湿度传感器(当前湿度)
    sterilizeRunTime:"",//杀菌实际运行计时
    wetfilmTime:"",//湿膜计时
    purfiyFilmTime :"",//净化滤网计时
    smartCleanCurrentRunTime:"",//自清洁实际运行时间（分钟）

    leftWindCurrentClass:"",////左风机实际转速档位
    rightWindCurrentClass:"",////右风机实际转速档位
    downWindSetClass:"",////下风机设定风速
    downWindCurrentClass:"",////下风机实际转速档位
    setHumValue:"",////设定湿度值

    humFunWindClass:"",
    cleanFunWindClass:"",
    newWindFunClass:"",
    sterilizeWindClass:"",

    productCode:"",//防抽卡
    errCode:"", //故障类型
    inDisplayTransport:"",//室内板与显示板通信故障(Eb)
    compressorPosProtect:"",//压缩机位置保护(P4)
    inDisplayTransit:""//显示板与中转板通信故障(Eb1)
  },
  totalStateFirstGroup_2:{
    timingOnMinute:"",//定时开时间
    timingOffMinute:"",//定时关时间
    localBodySense:"",//"随身感功能实际状态 0： 关    1：开"
    energySave:"",//"节能功能实际状态  0： 关    1：开"
    restrong:"",//"强劲功能实际状态 0： 关    1：开"
    refarceWind:"",//"睿风功能实际状态 0： 关    1：开"
    repowerSave:"",//"省电功能实际状态 0： 关    1：开"
    cosySleepSwitch:"",//"舒睡功能实际状态 0： 关    1：开"
    ecoFunc:"",//"ECO功能实际状态 0： 关    1：开"
    CSEco: "",              // CSEco 0-关，1-开
    checkCode: "", //校验码

    dustFunFlag:"",//"除尘 0： 关    1：开"
    reElecHeat:"",//"电辅热功能实际状态 0： 关    1：开"
    rediyFunc:"",//"干燥功能实际状态 0： 关    1：开"
    rechgOfAir:"",//"换气功能实际状态 0： 关    1：开"
    wisdomEye:"",//"智慧眼功能实际状态 0： 关    1：开"
    naturalWind:"",//"自然风功能实际状态 0： 关    1：开"
    repeakValleyMode:"",//"峰谷节电功能实际状态 0： 关    1：开"
    nightLight:"",//"小夜灯功能实际状态 0： 关    1：开"

    againstCool:"",//"防着凉功能实际状态0： 关    1：开"
    childKickk:"",//"儿童踢被功能实际状态0： 关    1：开"
    almSleep:"",//"睡眠（外销）功能实际状态0： 关    1：开"
    pmv:"",//"PMV功能实际状态0： 关    1：开"
    displayControlFlag:"",//"屏显信息实际状态0： 灭    1：亮"
    controlSelfCleaningCurrentStatus:"",//"自清洁功能实际状态0： 关    1：开"
    nonDirectWind:"",//"防直吹功能实际状态0： 关    1：开"
    isOpen8DegreeHotCurrentStatus:"",//"8度制热（外销）功能实际状态0： 关    1：开"

    smartfunCurrentStatus:"",//"无风感功能实际状态

    isUseDoubleTempCtrl:"",//"双温控制（外销）0： 关    1：开"
    ladderFunSw:"",//"阶梯降温功能0： 关    1：开"
    upDnDaoFengTiaoStat:"",//"上下导风条摇摆状态（左上下风）0： 关    1：开"
    ltRtDaoFengTiaoStat:"",//"左右导风条摇摆状态（左左右风）0： 关    1：开"
    TopDaoFengTiaoStat:"",//"顶出风导风条摇摆状态0： 关    1：开"

    upDnDaoFengTiaoStatRightDown:"",//"上下导风条摇摆状态（右上下风）0： 关    1：开"
    ltRtDaoFengTiaoStatRightLeft:"",//"左右导风条摇摆状态（右左右风）0： 关    1：开"

    humFunWindCurrentValue:"",//湿度百分比(补偿之后的湿度值)
    checkedTempSet:"",//设定温度（补偿后的设定温度）
    indoorFanRuntime:"",//内风机运行时间
    outdoorFanSpeed:"",//室外风机目标转速（目标转速/8）
    eleSwitchAngle:"",//电子膨胀阀目标角度（目标开度/8）
    defrostingStep:"",//化霜阶段（0：无化霜 1：化霜开始阶段 2：化霜过程中 3：化霜结束阶段）
    outdoorDevState7:"",//回液检测故障(P92)
    outdoorDevState8:"",//"室外IBGT传感器故障"
    outDoor485Faul:"",//"室外故障或保护（轻商485旧协议）"
    engineCurWorkedTime:"",//当前压缩机运行时间(秒)
    engineTotalWorkedTime:"",//压缩机累积运行时间(小时)
    limitFreqType2:"",//限频类型2（预留）
    devMaxVoltage:"",//整机运行最大电压值(电压值-60)
    devMinVoltage:"",//整机运行最小电压值(电压值-60)
    historyMaxCurrent:"",//整机运行历史最大电流值
    historyMaxForT4:"",//整机运行历史最大,T4温度值（AD值）
    historyMinForT4:"",//整机运行最小T4温度值（AD值）
    totalErrCnt:"",//累计故障次数（6分钟以后的累计故障次数）
    shiWaiYaSuoJiCiTong:"",//压缩机磁通量（点数/8）
    shiNeiFengJiCiTong:"",//风机磁通量（点数/8）
    dSpinCurrent:"",//d轴电流（点数/64）（有符号数）
    qSpinCurrent:"",//q轴电流（点数/64）（有符号数）
    enginePeakCurrent:"",//压缩机电流峰值（单位：安培）
    pfcPeakCurrent:"",//PFC电流峰值（单位：安培） 0~255A
    fanPeakCurrent:"",//风机电流峰值（单位：安培） 实际电流峰值*32
    torqueAdjustAngle:"",//转矩补偿角度低位
    torqueAdjustValue:"",//转矩补偿幅值（点数/8）
    adAdjustVoltage1:"",//AD校准电压1（AD值/16）
    adAdjustVoltage2:"",//AD校准电压1（AD值/16）
    dSpinVoltage:"",//d轴电压（点数/16）
    qSpinVoltage:"",//q轴电压（点数/16）
    pfcSwitchStatus:"",//PFC开关状态
    comStartStatus:"",//压缩机启动阶段
    outSidePowerFactor:"",//功率因数（*256）
    outSidePower:"",//室外机功率（单位：W）
    upDnDaoFengTiaoCoolUpperLimit:"",//上导风条制冷角度（上摇摆的上限角度百分比）
    upDnDaoFengTiaoCoolLowerLimit:"",//上导风条制冷角度（上摇摆的下限角度百分比）
    upDnDaoFengTiaoHeatUpperLimit:"",//上导风条制热角度（上摇摆的上限角度百分比）
    upDnDaoFengTiaoHeatLowerLimit:"",//上导风条制热角度（上摇摆的下限角度百分比）
    upDnDaoFengTiaoCurAngle:"",//上导风条角度（上导风条当前角度百分比）
    ltRtDaoFengTiaoUpperLimit:"",//左右导风条角度（左右导风条摇摆的上限角度百分比）
    ltRtDaoFengTiaoLowerLimit:"",//左右导风条角度（左右导风条摇摆的下限角度百分比）
    ltRtDaoFengTiaoCurAngle:"",//左右导风条角度（左右导风条当前角度百分比）

    outDoorDestFreq:"",//室外目标频率
    intDoorTargetWindSpeed:"",//室内目标风速百分比

    TopDaoFengTiaoUpperLimit:"",//顶出风导风（顶出风导风条摇摆的上限角度百分比）
    TopDaoFengTiaoLowerLimit:"",//顶出风导风（顶出风导风条摇摆的下限角度百分比）
    TopDaoFengTiaoCurAngle:"",//顶出风导风（顶出风导风条当前角度百分比）

    downDaoFengTiaoCoolUpperLimit:"",//下导风条制冷角度（下摇摆的上限角度百分比）
    downDaoFengTiaoCoolLowerLimit:"",//下导风条制冷角度（下摇摆的下限角度百分比）
    downDnDaoFengTiaoHeatUpperLimit:"",//下导风条制热角度（下摇摆的上限角度百分比）
    downDnDaoFengTiaoHeatLowerLimit:"",//下导风条制热角度（下摇摆的下限角度百分比）
    downDnDaoFengTiaoCurAngle:"",//下导风条角度（下导风条当前角度百分比）

    secondHumValue:"",//下湿度传感器数值

    strongCurrent:"",// "强劲功能运行状态1：开启 0：关闭"
    sterilizeCurrentSW :"",//"杀菌负载运行状态1：开启 0：关闭"
    newWindFunCurrentSw :"",//"新风负载运行状态1：开启 0：关闭"
    humFunCurrentSw:"",//"加湿负载运行状态1：开启 0：关闭"
    cleanFunCurrentSw:"",//"净化负载运行状态1：开启 0：关闭"
    controlSelfCleaningCurrentStage:"",//"自清洁进度0：未自清洁  重复了
    smartCleanCurrentStatus:"",//智清洁阶段

    rightControlWindCurrentFree:"",//"右无风感状态 1：开 0：关"
    leftControlWindCurrentFree:"",//"左无风感状态 1：开 0：关"
    upDnDaoFengTiaoCurrentStat:"",//"上下导风条摇摆状态（右侧上下风）1：摇摆 0：未摇摆"
    ltRtDaoFengTiaoCurrentStat:"",//"左右风摇摆状态（右侧左右风） 1：摇摆 0：未摇摆"
    pannelProtect:"",//"缺面板保护1：面板取下 0：面板安装"
    hydropenia :"",//"水箱缺水1：缺水0：有水"
    ltRtDaoFengTiaoCurrentStatLeft:"",//"左右风摇摆状态（左侧左右风）1：摇摆 0：未摇摆"
    upDnDaoFengTiaoCurrentStatLeft:"",//"上下导风条摇摆状态（左侧上下风）1：0：未摇摆"
  },

  /*第1组参数-设置*/
  stSetBaseRunInfoReq_Ex_t: {
    transTest: "",
    // 传输能力测试 1：制冷最大能力  2：制冷额定能力
    // 3：制冷中间能力 4:制冷最小能力    5:低温制热能力
    // 6:制热额定能力 7:制热中间能力 8:制热最小能力
    // 9:参数强制设定 10:退出强制运行 11:制冷25％ 12:制热25％

    yaSuoJiPinlv: "",                  // 压缩机频率
    siTongFaState: "",                 // 四通阀状态
    neiFengJiZhuanSu: "",              // 内风机转速
    waiFengJiZhuanSu: "",              // 外风机转速
    dianZiPengZhangFaKaiDu: "",        // 电子膨胀阀开度/2
    paiQiMuBiaoWenDu: "",              // 排气目标温度
    diWenZhiReHuaShuangShiJian: "",    // 低温制热化霜时间间隔
    diWenZhiReJinRuT3: "",             // 低温制热进入T3温度
    diWenZhiReHuaShuangPinLv: "",      // 低温制热化霜频率
    order: "",                         // 帧序号
  },

  /*第1组参数-返回*/
  stQueryBaseRunInfoAck_Ex_t: {
    yaJiShiJiPinLv: "",         // 压机实际运行频率
    shiNeiMuBiaoPinLv: "",      // 室内目标频率
    yaSuoJiDianLiu: "",         // 压缩机电流 单位0.25A
    shiWaiJiZongDianLiu: "",    // 室外机总电流 单位0.25A
    shiWaiJiDianYa: "",         // 室外机电压有效值
    shiNeiJiYunZhuanMoshi: "",  // 室内机运转模式
    t1Temp: "",                 // T1温度
    t2Temp: "",                 // T2温度
    t3Temp: "",                 // T3温度
    t4Temp: "",                 // T4温度
    tpTemp: "",                 // TP温度,AD值
    shiWaiFengJiCiTong: "",     // 室外风机磁通量
    shiWaiYaSuoJiCiTong: "",    // 室外压缩机磁通量
    shiNeiFengJiCiTong: "",     // 室内风机磁通量
  },

  /*第2组参数-返回*/
  stQueryIndoorDevAck_Ex_t: {
    setRoomIWindSpeed: "",     // 设定室内风速(风档或高中低静音)
    roomIFengjiSpeed: "",      // 室内风机转速

    // 室内故障状态字节1
    roomIFaultState1_0: "",    // 室温环境传感器故障
    roomIFaultState1_1: "",    // 室内管温传感器故障
    roomIFaultState1_2: "",    // 室内E方故障
    roomIFaultState1_3: "",    // 室内直流风机失速故障
    roomIFaultState1_4: "",    // 室内外机通信故障
    roomIFaultState1_5: "",    // 智慧眼故障
    roomIFaultState1_6: "",    // 显示板E方故障
    roomIFaultState1_7: "",    // 射频模块故障

    // 室内故障状态字节2
    roomIFaultState2_0: "",    // 新平台室内机配老平台室外机F9故障
    roomIFaultState2_1: "",    // 冷媒泄露故障PL
    roomIFaultState2_2: "",    // 灰尘传感器故障
    roomIFaultState2_3: "",    // 电表模块通信故障
    roomIFaultState2_4: "",    // 湿度传感器故障
    roomIFaultState2_5: "",    // 净化器风机失速E30        [Modify：2014.09.11]
    roomIFaultState2_6: "",    // 净化器格栅保护P5         [Modify：2014.09.11]
    roomIFaultState2_7: "",    // 内主控板与显示板通信故障 [Modify：2014.09.11]

    // 室内故障状态字节3
    roomIFaultState3_0: "",    // 预留
    roomIFaultState3_1: "",    // 预留
    roomIFaultState3_2: "",    // 预留
    roomIFaultState3_3: "",    // 预留
    roomIFaultState3_4: "",    // 预留
    roomIFaultState3_5: "",    // 预留
    roomIFaultState3_6: "",    // 预留
    roomIFaultState3_7: "",    // 预留

    // 室内限频状态字节1
    roomILimitFreqState1_0: "",// 蒸发器低温限频
    roomILimitFreqState1_1: "",// 蒸发器低温保护
    roomILimitFreqState1_2: "",// 冷凝器高温限频
    roomILimitFreqState1_3: "",// 冷凝器高温保持
    roomILimitFreqState1_4: "",// 冷凝器高温保护
    roomILimitFreqState1_5: "",// 蒸发器高温限频
    roomILimitFreqState1_6: "",// 蒸发器高温保持
    roomILimitFreqState1_7: "",// 蒸发器高温保护

    // 室内限频状态字节2
    roomILimitFreqState2_0: "",// 排气高温限频
    roomILimitFreqState2_1: "",// 排气高温保持
    roomILimitFreqState2_2: "",// 排气高温保护
    roomILimitFreqState2_3: "",// 遥控器限制最高运行频率起作用
    roomILimitFreqState2_4: "",// 主控板在快检时检测E方，发现不能写入，显示板显示EE
    roomILimitFreqState2_5: "",// 主控板读取E方数据时，E方硬件正常，但是数据错误，显示板显示EA
    roomILimitFreqState2_6: "",// 预留
    roomILimitFreqState2_7: "",// 预留

    // 室内限频状态字节3
    roomILimitFreqState3_0: "",// 预留
    roomILimitFreqState3_1: "",// 预留
    roomILimitFreqState3_2: "",// 预留
    roomILimitFreqState3_3: "",// 预留
    roomILimitFreqState3_4: "",// 预留
    roomILimitFreqState3_5: "",// 预留
    roomILimitFreqState3_6: "",// 预留
    roomILimitFreqState3_7: "",// 预留

    // 室内负载状态字节1
    roomILoadState1_0: "",     // 化霜
    roomILoadState1_1: "",     // 电辅热
    roomILoadState1_2: "",     // 水平导风条摆风(左)
    roomILoadState1_3: "",     // 水平导风条摆风(右)
    roomILoadState1_4: "",     // 垂直导风条摆风(左)
    roomILoadState1_5: "",     // 垂直导风条摆风(右)
    roomILoadState1_6: "",     // 室内风机运行/停止
    roomILoadState1_7: "",     // 净化负载

    tempOutValid:"",           //室外环境温度查询使能

    // 室内负载状态字节2
    roomILoadState2_0: "",     // 预留
    roomILoadState2_1: "",     // 预留
    roomILoadState2_2: "",     // 预留
    roomILoadState2_3: "",     // 预留
    roomILoadState2_4: "",     // 预留
    roomILoadState2_5: "",     // 预留
    roomILoadState2_6: "",     // 预留
    roomILoadState2_7: "",     // 预留
    roomIE2paramVer: "",       // 室内E方参数版本
    childState: "",            // 儿童状态
    childNum: "",              // 儿童数量
    childAngle1: "",           // 儿童角度1
    childAngle2: "",           // 儿童角度2
    childDistance1: "",        // 儿童距离1
    childDistance2: "",        // 儿童距离2
  },

  /*第3组参数-返回*/
  stQueryOutdoorDevAck_Ex_t: {
    // 室外机状态1
    outDoorDevState1_0: "",// 室外E方故障
    outDoorDevState1_1: "",// 室外T3传感器故障
    outDoorDevState1_2: "",// 室外T4传感器故障
    outDoorDevState1_3: "",// 室外排气传感器故障
    outDoorDevState1_4: "",// 室外回气传感器故障
    outDoorDevState1_5: "",// 压顶传感器温度保护
    outDoorDevState1_6: "",// 室外直流风机故障
    outDoorDevState1_7: "",// 输入交流电流采样电路故障

    // 室外机状态2
    outDoorDevState2_0: "",// 主控芯片与驱动芯片通信故障
    outDoorDevState2_1: "",// 压机电流采样电路故障
    outDoorDevState2_2: "",// 压机启动故障
    outDoorDevState2_3: "",// 压机缺相保护
    outDoorDevState2_4: "",// 压机零速保护
    outDoorDevState2_5: "",// 室外341主芯片驱动同步故障
    outDoorDevState2_6: "",// 压机失速保护
    outDoorDevState2_7: "",// 压机锁定保护

    // 室外机状态3
    outDoorDevState3_0: "",// 压机脱调保护
    outDoorDevState3_1: "",// 压机过电流保护
    outDoorDevState3_2: "",// 室外IPM模块保护
    outDoorDevState3_3: "",// 电压过低保护
    outDoorDevState3_4: "",// 电压过高保护
    outDoorDevState3_5: "",// 室外直流侧电压保护
    outDoorDevState3_6: "",// 室外电流保护
    outDoorDevState3_7: "",// 预留

    // 室外机状态4
    outDoorDevState4_0: "",// 预留
    outDoorDevState4_1: "",// 预留
    outDoorDevState4_2: "",// 预留
    outDoorDevState4_3: "",// 预留
    outDoorDevState4_4: "",// 系统高压(力)限频
    outDoorDevState4_5: "",// 系统高压(力)保护
    outDoorDevState4_6: "",// 系统低压(力)限频
    outDoorDevState4_7: "",// 系统低压(力)保护

    // 室外机状态5
    outDoorDevState5_0: "",// 电压限频
    outDoorDevState5_1: "",// 电流限频
    outDoorDevState5_2: "",// PFC模块开关停机
    outDoorDevState5_3: "",// PFC模块故障限频
    outDoorDevState5_4: "",// 341MCE故障
    outDoorDevState5_5: "",// 341同步故障
    outDoorDevState5_6: "",// 预留
    outDoorDevState5_7: "",// 预留

    // 室外机状态6
    outDoorDevState6_0: "",// 交流风机室外低风
    outDoorDevState6_1: "",// 交流风机室外中风
    outDoorDevState6_2: "",// 交流风机室外高风
    outDoorDevState6_3: "",// 四通阀开关状态
    outDoorDevState6_4: "",// 外风机过流
    outDoorDevState6_5: "",// 外风机失速
    outDoorDevState6_6: "",// 外风机缺相
    outDoorDevState6_7: "",// 外风机零速
    outDoorIFanSpeed: "",  // 室外电机转速
    outDoorEleSwitch: "",  // 室外电子膨胀阀
    outDoorBackTemp: "",   // 室外回气温度
    outDoorVoltage: "",    // 室外母线电压
    ipmTemp: "",           // IPM模块温度
    outDoorLoadState: "",  // 室外负载状态
    outDoorDestFreq: "",   // 室外目标频率
  },

  /*第4组参数-设置*/
  stSetPowerInfoReq_Ex_t: {
    powerCmd: "",      // 命令类型
    powerParam: "",    // 命令相关参数
    powerTime: "",     // 电量对应时间
    order: "",         // 帧序号
  },

  /*第4组参数-返回*/
  stQueryPowerInfoRes_Ex_t: {
    totalPowerConsume: "",    // 总耗电量，精度0.00，单位KW
    totalRunPower: "",        // 累计运行耗电量，精度0.00，单位KW
    curRunPower: "",          // 本次运行耗电量，精度0.00，单位KW
    curRealTimePower: "",     // 当前实时功率，精度0.0000，单位KW
  },

  /*第5组参数-返回*/
  stQueryParam5Res_Ex_t: {
    humidity: "",             // 湿度
    checkedTempSet: "",       // 补正后的设定温度
    indoorFanRuntime: "",     // 内风机运行时间
    outdoorFanSpeed: "",      // 室外风机目标转速
    eleSwitchAngle: "",       // 电子膨胀阀目标角度
    defrostingStep: "",       // 化霜阶段
    outdoorDevState7: "",     // 当前室外机状态7
    outdoorDevState8: "",     // 当前室外机状态8
    engineCurWorkedTime: "",  // 当前压缩机运行时间 秒
    engineTotalWorkedTime: "",// 压缩机累积运行时间 小时
    limitFreqType2: "",       // 限频类型2
    devMaxVoltage: "",        // 整机运行最大电压值
    devMinVoltage: "",        // 整机运行最小电压值
  },

  /*第6组参数-返回*/
  stQueryParam6Res_Ex_t: {
    devMaxCurrent: "",    // 整机运行最大电流
    devMaxTemp4: "",      // 整机运行最大T4温度值
    devMinTemp4: "",      // 整机运行最小T4温度值
    totalErrCnt: "",      // 累计故障次数
    engineFlux: "",       // 压缩机磁通
    fanFlux: "",          // 风机磁通量
    dSpinCurrent: "",     // d轴电流
    qSpinCurrent: "",     // q轴电流
    enginePeakCurrent: "",// 压缩机峰值电流 安培
    pfcPeakCurrent: "",   // PFC峰值电流 安培
    fanPeakCurrent: "",   // 风机峰值电流
    torqueAdjustAngle: "",// 转矩补偿角度
    torqueAdjustValue: "",// 转矩补偿幅值
    adAdjustVoltage1: "", // AD校准电压1
  },

  /*第11组参数返回*/
  stQueryParam11Res_Ex_t: {
    order: "",                        // 帧序号(设置时使用)
    sound: "",                        // 设置的时候, 是否有声音提示

    upDnDaoFengTiaoStat: "",           // 上下导风条摇摆状态
    ltRtDaoFengTiaoStat: "",           // 左右导风条摇摆状态
    TopDaoFengTiaoStat: "",            // 顶部导风条摇摆状态
    upDnDaoFengTiaoCoolUpperLimit: "", // 上下导风条制冷摇摆的上限角度百分比
    upDnDaoFengTiaoCoolLowerLimit: "", // 上下导风条制冷摇摆的下限角度百分比
    upDnDaoFengTiaoHeatUpperLimit: "", // 上下导风条制热摇摆的上限角度百分比
    upDnDaoFengTiaoHeatLowerLimit: "", // 上下导风条制热摇摆的下限角度百分比
    upDnDaoFengTiaoCurAngle: "",       // 上下导风条当前角度百分比
    ltRtDaoFengTiaoUpperLimit: "",     // 左右导风条摇摆的上限角度百分比
    ltRtDaoFengTiaoLowerLimit: "",     // 左右导风条摇摆的下限角度百分比
    ltRtDaoFengTiaoCurAngle: "",       // 左右导风条当前角度百分比
    TopDaoFengTiaoUpperLimit: "",      // 顶出风导风条摇摆的上限角度百分比
    TopDaoFengTiaoLowerLimit: "",      // 顶出风导风条摇摆的下限角度百分比
    TopDaoFengTiaoCurAngle: "",        // 顶出风导风条当前角度
    resv: [],                          // 预留 (3位数组)
  },

  /*第11组参数-设置*/
  stSetParam11_Ex_t: {
    order: "",                        // 帧序号(设置时使用)
    sound: "",                        // 设置的时候, 是否有声音提示

    upDnDaoFengTiaoStat: "",           // 上下导风条摇摆状态
    ltRtDaoFengTiaoStat: "",           // 左右导风条摇摆状态
    TopDaoFengTiaoStat: "",            // 顶部导风条摇摆状态
    upDnDaoFengTiaoCoolUpperLimit: "", // 上下导风条制冷摇摆的上限角度百分比
    upDnDaoFengTiaoCoolLowerLimit: "", // 上下导风条制冷摇摆的下限角度百分比
    upDnDaoFengTiaoHeatUpperLimit: "", // 上下导风条制热摇摆的上限角度百分比
    upDnDaoFengTiaoHeatLowerLimit: "", // 上下导风条制热摇摆的下限角度百分比
    upDnDaoFengTiaoCurAngle: "",       // 上下导风条当前角度百分比
    ltRtDaoFengTiaoUpperLimit: "",     // 左右导风条摇摆的上限角度百分比
    ltRtDaoFengTiaoLowerLimit: "",     // 左右导风条摇摆的下限角度百分比
    ltRtDaoFengTiaoCurAngle: "",       // 左右导风条当前角度百分比
    TopDaoFengTiaoUpperLimit: "",      // 顶出风导风条摇摆的上限角度百分比
    TopDaoFengTiaoLowerLimit: "",      // 顶出风导风条摇摆的下限角度百分比
    TopDaoFengTiaoCurAngle: "",        // 顶出风导风条当前角度
    resv: [],                          // 预留 (3位数组)
  },

  //开始查询滤网状态请求
  stSetFilter_Ex_t: {
    order: "",                        // 帧序号(设置时使用)
    commond: "",                      // 命令号，1：启动 2：停止
    type: "",						  // 1:空调 2:净化器
  },

  //开始查询滤网状态返回
  stSetFilterRes_Ex_t: {
    result: "",
  },

  //查询滤网结果请求
  stGetFilterResult_Ex_t: {
    order: "",                      // 帧序号(设置时使用)
    type: "",						//1:空调 2:净化器
  },

  //查询滤网结果返回
  stGetFilterResultRes_Ex_t: {
    result: "",                       // 返回结果 1：成功 2:执行中 3：失败
    rate: "",						  // 基准功率
    real: "",						  // 实际功率
    threshold: "",					  // 检测阈值
  },

  //reset filter
  stResetFilter_Ex_t: {
    order: "",                      // 帧序号(设置时使用)
    type: "",						//1:空调 2:净化器
  },

  //reset filter response
  stResetFilterRes_Ex_t: {
    result: "",                      // 返回结果 1：成功 2:失败
  },

  //开始播报天气
  stStartVoice_Ex_t: {
    cityCode: "",                    //城市代码
  },

  //设置语音播报请求
  stSetVoice_Ex_t: {
    ele: "",
    weather: "",
    remind: "",
    maintain: "",
    atomosphere: "",
  },

  stA1Param_Ex_t: {
    totalPowerConsume: "",
    totalRunPower: "",
    curWorkedDay: "",
    curWorkedHour: "",
    curWorkedMin: "",
    t1Temp: "",
    t4Temp: "",
    pm25Value: "",
    curHum: "",
    lightAdValue: "",
  },
};

export {CMD, STATUS};
