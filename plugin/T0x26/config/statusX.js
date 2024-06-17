// 解析判断设备的json值

let status = {} // 设备状态json值

function setStatus(json) { //设置设备状态
    status = json
}
function getStatus() {
    return status
}

function isOff() { // 是否模式全关
    if (status.mode == undefined) return true;
    return status.mode == 'close_all' || status.mode == '';
}
function isMainLightEnable() { // 是否照明开启
    if (status.light_mode == undefined) return false;
    return status.light_mode == 'main_light';
}
function isNightLightEnable() { // 是否开启夜灯
    if (status.light_mode == undefined) return false;
    return status.light_mode == 'night_light';
}
function isHeatingEnable() { // 是否开启取暖模式
    if (status.mode == undefined) return false;
    return status.mode.indexOf('heating') != -1
}
function isStrongHeatingEnable() { // 是否强暖
    if (status.mode == undefined || status.heating_temperature == undefined) return false;
    return status.mode.indexOf('heating') != -1 && status.heating_temperature == '55'
}
function isWeakHeatingEnable() {
    if (status.mode == undefined || status.heating_temperature == undefined) return false;
    return status.mode.indexOf('heating') != -1 && status.heating_temperature == '30'
}
function isVentilationEnable() { // 是否换气模式
    if (status.mode == undefined) return false;
    return status.mode.indexOf('ventilation') != -1 || status.mode.indexOf('morning_ventilation') != -1
}
function isDryingEnable() { // 是否干燥模式
    if (status.mode == undefined) return false;
    return status.mode.indexOf('drying') != -1
}
function isBlowingEnable() { // 是否吹风模式
    if (status.mode == undefined) return false;
    return status.mode.indexOf('blowing') != -1
}
function isBathEnable() { // 是否安心沐浴模式
    if (status.mode == undefined) return false;
    return status.mode.indexOf('bath') != -1
}
function isRadarEnable() { // 是否人感(雷达)使能
    if (status.radar_induction_enable == undefined) return false;
    return status.radar_induction_enable === 'on'
}
function windDirection() { // 风向(摆风角度)
    if (isHeatingEnable()) return status.heating_direction;
    if (isDryingEnable()) return status.drying_direction;
    if (isBlowingEnable()) return status.blowing_direction;
    if (isBathEnable()) return status.bath_direction;
    return 0;
}
function isAutoWindDirection() { //是否自动摆风开启
    return windDirection() == 253;
}
function isSupportWindDirection(SN8) { // 设备是型号是否支持风向调节
    if (SN8 == undefined) return false
    return ['57010980', '57010981', '5706674P', '57066720', '5706673R'].includes(SN8);
}
function isSupportDehumidification(SN8) { // 支持自动除湿型号
    if (SN8 == undefined) return false
    return ['5706674P', '57066720'].includes(SN8);
}
function dehumidificationTrigger() { // 自动除湿触发状态
    if (status.dehumidity_trigger == undefined) return false;
    return status.dehumidity_trigger === 'on'
}
function autoDehumidification() { // 自动除湿使能
    if (status.auto_dehumidification == undefined) return false;
    return status.auto_dehumidification === 'on'
}
function dehumidificationTime() { // 自动除湿运行时间
    if (status.dehumidity_time == undefined) return 0;
    return parseInt(status.dehumidity_time)
}
function getThemeColorByStatus(defaultColor = '#7C879B') { // 根据开关机模式获取界面主题颜色
    if (isOff()) {
        if (isMainLightEnable()) return '#FFAA10'
        else if (isNightLightEnable()) return '#6575FF'
        else return '#7C879B'
    } else {
        if (isHeatingEnable()) return '#FF6A4C'
        else if (isBathEnable()) return '#FF8225'
        else if (isBlowingEnable()) return '#29C3FF'
        else if (isVentilationEnable()) return '#24C8AF'
        else if (isDryingEnable()) return '#FFC400'
        else return defaultColor
    }
}

export default {
    setStatus,
    isOff,
    isMainLightEnable,
    isBlowingEnable,
    isVentilationEnable,
    isAutoWindDirection,
    getStatus,
    isNightLightEnable,
    isHeatingEnable,
    isStrongHeatingEnable,
    isWeakHeatingEnable,
    isDryingEnable,
    isBathEnable,
    isRadarEnable,
    windDirection,
    isSupportWindDirection,
    isSupportDehumidification,
    dehumidificationTrigger,
    autoDehumidification,
    dehumidificationTime,
    getThemeColorByStatus
}