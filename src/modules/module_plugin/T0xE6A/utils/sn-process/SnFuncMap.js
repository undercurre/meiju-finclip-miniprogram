import {
  FuncType
} from './FuncType';

const SNFuncMatch = {
  // 21593211
  XIAO_SONG_SHU: {
    sn: "93217/93215", // 小松鼠 // 215
    func: [
      // FuncType.smartAtHome, // 智能居家
      // FuncType.smartSleep, // 智能睡眠
      FuncType.smartGoOut, // 智能外出
      // FuncType.dotZeroWater, // 点动
      // FuncType.appointmentZeroWater, // 定时零冷水
      // FuncType.singleZeroWater, // 单次零冷水
      // FuncType.smartTempFeel, // 智温感
      // FuncType.addPressure, // 增压
    ]
  },
  HTST: {
    sn: "10052", // 
    func: [
      FuncType.smartAtHome, // 智能居家
      FuncType.smartSleep, // 智能睡眠
      FuncType.smartGoOut, // 智能外出
      FuncType.dotZeroWater, // 点动
      FuncType.appointmentZeroWater, // 定时零冷水
      FuncType.singleZeroWater, // 单次零冷水
      FuncType.smartTempFeel, // 智温感
      FuncType.addPressure, // 增压
    ]
  },
};
//公用功能
const FuncDefault = [

];

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
};
