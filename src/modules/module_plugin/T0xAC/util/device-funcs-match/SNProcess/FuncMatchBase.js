// import {FuncType, FuncOrder, FuncMetaType} from '../../sn-process/FuncType'
import {SNFuncMatch, FuncCoolFreeDefault, OrderMap, NorthWarmDefault} from '../../sn-process/SnFuncMap'
import Helper from '../../../util/Helper'


export default class FuncMatchBase{
    static getAcFunc(sn, isStandradAPI) {
        let _isStandradAPI = isStandradAPI !== undefined ? isStandradAPI : false;
        let sn5 = this.getDeviceSN5(sn);

        //merge
        let allFunc = this.mergeDefaultFunc();
        // console.log(JSON.stringify(allFunc));
        
        let subType = this.getAcSubType(sn);
        // console.log(subType);
        // FuncMatchBase.FuncCoolFreeDefault = FuncCoolFreeDefault;
        if (subType && (subType == 'COOLFREE' || subType.indexOf('COOLFREE') > -1)) {
          this.FuncDefault = FuncCoolFreeDefault;
        } else if(subType && (subType == 'NORTHWARM' || subType.indexOf('NORTHWARM') > -1)) {
          // this.FuncDefault = NorthWarmDefault;
        }
        let FuncDefault = this.FuncDefault;
        

        //match
        let funcList = Helper.cloneDeep(FuncDefault);
        for(let key in allFunc) {
            if(this.hasString(allFunc[key].sn, sn5)) {
                funcList = allFunc[key].func;
            }
        }

        //extra process
        funcList = this.processExtraFunc(sn, funcList);

        console.log(FuncDefault, "FuncDefault------------");
        // console.log(JSON.stringify(funcList));
        // console.log(sn, this.recomposeFunc(funcList, true));

        return this.recomposeFunc(funcList, _isStandradAPI);
    }

    static getSnOrder(sn,isStandradAPI) {
        let _isStandradAPI = isStandradAPI !== undefined ? isStandradAPI : false;
        let sn5 = this.getDeviceSN5(sn);
        //merge
        // let allFunc = this.mergeDefaultFunc();
        let funcList = [];
        let result = []
        for(let key in this.SNFuncMatch) {
            if(this.hasString(this.SNFuncMatch[key].sn, sn5)) {
                funcList = this.uniqueArr(this.SNFuncMatch[key].func,this.FuncDefault)
            }
        }
        
        for(let i = 0,length = funcList.length; i < length; i++) {            
            if (funcList[i].metaType != 2) {                
                result.push(funcList[i])
            }
        }        
        let btns = this.flatFuncType(result);
        let sortBtns = this.sortArrayByMapRule(btns);
        let defaultBtns = ['ModeControl','LeftRightSwipeWind','UpDownSwipeWind','Show','Sound', 'ElectricHeat', 'AppointmentSwitchOff','AboutDevice'];
        
        return sortBtns.length == 0 ?  defaultBtns : sortBtns; // 默认功能在此配置     
    }

    static sortArrayByMapRule(array,mapRules) {
      let map = OrderMap;

      const result = [];
      const mapIndex = {};
  
      // 将 map 数组中的元素存储到 mapIndex 对象中
      for (let i = 0; i < map.length; i++) {
        mapIndex[map[i]] = i;
      }
  
      // 遍历原始数组，按照规则插入到结果数组中
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (mapIndex.hasOwnProperty(item)) {
          // 如果当前元素在 map 中，则按照 map 中的位置插入到结果数组中
          const index = mapIndex[item];
          result.splice(index, 0, item);
        } else {
          // 如果当前元素不在 map 中，则将其插入到结果数组的末尾
          result.push(item);
        }
      }
  
