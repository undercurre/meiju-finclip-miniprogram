/*
目前所有机型必不可少的功能只有
1.开关机
2.开始、停止
3.暂停、继续
4.预约、取消预约

以下为可选功能
1.模式 及模式中的一种或多种
2.软水档位
3.开门提示
4.亮碟剂档位1-5
5.保管功能（通风换气消毒）
6.diy功能
*/
import imgs from './img.js'
export const stageStep = {
  1: '预洗',
  2: '主洗',
  3: '漂洗',
  4: '干燥',
}
export const modes = {
  // 自动洗/智能洗
  // auto_wash: {
  //     index: 0,
  //     desc: '智能洗',
  //     text: "智能分析，自动选择，最佳的清洗方式",
  //     imgList: {
  //         type_off: imgs.auto_wash_off,
  //         type_on: imgs.auto_wash_on,
  //         off: imgs.auto_wash_sub_off,
  //         on: imgs.auto_wash_sub_on
  //     },
  //     mode: 'off',
  // },
  // // 强力洗
  // strong_wash: {
  //     index: 1,
  //     desc: '强力洗',
  //     text: "重油污餐具清洗",
  //     imgList: {
  //         type_off: imgs.strong_wash_off,
  //         type_on: imgs.strong_wash_on,
  //         off: imgs.strong_wash_sub_off,
  //         on: imgs.strong_wash_sub_on
  //     },
  //     mode: 'off',
  // },
  // // "及时洗/标准洗（W2601C-餐具洗）"
  // standard_wash: {
  //     index: 2,
  //     desc: '标准洗',
  //     // desc: '即时洗',
  //     text: "日常饭后及时清洗",
  //     imgList: {
  //         type_off: imgs.standard_wash_off,
  //         type_on: imgs.standard_wash_on,
  //         off: imgs.standard_wash_sub_off,
  //         on: imgs.standard_wash_sub_on
  //     },
  //     mode: 'off',
  // },
  // 节能洗/经济洗
  eco_wash: {
    index: 3,
    // 节能洗有附加条件，这里暂时不做
    desc: '节能洗',
    text: '更充分的浸泡，省水省电',
    imgList: {
      type_off: imgs.eco_wash_off,
      type_on: imgs.eco_wash_on,
      off: imgs.eco_wash_sub_off,
      on: imgs.eco_wash_sub_on,
    },
    mode: 'on',
  },
  // "玻璃洗（W2601C-奶瓶洗）"
  // glass_wash: {
  //     index: 4,
  //     desc: '玻璃洗',
  //     text: "精致玻璃器皿专用",
  //     imgList: {
  //         type_off: imgs.glass_wash_off,
  //         type_on: imgs.glass_wash_on,
  //         off: imgs.glass_wash_sub_off,
  //         on: imgs.glass_wash_sub_on
  //     },
  //     mode: 'off',
  // },
  // // 快速洗
  // fast_wash: {
  //     index: 5,
  //     desc: '超快洗',
  //     text: "清污餐具，短时间洗涤",
  //     imgList: {
  //         type_off: imgs.fast_wash_off,
  //         type_on: imgs.fast_wash_on,
  //         off: imgs.fast_wash_sub_off,
  //         on: imgs.fast_wash_sub_on
  //     },
  //     mode: 'off',
  // },
  // // 预冲洗
  // soak_wash: {
  //     index: 6,
  //     desc: '预冲洗',
  //     imgList: {
  //         type_off: imgs.soak_wash_off,
  //         type_on: imgs.soak_wash_on,
  //         off: imgs.soak_wash_sub_off,
  //         on: imgs.soak_wash_sub_on
  //     },
  //     mode: 'off',
  // },
  // // 90分钟洗
  // '90min_wash': {
  //     index: 7,
  //     desc: '90min洗',
  //     imgList: {
  //         type_off: imgs['90min_wash_off'],
  //         type_on: imgs['90min_wash_on'],
  //         off: imgs['90min_wash_sub_off'],
  //         on: imgs['90min_wash_sub_on']
  //     },
  //     mode: 'off',
  // },
  // // 自清洁
  // self_clean: {
  //     index: 8,
  //     desc: '自清洁',
  //     imgList: {
  //         type_off: imgs.self_clean_off,
  //         type_on: imgs.self_clean_on,
  //         off: imgs.self_clean_sub_off,
  //         on: imgs.self_clean_sub_on
  //     },
  //     mode: 'off',
  // },
  // // 水果洗
  // fruit_wash: {
  //     index: 9,
  //     desc: '水果洗',
  //     imgList: {
  //         type_off: imgs.fruit_wash_off,
  //         type_on: imgs.fruit_wash_on,
  //         off: imgs.fruit_wash_sub_off,
  //         on: imgs.fruit_wash_sub_on
  //     },
  //     mode: 'off',
  // },
  // // 自定义洗
  // self_define: {
  //     notSupport: true,
  //     index: 99,
  //     desc: '自定义洗',
  //     imgList: {}
  // },
  // // 少量洗
  // lite_wash: {
  //     notSupport: true,
  //     index: 98,
  //     desc: '少量洗',
  //     imgList: {}
  // },
  // // 静音洗
  // quietnight_wash: {
  //   index: 10,
  //   desc: '静音洗',
  //   imgList: {
  //     type_off: imgs.quietnight_off,
  //     type_on: imgs.quietnight_on,
  //     off: imgs.quietnight_sub_off,
  //     on: imgs.quietnight_sub_on,
  //   },
  //   mode: 'off',
  // },
  // // 火锅洗
  // hotpot_wash: {
  //   index: 11,
  //   desc: '火锅洗',
  //   imgList: {
  //     type_off: imgs.hotpot_off,
  //     type_on: imgs.hotpot_on,
  //     off: imgs.hotpot_sub_off,
  //     on: imgs.hotpot_sub_on,
  //   },
  //   mode: 'off',
  // },
  // // 除菌洗
  // germ: {
  //   index: 12,
  //   desc: '除菌洗',
  //   imgList: {
  //     type_off: imgs.germ_off,
  //     type_on: imgs.germ_on,
  //     off: imgs.germ_sub_off,
  //     on: imgs.germ_sub_on,
  //   },
  //   mode: 'off',
  // },
  // // 紫外除菌、UV除菌
  // kill_germ_wash: {
  //   index: 13,
  //   desc: '紫外除菌',
  //   imgList: {
  //     type_off: imgs.killgerm_off,
  //     type_on: imgs.killgerm_on,
  //     off: imgs.killgerm_sub_off,
  //     on: imgs.killgerm_sub_on,
  //   },
  //   mode: 'off',
  // },
  // // 海鲜洗
  // seafood_wash: {
  //   index: 14,
  //   desc: '海鲜洗',
  //   imgList: {
  //     type_off: imgs.seafood_off,
  //     type_on: imgs.seafood_on,
  //     off: imgs.seafood_sub_off,
  //     on: imgs.seafood_sub_on,
  //   },
  //   mode: 'off',
  // },
  // // 玩具洗
  // toy_wash: {
  //   index: 15,
  //   desc: '玩具洗',
  //   imgList: {
  //     type_off: imgs.toyWash_off,
  //     type_on: imgs.toyWash_on,
  //     off: imgs.toyWash_sub_off,
  //     on: imgs.toyWash_sub_on,
  //   },
  //   mode: 'off',
  // },
  // // 油网洗
  // oilnet_wash: {
  //   index: 16,
  //   desc: '油网洗',
  //   imgList: {
  //     type_off: imgs.oilnet_off,
  //     type_on: imgs.oilnet_on,
  //     off: imgs.oilnet_sub_off,
  //     on: imgs.oilnet_sub_on,
  //   },
  //   mode: 'off',
  // }
}

