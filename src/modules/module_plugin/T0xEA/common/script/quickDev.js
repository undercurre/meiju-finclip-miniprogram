
const quickDev = {
    quickDevJson2Local(quickDevJson) {
        let local_json = {
            model: quickDevJson.productName,
            subType: parseInt(quickDevJson.productModelNumber),
            para: []
        };

        try {
          for (let i = 0; i < quickDevJson.properties.length; i++) {
            let prop = quickDevJson.properties[i];
            let codeName = prop.settings[0].codeName;
            if (codeName == 'hasSelfAdjustSwitch') {
              local_json['hasSelfAdjustSwitch'] = prop.settings[0].properties.value;
            } else if (codeName == 'canBindSensor') {
              local_json['canBindSensor'] = prop.settings[0].properties.value;
            } else if (codeName == 'hasNoDisturbSwitch') {
              local_json['hasNoDisturbSwitch'] = prop.settings[0].properties.value;
            }
          }
        }catch (e) {
        }

        for (let i=0; i<quickDevJson.functions.length; i++) {
            let para_item = {
                key: null,
                name: null,
                valueList: null,
                displayList: null,
                isUseBindList: false,
                bindList: null
            }

            let settings = quickDevJson.functions[i].settings;
            let sub_params = null;
            for(let j=0; j<settings.length; j++) {
                if(settings[j].codeName === "funtionParams") {
                    let properties = settings[j].properties;
                    para_item.key = properties.key;
                    para_item.name = properties.name;
                    para_item.valueList = this.jsonArray2Array(properties.valueList);
                    para_item.displayList = this.jsonArray2Array(properties.displayList);
                    para_item.isUseBindList = properties.isUseBindList;
                    para_item.bindList = this.jsonArray2Array(properties.bindList);
                    if(properties.isControlAllTime !== undefined) {
                        para_item.isControlAllTime = properties.isControlAllTime;
                    }
                    if(properties.defaultShakeAngle) {
                      para_item.defaultShakeAngle = properties.defaultShakeAngle;
                    }
                }
                else if(settings[j].codeName === "subFuntionParams") {
                    let properties = settings[j].properties;
                    sub_params = {
                        distKey: properties.distKey,
                        list: []
                    }
                    for (let k=0; k<properties.FBList.length; k++) {
                        let list_item = {
                            bindMode: properties.FBList[k].bindMode,
                            valueList: this.arrayString2Array(properties.FBList[k].valueList),
                            displayList: this.arrayString2Array(properties.FBList[k].displayList),
                        }
                        sub_params.list.push(list_item);
                    }
                }
            }
            if(sub_params != null) {
                if(sub_params.distKey === "valueList") {
                    para_item.valueList = sub_params.list;
                } else if(sub_params.distKey === "displayList") {
                    para_item.displayList = sub_params.list;
                } else if(sub_params.distKey === "bindList") {
                    para_item.bindList = sub_params.list;
                }
            }
            local_json.para.push(para_item);
        }
        return local_json;
    },
    jsonArray2Array(json_array) {
        if(json_array.length < 0) return null;
        else if(json_array.length === 1) {
            if(json_array[0].item === "") return null;
        }
        let result = [];
        for (let i=0; i<json_array.length; i++) {
            let toNum = parseInt(json_array[i].item);
            if(isNaN(toNum)) {
                result.push(json_array[i].item);
            } else {
                result.push(toNum);
            }
        }
        return result;
    },
    arrayString2Array(array_string) {
        if(array_string === undefined || array_string === null || array_string === "") return null;
        let result = [];
        let array = array_string.split(",");
        for (let i=0; i<array.length; i++) {
            let toNum = parseInt(array[i]);
            if(isNaN(toNum)) {
                result.push(array[i]);
            } else {
                result.push(toNum);
            }
        }
        return result;
    }
}
export default quickDev
