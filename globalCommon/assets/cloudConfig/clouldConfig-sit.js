/*
 * @desc: 云端模块映射表(sit)，接口请求出错时使用本地配置
 * @author: zhucc22
 * @Date: 2023-04-13 09:30:38
 */
const testCloudConfig = {
  version: '1',
  regions: [
    { id: 0, host: 'mp-sit.smartmidea.net' },
    { id: 10, host: 'mp-ali-sit.smartmidea.net' },
    { id: 11, host: 'mp-hw-sit.smartmidea.net' },
    { id: 99, host: 'mp-g-sit.smartmidea.net' },
  ],
  userRegions: [
    '^(/mj|/mjl|)?(/v1|/v2)?/(user|appliance|pro2base|gateway|homepage|third|home|bluetooth|nfc|module|scene|thing|open|api/user|device|homegroup|room|apisix|wx|b2bgateway|auth|wxentrance|situation|remind|QRCode|iot/open|homepage){1}.*$',
    '^/v1/(certificate|remind|applet|app|oss|replaceRepairCard|suite|third|plugin|appliance|devicelist|QRCode|replaceRepair|code|t2){1}.*$',
    '^/app/.*$',
  ],
  fixedRegion: [{ modules: ['^/(mj|mjl)/global/.*$'], region: 99 }],
  sseRegions: [
    { id: 0, host: 'sse-sit.smartmidea.net:9013' },
    { id: 10, host: 'sse-ali-sit.smartmidea.net:9013' },
    { id: 11, host: 'sse-hw-sit.smartmidea.net:9013' },
  ],
}

export default testCloudConfig
