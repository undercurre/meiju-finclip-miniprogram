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
cell 展示在cell中的功能
zeroWater 零冷水类功能
*/

/**
 * useType 区分卫浴功能还是采暖功能
 * warm采暖 barth卫浴
 */
const FuncType = {
  justSupportWarm: {
    name: "仅支持采暖",
    value: 0,
    metaType: FuncMetaType.Other,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "fixed"
  },
  feelTempWarm: {
    name: "感温供热",
    value: 2,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "cell",
    useType: "warm"
  },
  autoWaterTemp: {
    name: "自动水温",
    value: 3,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "cell",
    useType: "warm"
  },
  singleZeroWater: {
    name: "单次零冷水",
    value: 4,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "bottomTap",
    useType: "bottomTap"
  },
  dotZeroWater: {
    name: "点动零冷水",
    value: 5,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "zeroWater",
    useType: "zeroWater"
  },
  appointmentZeroWater: {
    name: "定时零冷水",
    value: 6,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "zeroWater",
    useType: "zeroWater"
  },
  smartTempFeel: {
    name: "智温感",
    value: 7,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "specialBarth",
    useType: "barth"
  },
  addPressure: {
    name: "增压",
    value: 9,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "specialBarth",
    useType: "barth"
  },
  smartAtHome: {
    name: "智能居家",
    value: 10,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "specialWarm",
    useType: "specialWarm"
  },
  smartSleep: {
    name: "智能睡眠",
    value: 11,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "specialWarm",
    useType: "specialWarm"
  },
  smartGoOut: {
    name: "智能外出",
    value: 12,
    metaType: FuncMetaType.HardDriver,
    protocolVersion: ProtocolVersion.standard,
    luaKey: "",
    btnType: "specialWarm",
    useType: "specialWarm"
  }


};

const FuncOrder = {
  home: {
    controlFunc: {
      warm: [
        FuncType.feelTempWarm, // 感温供热,
        FuncType.smartAtHome, // 智能居家
        FuncType.smartSleep, // 智能睡眠
        FuncType.smartGoOut, // 智能外出
      ],
      barth: [
        FuncType.singleZeroWater, // 单次零冷水
        FuncType.dotZeroWater, // 点动零冷水
        FuncType.appointmentZeroWater, // 定时零冷水
        FuncType.smartTempFeel, // 智温感
        FuncType.addPressure, // 增压
      ]
    },
    noneControlFunc: {
      warm: [],
      barth: []
    }
  },
  more: {
    controlFunc: {
      warm: [],
      barth: []
    },
    noneControlFunc: {
      warm: [],
      barth: []
    }
  }
};

export {
  FuncType,
  FuncOrder,
  FuncMetaType,
  ProtocolVersion
};
