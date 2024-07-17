import {
  analyseSyntax,
  compare
} from '../../../utils/condition'
import {
  cal
} from '../../../utils/calculate'

class PopupParams {
  constructor(selectedMode, deviceStatus, hmsDefaultValue = null) {
    console.log('PopupParams constructor')
    this.selectedMode = selectedMode;
    this.modeSettings = JSON.parse(JSON.stringify(this.selectedMode.mergedSettings))
    this.activeIndex = 0;
    this.settingKeys = Object.keys(this.modeSettings)
    this.sortedSettingKeys = this._sortSettingKeys(this.settingKeys)
    this.editable = !!this.modeSettings.editable
    this.settingGroups = this.selectedMode.settingGroups
    this.showMoreOptions = false
    this.singleSwitch = ''
    this.deviceStatus = deviceStatus;
    this.isWorking = deviceStatus.isWorking;
    this.hmsDefaultValue = this.isWorking ? hmsDefaultValue : null;
    this.changedSettings = {};
    this.bufferChangeSettings = {};
    this.initModeSettings();
  }


  _sortSettingKeys(settingKeys) {
    let sortedSettingKeys = settingKeys.concat()
    for (let i in settingKeys) {
      const settingKey = settingKeys[i]
      const relateKey = this._hasRelateKey(settingKey)
      if (relateKey && settingKeys.indexOf(settingKey) < settingKeys.indexOf(relateKey)) {
        sortedSettingKeys[settingKeys.indexOf(settingKey)] = relateKey
        sortedSettingKeys[settingKeys.indexOf(relateKey)] = settingKey
      }
    }
    return sortedSettingKeys
  }

  _hasRelateKey(settingKey) {
    const elements = Object.keys(this.modeSettings[settingKey])
    const PREFIX = 'relate_'
    for (let ele of elements) {
      if (ele.indexOf(PREFIX) > -1) {
        return ele.replace(PREFIX, '')
      }
    }
    return null
  }

  initModeSettings() {
    this._initDefault()
    this._initShowOption()
    this._initMoreOptions()
    this._initSettingGroups()
  }

  _initDefault() {
    let settingKeys = this.sortedSettingKeys.concat()
    for (let key of settingKeys) {
      const componentType = this.modeSettings[key].componentType
      if (this.selectedMode.isHms(componentType)) {
        this.modeSettings[key].default = this._getHmsDefault(key)
      }

      if (this.selectedMode.isPicker(componentType) || this.selectedMode.isSwitch(componentType) || this.selectedMode
        .isSlider(componentType)) {
        this.modeSettings[key].default = this._getOptionDefault(key)
        const relateKey = this._hasRelateKey(key)
        if (relateKey) {
          this._replaceSettingConfig(key, relateKey)
          if (!this.settingKeys.includes(relateKey)) this.settingKeys.push(relateKey)
          settingKeys.push(relateKey)
        }
      }
    }
  }

  _replaceSettingConfig(settingKey, relateKey) {
    const relateConfig = this.modeSettings[settingKey][`relate_${relateKey}`]

    if (typeof relateConfig === 'string') {
      this._setActiveDefault(settingKey, relateKey)
      return
    }

    const expressions = Object.keys(relateConfig)

    for (let expression of expressions) {
      const {
        key,
        operator,
        value
      } = analyseSyntax(expression)
      const _value = this.modeSettings[key].default || this.modeSettings[key].defaultValue
      if (compare(operator, _value, value)) {
        this.modeSettings[relateKey] = Object.assign({}, this.modeSettings[relateKey], relateConfig[expression])
        break
      }
    }

  }

  _setActiveDefault(settingKey, relateKey) {
    let expression = this.modeSettings[settingKey][`relate_${relateKey}`]
    expression = expression.replace(`{${settingKey}}`, this.modeSettings[settingKey].default)
    const seconds = cal(expression)
    this.modeSettings[relateKey] = Object.assign({}, this.selectedMode.modeDefaultSettings[relateKey], {
      default: this._seconds2Hms(seconds).join(':')
    })
  }

  _seconds2Hms(seconds) {
    const SECOND = 1
    const MINUTE = 60 * SECOND
    const HOUR = 60 * MINUTE

    const h = Math.floor(seconds / HOUR)
    const m = Math.floor((seconds % HOUR) / MINUTE)
    const s = Math.floor((seconds % MINUTE) / SECOND)
    return [h, m, s]
  }

