import {analyseSyntax, analyseConditions, conditionsSatisfied} from '../../../utils/condition'
import logger from '../../../utils/log'

const WORK_STATUS_SAVE_POWER = 'save_power'
const WORK_STATUS_STANDBY = 'standby'
const WORK_STATUS_WORK = 'work'
const WORK_STATUS_PAUSE = 'pause'
const WORK_STATUS_PAUSE_C = 'pause_c'
const WORK_STATUS_WORK_FINISH = 'work_finish'
const WORK_STATUS_THREE = 'three'
const WORK_STATUS_RESERVATION = 'order'

const PROBE = '探针'

class DeviceStatus {
  constructor(data, currentMode, pluginCommonConfig) {
    console.log('DeviceStatus constructor')

    this.currentMode = currentMode
    this.pluginCommonConfig = pluginCommonConfig

    // this.appoint_hour = appoint_hour
    // this.appoint_minute = appoint_minute
    // this.appoint_second = appoint_second
    // this.cloudmenuid = this._initAttr(cloudmenuid, true)
    // this.cur_temperature = this._initAttr(cur_temperature, true)
    // this.cur_temperature_above = this._initAttr(cur_temperature_above, true)
    // this.cur_probe_temperature = this._initAttr(cur_probe_temperature, true)
    // this.cur_temperature_underside = this._initAttr(cur_temperature_underside, true)
    // this.change_water = change_water
    // this.door_open = door_open
    // this.error_code = error_code
    // this.fire_power = this._initAttr(fire_power)
    // this.hour_set = this._initAttr(hour_set, true)
    // this.hot_wind = this._initAttr(hot_wind)
    // this.lock = lock
    // this.lack_box = lack_box
    // this.lack_water = lack_water
    // this.minute_set = this._initAttr(minute_set, true)
    // this.offline = offline
    // this.pre_heat = pre_heat
    // this.probe = this._initAttr(probe, true)
    // this.probo_on = this._initAttr(probo_on, true)
    // this.probe_temperature = this._initAttr(probe_temperature, true)
    // this.reaction = reaction
    // this.stepnum = this._initAttr(stepnum, true)
    // this.steam_quantity = this._initAttr(steam_quantity)
    // this.second_set = this._initAttr(second_set, true)
    // this.temperature = temperature
    // this.temperature_above = temperature_above
    // this.tips_code = this._initAttr(tips_code, true)
    // this.temperature_gear = this._initAttr(temperature_gear)
    // this.totalstep = this._initAttr(totalstep, true)
    // this.temperature_underside = temperature_underside
    // this.weight = this._initAttr(weight, true)
    // this.water_status = water_status
    // this.work_mode = this._initAttr(work_mode)
    // this.work_status = work_status
    // this.work_hour = this._initAttr(work_hour, true)
    // this.work_minute = this._initAttr(work_minute, true)
    // this.work_second = this._initAttr(work_second, true)
    this._initLuaKeyValues(data)

    this.appointment = this._getAppointment()
    this.isCloudRecipe = this._isCloudRecipe()
    this.isSensing = this.reaction === 1
    this.isPreheating = this.tips_code === 8 || this.pre_heat === 'work'
    this.isPreheatingTempArrived = this.tips_code === 9 || this.pre_heat === 'end'
    this.isWorking = this._isWorking();
    this.isProbeMode = this.probe === 1 || this.probo_on === 1
    this.probeText = this.isProbeMode ? `（${PROBE}）` : ''
    this.settingSeconds = this._getSettingSeconds()
    this.remainingSeconds = this._getRemainingSeconds()
    this.showCountDown = this._showCountDown()
    this.showContinueButton = this._showContinueButton();
    this.showPauseButton = this._showPauseButton();
    this.showFinishButton = this._showFinishButton();
    this.showCancelButton = this.isWorking && !this.showFinishButton;
    this.progress = this._getProgress();
    this.cookingInfo = this._getCookingInfo();
    this.cookingInfoLimited = this.cookingInfo.slice(0, 3)
    this.orangeText = ''
    this.grayText = ''
    this.workText = this._workText()
    this._setCookingState()
    this.editable = false
    if(this.currentMode) {
      this.editable = this._isEditable()
      this.appointmentTitle = this.currentMode.name + (this.isProbeMode ? this.probeText + '' : '')
    }

    this.isAppointed = this.work_status === WORK_STATUS_RESERVATION;

    // "门状态"
    this.isDoorOpen = this.door_open === 'on'

    // 故障
    this.isError = !!this.error_code

    // "水箱位",
    this.isLackWaterBox = this.tips_code === 6 || this.water_status === "lack_box" || this.lack_box === 1 ? 1 : 0;

    //"缺水位",
    this.isLackWater = this.tips_code === 2 || this.water_status === "lack_water" || this.lack_water === 1 ? 1 : 0;

    // "换水位",
    this.needChangeWater = this.tips_code === 7 || this.water_status === "change_water" || this.change_water === 1 ? 1 : 0;

    // 童锁
    this.isLocked = this.lock && this.lock === 'on'
  }