const setting = {
  default: {
    times: ['--'],
    modes: ['auto_wash'],
  },
  76000001: {
    times: ['--', 190, 165, 100, 29, 110],
    modes: ['auto_wash', 'eco_wash', 'strong_wash', 'glass_wash', 'fast_wash', 'self_clean'],
  },
  76000003: {
    times: ['--', 125, 220, 98, 29, 15, 135, 80],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'standard_wash', 'fast_wash', 'soak_wash', 'germ', 'self_clean'],
  },
  76000015: {
    times: [120, 90, 190, 29, 105, 15],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'germ', 'soak_wash'],
  },
  76000016: {
    times: [160, 150, 95, 29, 10, 59],
    modes: ['strong_wash', 'eco_wash', 'standard_wash', 'fast_wash', 'fruit_wash', 'glass_wash'],
  },
  76000018: {
    times: [110, 80, 140, 29, 12, 60, 16],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'fruit_wash', 'self_clean', 'seafood_wash'],
  },
  76000593: {
    times: ['--', 215, 160, 29, 130, 135, 15, 105, 10, 150, 15, 190, 285, 170],
    modes: [
      'auto_wash',
      'eco_wash',
      'strong_wash',
      'fast_wash',
      'glass_wash',
      'self_clean',
      'soak_wash',
      'standard_wash',
      'fruit_wash',
      'germ',
      'seafood_wash',
      'hotpot_wash',
      'quietnight_wash',
      'oilnet_wash',
    ],
  },
  76000612: {
    times: ['--', 215, 150, 29, 100, 125, 15, 59, 10, 100, 15, 147, 270, 130],
    modes: [
      'auto_wash',
      'eco_wash',
      'strong_wash',
      'fast_wash',
      'glass_wash',
      'self_clean',
      'soak_wash',
      'standard_wash',
      'fruit_wash',
      'germ',
      'seafood_wash',
      'hotpot_wash',
      'quietnight_wash',
      'oilnet_wash',
    ],
  },
  76000621: {
    times: ['--', 220, 160, 29, 135, 15, 130, 105, 10, 15, 190],
    modes: [
      'auto_wash',
      'eco_wash',
      'strong_wash',
      'fast_wash',
      'self_clean',
      'soak_wash',
      'glass_wash',
      'standard_wash',
      'fruit_wash',
      'seafood_wash',
      'hotpot_wash',
    ],
  },
  76000622: {
    times: [165, 190, 29, 7, 100, 60, 15, 110, 130],
    modes: [
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'fruit_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
      'germ',
    ],
  },
  76000623: {
    times: ['--', 180, 220, 115, 24, 15, 190, 8, 15, 135, 150, 180],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'standard_wash',
      'fast_wash',
      'soak_wash',
      'germ',
      'fruit_wash',
      'seafood_wash',
      'self_clean',
      'glass_wash',
      'hotpot_wash',
    ],
  },
  76000624: {
    times: ['--', 215, 105, 20, 160, 135, 15, 130, 10, 15, 190, 285],
    modes: [
      'auto_wash',
      'eco_wash',
      'standard_wash',
      'fast_wash',
      'strong_wash',
      'self_clean',
      'soak_wash',
      'glass_wash',
      'fruit_wash',
      'seafood_wash',
      'hotpot_wash',
      'quietnight_wash',
    ],
  },
  76000627: {
    times: [110, 90, 155, 10, 29, 70, 60, 12],
    modes: [
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'fruit_wash',
      'fast_wash',
      'self_clean',
      'glass_wash',
      'seafood_wash',
    ],
  },
  76000628: {
    times: ['--', 125, 220, 98, 80, 15, 72, 29, 135],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'standard_wash',
      'self_clean',
      'soak_wash',
      'glass_wash',
      'fast_wash',
      'germ',
    ],
  },
  76000629: {
    times: ['--', 215, 150, 29, 100, 125, 15, 59, 10, 100, 15, 147, 270, 130],
    modes: [
      'auto_wash',
      'eco_wash',
      'strong_wash',
      'fast_wash',
      'glass_wash',
      'self_clean',
      'soak_wash',
      'standard_wash',
      'fruit_wash',
      'germ',
      'seafood_wash',
      'hotpot_wash',
      'quietnight_wash',
      'oilnet_wash',
    ],
  },
  '000000E6': {
    times: ['--', 110, 178, 29, 56, 12],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'fast_wash', 'glass_wash', 'soak_wash'],
  },
  '000000E8': {
    times: ['--', 155, 175, 29, 65, 105, 90, 80, 15],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'glass_wash',
      'standard_wash',
      '90min_wash',
      'self_clean',
      'soak_wash',
    ],
  },
  '000000F1': {
    times: [86, 29, 110, 22],
    modes: ['strong_wash', 'fast_wash', 'eco_wash', 'fruit_wash'],
  },
  '000000F4': {
    times: [29, 90, 155, 65, 26],
    modes: ['fast_wash', 'strong_wash', 'eco_wash', 'self_clean', 'fruit_wash'],
  },
  '000000H1': {
    times: [110, 29, 190, 60, 56, 12, 75],
    modes: ['strong_wash', 'fast_wash', 'eco_wash', 'standard_wash', 'glass_wash', 'soak_wash', 'self_clean'],
  },
  '000000H3': {
    times: ['--', 110, 190, 20, 12, 56, 50, 12, 75],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'fruit_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '000000H4': {
    times: ['--', 110, 190, 29, 56, 60, 12, 75],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '000000H5': {
    times: ['--', 135, 175, 29, 90, 65, 100, 15, 75],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      '90min_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '000000K1': {
    times: ['--', 110, 190, 29, 12, 56, 50, 12, 75, '-:--'],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'fruit_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
      'self_define',
    ],
  },
  '000000K2': {
    times: ['--', 110, 190, 29, 12, 56, 50, 12, 75],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'fruit_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '000000L1': {
    times: [125, 98, 179, 29, 80, 72, 15, 103],
    modes: [
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'fast_wash',
      'self_clean',
      'glass_wash',
      'soak_wash',
      'less_wash',
    ],
  },
  '000000L2': {
    times: ['--', 125, 179, 29, 98, 72, 80],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'fast_wash', 'standard_wash', 'glass_wash', 'self_clean'],
  },
  '000000L3': {
    times: ['--', 180, 220, 190, 135, 15, 24, 150, 115, 180, 105],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'germ',
      'self_clean',
      'soak_wash',
      'fast_wash',
      'glass_wash',
      'standard_wash',
      'hotpot_wash',
      'less_wash',
    ],
  },
  '000000M6': {
    times: ['--', 110, 190, 29, 56, 100],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'fast_wash', 'glass_wash', 'self_define'],
  },
  '000000M7': {
    times: [118, 29, 170, 66, 15],
    modes: ['strong_wash', 'fast_wash', 'eco_wash', 'glass_wash', 'soak_wash'],
  },
  '000000MT': {
    times: [29, 119, 89],
    modes: ['fast_wash', 'eco_wash', 'strong_wash'],
  },
  '000000Q1': {
    times: [59, 108, 160, 29, 56, 10],
    modes: ['standard_wash', 'strong_wash', 'eco_wash', 'fast_wash', 'glass_wash', 'soak_wash'],
  },
  '000000S2': {
    times: [86, 29, 110, 26],
    modes: ['strong_wash', 'fast_wash', 'eco_wash', 'fruit_wash'],
  },
  '000000S3': {
    times: [29, 90, 155, 26],
    modes: ['fast_wash', 'strong_wash', 'eco_wash', 'fruit_wash'],
  },
  '000000V1': {
    times: [110, 29, 190, 56, 10],
    modes: ['strong_wash', 'fast_wash', 'eco_wash', 'glass_wash', 'kill_germ_wash'],
  },
  '000000X3': {
    times: ['--', 170, 29, '18'],
    modes: ['auto_wash', 'eco_wash', 'fast_wash', 'self_define'],
  },
  '000000X4': {
    times: ['--', 110, 190, 29, 12, 56, 50, 12, 75],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'fruit_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '000000X5': {
    times: [118, 29, 170, 66, 15, 100],
    modes: ['strong_wash', 'fast_wash', 'eco_wash', 'glass_wash', 'soak_wash', 'self_define'],
  },
  '000000X6': {
    times: ['--', 112, 165, 29, 67, 12, 105, '-:--'],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'fast_wash', 'glass_wash', 'soak_wash', 'less_wash', 'self_define'],
  },
  '00000D18': {
    times: [110, 60, 190, 56, 20, 75, 12],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'glass_wash', 'fast_wash', 'self_clean', 'soak_wash'],
  },
  '00000F2A': {
    times: [29, 90, 155, 26],
    modes: ['fast_wash', 'strong_wash', 'eco_wash', 'fruit_wash'],
  },
  '00000F3B': {
    times: [29, 90, 170, 65, 26],
    modes: ['fast_wash', 'strong_wash', 'eco_wash', 'self_clean', 'fruit_wash'],
  },
  '00000H3C': {
    times: [110, 29, 178, 12, 56, 50, 12, 75],
    modes: [
      'strong_wash',
      'fast_wash',
      'eco_wash',
      'fruit_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '00000H3D': {
    times: [110, 56, 205, 29, 60, 75],
    modes: ['strong_wash', 'glass_wash', 'eco_wash', 'fast_wash', 'standard_wash', 'self_clean'],
  },
  '00000H3P': {
    times: ['144', 60, 110, 56, 20, 190, 130, 12],
    modes: ['auto_wash', 'standard_wash', 'strong_wash', 'glass_wash', 'fast_wash', 'eco_wash', 'germ', 'soak_wash'],
  },
  '00000H3S': {
    times: [110, 60, 29, 190, 56, 75, '--'],
    modes: ['strong_wash', 'standard_wash', 'fast_wash', 'eco_wash', 'glass_wash', 'self_clean', 'auto_wash'],
  },
  '00000M10': {
    times: [110, 80, 140, 29, 12, 60, 16],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'fruit_wash', 'self_clean', 'seafood_wash'],
  },
  '00000P10': {
    times: [125, 98, 179, 29, 135, 80, 72, 15],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'germ', 'self_clean', 'glass_wash', 'soak_wash'],
  },
  '00003906': {
    times: [150, 130, 185, 95, 90, 30, 13, 75],
    modes: [
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'glass_wash',
      '90min_wash',
      'fast_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '0000D25A': {
    times: [108, 59, 160, 56, 29],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'glass_wash', 'fast_wash'],
  },
  '0000D26A': {
    times: [110, 60, 190, 56, 29],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'glass_wash', 'fast_wash'],
  },
  '0000D26W': {
    times: [29, 86, 155, 46, 59],
    modes: ['fast_wash', 'strong_wash', 'eco_wash', 'glass_wash', 'standard_wash'],
  },
  '0000RX30': {
    times: ['--', 180, 220, 190, 135, 15, 29, 150, 115],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'germ',
      'self_clean',
      'soak_wash',
      'fast_wash',
      'glass_wash',
      'standard_wash',
    ],
  },
  '0000V1E6': {
    times: ['--', 110, 190, 29, 12, 56, 50, 12, 75],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'fruit_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '000W5601': {
    times: [160, 29, 185, 105, 130, 135, 15, 190, 285],
    modes: [
      'strong_wash',
      'fast_wash',
      'eco_wash',
      'standard_wash',
      'glass_wash',
      'self_clean',
      'soak_wash',
      'hotpot_wash',
      'quietnight_wash',
    ],
  },
  '000W8501': {
    times: ['--', 125, 160, 78, 29, 37],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'glass_wash', 'fast_wash', 'self_clean'],
  },
  '00W2601C': {
    times: [58, 29, 47, 89, 29, 160],
    modes: ['standard_wash', 'toy_wash', 'glass_wash', 'strong_wash', 'fast_wash', 'eco_wash'],
  },
  '00W3602H': {
    times: [29, 108, 160, 10, 10, 56],
    modes: ['fast_wash', 'strong_wash', 'eco_wash', 'soak_wash', 'kill_germ_wash', 'glass_wash'],
  },
  '00W3802H': {
    times: [190, 29, 110, '--', 10, 56, 12, 7],
    modes: [
      'eco_wash',
      'fast_wash',
      'strong_wash',
      'auto_wash',
      'kill_germ_wash',
      'glass_wash',
      'soak_wash',
      'fruit_wash',
    ],
  },
  '00W3909R': {
    times: ['140', 60, 110, 56, 20, 190, 130, 12, 7, 145, 12, 75],
    modes: [
      'auto_wash',
      'standard_wash',
      'strong_wash',
      'glass_wash',
      'fast_wash',
      'eco_wash',
      'germ',
      'seafood_wash',
      'fruit_wash',
      'hotpot_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '00W7635R': {
    times: ['--', 155, 175, 29, 65, 15, 80],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'fast_wash', 'glass_wash', 'soak_wash', 'self_clean'],
  },
  '00W9601B': {
    times: ['--', 125, 160, 78, 29, 7],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'glass_wash', 'fast_wash', 'soak_wash'],
  },
  '0HW2601C': {
    times: [89, 165, 29, 6],
    modes: ['strong_wash', 'eco_wash', 'fast_wash', 'fruit_wash'],
  },
  '0W3905CN': {
    times: [110, 60, 196, 29, 12, 75, 56],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'soak_wash', 'self_clean', 'glass_wash'],
  },
  '11111M10': {
    times: [110, 80, 135, 29, 12, 60, 16],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'fruit_wash', 'self_clean', 'seafood_wash'],
  },
  76000007: {
    times: [110, 80, 140, 29, 12, 60, 16],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'fruit_wash', 'self_clean', 'seafood_wash'],
  },
  '760000E1': {
    times: ['--', 110, 178, 29, 12, 56, 50, 12, 75],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'fruit_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '760000LX': {
    times: ['--', 180, 220, 115, 29, 190, 135, 150, 15, 180, 105],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'standard_wash',
      'fast_wash',
      'germ',
      'self_clean',
      'glass_wash',
      'soak_wash',
      'hotpot_wash',
      'less_wash',
    ],
  },
  '760000M1': {
    times: [89, 165, 12, 29, 48],
    modes: ['strong_wash', 'eco_wash', 'fruit_wash', 'fast_wash', 'glass_wash'],
  },
  '760000M8': {
    times: [110, 60, 196, 56, 20, 75, 12],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'glass_wash', 'fast_wash', 'self_clean', 'soak_wash'],
  },
  '760000Q7': {
    times: ['--', 155, 175, 29, 65, 15, 80],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'fast_wash', 'glass_wash', 'soak_wash', 'self_clean'],
  },
  '760000V2': {
    times: ['--', 125, 160, 29, 78, 7],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'fast_wash', 'glass_wash', 'soak_wash'],
  },
  '760000V3': {
    times: ['--', 110, 190, 60, 29, 56, 75, 70, 12, 7, 12, 145],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'standard_wash',
      'fast_wash',
      'glass_wash',
      'self_clean',
      'germ',
      'soak_wash',
      'fruit_wash',
      'seafood_wash',
      'hotpot_wash',
    ],
  },
  '760000V5': {
    times: ['--', 110, 190, 20, 56, 60, 70, 75, 12, 7, 12, 145],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'glass_wash',
      'standard_wash',
      'germ',
      'self_clean',
      'soak_wash',
      'fruit_wash',
      'seafood_wash',
      'hotpot_wash',
    ],
  },
  '760000X9': {
    times: ['--', 215, 160, 29, 130, 135, 15, 105, 10, 150, 15, 190, 285, 170],
    modes: [
      'auto_wash',
      'eco_wash',
      'strong_wash',
      'fast_wash',
      'glass_wash',
      'self_clean',
      'soak_wash',
      'standard_wash',
      'fruit_wash',
      'germ',
      'seafood_wash',
      'hotpot_wash',
      'quietnight_wash',
      'oilnet_wash',
    ],
  },
  76000572: {
    times: ['--', 180, 220, 115, 24, 15, 190, 8, 15, 135, 150, 180],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'standard_wash',
      'fast_wash',
      'soak_wash',
      'germ',
      'fruit_wash',
      'seafood_wash',
      'self_clean',
      'glass_wash',
      'hotpot_wash',
    ],
  },
  76000610: {
    times: ['--', 60, 110, 56, 20, 190, 160, 7, 12, 145],
    modes: [
      'auto_wash',
      'standard_wash',
      'strong_wash',
      'glass_wash',
      'fast_wash',
      'eco_wash',
      'germ',
      'fruit_wash',
      'seafood_wash',
      'hotpot_wash',
    ],
  },
  76000613: {
    times: ['--', 230, 160, 105, 29, 130, 150, 15, 190, 10, 15, 285],
    modes: [
      'auto_wash',
      'eco_wash',
      'strong_wash',
      'standard_wash',
      'fast_wash',
      'glass_wash',
      'germ',
      'soak_wash',
      'hotpot_wash',
      'fruit_wash',
      'seafood_wash',
      'quietnight_wash',
    ],
  },
  76000616: {
    times: ['--', 220, 160, 29, 105, 135, 15, 130, 10, 15, 190, 285],
    modes: [
      'auto_wash',
      'eco_wash',
      'strong_wash',
      'fast_wash',
      'standard_wash',
      'self_clean',
      'soak_wash',
      'glass_wash',
      'fruit_wash',
      'seafood_wash',
      'hotpot_wash',
      'quietnight_wash',
    ],
  },
  76000617: {
    times: ['--', 160, 185, 130, 29, 15, 105, 285],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'glass_wash',
      'fast_wash',
      'soak_wash',
      'standard_wash',
      'quietnight_wash',
    ],
  },
  76000618: {
    times: ['--', 160, 105, 185, 29, 130, 285, 190, 15, 135],
    modes: [
      'auto_wash',
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'fast_wash',
      'glass_wash',
      'quietnight_wash',
      'hotpot_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '7600061C': {
    times: ['--', 180, 220, 190, 135, 15, 24, 150, 115, 180, 105],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'germ',
      'self_clean',
      'soak_wash',
      'fast_wash',
      'glass_wash',
      'standard_wash',
      'hotpot_wash',
      'less_wash',
    ],
  },
  '7600061E': {
    times: ['--', 20, 110, 56, 60, 70, 190, 75, 12, 7, 12, 145],
    modes: [
      'auto_wash',
      'fast_wash',
      'strong_wash',
      'glass_wash',
      'standard_wash',
      'germ',
      'eco_wash',
      'self_clean',
      'soak_wash',
      'fruit_wash',
      'seafood_wash',
      'hotpot_wash',
    ],
  },
  '7600061F': {
    times: ['--', 180, 220, 135, 135, 15, 24, 150, 115, 180, 105],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'germ',
      'self_clean',
      'soak_wash',
      'fast_wash',
      'glass_wash',
      'standard_wash',
      'hotpot_wash',
      'less_wash',
    ],
  },
  '7600061H': {
    times: [110, 29, 190, '-:--', '--', 12, 56, 50, 12, 75],
    modes: [
      'strong_wash',
      'fast_wash',
      'eco_wash',
      'self_define',
      'auto_wash',
      'fruit_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '7600061N': {
    times: [110, 90, 155, 10, 29, 70, 60, 12],
    modes: [
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'fruit_wash',
      'fast_wash',
      'self_clean',
      'glass_wash',
      'seafood_wash',
    ],
  },
  '7600061P': {
    times: [160, 29, 220, 105, 135, 15, 130, 190, 285],
    modes: [
      'strong_wash',
      'fast_wash',
      'eco_wash',
      'standard_wash',
      'self_clean',
      'soak_wash',
      'glass_wash',
      'hotpot_wash',
      'quietnight_wash',
    ],
  },
  '7600061Y': {
    times: ['--', 160, 105, 215, 29, 130, 150, 15, 190, 10, 15, 285],
    modes: [
      'auto_wash',
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'fast_wash',
      'glass_wash',
      'germ',
      'soak_wash',
      'hotpot_wash',
      'fruit_wash',
      'seafood_wash',
      'quietnight_wash',
    ],
  },
  '76000CF4': {
    times: [35, 165, 99],
    modes: ['fast_wash', 'eco_wash', 'strong_wash'],
  },
  '76000JV8': {
    times: ['--', 110, 190, 20, 60, 56, 12, 75, 7],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'standard_wash',
      'glass_wash',
      'soak_wash',
      'self_clean',
      'fruit_wash',
    ],
  },
  '76000NS8': {
    times: [110, 20, 190, 60, 56, 12, 75, 7],
    modes: [
      'strong_wash',
      'fast_wash',
      'eco_wash',
      'standard_wash',
      'glass_wash',
      'soak_wash',
      'self_clean',
      'fruit_wash',
    ],
  },
  '76000P40': {
    times: ['--', 180, 220, 115, 24, 15, 190, 8, 15, 135, 150, 180],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'standard_wash',
      'fast_wash',
      'soak_wash',
      'germ',
      'fruit_wash',
      'seafood_wash',
      'self_clean',
      'glass_wash',
      'hotpot_wash',
    ],
  },
  '76000UP2': {
    times: [110, 90, 155, 10, 29, 70, 60, 12],
    modes: [
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'fruit_wash',
      'fast_wash',
      'self_clean',
      'glass_wash',
      'seafood_wash',
    ],
  },
  '76000X5B': {
    times: ['--', 160, 220, 29, 105, 130, 135, 15, 10, 15, 190, 285],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'standard_wash',
      'glass_wash',
      'self_clean',
      'soak_wash',
      'fruit_wash',
      'seafood_wash',
      'hotpot_wash',
      'quietnight_wash',
    ],
  },
  '7600BF01': {
    times: [110, 60, 176, 29, 75, 12, 56, 7],
    modes: [
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'fast_wash',
      'self_clean',
      'soak_wash',
      'glass_wash',
      'fruit_wash',
    ],
  },
  '7600BF03': {
    times: [125, 98, 179, 29, 80, 72, 15],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'self_clean', 'glass_wash', 'soak_wash'],
  },
  '7600GX1K': {
    times: ['--', 160, 105, 220, 20, 130, 285, 190, 15, 135],
    modes: [
      'auto_wash',
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'fast_wash',
      'glass_wash',
      'quietnight_wash',
      'hotpot_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '7600H0P9': {
    times: ['--', 125, 98, 220, 29, 72, 80],
    modes: ['auto_wash', 'strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'glass_wash', 'self_clean'],
  },
  '7600JV20': {
    times: ['--', 180, 220, 115, 150, 29, 135, 15, 190],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'standard_wash',
      'glass_wash',
      'fast_wash',
      'self_clean',
      'soak_wash',
      'germ',
    ],
  },
  '7600M10P': {
    times: [110, 80, 29, 135, 12, 60, 16, 10],
    modes: [
      'strong_wash',
      'standard_wash',
      'fast_wash',
      'eco_wash',
      'fruit_wash',
      'self_clean',
      'seafood_wash',
      'kill_germ_wash',
    ],
  },
  '7600P23Q': {
    times: ['--', 180, 220, 29, 190, 15, 135, 150, 8],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'germ',
      'soak_wash',
      'self_clean',
      'glass_wash',
      'fruit_wash',
    ],
  },
  '7600P40P': {
    times: ['--', 125, 179, 98, 24, 15, 135, 8, 15, 80, 72, 160],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'standard_wash',
      'fast_wash',
      'soak_wash',
      'germ',
      'fruit_wash',
      'seafood_wash',
      'self_clean',
      'glass_wash',
      'hotpot_wash',
    ],
  },
  '7600RX20': {
    times: ['--', 180, 220, 115, 29, 135, 15, 190],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'standard_wash', 'fast_wash', 'self_clean', 'soak_wash', 'germ'],
  },
  '7600RX50': {
    times: ['--', 180, 220, 190, 135, 15, 29, 150, 115, 180, 105],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'germ',
      'self_clean',
      'soak_wash',
      'fast_wash',
      'glass_wash',
      'standard_wash',
      'hotpot_wash',
      'less_wash',
    ],
  },
  '7600V1E0': {
    times: [29, 119, 89],
    modes: ['fast_wash', 'eco_wash', 'strong_wash'],
  },
  '7600V1E7': {
    times: ['--', 110, 190, 29, 12, 56, 50, 12, 75],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'fruit_wash',
      'glass_wash',
      'standard_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '7600V1E9': {
    times: ['--', 125, 98, 220, 72, 29, 80],
    modes: ['auto_wash', 'strong_wash', 'standard_wash', 'eco_wash', 'glass_wash', 'fast_wash', 'self_clean'],
  },
  '7603602D': {
    times: [108, 56, 29, 10, 160, 59],
    modes: ['strong_wash', 'glass_wash', 'fast_wash', 'soak_wash', 'eco_wash', 'standard_wash'],
  },
  '7603905P': {
    times: [110, 60, 190, 56, 29, 12, 75, 70, 145, 12, 7],
    modes: [
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'glass_wash',
      'fast_wash',
      'soak_wash',
      'self_clean',
      'germ',
      'hotpot_wash',
      'seafood_wash',
      'fruit_wash',
    ],
  },
  '7607636X': {
    times: [115, 90, 190, 29, 105, 15],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'germ', 'soak_wash'],
  },
  '760B108B': {
    times: ['--', 110, 178, 29, 56, 12],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'fast_wash', 'glass_wash', 'soak_wash'],
  },
  '760GX600': {
    times: [160, 29, 185, 105, 130, 135, 15, 190, 285],
    modes: [
      'strong_wash',
      'fast_wash',
      'eco_wash',
      'standard_wash',
      'glass_wash',
      'self_clean',
      'soak_wash',
      'hotpot_wash',
      'quietnight_wash',
    ],
  },
  '760GX800': {
    times: ['--', 160, 105, 220, 20, 130, 285, 190, 15, 135],
    modes: [
      'auto_wash',
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'fast_wash',
      'glass_wash',
      'quietnight_wash',
      'hotpot_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '760JD103': {
    times: [110, 29, 178, 50],
    modes: ['strong_wash', 'fast_wash', 'eco_wash', 'standard_wash'],
  },
  '760JV800': {
    times: ['--', 160, 105, 220, 20, 130, 285, 190, 15, 135],
    modes: [
      'auto_wash',
      'strong_wash',
      'standard_wash',
      'eco_wash',
      'fast_wash',
      'glass_wash',
      'quietnight_wash',
      'hotpot_wash',
      'soak_wash',
      'self_clean',
    ],
  },
  '760M10CD': {
    times: [110, 80, 135, 29, 12, 60, 16],
    modes: ['strong_wash', 'standard_wash', 'eco_wash', 'fast_wash', 'fruit_wash', 'self_clean', 'seafood_wash'],
  },
  '760P30PL': {
    times: ['--', 180, 220, 24, 150, 15, 115, 190, 135, 180],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'fast_wash',
      'glass_wash',
      'soak_wash',
      'standard_wash',
      'germ',
      'self_clean',
      'hotpot_wash',
    ],
  },
  '760P40T1': {
    times: ['--', 180, 220, 115, 24, 150, 190, 8, 15, 180, 135, 15],
    modes: [
      'auto_wash',
      'strong_wash',
      'eco_wash',
      'standard_wash',
      'fast_wash',
      'glass_wash',
      'germ',
      'fruit_wash',
      'seafood_wash',
      'hotpot_wash',
      'self_clean',
      'soak_wash',
    ],
  },
  '760RX20G': {
    times: ['--', 180, 220, 115, 29, 135, 15, 190],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'standard_wash', 'fast_wash', 'self_clean', 'soak_wash', 'germ'],
  },
  '760RX20S': {
    times: ['--', 180, 220, 115, 29, 135, 15, 190],
    modes: ['auto_wash', 'strong_wash', 'eco_wash', 'standard_wash', 'fast_wash', 'self_clean', 'soak_wash', 'germ'],
  },
}

