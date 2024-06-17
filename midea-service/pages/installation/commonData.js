let autoId = 1
const choiceData = {
  airCondition: {
    id: autoId++,
    realProdName: '空调',
    prodName: '空调',
    totalName: '家用,中央',
    markList: [
      {
        key: '有防护栏需要切割',
        val: 1,
      },
      {
        key: '楼层较高需要梯子',
        val: 2,
      },
      {
        key: '墙体需要打孔',
        val: 3,
      },
      {
        key: '玻璃需要打孔',
        val: 4,
      },
      {
        key: '需要改造电路',
        val: 5,
      },
      {
        key: '可能需要租用吊车',
        val: 6,
      },
    ],
  }, //空调
  heater: {
    id: autoId++,
    realProdName: '热水器',
    prodName: '热水器',
    markList: [
      {
        key: '需要安装水龙头',
        val: 1,
      },
      {
        key: '水管需要加长',
        val: 2,
      },
      {
        key: '墙体需要打孔',
        val: 3,
      },
      {
        key: '需要安装前置过滤器',
        val: 4,
      },
    ],
  }, //热水器
  cleanWater: {
    id: autoId++,
    realProdName: '净水器',
    prodName: '净水器',
    markList: [
      {
        key: '需要安装水龙头',
        val: 1,
      },
      {
        key: '水管需要加长',
        val: 2,
      },
      {
        key: '墙体需要打孔',
        val: 3,
      },
      {
        key: '需要安装前置过滤器',
        val: 4,
      },
    ],
  }, //热水器
  washMachine: {
    id: autoId++,
    realProdName: '洗衣机',
    prodName: '洗衣机',
    markList: [
      {
        key: '需要安装水龙头',
        val: 1,
      },
      {
        key: '拆机入户',
        val: 2,
      },
      {
        key: '墙体需要打孔',
        val: 3,
      },
      {
        key: '需要改造电路',
        val: 4,
      },
      {
        key: '需要接进水管',
        val: 5,
      },
      {
        key: '需要接进水三通',
        val: 6,
      },
      {
        key: '需要接排水管',
        val: 7,
      },
      {
        key: '需要加长水管',
        val: 8,
      },
    ],
  }, //洗衣机
  lampblackMachine: {
    id: autoId++,
    realProdName: '油烟机',
    prodName: '厨房',
    totalName: '烟机',
    markList: [
      {
        key: '墙体需要打孔',
        val: 1,
      },
      {
        key: '需要改造电路',
        val: 2,
      },
      {
        key: '需要加长烟管',
        val: 3,
      },
      {
        key: '需要加装支架',
        val: 4,
      },
      {
        key: '需要加装止烟宝',
        val: 5,
      },
      {
        key: '需要加长电源线或改线',
        val: 6,
      },
      {
        key: '需要增加电源线插座',
        val: 7,
      },
      {
        key: '需要增加漏电保护开关',
        val: 8,
      },
    ],
  }, //油烟机
  gasStove: {
    id: autoId++,
    realProdName: '燃气灶',
    prodName: '厨房',
    totalName: '燃气灶',
    markList: [
      {
        key: '木质灶台',
        val: 1,
      },
      {
        key: '不锈钢灶台',
        val: 2,
      },
      {
        key: '大理石灶台',
        val: 3,
      },
      {
        key: '人造石灶台',
        val: 4,
      },
      {
        key: '灶台需要开孔',
        val: 5,
      },
      {
        key: '灶台需要扩孔',
        val: 6,
      },
    ],
  }, //燃气灶
  dishWasher: {
    id: autoId++,
    realProdName: '洗碗机',
    prodName: '厨房',
    totalName: '洗碗机',
    markList: [
      {
        key: '木质橱柜',
        val: 1,
      },
      {
        key: '不锈钢橱柜',
        val: 2,
      },
      {
        key: '大理石橱柜',
        val: 3,
      },
      {
        key: '橱柜需要开孔',
        val: 4,
      },
    ],
  }, //洗碗机
  cabinet: {
    id: autoId++,
    realProdName: '嵌入式微波炉',
    prodName: '厨房',
    totalName: '嵌入式微波炉',
    markList: [
      {
        key: '木质橱柜',
        val: 1,
      },
      {
        key: '不锈钢橱柜',
        val: 2,
      },
      {
        key: '大理石橱柜',
        val: 3,
      },
      {
        key: '橱柜需要开孔',
        val: 4,
      },
    ],
  }, //嵌入式微蒸烤消类
  // eslint-disable-next-line no-dupe-keys
  cabinet: {
    id: autoId++,
    realProdName: '嵌入式蒸箱',
    prodName: '厨房',
    totalName: '嵌入式蒸箱',
    markList: [
      {
        key: '木质橱柜',
        val: 1,
      },
      {
        key: '不锈钢橱柜',
        val: 2,
      },
      {
        key: '大理石橱柜',
        val: 3,
      },
      {
        key: '橱柜需要开孔',
        val: 4,
      },
    ],
  }, //嵌入式微蒸烤消类
  // eslint-disable-next-line no-dupe-keys
  cabinet: {
    id: autoId++,
    realProdName: '嵌入式',
    prodName: '厨房',
    totalName: '嵌入式',
    markList: [
      {
        key: '木质橱柜',
        val: 1,
      },
      {
        key: '不锈钢橱柜',
        val: 2,
      },
      {
        key: '大理石橱柜',
        val: 3,
      },
      {
        key: '橱柜需要开孔',
        val: 4,
      },
    ],
  }, //嵌入式微蒸烤消类
  // eslint-disable-next-line no-dupe-keys
  cabinet: {
    id: autoId++,
    realProdName: '嵌入式',
    prodName: '厨房',
    totalName: '嵌入式',
    markList: [
      {
        key: '木质橱柜',
        val: 1,
      },
      {
        key: '不锈钢橱柜',
        val: 2,
      },
      {
        key: '大理石橱柜',
        val: 3,
      },
      {
        key: '橱柜需要开孔',
        val: 4,
      },
    ],
  }, //嵌入式微蒸烤消类
  refrigerator: {
    id: autoId++,
    realProdName: '冰箱',
    prodName: '冰箱',
    markList: [
      {
        key: '无电梯需要搬运',
        val: 1,
      },
      {
        key: '家门宽度小于70厘米',
        val: 2,
      },
    ],
  },
}
// 为方便以后的拓展，写成k-v结构。免得以后要全部重新写一遍逻辑.
export { choiceData }