  _initShowOption() {
    for (let key of this.settingKeys) {
      this.modeSettings[key].showOption = this._showOption(key)
    }
  }

  _showOption(localKey) {
    const {
      startForbidden,
      editForbidden,
      expression
    } = this.modeSettings[localKey]
    if (expression) {
      const {
        key,
        operator,
        value
      } = analyseSyntax(expression)
      const target = this.modeSettings[key].default
      if (operator) {
        if (!compare(operator, target, value)) {
          this.deleteFromChangedSettings(localKey)
          this.modeSettings[localKey].default = this.selectedMode.mergedSettings[localKey].default
          return false
        }
      }
    }

    if (!this.isWorking) {
      return !startForbidden
    }

    return !editForbidden
  }

  _initSettingGroups() {
    if (!this.selectedMode.settingGroups) {
      this.settingGroups = [{
        "name": "自动生成",
        "localKeys": this.settingKeys
      }]
    }

    this._validateSettingGroups()
  }

  _validateSettingGroups() {
    this.settingGroups = this.settingGroups.filter(item => this._isSettingGroupVisible(item.localKeys))
  }

  _isSettingGroupVisible(localKeys) {
    const result = localKeys.filter(localKey => this.modeSettings[localKey].showOption)
    return !!result.length
  }

  _initMoreOptions() {
    let filterComponentType = 'switch'
    const f = (key) => {
      const {
        componentType,
        showOption
      } = this.modeSettings[key]
      const firstLetterUpperCaseFilterComponentType = filterComponentType.charAt(0).toUpperCase() +
        filterComponentType.substring(1)
      return this.selectedMode[`is${firstLetterUpperCaseFilterComponentType}`](componentType) && showOption
    }
    const switches = this.settingKeys.filter(f)
    filterComponentType = 'slider'
    const sliders = this.settingKeys.filter(f)
    if (sliders.length > 0 || switches.length > 1) {
      this.showMoreOptions = true
      return
    }

    if (switches) {
      this.singleSwitch = switches[0]
    }
  }

  markChangedSettings(key, value) {
    this.changedSettings[key] = value
    this.initModeSettings()
  }

  markBufferChangedSettings(key, value) {
    this.bufferChangeSettings[key] = value
  }

  deleteFromChangedSettings(key) {
    if (this.changedSettings[key]) {
      delete this.changedSettings[key]
    }

    if (this.bufferChangeSettings[key]) {
      delete this.bufferChangeSettings[key]
    }
  }

  mergeChangedSettings() {

    if (!Object.keys(this.bufferChangeSettings)) {
      return
    }

    Object.assign(this.changedSettings, this.bufferChangeSettings)
    this.bufferChangeSettings = {}
    this.initModeSettings()
  }

  getControlParams() {
    const settingKeys = this.isWorking ? this._getEditableSettingKeys() : this.settingKeys;
    let controlParams = {};

    if (!this.isWorking) {
      controlParams['work_mode'] = this.selectedMode.modeKey.split(',')[0];

      const cloudmenuid = this.selectedMode.cloudmenuid
      if (cloudmenuid) {
        controlParams['cloudmenuid'] = cloudmenuid
      }
    }

    for (let key of settingKeys) {
      const componentType = this.modeSettings[key].componentType
      if (this.selectedMode.isPicker(componentType)) {
        Object.assign(controlParams, this._getControlParam(key))
      }

      if (this.selectedMode.isHms(componentType)) {
        Object.assign(controlParams, this._getHmsControlParam(key))
      }

      if (this.selectedMode.isSwitch(componentType) || this.selectedMode.isSlider(componentType)) {
        Object.assign(controlParams, this._getControlParam(key))
      }
    }
    return controlParams;
  }

  _getEditableSettingKeys() {
    return this.settingKeys.filter(settingKey => {
      return !this.modeSettings[settingKey]['editForbidden']
    })
  }

