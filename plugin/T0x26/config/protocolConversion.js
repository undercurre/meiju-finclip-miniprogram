/**
 * ******* json与设备16进制命令转换 *********
 * 使用json2bin、bin2json进行转换，使用queryCMD生成设备查询命令
 * 目前支持功能：模式、取暖温度、照明、人感、自动除湿、风向、延时使能
 * ****************************************
*/
function json2bin(json) { // json转十六进制
    let messageBody = createMessageBody(48);
    setByte(messageBody, 0, 0x01) // 首位固定0x01

    // 填装命令
    setMode(messageBody, json) //模式
    setHeatingTemperature(messageBody, json) // 取暖温度
    setLightMode(messageBody, json) // 照明
    setRadar(messageBody, json) // 人感
    setDeHumidity(messageBody, json) // 自动除湿
    setWindDirection(messageBody, json) // 风向
    setDelay(messageBody, json) // 延时使能

    let message = createMessage(0x26, 0x02, messageBody);
    let result = convertTo16Str(message)
    console.log('lmn>>>json2bin()::' + result)
    return result;
}
function setMode(body, json) {
    if (json.mode != undefined) {
        setByte(body, 9, 0)
        setByte(body, 13, 0)
        setByte(body, 18, 0)
        setByte(body, 21, 0)
        setByte(body, 26, 0)
        setByte(body, 31, 0)
        if (json.mode.indexOf('heating') != -1) setByte(body, 9, 0x01)
        if (json.mode.indexOf('bath') != -1) setByte(body, 13, 0x01)
        if (json.mode.indexOf('ventilation') != -1) setByte(body, 18, 0x01)
        if (json.mode.indexOf('drying') != -1) setByte(body, 21, 0x01)
        if (json.mode.indexOf('blowing') != -1) setByte(body, 26, 0x01)
        if (json.mode.indexOf('soft_wind') != -1) setByte(body, 31, 0x01)
    }
    if (json.mode_enable != undefined) {
        if (json.mode_enable.indexOf('heating') != -1) setByte(body, 9, 0x01)
        if (json.mode_enable.indexOf('bath') != -1) setByte(body, 13, 0x01)
        if (json.mode_enable.indexOf('ventilation') != -1) setByte(body, 18, 0x01)
        if (json.mode_enable.indexOf('drying') != -1) setByte(body, 21, 0x01)
        if (json.mode_enable.indexOf('blowing') != -1) setByte(body, 26, 0x01)
        if (json.mode_enable.indexOf('soft_wind') != -1) setByte(body, 31, 0x01)
    }
    if (json.mode_close != undefined) {
        if (json.mode_close == 'close_all') {
            setByte(body, 9, 0)
            setByte(body, 13, 0)
            setByte(body, 18, 0)
            setByte(body, 21, 0)
            setByte(body, 26, 0)
            setByte(body, 31, 0)
        } else {
            if (json.mode_close.indexOf('heating') != -1) setByte(body, 9, 0)
            if (json.mode_close.indexOf('bath') != -1) setByte(body, 13, 0)
            if (json.mode_close.indexOf('ventilation') != -1) setByte(body, 18, 0)
            if (json.mode_close.indexOf('drying') != -1) setByte(body, 21, 0)
            if (json.mode_close.indexOf('blowing') != -1) setByte(body, 26, 0)
            if (json.mode_close.indexOf('soft_wind') != -1) setByte(body, 31, 0)
        }
    }
    return body
}
function setHeatingTemperature(body, json) {
    if (json.heating_temperature != undefined) {
        let value  = parseInt(json.heating_temperature)
        setByte(body, 10, value & 0xFF)
    }
    return body
}
function setLightMode(body, json) { // 设置灯光模式
    if (json.light_mode != undefined) {
        if (json.light_mode == 'close_all' || json.light_mode == '') {
            setByte(body, 1, 0)
            setByte(body, 3, 0)
        } else if (json.light_mode == 'main_light') {
            setByte(body, 1, 1)
            setByte(body, 3, 0)
        } else if (json.light_mode == 'night_light') {
            setByte(body, 1, 0)
            setByte(body, 3, 1)
        }
    }
    return body
}
function setRadar(body, json) { // 设置雷达感应(人感)
    if (json.radar_induction_enable != undefined) {
        if (json.radar_induction_enable == 'on') setByte(body, 5, 1)
        else if (json.radar_induction_enable == 'off') setByte(body, 5, 0)
    }
    if (json.radar_induction_closing_time != undefined) {
        let value = parseInt(json.radar_induction_closing_time)
        setByte(body, 6, value & 0xFF)
    }
    return body
}
function setDeHumidity(body, json) { // 设置自动除湿
    if (json.auto_dehumidification != undefined) {
        if (json.auto_dehumidification == 'on') setByte(body, 43, 1)
        else if (json.auto_dehumidification == 'off') setByte(body, 43, 0)
    }
    if (json.dehumidity_time != undefined) {
        let time = parseInt(json.dehumidity_time)
        setByte(body, 45, time & 0xFF)
    }
    return body
}
function setWindDirection(body, json) { // 设置风速
    if (json.heating_direction != undefined) {
        let val = parseInt(json.heating_direction)
        setByte(body, 12, val & 0xFF)
    } else if (json.blowing_direction != undefined) {
        let val = parseInt(json.blowing_direction)
        setByte(body, 28, val & 0xFF)
    } else if (json.drying_direction != undefined) {
        let val = parseInt(json.drying_direction)
        setByte(body, 25, val & 0xFF)
    } else if (json.bath_direction != undefined) {
        let val = parseInt(json.bath_direction)
        setByte(body, 17, val & 0xFF)
    }
    return body
}
function setDelay(body, json) {
    if (json.delay_enable != undefined) {
        if (json.delay_enable == 'on') setByte(body, 29, 1)
        else if (json.delay_enable == 'off') setByte(body, 29, 0)
    }
    return body
}
function bin2json(bin) { // 十六进制转json
    let message = binStr2Array(bin)
    let result = {
        light_mode: "close_all",
        mode: "close_all",
        heating_temperature: "0",
        radar_induction_enable: "off",
        radar_induction_closing_time: "1",
        dehumidity_trigger: 'off',
        auto_dehumidification: 'off',
        dehumidity_time: '0',
        heating_direction: '0',
        blowing_direction: '0',
        drying_direction: '0',
        bath_direction: '0',
        delay_enable: 'off'
    }
    let messageType = getByte(message, 9);
    if(messageType == 0x02 || messageType == 0x03 || messageType == 0x04) {
        let body = message.slice(10, message.length - 1);

        // 解析命令
        analyticsLightMode(body, result) // 照明
        analyticsMode(body, result) // 模式
        analyticsHeatingTemperature(body, result) // 取暖温度
        analyticsRadar(body, result) // 人感
        analyticsDeHumidity(body, result) // 自动除湿
        analyticsDirection(body, result) // 风向
        analyticsDelay(body, result) // 延时使能
    }
    console.log('lmn>>>bin2json()::' + JSON.stringify(result))
    return result
}
function analyticsLightMode(bodyArr, jsonResult) {
    let mainLightOnOff = getByte(bodyArr, 1);
    let nightLightOnOff = getByte(bodyArr, 3);
    if (mainLightOnOff == 0 && nightLightOnOff == 0) jsonResult.light_mode = 'close_all'
    else if (mainLightOnOff == 1 && nightLightOnOff == 0) jsonResult.light_mode = 'main_light'
    else if (mainLightOnOff == 0 && nightLightOnOff == 1) jsonResult.light_mode = 'night_light'
    return jsonResult
}
function analyticsMode(bodyArr, jsonResult) {
    let heatingOnOff = getByte(bodyArr, 9);
    let bathOnOff = getByte(bodyArr, 13);
    let ventilationOnOff = getByte(bodyArr, 18);
    let dryingOnOff = getByte(bodyArr, 21);
    let blowingOnOff = getByte(bodyArr, 26);
    let softWwindOnOff = getByte(bodyArr, 38);

    let modeResult = "close_all"
    let onCnt = heatingOnOff + bathOnOff + ventilationOnOff + dryingOnOff + blowingOnOff + softWwindOnOff
    if (onCnt > 0)  {
        modeResult = ''
        if (heatingOnOff == 1) {
            if (modeResult != '') modeResult = modeResult + ','
            modeResult  = modeResult + 'heating'
        }
        if (bathOnOff == 1) {
            if (modeResult != '') modeResult = modeResult + ','
            modeResult  = modeResult + 'bath'
        }
        if (ventilationOnOff == 1) {
            if (modeResult != '') modeResult = modeResult + ','
            modeResult  = modeResult + 'ventilation'
        }
        if (dryingOnOff == 1) {
            if (modeResult != '') modeResult = modeResult + ','
            modeResult  = modeResult + 'drying'
        }
        if (blowingOnOff == 1) {
            if (modeResult != '') modeResult = modeResult + ','
            modeResult  = modeResult + 'blowing'
        }
        if (softWwindOnOff == 1) {
            if (modeResult != '') modeResult = modeResult + ','
            modeResult  = modeResult + 'soft_wind'
        }
    }
    jsonResult.mode = modeResult
    return jsonResult
}
function analyticsHeatingTemperature(bodyArr, jsonResult) {
    let heatingTemp = getByte(bodyArr, 10);
    jsonResult.heating_temperature = '' + heatingTemp
    return jsonResult
}
function analyticsRadar(bodyArr, jsonResult) {
    let radarOnOff = getByte(bodyArr, 5);
    let radarDelayTime = getByte(bodyArr, 6);
    if (radarOnOff == 1) jsonResult.radar_induction_enable = 'on'
    else jsonResult.radar_induction_enable = 'off'
    jsonResult.radar_induction_closing_time = '' + radarDelayTime
    return jsonResult
}
function analyticsDeHumidity(bodyArr, jsonResult) {
    let deHumStatus = getByte(bodyArr, 47);
    let time = getByte(bodyArr, 49);
    if (deHumStatus == 0) {
        jsonResult.auto_dehumidification = 'off'
        jsonResult.dehumidity_trigger = 'off'
    } else if (deHumStatus == 1) {
        jsonResult.auto_dehumidification = 'on'
        jsonResult.dehumidity_trigger = 'off'
    } else if (deHumStatus == 2) {
        jsonResult.auto_dehumidification = 'on'
        jsonResult.dehumidity_trigger = 'on'
    }
    if (time > 0) {
        jsonResult.dehumidity_time = '' + time
    }
    return jsonResult
}
function analyticsDirection(bodyArr, jsonResult) {
    let heatDirection = getByte(bodyArr, 12);
    if (heatDirection > 0 && heatDirection <= 254) {
        jsonResult.heating_direction = '' + heatDirection
    }
    let blowDirection = getByte(bodyArr, 28);
    if (blowDirection > 0 && blowDirection <= 254) {
        jsonResult.blowing_direction = '' + blowDirection
    }
    let dryDirection = getByte(bodyArr, 25);
    if (dryDirection > 0 && dryDirection <= 254) {
        jsonResult.drying_direction = '' + dryDirection
    }
    let bathDirection = getByte(bodyArr, 17);
    if (bathDirection > 0 && bathDirection <= 254) {
        jsonResult.bath_direction = '' + bathDirection
    }
    return jsonResult
}
function analyticsDelay(bodyArr, jsonResult) {
    let delayEnable = getByte(bodyArr, 29);
    if (delayEnable == 0) {
        jsonResult.delay_enable = 'off'
    } else if (delayEnable == 1) {
        jsonResult.delay_enable = 'on'
    }
    return jsonResult
}
function binStr2Array(str16) { // 16进制字符串转数组
    let byteArray = new Array();
    if (str16 == undefined) return byteArray
    let data = str16;
    for (let i=0; i<data.length; i++) {
        if (i%2 == 0) {
            byteArray[i/2] = parseInt(data.substring(i, i+2), 16);
        }
    }
    return byteArray
}
function queryCMD() { // 查询状态命令
    let messageBody = [0x01];
    let message = createMessage(0x26, 0x03, messageBody);
    let result = convertTo16Str(message)
    console.log('lmn>>>queryCMD()::' + result)
    return result;
}
function convertTo16Str(byteArray) { // 数组转16进制字符串
    let str16 = new Array();
    if(byteArray == undefined) return str16.join('')
    for (let i = 0; i < byteArray.length; i++) {
        if (byteArray[i].toString(16).length == 1) {
            str16.push("0" + byteArray[i].toString(16).toLowerCase());
        } else {
            str16.push(byteArray[i].toString(16).toLowerCase());
        }
    }
    return str16.join('')
}
function setByte(byteArr, index, value) {
    byteArr[index] = value & 0xFF;
    return byteArr;
}
function getByte(byteArr, index) {
    return byteArr[index] & 0xFF;
}
function initBytes(byteArr, value) {
    for(let i=0; i < byteArr.length; i++){
        byteArr[i] = value & 0xFF;
    }
    return byteArr;
}
function createMessageBody(len) {
    let body = new Array(len);
    return initBytes(body, 0xFF);
}
function createMessage(applianceType, messageType, messageBody, applianceProtocolVersion) {
    let applianceId = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    if (applianceProtocolVersion != undefined) {
        applianceId[5] = applianceProtocolVersion & 0xFF;
    }
    let bytesMessage = new Array();
    bytesMessage.push(0xAA);
    if (messageBody == undefined || messageBody.length == 0) {
        bytesMessage.push(0x0A);
    } else {
        bytesMessage.push(0x0A + messageBody.length);
    }
    bytesMessage.push(applianceType);
    bytesMessage = bytesMessage.concat(applianceId);
    bytesMessage.push(messageType);
    if (messageBody == undefined || messageBody.length == 0) {
    } else {
        bytesMessage = bytesMessage.concat(messageBody);
    }
    let sumContent = 0x00;
    if (messageBody == undefined || messageBody.length == 0) {
    } else {
        for (let i=0; i<messageBody.length; i++) {
            sumContent = sumContent + messageBody[i];
        }
    }
    bytesMessage.push( (~(bytesMessage[1] + bytesMessage[2] + bytesMessage[3] + bytesMessage[4] + bytesMessage[5] 
        + bytesMessage[7] + bytesMessage[8] + bytesMessage[9] + sumContent) + 1) & 0xFF);
    return bytesMessage;
}

export default {
    json2bin,
    bin2json,
    queryCMD
}