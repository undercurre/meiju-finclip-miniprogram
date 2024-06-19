import {FuncType} from '../sn-process/FuncType'
import FuncMatchBase from './SNProcess/FuncMatchBase'
export default class SnProcess extends  FuncMatchBase {    
    constructor (funcType) {
        super();
        this.FuncType = funcType
    }
    static addExtraRule(funcList, snInfo) {
        // nativeService.alert(SnProcess.getAcSubType(snInfo.snFormat));
        //todo override
        // console.log("this.getDeviceSnInfo(sn)", snInfo);
        // console.log(funcList);
        for(let i = 0; i < funcList.length; i++) {
            if(funcList[i].luaKey==='self_clean'){
                if(snInfo.version === 0){
                    this.removeExtraFunc(funcList, FuncType.SelfCleaning);
                }else if(parseInt(snInfo.year)>=2017){
                    // nativeService.alert("2017");
                }else{
                     if(parseInt(snInfo.year)===2016&&parseInt(snInfo.month)>=9){
                         // nativeService.alert("2016");
                     }else{
                         this.removeExtraFunc(funcList, FuncType.SelfCleaning);
                     }
                }
            }
        }
        //YA1级日期判断有无0.5控制和舒省功能
        for(let i = 0; i < funcList.length; i++) {
            if(funcList[i].luaKey==='comfort_power_save'&&(SnProcess.getAcSubType(snInfo.snFormat))==='_YA'){
                if(snInfo.version === 0){
                    this.removeExtraFunc(funcList, FuncType.CSEco);
                    this.removeExtraFunc(funcList, FuncType.Dot5Support);
                }else if(parseInt(snInfo.year)<=2017&&(snInfo.month===9&&snInfo.day<6||snInfo.month<9)){
                    this.removeExtraFunc(funcList, FuncType.CSEco);
                    this.removeExtraFunc(funcList, FuncType.Dot5Support);
                    // nativeService.alert("2017");
                }
            }
        }
        //YA3级日期判断有无0.5控制
        for(let i = 0; i < funcList.length; i++) {
            if(funcList[i].luaKey==='comfort_power_save'&&(SnProcess.getAcSubType(snInfo.snFormat))==='_YAB3'){
                if(snInfo.version === 0){
                    this.removeExtraFunc(funcList, FuncType.Dot5Support);
                }else if(parseInt(snInfo.year)<=2017&&(snInfo.month===9&&snInfo.day<6||snInfo.month<9)){
                    this.removeExtraFunc(funcList, FuncType.Dot5Support);
                    // nativeService.alert("2017");
                }
            }
        }
        //YA日期判断有无0.5控制和舒省功能
        for(let i = 0; i < funcList.length; i++) {
            if(funcList[i].luaKey==='comfort_power_save'&&(SnProcess.getAcSubType(snInfo.snFormat))==='_26YA'){
                if(snInfo.version === 0){
                    this.removeExtraFunc(funcList, FuncType.CSEco);
                    this.removeExtraFunc(funcList, FuncType.Dot5Support);
                }else if(parseInt(snInfo.year)<=2017&&(snInfo.month===9&&snInfo.day<30||snInfo.month<9)){
                    this.removeExtraFunc(funcList, FuncType.CSEco);
                    this.removeExtraFunc(funcList, FuncType.Dot5Support);
                    // nativeService.alert("2017");
                }
            }
        }
        //YA样机日期判断有无0.5控制
        for(let i = 0; i < funcList.length; i++) {
            if(funcList[i].luaKey==='comfort_power_save'&&(SnProcess.getAcSubType(snInfo.snFormat))==='_YAB3Z'){
                if(snInfo.version === 0){
                    this.removeExtraFunc(funcList, FuncType.Dot5Support);
                }else if(parseInt(snInfo.year)<2019){
                    this.removeExtraFunc(funcList, FuncType.Dot5Support);
                    // nativeService.alert("2017");
                }
            }
        }
        if((SnProcess.getAcSubType(snInfo.snFormat))===null){
            // nativeService.alert(JSON.stringify(FuncType));
            // Helper.logByTag(funcList, "addExtraFunc");
            this.addExtraFunc(funcList, FuncType.LeftRightSwipeWind);
            this.addExtraFunc(funcList, FuncType.UpDownSwipeWind);
            this.addExtraFunc(funcList, FuncType.NoPolar);
            this.addExtraFunc(funcList, FuncType.newFilterScreen);
            this.addExtraFunc(funcList, FuncType.OuterDoorDisplay);
        }

        if((SnProcess.getAcSubType(snInfo.snFormat))==='_customPH200'){
            this.removeExtraFunc(funcList, FuncType.ElectricHeat);
            this.removeExtraFunc(funcList, FuncType.SelfCleaning);
        }
        if((SnProcess.getAcSubType(snInfo.snFormat))==='_customPH201'){
            this.removeExtraFunc(funcList, FuncType.ElectricHeat);
            this.removeExtraFunc(funcList, FuncType.MyAkeyControl);
        }
        if((SnProcess.getAcSubType(snInfo.snFormat))==='_movePT'){
            this.removeExtraFunc(funcList, FuncType.ElectricHeat);
            this.removeExtraFunc(funcList, FuncType.Dry);
            this.removeExtraFunc(funcList, FuncType.Sound);
        }
        // this.addExtraFunc(funcList, FuncType.VideoDescription);
        // this.removeExtraFunc(funcList, FuncType.VideoDescription);

        //todo for AirQualityReport
        // let airSensors = [FuncType.PurifyPM.value, FuncType.HumidityDisplay.value];
        // let addAirQualityReportFunc = false;
        // for(let i = 0; i < funcList.length; i++) {
        //     if(Helper.inArray(airSensors, funcList[i].value)) {
        //         addAirQualityReportFunc = true;
        //     }
        // }
        // addAirQualityReportFunc && this.addExtraFunc(funcList, FuncType.AirQualityReport);

        return funcList;
    }



}