  _initLuaKeyValues (data) {
    for(let luaKey in data) {
      this[luaKey] = this._initLuaKeyValue(data[luaKey])
    }
  }

  _initLuaKeyValue (value) {
    return value === 'ff' ? null : (isNaN(value) ? value : parseInt(value | 0))
  }

  _initAttr(value, isNumber = false) {
    return value === 'ff' ? null : (isNumber ? parseInt(value || 0) : value)
  }

  _getAppointment() {

    if([this.appoint_hour, this.appoint_minute].indexOf('ff') > -1) {
      return null
    }

    const day = this._getAppointmentDay()
    return {
      day,
      hour: this._addZero(this.appoint_hour),
      minute: this._addZero(this.appoint_minute)
    }
  }

  _getAppointmentDay() {
    const TODAY = '今天'
    const TOMORROW = '明天'
    const now = new Date()
    if(this.appoint_hour > now.getHours() ) {
      return TODAY
    }

    if(this.appoint_hour === now.getHours()) {
      if(this.appoint_minute >= now.getMinutes() ) {
        return TODAY
      }

      return TOMORROW
    }

    return TOMORROW
  }

  _isCloudRecipe() {
    return this.work_mode !== 'auto_menu' && this.cloudmenuid
  }

  _isLastStep() {
    return this.totalstep <= 1 || this.stepnum === this.totalstep
  }

  getTips(validations) {
    const TIPS = this.pluginCommonConfig.globalConfigs["tips"]

    for(let attr of validations) {
      let analysedConditions = analyseConditions(attr)
      let messageKey = this._getMessageKey(Object.keys(analysedConditions), TIPS)
      let _conditionsSatisfied = true

      if(TIPS[messageKey]['conditions']) {
        analysedConditions = Object.assign({}, TIPS[messageKey]['conditions'], analysedConditions)
      }

      _conditionsSatisfied = conditionsSatisfied(this, analysedConditions)

      if(messageKey && _conditionsSatisfied) {
        return TIPS[messageKey]['message']
      }
    }

    return false
  }

  _getMessageKey(analysedConditionsKeys, validations) {
    for(let analysedConditionsKey of analysedConditionsKeys) {
      if(validations[analysedConditionsKey]) {
        return analysedConditionsKey
      }
    }
    return null
  }

  _getLabel(localKey, luaKey) {
    if(!this[luaKey]) {
      return null
    }

    return this.currentMode.getSettingLabelByValue(localKey, this[luaKey])
  }

  _isEditable() {

    if(this.isCloudRecipe || this.isProbeMode) {
      return false
    }

    const {editable, disablePauseEdit, allowPauseEdit} = this.currentMode;

    if(this.showContinueButton) {
      return (!disablePauseEdit && editable)  || allowPauseEdit
    }

    const disablePreheatEdit = this.currentMode.pluginConfig['disablePreheatEdit'] || this.currentMode['disablePreheatEdit']
    if(this.isPreheating || this.isPreheatingTempArrived) {
      return !disablePreheatEdit && editable
    }

    return editable
  }

  _setCookingState() {

    if(this.showFinishButton) {
      this.orangeText = '工作完成'
      this.grayText  = '取出食物时小心烫手'
    }

    if(!this.isWorking) {
      return
    }

    if(this.isPreheatingTempArrived) {
      this.orangeText = '预热完成'
      this.grayText = '开门放入食物'
      return
    }

    if(this.isPreheating || this.isProbeMode) {
      const showSettingTemp = this._showContinueButton()

      const temp = showSettingTemp ? this._getSettingTemperature() : this._getCurrentTemp()
      this.orangeText =  temp ? temp + this._getTempUnit() : ''
      this.grayText = showSettingTemp ? '设置温度' : '当前温度'
      return
    }

    const remaingSeconds = this._getRemainingSeconds()
    if(this.isWorking && remaingSeconds) {
      this.grayText = '剩余时间'
    }

    if(this.isSensing) {
      this.grayText = ''
    }
  }

  _getCurrentTemp() {

    if(this.isProbeMode) {
      return this.cur_probe_temperature
    }

    return this.cur_temperature_above || this.cur_temperature_underside
  }

  _getSettingTemperature() {

    if(this.isProbeMode) {
      return this.probe_temperature
    }

    return this.temperature || this.temperature_above || this.temperature_underside
  }

  _showCountDown() {
    return this.isWorking && this.settingSeconds && !this.isPreheating && !this.isProbeMode && !this.isPreheatingTempArrived && !this.isSensing
  }

  _getTempUnit() {
    return "°C";
  }

