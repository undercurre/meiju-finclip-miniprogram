import commonConfig from './pages-config/common'
import { requestService } from '../../../../utils/requestService'

// 页面
const _pages = {
  weex: '插件首页',
}
// 按钮
const _btn = {
  powerOff: '按钮',
}
// 事件
const _event = {
  settingNFC: '设置NFC',
}
// 状态
const _status = {
  order: '定时模式',
  status: {
    outline: '离线中',
    // order: "预约加热",
    default: '待机中',
  },
}

const singleVersion = [
  '76000001',
  '76000003',
  '76000016',
  '76000017',
  '76000018',
  '76000593',
  '76000601',
  '76000612',
  '76000616',
  '76000622',
  '760BLV88',
  '76000623',
  '76000624',
  '76000627',
  '76000629',
  '7600061E',
  '7600061H',
  '7600061J',
  '7600061B',
  '7600061T',
  '7600061Z',
  '7600061P',
  '7600061N',
  '7607636X',
  '000000X3',
  '0000D26W',
  '11111M10',
  '00003906',
  '7600BF03',
  '7600BF01',
  '000000MT',
  '7600V1E0',
  '760P40T1',
  '760000E1',
  '760000C1',
  '760000M8',
  '7600P40P',
  '00000P10',
  '760JD201',
  '00000F2A',
  '00W7635R',
  '00000X4S',
  '000000Y1',
  '000000V1',
  '0000D25A',
  '76000D25',
  '0000D26A',
  '760SN101',
  '760TM101',
  '000000H5',
  '000000E8',
  '000000E6',
  '000W8501',
  '00W9601B',
  '000000Q1',
  '00W3602K',
  '00W2601C',
  '000000X6',
  '000000L1',
  '000000J1',
  '0000RX10',
  '000000F1',
  '000000S3',
  '000000F4',
  '000000X5',
  '000000M6',
  '000000M7',
  '000000S2',
  '0W3905CN',
  '00W3802H',
  '00W3602H',
  '000000L2',
  '000000L2',
  '000000L2',
  '760000V2',
  '760M10CD',
  '76000UP2',
  '7600M10P',
  '760P0P36',
  '760000Q7',
]

const ABVersion = [
  '00W3802H', //针对仅APP修改丝印，数字表示有几个版本，暂时只实现了2个版本（A、B版）  ！！会出现用户选择界面
  '00W3602H',
  '000000L2',
  '000000H1',
]

/**
 * @description: 注意：setting每一行都需要有注释介绍 型号_ +....
 * @Date: 2021-04-14 15:58:19
 * @author: Xiangfeng.Zhou
 */
