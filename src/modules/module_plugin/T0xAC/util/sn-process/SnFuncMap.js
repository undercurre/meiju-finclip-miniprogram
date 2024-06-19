import {
    FuncType
} from './FuncType';

const SNFuncMatch = {
    // ceshi_: {//测试数据
    //     sn: "12645/40043/40025/51059/L9992", // KFR-35G/N8HB1
    //     func: [
    //         FuncType.ModeControl, // 模式控制
    //         // FuncType.UpDownSwipeWind, // 上下风
    //         // FuncType.LeftRightSwipeWind,//左右风
    //         FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
    //         FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）
    //         FuncType.FreshAir,
    //         FuncType.UpNoWindFeel,
    //         FuncType.DownNoWindFeel,
    //         FuncType.WindBlowing,//防直吹            
    //         FuncType.Dry, // 干燥
    //         FuncType.ElectricHeat, // 电辅热     
    //         FuncType.SelfCleaning,//自(智)清洁            
    //         // FuncType.AppointmentSwitchOn,  //定时
    //         FuncType.ECO, // ECO     
    //         FuncType.CSEco,      
    //         FuncType.NoWindFeel,//无风感
    //         // FuncType.HumidityDisplay,//显示室内湿度
    //         // FuncType.SmartRemoveWet,//舒适抽湿
    //         // FuncType.ManualRemoveWet,//个性抽湿
    //         // 强劲抽湿：待定
    //         // FuncType.Quietness,//睡眠         
    //         FuncType.Supercooling,//智控温
    //         FuncType.Degerming, //杀菌    
    //         FuncType.Voice, // 语音 
    //         FuncType.SleepCurve,                        
    //         FuncType.Dot5Support,
    //         FuncType.NoPolar,
    //         FuncType._16Support,
    //         FuncType.BleControl            
    //     ]
    // },
    MS100: {
        sn: "Z1360/Z1374/Z1341/Z1342/12303/12301/12305/12307/12331/12329/12409/12411/12807/Z1507/12801/12795/12789/Z1503/12793/12791/Z1504/12803/12805",//MS100,MG100, // KFR-26GW/BP3DN8Y-MS100(1) KFR-26GW/BP3DN8Y-MG100(1)
        func: [
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）            
            FuncType.FaNoWindFeel,//无风感 
            FuncType.ElectricHeat, // 电辅热   
            FuncType.CSEco,            
            FuncType.ECO, // ECO                                  
            FuncType.FaWindBlowing,//防直吹                                              
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support            
        ]
    },    
    // FA200: { 
    //     sn: "12331/12329", // KFR-26GW/BP3DN8Y-FA200(1) [22012331] KFR-35GW/BP3DN8Y-FA200(1)  [22012329] 产码被ms100包含
    //     func: [
    //         FuncType.ModeControl, // 模式控制         
    //         FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
    //         FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）
    //         // FuncType.FreshAir,     
    //         FuncType.FaNoWindFeel,//无风感                        
    //         FuncType.ElectricHeat, // 电辅热 
    //         FuncType.CSEco,                  
    //         FuncType.ECO, // ECO                              
    //         // FuncType.Quietness,//睡眠
    //         FuncType.WindBlowing,//防直吹                                              
    //         FuncType.Dot5Support,
    //         FuncType.NoPolar,
    //         FuncType._16Support          
    //     ]
    // },
    SN300: {
        sn: "12485/12483/Z1380/Z1414/12313/12315/12473/12475/Z1379/F0751/F0753/12729/12727/Z1475/12739/12745/12741/12743/Z1470/Z1469/12755/12759/12765/12763/Z1487/12775/12777",//PJ400,SN300,DA301,XHC3、MJG3 , // KFR-26GW/BP2DN8Y-SN300(3)[22012741] KFR-35GW/BP2DN8Y-SN300(3)[22012743]
        func: [
            FuncType.ModeControl, // 模式控制    
            FuncType.UpDownSwipeWind,     
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度)          
            // FuncType.FreshAir,   
            FuncType.WindBlowing,//防直吹        
            FuncType.ElectricHeat, // 电辅热               
            FuncType.ECO, // ECO                  
            FuncType.Quietness,//睡眠                                                         
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,            
        ]
    },
    // FA201: { 
    //     sn: "12409/12411", // KFR-26GW/BP3DN8Y-FA201(1)  KFR-35GW/BP3DN8Y-FA201(1)  产码被ms100包含
    //     func: [
    //         FuncType.ModeControl, // 模式控制         
    //         FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
    //         FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）
    //         // FuncType.FreshAir,   
    //         FuncType.NoWindFeel,//无风感         
    //         FuncType.ElectricHeat, // 电辅热               
    //         FuncType.ECO, // ECO   
    //         FuncType.CSEco,  // 舒省                               
    //         // FuncType.Quietness,//睡眠
    //         FuncType.WindBlowing,//防直吹                                              
    //         FuncType.Dot5Support,
    //         FuncType.NoPolar,
    //         FuncType._16Support,           
    //     ]
    // },
    N8MKA1A_BLE: {
        sn: "51499/51489/Z1532", // KFR-51LW/N8MKA1(22251397) KFR-72LW/N8MKA1(22251393)
        func: [
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                               
            FuncType.FreshAir,  // 新风
            FuncType.ElectricHeat, // 电辅热                           
            FuncType.ECO, // ECO   
            FuncType.CSEco,  // 舒省                                                     
            FuncType.SelfCleaning, // 智清洁,            
            FuncType.WindBlowing,//防直吹    
            FuncType.Supercooling,//智控温                                          
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    N8MKA1: {
        sn: "51397/51393/Z1481", // KFR-51LW/N8MKA1(22251397) KFR-72LW/N8MKA1(22251393)
        func: [
            FuncType.ModeControl, // 模式控制      
            FuncType.UpDownSwipeWind,   
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                               
            FuncType.FreshAir,  // 新风
            FuncType.ElectricHeat, // 电辅热                           
            FuncType.ECO, // ECO   
            FuncType.CSEco,  // 舒省                                                     
            FuncType.SelfCleaning, // 智清洁,            
            FuncType.WindBlowing,//防直吹    
            FuncType.Supercooling,//智控温                                          
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,          
        ]
    },
    K11:{
        sn: "51403/51401/Z1483", // KFR-51LW/K1-1(22251403) KFR-72LW/K1-1(22251401)
        func: [
            FuncType.ModeControl, // 模式控制         
            FuncType.UpDownSwipeWind,
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）
            FuncType.FreshAir,  // 新风     
            // FuncType.UpSwipeWind, // 上左右风
            // FuncType.DownSwipeWind, // 下左右风              
            FuncType.ElectricHeat, // 电辅热               
            FuncType.ECO, // ECO   
            // FuncType.CSEco,  // 舒省                               
            FuncType.Quietness,// 省电            
            FuncType.SelfCleaning, // 智清洁,            
            FuncType.UpNoWindFeel,
            FuncType.DownNoWindFeel,
            // FuncType.WindBlowing,//防直吹    
            FuncType.Supercooling,//智控温                                          
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support          
        ]
    },
    K11_BLE: {
        sn: "51473/51491/Z1535", // KFR-51LW/K1-1(22251403) KFR-72LW/K1-1(22251401)
        func: [
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）
            FuncType.FreshAir,  // 新风     
            // FuncType.UpSwipeWind, // 上左右风
            // FuncType.DownSwipeWind, // 下左右风              
            FuncType.ElectricHeat, // 电辅热               
            FuncType.ECO, // ECO   
            // FuncType.CSEco,  // 舒省                               
            FuncType.Quietness,// 省电            
            FuncType.SelfCleaning, // 智清洁,            
            FuncType.UpNoWindFeel,
            FuncType.DownNoWindFeel,
            // FuncType.WindBlowing,//防直吹    
            FuncType.Supercooling,//智控温                                          
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    N8MXC1TECH:{
        sn: "12869/12871/Z1524/51587", // KFR-26GW/N8MXC1 KFR-35GW/N8MXC1 科技版
        func: [
            FuncType.ModeControl, // 模式控制       
            FuncType.UpDownSwipeWind,              
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）
            FuncType.UpDownAroundWind, //上下环绕风                         
            FuncType.ElectricHeat, // 电辅热               
            FuncType.ECO, // ECO   
            FuncType.CSEco,  // 舒省     
            FuncType.AppointmentSwitchOff,                                      
            FuncType.SelfCleaning, // 智清洁,   
            FuncType.Dry, // 干燥                    
            FuncType.UpDownWindBlowing,//上下防直吹                               
            // FuncType.SleepCurve,        
            FuncType.Supercooling,//智控温   
            FuncType.PowerManager, //电量统计        
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能            
        ]
    },
    N8MXC1TOP:{
        sn: "12863/Z1523", // KFR-26GW/N8MXC1 KFR-35GW/N8MXC1 旗舰版
        func: [
            FuncType.ModeControl, // 模式控制     
            FuncType.UpDownSwipeWind,    
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）
            FuncType.UpDownAroundWind, //上下环绕风                         
            FuncType.ElectricHeat, // 电辅热               
            FuncType.ECO, // ECO   
            FuncType.CSEco,  // 舒省                                           
            FuncType.SelfCleaning, // 智清洁,   
            FuncType.Dry, // 干燥                    
            FuncType.UpDownWindBlowing,//上下防直吹                               
            // FuncType.SleepCurve,        
            FuncType.Supercooling,//智控温     
            FuncType.PowerManager, //电量统计      
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能            
        ]
    },
    N8MZB1: {
        sn: "51469/Z1531/51471", // KFR-72GW/N8MZB1 KFR-72GW/N8MZB1
        func: [
            FuncType.ModeControl, // 模式控制    
            FuncType.UpDownSwipeWind,     
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）     
            FuncType.WindBlowing,//防直吹                                  
            FuncType.ElectricHeat, // 电辅热  
            FuncType.Quietness,// 省电   
            FuncType.Supercooling,//智控温             
            FuncType.ECO, // ECO   
            FuncType.CSEco,  // 舒省          
            FuncType.PowerManager, //电量统计                                   
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    N8MTC1_35: {
        sn: "12379/12373/12375/12377/Z2314/Z1347/Z2315/Z1348/F0661/12593/12595/12597/Z1423/12605/12603/Z1425/12609/12607/Z1426/12599/12601/Z1424/12623/12625/12631/12639/Z1435/Z013F/Z013G/Z013J/Z013K/Z013L/12683/12685/Z1444/12633" +
        "/12693/12691/Z1449/Z05YE/Z05YF/Z0663/Z0664/Z0665/Z0666/Z0667/Z0668/Z06NJ/Z06NK/Z06NL/Z06NM/Z07XG/Z07XH/Z07XJ/Z07YR/Z07YS/Z07YT/Z07YU/Z08J4/Z08J5/Z08J6/Z08J7/F0817/F0803/F0809/F0805/F0807/F0801/F0811/F0833/F0835/F0843/F0879/F0881/F0885/F0889/F0893/F0897/12847/12839/Z1516/12833/12845/Z1515/12835/12843/Z1514/12837/12841/Z1517/12831/12829/Z1513/12849/12895/Z1551", // KFR-35GW/N8MTC1
        func: [
            FuncType.ModeControl, // 模式控制      
            FuncType.UpDownSwipeWind,   
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO   
            FuncType.UpDownWindBlowing,//上下防直吹                                  
            FuncType.ElectricHeat, // 电辅热               
            FuncType.Supercooling,//智控温                        
            FuncType.CSEco,  // 舒省      
            // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,           
        ]
    },
    N8XHA1A_QJ200_26_35: {
        sn: "12851/12853/12665/12663/12657/12655",// KFR-35GW/N8MTC1
        func: [
            FuncType.ModeControl, // 模式控制     
            FuncType.UpDownSwipeWind,   
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO   
            FuncType.WindBlowing,//防直吹                                  
            FuncType.ElectricHeat, // 电辅热               
            FuncType.Supercooling,//智控温                        
            FuncType.CSEco,  // 舒省      
            // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,           
        ]
    },
    // N8ZHB1A: {
    //     sn: "12855/12857", // KFR-35GW/N8ZHB1A
    //     func: [
    //         FuncType.ModeControl, // 模式控制         
    //         FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
    //         FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
    //         FuncType.ECO, // ECO   
    //         FuncType.WindBlowing,//防直吹                                  
    //         FuncType.ElectricHeat, // 电辅热               
    //         FuncType.Supercooling,//智控温                        
    //         FuncType.CSEco,  // 舒省      
    //         // FuncType.SleepCurve,                                     
    //         FuncType.SelfCleaning, // 智清洁    
    //         FuncType.Dot5Support,
    //         FuncType.NoPolar,
    //         FuncType._16Support,           
    //     ]
    // },
    // N8VHC1A:{
    //     sn: "12861/12859", // KFR-35GW/N8VHC1A
    //     func: [
    //         FuncType.ModeControl, // 模式控制         
    //         FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
    //         FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
    //         FuncType.ECO, // ECO   
    //         FuncType.WindBlowing,//防直吹                                  
    //         FuncType.ElectricHeat, // 电辅热              
    //         FuncType.Supercooling,//智控温                        
    //         FuncType.CSEco,  // 舒省      
    //         // FuncType.SleepCurve,                                     
    //         FuncType.SelfCleaning, // 智清洁    
    //         FuncType.Dot5Support,
    //         FuncType.NoPolar,
    //         FuncType._16Support,           
    //     ]
    // },
    XT100_XT200: {
        sn: "12733/12735", // KFR-26GW/BP3DN8Y-XT100(1) XT200
        func: [
            FuncType.ModeControl, // 模式控制    
            FuncType.UpDownSwipeWind,     
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO   
            FuncType.UpDownWindBlowing,//上下防直吹                                  
            FuncType.ElectricHeat, // 电辅热            
            FuncType.Supercooling,//智控温                        
            FuncType.CSEco,  // 舒省      
            // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    XG200_XQ200_XP200: {
        sn: "12835/12843/12839/12847/12833/12845", // KFR-26GW/BP3DN8Y-XG200(1) XQ200 XP200
        func: [
            FuncType.ModeControl, // 模式控制
            FuncType.UpDownSwipeWind,         
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO   
            FuncType.UpDownWindBlowing,//上下防直吹                                  
            FuncType.ElectricHeat, // 电辅热               
            FuncType.Supercooling,//智控温                        
            FuncType.CSEco,  // 舒省      
            // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    QD200:{
        sn: "12591/12589", // KFR-35GW/QD200
        func: [
            FuncType.ModeControl, // 模式控制 
            FuncType.UpDownSwipeWind,        
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO   
            FuncType.WindBlowing,//防直吹                                  
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温                        
            FuncType.CSEco,  // 舒省      
            // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,           
        ]
    },
    QT200_QE200_QS200:{
        sn: "12813/12815/12817/12819/12797/12799", // KFR-35GW/QT200_QE200_QS200
        func: [
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO   
            FuncType.WindBlowing,//防直吹                                  
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温                                    
            FuncType.CSEco,
            // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,           
        ]
    },
    N8MXA3_XJ100_N8MXA1:{
        sn: "12783/12593/12685/12683", // KFR-26GW/N8MXA3_XJ100_N8MXA1
        func: [
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO   
            FuncType.UpDownWindBlowing,//上下防直吹                                  
            FuncType.ElectricHeat, // 电辅热               
            FuncType.Supercooling,//智控温                                       
            // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    YB300:{
        sn: "51161/51165", // KFR-51LW/BP3DN8Y-YB300(1)
        func: [
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO                                             
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温                                         
            // FuncType.CSEco,
            // // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    N8XHA1_51_72:{
        sn: "51187/51189", // KFR-51LW/N8XHA1
        func: [
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO      
            FuncType.WindBlowing,//防直吹                                                    
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温                      
            FuncType.CSEco,
            // // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    N8ZHB1_51_72:{
        sn: "51185/51183", // KFR-51LW/N8ZHB1
        func: [
            FuncType.ModeControl, // 模式控制    
            FuncType.UpDownSwipeWind,     
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO      
            FuncType.WindBlowing,//防直吹                                                    
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温    
            FuncType.CSEco,                                   
            // // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    N8VHC1_51_72:{
        sn: "51193/51191", // KFR-51LW/N8VHC1
        func: [
            FuncType.ModeControl, // 模式控制       
            FuncType.UpDownSwipeWind,  
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO      
            FuncType.WindBlowing,//防直吹                                                    
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温                                     
            FuncType.CSEco,
            // // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    YC200_KH_51_72:{
        sn: "51429/51411/51427/51413", // KFR-51LW/YC200
        func: [
            FuncType.ModeControl, // 模式控制        
            FuncType.UpDownSwipeWind, 
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO      
            FuncType.WindBlowing,//防直吹                                                    
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温                                     
            FuncType.CSEco,
            // // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    VA200_51_72:{
        sn: "51439/51437", // KFR-51LW/VA200
        func: [
            FuncType.ModeControl, // 模式控制     
            FuncType.UpDownSwipeWind,    
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO      
            FuncType.WindBlowing,//防直吹                                                    
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温                                     
            FuncType.CSEco,
            // // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    TP301_YS300:{
        sn: "51371/51373/51435/51433", // KFR-51LW/TP301_YS300
        func: [
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, //ECO                                                               
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温                                     
            FuncType.CSEco,
            // // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    YC300_51_72:{
        sn: "51377/51375", // KFR-51LW/YC300_51_72
        func: [
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO      
            FuncType.WindBlowing,//防直吹                                                    
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温                                     
            FuncType.CSEco,
            // // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    QE200_QY200:{
        sn: "51445/51431/51309/51307", // KFR-51LW/VA200
        func: [
            FuncType.ModeControl, // 模式控制    
            FuncType.UpDownSwipeWind,     
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
            FuncType.ECO, // ECO      
            FuncType.WindBlowing,//防直吹                                                    
            FuncType.ElectricHeat, // 电辅热              
            FuncType.Supercooling,//智控温                                     
            FuncType.CSEco,
            // // FuncType.SleepCurve,                                     
            FuncType.SelfCleaning, // 智清洁    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,         
        ]
    },
    YA103:{
        sn: "12889/12887/Z2338/Z1552/F1079/F1077", // KFR-26G/BDN8Y-YA103(1)A
        func:[
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                 
            FuncType.ElectricHeat, // 电辅热               
            FuncType.ECO, // ECO   
            FuncType.CSEco,  // 舒省                                           
            FuncType.SelfCleaning, // 智清洁,   
            FuncType.Dry, // 干燥                    
            FuncType.WindBlowing,//防直吹                               
            // FuncType.SleepCurve, //睡眠曲线       
            FuncType.Supercooling,//智控温   
            FuncType.PowerManager, //电量统计        
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能 
        ]
    },
    X1_1_BLE:{
        sn: "12897/Z1554/12899", // KFR-26G/BDN8Y-YA103(1)A
        func:[
            FuncType.ModeControl, // 模式控制         
            FuncType.UpDownSwipeWind,
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                        
            FuncType.UpDownAroundWind, //上下环绕风     
            FuncType.ECO, // ECO     
            FuncType.CSEco,  // 舒省              
            FuncType.Supercooling,//智控温    
            FuncType.Show,
            FuncType.Sound,                 
            FuncType.ElectricHeat, // 电辅热               
            FuncType.Dry, // 干燥    
            FuncType.AppointmentSwitchOff,      
            FuncType.PowerManager, //电量统计                                             
            FuncType.SelfCleaning, // 智清洁,                               
            FuncType.UpDownWindBlowing,//上下防直吹                                                                      
            // FuncType.SleepCurve, //睡眠曲线             
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能 
        ]
    },
    vc200_BLE:{  //vc200(1)A
        sn: "51507/51505/Z1560",
        func:[
            FuncType.ModeControl, // 模式控制         
            FuncType.UpDownSwipeWind,
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                                
            FuncType.ECO, // ECO                                                                            
            FuncType.SelfCleaning, // 智清洁,   
            FuncType.Dry, // 干燥
            FuncType.ElectricHeat, // 电辅热                                                    
            FuncType.Supercooling,//智控温 
            FuncType.CSEco,  // 舒省    
            FuncType.WindBlowing, //防直吹        
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能 
        ]
    },
    KW200A_26_35_BLE:{
        sn: "12875/12873/Z1526",
        func:[
            FuncType.ModeControl, // 模式控制    
            FuncType.UpDownSwipeWind,     
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                                
            FuncType.FreshAir,
            FuncType.ECO, // ECO          
            FuncType.NoWindFeel,//无风感                                                                  
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                
            FuncType.CSEco,  // 舒省                
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能 
        ]
    },
    N8MKA1A_26_35_BLE: {
        sn: "12879/12883/Z1529",
        func:[
            FuncType.ModeControl, // 模式控制       
            FuncType.UpDownSwipeWind,  
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                                
            FuncType.FreshAir, // 新风
            FuncType.ECO, // ECO                                                                            
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                                                
            FuncType.CSEco,  // 舒省                
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能 
        ]
    },    
    KW200_50: {
        sn: "Z1410/12525",
        func:[
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                                
            FuncType.FreshAir, // 新风
            FuncType.ECO, // ECO       
            FuncType.NoWindFeel,//无风感                                                                     
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                                                
            FuncType.CSEco,  // 舒省                
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support            
        ]
    },
    ET100_26: {
        sn: "Z1403/12505/F0743/Z1404/12507/Z1413/Z1462/F0737/Z1461/Z1412/F0739/F0741",
        func:[
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                                                
            FuncType.CSEco,  // 舒省     
            // FuncType.SleepCurve,           
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support            
        ]
    },
    N8MWA1_35:{
        sn: "12355/Z1434",
        func:[
            FuncType.ModeControl, // 模式控制      
            FuncType.UpDownSwipeWind,   
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                 
            FuncType.CSEco,  // 舒省                
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    TT100_26_35:{
        sn: "12823/Z1511/12821",
        func:[
            FuncType.ModeControl, // 模式控制      
            FuncType.UpDownSwipeWind,   
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                 
            FuncType.CSEco,  // 舒省                
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    TA101_26_35:{
        sn: "12811/12809/Z1508",
        func:[
            FuncType.ModeControl, // 模式控制    
            FuncType.UpDownSwipeWind,     
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                 
            FuncType.CSEco,  // 舒省                
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    KW200_72:{
        sn: "51501/Z1542",
        func:[
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）              
            FuncType.FreshAir, // 新风                         
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    YB133A_51_72:{
        sn: "Z1538/51497/51485",
        func:[
            FuncType.ModeControl, // 模式控制    
            FuncType.UpDownSwipeWind,     
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）              
            FuncType.FreshAir, // 新风                         
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    YK101A_72:{
        sn: "51483/Z1533",
        func:[
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）              
            FuncType.FreshAir, // 新风                         
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    YK201A_51_72:{
        sn: "51493/51487/Z1536",
        func:[
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）              
            FuncType.FreshAir, // 新风                         
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    TP201A_51_72:{
        sn: "51495/Z1534/51481",
        func:[
            FuncType.ModeControl, // 模式控制
            FuncType.UpDownSwipeWind,         
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）              
            FuncType.FreshAir, // 新风                         
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    YB100:{
        sn: "51203/Z1389",
        func:[
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）              
            FuncType.UpNoWindFeel,//上无风感
            FuncType.DownNoWindFeel,//下无风感         
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    YB202_51_72:{
        sn: "51447/51449/Z1500",
        func:[
            FuncType.ModeControl, // 模式控制    
            FuncType.UpDownSwipeWind,     
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },    
    YB302_51_72:{ // YB302
        sn: "51387/Z1493/51389",
        func:[
            FuncType.ModeControl, // 模式控制
            FuncType.UpDownSwipeWind,         
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    YB233_51_72:{ // YB233
        sn: "51177/51179/Z1349",
        func:[
            FuncType.ModeControl, // 模式控制
            FuncType.UpDownSwipeWind,         
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },    
    N8MWA1A_51_72:{ // N8MWA1A
        sn: "51463/Z1522/51465",
        func:[
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热                                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support           
        ]
    },
    /********************* 以下是千款机型适配 ************************/
    _QA100: {
        sn: "11005/10977/11007/10979/10563/10567/10711/11415/11417/11423/11425/11467/11469/11471/11473/11475/11477/10995/Z1121/Z1122",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,            
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _SA100: {
        sn: "11175/11177/11419/11421/11437/11439/11441/Z1140",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _SA200: {
        sn: "11285/11287/11351/11353/11355/11357", //SA200  SA201
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _SA300: {
        sn: "11179/11181/11183/11313/11315/11317/11537/11539/11541/Z1139/Z1149/Z2155/Z1166/Z2185",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.ECO
        ]
    },
    _YA: {
        sn: "11381/11387/11383/11385/11389/11393/11391/11395/11463/11465/11571/11573/11575/Z2165/Z2168/Z1151/Z1152/Z1153/Z1154/Z1158/Z2166/Z2167/Z1167/Z2172/Z2186/11839/11919/11917/11915/11913",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.Dot5Support,
        ]
    },
    _26YA: {
        sn: "11835", //26YA100机型
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.Dot5Support,
        ]
    },
    _YAB3: {
        sn: "11397/11399/11401/11403/11405/11407",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.ECO            
        ]
    },
    _SN300: {
        sn: "12107/12105/Z1276/Z2278",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.ECO,
            FuncType.Dot5Support,
        ]
    },
    _YAB3Z: {
        sn: "Z2170/Z1155/Z1156/Z2169",  //三级演示样机区分0.5控制
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.ECO,
            FuncType.Dot5Support,
        ]
    },
    _WJABC: {
        sn: "11295/11301/11297/11303/11299/11305", //WJA、WJB、WJC
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _YA100: {
        sn: "50491/50493/50271/50273/50603/50607/50663/50665/Z1125",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _CJ200: {
        sn: "50601/50509/50507/50605/Z1138",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _WYA: {
        sn: "50585/50583",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
        ]
    },
    _WPA: {
        sn: "50559/50557",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _LBB2: {
        sn: "50095/50163/50077/50167", // LB(B2)
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _LBB3: {
        sn: "50119/50213/50397/50081/50285/50403/50661/50695", // LB(B3)
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _PA400: {
        sn: "50387/50401/Z3037/50405/50371",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _WEA: {
        sn: "11373/11375/11377/11379/11309/11311/10983/10985/F0283/F0285/F0287/F0289/F0291/F0293/F0295/F0297/F0299/F0301/F0303/F0305/Z1172/Z1211/Z1212/Z1173",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _CA: {
        sn: "11447/11451/11453/11455/11457/11459/11525/11527",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _TAB3: {
        sn: "11489/11491/11493/11505/11507/11509/Z1161/Z1162/Z2182/Z2183/11551/11553/11557/11561/11565",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _TAB12: {
        sn: "11495/11497/11499/11501/11503/11511/11513/11515/Z1165/Z1164/Z1163/Z2180/Z2181/Z2184/11543/11545" +
            "/11547/11549/11555/11559/11563/11585/11587/11833/11837/11931/11929/Z2240/Z1217/Z1219/Z2242/11945/11947/12101" +
            "/12103/12115/12111/12113/12109/Z1280/Z1279/Z1278/Z1266/Z1260/Z2273/12237/12239/Z1330/12245/12275/12273/12277/12279/" +
            "12281/12283/12285/12287/12289/12291/Z1408/Z2302",//MWA
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _KHB1: {
        sn: "50637/50639/50655/50653/50723",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _CACP: {
        sn: "11533/11535", //CA定速机
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
        ]
    },
    _ZA300: {
        sn: "50199/50201/50265/50269/50307/50373/50317/50375/50431/50433/50697/50667", //ZA300(B2)
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _ZA300B3: {
        sn: "50251/50253/50281/50289/50309/50315/50383/50385/50427/50429/50669/50701", //ZA300(B3)
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _ZB300: {
        sn: "50657/50659", //ZB300
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _ZB300YJ: {
        sn: "Z1170/Z2191", //ZB300YJ
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YA300: {
        sn: "50205/50207/50393/50451",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YA301: {
        sn: "50531/50533/50677/50687/G0041/G0043/G0047/G0049/G0045/G0051/50777/50779/Z2231/Z1207/50837/50835/50807", //YA301、WYCA1
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YA302: {
        sn: "50577/50579/50679/50693/Z2159",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YA201: {
        sn: "50609/50681/50689/50611/50675/50685/50775/50773", //YA201 20170527将773 775从YA200转到YA201 By lyf
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YA200: {
        sn: "50771/50769", //YA200
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _PC400B23: {
        sn: "11367/11369/11371/11327/11445/11449/11461/11757/11759/11761/11323/11325/11327/11445/11449/11461/F0473/Z2217/Z1145/Z2160/Z1190", //PC400(B2)、PC400(B3)
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _WXA: {
        sn: "11695/11697/Z1209/Z2234/12023/12025",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _WJ7: {
        sn: "10167/10169/10171",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _WYB: {
        sn: "50725/50727",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _PCB50: {
        sn: "11719/Z2210/Z1185",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YB200: {
        sn: "50731/50733/Z1184/Z2208/50793/50795",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YBA: {
        sn: "50995",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _DA100: {
        sn: "11717/11711",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _WXD: {
        sn: "11713/11715/Z1208/Z2233",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YB300: {
        sn: "50753/50755/Z1187/Z2212/50841/50839/Z1204/Z2229/50903/Z2254/Z1231/50905/Z1231/Z2254/50969" +
            "/51000/Z1303/Z1305/50999", //TOP,VA200
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _WDAA3: {
        sn: "11763/11765/Z2214/11879/11885/Z1210/Z2235/11991/11989/11993/11995/12019/12021/11990", //WDBA3
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _WDAD3: {
        sn: "11735/11737/11883/11881/11799/11803/11801/11805/11707/11705/Z1213", //WDBD3
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
        ]
    },
    _WYAD2D3: {
        sn: "50763/50599/50761/50589/50597/Z1216/Z2239",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _WPAD3: {
        sn: "50749/50751/50737/50739/50741/50743/50555",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _DA400B3: {
        sn: "11605/11613/11641/11729/11731/11733/Z3063/Z3065/Z2187/Z2215/11843/11231/Z1277/11841",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _PC400B1: {
        sn: "11775/11777/11829/11831/11937/11933", //PE200、PC200
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _DA200300: {
        sn: "11589/11591/11593/11597/11599/11649/Z1168/Z2188/Z2164/11739/11741/11743/11745/11747/11749" +
            "/11661/11663/11667/Z1169/Z2189/11751/11753/11755/11821/11823/11825/11827/Z1191/Z2218/Z1192/Z2219/11891/11889/" +
            "11925/11927/Z1206/11941/11943/12005/12007/12009/12013/12011/Z1236/Z1269/Z1240/Z2275/Z2264/F0535/Z2260", //WCC，WDB
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _DA400D3: {
        sn: "11779/11781/11783/11785/11787/11789/11791/11793",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
        ]
    },
    _DA400BP: {
        sn: "50853/50847/Z2241/Z1218", //DA400带不吹人功能，变频
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _DA400BP: {
        sn: "50853/50847/Z2241/Z1218", //DA400带不吹人功能，变频
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _DA400DP: {
        sn: "50843/50845/50849/50851", //DA400带不吹人功能，定频
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _PA400B3: {
        sn: "50745/50747",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _J9: {
        sn: "19003/19001/Z2900/Z1900/Z1902/19013/19014/19011/19012/Z2902/19017/19015", //J9,J10
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YA400D2D3: {
        sn: "50569/50571/50587/50593/50757/50759/50647/50648/50649",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _QA301B1: {
        sn: "11795/11797/11796/11798/Z2213/Z1188/Z1144/10989/10991/10993/10997",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _WCBA3: {
        sn: "F0275/F0277/F0279/F0281/F0307/F0309/F0311/F0313/F0315/F0317/11701/11699/11987/11985",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _IQ100: {
        sn: "Z1194/11819/11813/Z2221/Z1198",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _DA100Z: {
        sn: "11809/11811/Z1193/Z2220/11907/11905/11911/11909/11895/11893/11923/11921/Z1201/Z2232", //WCCA2,WCBA2,WCEN8A2
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _IQ300: {
        sn: "Z1195/Z2222/11815/11817/10987/10633/10989/10991",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _J7: {
        sn: "Z2901/Z1008/Z1901/50103/50101/50079/50781/50783/50109/50107/Z1205/Z2230", //WYD
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YA400B2: {
        sn: "50565/50567/50613/50621/50683/50691/50963/50965/Z1273/50961/50911/50913/50959/Z1239/Z1274/Z2263/50901/Z1175" +
            "/Z2157/50881/50855/G0027/50901/50899/G0025/G0027/Z1314",//YA401,YH200
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _WPBC: {
        sn: "50789/50791/50785/50787/Z2237/Z1214", //WPB、WPC
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _WPCD: {
        sn: "50797/50799",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YB400: {
        sn: "50823/50825/Z2227/Z1199/50891/50893/50907/50909/50947/50945/50949/50951/50993/50991/Z1289", //WYE、WYG、JD
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _PE400B3: {
        sn: "11723/11727/11409/Z1157/11411/11413/11411/11413",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _J8: {
        sn: "Z2903/Z1903/50113/50111", //J10
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YB301: {
        sn: "50861/50863/Z1215/Z2238/Z1223/Z2246/50875/50873/50877/50879/Z1224/Z2247/50917/50919/Z1241" +
            "/50921/50923/Z1242/50933/50935/50941/50943/Z1264/Z1245/50983/50977/50979/50981/50975/50971/50973/Z1293/Z1294" +
            "/Z1295/Z1296/Z1298/Z1299/Z1256/Z1255/Z1253/Z1252/Z1251/Z1250/Z1297", //YB303、YB305、YB306、YB308、YB302、YB333
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            // FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind
        ]
    },
    _WYS: {
        sn: "50895/50897/Z1244/Z1254",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            // FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _1TO1: {
        sn: "96901/96902/96903/96904/96129/96127/96115/96113/96111/96109", //一拖一
        func: [
            FuncType.ModeControl,
        ]
    },
    _YB201: {
        sn: "50869/50871/Z1226/Z2249/Z1227/Z2250/50889/50887/50925/50927/Z1243/50953/Z1275/50997/Z1302" +
            "/Z1258/Z1257/Z2271", //YB202、YB203
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            // FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind
        ]
    },
    _PF200: {
        sn: "11963/11961/Z2245/Z1222/11981/11983/Z1234/Z2258", //TOP(VA200)
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _GM100: {
        sn: "11967/11965/Z1229/Z2252",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _WOW: {
        sn: "11979/11977/Z1235/Z2259/Z2266/12051/12049",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _1TOn: {
        sn: "PD004", //TODO 一拖多
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
        ]
    },
    _S10: {
        sn: "20003/20001/Z1904/Z2904/12085/12087/Z1271",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _FA100: {
        sn: "12037/12035/Z1261/Z1262/Z1312/12179",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _FA200: {
        sn: "12039/12041/Z1263/12141/12143/Z1285",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _W10: {
        sn: "60001/60003/Z1906/Z2907",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _WXDF: {
        sn: "12069/12071/12073/12075/Z1291",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YB100: {
        sn: "50939/Z1259/Z2272",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.UpDownSwipeWind,
        ]
    },
    _MQ200: {
        sn: "Z2270/Z2269/Z1249/Z1248/12065/12067",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _GW10: {
        sn: "Z1908/20017",//挂机W10
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _WYW: {
        sn: "51007/Z1307",//YW
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _PG401: {
        sn: "12093/12095",//PH402
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _HAN8B3: {
        sn: "40003/40005",//华凌挂机
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _HAN8B1: {
        sn: "40007/40009",//华凌挂机
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _HAN8: {
        sn: "50955/50957",//华凌柜机
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _GRD: {
        sn: "96223/96175",//风管机
        func: [
            FuncType.ModeControl,
        ]
    },
    _GRDcleanY: {
        sn: "96195/96193/96191/96219/96227",//风管机
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
        ]
    },
    _GRDclean: {
        sn: "96239",//风管机
        func: [
            FuncType.ModeControl,
        ]
    },
    _S20: {
        sn: "20025/Z2908/Z1910",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _TP300: {
        sn: "12149/12151/Z1292",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _YAF: {
        sn: "12121/12123/12129/12131/12127/12125/Z2282/Z1286/Z1287/12137/12139/12135/12133/12159/12157" +
            "/Z1284/Z1283/Z1282/Z1268/Z1267/Z1221/Z2281/Z2280/Z2279/Z2277/Z2276/Z2274/Z2248/Z2244/12189/Z2297" +
            "/12229/12231/12233/12235/Z1327/Z1328/12213/12215/12217/12219/12249/Z2306/Z1338/12257/12255/12247/Z1335" +
            "/Z1225/11953/11955/11957/11959/Z1322/Z1323/Z2301/Z2300",//YA102,SN100,GM100,CA100,CA101,VV,YA201,MTA,VP/TP/YC
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _VA100: {
        sn: "12117/12119/Z1288",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _MHA1:{
        sn: "12191",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _PG100: {
        sn: "Z1311/12177/12173/12147/12017/12175/12171/12177/Z1310/12173/Z1237/Z2283/Z2261/Z2294/12171/Z2295/" +
            "/12015/11949/12027/12029/11951/12145",//PH200
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _SpiderTA: {
        sn: "12153/Z1300",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _CaptainTA: {
        sn: "12155/Z1301",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YC300: {
        sn: "50985/50987/Z1281/51039/51041/Z1319",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _YC301: {
        sn: "51033/51043/51049/Z1324/51037/Z1317/51051/Z1320",//TP301
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _JDW10: {
        sn: "12161/Z1308",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _JDW30: {
        sn: "12165/12163/12097/12099/Z1309",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _YB101: {
        sn: "51001/Z1304",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.UpDownSwipeWind,
            FuncType.MessageRemind
        ]
    },
    _YHKH: {
        sn: "Z1306/50989/51019/50817/50867/51027/51029/51015/Z1315/Z1313",//KH
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _KW: {
        sn: "12185/Z1332",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _KW200: {
        sn: "12181/12183/Z1331",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _COLMO: {
        sn: "12211/Z1336",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _S30: {
        sn: "20027/Z1911",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _HB: {
        sn: "40011",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
        ]
    },
    _DF: {
        sn: "51023/Z1316",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _DF100: {
        sn: "51157/Z1350",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _DF200: {
        sn: "51181/Z1351",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _MQ201: {
        sn: "12241/Z2303/Z1333",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.ECO,
            FuncType.Dot5Support,
            FuncType.NoPolar,            
            FuncType._16Support,
        ]
    },
    _MQ202: {
        sn: "12243/Z2304/Z1334",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.ECO,
            FuncType.Dot5Support,
            FuncType.NoPolar,            
            FuncType._16Support,
        ]
    },
    _S30GUI: {
        sn: "Z1909/60013",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _HLGUI: {
        sn: "70007/70009",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _TP: {
        sn: "12221/12223/Z1325/12225/12227/Z1326/12251/12253/Z1337/Z2299/Z2298/Z2308",//GM200
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _VP300: {
        sn: "51031/51035/51045/51047/Z1318/Z1321",//YE300
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _HD: {
        sn: "70013/70011",//华菱柜机
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _TP100:{
        sn: "51053/Z1345",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _YK100:{
        sn: "51059/51065/Z1346/Z1417/51345/Z1473/51349/51347/Z1474/51381/Z1478/51379/51487/51493/Z1536/51475/Z1537/51495/51481/Z1534",//TP101,TP201,YK201
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,            
            FuncType._16Support,
        ]
    },
    _YK101:{
        sn: "51391/Z1480",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,                   
            FuncType._16Support,
        ]
    },
    _TP200:{
        sn: "51061/51055/Z1344",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,            
            FuncType._16Support,
        ]
    },
    _YK200:{
        sn: "51063/51057/Z1343/Z1418/51313/Z1459/51315/51477/51479/Z1539",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,            
            FuncType._16Support,
        ]
    },
    _PH400: {
        sn: "12297/12299/11975/12089/Z1382/12491/12493/12359/12357/12365/12371/Z1381/12489/12487/12387/12385/12383/12381/12389/" +
            "12391/40019/40021/12341/12569/Z1420/12571/12585/12587/12611/12613/12637/12667/12669/12673/12671/12675/12677/12679/"+
            "12681/12711/12751/F0789/F0787/Z1472/12749/F4009/F0791",//AE300,PJ400,N8XJC3,VJA3,PH402，N8MJA3，N8VJC3,DA301,N8MJA,MJC3,PH01(3),ZJC3,ZJC3,ZJE3,MJE3,VJE3，MJG3 
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.ECO,
            FuncType.Dot5Support,
            FuncType.NoPolar,            
            FuncType._16Support,
        ]
    },
    _AG400:{
        sn: "12293/12295/Z1383/20049/Z1913/20055/12521/12523/F0657/20059/F9017/12621/12619/40031/40033/Z1804/12695/12697/12689",//A30、GC401\DH400\AG01(3)\HF3
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType._16Support,
        ]
    },
    _DH400:{
        sn: "12555/12557/F0665/F0671/F0675/12629",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType._16Support
        ]
    },
    _MJA: {
        sn: "12539/12537/12559/12561/20067/20069/F0981/F0983/F0985/F0987/F0989/F0975/F0977/F0979",//VJC
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.ECO,
            FuncType.UpDownSwipeWind,
            FuncType._16Support
        ]
    },
    _DA200300X: {
        sn: "12405/12407",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _YC300Z: {
        sn: "51073/51071/Z1386/51193/51191/51185/51183/Z1800/51187/51189/70017/70021/51275/51273/Z1440/60027/60029/Z1918/Z1447/51309/51307/51305/Z1452/Z1451/51311/Z1477",//N8VHC1，N8ZHB1,XHA1,N8HB1,QJ/W20,QY,QE
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _HB1A: {
        sn: "70045/70043/51431/Z1496/51445/Z1497/51433/51435/51413/Z1491/Z1490/51411/51427/51407/51405/Z1518/60033/60031/Z1922/G0135",//QE\YS300D5、YC200/KHⅡ(1)、单G2
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _KH1X: {
        sn: "70047",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _G2S1:{       
        sn: "51409",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _YC200: {
        sn: "51251/51253/Z1431/51257/51255/Z1432",//KHⅡ(1)
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _VA2002: {
        sn: "51249/51247/Z1428/Z1498",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _YB302: {
        sn: "51077/51075/51133/51135/51139/51137/51143/51141/51151/51149/51145/51129/51125/51131/51127" +
            "/Z1388/Z1390/Z1385/Z1391/Z1392/Z1393/51147/Z1394/Z1387/Z1499/51441/51443/Z1495/51421/51425/Z1492/51423/51417/Z1494/51419/51415",//YB301,YB303,YB305,YB308,YB333,YB202、YB203、YB23、YB202
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _YB133: {
        sn: "51395/Z1482/51399",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _YH200: {
        sn: "51069/51067/51089/51087/51091/51093/60019/60023/60021/60025/60017/60015/51095/51097/51113/51117/51121/51119" +
            "/Z1372/Z1915/Z1368/Z1369/Z1370/Z1395/Z1916/51171/51173/" +
            "70015/70019/51107/51105/51215/51217/51219/51221/70023/70025/51225/51223/70031/70033/70027/70029/Z1803/Z1802/51301/51303/51293/51295/51285/51287/Z1457/Z1458/G0115/G0117/Z1479/51369/51367/G0149/G0151/G0153/G0155/G0137/G0139/G0141/G0143/G0145/G0147/G0157/G0159/G0161/G0163/G0165/G0167/G0169/G0171/G0173/G0175/G0177/G0179",//VP300,HB,YA400,W10,w30,KH,J10,ZHA,JDA,N8XJA3,MJA,MJA，N8XHB1,GC401,YA401，N8HA1，N8MHA1,N8HF3,G3-Z3
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
            FuncType.Dot5Support,
            FuncType._16Support,
        ]
    },
    _FA100X: {
        sn: "12481/12477/Z1373/12479",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _TA101: {
        sn: "12321/12323/12399/12397/12421/12413/12415/12393/12395/12501/12503/Z1358/12417/12419/Z1396/12421/Z1397/Z1402/" +
            "Z1355/Z1357/Z1405/12355/Z1434",//TA100,TT100,TA102,TA103,MWA
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _YA102: {
        sn: "12325/12327/12437/12439/12429/12431/12425/12427/12433/12435/12447" +
            "/12453/Z1359/Z1375/Z1362/Z1363/12451/12453/Z1378/Z1377/Z1376/12353" +
            "/12351/12363/12499/Z1356/12495/12497/12449/12349/12347/20047/20041/20043/20045/" +
            "Z1912/Z1365/12441/Z1914/20057/12515/12509/12511/12517/12519/12513/12401" +
            "/12403/Z1371/12461/12463/12465/12467/40025/40023/12443/12445/Z1367" +
            "/12309/12311/Z1401/12469/12471/Z1366/Z1801/12541/12543/12545/12547/12581/12583/12589/Z1427/" +
            "F0669/F0673/F0689/F0693/F0695/F0699/40027/40029/Z1805/F0711/Z1441/Z1446/Z1445/Z1448/F0747/F0745/F0781/"+
            "F0783/F0785/4002A/4002B/F0795/12757/12753/Z1471/12747/20071/20073/Z1920/12773/12771/Z1489/12767/12769/Z1488/Z1489/12785/12787/Z1502/20075/20075/Z1921/Z1521/12861/12859/12857/12855/Z1520/20043/20077/F0931/F0933/F0933/F0935/F0937/F0939/F0941/F0943/F0945/F0947/F0949/F0951/F0953/F0955/F0957/F0959/F0961/"
            +"F0963/F0965/F0967/F0969/F0971/F0973/Z1923/F0997/F0999",//CA100,GM100,SN100,CA101,MG100,VP200,MCA,N8MCA,TP200,N8MCB1,CA101,S20,S10,W10,W20,VHC,ZHB,XHA,GM200,N8ZHB1,N8XHA1,HAB1,HE1,PG100,PH200,PF200,MTA,MZA,AE200,QD200,PC401,HC1，ZHA1、XHC1、MJG1、B1、MJG1、W11
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _PG100DZ:{
        sn: "F0871/F0873",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _G2D: {
        sn: "12779/12781/F0913/F0911/F0927/F0929",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _HL: {
        sn: "40047/40049",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.ECO,
            FuncType.Dot5Support,
            FuncType.NoPolar,            
            FuncType._16Support,
        ]
    },
    _Q: {
        sn: "Z1441/12651/12653/Z1438/12647/12649/Z1437/Z1439/12661/12659/Z1442/40035/40037/Z1807/12369/12367/12459/12457/Z1364/Z1509/Z1510/Z1505",//HG1,XHB1,YC200
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _TP200G: {
        sn: "12717/12719",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _MHA: {
        sn: "12361/40017/40015/12577/12579/20061/Z1917",//HA1/MHB/W30
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.ECO,
            FuncType.Dot5Support,
            FuncType.NoPolar,            
            FuncType._16Support,
        ]
    },
    _VT:{
        sn: "12529/12531/Z1411/12533/12535/Z1415",//VT
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.ECO,
            FuncType.Dot5Support,
            FuncType.NoPolar,            
            FuncType._16Support,
        ]
    },
    _MFA: {
        sn: "51099/51101",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType._16Support,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _PA401X:{
        sn: "51175/51199/51201",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _VA200: {
        sn: "51167/51163/Z1400", //YB300
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
            FuncType.Dot5Support,
            FuncType._16Support,
            FuncType.UpDownSwipeWind,
        ]
    },
    _KW100: {
        sn: "12423/Z1407/Z1525/12877", // 12877
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.ECO,
            FuncType.Show,
            FuncType.Sound,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _KW200X: {
        sn: "12317/12319/Z1384/Z1463/12715/12713/12881/12885/Z1528",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _MKA1:{
        sn: "12643/12645/Z1443",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _HK1:{
        sn: "40043/40045",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _HB1: {
        sn: "40013",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.ECO,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType._16Support,
        ]
    },
    _YB101X: {
        sn: "51123",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType.UpDownSwipeWind,
            FuncType._16Support,
        ]
    },
    _50PC400X: {
        sn: "12337/Z1361/12527/12335/12343/12345/F4005/F0749/F9019/F0767/F0769/F0829/40051",//50PC400/PC40150,YA102(3),50G,50HL3
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _50G: {
        sn: "12721/12723/12725/12737",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _HG3: {
        sn: "40039/40041/Z1808/20065/20063/Z1919",//PJ400,SN300\A20
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
            FuncType._16Support,
        ]
    },
    _YBAX: {
        sn: "51103",//MCA
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _WYSX: {
        sn: "51109/51115/Z1436",//MWA1
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _DA400BPX: {
        sn: "51195/51197/Z1409/51277/51279/Z1454",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType._16Support,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _W30: {
        sn: "20053/20051",
        func: [
            FuncType.ModeControl,    
            FuncType.UpDownSwipeWind,            
            FuncType.ECO,      
            FuncType.Dot5Support,
            FuncType.NoPolar,            
            FuncType._16Support,
        ]
    },
    _MZA: {
        sn: "51159/51111/Z1422",//YW
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _TP301: {
        sn: "Z1399/51155/51153/51239/51241/Z1419/51261/51263/Z1433/51299/51291/Z1456/Z1476",//YC301，YS300
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _YC301G: {
        sn: "51383/51385",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _YC400: {
        sn: "51235/51237/Z1416/51269/51271/70035/70037/Z1806/51289/51297/Z1455/70041/70039",//MJC/N8HB3
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _YC400DZ: {
        sn: "G0131/G0133",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _KW200GUI: {
        sn: "51209/51211/Z1421/51321/Z1460",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _KW200GUIX: {
        sn: "51503/Z1541",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    // _XT: {
    //     sn: "12379/12373/12375/12377/Z2314/Z1347/Z2315/Z1348/F0661/12593/12595/12597/Z1423/12605/12603/Z1425/12609/12607/Z1426/12599/12601/Z1424/12623/12625/12631/12639/Z1435/Z013F/Z013G/Z013J/Z013K/Z013L/12683/12685/Z1444/12633" +
    //         "/12693/12691/Z1449/Z05YE/Z05YF/Z0663/Z0664/Z0665/Z0666/Z0667/Z0668/Z06NJ/Z06NK/Z06NL/Z06NM/Z07XG/Z07XH/Z07XJ/Z07YR/Z07YS/Z07YT/Z07YU/Z08J4/Z08J5/Z08J6/Z08J7/F0817/F0803/F0809/F0805/F0807/F0801/F0811/F0833/F0835/F0843/F0879/F0881/F0885/F0889/F0893/F0897/12847/12839/Z1516/12833/12845/Z1515/12835/12843/Z1514/12837/12841/Z1517/12831/12829/Z1513/12849/12865/12867/12895/Z1551",//MXA1,XQ200,XP200,XG200,XA200
    //     func: [
    //         FuncType.ModeControl,
    //         FuncType.Dot5Support,
    //         FuncType.NoPolar,
    //         FuncType.UpDownSwipeWind,
    //         FuncType.LeftRightSwipeWind,
    //         FuncType._16Support,
    //     ]
    // },
    _X: {
        sn: "F0907/F0909",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _50MXA: {
        sn: "Z1501",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _XTSoftWarm:{
        sn: "Z063E/Z063F/Z063G/Z063H/Z063J/Z063K/Z06BD/Z06BF/Z06BH/Z06BK/Z06BM/Z06BP/Z06BR/Z06BT/F0819/F0821/F0823/F0815/F0813/F0825/F0827/F0837/F0839/F0841/F0877/F0883/F0887/F0891/F0895/F0899",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _XTHotAseptic:{
        sn: "Z01NK/Z01PG/Z01PL/Z01PH/Z01PJ/Z01PK/Z05YJ/Z05YK/Z0669/Z066A/Z066B/Z066C/Z066D/Z066E",//MTC1
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _XTHotAsepticSoftWarm:{
        sn: "Z063L/Z063M/Z063N/Z063P/Z063Q/Z063R/Z06BE/Z06BG/Z06BJ/Z06BL/Z06BN/Z06BQ/Z06BS/Z06BU",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _coolWindNoPolarDot5:{
        sn: "96271/96273/96275/96269/96279/96277",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.Dot5Support,
        ]
    },
    _coolWindNoPolarDot5Wind:{
        sn: "96287/96289/96291/96293/96311/96317/96319/96321/96315/96313/96333",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _coolWindNoPolarDot5WindGear:{
        sn: "96305/96301/96299/96295/96297/96307/96309/96303",
        func: [
            FuncType.ModeControl,
            // FuncType.NoPolar,
            FuncType._16Support,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
        ]
    },
    _coolWindKF:{
        sn: "J6029/J6027/J6031/J6021/J6023/J6025",
        func: [
            FuncType.ModeControl,
            FuncType._16Support,
        ]
    },
    _customPH200:{
        sn: "F0651/F0667",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _PA401D:{
        sn: "G0105/G0107",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _PA401D120:{
        sn: "G0109/G0111",
        func: [
            FuncType.ModeControl,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _customPH201:{
        sn: "F0691",
        func: [
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
        ]
    },
    _movePT:{
        sn: "01013",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType._16Support,
        ]
    },
    _temporary:{
        sn: "L9900",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
            FuncType._16Support,
        ]
    },
    _PH200DZ:{
        sn: "F0727",
        func: [
            FuncType.ModeControl,
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType.UpDownSwipeWind,
            FuncType.LeftRightSwipeWind,
            FuncType._16Support,
    ]
    },
    _centralAirConditioningNwe:{
        sn: "93163/93155/93161/93157/93165/93167/93159",
        func: [
            FuncType.ModeControl,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.Dot5Support,
            FuncType.UpDownSwipeWind,
        ]
    },
    PH201:{
      sn: "F1069",
      func: [
          FuncType.ModeControl,
          FuncType.Dot5Support,
          FuncType.NoPolar,
          FuncType.UpDownSwipeWind,
          FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
          FuncType.LeftRightSwipeWind,
          FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）     
          FuncType._16Support,
          FuncType.WindBlowing,
          FuncType.SelfCleaning,
          FuncType.ElectricHeat,
          FuncType.Dry,
          FuncType.Supercooling,
          FuncType.CSEco,
          // FuncType.SleepCurve
    ]
  },
    /**********************以上是千款机型补充 */
    /*******2022年9月增加小程序机型 */
    QJ200_51_72_BLE:{
        sn:"Z1566/51511/51509",
        func:[
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                                
            FuncType.ECO, // ECO                    
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热     
            FuncType.CSEco, // 舒省
            FuncType.Dry, // 干燥                                               
            FuncType.Supercooling,//智控温                      
            FuncType.WindBlowing, //防直吹                    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },        
    YB233_D5_BLE: {
        sn:"51517/51513/Z1567",
        func: [
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热       
            FuncType.Supercooling, // 智控温                               
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ],
    },
    TP200_D5_BLE: {
        sn:"51515/51519/Z1571",
        func: [
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.NoWindFeel,//无风感              
            FuncType.ECO, // ECO         
            FuncType.SelfCleaning, // 智清洁            
            FuncType.ElectricHeat, // 电辅热       
            FuncType.Supercooling, // 智控温                               
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能 
        ],
    },
    QJ200_26_35_BLE:{
        sn:"Z1565/12925/12929",
        func:[
            FuncType.ModeControl, // 模式控制     
            FuncType.UpDownSwipeWind,    
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                                
            FuncType.ECO, // ECO                    
            FuncType.SelfCleaning, // 智清洁,            
            FuncType.ElectricHeat, // 电辅热                                                    
            FuncType.Supercooling,//智控温 
            FuncType.CSEco,  // 舒省    
            // FuncType.SleepCurve, // 睡眠曲线
            FuncType.WindBlowing, //防直吹                    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    MCA1_BLE: {
        sn:"12927/Z1564",
        func:[
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                                
            FuncType.ECO, // ECO                    
            FuncType.SelfCleaning, // 智清洁,            
            FuncType.ElectricHeat, // 电辅热                                                    
            FuncType.Supercooling,//智控温 
            FuncType.CSEco,  // 舒省    
            // FuncType.SleepCurve,
            FuncType.WindBlowing, //防直吹                    
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    F1_1_51_72_BLE:{
        sn:"51559/Z1581/51545",
        func:[
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            // FuncType.LeftRightSwipeWind,
            FuncType.UpSwipeWind, // 上左右风
            FuncType.DownSwipeWind, // 下左右风    
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.ElectricHeat, // 电辅热   
            FuncType.UpNoWindFeel,//上无风感
            FuncType.DownNoWindFeel,//下无风感            
            FuncType.ECO, // ECO                 
            FuncType.Dry, // 干燥    
            FuncType.SelfCleaning, // 智清洁                            
            FuncType.AutomaticAntiColdAir, // 主动防冷风 
            FuncType.Degerming, // 除菌
            FuncType.Supercooling, // 智控温                               
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    F1_1_26_35_BLE:{
        sn:"12933/12931/Z1570",
        func:[
            FuncType.ModeControl, // 模式控制    
            FuncType.UpDownSwipeWind,     
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                
            FuncType.ElectricHeat, // 电辅热               
            FuncType.ECO, // ECO   
            FuncType.CSEco,  // 舒省    
            FuncType.F11NoWindFeel, // 无风感
            FuncType.softWindFeel, // 柔风感
            FuncType.FaWindBlowing,//防直吹       
            FuncType.AutomaticAntiColdAir, // 主动防冷风                      
            FuncType.SelfCleaning, // 智清洁,               
            FuncType.Dry, // 干燥                                                              
            // FuncType.SleepCurve,      
            FuncType.Supercooling,//智控温   
            FuncType.PowerManager, //电量统计        
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能 
        ]
    },
    MZB1D: {
        sn: "51523/51521",
        func: [
            FuncType.ModeControl, // 模式控制      
            FuncType.UpDownSwipeWind,   
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.ElectricHeat, // 电辅热             
            FuncType.ECO, // ECO     
            FuncType.CSEco, // 舒省             
            FuncType.WindBlowing,             
            FuncType.SelfCleaning, // 智清洁                            
            FuncType.Supercooling, // 智控温   
            FuncType.PowerManager, // 电量查询                            
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    COOLFREE: {
        sn: "96413/96415/96421/96411/96419/96417/96569/96561/96565/96567/96559/96563",
        func: [
            FuncType.ModeControl, // 模式控制                                                
            FuncType.ElectricHeat, // 电辅热            
            FuncType.CoolFreeDry, //
            FuncType.AppointmentSwitchOff, // 定时关                           
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
            FuncType.isCoolFree, // 酷风
        ]
    },
    W11_BLE: {
        sn: "20087/20085/Z1926/F9025",
        func: [
            FuncType.ModeControl, // 模式控制 
            FuncType.UpDownSwipeWind,        
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.ElectricHeat, // 电辅热             
            FuncType.ECO, // ECO     
            FuncType.CSEco, // 舒省             
            FuncType.WindBlowing,             
            FuncType.SelfCleaning, // 智清洁                            
            FuncType.Supercooling, // 智控温   
            // FuncType.SleepCurve, //睡眠曲线                        
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    VC201_BLE: {
        sn: "Z1576/51529/51531",
        func: [
            FuncType.ModeControl, // 模式控制 
            FuncType.UpDownSwipeWind,        
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.ElectricHeat, // 电辅热             
            FuncType.ECO, // ECO     
            FuncType.CSEco, // 舒省             
            FuncType.WindBlowing,             
            FuncType.SelfCleaning, // 智清洁                            
            FuncType.Supercooling, // 智控温
            FuncType.Degerming, //杀菌        
            FuncType.Dry, // 干燥           
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    D11_BLE: {
        sn: "12959/12957/13001/Z1591/F1265",
        func: [
            FuncType.ModeControl, // 模式控制   
            FuncType.UpDownSwipeWind,      
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.ElectricHeat, // 电辅热             
            FuncType.ECO, // ECO     
            FuncType.CSEco, // 舒省             
            FuncType.WindBlowing,             
            FuncType.SelfCleaning, // 智清洁                            
            FuncType.Supercooling, // 智控温
            FuncType.Degerming, //杀菌        
            FuncType.Dry, // 干燥     
            // FuncType.SleepCurve, // 睡眠曲线      
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    KS1_1_BLE: {
        sn: "51537/51535",
        func: [
            FuncType.ModeControl, // 模式控制                 
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.ElectricHeat, // 电辅热       
            FuncType.CoolPowerSaving, // 酷省
            FuncType.SelfCleaning, // 智清洁                            
            FuncType.Supercooling, // 智控温    
            FuncType.PowerManager, // 电量查询            
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
        ]
    },
    KS1_3_BLE: {
      sn: "51539/51541",
      func: [
          FuncType.ModeControl, // 模式控制      
          FuncType.LeftRightSwipeWind,           
          FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
          FuncType.ElectricHeat, // 电辅热       
          FuncType.CoolPowerSaving, // 酷省
          FuncType.SelfCleaning, // 智清洁                            
          FuncType.Supercooling, // 智控温                
          FuncType.Dot5Support,
          FuncType.NoPolar,
          FuncType._16Support,
          FuncType.BleControl, // 数字遥控器特有功能
          FuncType.InitWifi, // 数字遥控器特有功能
          FuncType.SafeMode, // 数字遥控器特有功能
      ]
  },
    HY1_1_BLE: {
      sn:"51533/51557",
      func: [
            FuncType.ModeControl, // 模式控制  
            FuncType.UpDownSwipeWind,       
            FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
            FuncType.LeftRightSwipeWind,
            FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
            FuncType.ElectricHeat, // 电辅热             
            FuncType.ECO, // ECO     
            FuncType.CSEco, // 舒省             
            FuncType.WindBlowing,             
            FuncType.SelfCleaning, // 智清洁                            
            FuncType.Supercooling, // 智控温
            FuncType.Degerming, //杀菌  
            FuncType.PowerManager, //电量统计
            FuncType.AroundWind, //环绕风                       
            FuncType.Dot5Support,
            FuncType.NoPolar,
            FuncType._16Support,
            FuncType.BleControl, // 数字遥控器特有功能
            FuncType.InitWifi, // 数字遥控器特有功能
            FuncType.SafeMode, // 数字遥控器特有功能
      ]
    },
    PH201_BLE: {
      sn: "12971/12973", //220
      func: [
          FuncType.ModeControl, // 模式控制 
          FuncType.UpDownSwipeWind,   
          FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
          FuncType.LeftRightSwipeWind,             
          FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度） 
          FuncType.ECO, // ECO                                       
          FuncType.ElectricHeat, // 电辅热  
          FuncType.CSEco, // 舒省
          FuncType.WindBlowing, // 防直吹
          // FuncType.SleepCurve, // 睡眠曲线
          FuncType.Dry, //干燥               
          FuncType.SelfCleaning, // 智清洁                            
          FuncType.Supercooling, // 智控温                
          FuncType.Dot5Support,
          FuncType.NoPolar,
          FuncType._16Support,
          FuncType.BleControl, // 数字遥控器特有功能
          FuncType.InitWifi, // 数字遥控器特有功能
          FuncType.SafeMode, // 数字遥控器特有功能
      ]
  },
  QD201_BLE: {
    sn: "12983/12985", //220
    func: [
        FuncType.ModeControl, // 模式控制
        FuncType.UpDownSwipeWind,    
        FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）         
        FuncType.LeftRightSwipeWind,    
        FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度） 
        FuncType.ECO, // ECO                                       
        FuncType.ElectricHeat, // 电辅热  
        FuncType.CSEco, // 舒省
        FuncType.WindBlowing, // 防直吹
        // FuncType.SleepCurve, // 睡眠曲线
        FuncType.Dry, //干燥               
        FuncType.SelfCleaning, // 智清洁                            
        FuncType.Supercooling, // 智控温                
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.BleControl, // 数字遥控器特有功能
        FuncType.InitWifi, // 数字遥控器特有功能
        FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  MJD_ZHD_BLE: {
    sn: "51569/51565/51563/51567", //BDN8Y-MDJ ZHD
    func: [
        FuncType.ModeControl, // 模式控制          
        FuncType.LeftRightSwipeWind,
        FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度） 
        FuncType.ECO, // ECO                                       
        FuncType.ElectricHeat, // 电辅热           
        FuncType.Dry, //干燥               
        FuncType.SelfCleaning, // 智清洁                            
        FuncType.Supercooling, // 智控温                
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.BleControl, // 数字遥控器特有功能
        FuncType.InitWifi, // 数字遥控器特有功能
        FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  KS1_1_35_BLE: {
    sn: "12999/12997/F1193/F1191", // N8KS1-1
    func: [
      FuncType.ModeControl, // 模式控制      
      FuncType.UpDownSwipeWind, 
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）     
      FuncType.LeftRightSwipeWind,      
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
      FuncType.DryNewName, // 内机防霉
      FuncType.CoolPowerSaving, // 酷省                   
      FuncType.SelfCleaning, // 智清洁      
      FuncType.ElectricHeat, // 电辅热
      FuncType.Supercooling, // 智控温   
      // FuncType.SleepCurve, // 睡眠曲线
      FuncType.WindBlowing, // 防直吹 
      FuncType.PowerManager, // 电量查询            
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  KS1_3_35_BLE: {
    sn: "13031/13029/F1101", // N8KS1-3
    func: [
      FuncType.ModeControl, // 模式控制 
      FuncType.UpDownSwipeWind,      
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）  
      FuncType.ElectricHeat, // 电辅热                                           
      FuncType.CoolPowerSaving, // 酷省                   
      FuncType.SelfCleaning, // 智清洁
      FuncType.DryNewName, // 内机防霉      
      FuncType.Supercooling, // 智控温   
      // FuncType.SleepCurve, // 睡眠曲线
      FuncType.WindBlowing, // 防直吹                
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  KS1_1_46_BLE: {
    sn: "13049", // N8KS1-1
    func: [
      FuncType.ModeControl, // 模式控制
      FuncType.UpDownSwipeWind,       
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）    
      FuncType.LeftRightSwipeWind,       
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
      FuncType.CoolPowerSaving, // 酷省                   
      FuncType.SelfCleaning, // 智清洁
      FuncType.DryNewName, // 内机防霉
      FuncType.ElectricHeat, // 电辅热
      FuncType.Supercooling, // 智控温   
      // FuncType.SleepCurve, // 睡眠曲线
      FuncType.WindBlowing, // 防直吹 
      FuncType.PowerManager, // 电量查询            
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  XF1_1_BLE: {
    sn: "13003/13005/F1073/F1071", // N8XF1-1
    func: [
      FuncType.ModeControl, // 模式控制 
      FuncType.UpDownSwipeWind,      
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）       
      FuncType.LeftRightSwipeWind,    
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）   
      FuncType.FreshAir,  // 新风                         
      FuncType.ECO, // ECO   
      FuncType.WindBlowing, // 防直吹              
      FuncType.SelfCleaning, // 智清洁
      FuncType.Dry, // 干燥  
      FuncType.ElectricHeat, // 电辅热               
      FuncType.CSEco, // 舒省 
      // FuncType.SleepCurve, // 睡眠曲线
      FuncType.PowerManager, // 电量查询                   
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  K2_1_BLE: {
    sn: "13025/13027/Z1590", // K2-1
    func: [
      FuncType.ModeControl, // 模式控制      
      FuncType.UpDownSwipeWind, 
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）     
      FuncType.LeftRightSwipeWind,      
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）   
      FuncType.FreshAir,  // 新风                         
      FuncType.ECO, // ECO   
      FuncType.CSEco, // 舒省  
      FuncType.Supercooling, // 智控温     
      FuncType.ElectricHeat, // 电辅热   
      FuncType.WindBlowing, // 防直吹   
      FuncType.AppointmentSwitchOff,           
      FuncType.SelfCleaning, // 智清洁                           
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  MJ101_BLE: {
    sn: "51573/51571", //BDN8Y-MJ101(1)
    func: [
        FuncType.ModeControl, // 模式控制  
        FuncType.UpDownSwipeWind,   
        FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）  
        FuncType.LeftRightSwipeWind,     
        FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度） 
        FuncType.ECO, // ECO                                       
        FuncType.ElectricHeat, // 电辅热          
        FuncType.Dry, //干燥               
        FuncType.SelfCleaning, // 智清洁                            
        FuncType.Supercooling, // 智控温                
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.BleControl, // 数字遥控器特有功能
        FuncType.InitWifi, // 数字遥控器特有功能
        FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  M2_1_BLE: {
    sn: "51575/Z1592/51605",
    func: [
        FuncType.ModeControl, // 模式控制   
        FuncType.UpDownSwipeWind,  
        FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）    
        FuncType.LeftRightSwipeWind,   
        FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度） 
        FuncType.ECO, // ECO                                       
        FuncType.ElectricHeat, // 电辅热     
        FuncType.WindBlowing, // 防直吹     
        FuncType.Dry, //干燥               
        FuncType.SelfCleaning, // 智清洁                            
        FuncType.Supercooling, // 智控温     
        FuncType.PowerManager, // 电量查询           
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.BleControl, // 数字遥控器特有功能
        FuncType.InitWifi, // 数字遥控器特有功能
        FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  JH1_1_BLE: {
    sn: "13045/13043/Z1593/13041",
    func: [
        FuncType.ModeControl, // 模式控制  
        FuncType.UpDownSwipeWind,       
        FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
        FuncType.LeftRightSwipeWind,
        FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
        FuncType.ElectricHeat, // 电辅热             
        FuncType.ECO, // ECO     
        FuncType.CSEco, // 舒省             
        FuncType.WindBlowing,             
        FuncType.SelfCleaning, // 智清洁                            
        FuncType.Supercooling, // 智控温            
        FuncType.Dry, // 干燥     
        // FuncType.SleepCurve, // 睡眠曲线      
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.BleControl, // 数字遥控器特有功能
        FuncType.InitWifi, // 数字遥控器特有功能
        FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  // KFR-72L/T5        22251525
  // KFR-72L/T5[Y]     222Z1568
  // KFR-35G/T5         22012951
  // KFR-35G/T5[Y]     220Z1580
  // KFR-35G/T3[Y]     220Z1587
  // KFR-35G/T3          22013019
  T5_35_BLE: {
    sn: "12951/Z1580", // KFR-35G/T5 KFR-35G/T5[Y]
    func: [
      FuncType.ModeWithNoAuto, // 模式控制     
      FuncType.UpDownSwipeWind,  
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）           
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）   
      FuncType.FreshAir,  // 新风                         
      FuncType.ECO, // ECO         
      FuncType.NoWindFeel, // 无风感          
      FuncType.WindBlowing, // 防直吹    
      FuncType.SelfCleaning, // 智清洁
      FuncType.DryNewName, // 干燥  
      FuncType.ElectricHeat, // 电辅热               
      // FuncType.SleepCurve, // 睡眠曲线              
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  T3_35_BLE: {
    sn: "Z1587/13019", // KFR-35G/T3 KFR-35G/T3[Y]
    func: [
      FuncType.ModeWithNoAuto, // 模式控制   
      FuncType.UpDownSwipeWind,    
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）    
      FuncType.LeftRightSwipeWind,       
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）   
      FuncType.FreshAir,  // 新风                         
      FuncType.ECO, // ECO         
      FuncType.NoWindFeel, // 无风感          
      FuncType.WindBlowing, // 防直吹    
      FuncType.SelfCleaning, // 智清洁
      FuncType.DryNewName, // 干燥  
      FuncType.ElectricHeat, // 电辅热               
      // FuncType.SleepCurve, // 睡眠曲线              
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  // KFR-72L/T5        22251525
  // KFR-72L/T5[Y]     222Z1568
  T5_72_BLE: {
    sn: "51525/Z1568", // KFR-72L/T5 KFR-72L/T5[Y]
    func: [
      FuncType.ModeWithNoAuto, // 模式控制    
      FuncType.UpDownSwipeWind,   
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）     
      FuncType.LeftRightSwipeWind,      
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）   
      FuncType.FreshAir,  // 新风                         
      FuncType.ECO, // ECO         
      FuncType.ThNowindFeel, // 无风感      
      FuncType.SelfCleaning, // 智清洁
      FuncType.DryNewName, // 干燥  
      FuncType.ElectricHeat, // 电辅热                
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  W11_GUI_BLE: {
    sn: "60049/60047",
    func: [
        FuncType.ModeControl, // 模式控制          
        FuncType.LeftRightSwipeWind,        
        FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度） 
        FuncType.ECO, // ECO                                       
        FuncType.ElectricHeat, // 电辅热                                
        FuncType.SelfCleaning, // 智清洁                            
        FuncType.Supercooling, // 智控温              
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.BleControl, // 数字遥控器特有功能
        FuncType.InitWifi, // 数字遥控器特有功能
        FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  ET200: {
    sn: "Z1588/13021/Z1589/13023",
    func: [
        FuncType.ModeControl, // 模式控制
        FuncType.UpDownSwipeWind,    
        FuncType.UpDownWindAngle, // 风向可视化（上下摆风角度）  
        FuncType.LeftRightSwipeWind,      
        FuncType.LeftRightWindAngle,// 风向可视化（左右摆风角度）                                     
        FuncType.ElectricHeat, // 电辅热                          
        FuncType.ECO, // ECO                 
        FuncType.SelfCleaning, // 智清洁        
        FuncType.NoWindFeel, // 无风感
        FuncType.CSEco, // 舒省             
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,      
    ]
  },
  _FG100: {
    sn: "12965/Z1595/Z2363/F1107/Z1607/Z2372/13083", // 吊顶
    func: [
        FuncType.ModeControl, // 模式控制
        FuncType.UpDownSwipeWind,    
        FuncType.UpDownWindAngle, // 风向可视化（上下摆风角度）  
        FuncType.LeftRightSwipeWind,      
        FuncType.LeftRightWindAngle,// 风向可视化（左右摆风角度） 
        FuncType.DryNewNameKitchen, // 内机防霉
        FuncType.FilterClean, // 滤网清洗和复位                                  
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.PrepareFood,
        FuncType.QuickFry,
        FuncType.UpDownSwipeWindKit,
        FuncType.BleControl, // 数字遥控器特有功能
        FuncType.InitWifi, // 数字遥控器特有功能
        FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  _XD200: {
    sn: "13047/Z1597/F1093/Z1606/13081/13161", // 吸顶
    func: [
        FuncType.ModeControl, // 模式控制    
        FuncType.UpDownSwipeWind, // 上下风
        FuncType.UpDownWindAngle, // 风向可视化（上下摆风角度）  
        FuncType.LeftRightSwipeWind, // 左右风              
        FuncType.LeftRightWindAngle,// 风向可视化（左右摆风角度） 
        FuncType.DryNewNameKitchen, // 内机防霉
        FuncType.FilterClean, // 滤网清洗和复位                                 
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.PrepareFood,
        FuncType.QuickFry,
        FuncType.UpDownSwipeWindKit,
        FuncType.BleControl, // 数字遥控器特有功能
        FuncType.InitWifi, // 数字遥控器特有功能
        FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  KQ1_D1_BLE: {
    sn: "F1173/F1171", // N8KQ1-D1
    func: [
      FuncType.ModeControl, // 模式控制     
      FuncType.UpDownSwipeWind, // 上下风  
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）  
      FuncType.ElectricHeat, // 电辅热                                           
      FuncType.CoolPowerSaving, // 酷省                   
      FuncType.SelfCleaning, // 智清洁
      FuncType.DryNewName, // 内机防霉      
      FuncType.Supercooling, // 智控温   
      // FuncType.SleepCurve, // 睡眠曲线
      FuncType.WindBlowing, // 防直吹                
      FuncType.PowerManager, // 电量查询
      FuncType.Dot5Support,            
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  MJ_102: {
    sn: "51595/51597/Z1613", // N8KQ1-D1
    func: [
      FuncType.ModeControl, // 模式控制      
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle, // 风向可视化（左右摆风角度） 
      FuncType.UpDownSwipeWind,
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）  
      FuncType.ElectricHeat, // 电辅热                                           
      FuncType.ECO, // ECO                   
      FuncType.SelfCleaning, // 智清洁
      FuncType.Dry, // 干燥      
      FuncType.Supercooling, // 智控温    
      FuncType.CSEco,
      FuncType.WindBlowing,      
      FuncType.Dot5Support,            
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  JP1_1: {
    sn: "51599/51603/Z1614", // KFR-72L/JP1-1
    func: [
      FuncType.ModeControl, // 模式控制    
      FuncType.UpDownSwipeWind,
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）      
      FuncType.LeftRightSwipeWind,     
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度)                       
      FuncType.ECO, // ECO             
      FuncType.WindBlowing, // 防直吹    
      FuncType.SelfCleaning, // 智清洁
      FuncType.Dry, // 干燥  
      FuncType.Supercooling, // 智控温
      FuncType.Degerming, // 除菌
      FuncType.ElectricHeat, // 电辅热     
      FuncType.PowerManager, //电量统计                   
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  JH1_1: {
    sn: "51621/Z1616/51619", // KFR-72L/JH1-1
    func: [
      FuncType.ModeControl, // 模式控制    
      FuncType.UpDownSwipeWind,     
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
      FuncType.ElectricHeat, // 电辅热             
      FuncType.ECO, // ECO     
      FuncType.CSEco, // 舒省             
      FuncType.WindBlowing,             
      FuncType.SelfCleaning, // 智清洁                            
      FuncType.Supercooling, // 智控温
      FuncType.Degerming, //杀菌  
      FuncType.PowerManager, //电量统计
      FuncType.WaterFallWind, //巨瀑风                       
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  FA1_1: {
    sn: "13103/13105", // FA1_1
    func: [
      FuncType.ModeControl, // 模式控制         
      FuncType.UpDownSwipeWind,
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                           
      FuncType.ElectricHeat, // 电辅热             
      FuncType.ECO, // ECO    
      FuncType.CSEco, // CSEco                  
      FuncType.WindBlowing,        
      FuncType.Dry, // 干燥
      FuncType.NoWindFeel, // 无风感   
      FuncType.ThSoftWindFeel, // 柔风感
      FuncType.SelfCleaning, // 智清洁                            
      FuncType.Supercooling, // 智控温      
      FuncType.PowerManager, //电量统计
      FuncType.SleepCurve, // 睡眠曲线                             
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  FA1_1_51_72: {
    sn: "51635/Z1620/51633/51641/Z1627/51639", // FA1_1
    func: [
      FuncType.ModeControl, // 模式控制      
      FuncType.UpDownSwipeWind,   
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      // FuncType.LeftRightSwipeWind,
      FuncType.UpSwipeWind, // 上左右风
      FuncType.DownSwipeWind00Ae, // 下左右风
      FuncType.UpLeftRightDownLeftRightWindAngle,// 上左右、下左右出风方向                                
      FuncType.ElectricHeat, // 电辅热        
      FuncType.ThUpNoWindFeel,//上无风感
      FuncType.ThDownNoWindFeel,//下无风感
      FuncType.ECO, // ECO                 
      FuncType.Dry, // 干燥    
      FuncType.SelfCleaning, // 智清洁        
      FuncType.QuickCoolHeat, // 速冷热                    
      FuncType.AutomaticAntiColdAir, // 主动防冷风             
      FuncType.Supercooling, // 智控温                               
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  JP1_1_GUA: {
    sn: "13115/13113/Z1618", // JP1_1挂机
    func: [
      FuncType.ModeControl, // 模式控制      
      FuncType.UpDownSwipeWind,   
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）
      FuncType.UpDownAroundWind, //上下环绕风                         
      FuncType.ElectricHeat, // 电辅热               
      FuncType.ECO, // ECO   
      FuncType.CSEco,  // 舒省                                           
      FuncType.SelfCleaning, // 智清洁,   
      FuncType.Dry, // 干燥                    
      FuncType.UpDownWindBlowing,//上下防直吹                                    
      FuncType.Supercooling,//智控温   
      FuncType.PowerManager, //电量统计        
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能 
    ]
  },
  COOLFREE_LH: {
    sn: "96571/96573/96575/96577/96579/96581/96583",
    func: [
        FuncType.ModeControl, // 模式控制                                                               
        FuncType.CoolFreeDry, //
        FuncType.AppointmentSwitchOff, // 定时关                           
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.isCoolFree, // 酷风
        // FuncType.BleControl, // 数字遥控器特有功能
        // FuncType.InitWifi, // 数字遥控器特有功能
        // FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  COOLFREE_SJ: {
    sn: "96537/96541/96545/96549/96553/96557/96601/96535/96539/96543/96547/96551/96555",
    func: [
        FuncType.ModeControl, // 模式控制                                                
        // FuncType.ElectricHeat, // 电辅热            
        FuncType.CoolFreeDry, //
        FuncType.AppointmentSwitchOff, // 定时关                           
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.isCoolFree, // 酷风
        // FuncType.BleControl, // 数字遥控器特有功能
        // FuncType.InitWifi, // 数字遥控器特有功能
        // FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  COOLFREE_TS: {
    sn: "96525/96521/96517/96513/96509/96505/96533/96523/96519/96515/96511/96507/96503/96531",
    func: [
        FuncType.ModeControl, // 模式控制                                                                  
        FuncType.CoolFreeDry, //
        FuncType.AppointmentSwitchOff, // 定时关                           
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.isCoolFree, // 酷风
        // FuncType.BleControl, // 数字遥控器特有功能
        // FuncType.InitWifi, // 数字遥控器特有功能
        // FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  _MZA1_3_QJ201:{
    sn: "51651/Z1632/51655/51653/Z1633",
    func: [
      FuncType.ModeControl, // 模式控制    
      FuncType.UpDownSwipeWind,     
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                 
      FuncType.ECO, // ECO                          
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁
      FuncType.Dry, // 干燥
      FuncType.ElectricHeat, // 电辅热
      FuncType.Supercooling, // 智控温   
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,         
      FuncType.useTH    
    ]
},
_DX1_1:{
    sn: "51657/51659/Z3131",
    func: [
      FuncType.ModeControl, // 模式控制    
      FuncType.UpDownSwipeWind,     
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                 
      FuncType.ECO, // ECO                          
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁
      FuncType.Dry, // 干燥
      FuncType.ElectricHeat, // 电辅热
      FuncType.Supercooling, // 智控温   
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.AroundWind, // 环绕风     
      FuncType.useTH 
    ]
  },
  T3_OFFLINE_VOICE_BLE: {
    sn: "Z1635/51661", // KFR-72L/T5 KFR-72L/T5[Y]
    func: [
      FuncType.ModeWithNoAuto, // 模式控制    
      FuncType.UpDownSwipeWind, // 左右分区，上下摆风   
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）     
      FuncType.LeftRightSwipeWindPopup, // 左右摆风，左右分区摆风 
      FuncType.LeftRightWindAngleLeftRight,//风向可视化（左右摆风角度）   
      FuncType.FreshAir,  // 新风                         
      FuncType.ECO, // ECO         
      FuncType.ThNowindFeelLeft, // 左无风感      
      FuncType.ThNowindFeelRight, // 右无风感
      FuncType.SelfCleaning, // 智清洁
      FuncType.DryNewName, // 干燥  
      FuncType.ElectricHeat, // 电辅热    
      FuncType.Supercooling, // 智控温
      FuncType.KeepWet, // 保湿
      FuncType.BackWarmRemoveWet, // 回温除湿
      FuncType.CleanFunc, // 净化
      FuncType.ThLight, // 灯光
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能    
      FuncType.useTH,  
      // 保湿、回温除湿
    ]
  },
  T1_OFFLINE_VOICE_BLE: {
    sn: "51663", // KFR-72L/T5 KFR-72L/T5[Y]
    func: [
      FuncType.ModeWithNoAuto, // 模式控制    
      FuncType.UpDownSwipeWind, // 左右分区，上下摆风   
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）     
      FuncType.LeftRightSwipeWindPopup, // 左右摆风，左右分区摆风 
      FuncType.LeftRightWindAngleLeftRight,//风向可视化（左右摆风角度）                        
      FuncType.ECO, // ECO         
      FuncType.ThNowindFeelLeft, // 左无风感      
      FuncType.ThNowindFeelRight, // 右无风感
      FuncType.SelfCleaning, // 智清洁
      FuncType.DryNewName, // 干燥  
      FuncType.ElectricHeat, // 电辅热    
      FuncType.KeepWet, // 保湿
      FuncType.BackWarmRemoveWet, // 回温除湿
      FuncType.Degerming, // 除菌
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能    
      FuncType.useTH,  
      // 保湿、回温除湿
    ]
  },
  _W12_BLE:{
    sn: "60055/60057/Z1931", // 51605 m2-1
    func: [
      FuncType.ModeControl, // 模式控制    
      FuncType.UpDownSwipeWind,     
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                 
      FuncType.ECO, // ECO                          
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁
      FuncType.Dry, // 干燥
      FuncType.ElectricHeat, // 电辅热
      FuncType.Supercooling, // 智控温   
      FuncType.PowerManager, // 电量查询
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,         
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能      
    ]
  },
  _A33_BLE:{
    sn: "60053/60051",
    func: [
      FuncType.ModeControl, // 模式控制    
      FuncType.UpDownSwipeWind,     
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                 
      FuncType.ECO, // ECO                          
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁
      FuncType.Dry, // 干燥
      FuncType.ElectricHeat, // 电辅热
      FuncType.Supercooling, // 智控温         
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,   
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能             
    ]
  },
  MXC1_2_BLE: { // 风尊2代
    sn: "13129/13127",
    func: [
      FuncType.ModeControl, // 模式控制     
      FuncType.UpDownSwipeWind, // 上下摆风
      FuncType.UpDownWindAngle, // 上下摆风角度 
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）   
      FuncType.UpDownAroundWind, // 上下环绕风   
      FuncType.UpDownWindBlowing,//上下防直吹                                              
      FuncType.SelfCleaning, // 智清洁      
      FuncType.Dry, // 干燥
      FuncType.Supercooling, // 智控温         
      FuncType.ElectricHeat, // 电辅热    
      FuncType.PowerManager, // 电量查询     
      FuncType.CoolPowerSaving, // 酷省         
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能    
      FuncType.useTH,
    ]
  },
  MXC1_2_BLE_46: { // 风尊2代 46
    sn: "13175",
    func: [
      FuncType.ModeControl, // 模式控制     
      FuncType.UpDownSwipeWind, // 上下摆风
      FuncType.UpDownWindAngle, // 上下摆风角度 
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）   
      FuncType.UpDownAroundWind, // 上下环绕风   
      FuncType.UpDownWindBlowing,//上下防直吹                                              
      FuncType.SelfCleaning, // 智清洁      
      FuncType.Dry, // 干燥
      FuncType.Supercooling, // 智控温   
      FuncType.Quietness, // 静眠 
      FuncType.ElectricHeat, // 电辅热    
      FuncType.PowerManager, // 电量查询     
      FuncType.CoolPowerSaving, // 酷省         
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能    
      FuncType.useTH,
    ]
  },
  offline_voice_SN1_QJ201_MZA1: {
    sn:"Z1624/13133/Z1626/13137/13135/Z1628/13139",
    func: [
      FuncType.ModeControl, // 模式控制    
      FuncType.UpDownSwipeWind, // 上下摆风     
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）         
      FuncType.ElectricHeat, // 电辅热        
      FuncType.Dry, // 干燥                    
      FuncType.WindBlowing,// 防直吹  
      FuncType.CSEco,
      FuncType.ECO, // ECO                                   
      FuncType.Supercooling,//智控温      
      FuncType.SelfCleaning, // 智清洁,               
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.useTH
    ]
  },
  TA1_1_BLE: {
    sn:"13111/13109/Z1615",
    func: [
      FuncType.ModeControl, // 模式控制   
      FuncType.UpDownSwipeWind,      
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind, 
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）         
      FuncType.ECO, // ECO                                   
      FuncType.NoWindFeel, // 无风感
      FuncType.DryNewName, // 内机防霉
      FuncType.ElectricHeat, // 电辅热      
      FuncType.Supercooling,//智控温       
      FuncType.SelfCleaning, // 智清洁,                             
      FuncType.CSEco, // 舒省                         
      FuncType.PowerManager, // 电量统计
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能    
    ]
  },
  FA1_1_T_BLE: {
    sn:"Z1630/13141/13143",
    func: [
      FuncType.ModeControl, // 模式控制   
      FuncType.UpDownSwipeWind,      
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind, 
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）         
      FuncType.NoWindFeel, // 无风感
      FuncType.ECO,
      FuncType.ThSoftWindFeel, // 柔风感
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁
      FuncType.Dry, // 干燥
      FuncType.ElectricHeat, // 电辅热
      FuncType.Supercooling, // 智控温
      FuncType.CSEco, // 舒省
      FuncType.PowerManager, // 电量统计      
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能  
      FuncType.useTH,  
    ]
  },
  MY101_3_BLE: {
    sn:"13153/13155/13157/13159",
    func: [
      FuncType.ModeControl, // 模式控制   
      FuncType.UpDownSwipeWind,      
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind, 
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）         
      FuncType.ECO, // ECO                                   
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁
      FuncType.ElectricHeat, // 电辅热,
      FuncType.Supercooling, // 智控温
      FuncType.PowerManager, // 电量查询
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能    
    ]
  },
  NORTHWARM: {
    sn:"93193",
    func: [
      FuncType.NorthWarmMode, // 模式控制  
      FuncType.NorthWarmAuto,
      FuncType.TargetIndoorTemp,   
      // FuncType.Holiday,      
      FuncType.NorthWarmGoOut,
      FuncType.NorthWarmQuiet,
      FuncType.NorthWarmSaveEnergy,
      FuncType.useNorthWarm,
      FuncType.NorthWarmAppointment
    ]
  },
  N8XY1_P1_BLE: {
    sn:"F1211",
    func: [
      FuncType.ModeControl, // 模式控制   
      FuncType.UpDownSwipeWind,      
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind, 
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）         
      FuncType.ECO, // ECO                                   
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁
      FuncType.Dry, // 干燥
      FuncType.ElectricHeat, // 电辅热,
      FuncType.Supercooling, // 智控温
      FuncType.CSEco,
      FuncType.PowerManager, // 电量查询
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能    
    ]
  },
  M2_3_BLE: {
    sn: "51669/51667/Z1637",
    func: [
      FuncType.ModeControl, // 模式控制    
      FuncType.UpDownSwipeWind,     
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                 
      FuncType.ECO, // ECO                          
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁
      FuncType.Dry, // 干燥
      FuncType.ElectricHeat, // 电辅热
      FuncType.Supercooling, // 智控温         
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,   
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能             
    ]
  },
  JH2_1_BLE: {
    sn: "Z1636/13171/13173",
    func: [
      FuncType.ModeControl, // 模式控制    
      FuncType.UpDownSwipeWind,     
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                 
      FuncType.CoolPowerSavingNewName, // 酷省(省电)                          
      FuncType.UpWindBlowing,//上防直吹      
      FuncType.DownWindBlowing,//下防直吹      
      FuncType.SelfCleaning, // 智清洁
      FuncType.DryNewName, // 干燥
      FuncType.ElectricHeat, // 电辅热
      FuncType.Degerming, // 除菌
      FuncType.Supercooling, // 智控温   
      FuncType.Quietness, // 静眠
      FuncType.PowerManager, // 电量查询     
      FuncType.QuickCoolHeat, // 速冷热
      FuncType.LoopFan, // 循环扇
      FuncType.NewSound, // 电控蜂鸣器声音
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,   
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能  
      FuncType.useTH           
    ]
  },
  KS1_1_P_35_BLE: {
    sn: "13167/13169", // N8KS1-1
    func: [
      FuncType.ModeControl, // 模式控制      
      FuncType.UpDownSwipeWind, 
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）     
      FuncType.LeftRightSwipeWind,      
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                       
      FuncType.DryNewName, // 内机防霉
      FuncType.CoolPowerSaving, // 酷省                   
      FuncType.SelfCleaning, // 智清洁      
      FuncType.ElectricHeat, // 电辅热
      FuncType.Supercooling, // 智控温   
      // FuncType.SleepCurve, // 睡眠曲线
      FuncType.WindBlowing, // 防直吹 
      FuncType.PowerManager, // 电量查询   
      FuncType.useTH,         
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  N8FM_1_FG_1_FJ_1_JS_1:{
    sn: "F1223/F1225/F1227/F1229", // KFR-35GW/QD200
    func: [
        FuncType.ModeControl, // 模式控制 
        FuncType.UpDownSwipeWind,        
        FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
        FuncType.LeftRightSwipeWind,
        FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）  
        FuncType.ECO, // ECO   
        FuncType.WindBlowing,//防直吹                 
        FuncType.Dry, // 干燥
        FuncType.Supercooling, // 智控温                 
        FuncType.ElectricHeat, // 电辅热   
        FuncType.CSEco,// 舒省                                   
        FuncType.SelfCleaning, // 智清洁    
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,           
    ]
  },
  MXC1_J1: {
    sn: "13181/13183", // KFR-35GW/QD200
    func: [
      FuncType.ModeControl, // 模式控制     
      FuncType.UpDownSwipeWind, // 上下摆风
      FuncType.UpDownWindAngle, // 上下摆风角度 
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）   
      FuncType.UpDownAroundWind, // 上下环绕风   
      FuncType.UpDownWindBlowing,//上下防直吹                                              
      FuncType.SelfCleaning, // 智清洁      
      FuncType.Dry, // 干燥
      FuncType.Supercooling, // 智控温         
      FuncType.ElectricHeat, // 电辅热    
      FuncType.PowerManager, // 电量查询     
      FuncType.CoolPowerSaving, // 酷省         
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能    
      FuncType.useTH,   
    ]
  },
  N10_1: {
    sn: "20105/Z1646", // KFR-50G/N10-1
    func: [
      FuncType.ModeControl, // 模式控制     
      FuncType.UpDownSwipeWind, // 上下摆风
      FuncType.UpDownWindAngle, // 上下摆风角度 
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                                   
      FuncType.ElectricHeat, // 电辅热
      FuncType.ECO, // ECO
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁    
      FuncType.Supercooling, // 智控温
      FuncType.CSEco, // 舒省
      FuncType.PowerManager, // 电量
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能           
    ]
  },
  XYB1_XYA1_P1: {
    sn: "F1241/F1239", // KFR-50G/N10-1
    func: [
      FuncType.ModeControl, // 模式控制     
      FuncType.UpDownSwipeWind, // 上下摆风
      FuncType.UpDownWindAngle, // 上下摆风角度 
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                                   
      FuncType.ElectricHeat, // 电辅热
      FuncType.ECO, // ECO
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁    
      FuncType.Dry, // 干燥      
      FuncType.Supercooling, // 智控温
      FuncType.CSEco, // 舒省
      FuncType.PowerManager, // 电量
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能           
    ]
  },
  PD1_1: { // 熊猫
    sn: "13179/13177", // KFR-35G/N8PD1-1
    func: [
      FuncType.ModeControl, // 模式控制     
      FuncType.UpDownSwipeWind, // 上下摆风
      FuncType.UpDownWindAngle, // 上下摆风角度 
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）                                                   
      FuncType.FreshAir, // 新风
      FuncType.ElectricHeat, // 电辅热
      FuncType.ECO, // ECO
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁    
      FuncType.DryNewName, // 干燥      
      FuncType.Supercooling, // 智控温
      FuncType.CSEco, // 舒省
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能     
      FuncType.useTH // 使用th协议      
    ]
  },
  M1_1_BLE: { // M1-1
    sn: "F1249/F1247/F1257/F1255/F1253/F1251/F1261/F1259", // KFR-35G/N8PD1-1
    func: [
      FuncType.ModeControl, // 模式控制     
      FuncType.UpDownSwipeWind, // 上下摆风
      FuncType.UpDownWindAngle, // 上下摆风角度       
      FuncType.ElectricHeat, // 电辅热
      FuncType.ECO, // ECO
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁    
      FuncType.Dry, // 干燥      
      FuncType.Supercooling, // 智控温
      FuncType.CSEco, // 舒省
      FuncType.PowerManager, // 电量
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能 
    ]
  },
  HX1_P1 : { // M1-1
    sn: "F1313/F1315", // KFR-35G/N8PD1-1
    func: [
      FuncType.ModeControl, // 模式控制     
      FuncType.UpDownSwipeWind, // 上下摆风
      FuncType.UpDownWindAngle, // 上下摆风角度       
      FuncType.ElectricHeat, // 电辅热
      FuncType.ECO, // ECO
      FuncType.WindBlowing, // 防直吹
      FuncType.SelfCleaning, // 智清洁    
      FuncType.Dry, // 干燥      
      FuncType.Supercooling, // 智控温
      FuncType.CSEco, // 舒省
      FuncType.PowerManager, // 电量
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,  
    ]
  },
  FQ1_1_BLE: { // FQ1_1
    sn: "51671/Z1642/51673", // KFR-35G/N8PD1-1
    func: [
      FuncType.ModeControl, // 模式控制      
      FuncType.UpDownSwipeWind,   
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      // FuncType.LeftRightSwipeWind,
      FuncType.UpSwipeWind, // 上左右风
      FuncType.DownSwipeWind00Ae, // 下左右风
      FuncType.UpLeftRightDownLeftRightWindAngle,// 上左右、下左右出风方向                                
      FuncType.ElectricHeat, // 电辅热        
      FuncType.ThUpNoWindFeel,//上无风感
      FuncType.ThDownNoWindFeel,//下无风感
      FuncType.ECO, // ECO                 
      FuncType.Dry, // 干燥    
      FuncType.SelfCleaning, // 智清洁               
      FuncType.AutomaticAntiColdAir, // 主动防冷风             
      FuncType.Supercooling, // 智控温      
      FuncType.PowerManager, // 电量查询                         
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能
      FuncType.useTH,
      FuncType.hasAutoPreventColdWindMemory, // 支持主动防冷风记忆
    ]
  },
  KS1_1_P_51_72: {
    sn: "51649/51637",
    func: [
        FuncType.ModeControl, // 模式控制    
        FuncType.UpDownSwipeWind,      
        FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）             
        FuncType.LeftRightSwipeWind,
        FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）              
        FuncType.Dry, //干燥                         
        FuncType.ElectricHeat, // 电辅热               
        FuncType.Supercooling, // 智控温   
        FuncType.SelfCleaning, // 智清洁         
        FuncType.PowerManager, // 电量查询    
        FuncType.CoolPowerSaving, // 酷省        
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.useTH
        // FuncType.BleControl, // 数字遥控器特有功能
        // FuncType.InitWifi, // 数字遥控器特有功能
        // FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  KS1_3_P_51_72: {
    sn: "51647/51645",
    func: [
        FuncType.ModeControl, // 模式控制    
        FuncType.UpDownSwipeWind,      
        FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）             
        FuncType.LeftRightSwipeWind,
        FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）              
        FuncType.Dry, //干燥                         
        FuncType.ElectricHeat, // 电辅热               
        FuncType.Supercooling, // 智控温   
        FuncType.SelfCleaning, // 智清洁
        FuncType.CoolPowerSaving, // 酷省        
        FuncType.Dot5Support,
        FuncType.NoPolar,
        FuncType._16Support,
        FuncType.useTH
        // FuncType.BleControl, // 数字遥控器特有功能
        // FuncType.InitWifi, // 数字遥控器特有功能
        // FuncType.SafeMode, // 数字遥控器特有功能
    ]
  },
  PX1_1_GUA_BLE: {
    sn:"13189/Z1643/13187/Z3135",
    func: [
      FuncType.ModeControl, // 模式控制      
      FuncType.UpDownSwipeWind,   
      FuncType.UpDownWindAngle,//风向可视化（上下摆风角度）
      FuncType.LeftRightSwipeWind,
      FuncType.LeftRightWindAngle,//风向可视化（左右摆风角度）
      FuncType.UpDownAroundWind, //上下环绕风                         
      FuncType.ElectricHeat, // 电辅热               
      FuncType.ECO, // ECO   
      FuncType.CSEco,  // 舒省                                           
      FuncType.SelfCleaning, // 智清洁,   
      FuncType.Dry, // 干燥                    
      FuncType.UpDownWindBlowing,//上下防直吹                                    
      FuncType.Supercooling,//智控温   
      FuncType.PowerManager, //电量统计        
      FuncType.Dot5Support,
      FuncType.NoPolar,
      FuncType._16Support,
      FuncType.BleControl, // 数字遥控器特有功能
      FuncType.InitWifi, // 数字遥控器特有功能
      FuncType.SafeMode, // 数字遥控器特有功能 
    ]
  }
};
//公用功能
const FuncDefault = [    
    FuncType.AppointmentSwitchOff,
    FuncType.Show,//屏显（灯光可控）
    FuncType.Sound,
    FuncType.ElectricHeat, 
    FuncType.AboutDevice,     
];


const OrderMap = ['LoopFan','CleanFunc', 'KeepWet' , 'BackWarmRemoveWet','CoolPowerSaving','ECO','CSEco','Supercooling','ThLight','Show','Sound', 'NewSound','ElectricHeat', 'Degerming','Dry', 'CoolFreeDry', 'DryNewName'] // 此顺序定义其他按钮中的按钮顺序

const FuncCoolFreeDefault = [
    // FuncType.ElectricHeat, 
    FuncType.AppointmentSwitchOff,   
    FuncType.AboutDevice,     
];

const NorthWarmDefault = []

export {
    SNFuncMatch,
    FuncDefault,
    FuncCoolFreeDefault,
    NorthWarmDefault,
    OrderMap
};