  _getCookingInfo() {
    let cookingInfos = [];

    if(!this.currentMode) {
      return cookingInfos
    }

    if(!this.isWorking && !this.showFinishButton) {
      return cookingInfos;
    }

    cookingInfos.push({
      'label': '模式',
      'ingoreLabel': true,
      "value": this.currentMode.name
    });


    const sortedSettingKeys = this.currentMode.settingKeys.sort()
    for(let localKey of sortedSettingKeys) {
      if(localKey === 'time') {
        const {hideTimeProgress} = this.currentMode.pluginConfig
        if(!hideTimeProgress && this.settingSeconds) {
          cookingInfos.push({
            'label': '时间',
            "value": this._getSettingTime()
          })
        }
        continue
      }

      if(localKey === 'temperature') {
        if(this.isProbeMode) {
          cookingInfos.push({
            label: "探针",
            value: this['probe_temperature'] + this._getTempUnit()
          })
          continue
        }
      }

      const cookingInfo = this._formatValue(localKey)
      if(cookingInfo) {
        cookingInfos.push(cookingInfo)
      }
    }

    return cookingInfos
  }

  _formatValue(localKey) {
    const {componentType, luaKey, unit, name} = this.currentMode.mergedSettings[localKey]
    let value = this[luaKey]
    if(!value || value === 'fire_power_0') {
      return null
    }

    if(this.currentMode.isPicker(componentType) || this.currentMode.isSlider(componentType)) {
      return this._getLabel(localKey, luaKey)
    }

    if(this.currentMode.isSwitch(componentType)) {
      return null
      value = value === 'off' ? "关" : "开"
    }

    return {
      label: name,
      value: unit ? value + unit : value
    }
  }

  _getSettingTime() {
    return [this.hour_set, this.minute_set, this.second_set].map(item => this._addZero(item)).join(':')
  }

  _addZero(n) {
    return parseInt(n) < 10 ? ('0' + n) : n;
  }

  _getProgress() {

    if(!this.isWorking) {
      return false
    }

    if(this.isPreheating || this.isPreheatingTempArrived) {
      return this._getPreheatingProgress()
    }


    return this._getCountdownProgress()
  }

  _getPreheatingProgress() {
    const currentTemp = this._getCurrentTemp()
    const settingTemp = this._getSettingTemperature()

    if(!currentTemp || !settingTemp) {
      return false
    }

    if(currentTemp < settingTemp) {
      return currentTemp/settingTemp*100 + '%'
    }

    return '100%'
  }

  _getCountdownProgress() {
    const {hideTimeProgress} = this.currentMode.pluginConfig

    if(hideTimeProgress || !this.settingSeconds) {
      return false
    }

    let progress = (this.settingSeconds - this.remainingSeconds)/this.settingSeconds*100;
    return progress.toFixed(2) + '%'
  }

  _getSettingSeconds() {
    return this._getSeconds(this.hour_set, this.minute_set, this.second_set);
  }

  _getRemainingSeconds() {
    return this._getSeconds(this.work_hour, this.work_minute, this.work_second);
  }

  _getSeconds(h, m, s) {
    return h*3600 + m*60 + s
  }

  _showFinishButton() {
    return this.work_status === WORK_STATUS_WORK_FINISH || (this.isPreheatingTempArrived && (!this.settingSeconds && this._isLastStep()));
  }

  _showContinueButton() {

    if(this.isPreheatingTempArrived && (!this._isLastStep() || this.settingSeconds)) {
      return true
    }

    return [WORK_STATUS_PAUSE, WORK_STATUS_PAUSE_C].indexOf(this.work_status) > -1
  }

  _isWorking() {
    return [WORK_STATUS_WORK, WORK_STATUS_PAUSE, WORK_STATUS_PAUSE_C].indexOf(this.work_status) > -1
  }

  _showPauseButton() {

    if(this.isPreheatingTempArrived) {
      return false
    }

    if(this.isSensing) {
      return false
    }

    return [WORK_STATUS_WORK].indexOf(this.work_status) > -1
  }

  _workText() {

    if(this.connecting) {
      return '设备连接中...'
    }


    let workText = null;
    switch(this.work_status) {
      case WORK_STATUS_SAVE_POWER:
        workText = '省电中'
        break
      case WORK_STATUS_STANDBY:
      case WORK_STATUS_WORK_FINISH:
        workText = '待机中'
        break
      case WORK_STATUS_RESERVATION:
        workText = '预约中'
        break
      case WORK_STATUS_WORK:
        workText = this._getWorkDetailText();
        break
      case WORK_STATUS_PAUSE:
      case WORK_STATUS_PAUSE_C:
        workText = '已暂停'
        break
      case WORK_STATUS_THREE:
        workText = '爱心三秒'
        break
      default:
        workText = ''
    }
    return workText
  }

  _getWorkDetailText() {
    if(this.isPreheating) {
      return '预热中'
    }

    if(this.isSensing) {
      return '感应中'
    }

    return '工作中' + this.probeText
  }
}

export default DeviceStatus