const setting = {
  //COLMO机型
  '000000E6_0': { sn8: '000000E6', version: 0 },
  '000000E6_1': { sn8: '000000E6', version: 1 },
  '000000E8_0': { sn8: '000000E8', version: 0 },
  '000000E8_1': { sn8: '000000E8', version: 1 },
  // "7600001A_0": { sn8: "7600001A", version: 0 },//通用主板 CDS16G06,含云洗涤OTA目前分包
  '76000103_0': { sn8: '76000103', version: 0 }, //通用主板 CDS15G15
  '76000019_0': { sn8: '76000019', version: 0 }, //通用主板 CDS10T02
  '76000102_0': { sn8: '76000102', version: 0 }, //通用主板 CDF12G05
  '76000101_0': { sn8: '76000101', version: 0 }, //通用主板 CDS10T01
  '76000013_0': { sn8: '76000013', version: 0 }, //通用主板 CDS12G03
  '76000013_1': { sn8: '76000013', version: 1 }, //时序升级一级能效
  '760DB412_0': { sn8: '760DB412', version: 0 },
  '760DB412_1': { sn8: '760DB412', version: 1 },
  '760DB412_2': { sn8: '760DB412', version: 2 },
  '760DB412_3': { sn8: '760DB412', version: 3 }, // OTA升级
  '760B108B_0': { sn8: '760B108B', version: 0 }, //000000E6和760B108B共用同一个软件
  '760B108B_1': { sn8: '760B108B', version: 1 },
  '00W9601B_0': { sn8: '00W9601B', version: 0 }, //CDT108-E8
  '00W9601B_1': { sn8: '00W9601B', version: 1 }, //CDT108-E8
  '760CDB31_0': { sn8: '760CDB31', version: 0 },
  '760CDB31_1': { sn8: '760CDB31', version: 1 },
  '760CDB31_2': { sn8: '760CDB31', version: 2 }, //国标升级
  '760CDB31_3': { sn8: '760CDB31', version: 3 }, //时序升级一级能效
  '760DB312_0': { sn8: '760DB312', version: 0 },
  '760DB312_1': { sn8: '760DB312', version: 1 },
  '760DB312_2': { sn8: '760DB312', version: 2 }, //国标升级
  '760DB312_3': { sn8: '760DB312', version: 3 }, //时序升级一级能效
  '760FB212_0': { sn8: '760FB212', version: 0 },
  '760FB212_1': { sn8: '760FB212', version: 1 },
  '76000014_0': { sn8: '76000014', version: 0 }, //CDS15B5
  '7600001D_0': { sn8: '7600001D', version: 0 },
  '7600001E_0': { sn8: '7600001E', version: 0 }, //通用主板 CDS15G13
  '7600001F_0': { sn8: '7600001F', version: 0 }, //通用主板 CDS15G33
  '760DB312_4': { sn8: '760DB312', version: 4 }, //B3-B新增OTA
  '760CDB31_4': { sn8: '760CDB31', version: 4 }, //B3新增OTA
  '7600001A_0': { sn8: '7600001A', version: 0 }, //G06新增OTA
  '760Y0006_0': { sn8: '760Y0006', version: 0 }, //CDFB15G31
  '760Y0007_0': { sn8: '760Y0007', version: 0 }, //CDFB315

  // "00000M10_0": {sn8:"00000M10",version:0},//M10_
  // "00000M10_1": {sn8:"00000M10",version:1},//M10_
  // "7600061B_0": {sn8:"00W3909R",version:0},//H4-Pro_完全借用00W3909R
  // "7600061B_1": {sn8:"00W3909R",version:1},//H4-Pro_完全借用00W3909R
  // "7600061B_2": {sn8:"00W3909R",version:2},//H4-Pro_完全借用00W3909R
  // "760BLV66_0": {sn8:"00W3909R",version:0},//BLV66_借用W3909R 市场型号为BVL66DW
  // "760BLV66_1": {sn8:"00W3909R",version:1},//BLV66_
  // "760BLV66_2": {sn8:"00W3909R",version:2},//BLV66_
  // "00W3909R_0": {sn8:"00W3909R",version:0},//H4P_
  // "00W3909R_1": {sn8:"00W3909R",version:1},//H4P_
  // "00W3909R_2": {sn8:"00W3909R",version:2},//H4P_
  // "000W5601_0": {sn8:"000W5601",version:0},//RX600_
  // "000W5601_1": {sn8:"000W5601",version:1},//RX600_
  // "76000619_0": {sn8:"000W5601",version:0},//TM213_
  // "76000619_1": {sn8:"000W5601",version:1},//TM213_
  // "760GX6HP_0": {sn8:"000W5601",version:0},//GX600Plus_
  // "760GX6HP_1": {sn8:"000W5601",version:1},//GX600Plus_
  // "760000V5_0": {sn8:"760000V5",version:0},//V5_
  // "760000V5_1": {sn8:"760000V5",version:1},//V5_
  // "760000GZ_0": {sn8:"760000V5",version:0},//G3_
  // "760000GZ_1": {sn8:"760000V5",version:1},//G3_
  // "7600JV20_0": {sn8:"7600JV20",version:0},//JV20_
  // "7600JV20_1": {sn8:"7600JV20",version:1},//JV20_国标升级
  // "7600JV20_2": {sn8:"7600JV20",version:2},//JV20_由于与RX20G共用软件，跟着一起升为2版本
  // "760RX10P_0": {sn8:"7600JV20",version:0},//RX10 Pro_
  // "760RX10P_1": {sn8:"7600JV20",version:1},//RX10 Pro_国标升级，借用JV20
  // "760RX10P_2": {sn8:"7600JV20",version:2},//RX10 Pro_由于与RX20G共用软件，跟着一起升为2版本
  // "76000P40_0": {sn8:"76000P40",version:0},//P40_
  // "76000P40_1": {sn8:"76000P40",version:1},//P40_
  // "76000614_0": {sn8:"76000P40",version:0},//P40-B_
  // "76000614_1": {sn8:"76000P40",version:1},//P40-B_
  // "760BLV88_0": {sn8:"76000P40",version:0},//760BLV88_BW5302B =sn8=> 760BLV88 借用P40 BVL88DW 编程芯片改变，电控程序不一样，只是功能完全借用的P40 v0
  // "760BLV88_1": {sn8:"76000P40",version:1},//760BLV88_BW5302B =sn8=> 760BLV88 借用P40 BVL88DW 编程芯片改变，电控程序不一样，只是功能完全借用的P40 v0
  // "00000H3P_0": {sn8:"00000H3P",version:0},//H3-Plus_
  // "00000H3P_1": {sn8:"00000H3P",version:1},//H3-Plus_
  // "00000H3P_2": {sn8:"00000H3P",version:2},//H3-Plus_
  // ==============================================================
  //AB版机型
  '000000H1_0': { sn8: '000000H1', version: 0 },
  '000000H1_1': { sn8: '000000H1', version: 1 },
  '000000H1_A': { sn8: '000000H1', version: 'A' },
  '000000H1_B': { sn8: '000000H1', version: 'B' },
  '000000L2_0': { sn8: '000000L2', version: 0 },
  '000000L2_A': { sn8: '000000L2', version: 'A' },
  '000000L2_B': { sn8: '000000L2', version: 'B' },
  '00W3602H_0': { sn8: '00W3602H', version: 0 },
  '00W3602H_A': { sn8: '00W3602H', version: 'A' },
  '00W3602H_B': { sn8: '00W3602H', version: 'B' },
  '00W3802H_0': { sn8: '00W3802H', version: 0 },
  '00W3802H_A': { sn8: '00W3802H', version: 'A' },
  '00W3802H_B': { sn8: '00W3802H', version: 'B' },
  //常规机型
  '000000F1_0': { sn8: '000000F1', version: 0 },
  '000000F4_0': { sn8: '000000F4', version: 0 },
  '000000H3_0': { sn8: '000000H3', version: 0 },
  '000000H3_1': { sn8: '000000H3', version: 1 },
  '000000H3_2': { sn8: '000000H3', version: 2 },
  '000000H4_0': { sn8: '000000H4', version: 0 },
  '000000H4_1': { sn8: '000000H4', version: 1 },
  '000000H5_0': { sn8: '000000H5', version: 0 },
  '000000J1_0': { sn8: '000000J1', version: 0 },
  '000000K1_0': { sn8: '000000K1', version: 0 },
  '000000K1_1': { sn8: '000000K1', version: 1 },
  '000000K2_0': { sn8: '000000K2', version: 0 },
  '000000K2_1': { sn8: '000000K2', version: 1 },
  '000000K2_2': { sn8: '000000K2', version: 2 },
  '000000K2_3': { sn8: '000000K2', version: 2 }, //3版本解決开关机延迟问题，和ZW01一起更新
  '000000L1_0': { sn8: '000000L1', version: 0 },
  '000000L3_0': { sn8: '000000L3', version: 0 },
  '000000L3_1': { sn8: '000000L3', version: 1 },
  '000000L3_2': { sn8: '000000L3', version: 2 },
  '000000L3_3': { sn8: '000000L3', version: 3 },
  '000000M6_0': { sn8: '000000M6', version: 0 }, // 开发者平台无
  '000000M7_0': { sn8: '000000M7', version: 0 }, // 开发者平台无
  '000000MT_0': { sn8: '000000MT', version: 0 },
  '000000Q1_0': { sn8: '000000Q1', version: 0 }, // 开发者平台无
  '000000S2_0': { sn8: '000000S2', version: 0 },
  '000000S3_0': { sn8: '000000S3', version: 0 },
  '000000V1_0': { sn8: '000000V1', version: 0 },
  '000000X3_0': { sn8: '000000X3', version: 0 },
  '000000X4_0': { sn8: '000000X4', version: 0 },
  '000000X4_1': { sn8: '000000X4', version: 1 },
  '000000X4_2': { sn8: '000000X4', version: 2 },
  '000000X5_0': { sn8: '000000X5', version: 0 }, // 开发者平台无
  '000000X6_0': { sn8: '000000X6', version: 0 },
  '000000Y1_0': { sn8: '000000Y1', version: 0 }, // 开发者平台无
  '00000D18_0': { sn8: '00000D18', version: 0 },
  '00000D18_1': { sn8: '00000D18', version: 1 },
  '00000F2A_0': { sn8: '00000F2A', version: 0 },
  '00000F3B_0': { sn8: '00000F3B', version: 0 },
  '00000F3B_1': { sn8: '00000F3B', version: 1 },
  '00000H3D_0': { sn8: '00000H3D', version: 0 },
  '00000H3D_1': { sn8: '00000H3D', version: 1 },
  '00000H3P_0': { sn8: '00000H3P', version: 0 },
  '00000H3P_1': { sn8: '00000H3P', version: 1 },
  '00000H3P_2': { sn8: '00000H3P', version: 2 },
  '00000H3S_0': { sn8: '00000H3S', version: 0 },
  '00000H3S_1': { sn8: '00000H3S', version: 1 },
  '00000M10_0': { sn8: '00000M10', version: 0 },
  '00000M10_1': { sn8: '00000M10', version: 1 },
  '00000P10_0': { sn8: '00000P10', version: 0 },
  '00000P30_0': { sn8: '00000P30', version: 0 }, // 开发者平台无
  '00000P30_1': { sn8: '00000P30', version: 1 },
  '00000P30_2': { sn8: '00000P30', version: 2 },
  '00000P30_3': { sn8: '00000P30', version: 3 },
  '00000X4S_0': { sn8: '00000X4S', version: 0 }, // 开发者平台无
  '00003906_0': { sn8: '00003906', version: 0 },
  '0000D25A_0': { sn8: '0000D25A', version: 0 },
  '0000D26A_0': { sn8: '0000D26A', version: 0 },
  '0000D26W_0': { sn8: '0000D26W', version: 0 },
  '0000RX10_0': { sn8: '0000RX10', version: 0 },
  '0000RX30_0': { sn8: '0000RX30', version: 0 },
  '0000RX30_1': { sn8: '0000RX30', version: 1 },
  '0000RX30_2': { sn8: '0000RX30', version: 2 },
  '0000V1E6_0': { sn8: '0000V1E6', version: 0 },
  '0000V1E6_1': { sn8: '0000V1E6', version: 1 },
  '0000V1E6_2': { sn8: '0000V1E6', version: 2 },
  '000W5601_0': { sn8: '000W5601', version: 0 },
  '000W5601_1': { sn8: '000W5601', version: 1 },
  '000W5601_2': { sn8: '000W5601', version: 0 }, //市场无2版本，解决GX600的2版本烧录错误成RX600的SN。
  '000W5601_3': { sn8: '000W5601', version: 3 },
  '000W8501_0': { sn8: '000W8501', version: 0 },
  '00W2601C_0': { sn8: '00W2601C', version: 0 },
  '00W3602K_0': { sn8: '00W3602K', version: 0 },
  '00W3909R_0': { sn8: '00W3909R', version: 0 },
  '00W3909R_1': { sn8: '00W3909R', version: 1 },
  '00W3909R_2': { sn8: '00W3909R', version: 2 },
  '00W7635R_0': { sn8: '00W7635R', version: 0 },
  '0HW2601C_0': { sn8: '0HW2601C', version: 0 },
  '0HW2601C_1': { sn8: '0HW2601C', version: 1 },
  '0HW2601C_2': { sn8: '0HW2601C', version: 2 },
  '0W3905CN_0': { sn8: '0W3905CN', version: 0 },
  '11111M10_0': { sn8: '11111M10', version: 0 },
  '76000001_0': { sn8: '76000001', version: 0 },
  '76000002_0': { sn8: '76000002', version: 0 },
  '76000002_1': { sn8: '76000002', version: 1 },
  '76000002_2': { sn8: '76000002', version: 2 },
  '76000003_0': { sn8: '76000003', version: 0 },
  '76000007_0': { sn8: '76000007', version: 0 },
  '76000007_1': { sn8: '76000007', version: 1 },
  '76000009_0': { sn8: '76000009', version: 0 },
  '76000009_1': { sn8: '76000009', version: 1 },
  '76000009_2': { sn8: '76000009', version: 2 },
  '76000012_0': { sn8: '76000012', version: 0 },
  '76000012_1': { sn8: '76000012', version: 1 },
  '76000015_0': { sn8: '76000015', version: 0 },
  '76000015_1': { sn8: '76000015', version: 1 }, // OTA升级
  '76000016_0': { sn8: '76000016', version: 0 },
  '76000017_0': { sn8: '76000017', version: 0 },
  '76000018_0': { sn8: '76000018', version: 0 }, //电控0版本节能洗是135
  '76000018_1': { sn8: '76000018', version: 1 }, //电控1版本节能洗是140
  '760000C1_0': { sn8: '760000C1', version: 0 },
  '760000E1_0': { sn8: '760000E1', version: 0 },
  '760000GZ_0': { sn8: '760000GZ', version: 0 },
  '760000GZ_1': { sn8: '760000GZ', version: 1 },
  '760000LX_0': { sn8: '760000LX', version: 0 },
  '760000LX_1': { sn8: '760000LX', version: 1 },
  '760000M1_0': { sn8: '760000M1', version: 0 },
  '760000M1_1': { sn8: '760000M1', version: 1 },
  '760000M8_0': { sn8: '760000M8', version: 0 },
  '760000Q7_0': { sn8: '760000Q7', version: 0 },
  '760000V2_0': { sn8: '760000V2', version: 0 },
  '760000V3_0': { sn8: '760000V3', version: 0 },
  '760000V3_1': { sn8: '760000V3', version: 1 },
  '760000V5_0': { sn8: '760000V5', version: 0 },
  '760000V5_1': { sn8: '760000V5', version: 1 },
  '76000572_0': { sn8: '76000572', version: 0 },
  '76000572_1': { sn8: '76000572', version: 1 },
  '76000593_0': { sn8: '76000593', version: 0 },
  '76000594_0': { sn8: '76000594', version: 0 },
  '76000594_1': { sn8: '76000594', version: 1 },
  '76000601_0': { sn8: '76000601', version: 0 },
  '76000608_0': { sn8: '76000608', version: 0 },
  '76000608_1': { sn8: '76000608', version: 1 },
  '76000608_2': { sn8: '76000608', version: 2 }, // OTA升级
  '76000608_3': { sn8: '76000608', version: 3 }, // 节能洗时序升级
  '76000610_0': { sn8: '76000610', version: 0 },
  '76000610_1': { sn8: '76000610', version: 1 },
  '76000610_2': { sn8: '76000610', version: 2 },
  '76000611_0': { sn8: '76000611', version: 0 },
  '76000611_1': { sn8: '76000611', version: 1 },
  '76000611_2': { sn8: '76000611', version: 2 }, // OTA升级
  '76000612_0': { sn8: '76000612', version: 0 }, // 开发者平台无
  '76000613_0': { sn8: '76000613', version: 0 },
  '76000613_1': { sn8: '76000613', version: 1 },
  '76000613_2': { sn8: '76000613', version: 2 },
  '76000614_0': { sn8: '76000614', version: 0 },
  '76000614_1': { sn8: '76000614', version: 1 },
  '76000614_2': { sn8: '76000614', version: 2 }, // p40-b旧品升级
  '76000615_0': { sn8: '76000615', version: 0 },
  '76000615_1': { sn8: '76000615', version: 1 },
  '76000616_0': { sn8: '76000616', version: 0 },
  '76000616_1': { sn8: '76000616', version: 1 },
  '76000617_0': { sn8: '76000617', version: 0 },
  '76000617_1': { sn8: '76000617', version: 1 },
  '76000618_0': { sn8: '76000618', version: 0 },
  '76000618_1': { sn8: '76000618', version: 1 },
  '76000618_2': { sn8: '76000618', version: 2 }, // OTA升级
  '76000619_0': { sn8: '76000619', version: 0 },
  '76000619_1': { sn8: '76000619', version: 1 },
  '7600061A_0': { sn8: '7600061A', version: 0 },
  '7600061A_1': { sn8: '7600061A', version: 1 },
  '7600061A_2': { sn8: '7600061A', version: 2 },
  '7600061B_0': { sn8: '7600061B', version: 0 },
  '7600061C_0': { sn8: '7600061C', version: 0 },
  '7600061C_1': { sn8: '7600061C', version: 1 },
  '7600061C_2': { sn8: '7600061C', version: 2 },
  '7600061C_3': { sn8: '7600061C', version: 3 },
  '7600061D_0': { sn8: '7600061D', version: 0 },
  '7600061D_1': { sn8: '7600061D', version: 1 },
  '7600061D_2': { sn8: '7600061D', version: 2 },
  '7600061D_3': { sn8: '7600061D', version: 3 },
  '7600061E_0': { sn8: '7600061E', version: 0 },
  '7600061F_0': { sn8: '7600061F', version: 0 },
  '7600061F_1': { sn8: '7600061F', version: 1 },
  '7600061F_2': { sn8: '7600061F', version: 2 },
  '7600061F_3': { sn8: '7600061F', version: 3 },
  '7600061H_0': { sn8: '7600061H', version: 0 },
  '7600061J_0': { sn8: '7600061J', version: 0 },
  '7600061L_0': { sn8: '7600061L', version: 0 },
  '7600061L_1': { sn8: '7600061L', version: 1 },
  '7600061M_0': { sn8: '7600061M', version: 0 },
  '7600061M_1': { sn8: '7600061M', version: 1 },
  '7600061N_0': { sn8: '7600061N', version: 0 },
  '7600061P_0': { sn8: '7600061P', version: 0 },
  '7600061T_0': { sn8: '7600061T', version: 0 }, // 开发者平台无
  '7600061Y_0': { sn8: '7600061Y', version: 0 },
  '7600061Y_1': { sn8: '7600061Y', version: 1 }, // 升级OTA
  '7600061Z_0': { sn8: '7600061Z', version: 0 },
  '76000621_0': { sn8: '76000621', version: 0 },
  '76000621_1': { sn8: '76000621', version: 1 },
  '76000622_0': { sn8: '76000622', version: 0 },
  '76000623_0': { sn8: '76000623', version: 0 },
  '76000624_0': { sn8: '76000624', version: 0 },
  '76000627_0': { sn8: '76000627', version: 0 },
  '76000628_0': { sn8: '76000628', version: 0 },
  '76000628_1': { sn8: '76000628', version: 1 }, // AQ100 升级OTA
  '76000629_0': { sn8: '76000629', version: 0 },
  '76000CF4_0': { sn8: '76000CF4', version: 0 },
  '76000CF4_1': { sn8: '76000CF4', version: 1 },
  '76000D25_0': { sn8: '76000D25', version: 0 },
  '76000JV8_0': { sn8: '76000JV8', version: 0 },
  '76000JV8_1': { sn8: '76000JV8', version: 1 },
  '76000MG1_0': { sn8: '76000MG1', version: 0 },
  '76000MG1_1': { sn8: '76000MG1', version: 1 },
  '76000NS8_0': { sn8: '76000NS8', version: 0 },
  '76000NS8_1': { sn8: '76000NS8', version: 1 },
  '76000P40_0': { sn8: '76000P40', version: 0 },
  '76000P40_1': { sn8: '76000P40', version: 1 },
  '76000P40_2': { sn8: '76000P40', version: 2 }, // P40旧品升级
  '76000UP2_0': { sn8: '76000UP2', version: 0 },
  '76000X5B_0': { sn8: '76000X5B', version: 0 },
  '76000X5B_1': { sn8: '76000X5B', version: 1 },
  '76000X5B_2': { sn8: '76000X5B', version: 2 },
  '7600BF01_0': { sn8: '7600BF01', version: 0 },
  '7600BF03_0': { sn8: '7600BF03', version: 0 },
  '7600GX1K_0': { sn8: '7600GX1K', version: 0 },
  '7600GX1K_1': { sn8: '7600GX1K', version: 1 },
  '7600H0P9_0': { sn8: '7600H0P9', version: 0 },
  '7600H0P9_1': { sn8: '7600H0P9', version: 1 },
  '7600JV13_0': { sn8: '7600JV13', version: 0 },
  '7600JV13_1': { sn8: '7600JV13', version: 1 },
  '7600JV13_2': { sn8: '7600JV13', version: 2 },
  '7600JV13_3': { sn8: '7600JV13', version: 3 },
  '7600JV20_0': { sn8: '7600JV20', version: 0 },
  '7600JV20_1': { sn8: '7600JV20', version: 1 },
  '7600JV20_2': { sn8: '7600JV20', version: 2 },
  '7600JV20_3': { sn8: '7600JV20', version: 3 },
  '7600M10P_0': { sn8: '7600M10P', version: 0 },
  '7600P23Q_0': { sn8: '7600P23Q', version: 0 },
  '7600P23Q_1': { sn8: '7600P23Q', version: 1 },
  '7600P30S_0': { sn8: '7600P30S', version: 0 },
  '7600P30S_2': { sn8: '7600P30S', version: 2 },
  '7600P30S_3': { sn8: '7600P30S', version: 3 },
  '7600P40P_0': { sn8: '7600P40P', version: 0 }, // 开发者平台暂无
  '7600RX20_0': { sn8: '7600RX20', version: 0 },
  '7600RX20_1': { sn8: '7600RX20', version: 1 },
  '7600RX20_2': { sn8: '7600RX20', version: 2 },
  '7600RX20_3': { sn8: '7600RX20', version: 3 }, // OTA升级
  '7600RX50_0': { sn8: '7600RX50', version: 0 },
  '7600RX50_1': { sn8: '7600RX50', version: 1 },
  '7600RX50_2': { sn8: '7600RX50', version: 2 },
  '7600RX50_3': { sn8: '7600RX50', version: 3 },
  '7600V1E0_0': { sn8: '7600V1E0', version: 0 },
  '7600V1E7_0': { sn8: '7600V1E7', version: 0 },
  '7600V1E7_1': { sn8: '7600V1E7', version: 1 },
  '7600V1E7_2': { sn8: '7600V1E7', version: 2 },
  '7600V1E9_0': { sn8: '7600V1E9', version: 0 },
  '7600V1E9_1': { sn8: '7600V1E9', version: 1 },
  '7603602D_0': { sn8: '7603602D', version: 0 },
  '7603602D_1': { sn8: '7603602D', version: 1 }, // OTA 升级
  '7603905P_0': { sn8: '7603905P', version: 0 },
  '7603905P_1': { sn8: '7603905P', version: 1 },
  '7603905P_2': { sn8: '7603905P', version: 2 },
  '7607636X_0': { sn8: '7607636X', version: 0 },
  '760BLV66_0': { sn8: '760BLV66', version: 0 },
  '760BLV66_1': { sn8: '760BLV66', version: 1 },
  '760BLV88_0': { sn8: '760BLV88', version: 0 },
  '760BVL68_0': { sn8: '760BVL68', version: 0 },
  '760BVL68_1': { sn8: '760BVL68', version: 1 },
  '760GX600_0': { sn8: '760GX600', version: 0 },
  '760GX600_1': { sn8: '760GX600', version: 1 },
  '760GX600_2': { sn8: '760GX600', version: 2 },
  '760GX600_3': { sn8: '760GX600', version: 3 },
  '760GX6HP_0': { sn8: '760GX6HP', version: 0 },
  '760GX6HP_1': { sn8: '760GX6HP', version: 1 },
  '760GX800_0': { sn8: '760GX800', version: 0 },
  '760GX800_1': { sn8: '760GX800', version: 1 }, //GX800_电控上报的附加功能值不对，所以选中附加和运行结束后不同步（电控已知问题，产品已上市无法修改）
  '760GX800_2': { sn8: '760GX800', version: 2 }, //OTA升级
  '760JD103_0': { sn8: '760JD103', version: 0 },
  '760JD103_1': { sn8: '760JD103', version: 1 },
  '760JD201_0': { sn8: '760JD201', version: 0 },
  '760JV800_0': { sn8: '760JV800', version: 0 },
  '760JV800_1': { sn8: '760JV800', version: 1 },
  '760JV800_2': { sn8: '760JV800', version: 2 }, //OTA升级
  '7600644D_0': { sn8: '7600644D', version: 0 }, // JV800S
  '760M10CD_0': { sn8: '760M10CD', version: 0 },
  '760P0P23_0': { sn8: '760P0P23', version: 0 },
  '760P0P23_1': { sn8: '760P0P23', version: 1 },
  '760P0P23_2': { sn8: '760P0P23', version: 2 },
  '760P0P23_3': { sn8: '760P0P23', version: 3 },
  '760P0P36_0': { sn8: '760P0P36', version: 0 }, // 开发者平台暂无
  '760P30PL_0': { sn8: '760P30PL', version: 0 },
  '760P30PL_1': { sn8: '760P30PL', version: 1 },
  '760P40T1_0': { sn8: '760P40T1', version: 0 },
  '760RX10P_0': { sn8: '760RX10P', version: 0 },
  '760RX10P_1': { sn8: '760RX10P', version: 1 },
  '760RX10P_2': { sn8: '760RX10P', version: 2 },
  '760RX10P_3': { sn8: '760RX10P', version: 3 },
  '760RX20G_0': { sn8: '760RX20G', version: 0 },
  '760RX20G_1': { sn8: '760RX20G', version: 1 },
  '760RX20G_2': { sn8: '760RX20G', version: 2 },
  '760RX20S_0': { sn8: '760RX20S', version: 0 },
  '760RX20S_1': { sn8: '760RX20S', version: 1 },
  '760RX20S_2': { sn8: '760RX20S', version: 2 },
  '760SN101_0': { sn8: '760SN101', version: 0 },
  '760TM101_0': { sn8: '760TM101', version: 0 },
  '760V1E10_0': { sn8: '760V1E10', version: 0 },
  '760V1E10_1': { sn8: '760V1E10', version: 1 },
  '760WE203_0': { sn8: '760WE203', version: 0 },
  '760WE203_1': { sn8: '760WE203', version: 1 },
  '760WE203_2': { sn8: '760WE203', version: 2 },
  '760WE203_3': { sn8: '760WE203', version: 3 },
  '76000595_0': { sn8: '76000595', version: 0 },
  '7600062D_0': { sn8: '7600062D', version: 0 }, //NX100
  '7600062D_1': { sn8: '7600062D', version: 1 }, //NX100 OTA升级
  '7600062G_0': { sn8: '7600062G', version: 0 },
  '7600062G_1': { sn8: '7600062G', version: 1 },
  '7600062E_0': { sn8: '7600062E', version: 0 },
  '7600062E_1': { sn8: '7600062E', version: 1 },
  '7600062E_2': { sn8: '7600062E', version: 2 },
  '7600062E_3': { sn8: '7600062E', version: 2 }, //zw01解决开关机延迟问题，其它版本没有用
  '7600062J_0': { sn8: '7600062J', version: 0 }, //X-PRO,新品
  '7600062B_0': { sn8: '7600062B', version: 0 }, //Master-U
  '7600062B_1': { sn8: '7600062B', version: 0 }, //Master-U
  '7600062C_0': { sn8: '7600062C', version: 0 }, //ZG40
  '760Y0001_0': { sn8: '760Y0001', version: 0 }, //Nano8,借用机型NX100,SN8为7600062D,云洗涤新增除菌洗
  '760Y0001_1': { sn8: '760Y0001', version: 1 }, //旧品升级
  '7600062L_0': { sn8: '7600062L', version: 0 }, //RX70,新品，时序号是DKGF-SXA33-2020
  '7600062H_0': { sn8: '7600062H', version: 0 }, //F50,新品
  '7600062H_1': { sn8: '7600062H', version: 1 }, //F50 OTA升级
  '7600062H_2': { sn8: '7600062H', version: 2 }, //能效升级
  '7600062R_0': { sn8: '7600062R', version: 0 }, //WX10,新品,完全借用760000GZ,版本号也借用
  '7600062R_1': { sn8: '7600062R', version: 1 }, //WX10,新品,完全借用760000GZ,版本号也借用
  '7600062P_0': { sn8: '7600062P', version: 0 }, //AQ80,新品
  '7600062Q_0': { sn8: '7600062Q', version: 0 }, //VX10,新品
  '7600643T_0': { sn8: '7600643T', version: 0 }, //P50,新品,完全借用X-PRO
  '7600643T_1': { sn8: '7600643T', version: 1 }, //P50,OTA升级
  '7600061K_0': { sn8: '7600061K', version: 0 },

  '7600061K_1': { sn8: '7600061K', version: 1 }, //LS20新品，完全借用P40-B
  '7600062K_0': { sn8: '7600062K', version: 0 }, //RX600新，RX600换整机编码，当成新品做，用新的SN8
  '7600062T_0': { sn8: '7600062T', version: 0 }, //GX800新，GX800换整机编码，当成新品做，用新的SN8
  '7600062T_1': { sn8: '7600062T', version: 1 }, //ECO时序
  '7600062U_0': { sn8: '7600062U', version: 0 }, //GX600新，GX600换整机编码，当成新品做，用新的SN8
  '76000596_0': { sn8: '76000596', version: 0 }, //MK01SCA新，有水位强度
  '76000596_1': { sn8: '76000596', version: 0 }, //MK01SCA新，有水位强度
  '76000596_2': { sn8: '76000596', version: 0 }, //MK01SCA新，有水位强度
  '7600063Z_0': { sn8: '7600063Z', version: 0 }, //JV600新，完全借用RX70
  '7600643U_0': { sn8: '7600643U', version: 0 }, //P60新
  '7600643V_0': { sn8: '7600643V', version: 0 }, //V8新
  '7600643Z_0': { sn8: '7600643Z', version: 0 }, //RX600-w,完全借用RX600S
  '76000642_0': { sn8: '76000642', version: 0 }, //RX90新品
  '76000642_1': { sn8: '76000642', version: 1 }, //RX90旧品升级
  '7600643X_0': { sn8: '7600643X', version: 0 }, //Up2(颐享)
  '76000613_3': { sn8: '76000613', version: 3 }, //P60新增OTA，二版本电控端没有找到对应的版本程序
  '7600GX1K_2': { sn8: '7600GX1K', version: 2 }, //GX1000新增OTA
  '000W5601_4': { sn8: '000W5601', version: 4 }, //RX600新增OTA
  '760Y0002_0': { sn8: '760Y0002', version: 0 }, //AIR8新品
  '760Y0002_1': { sn8: '760Y0002', version: 1 }, //AIR8 OTA升级
  '76006440_0': { sn8: '76006440', version: 0 }, //P40-PRO
  '76006440_1': { sn8: '76006440', version: 1 }, //P40-PRO旧品升级
  '76006440_2': { sn8: '76006440', version: 2 }, //P40-PRO升级语音
  '76006441_0': { sn8: '76006441', version: 0 }, //P40-Top
  '76006441_1': { sn8: '76006441', version: 1 }, // P40-Top旧品升级
  '76006441_2': { sn8: '76006441', version: 2 }, //P40-Top升级语音
  '7600062S_0': { sn8: '7600062S', version: 0 }, //F70
  '7600062S_1': { sn8: '7600062S', version: 1 }, //F70 OTA升级
  '7600062S_2': { sn8: '7600062S', version: 2 }, //F70 OTA升级
  '760Y0004_0': { sn8: '760Y0004', version: 0 }, //NANO3 内置小美inside
  '760Y0005_0': { sn8: '760Y0005', version: 0 }, //Hop6新品开发
  '760Y0003_0': { sn8: '760Y0003', version: 0 }, //Nano10新品
  '76006443_0': { sn8: '76006443', version: 0 },
  '76006443_1': { sn8: '76006443', version: 1 }, //JX15-G新品开发 完全借用jx15
  '76006444_0': { sn8: '76006444', version: 0 }, // 新品X5-G完全借用X5-B
  '76006444_1': { sn8: '76006444', version: 1 },
  // "76006447_1": { sn8: "76006447", version: 1 }, //P40-B旧品升级
  // "76006446_0": { sn8: "76006446", version: 0 }, //P40旧品升级 已取消换新的SN8
  '76006442_0': { sn8: '76006442', version: 0 }, //JV700 完全借用76000642
  '76006442_1': { sn8: '76006442', version: 1 }, //JV700 完全借用76000642
  '7600644A_0': { sn8: '7600644A', version: 0 }, // RX800新品
  '7600644C_0': { sn8: '7600644C', version: 0 }, // GX1000S完全借用GX1000
  '76006449_0': { sn8: '76006449', version: 0 }, //GX200,新品
  '7600644G_0': { sn8: '7600644G', version: 0 },
  '7600644G_1': { sn8: '7600644G', version: 1 },
  '7600644G_2': { sn8: '7600644G', version: 2 },
  '7600644G_3': { sn8: '7600644G', version: 3 }, // 完全借用原机型：RX10 Pro（整机编码：71076010Z00341），仅更改整机编码和SN8码
  '7600644F_0': { sn8: '7600644F', version: 0 }, //RX600P,新品，完全借用RX600S
  '7600644J_0': { sn8: '7600644J', version: 0 }, //BX2S,新品，完全借用MK02GA升级的版本1，无0版本
  '7600644J_1': { sn8: '7600644J', version: 1 }, //BX2S,新品，完全借用MK02GA升级的版本1，无0版本
  '7600644B_0': { sn8: '7600644B', version: 0 }, //GX1200,新品
  '7600644H_0': { sn8: '7600644H', version: 0 }, //GX800S,新品
  '7600644N_0': { sn8: '7600644N', version: 0 }, //RX30 更改sn8，完全借用JV13 3版本,新品
  '7600644W_0': { sn8: '7600644W', version: 0 }, //UP2,更改sn8新品
  '7600001B_0': { sn8: '7600001B', version: 0 }, //Vie5，新品借用H3D 0版本
  '76006452_0': { sn8: '76006452', version: 0 }, //H60S新品 0版本
  '76006456_0': { sn8: '76006456', version: 0 }, //RX600W新品 电控借用H60S 0版本 模式有差异
  '76006457_0': { sn8: '76006457', version: 0 }, //RX600S新品 电控借用H60S 0版本 模式有差异
  '76006458_0': { sn8: '76006458', version: 0 }, //RX600P新品 电控借用H60S 0版本 模式有差异
  '76006450_0': { sn8: '76006450', version: 0 }, //S66
  '7600644L_0': { sn8: '7600644L', version: 0 }, //S50,新品
  '7600644Q_0': { sn8: '7600644Q', version: 0 }, //W7,新品
  '76006455_0': { sn8: '76006455', version: 0 }, //X4-Y新品 0版本
}