export const getSetting = function (sn8) {
  return setting[sn8]
}

export const getModesList = function (sn8) {
  const myModes = setting[sn8] ? setting[sn8].modes : []
  return myModes
    .map((m, i) =>
      modes[m]
        ? {
            type: m,
            ...modes[m],
            time: setting[sn8].times[i],
          }
        : null
    )
    .filter((x) => !!x)
}

export const getModes = function (sn8) {
  const myModes = getModesList(sn8)
  let rs = {}
  myModes.forEach((x) => {
    rs[x.type] = x
  })
  return rs
}

export const getModeBtnImgList = function (sn8) {
  const myModes = getModesList(sn8)
  let rs = {}
  myModes.forEach((m) => {
    rs[m.type] = m.imgList.type_on
    rs[m.type + '_off'] = m.imgList.type_off
  })
  return rs
}

const check = {
  order(code) {
    // return code !== '00W3906B';
    return !['00W3906B', '00W2601C'].includes(code)
  },
  // 返回设备是否有童锁 [lock]
  lock(code) {
    return ![
      '000000L1',
      '000000L2',
      '000000M7',
      '000000MT',
      '000000V1',
      '000000X5',
      '000000X6',
      '00000D18',
      '00003906',
      '0000D25A',
      '0000D26A',
      '000W8501',
      '00W2601C',
      '00W9601B',
      '0HW2601C',
      '760000LX',
      '760000M1',
      '760000M8',
      '76000616',
      '76000617',
      '76000618',
      '7600061N',
      '7600061Y',
      '76000621',
      '76000CF4',
      '76000UP2',
      '76000X5B',
      '7600GX1K',
      '7600M10P',
      '7600P23Q',
      '7600V1E0',
      '7600V1E9',
      '7603602D',
      '760GX800',
      '760JV800',
    ].includes(code)
  },

  // 检查是否有保管功能（保管：通风&杀菌） [airswitch:0/1, air_set_hour, air_left_hour]
  airswitch(code) {
    return [
      '000000H3',
      '000000H5',
      '000000K1',
      '000000K2',
      '000000X4',
      '000000X6',
      '00W2601C',
      '00W3906B',
      '00W3602K',
      '000000H4',
      '7600GX1K',
    ].includes(code)
  },
  // 检查保管功能是否可以立即开启 [airswitch:2]
  airswitch_run(code) {
    return ['00W3602K', '000000H4', '7600GX1K'].includes(code)
  },

  // 检查是否有亮碟剂功能 [bright]
  bright(code) {
    return [
      '000000E6',
      '000000E8',
      '000000H3',
      '000000H4',
      '000000H5',
      '000000K1',
      '000000K2',
      '000000L1',
      '000000L2',
      '000000L3',
      '000000M7',
      '000000Q1',
      '000000X3',
      '000000X4',
      '00000D18',
      '00000H3C',
      '00000H3D',
      '00000H3P',
      '00000P10',
      '0000D26W',
      '0000RX30',
      '0000V1E6',
      '000W5601',
      '000W8501',
      '00W3909R',
      '00W7635R',
      '00W9601B',
      '11111M10',
      '76000001',
      '76000003',
      '760000E1',
      '760000LX',
      '760000M8',
      '760000Q7',
      '760000V2',
      '760000V3',
      '760000V5',
      '760000X9',
      '76000572',
      '76000593',
      '76000610',
      '76000612',
      '76000613',
      '76000616',
      '76000617',
      '76000618',
      '7600061C',
      '7600061E',
      '7600061F',
      '7600061H',
      '7600061P',
      '7600061Y',
      '76000621',
      '76000622',
      '76000623',
      '76000624',
      '76000627',
      '76000628',
      '76000629',
      '76000JV8',
      '76000NS8',
      '76000P40',
      '76000X5B',
      '7600BF03',
      '7600GX1K',
      '7600H0P9',
      '7600JV20',
      '7600P23Q',
      '7600P40P',
      '7600RX20',
      '7600RX50',
      '7600V1E7',
      '7600V1E9',
      '7603905P',
      '760B108B',
      '760GX600',
      '760GX800',
      '760JD103',
      '760JV800',
      '760P30PL',
      '760P40T1',
      '760RX20G',
      '760RX20S',
    ].includes(code)
  },

  // 检查是否有软水档位功能 [softwater]
  softwater(code) {
    return [
      '000000E6',
      '000000E8',
      '000000F1',
      '000000F4',
      '000000H1',
      '000000H3',
      '000000H4',
      '000000H5',
      '000000K1',
      '000000K2',
      '000000L1',
      '000000L2',
      '000000L3',
      '000000M6',
      '000000M7',
      '000000Q1',
      '000000S2',
      '000000S3',
      '000000V1',
      '000000X3',
      '000000X4',
      '000000X5',
      '000000X6',
      '00000D18',
      '00000F2A',
      '00000F3B',
      '00000H3C',
      '00000H3D',
      '00000H3P',
      '00000H3S',
      '00000P10',
      '0000D25A',
      '0000D26A',
      '0000D26W',
      '0000RX30',
      '0000V1E6',
      '000W5601',
      '000W8501',
      '00W2601C',
      '00W3602H',
      '00W3802H',
      '00W3909R',
      '00W7635R',
      '00W9601B',
      '0W3905CN',
      '11111M10',
      '76000001',
      '76000003',
      '76000015',
      '76000016',
      '760000E1',
      '760000LX',
      '760000M8',
      '760000Q7',
      '760000V2',
      '760000V3',
      '760000V5',
      '760000X9',
      '76000572',
      '76000593',
      '76000610',
      '76000612',
      '76000613',
      '76000616',
      '76000617',
      '76000618',
      '7600061C',
      '7600061E',
      '7600061F',
      '7600061H',
      '7600061N',
      '7600061P',
      '7600061Y',
      '76000621',
      '76000622',
      '76000623',
      '76000624',
      '76000627',
      '76000628',
      '76000629',
      '76000JV8',
      '76000NS8',
      '76000P40',
      '76000UP2',
      '76000X5B',
      '7600BF01',
      '7600BF03',
      '7600GX1K',
      '7600H0P9',
      '7600JV20',
      '7600P23Q',
      '7600P40P',
      '7600RX20',
      '7600RX50',
      '7600V1E7',
      '7600V1E9',
      '7603602D',
      '7603905P',
      '7607636X',
      '760B108B',
      '760GX600',
      '760GX800',
      '760JD103',
      '760JV800',
      '760P30PL',
      '760P40T1',
      '760RX20G',
      '760RX20S',
    ].includes(code)
  },
}

// 检查当前设备是否有某个功能
export const checkEquipmentFunc = function (code, functionName) {
  if (typeof check[functionName] !== 'function') return false
  const rs = check[functionName](code)
  console.log('used?:', functionName, rs)
  return rs
}