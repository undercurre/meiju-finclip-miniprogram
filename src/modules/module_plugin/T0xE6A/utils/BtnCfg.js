const app = getApp()
var baseImgApi = app.getGlobalConfig().baseImgApi;
// var imageDoamin = (baseImgApi.url).split('/projects/')[0] + '/projects/sit/meiju-lite-assets/';
var imageDoamin = "/src/modules/module_plugin/T0xE6/assets/images/cell/"
// const filePath = '/src/modules/module_plugin/T0xE6/assets/images/cell/'
const filePath = 'https://www.smartmidea.net/projects/sit/meiju-lite-assets/plugin/0xE6/jiayong-e6/'
console.log(imageDoamin, 'imageDoamin');
const Btns = {
  autoWaterTemp: {
    key: "autoWaterTemp",
    icon: `${filePath}auto-water-temp.png`,
    activeIcon: `${filePath}auto-water-temp.png`,
    title: '自动水温',
    label: '',
    describe: '102分钟',
    detail: '温度 60℃',
    selected: false,
    val: 2,
    isLink: false
  },
  feelTempWarm: {
    key: "feelTempWarm",
    icon: `${filePath}feel-heat.png`,
    activeIcon: `${filePath}feel-heat.png`,
    title: '感温供热',
    label: '',
    describe: '70分钟',
    detail: '温度 60℃',
    selected: false,
    val: 3,
    isLink: false
  },
  smartTempFeel: {
    key: "smartTempFeel",
    funcName: "智温感",
    icon: `${filePath}ai-feel-temp.png`,
    activeIcon: `${filePath}ai-feel-temp.png`,
    title: '智温感',
    label: '',
    describe: '根据环境温度，自动调节水温',
    detail: '',
    selected: false,
    val: '',
    isLink: false
  },
  addPressure: {
    key: "addPressure",
    funcName: "增压",
    icon: `${filePath}bar-wash.png`,
    activeIcon: `${filePath}bar-wash.png`,
    title: '增压',
    label: '',
    describe: '提升水量，畅享瀑布洗',
    detail: '',
    selected: false,
    val: "",
    isLink: false
  },
  singleZeroWater: {
    key: "singleZeroWater",
    funcName: "单次零冷水",
    icon: `${filePath}single-cold-water.png`,
    activeIcon: `${filePath}single-cold-water.png`,
    title: '单次零冷水',
    label: '',
    describe: '',
    detail: '',
    selected: false,
    val: "",
    isLink: false,
    hasSwitch: true,
  },
  dotZeroWater: {
    key: "dotZeroWater",
    funcName: "点动零冷水",
    icon: `${filePath}dot-cold-water.png`,
    activeIcon: `${filePath}dot-cold-water.png`,
    title: '点动零冷水',
    label: '快速开关两次，启动零冷水',
    describe: '',
    detail: '',
    selected: false,
    val: "",
    isLink: false,
    hasSwitch: true,
  },
  appointmentZeroWater: {
    key: "appointmentZeroWater",
    funcName: "定时零冷水",
    icon: `${filePath}appointment-cold-water.png`,
    activeIcon: `${filePath}appointment-cold-water.png`,
    title: '定时零冷水',
    label: '预约时段启动零冷水',    
    describe: '',
    detail: '',
    selected: false,
    hasSwitch: false,
    val: "",
    isLink: false
  },
  smartAtHome: {
    key: "smartAtHome",
    funcName: "智能居家",
    icon: `${filePath}smart-at-home-unselect.png`,
    activeIcon: `${filePath}smart-at-home-select.png`,
    title: '智能居家',
    label: '',
    tips:'检测室内温度，智能调温',
    describe: '102分钟',
    detail: '温度 60℃',
    selected: false,
    hasSwitch: false,
    val: 2,
    isLink: false
  },
  smartSleep: {
    key: "smartSleep",
    funcName: "智能睡眠",
    icon: `${filePath}smart-sleep-unselect.png`,
    activeIcon: `${filePath}smart-sleep-select.png`,
    title: '智能睡眠',
    label: '',
    tips:'适用于睡眠场景，智能调温',
    describe: '70分钟',
    detail: '温度 60℃',
    selected: false,
    hasSwitch: false,
    val: 3,
    isLink: false
  },
  smartGoOut: {
    key: "smartGoOut",
    funcName: "智能外出",
    icon: `${filePath}smart-out-unselect.png`,
    activeIcon: `${filePath}smart-out-select.png`,
    title: '智能外出',
    label: '',
    tips:'外出省气，低温采暖，智能调温',
    describe: '80分钟',
    detail: '温度 60℃',
    selected: false,
    hasSwitch: false,
    val: 1,
    isLink: false
  },
}


export {
  Btns
};
