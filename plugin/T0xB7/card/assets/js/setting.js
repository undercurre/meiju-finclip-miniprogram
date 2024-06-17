
const setting = {
  default: {
    left: {
      name: '左灶', 
      key: 'left',
      btns: ['PowerBtn', 'OrderBtn'],
      hasFixedTemp: false,
      hasOneKeyCook: false,
    },
    right: {
      name: '右灶', 
      key: 'right',
      btns: ['PowerBtn'],
      hasFixedTemp: false, // 定温功能
      hasOneKeyCook: false, // 是否有一键烹饪功能
    }
  },
    // MKXQ5
  '66200005': {
    left: {
      name: '左灶', 
      key: 'left',
      btns: ['PowerBtn', 'OrderBtn', 'FixTempBtn'],
      hasFixedTemp: true,
      hasOneKeyCook: true,
    },
    right: {
      name: '右灶', 
      key: 'right',
      btns: ['PowerBtnAll'],
      hasFixedTemp: false, // 定温功能
      hasShutdownAll: true, // 是否可以远程所有炉头关火
      hasOneKeyCook: false,
    }
  },
  '6620TUST': {
    left: {
      name: '左灶', 
      key: 'left',
      btns: ['PowerBtn', 'OrderBtn', 'FixTempBtn'],
      hasFixedTemp: true,
      hasOneKeyCook: true,
    },
    middle: {
      name: '中灶',
      key: 'middle',
      btns: ['PowerBtn'],
      hasOneKeyCook: false,
    },
    right: {
      name: '右灶', 
      key: 'right',
      btns: ['PowerBtn'],
      hasFixedTemp: false, // 定温功能
      hasShutdownAll: false, // 是否可以远程所有炉头关火
      hasOneKeyCook: false,
    }
  },
  '0000XQ3S': {
    left: {
      name: '左灶', 
      key: 'left',
      btns: ['PowerBtn', 'OrderBtn', 'FixTempBtn'],
      hasFixedTemp: true,
      hasOneKeyCook: true,
    },
    right: {
      name: '右灶', 
      key: 'right',
      btns: ['PowerBtnAll'],
      hasFixedTemp: false, // 定温功能
      hasShutdownAll: true, // 是否可以远程所有炉头关火
      hasOneKeyCook: false,
    }
  },
  '6620X900': {
    left: {
      name: '左灶', 
      key: 'left',
      btns: ['PowerBtn', 'OrderBtn', 'FixTempBtn'],
      hasFixedTemp: true,
      hasOrderFixedTemp: true, // 是否有定时同时定温功能
      hasOneKeyCook: true,
    },
    right: {
      name: '右灶', 
      key: 'right',
      btns: ['PowerBtn', 'OrderBtn', 'FixTempBtn'],
      hasFixedTemp: true, // 定温功能
      hasOrderFixedTemp: true, // 是否有定时同时定温功能
      hasOneKeyCook: true,
    }
  },
  '662Q9088': {
    left: {
      name: '左灶', 
      key: 'left',
      btns: ['PowerBtn', 'OrderBtn'],
      hasFixedTemp: false,
      hasOneKeyCook: true,
      isTime: true
    },
  },
  '662T2105': {
    left: {
      name: '电磁炉',
      key: 'left',
      btns: ['PowerBtn', 'OrderBtn'],
      hasFixedTemp: false,
      hasOneKeyCook: false,
      isTime: true
    }
  }
}

const getSettingSn8 = function(sn8) {
  const mapper = {
    '0001XQ3S': '0000XQ3S',
    '6620052F': '6620TUST',
    '66200819': '6620X900',
    '6620022A': '662Q9088', // 气电灶
    '66200QT1': '662T2105',// JZDT-QT1
    '662T21W1': '662T2105',// JZDT-2ST21W1/JZDY-2ST21W1
    '662Q610P': '662T2105',// JZDT-Q610P
  }
  return mapper[sn8] || sn8
}

export default function (code) {
    const sn8Code = getSettingSn8(code);
    const settingFn = setting[sn8Code] || setting.default;
    return settingFn
}