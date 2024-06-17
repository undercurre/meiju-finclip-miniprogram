/*
 * @desc: 云端模块映射表(生产)，接口请求出错时使用本地配置
 * @author: zhucc22
 * @Date: 2023-04-13 09:30:38
 */
const prodCloudConfig = {
  version: '1',
  regions: [
    { id: 0, host: 'mp-prod.smartmidea.net' },
    { id: 10, host: 'mp-ali.smartmidea.net' },
    { id: 11, host: 'mp-hw.smartmidea.net' },
    { id: 99, host: 'mp-g.smartmidea.net' },
  ],
  userRegions: [
    '^(/mj|/mjl|)?(/v1|/v2)?/(user|appliance|pro2base|gateway|homepage|third|home|bluetooth|nfc|module|scene|thing|open|api/user|device|homegroup|room|apisix|wx|b2bgateway|auth|wxentrance|situation|remind|QRCode|iot/open|homepage){1}.*$',
    '^/v1/(certificate|remind|applet|app|oss|replaceRepairCard|suite|third|plugin|appliance|devicelist|QRCode|replaceRepair|code|t2){1}.*$',
    '^/app/.*$',
  ],
  fixedRegion: [{ modules: ['^/(mj|mjl)/global/.*$'], region: 99 }],
  sseRegions: [
    { id: 0, host: 'sse.smartmidea.net' },
    { id: 10, host: 'sse-ali.smartmidea.net' },
    { id: 11, host: 'sse-hw.smartmidea.net' },
  ],
}

export default prodCloudConfig
