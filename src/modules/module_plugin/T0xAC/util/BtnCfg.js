const app = getApp()
var baseImgApi = app.getGlobalConfig().baseImgApi;
var imageDoamin = (baseImgApi.url).split('/projects/')[0] + '/projects/sit/meiju-lite-assets/';

console.log(imageDoamin,'imageDoamin');
const Btns = {
  DeviceSwitch: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'ac-switch-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'ac-switch@2x.png'
    },
    normalText: "开关",
    unselectedText: "",
    hasSwitch: false,
    key: "DeviceSwitch",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  ModeWithNoAuto: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'auto-selected@3x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'auto-select-new@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-select-new@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-select-new@2x.png',
      smart_dry: imageDoamin + 'plugin/0xAC/' + 'dry-select-new@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-select-new.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan-select-new@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'auto-select-new@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'auto-select-new@2x.png',
    },
    offNormalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'auto-unselect-new@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'auto-unselect-new@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-unselect-new@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-unselect-new@2x.png',
      smart_dry: imageDoamin + 'plugin/0xAC/' + 'dry-unselect-new@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-unselect-new@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan-unselect-new@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'auto-unselect-new@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'auto-unselect-new@2x.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cold-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
    },
    normalText: '自动',
    normalTextMap: {
      'cool': "制冷",
      'heat': "制热",
      'dry': "抽湿",
      'auto': "自动",
      'fan': '送风'
    },
    unselectedText: "制冷",
    hasSwitch: false,
    key: "ModeControl",
    funcType: "button",
    explain: "",
    extraText1: "",
    widget_id: 'click_refrigeration',
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  ModeControl: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'auto-selected@3x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'auto-select-new@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-select-new@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-select-new@2x.png',
      smart_dry: imageDoamin + 'plugin/0xAC/' + 'dry-select-new@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-select-new.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan-select-new@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'auto-select-new@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'auto-select-new@2x.png',
    },
    offNormalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'auto-unselect-new@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'auto-unselect-new@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-unselect-new@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-unselect-new@2x.png',
      smart_dry: imageDoamin + 'plugin/0xAC/' + 'dry-unselect-new@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-unselect-new@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan-unselect-new@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'auto-unselect-new@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'auto-unselect-new@2x.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cold-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
    },
    normalText: '自动',
    normalTextMap: {
      'cool': "制冷",
      'heat': "制热",
      'dry': "抽湿",
      'auto': "自动",
      'fan': '送风'
    },
    unselectedText: "制冷",
    hasSwitch: false,
    key: "ModeControl",
    funcType: "button",
    explain: "",
    extraText1: "",
    widget_id: 'click_refrigeration',
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  RefrigerantCheck: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cold-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cold-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
    },
    normalText: "制冷",
    unselectedText: "制冷",
    hasSwitch: false,
    key: "RefrigerantCheck",
    funcType: "button",
    explain: "",
    extraText1: "",
    widget_id: 'click_refrigeration',
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  NewRefrigerantCheck: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cold-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-selected@2x.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cold-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-selected-dark@2x.png',
    },
    normalText: "制冷",
    unselectedText: "制冷",
    hasSwitch: false,
    key: "NewRefrigerantCheck",
    funcType: "button",
    explain: "",
    widget_id: 'click_refrigeration',
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  HotMode: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'heat-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'heat-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
    },
    normalText: "制热",
    unselectedText: "制热",
    hasSwitch: false,
    key: "HotMode",
    funcType: "button",
    explain: "",
    widget_id: 'click_heating',
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  NewHotMode: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'heat-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'heat-selected@2x.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'heat-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'heat-selected-dark@2x.png',
    },
    normalText: "制热",
    unselectedText: "制热",
    hasSwitch: false,
    key: "NewHotMode",
    funcType: "button",
    widget_id: 'click_heating',
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  DryMode: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dehum-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dehum-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png'
    },
    normalText: "抽湿",
    unselectedText: "抽湿",
    hasSwitch: false,
    key: "DryMode",
    funcType: "button",
    widget_id: 'click_dehumidification',
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  NewDryMode: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dehum-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dehum-selected@2x.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dehum-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dehum-selected-dark@2x.png'
    },
    normalText: "抽湿",
    unselectedText: "抽湿",
    hasSwitch: false,
    key: "NewDryMode",
    funcType: "button",
    widget_id: 'click_dehumidification',
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  UpDownSwipeWind: {
    angleItem:{
      "0": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      },
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      }
    },   
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fan-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
    },
    normalText: "扫风", // 上下风
    unselectedText: "上下风",
    hasSwitch: false,
    key: "UpDownSwipeWind",
    widget_id: 'click_upwind_and_downwind',
    funcType: "udSwipeDirect",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  UpDownSwipeWindPopup: {
    angleItem:{
      "0": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      },
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      }
    },   
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'ud-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'ud-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'ud-wind-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fan-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
    },
    normalText: "扫风", // 上下风
    unselectedText: "上下风",
    hasSwitch: false,
    key: "UpDownSwipeWindPopup",
    widget_id: 'click_upwind_and_downwind',
    funcType: "udSwipeDirect",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  LeftRightSwipeWind: {
    angleItem:{
      "0": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      },
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      }
    },
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fan-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
    },
    normalText: "扫风",
    unselectedText: "左右风",
    hasSwitch: false,
    key: "LeftRightSwipeWind",
    funcType: "lrSwipeDirect",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  LeftRightSwipeWindPopup: {
    angleItem:{
      "0": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      },
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      }
    },
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'lf-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'lf-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'lf-wind-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fan-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
    },
    normalText: "扫风",
    unselectedText: "左右风",
    hasSwitch: false,
    key: "LeftRightSwipeWindPopup",
    funcType: "lrSwipeDirect",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  CoolFreeECO:{
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'jienenghui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'jienengblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'jienengblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'jienengblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'jienengyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'jienengblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'jienengblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'jienengqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'eco-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
    },
    normalText: "ECO",
    unselectedText: "省电模式",
    hasSwitch: false,
    key: "CoolFreeECO",
    funcType: "button",
    explain: "通过判断室内外温度情况，自动控制运行频率，一晚八小时低至一度电（一级能效26机型）",
    extraText1: "",
    editable: false,
    widget_id: 'click_eco',
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  ECO: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'jienenghui2.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'jienengblue2.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'jienengblue2.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'jienengblue2.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'jienengyellow2.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'jienengblue2.png',
      default: imageDoamin + 'plugin/0xAC/' + 'jienengblue2.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'jienengqianhui2.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'eco-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'eco-selected-dark@2x.png',
    },
    normalText: "ECO",
    unselectedText: "省电模式",
    hasSwitch: false,
    key: "ECO",
    funcType: "button",
    explain: "通过判断室内外温度情况，自动控制运行频率，一晚八小时低至一度电（一级能效26机型）",
    extraText1: "",
    editable: false,
    widget_id: 'click_eco',
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  WindBlowing: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'zhicuihui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'zhicuiyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'zhicuiqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
    },
    normalText: "防直吹",
    unselectedText: "防直吹",
    hasSwitch: false,
    key: "WindBlowing",
    funcType: "button",
    explain: "导风板调整至避开人吹风的位置进行送风，防止直吹冷风带来的不适感",
    widget_id: 'click_anti_direct_blowing',
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  FaWindBlowing: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'zhicuihui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'zhicuiyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'zhicuiqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wind-blowing-selected-dark@2x.png',
    },
    normalText: "防直吹",
    unselectedText: "防直吹",
    hasSwitch: false,
    key: "FaWindBlowing",
    funcType: "button",
    explain: "导风板调整至避开人吹风的位置进行送风，防止直吹冷风带来的不适感",
    widget_id: 'click_anti_direct_blowing',
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  SelfCleaning: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wisCleanOpen.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wisCleanRef.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wisCleanRef.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wisCleanRef.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wisCleanHot.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wisCleanRef.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wisCleanRef.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wisCleanClose.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'cell-selfclean@2x.png',
    },
    normalText: "智清洁",
    unselectedText: "智清洁",
    hasSwitch: true,
    key: "SelfCleaning",
    funcType: "button",
    explain: "自动通过冷凝结霜、化霜、干燥清洁蒸发器上的灰尘+56度高温除菌",
    extraText1: "室内机高温除菌",
    editable: false,
    widget_id: 'click_intelligent_cleaning',
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  Quietness: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepopen.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleephot.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepopen.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepopen.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleephot.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepopen.png',
    },
    normalText: "静眠", // 省电功能
    unselectedText: "静眠", // 省电功能
    hasSwitch: false,
    key: "Quietness",
    widget_id: 'click_sleeping_mode',
    funcType: "button",
    widget_id: 'click_sleeping_mode',
    explain: "开启该功能，空调会自动调节运行温度和风速。静眠功能运行9小时后将自动退出。注：仅支持在“制冷”、“制热”模式下运行",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  DeviceSwitchAppointment: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'eco-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'eco-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png'
    },
    normalText: "定时",
    unselectedText: "定时",
    hasSwitch: false,
    key: "DeviceSwitchAppointment",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  "AppointmentSwitchOn": {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dingshihui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dingshiyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dingshiqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'eco-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'lr-wind-selected@2x.png'
    },
    normalText: "定时开",
    unselectedText: "定时开",
    hasSwitch: false,
    key: "AppointmentSwitchOn",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  "CoolFreeAppointmentSwitchOff":{
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dingshihui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dingshiyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dingshiqianhui.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'timer-off-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png'
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'cell-timer@2x.png',
    },    
    normalText: "预约关机",
    unselectedText: "预约关机",
    hasSwitch: true,
    key: "CoolFreeAppointmentSwitchOff",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  "AppointmentSwitchOff": {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dingshihui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dingshiyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dingshiqianhui.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'timer-off-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png'
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'cell-timer@2x.png',
    },
    normalText: "定时关机",
    unselectedText: "定时关机",
    hasSwitch: false,
    key: "AppointmentSwitchOff",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  ElectricHeat: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'furehui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fureblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fureblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fureblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fureyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fureblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fureblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fureqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'elec-heat-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'elec-heat-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'elec-heat-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'elec-heat-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'elec-heat-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'elec-heat-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'elec-heat-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'elec-heat-selected-dark@2x.png'
    },
    normalText: "电辅热",
    unselectedText: "电辅热",
    hasSwitch: false,
    widget_id: 'click_electric_auxiliary_heat',
    key: "ElectricHeat",
    funcType: "button",
    explain: "在制热或自动模式制热运行时，用户可以自主控制是否开启空调的电辅热",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  CSEco: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cseco-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cseco-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cseco-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cseco-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cseco-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cseco-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cseco-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cseco-off.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cseco-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cseco-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cseco-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cseco-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cseco-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cseco-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cseco-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cseco-off.png',
    },
    normalText: "舒省",
    unselectedText: "舒省",
    hasSwitch: false,
    widget_id: 'click_cseco',
    key: "CSEco",
    funcType: "button",
    explain: "频率风速自动调节为最节能省电的状态，并保持环境舒适",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  InitWifi: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'yuanchengOpen.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'yuanchengRef.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'yuanchengRef.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'yuanchengRef.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'yuanchengHot.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'yuanchengRef.png',
      default: imageDoamin + 'plugin/0xAC/' + 'yuanchengRef.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'yuanchengClose.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wifi-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wifi-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wifi-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wifi-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wifi-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wifi-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wifi-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wifi-selected-dark@2x.png'
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'cell-wifi@2x.png',
    },
    normalText: "远程控制",
    unselectedText: "远程控制",
    hasSwitch: false,
    key: "InitWifi",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    widget_id: 'click_remote_control',
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  // 以下功能一期不开放
  AutoMode: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'auto-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'auto-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'auto-selected@2x.png'
    },
    normalText: "自动",
    unselectedText: "自动",
    hasSwitch: false,
    key: "AutoMode",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  WindMode: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
    },
    normalText: "送风",
    unselectedText: "送风",
    hasSwitch: false,
    key: "WindMode",
    funcType: "button",
    explain: "",
    widget_id: 'click_fan',
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  NewWindMode: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wind-mode.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wind-mode-dark.png',
    },
    normalText: "送风",
    unselectedText: "送风",
    hasSwitch: false,
    key: "NewWindMode",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  UpDownWindAngle: {
    angleItem:{
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-1.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-1.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-1.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-heat-1.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-1.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-2.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-2.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-2.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-heat-2.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-2.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-3.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-3.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-3.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-heat-3.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-3.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-4.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-4.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-4.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-heat-4.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-4.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-5.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-5.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-5.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-heat-5.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-5.png',
      }
    },
    kitchenAngleItem:{
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect-kitchen.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-1.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-1.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-1.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-1.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-1.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-2.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-2.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-2.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-2.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-2.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-3.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-3.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-3.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-3.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-3.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-4.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-4.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-4.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-4.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-4.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-5.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-5.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-5.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-5.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-5.png',
      }
    },
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-angle-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-up-down-angle-unselected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-up-down-angle-unselected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-up-down-angle-unselected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-up-down-angle-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-up-down-angle-unselected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-up-down-angle-unselected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'off-up-down-angle.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fan-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
    },
    normalText: "定向", 
    unselectedText: "上下风定向",
    hasSwitch: false,
    key: "UpDownWindAngle",
    funcType: "udSwipeDirect",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  
  UpLeftRightDownLeftRightWindAngle: {
    angleItem:{
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-angle-unselected.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'heat-left-right-angle-selected.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        default: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'off-left-right-angle.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-angle-unselected.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'heat-left-right-angle-selected.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        default: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'off-left-right-angle.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-angle-unselected.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'heat-left-right-angle-selected.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        default: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'off-left-right-angle.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-angle-unselected.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'heat-left-right-angle-selected.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        default: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'off-left-right-angle.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-angle-unselected.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'heat-left-right-angle-selected.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        default: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'off-left-right-angle.png',
      }
    },
    normalImg: {      
      unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-angle-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-left-right-angle-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'off-left-right-angle.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fan-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
    },
    normalText: "定向",
    unselectedText: "左右风定向",
    hasSwitch: false,
    key: "UpLeftRightDownLeftRightWindAngle",
    funcType: "lrSwipeDirect",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  LeftRightWindAngle: {    
    angleItem:{
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-1.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-1.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-1.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-heat-1.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-1.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-2.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-2.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-2.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-heat-2.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-2.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-3.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-3.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-3.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-heat-3.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-3.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-4.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-4.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-4.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-heat-4.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-4.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-5.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-5.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-5.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-heat-5.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-5.png',
      }
    },
    normalImg: {      
      unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-angle-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-left-right-angle-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'off-left-right-angle.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fan-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
    },
    normalText: "定向",
    unselectedText: "左右风定向",
    hasSwitch: false,
    key: "LeftRightWindAngle",
    funcType: "lrSwipeDirect",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  UpDownUpLrDownLrWindAngle: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-angle-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-left-right-angle-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'off-left-right-angle.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fan-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
    },
    normalText: "出风方向",
    unselectedText: "出风方向",
    hasSwitch: false,
    key: "UpDownUpLrDownLrWindAngle",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  UpDownWindAngleLeftRight: {
    angleItem:{
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-1.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-1.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-1.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-heat-1.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-1.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-2.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-2.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-2.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-heat-2.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-2.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-3.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-3.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-3.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-heat-3.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-3.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-4.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-4.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-4.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-heat-4.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-4.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-5.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-5.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-5.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-heat-5.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-cool-5.png',
      }
    },
    kitchenAngleItem:{
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect-kitchen.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-1.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-1.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-1.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-1.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-1.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-2.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-2.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-2.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-2.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-2.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-3.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-3.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-3.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-3.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-3.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-4.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-4.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-4.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-4.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-4.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-5.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-5.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-5.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-5.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'kitchen-up-down-icon-cool-5.png',
      }
    },
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'up-down-angle-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-up-down-angle-unselected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-up-down-angle-unselected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-up-down-angle-unselected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-up-down-angle-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-up-down-angle-unselected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-up-down-angle-unselected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'off-up-down-angle.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fan-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
    },
    normalText: "上下出风方向",
    unselectedText: "上下出风方向",
    hasSwitch: false,
    key: "UpDownWindAngleLeftRight",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  LeftRightWindAngleLeftRight: {
    angleItem:{
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-1.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-1.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-1.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-heat-1.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-1.png',
      },
      "25": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-2.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-2.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-2.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-heat-2.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-2.png',
      },
      "50": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-3.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-3.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-3.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-heat-3.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-3.png',
      },
      "75": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-4.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-4.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-4.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-heat-4.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-4.png',
      },
      "100": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-unselect.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-5.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-5.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-5.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-heat-5.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'left-right-icon-cool-5.png',
      }
    },
    normalImg: {      
      unselected: imageDoamin + 'plugin/0xAC/' + 'left-right-angle-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-left-right-angle-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-left-right-angle-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'off-left-right-angle.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fan-off@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fan@2x.png',
    },
    normalText: "定向", // 左右出风方向
    unselectedText: "定向", // 左右出风方向
    hasSwitch: false,
    key: "LeftRightWindAngleLeftRight",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  CoolFreeDry: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dry-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dry-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dry-unselected-off.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dry-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dry-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dry-unselected-off.png',
    },
    normalText: "干燥",
    unselectedText: "干燥",
    hasSwitch: false,
    key: "CoolFreeDry",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  Dry: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dry-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dry-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dry-unselected-off.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dry-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dry-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dry-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dry-unselected-off.png',
    },
    normalText: "干燥",
    unselectedText: "干燥",
    hasSwitch: false,
    key: "Dry",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  Show: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'led-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'led-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'led-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'led-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
    },
    normalText: "屏显",
    unselectedText: "屏显",
    hasSwitch: false,
    widget_id: 'click_screen_display',
    key: "Show",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  Fragrance: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'show-unselecte@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'show-selecte@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'show-selecte@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'show-selecte@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'show-selecte@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'show-selecte@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'show-selecte@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'show-selecte@2x.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'show-unselecte-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'show-selecte-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'show-selecte-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'show-selecte-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'show-selecte-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'show-selecte-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'show-selecte-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'show-selecte-dark@2x.png',
    },
    normalText: "香氛",
    unselectedText: "香氛",
    hasSwitch: false,
    widget_id: 'click_fragrance',
    key: "Fragrance",
    funcType: "button",
    explain: "改善室内气味",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  Supercooling: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'super-cooling-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'super-cooling-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'super-cooling-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'super-cooling-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'super-cooling-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'super-cooling-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'super-cooling-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'super-cooling-unselect.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'super-cooling-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'super-cooling-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'super-cooling-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'super-cooling-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'super-cooling-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'super-cooling-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'super-cooling-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'super-cooling-unselect.png'
    },
    normalText: "智控温",
    unselectedText: "智控温",
    hasSwitch: false,
    key: "Supercooling",
    funcType: "button",
    widget_id: 'click_intelligent_temperature_control',
    explain: "设定稳定的自动控制，快速降温后自动回到人体最舒适温度，避免长时间过冷",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  Voice: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'voice-func-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'voice-func-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'voice-func-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'voice-func-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'voice-func-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'voice-func-unselect.png',
    },
    normalText: "语音",
    unselectedText: "语音",
    hasSwitch: false,
    key: "Voice",
    funcType: "button",
    widget_id: "click_voice_control",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  AboutDevice: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'about-devices-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-about-devices-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-about-devices-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-about-devices-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'heat-about-devices-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-about-devices-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-about-devices-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'about-devices-off.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'about_device_dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'about_device_dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'about_device_dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'about_device_dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'about_device_dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'about_device_dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'about_device_dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'about_device_dark@2x.png'
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'cell-more@2x.png',
    },
    normalText: "更多",
    unselectedText: "更多",
    hasSwitch: false,
    key: "AboutDevice",
    funcType: "button",
    explain: "",
    widget_id: 'click_about_this_machine',
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  Sound: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'voice-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'voice-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'voice-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'voice-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
    },
    normalText: "声音",
    unselectedText: "声音",
    hasSwitch: false,
    key: "Sound",
    funcType: "button",
    explain: "",
    extraText1: "",
    widget_id: 'click_sound',
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  Advice: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'advice-unselected@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'advice-selected@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'advice-selected@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'advice-selected@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'advice-selected@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'advice-selected@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'advice-selected@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'advice-selected@2x.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'advice-selected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'advice-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'advice-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'advice-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'advice-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'advice-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'advice-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'advice-selected-dark@2x.png',
    },
    normalText: "意见反馈",
    unselectedText: "意见反馈",
    hasSwitch: false,
    key: "Advice",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    widget_id: 'click_feedback',
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  OldPeopleMode: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'old-people@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'old-people@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'old-people@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'old-people@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'old-people@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'old-people@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'old-people@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'old-people@2x.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'old-people-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'old-people-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'old-people-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'old-people-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'old-people-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'old-people-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'old-people-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'old-people-dark@2x.png',
    },
    normalText: "关爱模式",
    unselectedText: "关爱模式",
    hasSwitch: false,
    key: "OldPeopleMode",
    widget_id: 'click_care_mode',
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  FreshAir: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselect@2x.png',
      unselected: {
        auto: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselect@2x.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselect@2x.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselect@2x.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselect-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselect@2x.png',
      },
      auto: imageDoamin + 'plugin/0xAC/' + 'fresh-air-cool@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fresh-air-cool@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fresh-air-cool@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fresh-air-heat@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fresh-air-cool@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fresh-air-cool@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fresh-air-cool@2x.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'fresh-air-unselected-dark@2x.png',
    },
    normalText: "新风",
    unselectedText: "新风",
    hasSwitch: false,
    key: "FreshAir",
    widget_id: 'click_fresh_air',
    funcType: "button",
    explain: "",
    extraText1: "低",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  SafeMode: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'psw-code-hui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'psw-code-blue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'psw-code-blue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'psw-code-blue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'psw-code-yellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'psw-code-blue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'psw-code-blue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'psw-code-qianhui.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'safe-mode-selected-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'safe-mode-selected-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'safe-mode-selected-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'safe-mode-selected-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'safe-mode-selected-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'safe-mode-selected-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'safe-mode-selected-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'safe-mode-selected-dark.png'
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'cell-lock@2x.png',
    },
    normalText: "蓝牙密码",
    unselectedText: "蓝牙密码",
    hasSwitch: false,
    key: "SafeMode",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  NoWindFeel: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wuganhui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wuganyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wuganqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "无风感",
    unselectedText: "无风感",
    hasSwitch: false,
    key: "NoWindFeel",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_no_wind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  FaNoWindFeel: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wuganhui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wuganyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wuganqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "无风感",
    unselectedText: "无风感",
    hasSwitch: false,
    key: "FaNoWindFeel",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_sleep_curve',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  F11NoWindFeel: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wuganhui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wuganyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wuganqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "无风感",
    unselectedText: "无风感",
    hasSwitch: false,
    key: "F11NoWindFeel",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_sleep_curve',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  SleepCurve: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepopen.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleephot.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepopen.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepopen.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleephot.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepref.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepopen.png',
    },
    normalText: "睡眠曲线",
    unselectedText: "睡眠曲线",
    hasSwitch: false,
    key: "SleepCurve",
    funcType: "button",
    explain: "按照人体睡眠温度变化规律设计，开启后温度自动调节，舒睡一整晚",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_sleep_curve',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  UpDownAroundWind: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'down-round-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'down-round-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'down-round-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'down-round-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-round-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'down-round-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'down-round-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'down-round-wind-off.png'
    },
    normalImgUp:{
      unselected: imageDoamin + 'plugin/0xAC/' + 'up-round-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'up-round-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'up-round-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'up-round-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'up-round-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'up-round-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'up-round-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'up-round-wind-off.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "环绕风", //  上下环绕风
    unselectedText: "环绕风",
    hasSwitch: false,
    key: "UpDownAroundWind",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    hasPopup: true,
    widget_id: 'click_ud_around_wind',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  UpDownWindBlowing:{
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'zhicuihui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'zhicuiyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'zhicuiqianhui.png',
    },
    normalImgUp:{
      unselected: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-disabled.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "上下防直吹", //  上下防直吹
    unselectedText: "上下防直吹",
    hasSwitch: false,
    key: "UpDownWindBlowing",
    funcType: "button",
    explain: "导风板调整至避开人吹风的位置进行送风，防止直吹冷风带来的不适感",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    hasPopup: true,
    offCan: false,
    widget_id: 'click_ud_wind_blowing',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  Degerming: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-unselect2.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-cool2.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-cool2.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-cool2.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-heat2.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-cool2.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-cool2.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-unselect2.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-unselect2.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-cool2.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-cool2.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-cool2.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-heat2.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-cool2.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-cool2.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sterilization-func-unselect2.png',
    },
    normalText: "除菌",
    unselectedText: "除菌",
    hasSwitch: false,
    key: "Degerming",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    widget_id: 'click_sterilization',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  UpNoWindFeel: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'up-nowind-unselect-deep.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'up-nowind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'up-nowind-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'up-nowind-unselect-deep.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'up-nowind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'up-nowind-unselect.png',
    },
    normalText: "上无风感",
    unselectedText: "上无风感",
    hasSwitch: false,
    key: "UpNoWindFeel",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_up_nowind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  ThUpNoWindFeel: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'up-nowind-unselect-deep.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'up-nowind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'up-nowind-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'up-nowind-unselect-deep.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'up-nowind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'up-nowind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'up-nowind-unselect.png',
    },
    normalText: "上无风感",
    unselectedText: "上无风感",
    hasSwitch: false,
    key: "ThUpNoWindFeel",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_up_nowind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  DownNoWindFeel: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'down-nowind-unselect-deep.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-nowind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'down-nowind-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'down-nowind-unselect-deep.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-nowind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'down-nowind-unselect.png',
    },
    normalText: "下无风感",
    unselectedText: "下无风感",
    hasSwitch: false,
    key: "DownNoWindFeel",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_down_nowind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  ThDownNoWindFeel: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'down-nowind-unselect-deep.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-nowind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'down-nowind-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'down-nowind-unselect-deep.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-nowind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'down-nowind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'down-nowind-unselect.png',
    },
    normalText: "下无风感",
    unselectedText: "下无风感",
    hasSwitch: false,
    key: "ThDownNoWindFeel",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_down_nowind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  UpSwipeWind: {
    angleItem: {
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-unselected.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-unselected.png',
      },
    },
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-unselected.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'up-swipe-wind-unselected.png',
    },
    normalText: "上左右",
    unselectedText: "上左右风",
    hasSwitch: false,
    key: "UpSwipeWind",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_up_swipe_wind',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  DownSwipeWind: {
    angleItem: {
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
      },
    },
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
    },
    normalText: "下左右",
    unselectedText: "下左右",
    hasSwitch: false,
    key: "DownSwipeWind",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_down_swipe_wind',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  DownSwipeWind00Ae: {
    angleItem: {
      "1": {
        unselected: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
        auto: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
        cool: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
        dry: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
        heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
        fan: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
        default: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
        disabled: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
      },
    },
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-unselected.png',
    },
    normalText: "下左右",
    unselectedText: "下左右风",
    hasSwitch: false,
    key: "DownSwipeWind00Ae",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_down_swipe_wind',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  PowerManager: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'elec-btn-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'elec-btn-disabled.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'elec-btn-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'elec-btn-disabled.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'elec-cell@2x.png',
    },
    normalText: "电量统计",
    unselectedText: "电量统计",
    hasSwitch: false,
    key: "PowerManager",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    widget_id: 'click_power_manager',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  AutomaticAntiColdAir: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-disabled.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'smart-prevent-wind-disabled.png',
    },
    normalText: "主动防冷风",
    unselectedText: "主动防冷风",
    hasSwitch: false,
    key: "AutomaticAntiColdAir",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_power_manager',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  softWindFeel: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'soft-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'soft-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'soft-wind-disabled.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'soft-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'soft-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'soft-wind-disabled.png',
    },
    normalText: "柔风感",
    unselectedText: "柔风感",
    hasSwitch: false,
    key: "softWindFeel",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_power_manager',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  ThSoftWindFeel: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'soft-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'soft-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'soft-wind-disabled.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'soft-wind-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'soft-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'soft-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'soft-wind-disabled.png',
    },
    normalText: "柔风感",
    unselectedText: "柔风感",
    hasSwitch: false,
    key: "ThSoftWindFeel",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_power_manager',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  CoolPowerSaving: {
    normalImg: {      
      unselected: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-disabled.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-disabled.png',
    },
    normalText: "酷省电",
    unselectedText: "酷省电",
    hasSwitch: false,
    key: "CoolPowerSaving",
    funcType: "button",
    explain: "全天候长效节能，舒适又省电（可在制冷模式下开启）",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_cool_power_saving',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  CoolPowerSavingNewName: {
    normalImg: {      
      unselected: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-disabled.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-disabled.png',
    },
    normalText: "省电",
    unselectedText: "省电",
    hasSwitch: false,
    key: "CoolPowerSavingNewName",
    funcType: "button",
    explain: "全天候长效节能，舒适又省电（可在制冷模式下开启）",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_cool_power_saving',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  AroundWind: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'round-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'round-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'round-wind-off.png'
    },
    normalImgUp:{
      unselected: imageDoamin + 'plugin/0xAC/' + 'round-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'round-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'round-wind-off.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "环绕风", //  环游风 0x0067
    unselectedText: "环绕风",
    hasSwitch: false,
    key: "AroundWind",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_around_wind',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  WaterFallWind: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'round-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'round-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'round-wind-off.png'
    },
    normalImgUp:{
      unselected: imageDoamin + 'plugin/0xAC/' + 'round-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'round-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'round-wind-off.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "巨瀑风", //  巨瀑风 0x0067
    unselectedText: "巨瀑风",
    hasSwitch: false,
    key: "WaterFallWind",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_around_wind',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  QuickCoolHeat: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'waterfall-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'waterfall-select.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'waterfall-select.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'waterfall-select.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'waterfall-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'waterfall-select.png',
      default: imageDoamin + 'plugin/0xAC/' + 'waterfall-select.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'waterfall-select.png'
    },
    normalImgUp:{
      unselected: imageDoamin + 'plugin/0xAC/' + 'round-wind-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'round-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'round-wind-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'round-wind-off.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "速冷热", //  跟巨瀑风一样，改名字改图标 0x0067
    unselectedText: "速冷热",
    hasSwitch: false,
    key: "QuickCoolHeat",
    funcType: "button",
    explain: "基于速冷热控制技术，调节冷媒流量，同时对压缩机进行高效调频，提升风轮转速，实现全屋的快速调温。注：仅支持在“制冷”、“制热”模式下运行",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_around_wind',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  DryNewName: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dry-new-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dry-new-heat-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dry-new-disabled.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dry-new-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dry-new-heat-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dry-new-disabled.png',
    },
    // normalImg: {
    //   unselected: imageDoamin + 'plugin/0xAC/' + 'dry-unselected.png',
    //   auto: imageDoamin + 'plugin/0xAC/' + 'dry-cool-selected.png',
    //   cool: imageDoamin + 'plugin/0xAC/' + 'dry-cool-selected.png',
    //   dry: imageDoamin + 'plugin/0xAC/' + 'dry-cool-selected.png',
    //   heat: imageDoamin + 'plugin/0xAC/' + 'dry-heat-selected.png',
    //   fan: imageDoamin + 'plugin/0xAC/' + 'dry-cool-selected.png',
    //   default: imageDoamin + 'plugin/0xAC/' + 'dry-cool-selected.png',
    //   disabled: imageDoamin + 'plugin/0xAC/' + 'dry-disabled.png',
    // },
    // normalImgDark: {
    //   unselected: imageDoamin + 'plugin/0xAC/' + 'dry-unselected.png',
    //   auto: imageDoamin + 'plugin/0xAC/' + 'dry-cool-selected.png',
    //   cool: imageDoamin + 'plugin/0xAC/' + 'dry-cool-selected.png',
    //   dry: imageDoamin + 'plugin/0xAC/' + 'dry-cool-selected.png',
    //   heat: imageDoamin + 'plugin/0xAC/' + 'dry-heat-selected.png',
    //   fan: imageDoamin + 'plugin/0xAC/' + 'dry-cool-selected.png',
    //   default: imageDoamin + 'plugin/0xAC/' + 'dry-cool-selected.png',
    //   disabled: imageDoamin + 'plugin/0xAC/' + 'dry-disabled.png',
    // },
    normalText: "内机防霉",
    unselectedText: "内机防霉",
    hasSwitch: false,
    key: "DryNewName",
    funcType: "button",
    explain: "内机防霉(干燥)仅在“制冷”、“抽湿”模式下开启和运行/内机防霉功能可吹出内部的湿冷空气，以防霉菌滋生。开启后，将在每次空调关机后运行，约十分钟完成并自动关机。",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    offDisabled: true, // 关机可开，且图标置灰
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  DryNewNameKitchen: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dry-new-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dry-new-heat-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dry-new-disabled.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dry-new-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dry-new-heat-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dry-new-cool-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dry-new-disabled.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'dry-kitchen@2x.png',
    },
    normalText: "内机防霉",
    unselectedText: "内机防霉",
    hasSwitch: true,
    key: "DryNewNameKitchen",
    funcType: "button",
    explain: "内机防霉仅在“制冷”、“抽湿”模式下开启和运行/内机防霉功能可吹出内部的湿冷空气，以防霉菌滋生。开启后，将在每次空调关机后运行，约十分钟完成并自动关机。",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    offDisabled: true, // 关机可开，且图标置灰
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  FilterClean: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'filter-clean-unselected.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'filter-kitchen@2x.png',
    },
    normalText: "滤网清洗和复位",
    unselectedText: "滤网清洗和复位",
    hasSwitch: false,
    key: "FilterClean",
    funcType: "cell",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  THShow: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'led-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'led-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'led-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'led-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'led-selected.png',
    },
    normalText: "屏显",
    unselectedText: "屏显",
    hasSwitch: false,
    widget_id: 'click_screen_display',
    key: "THShow",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    },
  },
  ThNowindFeel: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wuganhui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wuganyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wuganqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "无风感",
    unselectedText: "无风感",
    hasSwitch: false,
    key: "ThNowindFeel",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_no_wind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  ThNowindFeelLeft: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wuganhui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wuganyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wuganqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "左无风感",
    unselectedText: "左无风感",
    hasSwitch: false,
    key: "ThNowindFeelLeft",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_no_wind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  ThNowindFeelRight: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wuganhui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wuganyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wuganqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "右无风感",
    unselectedText: "右无风感",
    hasSwitch: false,
    key: "ThNowindFeelRight",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_no_wind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  QuickFry: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wuganhui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wuganyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wuganqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "爆炒",
    unselectedText: "爆炒",
    hasSwitch: false,
    key: "QuickFry",
    funcType: "kitchen",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_no_wind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  PrepareFood: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wuganhui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wuganyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wuganblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wuganqianhui.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "备菜",
    unselectedText: "备菜",
    hasSwitch: false,
    key: "PrepareFood",
    funcType: "kitchen",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_no_wind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  CleanFunc: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cleanFunc-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cleanFunc-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cleanFunc-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cleanFunc-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cleanFunc-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cleanFunc-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cleanFunc-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cleanFunc-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "净化",
    unselectedText: "净化",
    hasSwitch: false,
    key: "CleanFunc",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    widget_id: 'click_no_wind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  BackWarmRemoveWet: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'BackWarmRemoveWet-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'BackWarmRemoveWet-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'BackWarmRemoveWet-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'BackWarmRemoveWet-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'BackWarmRemoveWet-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'BackWarmRemoveWet-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'BackWarmRemoveWet-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'BackWarmRemoveWet-cool.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "回温除湿",
    unselectedText: "回温除湿",
    hasSwitch: false,
    key: "BackWarmRemoveWet",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_no_wind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  KeepWet: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'KeepWet-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'KeepWet-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'KeepWet-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'KeepWet-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'KeepWet-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'KeepWet-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'KeepWet-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'KeepWet-unselect.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "保湿",
    unselectedText: "保湿",
    hasSwitch: false,
    key: "KeepWet",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_no_wind_feel',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  TargetIndoorTemp: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'elec-btn-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'north-warm-target-temp.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'elec-btn-disabled.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'elec-btn-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'elec-btn-disabled.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/jiazhong/' + 'north-warm-target-temp-cell.png',
    },
    normalText: "目标室温",
    unselectedText: "目标室温",
    hasSwitch: true,
    key: "TargetIndoorTemp",
    funcType: "button",
    explain: "设置目标室温后，机组根据室内或室外环境温度变化自动调节水温稳定运行。",
    extraText1: "--℃ | 设置参数 > ",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    showSetImg: true,
    selected: false,
    offCan: false,
    showQuestionMark: true,
    widget_id: 'click_power_manager',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  Holiday: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'elec-btn-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'elec-btn-disabled.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'elec-btn-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'down-swipe-wind-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'elec-btn-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'elec-btn-disabled.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/jiazhong/' + 'north-warm-holiday-cell.png',
    },
    normalText: "度假",
    unselectedText: "度假",
    hasSwitch: false,
    key: "Holiday",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    widget_id: 'click_power_manager',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  NorthWarmAuto: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
      cool: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
      dry: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
      heat: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-select-heat.png',
      fan: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',      
      default: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
      disabled: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
      smart_mode:imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',      
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
      cool: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
      dry: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
      heat: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-select-heat.png',
      fan: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
      default: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
      disabled: imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',      
      smart_mode:imageDoamin + 'plugin/0xAC/jiazhong/' + 'auto-temp-select.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/jiazhong/' + 'north-warm-auto-temp-cell.png',
    },
    normalText: "自动水温",
    unselectedText: "自动水温",
    hasSwitch: true,
    key: "NorthWarmAuto",
    funcType: "button",
    explain: "根据环境温度，自动调节水温",
    extraText1: "根据环境温度，自动调整水温",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_power_manager',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  NorthWarmGoOut: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      cool: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      dry: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      heat: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select-heat.png',
      fan: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      default: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      disabled: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      smart_mode: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      cool: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      dry: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      heat: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select-heat.png',
      fan: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      default: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      disabled: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
      smart_mode: imageDoamin + 'plugin/0xAC/jiazhong/' + 'out-select.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/jiazhong/' + 'north-warm-out-cell.png',
    },
    normalText: "外出",
    unselectedText: "外出",
    hasSwitch: true,
    key: "NorthWarmGoOut",
    funcType: "button",
    explain: "当天上班/逛街外出，保温省电",
    extraText1: "当天上班/逛街外出，保温省电",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_power_manager',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  NorthWarmQuiet: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      cool: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      dry: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      heat: imageDoamin + 'plugin/0xAC/jiazhong/' + 'slience-select-heat.png',
      fan: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      default: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      disabled: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      smart_mode: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      cool: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      dry: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      heat: imageDoamin + 'plugin/0xAC/jiazhong/' + 'slience-select-heat.png',
      fan: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      default: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      disabled: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
      smart_mode: imageDoamin + 'plugin/0xAC/jiazhong/' + 'silence-select.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/jiazhong/' + 'north-warm-quiet-cell.png',
    },
    normalText: "静音",
    unselectedText: "静音",
    hasSwitch: true,
    key: "NorthWarmQuiet",
    funcType: "button",
    explain: "机组进入低音运转，降低噪音",
    extraText1: "机组进入低音运转，降低噪音",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: false,
    widget_id: 'click_power_manager',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  NorthWarmSaveEnergy: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      cool: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      dry: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      heat: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select-heat.png',
      fan: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      default: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      disabled: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      smart_mode: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      cool: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      dry: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      heat: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select-heat.png',
      fan: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      default: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      disabled: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
      smart_mode: imageDoamin + 'plugin/0xAC/jiazhong/' + 'eco-select.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/jiazhong/' + 'north-warm-saveEnergy-cell.png',
    },
    normalText: "节能",
    unselectedText: "节能",
    hasSwitch: true,
    key: "NorthWarmSaveEnergy",
    funcType: "button",
    explain: "高效调节热量输出，舒适节能",
    extraText1: "高效调节热量输出，舒适节能",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: false,
    selected: false,
    offCan: false,
    widget_id: 'click_power_manager',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  "NorthWarmAppointment": {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'dingshihui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'dingshiyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'dingshiblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'dingshiqianhui.png',      
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'timer-off-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'timer-on-dark@2x.png'
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'cell-timer@2x.png',
    },
    normalText: "定时",
    unselectedText: "定时",
    hasSwitch: false,
    key: "NorthWarmAppointment",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  NorthWarmMode: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'wisCleanOpen.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'wisCleanRef.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'wisCleanRef.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'wisCleanRef.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'wisCleanHot.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'wisCleanRef.png',
      default: imageDoamin + 'plugin/0xAC/' + 'wisCleanRef.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'wisCleanClose.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-unselected-dark@2x.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      default: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'self-cleaning-selected-dark@2x.png',
    },
    cellImg: {
      img: imageDoamin + 'plugin/0xAC/' + 'cell-selfclean@2x.png',
    },
    normalText: "模式",
    unselectedText: "模式",
    hasSwitch: false,
    key: "NorthWarmMode",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    widget_id: '',
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  ThLight: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'thlight-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'thlight-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'thlight-unselect.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'thlight-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'thlight-cool.png',
    },
    normalText: "灯光",
    unselectedText: "灯光",
    hasSwitch: false,
    widget_id: 'click_screen_light',
    key: "ThLight",
    funcType: "button",
    explain: "",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {
      console.log('switch state' + state);
    },
    func: (state) => {
      console.log('switch state' + state);
    }
  },
  UpWindBlowing:{
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'zhicuihui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'zhicuiyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'zhicuiqianhui.png',
    },
    normalImgUp:{
      unselected: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-disabled.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "上防直吹", //  上下防直吹
    unselectedText: "上防直吹",
    hasSwitch: false,
    key: "UpWindBlowing",
    funcType: "button",
    explain: "调整吹风方向和出风速度，凉风吸顶向上吹，气流远处沉降",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    hasPopup: true,
    offCan: false,
    widget_id: 'click_ud_wind_blowing',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  DownWindBlowing:{
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'zhicuihui.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'zhicuiyellow.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      default: imageDoamin + 'plugin/0xAC/' + 'zhicuiblue.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'zhicuiqianhui.png',
    },
    normalImgUp:{
      unselected: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'upWindBlowing-disabled.png'
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      default: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'sleepcurve-dark.png'
    },
    normalText: "下防直吹", //  下防直吹
    unselectedText: "下防直吹",
    hasSwitch: false,
    key: "DownWindBlowing",
    funcType: "button",
    explain: "调整吹风方向和出风速度，凉风贴壁向下吹，气流垂直下滑至地面",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    hasPopup: false,
    offCan: false,
    widget_id: 'click_ud_wind_blowing',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  LoopFan: {
    normalImg: {      
      unselected: imageDoamin + 'plugin/0xAC/' + 'circle-fan-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'circle-fan-cool-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'circle-fan-cool-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'circle-fan-cool-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'circle-fan-heat-selected.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'circle-fan-cool-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'circle-fan-cool-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'circle-fan-unselected.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-unselected.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      default: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-cool.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'cool-power-saving-disabled.png',
    },
    normalText: "调温循环扇",
    unselectedText: "调温循环扇",
    hasSwitch: false,
    key: "LoopFan",
    funcType: "button",
    explain: "加快室内空气流动，提供不同凉感选择可自由调节五个档位，实现不同的吹风温度。1档（循环扇）为常温出风，无额外制冷；2-5档为不同凉爽程度的吹风温度，适应不同的天气需求。注：档位仅代表吹风凉感强弱；风速大小及方向仍可独立调节",
    extraText1: "",
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    widget_id: '',
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
  NewSound: {
    normalImg: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'voice-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'voice-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
    },
    normalImgDark: {
      unselected: imageDoamin + 'plugin/0xAC/' + 'voice-unselected-on.png',
      auto: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      cool: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      dry: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      heat: imageDoamin + 'plugin/0xAC/' + 'voice-selected-heat.png',
      fan: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      default: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
      disabled: imageDoamin + 'plugin/0xAC/' + 'voice-selected.png',
    },
    normalText: "声音",
    unselectedText: "声音",
    hasSwitch: false,
    key: "NewSound",
    funcType: "button",
    explain: "",
    extraText1: "",
    widget_id: 'click_sound',
    editable: false,
    hasSet: false, // 包含设置的指引和文案
    show: true,
    selected: false,
    offCan: true,
    switchFunc: (state) => {

    },
    func: (state) => {

    }
  },
}


export {
  Btns
};