import { getMapValues } from '../../../utils/util'
class Mode {
  constructor(mode, {
    modeDefaultSettings
  }, pluginConfig) {
    console.log('Mode constructor')
    this._init(mode);
    this.pluginConfig = pluginConfig
    this.beforeValidations = this._initBeforeValidations()
    this.afterValidations = this._initAfterValidations()
    this.settingKeys = mode.settings ? Object.keys(mode.settings) : [];
    this.modeDefaultSettings = modeDefaultSettings
    this.mergedSettings = this._mergeSettings(mode.settings, modeDefaultSettings)
    // this._initMapValues()
  }

  _init(mode) {
    const modeKeys = Object.keys(mode);
    for (let modeKey of modeKeys) {
      if (modeKey === 'settings') {
        continue;
      }
      this[modeKey] = mode[modeKey];
    }
  }

  _mergeSettings(settings, modeDefaultSettings) {
    let mergedSettings = Object.assign({}, settings);
    for (let key of this.settingKeys) {
      mergedSettings[key] = Object.assign({}, modeDefaultSettings[key], mergedSettings[key])
    }
    return mergedSettings;
  }

  _initBeforeValidations() {
    const beforeValitions = this['beforeValidations'] || this['validations'] || []
    const commonValidaitons = this._initCommonValidations()
    return beforeValitions.concat(commonValidaitons)
  }

  _initCommonValidations() {
    const {
      validations
    } = this.pluginConfig
    return validations || []
  }



  _initAfterValidations() {
    const commonValidaitons = this._initCommonValidations()
    const afterValitions = this.pluginConfig['afterValidations'] || []
    const combinedValidations = this.beforeValidations.concat(commonValidaitons).concat(afterValitions)
    return Array.from(new Set(combinedValidations))
  }

  _initMapValues() {
    for (let key of this.settingKeys) {
      const componentType = this.mergedSettings[key].componentType
      if (this.isPicker(componentType) && !this.mergedSettings[key].mapValues) {
        this.mergedSettings[key].mapValues = this._getMapValues(this.mergedSettings[key]);
      }
    }
  }

  _getMapValues(setting) {

    if (!setting.range) {
      return [{
        label: setting.default,
        value: setting.default
      }]
    }

    return this._ranges(setting.range)
  }

  _ranges(rangeArrays) {
    let list = [];

    for (let i = 0; i < rangeArrays.length; i++) {
      list = list.concat(this._range.apply(this, rangeArrays[i]));
    }
    return list;
  }

  _range(start, end, step) {
    var arr = [];
    if (start > end) {
      return arr;
    }
    for (var i = 0; start + i * step <= end; i++) {
      var value = start + step * i;
      arr.push({
        label: value,
        value: value
      })

    }
    return arr;
  }

  getSettingLabelByValue(settingKey, value) {
    const {
      name,
      unit,
      range,
      mapValues,
      defaultValue
    } = this.mergedSettings[settingKey]

    const list = getMapValues(range, mapValues, defaultValue)
    const result = list.filter(mapValue => mapValue.value === value)
    if (!result.length) {
      return null
    }
    return {
      label: name,
      value: result[0].label + (unit || '')
    }
  }

  isPicker(componentType) {
    return componentType === 'picker'
  }

  isHms(componentType) {
    return componentType === 'hms'
  }

  isSwitch(componentType) {
    return componentType === 'switch'
  }

  isSlider(componentType) {
    return componentType === 'slider'
  }
}
export default Mode;
