import Storage from './Storage'
import {
  APP_NAME
} from '../../../utils/const'

class PluginStorage extends Storage {
  constructor() {
    super() // 这个不能少，否则 this undefined
    this.sn8 = ''
    this.cbsVersion = ''
    this.pluginCommonDataKey = `${APP_NAME}_plugin_common_data`
    this.cbsVersionKey = `${APP_NAME}_cbs_version_data`
  }

  setCbsVersion(cbsVersion) {
    this.cbsVersion = cbsVersion
  }

  initSn8(sn8) {
    this.sn8 = sn8
  }

  _getPluginDataKey() {
    const suffix = this.cbsVersion ? '_' + this.cbsVersion : ''
    return `${APP_NAME}_plugin_data_${this.sn8}${suffix}`
  }

  getPluginData() {
    return this.getStorage(this._getPluginDataKey())
  }

  getPluginCommonData() {
    return this.getStorage(this.pluginCommonDataKey)
  }

  getCbsVersionData() {
    return this.getStorage(this.cbsVersionKey)
  }

  setPluginData(data) {
    return this.setStorage(this._getPluginDataKey(), data)
  }

  setPluginCommonData(data) {
    return this.setStorage(this.pluginCommonDataKey, data)
  }

  setCbsVersionData(data) {
    return this.setStorage(this.cbsVersionKey, data)
  }
}

export default PluginStorage
