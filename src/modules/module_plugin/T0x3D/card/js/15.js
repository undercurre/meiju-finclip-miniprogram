export class PluginConfig{
    // 工作开关
    static workSwitch = {
        cancel: 'cancel',       // 待机
        schedule: 'schedule',       // 预约
        work: 'work',       // 工作
        close: 'close',     // 关机
        save: 'save',       // 保存
    }

    // 快开配置功能key
    static apiKey = {
        workStatue: 'workStatus',       // 工作状态
        warmTemp: 'warmTemp',       // 保温温度
        warmTime: 'warmTime',       // 保温时间
        appointTime: 'appointTime', // 预约
    }

    // 快开配置工作状态
    static workStatusCode = {
        standby: 'standby',
        appoint: 'appoint',
        working: 'working',
        keepWarm: 'keepWarm',
        off: 'off',
        error: 'error',
    }

    // 处理错误信息
    static handleErrorMsg(errCode){
        let rtn = '系统提示: '+errCode;
        if(errCode==1306){
            rtn = '设备未响应';
        }
        if(errCode==1307){
            rtn = '设备已离线，请检查网络状态';
        }
        return rtn;
    }

    // 重定向至不支持页面
    static redirectUnSupportDevice(deviceInfo){
        wx.redirectTo({
            url: `/pages/unSupportDevice/unSupportDevice?backTo=/pages/index/index&deviceInfo=` + encodeURIComponent(JSON.stringify(deviceInfo)),
        });
    }

    // 解析快开配置参数
    static quickDevJson2Local(quickDevJson) {
        let local_json = {
            model: quickDevJson.productName,
            subType: parseInt(quickDevJson.productModelNumber),
            functions: [],
            properties: {}
        };

        if(quickDevJson.properties&&quickDevJson.properties.length>0){
            local_json.properties = {};
            quickDevJson.properties.forEach(propertyItem=>{
                if(propertyItem.settings&&propertyItem.settings.length>0){
                    local_json.properties[propertyItem.settings[0].apiKey] = propertyItem.settings[0].properties;
                }
            });
        }

        let functions = [];
        if(quickDevJson.functions&&quickDevJson.functions.length>0){
            quickDevJson.functions.forEach(functionItem=>{
                if(functionItem.settings&&functionItem.settings.length>0){
                    functionItem.settingsData = {};
                    // 检查工作状态
                    functionItem.settings.forEach(settingItem=>{
                        if(settingItem.apiKey==='setWorkTime'){
                            functionItem.expectedCookTime = settingItem.properties.defaultValue||settingItem.properties.value;
                        }
                        functionItem.settingsData[settingItem.apiKey] = settingItem;
                    });
                }
                functions.push(functionItem);
            });
        }
        local_json.functions = functions;

        return local_json;
    }
}
