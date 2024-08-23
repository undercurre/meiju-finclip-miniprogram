/*
 * @desc: sdk升级配置文件
 * @author: zhucc22
 * @Date: 2023-07-11 14:03:36
 */
import { pluginEventTrack } from '../globalCommon/js/commomPlugin'
import { openSubscribeModal } from '../globalCommon/js/deviceSubscribe'
import { modelIds, templateIds } from '../globalCommon/js/templateIds'
import { requestService, requestBurialPoint, rangersBurialPoint } from './requestService'
import { environment, api, baseImgApi, imgBaseUrl, deviceImgApi, commonH5Api, actTemplateImgApi,imageApi } from './../api'
import { getDeviceSn, getDeviceSn8 } from './../pages/common/js/device.js'
import paths from './paths'
import wxList from './../globalCommon/js/wxList.js'
import { receiveSocketMessage } from './initWebsocket.js'
import { getPluginUrl, getPluginPreUrl } from './getPluginUrl'
const bleNegotiation = require('./ble/ble-negotiation')
const registerBLEConnectionStateChange = require('./ble/ble-negotiation')
import { paesrBleResponData, constructionBleControlOrder } from './ble/ble-order'
const config = require('../config')

const globalCommonConfig = {
  pluginEventTrack: pluginEventTrack,
  openSubscribeModal: openSubscribeModal,
  modelIds: modelIds,
  templateIds: templateIds,
  requestService: requestService,
  requestBurialPoint: requestBurialPoint,
  rangersBurialPoint: rangersBurialPoint,
  environment: environment,
  getDeviceSn: getDeviceSn,
  getDeviceSn8: getDeviceSn8,
  api: api,
  appKey: api.appKey,
  baseImgApi: baseImgApi,
  imgBaseUrl: imgBaseUrl,
  paths: paths,
  deviceImgApi,
  commonH5Api,
  receiveSocketMessage,
  getPluginUrl,
  wxList,
  actTemplateImgApi,
  getPluginPreUrl,
  bleNegotiation,
  registerBLEConnectionStateChange,
  paesrBleResponData,
  constructionBleControlOrder,
  config: config,
  imageApi,
}

module.exports = {
  globalCommonConfig,
}
