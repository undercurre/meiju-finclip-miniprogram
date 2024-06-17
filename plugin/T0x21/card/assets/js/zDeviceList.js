/**
 * 子设备分类，按照modelnumber分类，
 * 注意：这里添加之后，需要在index目录下面filterList增加相应的A0
 * @zLOCK: 门锁 '94', '116', '1019'
 * @zSwitch: 开关面板 一路：'67','68'；  二路：'70','71'； 三路：'73','74'； 四路：'75','76'
 * @zSocket: 智能插座 '111'
 */
const zDeviceList = {
  'zLOCK': ['94', '116', '1019'],
  'zSwitch': ['67','68',  '70','71', '73','74', '75','76'],
  'zSocket': ['111']
}

export {
  zDeviceList
}