      return result;
    }

    static getAcSubType(sn) {
        let sn5 = this.getDeviceSN5(sn);
        let subType = null;

        for(let key in this.SNFuncMatch) {
            if(this.hasString(this.SNFuncMatch[key].sn, sn5)) {
                subType = key;
            }
        }
        return subType;
    }

    static mergeDefaultFunc() {
        let result = Helper.cloneDeep(this.SNFuncMatch);

        for(let index in this.SNFuncMatch) {
            Array.prototype.push.apply(result[index].func, this.FuncDefault);
        }

        return result;
    }

    static processExtraFunc(sn, funcList) {
        //format change from {} to []
        let funcListArr = [];
        for(let key in funcList) {
            funcListArr.push(funcList[key]);
        }

        return this.addExtraRule(funcListArr, this.getDeviceSnInfo(sn));
    }    

    /*
    * Extra rule management
    * */
    static addExtraFunc(funcList, func) {
        funcList.push(func);
    }

    static removeExtraFunc(funcList, func) {
        funcList.map((item, index)=>{
            if(item.value === func.value) {
                funcList.splice(index, 1);
            }
        });
    }

    static addExtraRule(funcList, snInfo) {
        // todo override
    }

    /*
    * API Factory
    * return two format of API
    * */
    static recomposeFunc(funcList, isStandardAPI) {
        return this.recurGenerator(this.flatFuncType(funcList), this.recurFlat(this.FuncOrder), isStandardAPI);
    }

    static uniqueArr(arr1,arr2) {
        //合并两个数组
        arr1.push(...arr2)//或者arr1 = [...arr1,...arr2]
        //去重
        let arr3 = Array.from(new Set(arr1))//let arr3 = [...new Set(arr1)]
        // console.log(arr3) 
        return arr3;
    }

    /*
    * flat funcList type item
    * */
    static flatFuncType(_funcList) {
        let funcListFlat = [];
        // console.log(JSON.stringify(this.FuncType));
        for(let index in _funcList) {
            for(let _index in this.FuncType) {
                if(this.FuncType[_index].value === _funcList[index].value) {
                    funcListFlat.push(_index+"");
                }
            }
        }
        return funcListFlat;
    };

    /*
    * flat FuncOrder
    * */
    static recurFlat(funcOrderList) {
        let result = {};
        for(let key in funcOrderList) {
            if ((typeof funcOrderList[key] === 'object') && (!(funcOrderList[key] instanceof Array))) {
                result[key] = this.recurFlat(funcOrderList[key]);
            } else {
                if (funcOrderList[key] instanceof Array) {
                    result[key] = this.flatFuncType(funcOrderList[key]);
                } else {
                    result[key] = funcOrderList[key];
                }
            }
        }
        return result;
    };

    /*
    * generation standard(none standard) api with 'has'(or array format)
    * */
    static recurGenerator(funcListFlat, funcOrderFlat, isStandard) {
        let result = {};
        for(let key in funcOrderFlat) {
            if ((typeof funcOrderFlat[key] === 'object') && (!(funcOrderFlat[key] instanceof Array))) {
                result[key] = this.recurGenerator(funcListFlat, funcOrderFlat[key], isStandard);
            } else {
                if (funcOrderFlat[key] instanceof Array) {
                    let item;

                    if(isStandard) {
                        item = {};

                        funcOrderFlat[key].map((_item) => {
                            if (Helper.inArray(funcListFlat, _item)) {
                                item['has' + _item] = true;

                                //todo for performence
                                //Helper.removeSingleValueFromArray(funcListFlat, _item);
                            } else {
                                item['has' + _item] = false;
                            }
                        });
                    } else {
                        item = [];

                        funcOrderFlat[key].map((_item) => {
                            if (Helper.inArray(funcListFlat, _item)) {
                                item.push(_item);
                            }
                        });
                    }

                    result[key] = item;
                } else {
                    result[key] = funcOrderFlat[key];
                }
            }
        }        
        return result;        
    };

    /*
    * get device sn5 from barcode
    * */
    static getDeviceSN5(sn) {
        let sn5 = "";
        if(sn !== "") {
            if(sn.length === 32) {
                sn5 = sn.substring(12, 17);
            } else if(sn.length === 22) {
                sn5 = sn.substring(6, 11);
            }
        }

        return sn5;
    }

    /*
    * get sn detail info
    * */
    static getDeviceSnInfo(sn) {
        let sn5 = "";
        let snFormat = "";

        //retrieve sn
        if(sn !== "") {
            if(sn.length === 32) {
                snFormat = sn.substring(6, 28);
                sn5 = sn.substring(12, 17);
            } else if(sn.length === 22) {
                snFormat = sn.substring(0, 22);
                sn5 = sn.substring(6, 11);
            }
        }

        //year code map by midea standard
        let barCodeYear = "5678901234ABCDFGHJKLMNPQRSTUVWXYZ";
        let yearCodeMap = {};
        barCodeYear.split("").map((item, index)=>{
            yearCodeMap[item+""] = index + 2015;
        });

        return {
            sn5: sn5,
            snFormat: snFormat,
            version: parseInt(snFormat.substring(0, 1), 16) === 13 ? 0: 1,
            year: yearCodeMap[snFormat.substring(11, 12)+""],
            month: parseInt(snFormat.substring(12, 13)),
            day: parseInt(snFormat.substring(13, 15))
        }
    }

    static hasString(origin, substr) {
        return origin.indexOf(substr) !== -1;
    };

    /***************************************************render doc ***************************************************/
    static renderDoc() {
        let allFunc = this.mergeDefaultFunc();
        let deviceTypeCollection = [];

        for(let index in allFunc) {
            deviceTypeCollection.push(index.replace('_', ''));
        }

        this.drawSeparator("机型统计表 -- 开始");

        let outputData = "";
        deviceTypeCollection.map((item)=>{
            outputData += "空调机型: " + item  + "\n\n";

            outputData += "SN5: \n" + allFunc["_"+item].sn + "\n\n";

            outputData+= "功能: \n";
            for(let index in allFunc["_"+item].func) {
                outputData += "("+allFunc["_"+item].func[index].name + ")\t";
            }

            outputData += "\n\n\n\n\n\n";
        });

        this.drawNewLineItem(outputData);

        this.drawSeparator("机型统计表 -- 结束");

    }

    static drawNewLineItem(item) {
        console.log("\r"+item+"");
    }

    static drawSeparator(title) {
        let dySeparators = function (num) {
            let reuslt = "";
            for(let i = 0; i < num; i++) {
                reuslt += "=";
            }
            return reuslt;
        };

        if(title) {
            console.log("\r"+dySeparators(50)+title+dySeparators(50));
        } else {
            console.log("\r"+dySeparators(50));
        }

    }

    /*************************************************** calculate major device tyoe ***************************************************/
    static calculateMajorDeviceType() {
        console.log("calculateMajorDeviceType");

        let allFunc = this.mergeDefaultFunc();

        let funcIndexSet = [];
        let funcNameSetAll = [];
        let funcNameSetHardwareAll = [];
        let funcNameSet = [];
        let allFuncArr = [];

        for(let key in allFunc) {
            allFunc[key].func.map((item)=>{
                if(!Helper.inArray(funcIndexSet, item.value)) {
                    funcIndexSet.push(item.value);
                    funcNameSetAll.push(item.name);

                    if(item.metaType === FuncMetaType.HardDriver) {
                        funcNameSetHardwareAll.push(item.name);
                    }
                }

                if(!Helper.inArray(funcNameSet, item.name)) {
                    funcNameSet.push(item.name);
                }
            });

            allFuncArr.push({
                name: key,
                sn: allFunc[key].sn,
                func: allFunc[key].func,
                funcIndex: this.flatFuncIndex(allFunc[key].func),
                funcNum: allFunc[key].func.length
            });
        }

        allFuncArr.sort(function(a,b){
            return b.funcNum - a.funcNum;
        });

        // console.log(Helper.getDifference(funcNameSetAll, funcNameSet));

        console.log("所有功能", funcNameSetAll);
        console.log("所有电控功能", funcNameSetHardwareAll);
        console.log("全机型数据结构", allFuncArr);

        //todo single loop
        // let allFuncArrOrigin = Helper.cloneDeep(allFuncArr);
        // startChoice = allFuncArr[0].func;
        // let numMax  = 0;
        // let maxIndex = -999;
        // for(let i = 1; i < allFuncArr.length; i++) {
        //     // console.log(this.getUnionSet(startChoice, allFuncArr[i].func))
        //     let num = this.getUnionSet(startChoice, allFuncArr[i].func).size;
        //     if(num > numMax) {
        //         numMax = num;
        //         maxIndex = i;
        //     }
        // }
        //
        // startChoice = [...this.getUnionSet(startChoice, allFuncArr[maxIndex].func)];
        // console.log(numMax, maxIndex, startChoice, startChoice.length);

        let numAllFunc = funcIndexSet.length;
        let allFuncArrLength = allFuncArr.length;
        let startChoice = allFuncArr[0].funcIndex;
        let bestChoiceDevice = [allFuncArr[0]];

        for(let j = 0; j < allFuncArrLength - 1; j++) {
            let numMax  = 0;
            let maxIndex = -999;
            for(let i = 1; i < allFuncArr.length; i++) {
                // console.log(this.getUnionSet(startChoice, allFuncArr[i].func))
                let num = this.getUnionSet(startChoice, allFuncArr[i].funcIndex).size;
                if(num > numMax) {
                    numMax = num;
                    maxIndex = i;
                }
            }

            allFuncArr[maxIndex].extra = this.getFuncsInfoByIndexs(this.getDifferenceFunc(startChoice, allFuncArr[maxIndex].funcIndex));

            startChoice = [...this.getUnionSet(startChoice, allFuncArr[maxIndex].funcIndex)];

            bestChoiceDevice.push(allFuncArr[maxIndex]);

            allFuncArr.splice(maxIndex, 1);

            // console.log(numMax, maxIndex, startChoice, startChoice.length, bestChoiceDevice);

            if(startChoice.length === numAllFunc) break;
        }

        console.log("------------------贪心组合------------------", bestChoiceDevice);

        return {
            funcNameSetAll: funcNameSetAll,
            funcNameSetHardwareAll: funcNameSetHardwareAll,
            allFuncArr: allFuncArr,
            bestChoiceDevice: bestChoiceDevice
        }
    }

    static getUnionSet(a, b) {
        return new Set(a.concat(b));
    }

    static getDifferenceFunc(a, b) {
        let result = [];

        b.map((bItem)=>{
            if(!Helper.inArray(a, bItem)) {
                result.push(bItem);
            }
        });

        return result;
    }

    static flatFuncIndex(func) {
        let result = [];
        func.map((item)=>{
            result.push(item.value);
        });

        return result;
    }

    static getFuncsInfoByIndexs(indexs) {
        let result = [];

        indexs.map((index)=>{
            for(let key in this.FuncType) {
                if(this.FuncType[key].value === index) {
                    result.push(this.FuncType[key]);
                    break;
                }
            }
        });

        return result;
    }
}
FuncMatchBase.SNFuncMatch = {}
FuncMatchBase.FuncDefault = {}
// FuncMatchBase.FuncCoolFreeDefault = {}
FuncMatchBase.FuncOrder = {}
FuncMatchBase.FuncMetaType = {}
FuncMatchBase.FuncType = {}