  _getHmsControlParam(settingKey) {
    const value = this.changedSettings[settingKey] ? this.changedSettings[settingKey] : this.modeSettings[settingKey]
      .default;
    const {
      maxTimeKey
    } = this.selectedMode.pluginConfig
    if (this.isWorking) {
      let [hour_set, minute_set, second_set] = value;
      if (maxTimeKey === 'minute') {
        minute_set = this._getMinutes(hour_set, minute_set)
        hour_set = 0
      }
      return {
        hour_set,
        minute_set,
        second_set
      }
    }
    let [work_hour, work_minute, work_second] = value;
    if (maxTimeKey === 'minute') {
      work_minute = this._getMinutes(work_hour, work_minute)
      work_hour = 0
    }
    return {
      work_hour,
      work_minute,
      work_second
    }
  }

  _getMinutes(h, m) {
    return parseInt(h) * 60 + parseInt(m)
  }

  _getControlParam(settingKey) {
    const componentType = this.modeSettings[settingKey].componentType
    let controlParams = {}
    const value = this.selectedMode.isPicker(componentType) ? this._handlePickerValue(settingKey) : this
      ._handleOptionValue(settingKey);
    const luaKeys = this._getControlLuaKey(this.modeSettings[settingKey]);
    const luaKeyArray = luaKeys.split(',');

    for (let luaKey of luaKeyArray) {
      controlParams[luaKey] = value
    }
    return controlParams;
  }

  _getControlLuaKey({
    luaKey,
    editLuaKey
  }) {
    return this.isWorking && editLuaKey ? editLuaKey : luaKey;
  }

  _handlePickerValue(settingKey) {
    let value = this.changedSettings[settingKey] ? this.changedSettings[settingKey] : this.modeSettings[settingKey]
      .default;
    // if(this.modeSettings[settingKey]['transform2lua']) {
    //   let f = this._generateFunc(this.modeSettings[settingKey].luaKey, this.modeSettings[settingKey]['transform2lua']);
    //   return f(value);
    // }

    // if(settingKey === 'weight') {
    //   return parseInt(value)/10;
    // }

    return value
  }

  _handleOptionValue(settingKey) {
    const value = this.changedSettings[settingKey] ? this.changedSettings[settingKey] : this.modeSettings[settingKey]
      .default;

    return value
  }
  _generateFunc(formalParam, body) {
    return new Function(formalParam, body)
  }

  _getOptionDefault(key) {

    if (this.changedSettings[key] != undefined) {
      return this.changedSettings[key]
    }

    const modeSetting = this.modeSettings[key]
    const {
      luaKey
    } = modeSetting
    const defaultValue = modeSetting.default
    if (this.isWorking) {
      return this.deviceStatus[luaKey] || defaultValue
    }

    return defaultValue
  }

  _getHmsDefault(key) {
    const {
      min,
      max
    } = this.modeSettings[key]

    if (!min || !max) {
      return this._formatHmsDefaultValue(this.modeSettings[key].default)
    }

    let hmsDefaultValue = null
    if (this.isWorking) {
      hmsDefaultValue = this.deviceStatus.showCountDown ? this.hmsDefaultValue : this.deviceStatus._getSettingTime()
    }

    if(!hmsDefaultValue) {
      hmsDefaultValue = this.modeSettings[key].default
    }

    hmsDefaultValue = this.changedSettings[key] || hmsDefaultValue
    hmsDefaultValue = this._formatHmsDefaultValue(this._getBetweenHms(min, max, hmsDefaultValue))
    if (this.changedSettings[key]) {
      this.changedSettings[key] = hmsDefaultValue
    }

    return hmsDefaultValue
  }

  _getBetweenHms(min, max, value) {
    const seconds = this._getSeconds(value)

    if (seconds < this._getSeconds(min)) {
      return min
    }

    if (seconds > this._getSeconds(max)) {
      return max
    }

    return value
  }

  _getMinHms(min, value) {
    if (this._getSeconds(value) < this._getSeconds(min)) {
      return min
    }

    return value
  }

  _getSeconds(hms) {
    const _hms = this._formatHmsDefaultValue(hms)
    return _hms[0] * 3600 + _hms[1] * 60 + _hms[2]
  }

  _formatHmsDefaultValue(hmsDefaultValue) {
    const hmsArray = Array.isArray(hmsDefaultValue) ? hmsDefaultValue : hmsDefaultValue.split(':')
    return hmsArray.map(x => parseInt(x))
  }

}

export default PopupParams