const isObject = (value) => {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

const _cloneDeep = (value) => {
  return JSON.parse(JSON.stringify(value))
}

const _merge = (source, other) => {
  if (!isObject(source) || !isObject(other)) {
    return other === undefined ? source : other
  }
  // 合并两个对象的 key，另外要区分数组的初始值为 []
  return Object.keys({
    ...source,
    ...other,
  }).reduce(
    (acc, key) => {
      // 递归合并 value
      acc[key] = _merge(source[key], other[key])
      return acc
    },
    Array.isArray(source) ? [] : {}
  )
}

module.exports = Behavior({
  data: {
    pageName: 'pagesConfig',
    pagesConfig: {},
  },

  methods: {
    findBaseExtends(config, versionConfig) {
      let vConfig = _cloneDeep(versionConfig)
      if (!vConfig.extends) {
        return vConfig
      }
      let find = config['version_' + vConfig.extends.version]
      vConfig.extends = undefined
      _merge(find, vConfig)
      return this.findBaseExtends(config, find)
    },
    async getPagesConfig(sn8, version = 0) {
      if (sn8) {
        if (singleVersion.some((x) => x == sn8)) version = 0 //如果只是单版本的那么默认使用version：0  不用取上报的version因为第一版可能是借用的某款机型的第二版，版本号跟随借用的机型未V2。没有多版本的情况，在2.0框架中统一映射为 V0 = 借用的V2。（去除了跨机型借用的情况）
        let settingData
        // console.log(version, "version")
        if (version) {
          settingData = setting[sn8 + '_' + version] || setting[sn8 + '_0']
        } else {
          console.log('iniiii', setting[sn8 + '_0'])
          settingData = setting[sn8 + '_0']
        }
        // if (settingData) {
        try {
          // let config = require("./pages-config/" + settingData.sn8).default;
          // let config = require("./pages-config/allModelConfigs").default[settingData.sn8] // 旧版从本地读取配置文件
          let res = await requestService.request('common', {
            msg: 'getAppModelConfig',
            params: { protype: 'e1', sn8: sn8 },
          })
          if (res && res.data && res.data.result) {
            let configs = JSON.parse(JSON.stringify(res.data.result))
            let config = JSON.parse(configs.config)
            console.log(config, 'config', version)
            if (config) {
              if (config['version_' + version]) {
                let mergedConfig = this.findBaseExtends(config, config['version_' + version])
                console.log('mergedConfig', mergedConfig)
                this.setData({ pagesConfig: mergedConfig })
                return
              } else {
                this.setData({ pagesConfig: config['version_0'] })
                return
              }
            }
          } else {
            this.setData({ pagesConfig: commonConfig })
          }
        } catch (err) {
          this.setData({ pagesConfig: commonConfig })
          return
        }
        // } else {
        //   this.setData({ pagesConfig: commonConfig });
        //   return;
        // }
      } else {
        throw new Error('无SN8等待下一轮计算')
      }
      this.setData({ pagesConfig: commonConfig })
    },
  },
})
